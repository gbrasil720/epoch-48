import { describe, expect, it } from "bun:test";
import { computeCFactor } from "./c-factor";

describe("computeCFactor", () => {
	it("returns 0 when total is 0", () => {
		expect(computeCFactor(3, 0)).toBe(0);
	});

	it("returns 0 when none advanced", () => {
		expect(computeCFactor(0, 8)).toBe(0);
	});

	it("returns ratio for partial advancement", () => {
		// e.g. UEFA: 10 of 13 advanced
		expect(computeCFactor(10, 13)).toBe(0.7692);
	});

	it("returns 1 when all advanced", () => {
		expect(computeCFactor(4, 4)).toBe(1);
	});
});
