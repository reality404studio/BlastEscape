# G3D Magnetism / Level 20 Report 001

## Level intent

`LEVEL 20 — INDUCTION RAIL` introduces bounded overhead traversal:

`induction coil -> magnetic state -> B1 -> automatic rail capture -> hold right -> automatic rail-end release -> EXIT`

B1 only supplies vertical access. The rail carries the long horizontal crossing,
and release needs no button. Waiting exhausts the attachment over the void, so
the mechanic cannot become free flight.

## Authoritative implementation

- Player state now carries an optional magnetic attachment with interaction ID
  and remaining lifetime.
- A rising magnetic player entering a `magnetic-attach` capture rectangle snaps
  beneath its data-defined rail and emits `magnetic-attached`.
- Attached movement reuses existing horizontal acceleration/speed and constrains
  vertical position. Rail ends, attachment discharge, magnetic-state expiry, or
  missing rail data emit a reasoned `magnetic-released` event and restore gravity.
- Capture requires upward velocity, so an end release cannot immediately attach
  again while falling.
- Runtime renders induction sources, magnetic player state, rail power, and lock
  status from the same authoritative data/state used by replay.

## Validation evidence

| Check | Result |
| --- | --- |
| accepted route | PASS, 5.550s, magnetic + B1 + induction rail |
| automatic attachment | 3.467s while rising |
| automatic rail-end release | 5.167s, then normal gravity |
| route without magnetic source | B1 hits but falls short into the void |
| waiting after capture | attachment discharges and falls into the void |
| attached motion | y fixed to rail, vy zero, x responds to existing direction |
| magnetic-state expiry | releases an otherwise live attachment |
| constant left/neutral bypass | neither clears |
| 30/50/60/120/144Hz | accepted route clears on all schedules |

These checks establish capture direction, bounded movement, automatic release,
state/timer limits, reachability, and exploit rejection. They do not prove fun.

## Verification

- `npm test`: 77/77 passing.
- `npm run validate:levels`: Levels 8–20 PASS.
- `npm run lint`: passing.
- `npm run build`: passing.
- local development HTTP response: 200.
- artifact: `artifacts/level-validation/level-20.json`.
- interactive browser capture remains unavailable; the near-final human feel gate
  is still required.

## Gate result

G3D, G9C, and Level 20 are accepted. D-018 records the bounded automatic magnetic
rail contract. G10 is dependency-ready; Level 21 may extend the same authority to
a moving overhead carrier without adding free flight or another input.
