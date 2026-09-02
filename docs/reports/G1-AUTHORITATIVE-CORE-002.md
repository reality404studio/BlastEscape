# G1 Authoritative Core Report 002

**Scope:** extract the remaining gameplay decisions from the browser component
without changing constants, level data, or scheduling order.

## Shared core

`game/core.ts` now owns:

- three movement/collision substeps per outer frame;
- static and moving-platform collision;
- spike collision;
- grounded/combo transitions;
- bomb countdown, repeat, and blast application;
- combo-gated exit checks;
- fall death;
- ordered gameplay events for movement, landing, explosions, clear, and death.

The React/canvas runtime calls `stepGameplay`. Presentation consumes its events
to produce random debris, flashes, camera shake, trajectory traces, and UI state.
Random values no longer sit inside the authoritative gameplay path.

## Replay evidence

The Level 8 clean-route input track drives the same `stepGameplay` function in
headless tests and in the runtime demo.

| Frame schedule | Result | Combo | Exit time |
| --- | --- | --- | --- |
| 144 Hz | clear | 5 | 4.4167s |
| 120 Hz | clear | 5 | 4.4167s |
| 60 Hz | clear | 5 | 4.4333s |
| 50 Hz | clear | 5 | 4.4000s |
| 30 Hz | clear | 5 | 4.4333s |

Constant left, neutral, and constant right inputs do not clear Level 8 in the
eight-second evaluation window. The earlier grammar value of 4.20s was stale and
has been reconciled with these current-runtime measurements.

## Verification

- `npm test`: 10/10 passing.
- `npm run lint`: passing.
- `npm run build`: passing.
- movement-before-bomb event order is explicitly tested.
- local visual capture remains pending because no browser backend is available.

## Gate result

G1 is complete for dependency purposes: runtime and headless validation now share
authoritative gameplay logic, and compatibility behavior is protected by tests.
Future fixed-timestep adoption remains optional and must satisfy D-008 rather
than reopening this extraction gate.
