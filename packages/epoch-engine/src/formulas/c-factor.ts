/**
 * Confederation Factor (C_f):
 * C_f = (Nations from confed. that advanced past WC Group Stage)
 *     / (Total nations from confed. present at the World Cup)
 */
export function computeCFactor(
	advancedPastGroup: number,
	totalAtWorldCup: number,
): number {
	if (totalAtWorldCup <= 0) return 0;
	if (advancedPastGroup <= 0) return 0;
	return Number((advancedPastGroup / totalAtWorldCup).toFixed(4));
}
