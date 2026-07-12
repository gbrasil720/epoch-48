import { describe, expect, it } from "bun:test";
import type { EpochScoreProps } from "../typings";
import { TournamentPhaseName } from "../typings";
import { continentalBonus } from "./continental-bonus";

describe("continentalBonus", () => {
	const baseProps: EpochScoreProps = {
		tournamentPhase: { name: TournamentPhaseName.QUARTER_FINALS },
		pointsGained: 7,
		gamesPlayed: 6,
		goalsDiff: 5,
		goalsFor: 10,
		cardsReceived: null,
	};

	it("returns 0 when gamesPlayed is 0", () => {
		const props: EpochScoreProps = {
			...baseProps,
			gamesPlayed: 0,
		};
		expect(continentalBonus(props, 0.5)).toBe(0);
	});

	it("returns 0 when cFactor is 0", () => {
		expect(continentalBonus(baseProps, 0)).toBe(0);
	});

	it("computes bonus correctly for positive GD (additive formula)", () => {
		// ppm = 7/6 ≈ 1.1667
		// rawBonus = (1.1667 * 5) + (5 * 1) = 5.8333 + 5 = 10.8333
		// finalBonus = 10.8333 * 0.5 = 5.42
		expect(continentalBonus(baseProps, 0.5)).toBe(5.42);
	});

	it("computes negative bonus for negative GD", () => {
		const props: EpochScoreProps = {
			...baseProps,
			goalsDiff: -3,
		};
		// ppm = 1.1667
		// rawBonus = (1.1667 * 5) + (-3) = 5.8333 - 3 = 2.8333
		// finalBonus = 2.8333 * 0.5 = 1.42
		expect(continentalBonus(props, 0.5)).toBe(1.42);
	});

	it("computes bonus for zero GD (PPM only)", () => {
		const props: EpochScoreProps = {
			...baseProps,
			goalsDiff: 0,
		};
		// rawBonus = (1.1667 * 5) + 0 = 5.8333
		// finalBonus = 5.8333 * 0.5 = 2.92
		expect(continentalBonus(props, 0.5)).toBe(2.92);
	});

	it("applies different confederation factors", () => {
		expect(continentalBonus(baseProps, 0.5)).toBe(5.42);
		expect(continentalBonus(baseProps, 0.4)).toBe(4.33);
		expect(continentalBonus(baseProps, 0.3)).toBe(3.25);
	});

	it("handles perfect group stage performance", () => {
		const props: EpochScoreProps = {
			...baseProps,
			tournamentPhase: { name: TournamentPhaseName.GROUP_STAGE },
			pointsGained: 9,
			gamesPlayed: 3,
			goalsDiff: 6,
		};
		// ppm = 3, rawBonus = 15 + 6 = 21
		// finalBonus = 21 * 0.5 = 10.5
		expect(continentalBonus(props, 0.5)).toBe(10.5);
	});
});
