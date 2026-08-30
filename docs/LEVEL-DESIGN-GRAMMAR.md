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

### Shipped geometry (locked)

Level 7 is **confirmed by playtest and locked**. The block below is copied from
`app/blast-escape.tsx` and must be kept in sync with it. Do not re-tune these
coordinates without an explicit instruction to change the level.

```ts
{
  name: 'LEVEL 7',
  subtitle: 'RETURN ARC',
  hint: 'Clear the hanging teeth after B1. Return left with B2, then launch from the left side of B3.',
  start: { x: 92, y: 514 },
  platforms: [
    { x: 0, y: 550, w: 330, h: 50 },
    { x: 40, y: 140, w: 210, h: 22 },
    { x: 250, y: 300, w: 250, h: 22 },
    { x: 400, y: 470, w: 390, h: 22 },
    { x: 360, y: 70, w: 140, h: 20 },
    { x: 0, y: 0, w: 960, h: 18 },
    { x: 0, y: 0, w: 18, h: 600 },
    { x: 942, y: 0, w: 18, h: 600 },
  ],
  bombs: [
    { x: 250, y: 532, delay: -2.5, label: 'B1' },
    { x: 680, y: 452, delay: -0.2, label: 'B2' },
    { x: 400, y: 282, delay: 1.9, label: 'B3' },
  ],
  exit: { x: 120, y: 76, w: 54, h: 64 },
  spikes: [
    { x: 250, y: 322, w: 70, h: 58 },
    { x: 360, y: 90, w: 140, h: 70 },
  ],
  pit: { x: 330, y: 470, w: 630, h: 130 },
}
```

The shipped level differs from the two-bomb sketch this document originally
carried. It uses three bombs, adds two hanging spike strips, and moves the exit
to the upper **left** so the return arc has somewhere to return to.

Route, as the level itself states it:

`START -> B1 (clear the hanging teeth) -> lower deck -> B2 returns left -> upper platform -> launch from the LEFT side of B3 -> exit at upper left`

Measured property: the B1 launch mark is forgiving. Every launch position
between roughly x 266 and x 318 lands on the lower deck, which is what the
"wide landing window" note below is describing.

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

### Level 8 — AIR SLALOM (shipped)

```text
LEVEL 8 — AIR SLALOM
Primary route: START -> hold right into the launch post -> B1 -> steer right into B2 -> reverse left into B3 -> steer right into B4 -> reverse left into B5 -> drive right through EXIT
Launch job(s): B1 lifts off the deck; B2 and B4 sit to the robot's right and knock it left; B3 and B5 sit to its left and knock it right; each relay also re-lifts, so the chain climbs.
Landing window(s): None. There is no intermediate landing; the airborne exit is the only completion window.
Timing window(s): Commit/expiring. The five fuses fire 0.42s apart and cannot be waited out.
Recovery state: Fatal. A missed relay drops the robot into the pit. The whole chain recycles every 5.6s, so a death is a short wait, not a dead end.
Mastery shortcut: None. Mastery is a low-correction line that hits all five relays near their centres.
New concept, if any: A fully airborne slalom with no platform reset between blast decisions, and an exit that only opens at 5X.
What previous skills are recombined: Level 2 air steering, Level 4 air chaining, Level 7 direction reversal.
```

The launch post at the end of the deck (`{ x: 470, y: 508, w: 14, h: 42 }`) is
load-bearing design, not decoration. It pins the launch position, so the
level's difficulty lives entirely in the five steering decisions instead of in
standing on an unmarked pixel — which is what the "difficulty should not
default to tighter platforms" rule above asks for.

**Why the vertical bias governs relay placement.** A blast pushes the robot up
only while `playerCentreY < bombY + explosionVerticalBias` (58px). Below that
line the same blast drives it *down*. The first draft of this level placed B4
and B5 above the robot's reachable arc, so those relays hammered the player
into the pit instead of lifting them, and no input sequence could clear it.
Every relay must therefore sit at or below the robot's expected arrival point.

Measured behaviour of the shipped geometry:

| property | value |
| --- | --- |
| clean route | clears at 5X; enters the exit at ~4.40–4.43s across measured frame schedules |
| holding one direction throughout | fails (right falls, left never opens the exit) |
| flipping any single steering decision | fails — all five inputs are load-bearing |
| uniform reaction lag tolerance | clears up to +150ms |
| practical clear rate, +-30ms per-switch jitter | ~70% |
| practical clear rate, +-80ms per-switch jitter | ~40% |
| frame rates 144Hz / 120Hz / 60Hz / 50Hz / 30Hz | clears on all through the shared authoritative core |

The repository's deterministic Level Lab currently reports 96% at ±30ms and
51% at ±80ms over 100 seeded runs. That evaluator perturbs switch times around an
otherwise ideal route; the earlier practical figures include broader execution
error and remain a different measurement rather than a contradiction.

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

### Level 10 — CONDENSATE GAP (accepted intent)

```text
LEVEL 10 — CONDENSATE GAP
Primary route: START -> coolant source -> freeze condensate -> cross the temporary ice -> B1 -> upper exit deck -> EXIT
Launch job(s): B1 lifts from the far side of the frozen crossing to the upper exit deck.
Landing window(s): The frozen bridge is wide; the upper exit deck is wide because temporary traversal, not precision landing, is the lesson.
Timing window(s): The bridge is expiring but lasts long enough for a readable, non-frame-perfect crossing.
Recovery state: Falling short of the far bank enters the water and resets; reaching the bank is stable.
Mastery shortcut: None. The cold-created route must remain load-bearing.
New concept, if any: Accepted cold contact freezes one water span into a temporary collision surface.
What previous skills are recombined: cold acquisition, blast proximity, midair steering.
```

### Level 11 — COLD LOCK (accepted intent)

```text
LEVEL 11 — COLD LOCK
Primary route: START -> coolant source -> stabilize transfer carriage -> B1 -> locked carriage -> right inspection deck -> EXIT
Launch job(s): B1 launches from the left floor onto the carriage held at its marked dock.
Landing window(s): The locked carriage is wide and directly adjoins the right deck; reading the machine state matters more than precision.
Timing window(s): The lock is expiring but lasts through the prepared B1 launch and crossing; the unstabilized carriage continues its normal cycle.
Recovery state: Missing the locked carriage falls into the machinery pit; the start floor remains safe before commitment.
Mastery shortcut: None. The stabilized carriage must remain load-bearing in this introduction.
New concept, if any: Accepted cold contact temporarily fixes one moving factory carriage at a data-defined docking position.
What previous skills are recombined: cold acquisition, blast proximity, broad landing.
```

### Level 12 — THAW CLOCK (accepted intent)

```text
LEVEL 12 — THAW CLOCK
Primary route: START -> coolant source -> freeze long condensate trench -> cross to launch stop -> B1 before thaw -> steer left -> upper exit deck -> EXIT
Launch job(s): B1 launches from the far end of the frozen route after the player commits to the expiring surface.
Landing window(s): The frozen crossing and upper exit deck are wide; urgency, not narrow geometry, is the challenge.
Timing window(s): The ice is genuinely expiring relative to B1's first fuse. A late approach misses that blast and thaws before the next cycle.
Recovery state: The start floor is safe before freezing; once committed, missing B1 or lingering on the trench is fatal.
Mastery shortcut: None. The first-cycle blast and frozen route remain load-bearing.
New concept, if any: None; this makes the existing freeze-water lifetime consequential during a blast route.
What previous skills are recombined: cold acquisition, temporary ice, prepared blast timing, midair reversal.
```

### Level 13 — COLD CATCH (accepted intent)

```text
LEVEL 13 — COLD CATCH
Primary route: START -> coolant source -> freeze catch basin -> B1 -> upper exit deck -> EXIT
Launch job(s): B1 launches from the frozen approach directly to the exit deck; B2 relaunches an over-braked B1 attempt from the lower ice recovery route.
Landing window(s): The upper exit deck is medium-wide; the frozen basin is a wide catch for a plausible short arc.
Timing window(s): B1 is a prepared commit. The ice lasts long enough for one B2 recovery attempt instead of turning every miss into immediate death.
Recovery state: An over-braked B1 arc lands on the same cold-created surface used for approach, then routes through B2 to the exit deck.
Mastery shortcut: None. A clean B1 route is simply faster; recovery remains intentional rather than secret.
New concept, if any: None; existing frozen geometry now supports both the primary route and a distinct recovery route.
What previous skills are recombined: temporary ice, blast landing control, secondary blast recovery, midair steering.
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
