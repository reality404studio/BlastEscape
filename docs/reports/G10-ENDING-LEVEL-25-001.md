# G10 Ending / Level 25 Report 001

## Level and ending intent

`LEVEL 25 — FINAL INSPECTION` returns to the foundational blast grammar:

`B1 -> airborne B2 -> dispatch deck -> scanner -> ORDER CANCELLED -> retained control -> player-chosen open-door departure`

The final challenge is concise so the ending has room. The scanner is a reveal,
not a finish trigger. No replacement objective appears and no cutscene walks the
unit through the door.

## Authoritative implementation

- A typed final-level dispatch sequence defines scanner, open-door, and departure
  rectangles.
- Scanner contact sets `dispatchScanned` and emits `dispatch-scanned` without
  clearing or pausing the authoritative gameplay step.
- The separate departure rectangle clears only after scanning.
- Runtime renders dispatch signage, the cancellation state, and an already-open
  doorway from the same data/state used by replay.
- The post-departure card replaces the contradictory prototype “every directive
  complete” copy with the cancellation and chosen-departure outcome.

## Validation evidence

| Check | Result |
| --- | --- |
| accepted route | PASS, 5.300s, B1/B2, 2X, scanner, departure |
| scanner contact | emits reveal state without clear |
| neutral after scanner | 3 seconds with no auto-completion |
| retreat after scanner | left input moves away with no clear |
| departure before scan | cannot clear |
| departure after scan | clears only on player entry |
| no B2 | no 2X, no scan, no departure |
| constant left / neutral | neither clears |
| 100ms deterministic input noise | 100/100 clear |
| 30/50/60/120/144Hz | accepted route clears on all schedules |

These checks prove the control and state-transition contract. They do not prove
the emotional landing; the mandatory final human playthrough remains required.

## Verification

- `npm test`: 111/111 passing.
- `npm run validate:levels`: Levels 8–25 PASS.
- artifact: `artifacts/level-validation/level-25.json`.
- lint, production build, and local HTTP checks are recorded after the complete
  Level 25 source state below.
- interactive browser capture remains unavailable in this environment.

## Gate result

G10 is DONE. Levels 21–25 and the canonical nonverbal cancellation/open-door
ending are implemented. G4/G6/G7 and G8A remain before G11 final release QA.
