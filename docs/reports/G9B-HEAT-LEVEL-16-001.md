# G9B Heat / Level 16 Report 001

## Level intent

`LEVEL 16 — REIGNITION` teaches heat as factory power rather than another door:

`START -> furnace heat -> ignition terminal -> power dormant B1 -> right wall -> B1 -> upper deck -> EXIT`

B1 visibly begins its paused fuse only after the heated player touches the
ignition terminal. Stable floor and a broad upper deck keep the new cause/effect
relationship isolated from landing difficulty.

## Authoritative implementation

- Bomb data may link to a `reactivate-charge` interaction.
- The shared core advances a linked bomb's existing timer only while that
  interaction is active. Expiry pauses progress without resetting it.
- Runtime and core use the same `bombIsPowered` helper. The ignition terminal,
  dormant styling, fuse display, explosions, replay, and validation therefore
  observe one state.
- Existing unlinked bombs remain powered by default; their timing and all prior
  levels are unchanged.

## Validation evidence

| Check | Result |
| --- | --- |
| accepted route | PASS, 5.250s, heat + ignition + B1 |
| constant left/neutral/right bypass | none clears |
| ±100ms timing noise | 100/100 clear |
| same route without heat | timeout, zero B1 explosions |
| cold substituted for heat | timeout, zero B1 explosions |
| two seconds of dormant world time | B1 timer remains exactly at its initial value |
| active ignition interval | B1 timer decreases by the same authoritative `dt` |
| ignition expiry | timer pauses on the expiry step without reset |
| post-ignition steering samples | four reversal times from 4.2–4.8s clear |

These checks establish state selectivity, paused-fuse timing, expiry order,
reachability, exploit rejection, and input tolerance. They do not prove fun.

## Verification

- `npm test`: 55/55 passing.
- `npm run validate:levels`: Levels 8–16 PASS.
- `npm run lint`: passing.
- `npm run build`: passing.
- local development HTTP response: 200.
- artifact: `artifacts/level-validation/level-16.json`.
- interactive browser capture remains unavailable; the near-final human feel gate
  is still required.

## Gate result

Level 16 is accepted and D-016 records the shared dormant-fuse rule. G9B remains
active; Level 17 may now make heat lifetime a route-planning resource using the
existing state timer and shared interactions.
