# ADR 0002: Theming — dark by default, toggle retained

**Status:** Accepted — 2026-07-11

## Context

Issue #6 asked for a "Dark/SaaS" analytical-dashboard aesthetic. The app already ships `next-themes` with a light/dark `mode-toggle`.

## Decision

Dark is the **default** theme (`defaultTheme="dark"` in the theme provider). The existing light/dark toggle stays. Both themes must be styled and presentable, with dark receiving the design attention (it is the product's identity).

## Consequences

- All new components are designed dark-first, verified in light mode.
- Tailwind CSS v4 tokens in `packages/ui/src/styles/globals.css` carry both palettes.
