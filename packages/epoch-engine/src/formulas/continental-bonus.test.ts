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

	it("computes bonus correctly for positive GD", () => {
		// ppm = 7/6 = 1.1667
		// rawBonus = (1.1667 * 5) * 5 = 29.167
		// finalBonus = 29.167 * 0.5 = 14.58
		expect(continentalBonus(baseProps, 0.5)).toBe(14.58);
	});

	it("computes negative bonus for negative GD", () => {
		const props: EpochScoreProps = {
			...baseProps,
			goalsDiff: -3,
		};
		// ppm = 1.1667
		// rawBonus = (1.1667 * 5) * (-3) = -17.5
		// finalBonus = -17.5 * 0.5 = -8.75
		expect(continentalBonus(props, 0.5)).toBe(-8.75);
	});

	it("computes zero bonus for zero GD", () => {
		const props: EpochScoreProps = {
			...baseProps,
			goalsDiff: 0,
		};
		expect(continentalBonus(props, 0.5)).toBe(0);
	});

	it("applies different confederation factors", () => {
		expect(continentalBonus(baseProps, 0.5)).toBe(14.58);
		expect(continentalBonus(baseProps, 0.4)).toBe(11.67);
		expect(continentalBonus(baseProps, 0.3)).toBe(8.75);
	});

	it("handles perfect group stage performance", () => {
		const props: EpochScoreProps = {
			...baseProps,
			tournamentPhase: { name: TournamentPhaseName.GROUP_STAGE },
			pointsGained: 9,
			gamesPlayed: 3,
			goalsDiff: 6,
		};
		// ppm = 3, rawBonus = 15 * 6 = 90
		// finalBonus = 90 * 0.5 = 45
		expect(continentalBonus(props, 0.5)).toBe(45);
	});
});
