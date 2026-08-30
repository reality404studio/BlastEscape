# G9A Cold / Level 12 Report 001

## Level intent

`LEVEL 12 — THAW CLOCK` adds no mechanic. It makes the existing ice lifetime
load-bearing against an existing bomb cycle:

`START -> coolant -> freeze trench -> race to far stop -> first-cycle B1 -> steer left -> EXIT`

- The trench and exit deck are wide; urgency replaces precision.
- The ice thaws shortly after B1's useful first fuse while the player is airborne.
- A late approach may survive the weak first blast but cannot stand until B1 repeats.
- The start floor is safe before freezing; commitment removes recovery.
- Cold-created recovery remains reserved for Level 13.

## Authoritative implementation

- Level 12 uses the existing `freeze-water` result rectangle, interaction timer,
  linked water hazard, repeated bomb fuse, and normal blast physics unchanged.
- The static far stop pins the launch location without adding a new input.
- Existing runtime ice/water feedback renders the new data; no Level 12-only
  presentation or simulation path was added.

## Validation evidence

| Check | Result |
| --- | --- |
| accepted route | PASS, 5.000s |
| required state | cold acquired |
| required interaction | `thaw-clock-freeze` accepted |
| required blast | first B1 hit |
| constant left/neutral/right bypass | none clear |
| ±80ms switch jitter | 100/100 clear |
| reversal window | 4.12–4.27s tested clear |
| frame schedules | 30/50/60/120/144Hz clear |
| same replay without coolant | dies on `water` before B1 |
| 1.4s delayed route | hits first B1, lands back on ice, then dies on thaw |
| delayed route with only ice lifetime extended | survives to second B1 and clears at 10.583s |

The extended-lifetime control isolates the route timer: geometry, inputs, bomb
cycle, and physics stay the same. These checks do not claim to prove fun.

## Verification

- `npm test`: 35/35 passing.
- `npm run validate:levels`: Levels 8–12 PASS.
- `npm run lint`: passing.
- `npm run build`: passing.
- artifacts: `artifacts/level-validation/level-8.json` through `level-12.json`.
- visual browser capture remains unavailable; the near-final human feel gate is
  still required.

## Gate result

The Level 12 slice is accepted without a new engine request or durable mechanic
decision. G9A remains active and Level 13 may now use cold-created geometry as an
intentional recovery state as well as part of the primary route.
