# Blast Escape — Prototype Audit

**Audit baseline:** merge commit `5c02443795bca2db31e8faf02235a2bdc21a1c5b`
on `feat/level-8-and-progression`, 2026-08-30.

## Verified working

- Vinext/React client route builds for Cloudflare-compatible output.
- `npm run lint` passes.
- `npm run build` passes.
- Levels 1–8 exist and Level 8 advances correctly after a clear.
- The level-design grammar documents and locks Level 7, and records measured
  Level 8 route/robustness evidence.
- Left/right movement, separate blast momentum, air steering, timed bombs,
  moving platform, spikes, pit death, combo-gated exit, restart, trajectory
  debug view, and a scripted Level 8 demo exist.
- Existing industrial visual direction and social preview metadata are coherent.

## Structural reality

- `app/blast-escape.tsx` is approximately 1,300 lines and owns level data,
  mutable gameplay state, input, physics, collision, timers, effects, canvas
  rendering, level navigation, and the scripted demo.
- There is no shared headless gameplay core, replay format, Level Lab, validator,
  save/continue, pause/title/credits flow, or automated test suite.
- Gameplay uses render-frame `dt` clamped to 34 ms with three movement/collision
  substeps. Bombs tick once per outer frame. This is not yet a fixed-timestep
  simulation.
- Gameplay formulas are closed inside the React effect, so they cannot be tested
  without extraction.
- Presentation uses `Math.random`; it currently affects particles and shake only,
  but the gameplay/presentation boundary is implicit.
- The Level 8 demo is special-case steering logic inside the production movement
  function rather than a reusable replay.
- All levels are directly selectable and completion is memory-only.

## Contract mismatches

- Only 8 of the planned ~25 levels exist.
- Cold, heat, and magnetism do not exist.
- Final clear freezes normal gameplay and displays `ALL CLEAR` /
  `EVERY DIRECTIVE COMPLETE`; it does not implement the cancellation,
  open-door, player-controlled ending.
- The robot is drawn procedurally and has no approved pixel-sprite identity or
  SpriteGen pipeline.
- The runtime can display debug trajectories but cannot emit machine-readable
  validation reports.
- No automated evidence currently guards the established hand-feel.

## Immediate conclusion

G0 must establish executable contracts, then G1 must characterize and extract
the existing authoritative gameplay path before mass level or sprite production.
The safest first slice is pure level data plus deterministic gameplay helpers and
golden characterization tests, consumed by the existing runtime without changing
coordinates, constants, or update order.

## Audit limitation

The local server returned HTTP 200, but no in-app or extension browser was
available in this Codex environment during the audit. Visual/interactive browser
capture remains pending; this does not block pure-core characterization, lint, or
build work.
