import type { EpochScoreProps } from "../typings";

export function continentalBonus(props: EpochScoreProps, cFactor: number): number {
  if(props.gamesPlayed === 0 || cFactor === 0) return 0

  const ppm = props.pointsGained / props.gamesPlayed
  const gd = props.goalsDiff

  const rawBonus = (ppm * 5) * (gd * 1)
  const finalBonus = rawBonus * cFactor

  return Number(finalBonus.toFixed(2))
}