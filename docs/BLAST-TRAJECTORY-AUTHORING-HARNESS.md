# Blast Trajectory & Level-Authoring Harness

## Why this exists

Level 7 exposed a runtime/authoring problem that coordinate tuning alone should not solve.

The current game has enough mechanics to build interesting levels, but the authoring loop is still mostly:

1. place bombs/platforms/hazards with absolute coordinates;
2. run the level;
3. discover an unintended shortcut or weak route;
4. move several coordinates/timers;
5. repeat.

That was tolerable while levels were mostly single-launch or simple ascending routes. `LEVEL 7 / RETURN ARC` is the first level where several blast arcs have different jobs in sequence. The search cost rose sharply because the engine does not yet preserve or expose the distinctions the level designer is trying to reason about.

This contract addresses that before Levels 8–10 add more moving geometry or timing interactions.

---

## Problem 1 — blast horizontal momentum is clamped as if it were run speed

Today `player.vx` represents both:

- horizontal velocity produced by player control; and
- horizontal impulse produced by a blast.

`movePlayer()` then clamps the combined value to `CONFIG.maxRunSpeed` every movement step.

This means a large horizontal blast impulse can be reduced to normal run speed on the following simulation step. Different blast distances/angles therefore converge much sooner than the authored launch geometry suggests.

For a game whose main rule is blast-driven movement, this makes blast placement less expressive and pushes later levels toward hazard placement and corrective air steering to create difficulty.

### Required change

Separate **control velocity** from **blast momentum** conceptually and in runtime state.

A minimal acceptable shape is:

```ts
player.controlVx
player.blastVx
player.vy
```

Equivalent naming is fine.

Rules:

- `controlVx` is affected by A/D or arrow input and remains capped by `maxRunSpeed`.
- `blastVx` receives horizontal explosion impulse and is **not** immediately capped to `maxRunSpeed`.
- horizontal movement uses the sum of the two components.
- `blastVx` decays predictably over time rather than disappearing in one frame.
- landing/ground contact may damp blast momentum more aggressively than airborne motion if needed for readability.
- a solid horizontal collision must not allow stored blast momentum to keep pushing the player through a wall.
- vertical blast behavior should remain unchanged unless a concrete bug requires otherwise.

Do not simply raise `maxRunSpeed`. The point is to preserve the distinction between voluntary movement and externally applied momentum.

### Tuning principle

Use the smallest number of new global parameters possible. Prefer one airborne decay term and, only if necessary, one grounded decay term.

Do not retune every level in the same commit. First make the physical rule coherent, then smoke-test existing levels and record which ones actually require follow-up geometry/timing changes.

---

## Problem 2 — level authors cannot see the trajectory they are tuning

The existing `G` debug mode shows instantaneous velocity, blast radius, timers and launch vectors, but not the **resulting path through the level**.

For composed routes this is insufficient. A designer currently has to remember several runs and infer why one route skipped a platform or why another became too forgiving.

### Required first-pass harness

Extend the existing `G` debug mode with a lightweight **trajectory trace**.

Minimum behavior:

- when a blast successfully affects the player, begin a trace for that blast launch;
- sample the player's center position while airborne;
- end the trace on meaningful landing, death/reset, level change, or a reasonable sample/time limit;
- keep a small bounded number of recent traces so repeated attempts can be compared visually;
- identify the originating bomb (`B1`, `B2`, etc.) in debug information;
- keep the overlay debug-only and visually subordinate to gameplay.

This first pass does **not** need to predict every possible trajectory or solve the level automatically. It should make actual trial-and-error observable.

### Preferred follow-up, not required in this PR

Once actual traces are useful and stable, a later tool may add sampled reachability probes (for example: close/mid/far launch positions × left/neutral/right held input). Do not build that solver before the runtime momentum model is trustworthy.

---

## Problem 3 — level intent exists only in prose and coordinates

`RETURN ARC` has a meaningful sequence — launch right, return left, finish toward the exit — but runtime level data only stores object coordinates and timers.

Do **not** build a new event system in this PR. Instead reserve a small optional authoring-only metadata shape so later tooling can describe intended beats without changing gameplay.

Example direction:

```ts
beats?: [
  { bomb: 'B1', job: 'launch-right' },
  { bomb: 'B2', job: 'return-left' },
  { bomb: 'B3', job: 'finish' },
]
```

Exact schema is intentionally not fixed here. If adding it would make this PR significantly larger, leave it for a follow-up. The physics separation and trajectory trace are the priority.

---

## Scope

### In scope

- separate voluntary horizontal control speed from blast-created horizontal momentum;
- add controlled decay for blast horizontal momentum;
- ensure collision/landing behavior remains stable;
- extend existing `G` debug mode with recent blast trajectory traces;
- show enough debug information to distinguish control velocity, blast momentum and total horizontal velocity;
- smoke-test Levels 1–7 after the physics change;
- document any level that now exposes a real balance problem instead of silently compensating with geometry changes.

### Out of scope

- new level mechanics;
- Level 8 design;
- moving walls/openings;
- procedural level generation;
- full reachability solver;
- editor UI;
- broad entity/component refactor;
- retuning Levels 1–7 merely to preserve the exact old feel;
- visual-polish work covered by PR #1;
- route-authoring grammar covered by PR #2.

---

## Acceptance criteria

### Physics

- A horizontal blast impulse greater than `maxRunSpeed` remains observably greater than run speed for more than one simulation step.
- Holding a movement key still cannot make the voluntary/control component exceed `maxRunSpeed`.
- Close and far blast setups produce meaningfully different horizontal arcs when their calculated impulses differ.
- Stored blast momentum cannot tunnel/push through a solid wall after collision.
- Landing does not create an uncontrollable long ground slide.

### Debug harness

With `G` enabled:

- a successful blast launch leaves a visible trajectory trace;
- successive attempts can be compared without unbounded memory growth;
- traces are cleared appropriately on level change/reset;
- debug text distinguishes control horizontal velocity, blast horizontal momentum and total horizontal velocity;
- normal gameplay with `G` disabled gains no visible overlay.

### Regression smoke test

Manually inspect at minimum:

1. Level 1 — basic chained ascent still teaches blast positioning;
2. Level 2 — opening remains steerable and launch distance matters;
3. Level 4 — airborne combo remains possible;
4. Level 5 — hazard route remains readable;
5. Level 6 — moving-platform interception still works;
6. Level 7 — B1/B2/B3 arcs remain distinct and unintended direct routes are evaluated explicitly rather than hidden by immediate velocity clamping.

Verification:

```text
npm run lint
npm run build
git diff --check
```

---

## Implementation order

1. Introduce separated horizontal velocity components without changing level data.
2. Make collision and reset paths clear both components correctly.
3. Tune blast-momentum decay using Levels 1–7; avoid per-level exceptions.
4. Add debug readout for the separated components.
5. Add bounded actual-trajectory tracing to `G` debug mode.
6. Smoke-test Levels 1–7 and record any genuine balance regressions for follow-up.

The goal is not to make Level 7 easier. The goal is to make blast geometry **expressive, inspectable and tunable** so later level design is not forced to compensate for hidden runtime convergence.
