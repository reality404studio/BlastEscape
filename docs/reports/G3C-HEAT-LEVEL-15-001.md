# G3C Heat / Level 15 Report 001

## Level intent

`LEVEL 15 — THERMAL SEAL` introduces heat through one unmistakable obstruction:

`START -> furnace duct -> heat -> melt sealed partition -> B1 -> upper deck -> EXIT`

The seal is solid and stops the player safely until touched while carrying heat.
After that single lesson, the level returns to the familiar right-wall B1 launch
and a broad leftward landing. There is no mastery bypass in the introduction.

## Authoritative implementation

- Heat uses the existing mutually exclusive traversal-state slot, acquisition,
  replacement, lifetime, contact, and debug contracts.
- A typed meltable barrier links to a `melt-barrier` interaction. The shared core
  includes the barrier in collision only while that interaction is inactive.
- Interaction expiry restores collision before the next movement substep.
- Canvas rendering reads the same source, interaction, and barrier state to show
  the furnace, red player-state outline, sealed partition, and open residue.
- No physics constant, bomb timing, Level 1–14 geometry, or one-off Level 15
  controller changed.

## Validation evidence

| Check | Result |
| --- | --- |
| accepted route | PASS, 4.350s, heat + seal melt + B1 |
| constant left/neutral/right bypass | none clears |
| ±100ms timing noise | 100/100 clear |
| same forward input without heat | stopped left of the solid seal |
| cold substituted for heat | rejected and stopped left of the seal |
| no-heat control with barrier removed | clears, proving the barrier is load-bearing |
| melt expiry at the threshold | seal collision restores before movement |
| post-lesson steering samples | four switch times from 3.2–3.9s clear |

These checks establish reachability, state selectivity, load-bearing geometry,
expiry order, exploit rejection, and broad input tolerance. They do not prove fun.

## Verification

- `npm test`: 50/50 passing.
- `npm run validate:levels`: Levels 8–15 PASS.
- `npm run lint`: passing.
- `npm run build`: passing.
- local development HTTP response: 200.
- artifact: `artifacts/level-validation/level-15.json`.
- interactive browser capture remains unavailable; the near-final human feel gate
  is still required.

## Gate result

G3C and Level 15 are accepted. D-015 records the shared timed barrier-melt rule.
G9B may proceed to Level 16, adding dormant charge or machinery reactivation only
through the shared core and explicit level data.
