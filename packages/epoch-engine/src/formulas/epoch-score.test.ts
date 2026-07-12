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

	it("2022 QF tie-breaker: England ES = 75.50", () => {
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
		// pd = 30.27, need ES = 75.50 → bc = 19.73
		expect(epochScore(props, 19.73)).toBe(75.5);
	});

	it("2022 QF tie-breaker: Brazil ES = 75.36", () => {
		const props: EpochScoreProps = {
			tournamentPhase: { name: TournamentPhaseName.QUARTER_FINALS },
			pointsGained: 7,
			gamesPlayed: 6,
			goalsDiff: 3,
			goalsFor: 8,
			cardsReceived: [
				{ color: "yellow", count: 5 },
				{ color: "red", count: 0 },
			],
		};
		// pd = 24.67, need ES = 75.36 → bc = 11.33
		expect(epochScore(props, 11.33)).toBe(75.36);
	});
});
