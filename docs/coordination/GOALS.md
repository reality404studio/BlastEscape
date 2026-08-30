# Blast Escape — Goal Registry

This is the durable goal graph for Codex `/goal` sessions. The Director may revise scope and sequencing as repository evidence changes, but must preserve dependency logic and record material changes in `DECISIONS.md`.

## State model

`PROPOSED -> READY -> ACTIVE -> HUMAN_NEEDED -> VERIFYING -> DONE`

`HUMAN_NEEDED` may apply to one blocked subpart while other work continues.

## Registry

### G0 — Director / Contracts

**State:** DONE
**Owns:** game-wide contracts, coordination docs, acceptance gates.
**Must produce/reconcile:** GAME_BIBLE, TECHNICAL_CONTRACT, LEVEL_CURRICULUM, VISUAL_BIBLE, NARRATIVE_BIBLE as needed.
**Done when:** downstream work has stable contracts and each proposed goal has measurable acceptance criteria.

**Evidence:** `docs/PROTOTYPE-AUDIT.md`, `docs/GAME-BIBLE.md`,
`docs/TECHNICAL-CONTRACT.md`, `docs/LEVEL-CURRICULUM.md`,
`docs/VISUAL-BIBLE.md`, and `docs/NARRATIVE-BIBLE.md`.

### G1 — Runtime / Physics

**State:** DONE
**Depends on:** G0.
**Owns:** shared gameplay core, fixed-step/replay characteristics, movement/blast characterization tests.
**Hard constraint:** do not change hand-feel merely to make architecture cleaner.
**Done when:** real runtime and validation tooling can share authoritative movement/blast logic, or an incremental migration path with characterization tests is in place.

**Current slice:** extract typed level data and pure gameplay formulas without
changing constants, coordinates, or update order; make the browser runtime consume
them; add deterministic characterization tests and frame-schedule evidence.

**Evidence:** `docs/reports/G1-CHARACTERIZATION-001.md` and
`docs/reports/G1-AUTHORITATIVE-CORE-002.md`.

### G2 — Level Lab / Simulation

**State:** DONE
**Depends on:** G1 sufficiently stable.
**Owns:** data-driven level schema, editor/lab, replay/script inputs, reachability/exploit/noisy-human/mechanic evaluators where practical.
**Done when:** a new level can be authored/tuned without editing the giant gameplay component and can emit validation evidence.

**Current slice:** add intent-bearing level definitions, a shared-core replay
runner, reachability/exploit/noisy-human/mechanic evaluators, and machine-readable
reports using Level 8 as the first complete reference fixture.

**Evidence:** `docs/reports/G2-LEVEL-LAB-001.md` and
`artifacts/level-validation/level-8.json`.

### G3A — Traversal-State Substrate

**State:** DONE
**Depends on:** G1.
**Owns:** temporary-state lifetime/transition model, interaction hooks, tests,
debug visualization, and shared visual event boundaries.
**Done when:** cold, heat, and magnetism can be implemented as data/state
interactions without adding new player inputs or forking the core.

**Current slice:** add one mutually exclusive temporary state slot, typed factory
sources and interaction contacts, authoritative acquisition/refresh/expiry events,
and runtime debug visibility without changing existing level behavior.

**Evidence:** `docs/reports/G3A-TRAVERSAL-STATE-SUBSTRATE-001.md`.

### G3B — Cold

**State:** DONE
**Depends on:** G3A.
**Owns:** cold acquisition, expiry, readable effects on water/steam/machinery/hot
surfaces, and tests.
**Done when:** Level 9 can teach one unmistakable cold interaction and later levels
can reuse it through the shared substrate.

**Current slice:** Level 9 teaches source acquisition and a safe `cool-surface`
application before reusing blast locomotion. Water freezing remains Level 10 so
the curriculum does not introduce two cold applications at once.

**Evidence:** `docs/reports/G3B-COLD-LEVEL-9-001.md` and
`artifacts/level-validation/level-9.json`.

### G3C — Heat

**State:** READY
**Depends on:** G3A; cold interaction contract sufficiently stable.
**Owns:** heat acquisition, expiry, melt/thaw/reactivation interactions, and tests.
**Done when:** Level 15 can teach heat with blast still present and heat/cold
opposition is deterministic and readable.

### G3D — Magnetism

**State:** READY
**Depends on:** G3A.
**Owns:** timed attachment/release/discharge on suitable metal infrastructure and
tests.
**Done when:** Level 20 can teach overhead traversal without free flight or a new
input button.

### G4 — Art Direction / Protagonist

**State:** READY
**Depends on:** G0.
**Owns:** pixel scale, palette, outline/lighting rules, factory visual grammar, protagonist silhouette/base design.
**Human gate:** base protagonist identity approval before mass animation generation.
**Done when:** visual bible is executable and one base protagonist identity is approved.

### G5 — Sprite Pipeline

**State:** PROPOSED
**Depends on:** G4 protagonist approval.
**Owns:** SpriteGen setup/instructions, source request metadata, curated atlas/manifest integration.
**Reference:** `https://github.com/aldegad/sprite-gen`.
**Done when:** approved character states are reproducibly generated/curated and consumed by the runtime.

### G6 — FX / Game Feel

**State:** READY
**Depends on:** G0; shared runtime event boundaries preferred.
**Owns:** explosion, impact, cold, heat, magnet feedback; camera impulse; hit-stop/impact freeze; particles/debris.
**Done when:** mute play remains tactile and effects do not perturb authoritative simulation.

### G7 — Environmental Storytelling

**State:** READY
**Depends on:** G0.
**Owns:** factory zones, props, signage, production/inspection context, visual foreshadowing, ending-space language.
**Cannot own:** gameplay physics or level-route rewrites unless coordinated.
**Done when:** a player can infer shipment/testing/factory context without dialogue.

### G8A — Blast Curriculum Migration / Preservation

**State:** READY
**Depends on:** G2.
**Owns:** Levels 1–8 after schema migration, preserving known good feel/routes and
locking regression evidence before tuning.
**Done when:** the blast curriculum is coherent in the shared schema and every
accepted route has replay/validator evidence.

### G8B — Cold Introduction

**State:** DONE
**Depends on:** G2 + G3B.
**Owns:** Level 9.
**Done when:** cold is introduced safely and readably in the real runtime without
dialogue or a new input.

**Evidence:** `docs/reports/G3B-COLD-LEVEL-9-001.md`.

### G9A — Cold Curriculum

**State:** READY
**Depends on:** G2 + G3B.
**Owns:** Levels 10–14.
**Done when:** cold+blast develops through route/timing/recovery variations rather
than five isolated gimmicks.

### G9B — Heat Curriculum

**State:** PROPOSED
**Depends on:** G2 + G3C.
**Owns:** Levels 15–19.
**Done when:** heat is introduced and recombined with blast/cold without a
checklist-like sequence.

### G9C — Magnet Introduction

**State:** PROPOSED
**Depends on:** G2 + G3D.
**Owns:** Level 20.
**Done when:** timed overhead attachment/release is readable, bounded, and not
free flight.

### G10 — Synthesis / Ending

**State:** PROPOSED
**Depends on:** G2 + G3B + G3C + G3D + narrative contract.
**Owns:** Levels 21–25, dispatch scanner sequence, cancellation reveal, open-door exit.
**Human gate:** ending meaning must remain cancellation -> no new objective -> player-controlled departure.
**Done when:** synthesis levels are fair and the ending lands without dialogue/cutscene exposition.

### G11 — Final QA / Release

**State:** PROPOSED
**Depends on:** G4–G10 materially complete.
**Owns:** save/continue, restart UX, title/pause/credits, input/readability, build/perf, regression suite, playtime evidence.
**Human gate:** request one end-to-end human playthrough before final declaration.
**Done when:** release gates in `docs/GOAL-ORCHESTRATION.md` are met or explicitly waived.

## Director rules

- A goal becomes `READY` only when dependencies and contracts are sufficient.
- A goal becomes `DONE` only with evidence, not because code was written.
- If two goals need the same shared file, the Director assigns one owner or sequences the work.
- Level sessions request shared-engine changes through `ENGINE-REQUESTS.md` rather than forking behavior privately.
- Keep scope bounded. The final objective is a polished ~1-hour game, not feature accretion.
