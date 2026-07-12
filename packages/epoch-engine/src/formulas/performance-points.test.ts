import { describe, expect, it } from "bun:test";
import type { EpochScoreProps } from "../typings";
import { TournamentPhaseName } from "../typings";
import { performancePoints } from "./performance-points";

describe("performancePoints", () => {
	const baseProps: EpochScoreProps = {
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

	it("computes PD correctly for standard case", () => {
		// ppm = 7/6 = 1.1667
		// fp = -(7 * 0.2 + 0 * 1.0) = -1.4
		// pd = (1.1667 * 10) + (5 * 2) + 10 + (-1.4) = 30.27
		expect(performancePoints(baseProps)).toBe(30.27);
	});

	it("returns 0 when gamesPlayed is 0", () => {
		const props: EpochScoreProps = {
			...baseProps,
			gamesPlayed: 0,
			pointsGained: 0,
		};
		expect(performancePoints(props)).toBe(0);
	});

	it("handles null cardsReceived", () => {
		const props: EpochScoreProps = {
			...baseProps,
			cardsReceived: null,
		};
		// ppm = 7/6 = 1.1667, fp = 0
		// pd = 11.667 + 10 + 10 + 0 = 31.67
		expect(performancePoints(props)).toBe(31.67);
	});

	it("handles empty cards array", () => {
		const props: EpochScoreProps = {
			...baseProps,
			cardsReceived: [],
		};
		expect(performancePoints(props)).toBe(31.67);
	});

	it("applies red card penalty correctly", () => {
		const props: EpochScoreProps = {
			...baseProps,
			cardsReceived: [
				{ color: "yellow", count: 0 },
				{ color: "red", count: 1 },
			],
		};
		// ppm = 1.1667, fp = -1.0
		// pd = 11.667 + 10 + 10 - 1.0 = 30.67
		expect(performancePoints(props)).toBe(30.67);
	});

	it("handles negative goalsDiff", () => {
		const props: EpochScoreProps = {
			...baseProps,
			goalsDiff: -3,
			goalsFor: 4,
		};
		// ppm = 1.1667, fp = -1.4
		// pd = 11.667 + (-6) + 4 - 1.4 = 8.27
		expect(performancePoints(props)).toBe(8.27);
	});

	it("handles zero goals", () => {
		const props: EpochScoreProps = {
			...baseProps,
			goalsFor: 0,
			goalsDiff: 0,
		};
		// ppm = 1.1667, fp = -1.4
		// pd = 11.667 + 0 + 0 - 1.4 = 10.27
		expect(performancePoints(props)).toBe(10.27);
	});

	it("handles perfect group stage performance", () => {
		const props: EpochScoreProps = {
			...baseProps,
			tournamentPhase: { name: TournamentPhaseName.GROUP_STAGE },
			pointsGained: 9,
			gamesPlayed: 3,
			goalsDiff: 6,
			goalsFor: 7,
			cardsReceived: null,
		};
		// ppm = 3, fp = 0
		// pd = 30 + 12 + 7 = 49
		expect(performancePoints(props)).toBe(49);
	});
});
