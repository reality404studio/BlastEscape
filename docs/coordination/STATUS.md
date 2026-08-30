# Blast Escape — Project Status

This file is the compact monitoring surface for Codex `/goal` work.

## Current phase

**PHASE 5 — bounded cold curriculum production**

G0 contracts and the repository audit are complete. G1 extracted typed level
data and the authoritative gameplay step without changing constants, coordinates,
or the clamped-frame/three-substep order. Browser play and headless replay now
share movement, collision, hazards, bombs, blast, combo, death, and exit logic.
G2 now provides intent-bearing level data, accepted replay/report formats, and
reachability, exploit, deterministic noisy-human, and mechanic-use evaluators.
G3B and G8B ship `LEVEL 9 — COLD START`. G9A ships accepted Levels 10–13:
timed ice, carriage locking, an expiring first-cycle blast route, and now
`COLD CATCH`, where the same ice is both B1's approach and a wide B2 recovery
state. Removing B2 makes the recovery input thaw into water. G9A remains ACTIVE
with Level 14 cold synthesis and its intentional mastery shortcut next. G3C
Heat, G3D Magnetism, and G8A blast replay coverage are also READY.

## Active / next goals

| Goal | State | Depends on | Purpose |
|---|---|---|---|
| G0 Director / contracts | DONE | — | contracts and reality audit recorded |
| G1 Runtime / physics | DONE | G0 | authoritative core and characterization evidence complete |
| G2 Level Lab / simulation | DONE | G1 | data-driven intent, replay, validators/evaluators complete |
| G3A Traversal-state substrate | DONE | G1 | shared temporary-state model and interaction hooks complete |
| G3B Cold | DONE | G3A | cold source/effect contract and Level 9 complete |
| G3C Heat | READY | G3A + stable cold contract | heat interactions and Level 15 introduction |
| G3D Magnetism | READY | G3A | timed attachment/release and Level 20 introduction |
| G4 Art direction / protagonist | READY | G0 | pixel-art execution and identity candidates |
| G5 Sprite pipeline | PROPOSED | G4 approval | SpriteGen integration and atlas/manifest pipeline |
| G6 FX / game feel | READY | G0; preferably stable runtime events | mute-first feedback polish |
| G7 Environmental story | READY | G0 | factory zones, signage, nonverbal narrative |
| G8A Blast curriculum migration | READY | G2 | preserve/migrate L1–8 |
| G8B Cold introduction | DONE | G2 + G3B | Level 9 complete |
| G9A Cold curriculum | ACTIVE | G2 + G3B | Levels 10–13 accepted; Level 14 synthesis next |
| G9B Heat levels | PROPOSED | G2 + G3C | L15–19 |
| G9C Magnet introduction | PROPOSED | G2 + G3D | L20 |
| G10 Synthesis / ending levels | PROPOSED | G2 + G3B–D + narrative | L21–25 and dispatch ending |
| G11 Final QA / release | PROPOSED | G4–G10 | full playthrough, save/pause/restart/build/perf |

## Open blockers

- Interactive browser capture is unavailable in the current environment. This
  does not block pure-core tests/build work; playable visual evidence remains a
  later verification item.

## Integration

- Ongoing director work is published in Draft PR #5:
  `https://github.com/reality404studio/BlastEscape/pull/5`.

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
- G1 slice 002 moved collision, hazards, bomb stepping, combo, death, and exit
  checks into `stepGameplay`, shared by runtime and headless replay. Level 8
  clears at 5X across 30/50/60/120/144Hz; 10 tests, lint, and build pass.
  Evidence: `docs/reports/G1-AUTHORITATIVE-CORE-002.md`.
- G2 attached explicit route intent to Levels 1–8 and added accepted replay,
  reachability, exploit, deterministic timing-noise, mechanic-use, and JSON report
  paths. Level 8 passes all evaluator contracts; 14 tests, lint, and build pass.
  Evidence: `docs/reports/G2-LEVEL-LAB-001.md` and
  `artifacts/level-validation/level-8.json`.
- G3A added a mutually exclusive neutral/cold/heat/magnetic state slot, typed
  factory sources/interactions, authoritative acquisition/replacement/expiry,
  contact events, and runtime debug visibility. 18 tests, Level 8 validation,
  lint, and build pass. Evidence:
  `docs/reports/G3A-TRAVERSAL-STATE-SUBSTRATE-001.md`.
- G3B/G8B added `LEVEL 9 — COLD START`, timed cooled-surface state, hot-surface
  hazard, cold/source/plate/player feedback, and a clean replay. Accepted route
  clears at 4.35s; no-cold control dies; ±100ms timing noise clears 100/100.
  21 tests, Levels 8–9 validation, lint, and build pass. Evidence:
  `docs/reports/G3B-COLD-LEVEL-9-001.md`.
- G9A Level 10 added timed frozen-water collision and a linked water hazard in
  the authoritative core. The accepted route clears at 4.35s; removing coolant
  dies in water; expiry removes the surface; ±100ms timing noise clears 100/100.
  25 tests, Levels 8–10 validation, lint, and build pass. Evidence:
  `docs/reports/G9A-COLD-LEVEL-10-001.md`.
- G9A Level 11 added data-defined cold docking to the existing moving-platform
  calculation. The accepted route clears at 4.483s; removing coolant misses the
  cycling carriage; lock expiry restores its normal path. ±100ms timing noise
  clears 100/100. 30 tests, Levels 8–11 validation, lint, and build pass.
  Evidence: `docs/reports/G9A-COLD-LEVEL-11-001.md`.
- G9A Level 12 reused timed ice and the unchanged bomb cycle for a genuinely
  expiring route. The accepted route clears at 5.0s across 30–144Hz; a delayed
  control dies on thaw but clears using the second blast when only ice lifetime
  is extended. ±80ms timing noise clears 100/100. 35 tests, Levels 8–12
  validation, lint, and build pass. Evidence:
  `docs/reports/G9A-COLD-LEVEL-12-001.md`.
- G9A Level 13 reused one frozen basin as primary B1 approach and recovery catch.
  The clean route clears at 3.967s; the over-braked route lands once on ice and
  clears through B2 at 6.55s; removing B2 thaws that recovery into water. 40
  tests, Levels 8–13 validation, lint, and build pass. Evidence:
  `docs/reports/G9A-COLD-LEVEL-13-001.md`.

## Director update rule

Update this file only at meaningful transitions: phase change, goal state change, new blocker, human call, or accepted milestone. Keep it readable in under two minutes.
