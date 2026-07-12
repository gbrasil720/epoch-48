# Epoch 48: Master Agent Validation &amp; Requirements Document (MAVRD)

**Target Audience:** AI Agent Orchestrators, Lead Engineers, QA Agents.  
**Purpose:** This is the ultimate "Source of Truth" for the Epoch 48 project. It exhaustively defines the business logic, mathematical algorithms, database schemas, and architectural boundaries. Your task as an AI agent is to cross-reference the existing codebase against this document and report/fix any inconsistencies, logical flaws, or architectural drifts.

## 1. PROJECT PHILOSOPHY &amp; OBJECTIVE

Epoch 48 is a football (soccer) statistical platform that rejects the Elo-based FIFA ranking.

- **The Golden Rule:** The FIFA World Cup is the absolute metric. Friendly matches hold zero weight.
- **The Epoch:** The hierarchy is frozen in 4-year cycles. A team's performance in the World Cup locks their baseline tier until the next tournament.
- **Two-Tier System:** * **Tier 1 (The Global Stage):** Ranks 1-48. Exclusively for teams that qualify for the World Cup.
  - **Tier 2 (The Qualifiers Tier):** Ranks 49-211. For teams that failed to qualify, ranked by their continental qualifier performance.

## 2. ARCHITECTURAL BOUNDARIES

You must validate that the monorepo strictly adheres to the following stack and separation of concerns:

- **Monorepo Manager:** `Turborepo` running on `Bun`.
- **Database ORM:** `Drizzle ORM` (PostgreSQL).
- **Backend:** `Hono` providing an API connected via `tRPC`.
- **Frontend:** `Next.js` (App Router) + `Tailwind CSS` + `shadcn/ui`.
- **Math Engine:** `packages/epoch-engine`. **CRITICAL RULE:** This package must be pure TypeScript. It cannot import Drizzle, Next.js, or any HTTP libraries. It receives raw props, returns numbers.

## 3. DATABASE SCHEMA TRUTH (`packages/db/src/schema/epoch.ts`)

The agent must verify that the Drizzle schema contains the following structures and constraints. The database must only store *facts* (performances), not calculated scores.

### 3.1. `nations` Table

- `id` (serial PK), `name` (varchar 255, unique), `code` (varchar 3, unique), `flag` (varchar 10), `confederation` (varchar 50), `isActive` (boolean).

### 3.2. `tournaments` Table

- `id` (serial PK), `name` (varchar 255), `year` (integer), `type` (varchar enum: 'WORLD_CUP', 'QUALIFIERS', 'CONTINENTAL'), `isCompleted` (boolean).

### 3.3. `performances` Table (The Core Data)

- Must contain a composite unique index: `nation_id` + `tournament_id`.
- `nationId` (FK), `tournamentId` (FK), `eliminationPhase` (varchar).
- Raw Stats: `matchesPlayed` (int), `pointsGained` (int), `goalsFor` (int), `goalsDiff` (int), `yellowCards` (int), `redCards` (int), `maxPossiblePoints` (int, default 0).

### 3.4. `fifaRankings` Table (For the "Reality Check" comparison)

- Must contain a composite unique index: `nation_id` + `year`.
- `nationId` (FK), `year` (int), `officialRank` (int), `officialPoints` (real).

**Agent Checkpoint 1:** Verify that the schema does NOT contain a column for `epochScore`. If it does, the architecture is compromised. Scores must be calculated at runtime by the API.

## 4. THE MATHEMATICAL ENGINE TRUTH (`packages/epoch-engine`)

This is the most critical logic of the application. The agent must ensure the `epoch-engine` package implements these exact rules, enums, and mathematical formulas.

### 4.1. The Phase Weights ($P_f$) - 48-Team Format

The `TournamentPhaseName` enum and its corresponding mapping object `PHASE_WEIGHTS` must be exact:

- `WINNER`: 100
- `RUNNER_UP`: 95
- `THIRD_PLACE`: 90
- `FOURTH_PLACE`: 85
- `QUARTER_FINALS`: 75
- `ROUND_OF_16`: 60
- `ROUND_OF_32`: 40
- `GROUP_STAGE`: 25

### 4.2. Performance Tie-Breaker ($P_d$)

For teams eliminated in the same phase, we calculate the micro-decimal $P_d$.  
**Formula:** $P_d = (PPM \times 10) + (GD \times 2) + GS + FP$

- **PPM (Points Per Match):** `pointsGained / matchesPlayed`
- **GD (Goal Difference):** `goalsDiff`
- **GS (Goals Scored):** `goalsFor`
- **FP (Fair Play):** $-((YellowCards \times 0.2) + (RedCards \times 1.0))$

### 4.3. The Continental Bonus ($B_c$)

Mid-cycle tournaments (Euro, Copa America) yield a fractional bonus multiplied by the Confederation's C-Factor.  
**Formula:** $B_c = ((PPM_{cont} \times 5) + (GD_{cont} \times 1)) \times C_Factor$

### 4.4. The Master Epoch Score ($ES$) &amp; The Glass Ceiling

The final score combines the Base Weight and the Tie-Breaker.  
**Formula:** $ES = P_f + \frac{P_d + B_c}{100}$

**CRITICAL SAFEGUARD (The Glass Ceiling):** The code MUST contain a clamp limiting the decimal portion $\frac{P_d + B_c}{100}$ to a maximum of `0.99`. A team eliminated in the Round of 32 ($P_f = 40$) that wins a continental cup can reach `40.99`, but NEVER `41.00`. The base phase is an impenetrable ceiling. The `WINNER` returns exactly `100` (no decimals).

### 4.5. The Qualifiers Index (Q-Index) for Tier 2

For nations that failed to reach the World Cup, they are ranked continuously via:  
**Formula:** $QIndex = (\frac{PointsEarned}{MaxPossiblePoints} \times 100) + (\frac{GoalDifference}{MatchesPlayed} \times 0.5)$

**Agent Checkpoint 2:** Run unit tests for the engine. Inject `England 2022 QF: 5 games, 10 pts, +9 GD, 13 GS, 1 Yellow` and `Brazil 2022 QF: 5 games, 10 pts, +5 GD, 8 GS, 6 Yellows`. Verify England = `75.508` and Brazil = `75.368` (raw engine precision via `toFixed(4)`). Note: seed CSV Brazil 2022 has **9** tournament points (not 10); CSV-aligned ES is `75.348`.

## 5. THE API ORCHESTRATION TRUTH (`packages/api/src/routers/ranking.ts`)

The tRPC router must correctly bridge the Database and the Engine. HTTP is served by Hono in `apps/server` (and optionally Next.js route handlers).

### 5.1. The `getEpoch` Procedure

- **Input:** `year: number`
- **Flow Requirements:**
  1. Query the `tournaments` table where `type = 'WORLD_CUP'` and `year = input`.
  2. Query WC `performances` for that tournament (Tier 1 = World Cup participants only), joining `nations`.
  3. Load continental performances in the open cycle; compute confederation C-Factor from WC group-stage outcomes; compute \(B_c\) from continental stats and pass into `epochScore(props, bc)`.
  4. Query the `fifaRankings` table for the specified year.
  5. Map the DB columns to the `EpochScoreProps` interface (`pointsGained`, `gamesPlayed` ← `matchesPlayed`, cards → `cardsReceived`, etc.).
  6. Call `epochScore()` for each Tier 1 nation (one row per nation).
  7. Sort the resulting array by `score` in descending order.
  8. Assign an integer `rank` based on the sorted index.
  9. Rank Tier 2 (non-WC) via `qIndex` on qualifier performances; continue ranks after Tier 1.
  10. Historical comparison uses the **previous World Cup year**, not `year - 1`.
  11. Return the typed payload: nested `nation`, `phase`, `score`, `fifaRank`, `fifaDelta`, `tier`, `rank`, `stats`, etc.

**Agent Checkpoint 3:** Verify that the API correctly maps the `performances` columns (`pointsGained`, `matchesPlayed`, etc.) to the Engine without omitting properties like `cardsReceived`.

## 6. FRONTEND REQUIREMENTS &amp; UX (Next.js)

The frontend must accurately display the API's payload and provide analytical tools.

### 6.1. The Ranking Table Component

- Must display columns: Rank, Nation, Achievement Phase, Epoch Score (ES).
- Must implement a "Comparison Mode" state.
  - If **"vs FIFA"** is active: Display the official FIFA rank and calculate the $\Delta$ (Delta = fifaRank - epochRank). Render green up arrows for positive differences and red down arrows for negative.
- **The Tier Boundary:** If the dataset contains Tier 2 teams, a visual horizontal barrier must be rendered between Rank 48 and Rank 49 stating "--- Tier Boundary --- The Qualifiers Tier".

### 6.2. The Time Machine (Year Selector)

- The page must feature an Epoch Year Selector (2022, 2018, 2014).
- Switching the year must trigger a tRPC refetch, updating the table instantaneously.

## 7. AGENT EXECUTION TASKS (THE AUDIT)

You are instructed to perform the following operations:

1. **Read and Parse:** Read the current implementations of `packages/db/src/schema.ts`, `packages/epoch-engine/src/index.ts`, and `apps/api/src/routers/ranking.ts`.
2. **Compare:** Cross-reference the code against Sections 3, 4, and 5 of this document.
3. **Report:** Generate a markdown report listing any "Architectural Drifts", "Formula Errors", or "Missing Safeguards".
4. **Fix:** Implement code fixes for any discrepancies found (e.g., if the 0.99 clamp is missing, add it to `epoch-engine`. If the DB schema lacks `goalsDiff`, append it to Drizzle).

