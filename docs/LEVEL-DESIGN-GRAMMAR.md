# Blast Escape Level Design Grammar

This document is the source of truth for authoring new gameplay levels after Level 6.

The goal is to stop treating each level as a free-form coordinate search. Levels should be designed from a small set of explicit gameplay constraints first, then translated into geometry and timing values.

## Core principle

A Blast Escape level is not primarily a collection of platforms and bombs.

It is a **route graph made of blast arcs, timing windows, landing windows, recovery states, and optional mastery shortcuts**.

Author the intended route before tuning coordinates.

## Authoring order

For every new level, decide these in order:

1. **Primary route** — the intended sequence of launch, landing/intercept, and exit states.
2. **Launch job** — what each bomb is supposed to accomplish in that route.
3. **Landing window** — how forgiving the target surface should be.
4. **Timing window** — whether the player may wait, must commit immediately, or must arrive before a bomb/platform state changes.
5. **Recovery state** — whether a near-miss is recoverable, costly, or fatal.
6. **Mastery shortcut** — an optional faster route that rewards understanding but should not erase the primary route by accident.
7. **Geometry** — only after the above is fixed, choose coordinates and dimensions.
8. **Fine tuning** — adjust one parameter family at a time and re-test the intended route.

Do not begin by moving every coordinate until the level happens to work.

## Design parameters

When reasoning about a level, describe it with these parameters before editing raw coordinates.

### 1. Launch

For each bomb, define:

- launch origin;
- intended target region;
- expected launch direction;
- whether the blast should be close/strong or wide/forgiving;
- whether midair steering is required;
- whether the bomb starts ready, delayed, or already partway through its fuse.

The existing global physics remain authoritative. Prefer changing level geometry and bomb timing before changing global blast physics.

### 2. Landing window

Describe the target as one of:

- **wide** — the player should usually land if the idea is correct;
- **medium** — noticeable steering/positioning is required;
- **tight** — precision is the main challenge.

Difficulty should not default to tighter platforms. Later levels should increasingly get difficulty from route choice, timing, interception, residue, and chained consequences.

### 3. Timing window

Describe timing explicitly:

- **open** — the player may wait and retry the setup;
- **commit** — once launched, the next action must follow quickly;
- **intercept** — the player aims for a moving future state;
- **expiring** — a target/bomb becomes unusable if the player arrives too late.

Bomb `delay`, moving-platform phase, and geometry should support the named timing job instead of being tuned independently.

### 4. Recovery

Every difficult arc should intentionally answer: what happens to a near-miss?

Possible outcomes:

- clean success;
- recoverable intermediate platform;
- costly detour;
- immediate death.

A useful level often has more than binary success/failure. Recovery surfaces can make an arc demanding without making the level feel arbitrary.

### 5. Route hierarchy

Prefer a clear hierarchy:

- **primary route** — what a first successful player is expected to discover;
- **recovery route** — what happens after an imperfect but plausible execution;
- **mastery shortcut** — a faster or cleaner path that requires stronger understanding/execution.

A shortcut is good only when it is recognizable as mastery. If new players trigger it accidentally often enough to skip the level's main idea, it is not a shortcut; it is the de facto primary route.

## Tuning discipline

When a level is close but not working, do not change unrelated values together.

Tune in this order:

1. target width/position;
2. bomb position relative to player route;
3. bomb `delay` / moving phase;
4. recovery geometry;
5. exit placement;
6. only then reconsider global physics, and only if multiple levels expose the same problem.

After every change, test at least:

- intended clean route;
- plausible underpowered/late attempt;
- plausible overpowered/early attempt;
- mastery shortcut, if one exists.

The purpose is to find a stable playable window, not a single lucky trajectory.

## Level 7 reference — RETURN ARC

Level 7 is the first level that should be authored as a route composition rather than as one new isolated mechanic.

### Intent

Primary route:

`START -> B1 -> lower deck -> cross B2 before expiry -> B2 blast -> return arc -> exit`

Recovery route:

`B2 return arc -> intermediate upper platform -> exit`

Mastery shortcut:

`B1 -> exit directly`

The direct B1-to-exit route is intentionally allowed, but it should require a clean first arc. It must not be so forgiving that most first-time players skip B2 and never experience the return-arc idea.

### Current proposed geometry

```ts
{
  name: 'LEVEL 7',
  subtitle: 'RETURN ARC',
  hint: 'Take the wide lower deck and cross B2 before it blows. A clean first arc can reach the exit directly.',
  start: { x: 92, y: 514 },
  platforms: [
    { x: 0, y: 550, w: 330, h: 50 },
    { x: 400, y: 360, w: 135, h: 22 },
    { x: 400, y: 470, w: 390, h: 22 },
    { x: 0, y: 0, w: 960, h: 18 },
    { x: 0, y: 0, w: 18, h: 600 },
    { x: 942, y: 0, w: 18, h: 600 },
  ],
  bombs: [
    { x: 250, y: 532, delay: -2.5, label: 'B1' },
    { x: 700, y: 452, delay: -0.4, label: 'B2' },
  ],
  exit: { x: 430, y: 296, w: 54, h: 64 },
  pit: { x: 330, y: 470, w: 630, h: 130 },
}
```

### What Level 7 is testing

- B1 is not just a jump trigger; it commits the player to a route.
- The lower deck is intentionally wide: landing itself is not the main difficulty.
- B2 creates an **expiring timing window** on that wide surface.
- The second blast reverses traversal direction and produces the return arc.
- The upper platform acts as recovery for a slightly imperfect return.
- The direct B1-to-exit arc is a mastery shortcut.

### Validation questions

Before accepting Level 7, answer yes to all of these:

- Can a player understand that the lower/right side matters before committing to B1?
- Is landing on the lower deck reasonably forgiving when the launch idea is correct?
- Does B2 create urgency without requiring a frame-perfect arrival?
- Does the return arc feel like the intended solution rather than an accidental physics exploit?
- Does the upper platform rescue some near-misses without trivializing the return arc?
- Is the direct B1-to-exit route possible but uncommon for first-time play?

## Levels 8–10

Levels 8–10 should be authored by composing known grammar rather than by introducing large new systems every time.

Before implementation, write a short level intent using this template:

```text
LEVEL N — NAME
Primary route:
Launch job(s):
Landing window(s):
Timing window(s):
Recovery state:
Mastery shortcut:
New concept, if any:
What previous skills are recombined:
```

Then implement the smallest geometry that realizes that contract.

## Non-goals

This pass does **not** require:

- a new physics engine;
- automatic trajectory solving;
- procedural level generation;
- a generalized level-editor UI;
- refactoring every existing level into a new runtime schema;
- changing Levels 1–6 just to make their data look uniform.

If repeated authoring shows that the same measurements are useful across several future levels, they can later become helper code or tooling. For now, keep the runtime simple and make the design intent explicit.
