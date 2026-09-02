# G3B Cold / Level 9 Report 001

## Level intent

`LEVEL 9 — COLD START` introduces exactly one cold application before returning
to known blast play:

`START -> coolant source -> cool HOT PLATE -> cross -> B1 at right wall -> steer left above deck -> EXIT`

- The coolant source is unavoidable, safe, and refreshable.
- Cold makes one visibly overheated floor plate temporarily safe.
- The cooled crossing is broad; it does not test precision.
- B1 reuses proximity and air steering after the new state is understood.
- Water freezing remains reserved for Level 10.

## Authoritative implementation

- Accepted typed interactions can now activate a timed runtime interaction state.
- The hot-surface hazard checks that shared state after contact resolution, so
  cold contact safely cools the plate while neutral contact kills immediately.
- Interaction activation/expiry stays in `stepGameplay`; rendering only reads the
  result to show red `OVERHEAT` or blue `PLATE COOLED` feedback.
- The player receives a restrained blue cold outline; the coolant gate and hot
  plate remain readable without sound.

## Validation evidence

| Check | Result |
| --- | --- |
| accepted route | PASS, 4.350s |
| required state | cold acquired |
| required interaction | `hot-plate-cooling` accepted |
| required blast | B1 hit |
| constant left/neutral/right bypass | none clear |
| ±100ms switch jitter | 100/100 clear |
| steering switch window | 3.2–3.9s tested clear |
| same replay without coolant source | dies on `hot-surface` |

The replay lands once with a 1X blast and does not require a frame-perfect cold
or steering action. This is technical/curriculum evidence, not a claim that
automation proves fun.

## Verification

- `npm test`: 21/21 passing.
- `npm run validate:levels`: Levels 8 and 9 PASS.
- `npm run lint`: passing.
- `npm run build`: passing.
- artifacts: `artifacts/level-validation/level-8.json` and `level-9.json`.
- visual browser capture remains unavailable; a human feel pass is still required
  at the release gate, not at this routine implementation step.

## Gate result

G3B is complete for its current dependency gate and G8B Level 9 is complete.
The cold source/state/accepted-interaction path is stable enough for bounded
Levels 10–14 work. Level 10 should add water freezing as the next single concept.
