# G9A Cold / Level 13 Report 001

## Level intent

`LEVEL 13 — COLD CATCH` uses one frozen basin for both route hierarchy branches:

- Primary: `START -> coolant -> freeze basin -> B1 -> upper deck -> EXIT`
- Recovery: `B1 over-brake -> frozen basin landing -> B2 -> EXIT`

The upper route is faster. The lower route is not a hidden shortcut: it catches a
plausible short arc, preserves progress, and teaches the player to read B2 as a
backup charge. Cold synthesis with a mastery shortcut remains reserved for Level
14.

## Authoritative implementation

- Level 13 uses the existing source, `freeze-water`, result collision, linked
  water hazard, bomb cycle, and blast physics unchanged.
- A narrow activation edge prevents the recovery landing from silently refreshing
  the ice timer.
- B1 and B2 share one launch stop at different fuse times; no one-off recovery
  state or teleport is added.
- Existing water/ice rendering exposes both routes from the same data.

## Validation evidence

| Check | Result |
| --- | --- |
| primary accepted route | PASS, 3.967s, B1 only, no intermediate landing |
| recovery route | PASS, 6.550s, one ice landing, B1 + B2 |
| required state/interaction | cold + `catch-basin-freeze` |
| constant left/neutral bypass | neither clears |
| primary ±30ms timing noise | 100/100 clear |
| recovery timing samples | five brake/recover pairs clear through B2 |
| same primary input without coolant | dies on `water` |
| recovery input without B2 | lands on ice, then thaws into `water` |

Holding right is an intended clean primary route, not an exploit; the new lesson
is recognizing that a failed B1 can become recoverable. These checks reject
broken route hierarchy but do not prove fun.

## Verification

- `npm test`: 40/40 passing.
- `npm run validate:levels`: Levels 8–13 PASS.
- `npm run lint`: passing.
- `npm run build`: passing.
- artifacts: `artifacts/level-validation/level-8.json` through `level-13.json`.
- visual browser capture remains unavailable; the near-final human feel gate is
  still required.

## Gate result

The Level 13 slice is accepted without an engine request or new durable mechanic
decision. G9A remains active and Level 14 may now close the cold curriculum with
a synthesis route and an intentional, machine-verified mastery shortcut.
