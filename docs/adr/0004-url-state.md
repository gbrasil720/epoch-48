# ADR 0004: Shareable state in URL search params

**Status:** Accepted — 2026-07-11

## Context

The ranking page has three pieces of client state: epoch, comparison mode, and search text. Issue #7 originally said "local state".

## Decision

- **Epoch** and **comparison mode** live in URL search params: `/ranking?epoch=2018&mode=fifa` (`mode` ∈ `none | fifa | historical`, `none` omitted). Managed with Next.js `useSearchParams` / router replace.
- **Search text** and the **confederation filter** stay in local React state (ephemeral, not worth polluting history).

## Consequences

- Ranking views are shareable and bookmarkable; refresh preserves epoch and mode.
- Epoch selector changes update the URL, which drives the tRPC `getEpoch` refetch.
