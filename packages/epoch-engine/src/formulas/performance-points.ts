import type { EpochScoreProps } from "../typings";
import { getCardCount } from "./get-card-count";

export function performancePoints(props: EpochScoreProps): number {
  if (props.gamesPlayed === 0) return 0

  const ppm = props.pointsGained / props.gamesPlayed

  const gd = props.goalsDiff
  const gf = props.goalsFor

  const yellowCards = getCardCount(props.cardsReceived, 'yellow')
  const redCards = getCardCount(props.cardsReceived, 'red')
  const fp = -((yellowCards * 0.2) + (redCards * 1.0))

  const pd = (ppm * 10) + (gd * 2) + gf + fp

  return Number(pd.toFixed(2))
}