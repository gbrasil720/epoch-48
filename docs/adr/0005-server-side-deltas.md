# ADR 0005: Comparison deltas computed server-side in getEpoch

**Status:** Accepted — 2026-07-11

## Context

The two comparison vectors (whitepaper §7) need joined data: FIFA official rank (from `fifa_rankings`) and the nation's rank in the previous epoch. Computing them client-side would mean extra queries and a join in the frontend, making the mode toggle non-instant.

## Decision

`getEpoch(year)` returns rows with the deltas **already computed server-side**:

```ts
type EpochRow = {
  rank: number;
  nation: { name: string; code: string; flag: string | null; confederation: string };
  tier: 1 | 2;                      // Global Stage | Qualifiers Tier
  phase: string;                    // elimination phase (Tier 1) or "Qualifiers" (Tier 2)
  score: number;                    // Epoch Score (Tier 1) or Q-Index (Tier 2)
  // vs FIFA ("Reality Check")
  fifaRank: number | null;
  fifaDelta: number | null;         // fifaRank - rank (positive = Epoch ranks the nation higher)
  // vs Historical (previous epoch)
  previousEpochRank: number | null;
  historicalDelta: number | null;   // previousEpochRank - rank
  // stats breakdown for the nation detail dialog
  stats: {
    matchesPlayed: number; pointsGained: number; goalsFor: number; goalsDiff: number;
    yellowCards: number; redCards: number;
    continentalBonus: number | null;      // B_c, Tier 1 only
    qualifier: { pointsEarned: number; maxPossiblePoints: number } | null; // Tier 2
  };
};
```

A companion `listEpochs` query returns the available epoch years from the `tournaments` table (drives the epoch selector dynamically — never hardcoded).

## Consequences

- Toggling comparison mode is pure column visibility — zero fetches, instant (issue #7 DoD).
- This extends the issue #5 API contract; issue #7 consumes it as-is.
- For the earliest seeded epoch (2014), `previousEpochRank`/`historicalDelta` are `null` and the "vs Historical" toggle is disabled with an explanatory tooltip.
