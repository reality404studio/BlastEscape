# G10 Synthesis / Level 24 Report 001

## Level intent

`LEVEL 24 — TEMPER CIRCUIT` is the final full gameplay escalation:

`cold intake freeze -> carriage lock -> B1 transfer -> furnace replaces cold -> ignition wakes B2 -> B2 left -> EXIT`

It deliberately recalls the earlier blue circuit, then removes its shortcut and
requires a thermal handoff aboard the committed carriage route.

## Authoritative implementation

- Existing timed ice opens the lower intake.
- Existing cold stabilization fixes the shared moving platform for B1 transfer.
- Existing single-slot state replacement changes cold to heat on the carriage.
- Existing heat ignition advances a previously dormant B2 fuse.
- Existing B2 blast and left/right control complete the upper return.
- No new runtime rule, input, or level-private controller was added.

## Validation evidence

| Check | Result |
| --- | --- |
| accepted route | PASS, 6.700s, cold + heat + B1/B2 |
| no cold source | intake water kills before B1 |
| no carriage lock | B1 transfer cannot reach heat or B2 |
| no furnace heat | B2 stays dormant; route times out |
| no B2 | both state phases succeed; upper return does not clear |
| constant left / neutral / right | none clears |
| final steering samples | 8/8 clear from 5.80–6.15s |
| 80ms deterministic input noise | 100/100 clear |
| 30/50/60/120/144Hz | accepted route clears on all schedules |

These checks establish dependency order, mechanic use, reachability, and basic
exploit rejection. They do not prove fun.

## Verification

- `npm test`: 105/105 passing.
- `npm run validate:levels`: Levels 8–24 PASS.
- artifact: `artifacts/level-validation/level-24.json`.
- lint, production build, and local HTTP checks are recorded after the complete
  Level 24 source state below.
- interactive browser capture remains unavailable; the near-final human feel gate
  is still required.

## Gate result

Level 24 is accepted without an engine extension. G10 remains active for Level 25,
the bounded dispatch approach, then the canonical nonverbal ending.
