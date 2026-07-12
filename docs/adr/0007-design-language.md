# ADR 0007: Design language — editorial sports data

**Status:** Accepted — 2026-07-12

## Context

The UI shipped on near-stock shadcn/ui tokens (neutral grayscale, one generic green, Geist everywhere). It reads as a template, not a product. A grilling session evaluated four art directions: editorial sports data, broadcast/stadium, Swiss minimal, and retro almanac.

## Decision

**Editorial sports data**: the data is the hero — dark-first ink surfaces, bold display typography for ranks and scores, one restrained accent, no decorative gradients or glassmorphism.

Concretely:

- **Type:** Archivo (variable; 800–900 weights, wide/expanded for headlines and large rank numerals) as `--font-heading`; Geist stays for body/UI; Geist Mono with `tabular-nums` for all scores and numeric columns. Loaded via `next/font`.
- **Accent:** refined pitch green — approx `oklch(0.78 0.20 150)` on dark, `oklch(0.52 0.17 150)` on light — used sparingly (links, active states, CTA, tier-1 markers). Gold (`oklch(0.80 0.14 85)`) is reserved exclusively for the reigning champion treatment.
- **Deltas:** green-up / red-down pair, colorblind-checked, distinct from the brand accent in weight/usage.
- **Flags:** SVG flags (circle-flags style, keyed by nation ISO code) replace emoji flags everywhere. Emoji flags render as bare letter pairs on Windows Chrome and sit inconsistently on the baseline.
- **Presentation:** the ranking stays a single dense table (podium bands and card grids were considered and rejected); the redesign upgrades row anatomy, tier separation, and typography rather than restructuring.

## Consequences

- All design tokens live in `packages/ui/src/styles/globals.css`; both light and dark palettes carry the new values (see ADR 0002 — dark remains the default and the identity theme).
- Any new UI must draw from these tokens; no per-component hex values.
- A flag asset/dependency keyed by ISO code is introduced; `nation.code` is the lookup key.
