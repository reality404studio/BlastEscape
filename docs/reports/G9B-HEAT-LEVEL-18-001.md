# G9B Heat / Level 18 Report 001

## Level intent

`LEVEL 18 — PHASE SHIFT` makes cold and heat visibly oppose each other on one
factory system:

`cold -> freeze vapor bridge -> cross -> heat -> release same bridge -> drop on right -> B1 through reopened shaft -> EXIT`

The central lower divider turns an early fall into the blocked left line, while a
post-crossing thaw opens the right-side drop. B1 then uses that same reopened span
as its return shaft rather than adding another unrelated thermal checkpoint.

## Authoritative implementation

- A traversal interaction may declaratively name another interaction state to
  deactivate on accepted contact.
- The shared core clears the linked state and emits `deactivated` before the next
  movement substep. Existing frozen collision and rendering already observe that
  authoritative state.
- Level 18 links `phase-span-thaw` to `phase-span-freeze`; heat also replaces cold
  through the unchanged single player-state slot.
- The lower divider and B1 geometry make both state changes load-bearing without
  modifying physics constants or adding a Level 18 controller.

## Validation evidence

| Check | Result |
| --- | --- |
| accepted route | PASS, 8.100s, cold -> heat, freeze -> thaw, B1 |
| constant left/neutral/right bypass | none clears |
| ±80ms timing noise | 100/100 clear |
| cold source removed | falls to blocked lower-left line |
| heat source removed | B1 hits but frozen collision blocks the return shaft |
| thaw link removed | both contacts register, but B1 still cannot pass the frozen span |
| direct core deactivation | emits `deactivated` and removes collision before next substep |

These checks establish state ordering, opposite effects on one system,
load-bearing geometry, event order, reachability, and exploit rejection. They do
not prove fun.

## Verification

- `npm test`: 65/65 passing.
- `npm run validate:levels`: Levels 8–18 PASS.
- `npm run lint`: passing.
- `npm run build`: passing.
- local development HTTP response: 200.
- artifact: `artifacts/level-validation/level-18.json`.
- interactive browser capture remains unavailable; the near-final human feel gate
  is still required.

## Gate result

Level 18 is accepted and D-017 records the generic interaction-deactivation
contract. G9B remains active; Level 19 may close the heat curriculum through a
bounded synthesis route rather than an every-mechanic checklist.
