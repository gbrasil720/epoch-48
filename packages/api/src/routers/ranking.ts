import { db } from "@epoch-48/db";
import {
	computeCFactor,
	continentalBonus,
	epochScore,
	qIndex,
	TournamentPhaseName,
	type EpochScoreProps,
} from "@epoch-48/epoch-engine";
import { and, eq, inArray, lt } from "drizzle-orm";
import { z } from "zod";
import { publicProcedure, router } from "../index";

export type EpochRow = {
	rank: number;
	nation: {
		name: string;
		code: string;
		flag: string | null;
		confederation: string;
	};
	tier: 1 | 2;
	phase: string;
	score: number;
	fifaRank: number | null;
	fifaDelta: number | null;
	previousEpochRank: number | null;
	historicalDelta: number | null;
	stats: {
		matchesPlayed: number;
		pointsGained: number;
		goalsFor: number;
		goalsDiff: number;
		yellowCards: number;
		redCards: number;
		continentalBonus: number | null;
		qualifier: {
			pointsEarned: number;
			maxPossiblePoints: number;
		} | null;
	};
};

type PerfWithNation = {
	nationId: number;
	eliminationPhase: string;
	matchesPlayed: number;
	pointsGained: number;
	goalsFor: number;
	goalsDiff: number;
	yellowCards: number;
	redCards: number;
	maxPossiblePoints: number | null;
	nation: {
		id: number;
		name: string;
		code: string;
		flag: string | null;
		confederation: string | null;
	};
};

function toEpochScoreProps(perf: {
	eliminationPhase: string;
	matchesPlayed: number;
	pointsGained: number;
	goalsFor: number;
	goalsDiff: number;
	yellowCards: number;
	redCards: number;
}): EpochScoreProps {
	return {
		tournamentPhase: {
			name: perf.eliminationPhase as TournamentPhaseName,
		},
		pointsGained: perf.pointsGained,
		gamesPlayed: perf.matchesPlayed,
		goalsDiff: perf.goalsDiff,
		goalsFor: perf.goalsFor,
		cardsReceived: [
			{ color: "yellow" as const, count: perf.yellowCards },
			{ color: "red" as const, count: perf.redCards },
		],
	};
}

function buildEpochRow(
	_nationId: number,
	nationName: string,
	nationCode: string,
	nationFlag: string | null,
	nationConfederation: string | null,
	tier: 1 | 2,
	phase: string,
	score: number,
	fifaRank: number | null,
	rank: number,
	previousEpochRank: number | null,
	stats: EpochRow["stats"],
): EpochRow {
	return {
		rank,
		nation: {
			name: nationName,
			code: nationCode,
			flag: nationFlag,
			confederation: nationConfederation ?? "",
		},
		tier,
		phase,
		score,
		fifaRank,
		fifaDelta: fifaRank !== null ? fifaRank - rank : null,
		previousEpochRank,
		historicalDelta:
			previousEpochRank !== null ? previousEpochRank - rank : null,
		stats,
	};
}

function advancedPastGroupStage(eliminationPhase: string): boolean {
	return eliminationPhase !== TournamentPhaseName.GROUP_STAGE;
}

/**
 * Build per-confederation C-Factor from World Cup results:
 * C_f = (nations past group stage) / (nations at WC) for that confederation.
 */
function buildCFactorByConfederation(
	wcPerformances: PerfWithNation[],
): Map<string, number> {
	const totals = new Map<string, { advanced: number; total: number }>();

	for (const perf of wcPerformances) {
		const confed = perf.nation.confederation?.trim() || "UNKNOWN";
		const entry = totals.get(confed) ?? { advanced: 0, total: 0 };
		entry.total += 1;
		if (advancedPastGroupStage(perf.eliminationPhase)) {
			entry.advanced += 1;
		}
		totals.set(confed, entry);
	}

	const factors = new Map<string, number>();
	for (const [confed, { advanced, total }] of totals) {
		factors.set(confed, computeCFactor(advanced, total));
	}
	return factors;
}

async function getPreviousWorldCupYear(
	year: number,
): Promise<number | null> {
	const prevCups = await db.query.tournaments.findMany({
		where: (t) => and(eq(t.type, "WORLD_CUP"), lt(t.year, year)),
		columns: { year: true },
	});
	if (prevCups.length === 0) return null;
	return Math.max(...prevCups.map((t) => t.year));
}

async function getEpochInternal(year: number): Promise<EpochRow[]> {
	// 1. World Cup for this epoch year
	const worldCup = await db.query.tournaments.findFirst({
		where: (t) => and(eq(t.year, year), eq(t.type, "WORLD_CUP")),
	});

	if (!worldCup) {
		return [];
	}

	// 2. Tier 1 base: WC performances only (one row per nation)
	const wcPerformances = (await db.query.performances.findMany({
		where: (p) => eq(p.tournamentId, worldCup.id),
		with: {
			nation: true,
			tournament: true,
		},
	})) as PerfWithNation[];

	// 3. Continental tournaments for mid-cycle bonus (any year in the cycle
	//    ending at this WC — previous WC exclusive through current year)
	const previousWcYear = await getPreviousWorldCupYear(year);
	const cycleStart = previousWcYear ?? year - 4;

	// Continental tournaments in the open cycle (after previous WC, through this WC year)
	const continentalTournaments = await db.query.tournaments.findMany({
		where: (t) => eq(t.type, "CONTINENTAL"),
	});
	const cycleContinentalIds = continentalTournaments
		.filter((t) => t.year > cycleStart && t.year <= year)
		.map((t) => t.id);

	const continentalByNationId = new Map<number, PerfWithNation>();
	if (cycleContinentalIds.length > 0) {
		const continentalPerfs = (await db.query.performances.findMany({
			where: (p) => inArray(p.tournamentId, cycleContinentalIds),
			with: {
				nation: true,
				tournament: true,
			},
		})) as PerfWithNation[];

		// Prefer the most recent continental performance per nation if multiple
		for (const perf of continentalPerfs) {
			const existing = continentalByNationId.get(perf.nationId);
			if (!existing) {
				continentalByNationId.set(perf.nationId, perf);
			}
		}
	}

	// 4. FIFA rankings
	const fifaRankingRows = await db.query.fifaRankings.findMany({
		where: (f) => eq(f.year, year),
		with: {
			nation: true,
		},
	});
	const fifaRankMap = new Map<number, number>();
	for (const row of fifaRankingRows) {
		fifaRankMap.set(row.nationId, row.officialRank);
	}

	// 5. C-Factors from WC group-stage outcomes
	const cFactorByConfed = buildCFactorByConfederation(wcPerformances);

	// 6. Historical ranks from previous World Cup epoch
	let previousRankMap: Map<string, number> | null = null;
	if (previousWcYear !== null) {
		const prevEpoch = await getEpochInternal(previousWcYear);
		previousRankMap = new Map(prevEpoch.map((r) => [r.nation.code, r.rank]));
	}

	// --- Tier 1: one row per WC nation ---
	const tier1NationIds = new Set(wcPerformances.map((p) => p.nationId));
	const tier1Results: EpochRow[] = wcPerformances.map((perf) => {
		const nation = perf.nation;
		const fifaRank = fifaRankMap.get(nation.id) ?? null;
		const confed = nation.confederation?.trim() || "UNKNOWN";
		const cFactor = cFactorByConfed.get(confed) ?? 0;

		const wcProps = toEpochScoreProps(perf);

		let bc = 0;
		const contPerf = continentalByNationId.get(nation.id);
		if (contPerf) {
			bc = continentalBonus(toEpochScoreProps(contPerf), cFactor);
		}

		const score = epochScore(wcProps, bc);
		const prevRank = previousRankMap?.get(nation.code) ?? null;

		return buildEpochRow(
			nation.id,
			nation.name,
			nation.code,
			nation.flag,
			nation.confederation,
			1,
			perf.eliminationPhase,
			score,
			fifaRank,
			0,
			prevRank,
			{
				matchesPlayed: perf.matchesPlayed,
				pointsGained: perf.pointsGained,
				goalsFor: perf.goalsFor,
				goalsDiff: perf.goalsDiff,
				yellowCards: perf.yellowCards,
				redCards: perf.redCards,
				continentalBonus: bc || null,
				qualifier: null,
			},
		);
	});

	tier1Results.sort((a, b) => {
		if (b.score !== a.score) return b.score - a.score;
		if (a.fifaRank === null && b.fifaRank === null) return 0;
		if (a.fifaRank === null) return 1;
		if (b.fifaRank === null) return -1;
		return a.fifaRank - b.fifaRank;
	});

	tier1Results.forEach((r, i) => {
		r.rank = i + 1;
	});

	// --- Tier 2: non-WC nations (FIFA-listed without WC, scored via Q-Index) ---
	const tier2Candidates = fifaRankingRows.filter(
		(fr) => !tier1NationIds.has(fr.nationId),
	);

	const qualifierTournaments = await db.query.tournaments.findMany({
		where: (t) => and(eq(t.year, year), eq(t.type, "QUALIFIERS")),
	});
	// Also include qualifiers from the cycle leading into this WC
	const allQualifierTournaments = await db.query.tournaments.findMany({
		where: (t) => eq(t.type, "QUALIFIERS"),
	});
	const qualifierTournamentIds = [
		...new Set([
			...qualifierTournaments.map((t) => t.id),
			...allQualifierTournaments
				.filter((t) => t.year > cycleStart && t.year <= year)
				.map((t) => t.id),
		]),
	];

	const qualifierByNationId = new Map<
		number,
		{
			pointsGained: number;
			maxPossiblePoints: number | null;
			goalsDiff: number;
			matchesPlayed: number;
			goalsFor: number;
			yellowCards: number;
			redCards: number;
		}
	>();
	if (qualifierTournamentIds.length > 0) {
		const qPerfs = await db.query.performances.findMany({
			where: (p) => inArray(p.tournamentId, qualifierTournamentIds),
		});
		for (const qp of qPerfs) {
			if (!qualifierByNationId.has(qp.nationId)) {
				qualifierByNationId.set(qp.nationId, qp);
			}
		}
	}

	const tier2Results: EpochRow[] = [];

	// Include FIFA-listed non-WC nations, plus any qualifier-only nations not in FIFA table
	const tier2NationIds = new Set(tier2Candidates.map((fr) => fr.nationId));
	for (const nationId of qualifierByNationId.keys()) {
		if (!tier1NationIds.has(nationId)) {
			tier2NationIds.add(nationId);
		}
	}

	// Build nation lookup for qualifier-only nations
	const extraNationIds = [...tier2NationIds].filter(
		(id) => !tier2Candidates.some((fr) => fr.nationId === id),
	);
	const extraNations =
		extraNationIds.length > 0
			? await db.query.nations.findMany({
					where: (n) => inArray(n.id, extraNationIds),
				})
			: [];
	const nationById = new Map(
		[
			...tier2Candidates.map((fr) => [fr.nationId, fr.nation] as const),
			...extraNations.map((n) => [n.id, n] as const),
		],
	);

	for (const nationId of tier2NationIds) {
		const nation = nationById.get(nationId);
		if (!nation) continue;

		const fifaRank = fifaRankMap.get(nationId) ?? null;
		const prevRank = previousRankMap?.get(nation.code) ?? null;
		const qualifierPerf = qualifierByNationId.get(nationId) ?? null;

		let score = 0;
		let qualifierStats: {
			pointsEarned: number;
			maxPossiblePoints: number;
		} | null = null;

		if (qualifierPerf) {
			const qStats = {
				pointsEarned: qualifierPerf.pointsGained,
				maxPossiblePoints: qualifierPerf.maxPossiblePoints ?? 0,
				goalsDiff: qualifierPerf.goalsDiff,
				matchesPlayed: qualifierPerf.matchesPlayed,
			};
			score = qIndex(qStats);
			qualifierStats = {
				pointsEarned: qStats.pointsEarned,
				maxPossiblePoints: qStats.maxPossiblePoints,
			};
		}

		tier2Results.push(
			buildEpochRow(
				nationId,
				nation.name,
				nation.code,
				nation.flag,
				nation.confederation,
				2,
				"Qualifiers",
				score,
				fifaRank,
				0,
				prevRank,
				{
					matchesPlayed: qualifierPerf?.matchesPlayed ?? 0,
					pointsGained: qualifierPerf?.pointsGained ?? 0,
					goalsFor: qualifierPerf?.goalsFor ?? 0,
					goalsDiff: qualifierPerf?.goalsDiff ?? 0,
					yellowCards: qualifierPerf?.yellowCards ?? 0,
					redCards: qualifierPerf?.redCards ?? 0,
					continentalBonus: null,
					qualifier: qualifierStats,
				},
			),
		);
	}

	tier2Results.sort((a, b) => {
		if (b.score !== a.score) return b.score - a.score;
		if (a.fifaRank === null && b.fifaRank === null) return 0;
		if (a.fifaRank === null) return 1;
		if (b.fifaRank === null) return -1;
		return a.fifaRank - b.fifaRank;
	});

	const tier1Count = tier1Results.length;
	tier2Results.forEach((r, i) => {
		r.rank = tier1Count + i + 1;
	});

	// Recalculate deltas after final rank assignment
	for (const r of [...tier1Results, ...tier2Results]) {
		r.fifaDelta = r.fifaRank !== null ? r.fifaRank - r.rank : null;
		r.historicalDelta =
			r.previousEpochRank !== null ? r.previousEpochRank - r.rank : null;
	}

	return [...tier1Results, ...tier2Results];
}

export const rankingRouter = router({
	getEpoch: publicProcedure
		.input(z.object({ year: z.number() }))
		.query(async ({ input }): Promise<EpochRow[]> => {
			return getEpochInternal(input.year);
		}),

	getTop: publicProcedure
		.input(
			z.object({ year: z.number().optional(), limit: z.number().optional() }),
		)
		.query(async ({ input }): Promise<EpochRow[]> => {
			const year = input.year ?? 2022;
			const limit = input.limit ?? 10;
			const all = await getEpochInternal(year);
			return all.slice(0, limit);
		}),

	listEpochs: publicProcedure.query(async (): Promise<number[]> => {
		const tournamentsRows = await db.query.tournaments.findMany({
			where: (t) => and(eq(t.type, "WORLD_CUP"), eq(t.isCompleted, true)),
			columns: { year: true },
		});
		const years = [...new Set(tournamentsRows.map((t) => t.year))].sort(
			(a, b) => b - a,
		);
		return years;
	}),
});
