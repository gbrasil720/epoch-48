# Glossary

Domain terms for Epoch 48. Source of truth for math: `whitepaper.md`.

| Term | Meaning |
| --- | --- |
| **Epoch** | A fixed 4-year cycle anchored to a World Cup (e.g. 2014, 2018). Tier 1 standings freeze for the whole cycle. |
| **Epoch Score (ES)** | Tier 1 metric, capped at 100.00. `ES = P_f + (P_d + B_c)/100`. |
| **P_f — Phase Base Weight** | Integer for the final tournament phase reached (Winner 100 … Group Stage 25). A later-phase team can never be passed by an earlier-phase team. |
| **P_d — Performance Tie-Breaker** | Decimal component separating teams eliminated in the same phase: `(PPM×10) + (GD×2) + GS + FP`. |
| **FP — Fair Play Modifier** | Disciplinary deduction: `-((yellows×0.2) + (reds×1.0))`. |
| **B_c — Continental Bonus / Mid-Cycle Modifier** | Bonus from continental tournaments, injected only into the decimal part (Glass Ceiling: decimals clamp at .99, never cross a P_f threshold). Scaled by the C-Factor. |
| **C-Factor (C_f)** | Confederation strength multiplier: share of the confederation's World Cup entrants that advanced past the group stage. |
| **Q-Index** | Tier 2 metric: `(P_earned/P_max × 100) + (GD_avg × 0.5)`, normalized across divergent qualification formats. |
| **Tier 1 — Global Stage** | Ranks 1–48 (1–32 for 32-team epochs): nations that qualified for the World Cup final tournament. Ranked by ES. |
| **Tier 2 — Qualifiers Tier** | Ranks 49–211: nations that did not reach the World Cup. Ranked by Q-Index from their qualification campaign. |
| **Tier Boundary** | The impassable line between Tier 1 and Tier 2, rendered as a visual barrier row in the ranking table (canonical order only). |
| **Reality Check (vs FIFA)** | Comparison mode showing the FIFA official rank and the delta between it and the Epoch rank. |
| **Historical Evolution (vs Historical)** | Comparison mode showing the nation's rank in the previous epoch and positions gained/lost across cycles. |
| **Comparison Mode** | Ranking-table state: `none`, `fifa`, or `historical`; toggles delta column visibility. Kept in the URL (`?mode=`). |
