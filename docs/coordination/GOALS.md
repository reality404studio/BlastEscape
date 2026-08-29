# Blast Escape — Goal Registry

This is the durable goal graph for Codex `/goal` sessions. The Director may revise scope and sequencing as repository evidence changes, but must preserve dependency logic and record material changes in `DECISIONS.md`.

## State model

`PROPOSED -> READY -> ACTIVE -> HUMAN_NEEDED -> VERIFYING -> DONE`

`HUMAN_NEEDED` may apply to one blocked subpart while other work continues.

## Registry

### G0 — Director / Contracts

**State:** READY  
**Owns:** game-wide contracts, coordination docs, acceptance gates.  
**Must produce/reconcile:** GAME_BIBLE, TECHNICAL_CONTRACT, LEVEL_CURRICULUM, VISUAL_BIBLE, NARRATIVE_BIBLE as needed.  
**Done when:** downstream work has stable contracts and each proposed goal has measurable acceptance criteria.

### G1 — Runtime / Physics

**State:** PROPOSED  
**Depends on:** G0.  
**Owns:** shared gameplay core, fixed-step/replay characteristics, movement/blast characterization tests.  
**Hard constraint:** do not change hand-feel merely to make architecture cleaner.  
**Done when:** real runtime and validation tooling can share authoritative movement/blast logic, or an incremental migration path with characterization tests is in place.

### G2 — Level Lab / Simulation

**State:** PROPOSED  
**Depends on:** G1 sufficiently stable.  
**Owns:** data-driven level schema, editor/lab, replay/script inputs, reachability/exploit/noisy-human/mechanic evaluators where practical.  
**Done when:** a new level can be authored/tuned without editing the giant gameplay component and can emit validation evidence.

### G3 — Traversal States: Cold / Heat / Magnetism

**State:** PROPOSED  
**Depends on:** G1.  
**Owns:** temporary state model, interactions with factory elements, tests, debug visualization.  
**Done when:** each mechanic has a minimal readable introduction behavior and can combine without creating new core inputs.

### G4 — Art Direction / Protagonist

**State:** PROPOSED  
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

**State:** PROPOSED  
**Depends on:** G0; shared runtime event boundaries preferred.  
**Owns:** explosion, impact, cold, heat, magnet feedback; camera impulse; hit-stop/impact freeze; particles/debris.  
**Done when:** mute play remains tactile and effects do not perturb authoritative simulation.

### G7 — Environmental Storytelling

**State:** PROPOSED  
**Depends on:** G0.  
**Owns:** factory zones, props, signage, production/inspection context, visual foreshadowing, ending-space language.  
**Cannot own:** gameplay physics or level-route rewrites unless coordinated.  
**Done when:** a player can infer shipment/testing/factory context without dialogue.

### G8 — Early Curriculum

**State:** PROPOSED  
**Depends on:** G2 and relevant parts of G3.  
**Owns:** Levels 1–9 after schema migration, preserving known good feel/routes where appropriate.  
**Done when:** blast curriculum is coherent and cold introduction is readable.

### G9 — Middle Curriculum

**State:** PROPOSED  
**Depends on:** G2 + G3.  
**Owns:** Levels 10–20.  
**Done when:** cold+blast, heat+blast, and magnet introduction progress without checklist-like repetition.

### G10 — Synthesis / Ending

**State:** PROPOSED  
**Depends on:** G2 + G3 + narrative contract.  
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
