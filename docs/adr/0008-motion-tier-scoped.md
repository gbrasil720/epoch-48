# ADR 0008: Motion — framer-motion, tier-scoped animation budget

**Status:** Accepted — 2026-07-12

## Context

The UI redesign (ADR 0007) calls for rich motion. Framer-motion layout animations measure every animated node per frame; applying them to all 211 ranking rows drops frames on mid-range hardware. Options considered: CSS-only subtle motion, viewport-scoped animation, and unrestricted framer-motion.

## Decision

Adopt **framer-motion**, but scope the animation budget by tier:

- **Tier 1 (≤48 rows):** full treatment — animated sort reordering (`layout`), staggered mount, hover micro-interactions.
- **Tier 2 (~163 rows):** CSS-only hover tint and fade-in; no layout animations, no per-row motion components.
- **Landing hero:** one-time count-up on scores, staggered entrance.
- **Dialogs:** spring scale-in.

## Consequences

- framer-motion becomes a dependency of `apps/web` (~40 kB); acceptable for the interaction quality gained.
- The tier boundary is now also a performance boundary — components rendering Tier 2 rows must not wrap them in `motion` elements.
- `prefers-reduced-motion` must disable all non-essential animation in both tiers.
