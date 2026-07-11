import {
	type EpochScoreProps,
	PHASE_WEIGHTS,
	TournamentPhaseName,
} from "../typings";
import { performancePoints } from "./performance-points";

export function epochScore(
	props: EpochScoreProps,
	continentalBonusBc = 0,
): number {
	const pf = PHASE_WEIGHTS[props.tournamentPhase.name];

	if (props.tournamentPhase.name === TournamentPhaseName.WINNER) return pf;

	const pd = performancePoints(props);

	let decimalPart = (pd + continentalBonusBc) / 100;
	if (decimalPart >= 1.0) {
		decimalPart = 0.99;
	}

	const epochScore = pf + decimalPart;

	return Number(epochScore.toFixed(4));
}
