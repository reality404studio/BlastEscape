# Blast Escape — Project Status

This file is the compact monitoring surface for Codex `/goal` work.

## Current phase

**PHASE 0 — orchestration bootstrap**

The repository is still a compact prototype. Gameplay, level data, rendering, effects, and debug tooling currently live primarily in `app/blast-escape.tsx`. Levels 1–8 exist. The next major milestone is not "make more levels"; it is to establish stable contracts, reusable core/runtime boundaries, and Level Lab tooling without changing the existing hand-feel.

## Active / next goals

| Goal | State | Depends on | Purpose |
|---|---|---|---|
| G0 Director / contracts | READY | — | reconcile game bible, acceptance criteria, goal graph |
| G1 Runtime / physics | PROPOSED | G0 | characterize and extract reusable deterministic gameplay core |
| G2 Level Lab / simulation | PROPOSED | G1 | data-driven levels, replay, validators/evaluators |
| G3 Cold / heat / magnet mechanics | PROPOSED | G1 | implement new traversal states with tests |
| G4 Art direction / protagonist | PROPOSED | G0 | pixel-art bible and protagonist identity candidates |
| G5 Sprite pipeline | PROPOSED | G4 approval | SpriteGen integration and atlas/manifest pipeline |
| G6 FX / game feel | PROPOSED | G0; preferably stable runtime events | mute-first feedback polish |
| G7 Environmental story | PROPOSED | G0 | factory zones, signage, nonverbal narrative |
| G8 Early level production | PROPOSED | G2 + relevant G3 | L1–9 curriculum polish/introduction |
| G9 Mid level production | PROPOSED | G2 + relevant G3 | L10–20 production |
| G10 Synthesis / ending levels | PROPOSED | G2 + G3 + narrative contract | L21–25 and dispatch ending |
| G11 Final QA / release | PROPOSED | G4–G10 | full playthrough, save/pause/restart/build/perf |

## Open blockers

None at orchestration bootstrap.

## Open human calls

See `docs/coordination/HUMAN-CALLS.md`.

Expected first mandatory human call: protagonist base identity approval before mass sprite generation.

## Recent accepted outcomes

- Existing level-design grammar remains authoritative for route/launch/landing/timing/recovery/mastery reasoning.
- Existing physical hand-feel is a compatibility constraint.
- Shared runtime and simulation should not diverge into separate physics implementations.
- Human calls are for judgment/taste/external choices, not routine implementation permission.

## Director update rule

Update this file only at meaningful transitions: phase change, goal state change, new blocker, human call, or accepted milestone. Keep it readable in under two minutes.
