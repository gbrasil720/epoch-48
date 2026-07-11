import type { QualifierStats } from "../typings";

export function qIndex(stats: QualifierStats): number {
	if (stats.maxPossiblePoints === 0 || stats.matchesPlayed === 0) return 0;

	const percentagePoints = (stats.pointsEarned / stats.maxPossiblePoints) * 100;
	const gdAvg = stats.goalsDiff / stats.matchesPlayed;

	const qIndex = percentagePoints + gdAvg * 0.5;

	return Number(qIndex.toFixed(2));
}
