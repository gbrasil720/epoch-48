import { describe, expect, it } from "bun:test";
import type { EpochScoreProps } from "../typings";
import { TournamentPhaseName } from "../typings";
import { epochScore } from "./epoch-score";

describe("epochScore", () => {
	it("returns phase weight directly for WINNER", () => {
		const props: EpochScoreProps = {
			tournamentPhase: { name: TournamentPhaseName.WINNER },
			pointsGained: 19,
			gamesPlayed: 7,
			goalsDiff: 10,
			goalsFor: 15,
			cardsReceived: null,
		};
		expect(epochScore(props)).toBe(100);
	});

	it("ignores continental bonus for WINNER", () => {
		const props: EpochScoreProps = {
			tournamentPhase: { name: TournamentPhaseName.WINNER },
			pointsGained: 19,
			gamesPlayed: 7,
			goalsDiff: 10,
			goalsFor: 15,
			cardsReceived: null,
		};
		expect(epochScore(props, 999)).toBe(100);
	});

	it("computes epoch score for quarter finals with no bonus", () => {
		const props: EpochScoreProps = {
			tournamentPhase: { name: TournamentPhaseName.QUARTER_FINALS },
			pointsGained: 7,
			gamesPlayed: 6,
			goalsDiff: 5,
			goalsFor: 10,
			cardsReceived: [
				{ color: "yellow", count: 7 },
				{ color: "red", count: 0 },
			],
		};
		// pf = 75, pd = 30.27
		// decimalPart = 0.3027
		expect(epochScore(props)).toBe(75.3027);
	});

	it("applies continental bonus correctly", () => {
		const props: EpochScoreProps = {
			tournamentPhase: { name: TournamentPhaseName.QUARTER_FINALS },
			pointsGained: 7,
			gamesPlayed: 6,
			goalsDiff: 5,
			goalsFor: 10,
			cardsReceived: [
				{ color: "yellow", count: 7 },
				{ color: "red", count: 0 },
			],
		};
		// pd = 30.27, bc = 5
		// decimalPart = 35.27 / 100 = 0.3527
		expect(epochScore(props, 5)).toBe(75.3527);
	});

	it("caps decimal part at 0.99 (glass ceiling)", () => {
		const props: EpochScoreProps = {
			tournamentPhase: { name: TournamentPhaseName.QUARTER_FINALS },
			pointsGained: 18,
			gamesPlayed: 6,
			goalsDiff: 15,
			goalsFor: 20,
			cardsReceived: null,
		};
		// pd = 80, decimalPart = 0.80 (not capped)
		expect(epochScore(props)).toBe(75.8);

		// With bonus pushing over 1.0: (80 + 30) / 100 = 1.1 → capped to 0.99
		expect(epochScore(props, 30)).toBe(75.99);
	});

	it("floors decimal part at 0 for negative PD", () => {
		const props: EpochScoreProps = {
			tournamentPhase: { name: TournamentPhaseName.ROUND_OF_16 },
			pointsGained: 0,
			gamesPlayed: 1,
			goalsDiff: -5,
			goalsFor: 0,
			cardsReceived: [
				{ color: "yellow", count: 10 },
				{ color: "red", count: 2 },
			],
		};
		// pd = -14, decimalPart = -0.14 → floored to 0
		expect(epochScore(props)).toBe(60);
	});

	it("handles group stage elimination", () => {
		const props: EpochScoreProps = {
			tournamentPhase: { name: TournamentPhaseName.GROUP_STAGE },
			pointsGained: 3,
			gamesPlayed: 3,
			goalsDiff: -2,
			goalsFor: 2,
			cardsReceived: [
				{ color: "yellow", count: 4 },
				{ color: "red", count: 0 },
			],
		};
		// pd = 7.2, decimalPart = 0.072
		expect(epochScore(props)).toBe(25.072);
	});

	it("handles runner-up phase", () => {
		const props: EpochScoreProps = {
			tournamentPhase: { name: TournamentPhaseName.RUNNER_UP },
			pointsGained: 16,
			gamesPlayed: 7,
			goalsDiff: 8,
			goalsFor: 12,
			cardsReceived: [
				{ color: "yellow", count: 5 },
				{ color: "red", count: 0 },
			],
		};
		// pd = 49.86, decimalPart = 0.4986
		expect(epochScore(props)).toBe(95.4986);
	});

	it("handles third place", () => {
		const props: EpochScoreProps = {
			tournamentPhase: { name: TournamentPhaseName.THIRD_PLACE },
			pointsGained: 13,
			gamesPlayed: 7,
			goalsDiff: 6,
			goalsFor: 10,
			cardsReceived: null,
		};
		// pd = 40.57, decimalPart = 0.4057
		expect(epochScore(props)).toBe(90.4057);
	});

	it("handles fourth place", () => {
		const props: EpochScoreProps = {
			tournamentPhase: { name: TournamentPhaseName.FOURTH_PLACE },
			pointsGained: 10,
			gamesPlayed: 7,
			goalsDiff: 4,
			goalsFor: 8,
			cardsReceived: [
				{ color: "yellow", count: 6 },
				{ color: "red", count: 0 },
			],
		};
		// pd = 29.09, decimalPart = 0.2909
		expect(epochScore(props)).toBe(85.2909);
	});

	it("handles round of 32", () => {
		const props: EpochScoreProps = {
			tournamentPhase: { name: TournamentPhaseName.ROUND_OF_32 },
			pointsGained: 5,
			gamesPlayed: 4,
			goalsDiff: 2,
			goalsFor: 5,
			cardsReceived: null,
		};
		// pd = 21.5, decimalPart = 0.215
		expect(epochScore(props)).toBe(40.215);
	});

	it("handles round of 16", () => {
		const props: EpochScoreProps = {
			tournamentPhase: { name: TournamentPhaseName.ROUND_OF_16 },
			pointsGained: 8,
			gamesPlayed: 5,
			goalsDiff: 4,
			goalsFor: 7,
			cardsReceived: [
				{ color: "yellow", count: 3 },
				{ color: "red", count: 0 },
			],
		};
		// pd = 30.4, decimalPart = 0.304
		expect(epochScore(props)).toBe(60.304);
	});

	// Agent Checkpoint 2 (validation.md): real 2022 QF props, no fabricated B_c
	it("2022 QF Checkpoint 2: England ES = 75.508", () => {
		// England 2022 QF: 5 games, 10 pts, +9 GD, 13 GS, 1 Yellow
		// ppm = 2, fp = -0.2
		// pd = (2*10) + (9*2) + 13 + (-0.2) = 50.8
		// ES = 75 + 50.8/100 = 75.508
		const props: EpochScoreProps = {
			tournamentPhase: { name: TournamentPhaseName.QUARTER_FINALS },
			pointsGained: 10,
			gamesPlayed: 5,
			goalsDiff: 9,
			goalsFor: 13,
			cardsReceived: [
				{ color: "yellow", count: 1 },
				{ color: "red", count: 0 },
			],
		};
		expect(epochScore(props)).toBe(75.508);
	});

	it("2022 QF Checkpoint 2: Brazil (doc 10 pts) ES = 75.368", () => {
		// Brazil 2022 QF (validation.md): 5 games, 10 pts, +5 GD, 8 GS, 6 Yellows
		// ppm = 2, fp = -1.2
		// pd = 20 + 10 + 8 - 1.2 = 36.8
		// ES = 75 + 0.368 = 75.368
		const props: EpochScoreProps = {
			tournamentPhase: { name: TournamentPhaseName.QUARTER_FINALS },
			pointsGained: 10,
			gamesPlayed: 5,
			goalsDiff: 5,
			goalsFor: 8,
			cardsReceived: [
				{ color: "yellow", count: 6 },
				{ color: "red", count: 0 },
			],
		};
		expect(epochScore(props)).toBe(75.368);
	});

	it("2022 QF seed CSV Brazil (9 pts) ES = 75.348", () => {
		// world_cup_2022_stats.csv: BRA,5,9,8,5,6,0
		// ppm = 1.8, fp = -1.2
		// pd = 18 + 10 + 8 - 1.2 = 34.8
		// ES = 75.348
		const props: EpochScoreProps = {
			tournamentPhase: { name: TournamentPhaseName.QUARTER_FINALS },
			pointsGained: 9,
			gamesPlayed: 5,
			goalsDiff: 5,
			goalsFor: 8,
			cardsReceived: [
				{ color: "yellow", count: 6 },
				{ color: "red", count: 0 },
			],
		};
		expect(epochScore(props)).toBe(75.348);
	});
});
