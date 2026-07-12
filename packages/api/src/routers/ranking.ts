import { db } from "@epoch-48/db";
import {
	continentalBonus,
	epochScore,
	qIndex,
	type TournamentPhaseName,
} from "@epoch-48/epoch-engine";
import { and, eq, inArray } from "drizzle-orm";
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

async function getEpochInternal(year: number): Promise<EpochRow[]> {
	// Get World Cup + Continental tournaments for this year
	const worldCup = await db.query.tournaments.findFirst({
		where: (t) => and(eq(t.year, year), eq(t.type, "WORLD_CUP")),
	});

	const continentalTournaments = await db.query.tournaments.findMany({
		where: (t) => and(eq(t.year, year), eq(t.type, "CONTINENTAL")),
	});

	const tournamentIds = [
		worldCup?.id,
		...continentalTournaments.map((t) => t.id),
	].filter(Boolean) as number[];

	if (tournamentIds.length === 0) {
		return [];
	}

	// Fetch performances for Tier 1 nations
	const performancesRows = await db.query.performances.findMany({
		where: (p) => inArray(p.tournamentId, tournamentIds),
		with: {
			nation: true,
			tournament: true,
		},
	});

	// Fetch FIFA rankings for this year
	const fifaRankingRows = await db.query.fifaRankings.findMany({
		where: (f) => eq(f.year, year),
		with: {
			nation: true,
		},
	});

	// Build lookup map: nationId -> fifaRank
	const fifaRankMap = new Map<number, number>();
	for (const row of fifaRankingRows) {
		fifaRankMap.set(row.nationId, row.officialRank);
	}

	// Build set of nation IDs that have performances (Tier 1)
	const tier1NationIds = new Set(performancesRows.map((p) => p.nationId));

	// Compute previous epoch ranks for historical delta
	const prevYear = year - 1;
	let previousRankMap: Map<string, number> | null = null;
	if (prevYear >= 2014) {
		const prevEpoch = await getEpochInternal(prevYear);
		previousRankMap = new Map(prevEpoch.map((r) => [r.nation.code, r.rank]));
	}

	// --- Tier 1: Nations with World Cup / Continental performances ---
	const tier1Results: EpochRow[] = performancesRows.map((perf) => {
		const nation = perf.nation;
		const fifaRank = fifaRankMap.get(nation.id) ?? null;

		const score = epochScore({
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
		});

		const cBonus = continentalBonus(
			{
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
			},
			0.01,
		);

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
			0, // assigned later after sorting
			prevRank,
			{
				matchesPlayed: perf.matchesPlayed,
				pointsGained: perf.pointsGained,
				goalsFor: perf.goalsFor,
				goalsDiff: perf.goalsDiff,
				yellowCards: perf.yellowCards,
				redCards: perf.redCards,
				continentalBonus: cBonus || null,
				qualifier: null,
			},
		);
	});

	// Sort Tier 1 by score desc, then fifaRank asc as tiebreaker
	tier1Results.sort((a, b) => {
		if (b.score !== a.score) return b.score - a.score;
		if (a.fifaRank === null && b.fifaRank === null) return 0;
		if (a.fifaRank === null) return 1;
		if (b.fifaRank === null) return -1;
		return a.fifaRank - b.fifaRank;
	});

	// Assign ranks for Tier 1
	tier1Results.forEach((r, i) => {
		r.rank = i + 1;
	});

	// --- Tier 2: Nations with FIFA rankings but no World Cup/Continental performance ---
	const tier2Nations = fifaRankingRows.filter(
		(fr) => !tier1NationIds.has(fr.nationId),
	);

	// Fetch qualifier tournaments for this year
	const qualifierTournaments = await db.query.tournaments.findMany({
		where: (t) => and(eq(t.year, year), eq(t.type, "QUALIFIERS")),
	});
	const qualifierTournamentIds = qualifierTournaments.map((t) => t.id);

	const tier2Results: EpochRow[] = [];

	for (const fr of tier2Nations) {
		const nation = fr.nation;
		const prevRank = previousRankMap?.get(nation.code) ?? null;

		// Look for qualifier performance
		let qualifierPerf = null;
		if (qualifierTournamentIds.length > 0) {
			const qPerfs = await db.query.performances.findMany({
				where: (p) =>
					and(
						eq(p.nationId, fr.nationId),
						inArray(p.tournamentId, qualifierTournamentIds),
					),
			});
			if (qPerfs.length > 0) {
				qualifierPerf = qPerfs[0];
			}
		}

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
				nation.id,
				nation.name,
				nation.code,
				nation.flag,
				nation.confederation,
				2,
				"Qualifiers",
				score,
				fr.officialRank,
				0, // assigned later after sorting
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

	// Sort Tier 2 by score desc, then fifaRank asc
	tier2Results.sort((a, b) => {
		if (b.score !== a.score) return b.score - a.score;
		if (a.fifaRank === null && b.fifaRank === null) return 0;
		if (a.fifaRank === null) return 1;
		if (b.fifaRank === null) return -1;
		return a.fifaRank - b.fifaRank;
	});

	// Assign ranks for Tier 2 (continuing from Tier 1)
	const tier1Count = tier1Results.length;
	tier2Results.forEach((r, i) => {
		r.rank = tier1Count + i + 1;
	});

	// Recalculate fifaDelta and historicalDelta after rank assignment
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

	listEpochs: publicProcedure.query(async (): Promise<number[]> => {
		const tournamentsRows = await db.query.tournaments.findMany({
			where: (t) => eq(t.isCompleted, true),
			columns: { year: true },
		});
		const years = [...new Set(tournamentsRows.map((t) => t.year))].sort(
			(a, b) => b - a,
		);
		return years;
	}),
});
