# Blast Escape — Project Status

This file is the compact monitoring surface for Codex `/goal` work.

## Current phase

**PHASE 1 — hand-feel characterization and shared-core extraction**

The orchestration contract is reconciled with the current feature branch and G0
contracts are now explicit. The repository remains a compact eight-level
prototype: gameplay, level data, rendering, effects, and debug/demo tooling live
primarily in `app/blast-escape.tsx`. G1 is extracting testable authoritative
logic incrementally without changing established constants, coordinates, or
update order.

## Active / next goals

| Goal | State | Depends on | Purpose |
|---|---|---|---|
| G0 Director / contracts | DONE | — | contracts and reality audit recorded |
| G1 Runtime / physics | ACTIVE | G0 | characterize and extract reusable deterministic gameplay core |
| G2 Level Lab / simulation | PROPOSED | G1 | data-driven levels, replay, validators/evaluators |
| G3A Traversal-state substrate | PROPOSED | G1 | shared temporary-state model and interaction hooks |
| G3B–D Cold / heat / magnetism | PROPOSED | G3A | implement bounded traversal states with tests |
| G4 Art direction / protagonist | READY | G0 | pixel-art execution and identity candidates |
| G5 Sprite pipeline | PROPOSED | G4 approval | SpriteGen integration and atlas/manifest pipeline |
| G6 FX / game feel | READY | G0; preferably stable runtime events | mute-first feedback polish |
| G7 Environmental story | READY | G0 | factory zones, signage, nonverbal narrative |
| G8A Blast curriculum migration | PROPOSED | G2 | preserve/migrate L1–8 |
| G8B/G9A Cold levels | PROPOSED | G2 + G3B | L9–14 |
| G9B Heat levels | PROPOSED | G2 + G3C | L15–19 |
| G9C Magnet introduction | PROPOSED | G2 + G3D | L20 |
| G10 Synthesis / ending levels | PROPOSED | G2 + G3B–D + narrative | L21–25 and dispatch ending |
| G11 Final QA / release | PROPOSED | G4–G10 | full playthrough, save/pause/restart/build/perf |

## Open blockers

- Interactive browser capture is unavailable in the current environment. This
  does not block pure-core tests/build work; playable visual evidence remains a
  later verification item.

## Open human calls

See `docs/coordination/HUMAN-CALLS.md`.

Expected first mandatory human call: protagonist base identity approval before mass sprite generation.

## Recent accepted outcomes

- Existing level-design grammar remains authoritative for route/launch/landing/timing/recovery/mastery reasoning.
- Existing physical hand-feel is a compatibility constraint.
- Shared runtime and simulation should not diverge into separate physics implementations.
- Human calls are for judgment/taste/external choices, not routine implementation permission.
- Baseline lint and production build pass at audit commit
  `5c02443795bca2db31e8faf02235a2bdc21a1c5b`.
- The current final-clear overlay is explicitly noncanonical; the ending must be
  rebuilt around cancellation, an open door, and retained player control.
- G1 slice 001 extracted all eight level definitions, compatibility constants,
  movement/blast formulas, moving-platform math, and the Level 8 clean replay.
  Runtime imports the extracted modules; 7 characterization tests, lint, build,
  exact level-data comparison, and local HTTP rendering pass. Evidence:
  `docs/reports/G1-CHARACTERIZATION-001.md`.

## Director update rule

Update this file only at meaningful transitions: phase change, goal state change, new blocker, human call, or accepted milestone. Keep it readable in under two minutes.
