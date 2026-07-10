import type { Cards } from "../typings";

export function getCardCount(cards: Cards[] | null, color: 'red' | 'yellow'): number {
  if(!cards) return 0;
  const card = cards.find(c => c.color === color)
  return card ? card.count : 0
}