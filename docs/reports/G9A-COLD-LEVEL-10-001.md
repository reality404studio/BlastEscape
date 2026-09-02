# G9A Cold / Level 10 Report 001

## Level intent

`LEVEL 10 — CONDENSATE GAP` adds one cold application and then returns to known
blast play:

`START -> coolant -> freeze condensate -> cross temporary ice -> B1 at right wall -> steer left -> EXIT`

- Cold contact at the dripping edge freezes the full water span.
- The bridge and upper landing are wide; creation and expiry are the lesson.
- The far bank is stable, while an underpowered crossing enters the water.
- B1 reuses the readable right-wall launch from Level 9.
- Machinery stabilization remains reserved for Level 11.

## Authoritative implementation

- `freeze-water` interactions can declare a data-defined `resultRect`.
- While the interaction is active, `stepGameplay` includes that rectangle in its
  normal collision set and suppresses only linked water hazards.
- Interaction expiry removes collision and protection before movement continues;
  a player left on the thawing span falls into water deterministically.
- Runtime rendering reads the same interaction state for water/ice feedback and
  does not influence simulation.

## Validation evidence

| Check | Result |
| --- | --- |
| accepted route | PASS, 4.350s |
| required state | cold acquired |
| required interaction | `condensate-freeze` accepted |
| required blast | B1 hit |
| constant left/neutral/right bypass | none clear |
| ±100ms switch jitter | 100/100 clear |
| steering switch window | 3.2–3.9s tested clear |
| same replay without coolant source | dies on `water` |
| bridge expiry while occupied | interaction expires, then water death |

The replay lands once with a 1X blast. These checks reject broken routes and
mechanic bypasses; they do not claim to prove fun.

## Verification

- `npm test`: 25/25 passing.
- `npm run validate:levels`: Levels 8–10 PASS.
- `npm run lint`: passing.
- `npm run build`: passing.
- artifacts: `artifacts/level-validation/level-8.json`, `level-9.json`, and
  `level-10.json`.
- visual browser capture remains unavailable; the final human feel gate remains
  open for the near-final build.

## Gate result

The Level 10 slice is accepted. The shared temporary-surface contract is stable
enough for later cold route/expiry variations. G9A remains active and Level 11
may introduce cold machinery stabilization as its one new curriculum concept.
