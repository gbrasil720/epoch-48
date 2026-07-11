import { z } from "zod";
import { db } from "@epoch-48/db";
import { epochScore, TournamentPhaseName } from "@epoch-48/epoch-engine";
import { publicProcedure, router } from "../index";

export const rankingRouter = router({
	getEpoch: publicProcedure
		.input(z.object({ year: z.number() }))
		.query(async ({ input }) => {
			const { year } = input;

			// Get the World Cup tournament for the given year
			const tournament = await db.query.tournaments.findFirst({
				where: (t, { and, eq }) =>
					and(eq(t.year, year), eq(t.type, "WORLD_CUP")),
			});

			if (!tournament) {
				return [];
			}

			// Fetch all performances for this tournament joined with nations
			const performancesRows = await db.query.performances.findMany({
				where: (p, { eq }) => eq(p.tournamentId, tournament.id),
				with: {
					nation: true,
				},
			});

			// Fetch FIFA rankings for the same year
			const fifaRankingRows = await db.query.fifaRankings.findMany({
				where: (f, { eq }) => eq(f.year, year),
			});

			// Build a lookup map: nationId -> fifaRank
			const fifaRankMap = new Map<number, number>();
			for (const row of fifaRankingRows) {
				fifaRankMap.set(row.nationId, row.officialRank);
			}

			// Calculate epoch scores
			const results = performancesRows.map((perf) => {
				const score = epochScore({
					tournamentPhase: { name: perf.eliminationPhase as TournamentPhaseName },
					pointsGained: perf.pointsGained,
					gamesPlayed: perf.matchesPlayed,
					goalsDiff: perf.goalsDiff,
					goalsFor: perf.goalsFor,
					cardsReceived: [
						{ color: "yellow" as const, count: perf.yellowCards },
						{ color: "red" as const, count: perf.redCards },
					],
				});

				return {
					rank: 0,
					nationId: perf.nation.id,
					nationName: perf.nation.name,
					nationCode: perf.nation.code,
					epochPts: score,
					fifaRank: fifaRankMap.get(perf.nation.id) ?? null,
				};
			});

			// Sort by epochPts descending
			results.sort((a, b) => b.epochPts - a.epochPts);

			// Assign ranks
			results.forEach((r, i) => {
				r.rank = i + 1;
			});

			return results;
		}),
});