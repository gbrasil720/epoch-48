import { describe, expect, it } from "bun:test";
import type { QualifierStats } from "../typings";
import { qIndex } from "./q-index";

describe("qIndex", () => {
	it("returns 0 when maxPossiblePoints is 0", () => {
		const stats: QualifierStats = {
			pointsEarned: 0,
			maxPossiblePoints: 0,
			goalsDiff: 0,
			matchesPlayed: 0,
		};
		expect(qIndex(stats)).toBe(0);
	});

	it("returns 0 when matchesPlayed is 0", () => {
		const stats: QualifierStats = {
			pointsEarned: 0,
			maxPossiblePoints: 100,
			goalsDiff: 0,
			matchesPlayed: 0,
		};
		expect(qIndex(stats)).toBe(0);
	});

	it("computes Q-Index for perfect performance", () => {
		const stats: QualifierStats = {
			pointsEarned: 18,
			maxPossiblePoints: 18,
			goalsDiff: 12,
			matchesPlayed: 6,
		};
		// percentagePoints = 100, gdAvg = 2
		// qIndex = 100 + 1 = 101
		expect(qIndex(stats)).toBe(101);
	});

	it("computes Q-Index for average performance", () => {
		const stats: QualifierStats = {
			pointsEarned: 9,
			maxPossiblePoints: 18,
			goalsDiff: 3,
			matchesPlayed: 6,
		};
		// percentagePoints = 50, gdAvg = 0.5
		// qIndex = 50 + 0.25 = 50.25
		expect(qIndex(stats)).toBe(50.25);
	});

	it("handles negative goal difference", () => {
		const stats: QualifierStats = {
			pointsEarned: 6,
			maxPossiblePoints: 18,
			goalsDiff: -4,
			matchesPlayed: 6,
		};
		// percentagePoints = 33.33, gdAvg = -0.6667
		// qIndex = 33.33 - 0.33 = 33
		expect(qIndex(stats)).toBe(33);
	});

	it("handles zero goals diff", () => {
		const stats: QualifierStats = {
			pointsEarned: 12,
			maxPossiblePoints: 18,
			goalsDiff: 0,
			matchesPlayed: 6,
		};
		// percentagePoints = 66.67, gdAvg = 0
		expect(qIndex(stats)).toBe(66.67);
	});

	it("handles single match", () => {
		const stats: QualifierStats = {
			pointsEarned: 3,
			maxPossiblePoints: 3,
			goalsDiff: 2,
			matchesPlayed: 1,
		};
		// percentagePoints = 100, gdAvg = 2
		expect(qIndex(stats)).toBe(101);
	});

	it("handles large tournament", () => {
		const stats: QualifierStats = {
			pointsEarned: 30,
			maxPossiblePoints: 57,
			goalsDiff: 15,
			matchesPlayed: 19,
		};
		// percentagePoints = 52.63, gdAvg = 0.7895
		// qIndex = 52.63 + 0.39 = 53.03
		expect(qIndex(stats)).toBe(53.03);
	});
});
