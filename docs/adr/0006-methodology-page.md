# ADR 0006: Methodology page — hand-crafted, whitepaper as reference

**Status:** Accepted — 2026-07-11

## Context

`whitepaper.md` (repo root) is the mathematical spec: Epoch Score, Phase Base Weight, Cascade Tie-Breaker, Continental Bonus (B_c) with Glass Ceiling and C-Factor, Q-Index. The methodology page must present it with properly typeset formulas.

## Decision

Build `/methodology` as a **hand-crafted JSX page** using `whitepaper.md` as the content reference (not a runtime-rendered markdown file). Formulas are typeset with **KaTeX**.

## Consequences

- Full layout control (sections, callouts, the P_f weight table) at the cost of manual sync: when `whitepaper.md` changes, the page must be updated by hand.
- KaTeX CSS + the `katex` package are added to `apps/web`.
