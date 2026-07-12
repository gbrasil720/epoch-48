# ADR 0003: Ranking table — TanStack Table, no pagination

**Status:** Accepted — 2026-07-11

## Context

Issue #7 offered "pagination (50/page) or virtual scrolling". The dataset is bounded: at most 211 nations per epoch.

## Decision

Use **TanStack Table v8** with **no pagination and no virtualization**. ~211 plain rows render fine. TanStack provides column visibility (comparison modes), opt-in sorting, and client-side filtering out of the box.

Sorting behavior:

- Default order is the canonical rank order (Tier 1 by Epoch Score, then Tier 2 by Q-Index). This is the product; it loads this way every time.
- Column-header sorting (Nation, Score, delta columns) is **opt-in**. While a user sort is active, the tier-boundary row is hidden and a "reset to rank order" control is shown.

## Consequences

- No pagination chrome; the full hierarchy is scannable in one scroll.
- The tier-boundary row is presentation-only and only meaningful in canonical order.
