# Blast Escape — Codex Goal Orchestration

This repository may be developed by multiple long-running Codex `/goal` sessions. This document is the operating contract for those sessions.

The purpose is not to create an autonomous project manager for its own sake. The purpose is to let Codex decompose the final-game objective into bounded workstreams, execute them with minimal human interruption, expose progress, and call a human only when judgment or an external capability is genuinely required.

## Final product goal

Turn the existing Blast Escape prototype into a polished, approximately 60-minute single-player pixel-art game while preserving the current physical hand-feel.

Canonical premise:

> An unshipped industrial robot crosses an abandoned factory toward dispatch. It has no jump function and no arms. It misuses factory equipment to traverse production and inspection lines. After passing the final dispatch scanner, it discovers that its order was cancelled. The exit is already open; control remains with the player, who may simply leave.

Narrative constraints:

- no dialogue;
- no named protagonist;
- no explanatory cutscene dump;
- story is communicated through environment, machinery, signage, silhouettes, staging, and the ending;
- the robot's implicit objective is dispatch/shipment;
- the ending must not forcibly walk the robot out in a cinematic: retain player control after the cancellation reveal.

Gameplay constraints:

- no jump button;
- preserve left/right movement and imperfect midair steering;
- explosion-based locomotion remains the primary grammar;
- preserve the existing satisfying physical feel as a compatibility constraint;
- do not add combat, enemies, inventory, currency, skill trees, dialogue systems, branching narrative, or a large new input vocabulary;
- prefer recombining existing mechanics over introducing new systems;
- new mechanics are factory states/equipment being misused as traversal tools, not superhero abilities.

## Target curriculum

The exact final level count may move slightly if playtime evidence requires it, but the intended structure is:

- Levels 1–8: blast traversal curriculum;
- Level 9: cold introduction;
- Levels 10–14: cold + blast;
- Level 15: heat introduction, with blast still present;
- Levels 16–19: heat + blast, with cold reused where useful;
- Level 20: magnetism introduction;
- Levels 21–25: synthesis, using learned mechanics selectively rather than forcing every mechanic into every level;
- final dispatch scanner / cancellation / open-door ending after the final gameplay challenge.

Mechanic intent:

### Cold
The robot acquires a temporary cold state from factory cooling equipment. The state may freeze water, condense/freeze steam, stabilize or lock suitable machinery, cool hot surfaces, or otherwise alter factory traversal in ways consistent with the environment.

### Heat
The robot acquires temporary heat from pipes, furnaces, burners, welding equipment, or similar machinery. The state may melt a barrier, thaw ice, reactivate a dormant bomb/charge, or release frozen machinery.

### Magnetism
The robot temporarily charges from electrical equipment and can attach to suitable metal infrastructure such as overhead rails or moving carriers. Attachment must be temporary or timing-sensitive; it is not free flight. A central use is crossing deep water/voids by riding overhead machinery and releasing before forced drop/discharge.

## Required workstreams

The director may split or merge these if repository evidence justifies it, but it must preserve the responsibility boundaries.

1. **Director / Contracts** — game bible, technical contracts, acceptance criteria, dependency ordering.
2. **Runtime / Physics** — extract or establish a reusable deterministic gameplay core without changing hand-feel.
3. **Level Lab / Simulation** — level schema, fast level authoring, deterministic replay/simulation, reachability, exploit checks, noisy-human checks, mechanic-use verification where practical.
4. **Mechanics** — cold, heat, magnetism and their visual/state integration.
5. **Art Direction** — pixel-art visual bible, environment grammar, protagonist design.
6. **Sprite Pipeline** — integrate or document `aldegad/sprite-gen`; use it for identity-preserving character animation and atlas output where appropriate.
7. **FX / Game Feel** — mute-first impact feedback, explosion/collision/cold/heat/magnet effects, camera impulse, impact freeze, debris/particles, with physics timing kept authoritative.
8. **Environmental Storytelling** — factory zones, signs, machinery, silhouettes, production/inspection context, final dispatch area.
9. **Level Production** — levels produced in bounded ranges only after shared contracts/tooling are stable.
10. **Polish / QA / Release** — save/continue, restart UX, input/readability, pause/title/ending/credits, performance, regression tests, build validation, playtime tuning.

## Dependency policy

Do not start mass level production before the gameplay core and Level Lab contracts exist.

Preferred order:

`Director -> Runtime -> {Level Lab, Mechanics} -> {Art, FX, Story} -> Level Production -> Final QA`

Art/FX/story work may proceed in parallel once their contracts are stable. Level production may be parallelized by level-range ownership.

## Shared-core rule

Do not maintain a separate fake physics implementation for simulation. Gameplay runtime and headless/replay simulation must use the same authoritative stepping/math wherever feasible.

A target architecture is conceptually:

`step(world, input, dt) -> world'`

with fixed-timestep deterministic testing or replay around it.

If full extraction is too risky in one step, introduce characterization tests first, then migrate incrementally. The current physical feel is a compatibility constraint, not a refactoring opportunity.

## Level Lab requirements

The Level Lab should make future level changes cheap and observable. It should support, at minimum:

- data-driven level definitions;
- edit/reload without editing a giant component;
- immediate playtest;
- deterministic replay or scripted input playback;
- trajectory/debug visualization;
- clear mechanic-state visualization for development;
- validation reports stored as artifacts or machine-readable output.

Prefer multiple evaluators over multiple physics engines:

- **Reachability** — can a plausible input sequence clear the level?
- **Exploit hunter** — can the intended learning goal be bypassed trivially?
- **Noisy human** — inject timing/input error and estimate robustness/difficulty.
- **Mechanic verifier** — where practical, confirm that accepted routes actually exercise the intended mechanic(s).

Do not claim a solver proves fun. Solvers reject broken candidates and expose properties; human play remains authoritative for feel.

## Level-design loop

For generated or redesigned levels, use a loop similar to:

1. write level intent using `docs/LEVEL-DESIGN-GRAMMAR.md`;
2. generate a small candidate set;
3. reject impossible candidates;
4. reject accidental trivial bypasses unless clearly designated mastery shortcuts;
5. assess robustness under noisy input;
6. play the strongest candidates in the real runtime;
7. keep/tune one;
8. record why it was accepted.

Do not generate 25 levels at once and call the batch complete.

## SpriteGen policy

Reference repository: `https://github.com/aldegad/sprite-gen`.

Use SpriteGen as an external asset-generation/curation pipeline, not as a reason to vendor a large unrelated codebase into this repository.

Expected approach:

- install/use the skill or CLI in the Codex environment when available;
- establish and human-approve a protagonist base identity before producing all rows;
- generate state rows/frames, curate, then consume the resulting atlas + manifest in Blast Escape;
- preserve source prompts/request metadata needed to reproduce assets when practical;
- do not repair obvious identity drift by silently drawing over broken generated frames.

SpriteGen currently provides a base-image -> per-state generation -> chroma cleanup -> frame extraction -> curation -> atlas/manifest workflow and supports a Codex-backed generation path. Treat its own `SKILL.md` as authoritative when installed.

Veo or other video generation may be used only as motion/reference material unless a deterministic extraction pipeline is explicitly validated. Do not make the shipping runtime depend on a nondeterministic video generation service.

## Human-required decisions

Codex should proceed autonomously by default. It must stop and request human judgment when any of the following is reached:

1. **Protagonist identity approval** — before producing the full character animation set, present 2–4 viable base designs or a curation view and ask the human to choose/approve.
2. **Material visual direction change** — if the proposed pixel-art style, palette, silhouette, camera language, or environmental art direction meaningfully departs from the current approved visual bible.
3. **Hand-feel conflict** — if a requested architecture/tooling change cannot be completed without materially changing established movement/blast feel.
4. **Level-fun ambiguity** — if automated evaluators disagree or a level is technically valid but there are two meaningfully different play-feel directions. Ask for a playtest choice rather than guessing taste.
5. **Narrative ambiguity at the ending** — if implementation choices would alter the cancellation/open-door/player-control meaning.
6. **External generation choice/cost** — before using a paid/external generation service not already available/configured, when the choice incurs nontrivial cost or creates a new dependency.
7. **Release judgment** — before declaring the game final, request one human end-to-end playthrough and collect blockers/feel notes.

Human approval is NOT required for routine implementation, dependency installation already permitted by the environment, refactors inside contract boundaries, test fixes, level candidate rejection, or ordinary asset iteration before a curation checkpoint.

## Human-call protocol

A session that needs human judgment must not simply stop with a vague question. It must create/update `docs/coordination/HUMAN-CALLS.md` and print a concise `HUMAN CALL` block in its final/paused status.

Each call must contain:

- `ID`: stable identifier such as `HC-ART-001`;
- `Status`: `OPEN` or `RESOLVED`;
- `Owner`: goal/workstream;
- `Decision needed`: one sentence;
- `Why human`: why this is taste/judgment/external authority rather than an engineering question;
- `Options`: 2–4 concrete choices where possible;
- `Evidence`: screenshots, asset paths, level IDs, test reports, or commit refs;
- `Default if deferred`: what Codex will do if the human says "use your judgment";
- `Blocked work`: only what actually cannot proceed;
- `Unblocked work`: useful work that can continue in parallel.

Codex should continue all unblocked work instead of treating one human call as a global stop.

## Monitoring protocol

The repository itself is the shared state between long-running sessions. Do not rely on chat history as the project database.

Maintain:

- `docs/coordination/STATUS.md` — current phase, active goals, blockers, recent accepted outcomes;
- `docs/coordination/GOALS.md` — goal registry, dependencies, acceptance criteria, owner/session/branch when known;
- `docs/coordination/HUMAN-CALLS.md` — open/resolved human judgment requests;
- `docs/coordination/DECISIONS.md` — architectural/design decisions that later sessions must not rediscover casually.

Each active goal should update its row/checklist when it reaches a meaningful state transition, not on every tiny edit.

Suggested states:

`PROPOSED -> READY -> ACTIVE -> HUMAN_NEEDED -> VERIFYING -> DONE`

A goal may continue partial work while marked `HUMAN_NEEDED`; list the blocked subpart explicitly.

## Branch / file ownership

Parallel level designers must not casually edit shared runtime files.

Suggested ownership after the level schema exists:

- early curriculum: `levels/01-09/**`;
- middle curriculum: `levels/10-20/**`;
- synthesis/end: `levels/21-25/**`, ending-specific content;
- shared runtime/core: Runtime or Mechanics owner only;
- art source/generated assets: Art/Sprite owner;
- FX runtime: FX owner;
- coordination docs: Director may reconcile conflicts.

If a level designer needs a shared engine feature, record a request in `docs/coordination/ENGINE-REQUESTS.md` instead of implementing a one-off private engine fork.

## Completion gates

A final-game claim requires evidence for all of these:

- approximately 55–65 minutes median first-playthrough target, or documented evidence for a nearby better target;
- Levels 1–8 teach/refine blast traversal without gratuitous new systems;
- cold, heat, and magnetism each receive an understandable introduction and later recombination;
- no-jump identity remains intact;
- no dialogue/name exposition was introduced;
- final cancellation/open-door ending works and retains player agency;
- save/continue and fast restart work;
- title/pause/ending/credits exist at minimum quality;
- mute mode still has strong readable game feel;
- automated tests/build/lint pass;
- deterministic/replay validation exists for core physics/levels to the extent supported by the chosen architecture;
- one human end-to-end playthrough has been requested and its blockers addressed or explicitly waived.

## Starting a director `/goal`

A fresh director session should be given the final product goal, then instructed to read:

1. `AGENTS.md`
2. `docs/GOAL-ORCHESTRATION.md`
3. `docs/LEVEL-DESIGN-GRAMMAR.md`
4. `docs/coordination/STATUS.md`
5. `docs/coordination/GOALS.md`

It should then inspect the current repository, propose or update the goal graph, mark goals `READY` only when dependencies are satisfied, and execute/coordinate work without asking the human to manually decompose routine engineering tasks.
