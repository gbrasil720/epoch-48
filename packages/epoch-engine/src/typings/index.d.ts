export enum TournamentPhaseName {
  GROUP_STAGE = 'Group Stage',
  ROUND_OF_32 = 'Round of 32',
  ROUND_OF_16 = 'Round of 16',
  QUARTER_FINALS = 'Quarter Finals',
  FOURTH_PLACE = 'Fourth Place',
  THIRD_PLACE = 'Third Place',
  RUNNER_UP = 'Runner-up',
  WINNER = 'Winner',
}

export const PHASE_WEIGHTS: Record<TournamentPhaseName, number> = {
  [TournamentPhaseName.WINNER]: 100,
  [TournamentPhaseName.RUNNER_UP]: 95,
  [TournamentPhaseName.THIRD_PLACE]: 90,
  [TournamentPhaseName.FOURTH_PLACE]: 85,
  [TournamentPhaseName.QUARTER_FINALS]: 75,
  [TournamentPhaseName.ROUND_OF_16]: 60,
  [TournamentPhaseName.ROUND_OF_32]: 40,
  [TournamentPhaseName.GROUP_STAGE]: 25,
}

export type TournamentPhase = {
  name: TournamentPhaseName;
}

export type Cards = {
  color: 'red' | 'yellow';
  count: number;
}

export interface EpochScoreProps {
  tournamentPhase: TournamentPhase;
  pointsGained: number;
  gamesPlayed: number;
  goalsDiff: number
  goalsFor: number;
  cardsReceived: Cards[] | null
}

export interface QualifierStats {
  pointsEarned: number
  maxPossiblePoints: number
  goalsDiff: number
  matchesPlayed: number
}