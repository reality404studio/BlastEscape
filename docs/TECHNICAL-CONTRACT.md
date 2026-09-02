# Blast Escape — Technical Contract

## Current baseline

The audited prototype is a Vinext/React/TypeScript canvas game. At audit time,
`app/blast-escape.tsx` contains level data, input, mutable world state, collision,
blast response, effects, rendering, and debug/demo tooling in one client
component. The production build and lint pass, but there is no automated test or
headless gameplay path.

## Compatibility contract

Until characterization evidence says otherwise, preserve these existing rules:

- world: `960 x 600`; player collider: `26 x 36`;
- horizontal control velocity and blast velocity are separate and additive;
- grounded/air acceleration: `1900 / 760`; control-speed cap: `275`;
- ground friction: `0.8`; blast ground/air retention: `0.68 / 0.985`, each
  applied exponentially against a 60 Hz reference;
- gravity: `1180`; maximum fall speed: `920`;
- blast radius: `154`; base/min/max impulse: `830 / 370 / 900`;
- blast vertical bias: `58`;
- bomb fuse/repeat: `4.8 / 5.6` seconds plus per-level delay;
- the current update order is movement/collision, bomb countdown/explosion,
  completion/death, then presentation-only effect aging;
- one rendered frame currently clamps elapsed time to `34 ms` and divides player
  movement into three collision substeps.

Changing any of these or their update order is a hand-feel change. It requires
before/after replay evidence across representative levels and, when materially
noticeable, a human feel call.

## Target boundaries

The migration should converge incrementally on these modules without a big-bang
rewrite:

1. **Level data** — typed, side-effect-free definitions separate from React.
2. **Authoritative gameplay core** — deterministic world state and gameplay
   stepping, including collision, bombs, blast impulse, exits, hazards, moving
   platforms, and temporary traversal states.
3. **Input/replay adapter** — left/right/restart/pause input encoded as timestamped
   or tick-addressed records.
4. **Runtime adapter** — browser scheduling, React state, canvas/audio output.
5. **Presentation state** — particles, screen shake, and other non-authoritative
   effects may remain nondeterministic and must never affect gameplay results.
6. **Level Lab/evaluators** — drive the authoritative core; never duplicate its
   physics formulas.

## Determinism and time

- Gameplay logic must not call `Math.random`, read DOM state, or depend directly
  on `performance.now`.
- Random presentation effects remain outside authoritative state.
- First extract the existing clamped-frame/three-substep behavior unchanged and
  characterize it. Do not switch integration strategy merely for architectural
  elegance.
- A fixed-step or replay clock may be adopted only after it reproduces accepted
  trajectories within documented tolerances and the browser runtime consumes the
  same step function as tests/evaluators.

## Level-data contract

A level definition includes identity and intent metadata plus start, static and
moving geometry, hazards, bombs, exit conditions, mechanics, and validation
expectations. Authoring intent follows `docs/LEVEL-DESIGN-GRAMMAR.md` and is not
hidden solely in coordinates.

Legacy Levels 1–8 should migrate without coordinate or timing changes unless a
specific level goal supplies evidence for a retune. Level 7's locked geometry is
a hard regression fixture.

## Test and evidence contract

Each runtime/core change should provide the smallest relevant set of:

- formula/unit tests for movement, blast impulse, collision, timers, and state;
- golden replay results for known clean routes and plausible near-misses;
- frame-schedule comparisons at 30/50/60/120/144 Hz where applicable;
- level validation reports for reachability, exploit, noisy-human robustness,
  and intended-mechanic use;
- lint and production build;
- browser/playable evidence for user-visible flows when a browser is available.

Automated solvers may reject bad candidates. They do not prove fun.

## Runtime and release constraints

- Preserve the existing package manager, Vinext/React structure, Cloudflare
  Worker-compatible ESM output, and `.openai/hosting.json` unless evidence makes
  a migration necessary.
- Prefer focused product code over new dependencies. Pin and validate any new
  package before adoption.
- Save/continue may use device-local storage because progress is local game state;
  no account, database, or network service is required.
- Shipping runtime must not depend on SpriteGen, ImageGen, Veo, or another
  nondeterministic generation service.
