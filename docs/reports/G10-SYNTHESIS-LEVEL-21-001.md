# G10 Synthesis / Level 21 Report 001

## Level intent

`LEVEL 21 — SHIFT CARRIER` extends bounded magnetism without adding an input:

`induction coil -> B1 moving interception -> automatic attachment -> short right shift -> carrier ride -> automatic receiving-end release -> EXIT`

The carrier approaches the left launch dock on B1's prepared cycle. The player
must stop driving right after repositioning aboard; constant right exits the
short rail early into the water, while neutral or left never completes the route.

## Authoritative implementation

- A magnetic interaction may define one data-driven moving rail, capture padding,
  and a configured release endpoint.
- The moving rail uses the existing `movingPlatformAt` authority. Shared helpers
  expose the same current rectangle and velocity to contact, simulation, and
  rendering.
- Capture tests the carrier's current padded rectangle, not its full swept path.
- Attached motion inherits carrier displacement plus existing left/right control.
- Reversal at the configured receiving endpoint emits `carrier-end` release and
  restores normal gravity.
- Runtime draws the moving carrier, its full track, and both endpoint docks from
  the same level data.

## Validation evidence

| Check | Result |
| --- | --- |
| accepted route | PASS, 8.233s, magnetic + B1 + moving carrier |
| automatic attachment | PASS at current moving capture rectangle |
| automatic endpoint release | PASS at right carrier reversal |
| no magnetic source | B1 hits, then player dies in water |
| stationary carrier mutation | attachment occurs, but route dies in water |
| constant left / neutral / right | none clears |
| 120ms deterministic input noise | 100/100 clear |
| steering switch range | 3.58–3.74s samples clear |
| 30/50/60/120/144Hz | accepted route clears on all schedules |

These checks establish shared motion, interception, load-bearing carrier travel,
endpoint release, route reachability, and basic exploit rejection. They do not
prove fun.

## Verification

- `npm test`: 86/86 passing.
- `npm run validate:levels`: Levels 8–21 PASS.
- artifact: `artifacts/level-validation/level-21.json`.
- lint, production build, and local HTTP checks are recorded after the complete
  Level 21 source state below.
- interactive browser capture remains unavailable; the near-final human feel gate
  is still required.

## Gate result

Level 21 is accepted and D-019 records the reusable moving-carrier contract. G10
remains active; Level 22 should synthesize established verbs rather than introduce
another traversal system.
