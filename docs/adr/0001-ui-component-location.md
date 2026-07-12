# ADR 0001: UI component location

**Status:** Accepted — 2026-07-11

## Context

Issue #6 said components could live in `packages/ui` **or** `apps/web/components`. The monorepo already has `packages/ui` (shadcn-style primitives) and `apps/web/src/components` (app-level components).

## Decision

- **Generic primitives** (badge, toggle-group, table, dialog, select, tooltip, …) live in `packages/ui/src/components`, added via the shadcn CLI (`components.json` already configured).
- **Domain components** (`RankingTable`, `ComparisonToggle`, `DeltaBadge`, `TierBoundaryRow`, `NationDetailDialog`, navbar) live in `apps/web/src/components`, composed from the primitives.

## Consequences

- `packages/ui` stays domain-free and reusable.
- Domain logic (tier semantics, delta formatting) never leaks into the shared package.
- Leftover chat-template components in `packages/ui` (bubble, message, attachment, message-scroller) are out of scope; they are neither used nor removed by the UI issues.
