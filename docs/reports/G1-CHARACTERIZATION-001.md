# G1 Characterization Report 001

**Scope:** first extraction slice; no intended gameplay or visual change.

## Extracted boundaries

- `game/config.ts` — compatibility-locked gameplay constants.
- `game/types.ts` — level, bomb, player, and moving-platform data contracts.
- `game/levels.ts` — all eight existing level definitions.
- `game/physics.ts` — authoritative velocity integration, moving-platform phase,
  bomb initialization, horizontal velocity composition, and blast impulse math.
- `game/replays.ts` — Level 8 clean-route steering keyframes formerly hardcoded
  inside the movement function.

The browser runtime imports and consumes each of these modules.

## Characterization evidence

`tests/legacy-characterization.test.ts` locks:

- all current movement/blast constants;
- grounded and airborne acceleration/retention/gravity examples;
- direct and offset blast impulse results;
- blast-radius rejection;
- Level 6 moving-platform phase/direction;
- locked Level 7 bomb/exit/spike geometry;
- Level 8 fuse timings and demo steering switch boundaries.

An independent extraction comparison confirmed that all eight data definitions
match the pre-extraction runtime exactly as serialized objects.

## Verification

- `npm test`: 7/7 passing.
- `npm run lint`: passing.
- `npm run build`: passing.
- local route: HTTP 200 after HMR reload.
- interactive visual capture: pending because no in-app or extension browser was
  available in this environment.

## Next G1 slice

Move collision, hazard, bomb-step, combo, death, and exit logic into one
authoritative world-step API used by both the browser runtime and headless replay.
Preserve the current clamped outer-frame and three-substep order while doing so.
