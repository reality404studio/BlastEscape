# Blast Escape — Project Status

This file is the compact monitoring surface for Codex `/goal` work.

## Current phase

**PHASE 9 — art, story, polish, and release production**

G0 contracts and the repository audit are complete. G1 extracted typed level
data and the authoritative gameplay step without changing constants, coordinates,
or the clamped-frame/three-substep order. Browser play and headless replay now
share movement, collision, hazards, bombs, blast, combo, death, and exit logic.
G2 now provides intent-bearing level data, accepted replay/report formats, and
reachability, exploit, deterministic noisy-human, and mechanic-use evaluators.
G3B and G8B ship `LEVEL 9 — COLD START`. G9A now ships accepted Levels 10–14:
timed ice, carriage locking, an expiring first-cycle blast route, a cold-created
recovery route, and `BLUE CIRCUIT`, which synthesizes both cold interactions with
a machine-verified B1 proximity shortcut. The bounded cold curriculum is DONE.
G3C ships `LEVEL 15 — THERMAL SEAL`: heat acquisition removes one linked
solid partition from authoritative collision for a timed interval, while neutral
and cold contacts remain blocked. G9B now also ships `LEVEL 16 — REIGNITION`,
where a heat-powered circuit advances a previously dormant B1 fuse. Level 17
makes heat lifetime load-bearing; Level 18 makes cold and heat oppose each other
on one condensate span. `LEVEL 19 — THERMAL CATCH` closes the sequence: heat owns
the fast primary route, while cold appears only after a missed B1 as the B2
recovery branch. G9B is DONE. G3D and G9C now ship
`LEVEL 20 — INDUCTION RAIL`: B1 captures a magnetized player on
a bounded overhead rail, left/right traverses it, and its end or timer releases
back to gravity. G3D and G9C are DONE. G10 now ships `LEVEL 21 — SHIFT CARRIER`,
where the same bounded attachment inherits one authoritative moving rail and
releases at its receiving endpoint. Level 22 now ships as `POLARITY HANDOFF`:
heat wakes B1, its arc replaces heat with magnetism in an airborne coil, and a
rightward rail crossing finishes the route. Level 23 now ships as `QUENCH DROP`:
a carrier release replaces magnetism with cold during descent, freezes the
landing basin, and sets up B2's
return to inspection. Level 24 now ships as `TEMPER CIRCUIT`: cold builds the B1
transfer and locks its carriage, then heat replaces cold aboard it and wakes the
required B2 return.
Level 25 now ships as `FINAL INSPECTION`: one final B1-to-B2 air chain reaches
dispatch, scanning reveals cancellation without ending control, and only the
player's later walk through the already-open door completes the game. G10 is DONE.
G4 now has an executable visual contract and three protagonist identity
candidates. HC-ART-001 is OPEN with A (Foundry Pod) recommended; character
animation production remains blocked at that gate. G8A now locks accepted
repository replays and validator evidence for the complete Levels 1–8 blast
curriculum without geometry or physics changes. G6/G7 continue as unblocked
production tracks before final QA.

G6 slice 001 now maps existing authoritative blast, landing, traversal,
magnetic, interaction, and dispatch events to presentation-only feedback. The
111-test suite, lint, and production build pass; interactive mute-first visual
inspection remains.

## Active / next goals

| Goal | State | Depends on | Purpose |
|---|---|---|---|
| G0 Director / contracts | DONE | — | contracts and reality audit recorded |
| G1 Runtime / physics | DONE | G0 | authoritative core and characterization evidence complete |
| G2 Level Lab / simulation | DONE | G1 | data-driven intent, replay, validators/evaluators complete |
| G3A Traversal-state substrate | DONE | G1 | shared temporary-state model and interaction hooks complete |
| G3B Cold | DONE | G3A | cold source/effect contract and Level 9 complete |
| G3C Heat | DONE | G3A + stable cold contract | heat acquisition, timed barrier melting, and Level 15 accepted |
| G3D Magnetism | DONE | G3A | bounded timed attachment/release and Level 20 accepted |
| G4 Art direction / protagonist | HUMAN_NEEDED | G0 | visual contract/candidates complete; HC-ART-001 open |
| G5 Sprite pipeline | PROPOSED | G4 approval | SpriteGen integration and atlas/manifest pipeline |
| G6 FX / game feel | ACTIVE | G0; stable runtime events | event-driven mute-first feedback; visual inspection remains |
| G7 Environmental story | READY | G0 | factory zones, signage, nonverbal narrative |
| G8A Blast curriculum migration | DONE | G2 | Levels 1–8 accepted replays and validator evidence complete |
| G8B Cold introduction | DONE | G2 + G3B | Level 9 complete |
| G9A Cold curriculum | DONE | G2 + G3B | Levels 10–14 accepted with route/dependency evidence |
| G9B Heat levels | DONE | G2 + G3C | Levels 15–19 accepted with selective route hierarchy |
| G9C Magnet introduction | DONE | G2 + G3D | Level 20 accepted |
| G10 Synthesis / ending levels | DONE | G2 + G3B–D + narrative | Levels 21–25 and canonical player-controlled ending accepted |
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

`HC-ART-001` is OPEN: choose A Foundry Pod, B Inspection Wedge, C Cratelet Unit,
or request one bounded revision before mass sprite generation. Director default:
A. Evidence: `docs/reports/G4-PROTAGONIST-CANDIDATES-001.md`.

## Recent accepted outcomes

- Existing level-design grammar remains authoritative for route/launch/landing/timing/recovery/mastery reasoning.
- Existing physical hand-feel is a compatibility constraint.
- Shared runtime and simulation should not diverge into separate physics implementations.
- Human calls are for judgment/taste/external choices, not routine implementation permission.
- Baseline lint and production build pass at audit commit
  `5c02443795bca2db31e8faf02235a2bdc21a1c5b`.
- The former noncanonical “all directives complete” overlay is replaced by the
  scanner cancellation, retained-control, open-door departure contract in D-020.
- G4 now has a `32 x 40` sprite-frame and palette/edge/zone execution contract,
  plus three gameplay-scale protagonist identity candidates. HC-ART-001 is open
  and recommends A; full animation remains blocked. Evidence:
  `docs/reports/G4-PROTAGONIST-CANDIDATES-001.md`.
- G6 slice 001 connects authoritative gameplay events to presentation-only
  flashes, state/contact pulses, particles, landing squash, and camera impulse.
  111 tests, lint, and build pass. Evidence:
  `docs/reports/G6-EVENT-FEEDBACK-001.md`.
- G8A now gives Levels 1–7 named clean replays, required-blast and simple-policy
  contracts, JSON reports, and regression tests; Level 8 retains its full slalom
  evidence. Levels 2–6 also clear one replay across 30–144Hz. The suite is now
  116/116. Evidence: `docs/reports/G8A-BLAST-CURRICULUM-001.md`.
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
- G9A Level 14 synthesizes temporary ice and carriage stabilization in a required
  B1-to-B2 primary route, while a closer B1 setup creates a faster direct mastery
  clear. The primary route clears at 6.583s; mastery clears at 4.317s using B1
  only; removing coolant, the carriage lock, or primary-route B2 blocks progress.
  ±80ms primary-route timing noise clears 100/100. 45 tests, Levels 8–14
  validation, lint, build, and local HTTP 200 pass. Evidence:
  `docs/reports/G9A-COLD-LEVEL-14-001.md`.
- G3C Level 15 adds a heat source and data-linked meltable barrier to the shared
  core. The accepted route clears at 4.350s using heat, the seal interaction, and
  B1; neutral and cold states remain blocked; melt expiry restores collision
  before movement; ±100ms timing noise clears 100/100. 50 tests, Levels 8–15
  validation, lint, build, and local HTTP 200 pass. Evidence:
  `docs/reports/G3C-HEAT-LEVEL-15-001.md`.
- G9B Level 16 adds data-linked dormant charges. B1's fuse pauses while its
  ignition interaction is inactive, continues while powered, and pauses without
  reset on expiry. The accepted route clears at 5.250s; neutral and cold controls
  produce zero explosions; ±100ms timing noise clears 100/100. 55 tests, Levels
  8–16 validation, lint, build, and local HTTP 200 pass. Evidence:
  `docs/reports/G9B-HEAT-LEVEL-16-001.md`.
- G9B Level 17 reuses timed heat, B1, and meltable collision to make pickup time
  load-bearing. Immediate pickup expires at the upper seal; waits from 0.4–1.8s
  clear; an early attempt can drop, reacquire heat, and clear on B1's repeat at
  11.783s. The accepted route clears at 6.183s and ±100ms noise clears 100/100.
  60 tests, Levels 8–17 validation, lint, build, and local HTTP 200 pass.
  Evidence: `docs/reports/G9B-HEAT-LEVEL-17-001.md`.
- G9B Level 18 lets cold and heat alter one condensate span in opposite directions.
  Cold creates its crossing; heat explicitly deactivates that state so the same
  opening becomes B1's return shaft. Removing either source or the deactivation
  link blocks the route. The accepted route clears at 8.100s; ±80ms noise clears
  100/100. 65 tests, Levels 8–18 validation, lint, build, and local HTTP 200 pass.
  Evidence: `docs/reports/G9B-HEAT-LEVEL-18-001.md`.
- G9B Level 19 closes the heat curriculum with a 4.583s heat+B1 primary route
  that remains unchanged without recovery coolant. A short B1 arc replaces heat
  with cold, freezes the emergency basin, and clears through B2 at 8.133s.
  Removing heat blocks the primary seal; removing recovery coolant dies in water;
  removing B2 prevents recovery. 71 tests, Levels 8–19 validation, lint, build,
  and local HTTP 200 pass. Evidence:
  `docs/reports/G9B-HEAT-LEVEL-19-001.md`.
- G3D/G9C Level 20 adds rising-only automatic magnetic capture, bounded rail
  motion with existing left/right input, and release on rail end, attachment
  discharge, or traversal-state expiry. The accepted route attaches at 3.467s,
  releases at the rail end at 5.167s, and clears at 5.550s. Without magnetism B1
  falls short; waiting on the rail discharges into the void. 77 tests, Levels
  8–20 validation, 30–144Hz replay checks, lint, build, and local HTTP 200 pass.
  Evidence: `docs/reports/G3D-MAGNETISM-LEVEL-20-001.md`.
- G10 Level 21 extends that attachment through the existing moving-platform
  authority: capture follows the current carrier rather than its swept path,
  attached movement inherits carrier displacement, and the receiving endpoint
  releases automatically. The route clears at 8.233s across 30–144Hz; removing
  magnetism or carrier travel dies in the water trench; all constant-direction
  policies fail; ±120ms noise clears 100/100. 86 tests and Levels 8–21 validation
  pass. Evidence: `docs/reports/G10-SYNTHESIS-LEVEL-21-001.md`.
- G10 Level 22 makes heat-powered B1, an airborne heat-to-magnetic replacement,
  and static rail traversal one dependent route. It clears at 6.367s across
  30–144Hz; removing heat leaves B1 dormant, while removing the airborne coil or
  rail returns to the safe launch floor without clearing. All constant-direction
  policies fail and ±80ms noise clears 100/100. 92 tests and Levels 8–22
  validation pass. Evidence: `docs/reports/G10-SYNTHESIS-LEVEL-22-001.md`.
- G10 Level 23 changes the synthesis shape: the moving carrier releases through
  coolant, cold freezes the receiving basin before contact, and the temporary
  landing feeds B2 back to the upper inspection line. The route clears at 9.433s;
  removing coolant or freeze contact dies in water, while removing B2 prevents
  the final climb. 18 carrier/B2 timing pairs, 30–144Hz, and ±100ms noise pass.
  98 tests and Levels 8–23 validation pass. Evidence:
  `docs/reports/G10-SYNTHESIS-LEVEL-23-001.md`.
- G10 Level 24 closes full gameplay escalation with a cold-frozen intake,
  stabilized B1 carriage, cold-to-heat replacement, and heat-reactivated B2.
  The route clears at 6.700s; removing cold, the carriage lock, heat, or B2 blocks
  its respective dependency. Eight final-steer samples, 30–144Hz, and ±80ms
  noise pass. 105 tests and Levels 8–24 validation pass. Evidence:
  `docs/reports/G10-SYNTHESIS-LEVEL-24-001.md`.
- G10 Level 25 returns to a concise B1-to-B2 air chain before the final scanner.
  Scanning records cancellation but never clears, pauses, or moves the player;
  neutral waiting and leftward retreat remain possible. Only a later rightward
  entry into the already-open departure completes the run. The accepted route
  clears at 5.300s with 2X, ±100ms noise clears 100/100, and 30–144Hz passes.
  111 tests and Levels 8–25 validation pass. Evidence:
  `docs/reports/G10-ENDING-LEVEL-25-001.md`.

## Director update rule

Update this file only at meaningful transitions: phase change, goal state change, new blocker, human call, or accepted milestone. Keep it readable in under two minutes.
