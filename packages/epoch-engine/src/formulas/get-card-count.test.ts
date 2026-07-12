import { describe, expect, it } from "bun:test";
import type { Cards } from "../typings";
import { getCardCount } from "./get-card-count";

describe("getCardCount", () => {
	it("returns 0 for null cards", () => {
		expect(getCardCount(null, "yellow")).toBe(0);
	});

	it("returns 0 for empty array", () => {
		expect(getCardCount([], "yellow")).toBe(0);
	});

	it("returns count for yellow cards", () => {
		const cards: Cards[] = [{ color: "yellow", count: 5 }];
		expect(getCardCount(cards, "yellow")).toBe(5);
	});

	it("returns count for red cards", () => {
		const cards: Cards[] = [{ color: "red", count: 1 }];
		expect(getCardCount(cards, "red")).toBe(1);
	});

	it("returns 0 when color not found", () => {
		const cards: Cards[] = [{ color: "yellow", count: 3 }];
		expect(getCardCount(cards, "red")).toBe(0);
	});

	it("handles mixed card types", () => {
		const cards: Cards[] = [
			{ color: "yellow", count: 7 },
			{ color: "red", count: 2 },
		];
		expect(getCardCount(cards, "yellow")).toBe(7);
		expect(getCardCount(cards, "red")).toBe(2);
	});
});
