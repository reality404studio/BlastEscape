# G9B Heat / Level 19 Report 001

## Level intent

`LEVEL 19 — THERMAL CATCH` closes the heat curriculum through route hierarchy:

- Primary: `heat -> melt launch seal -> B1 -> EXIT`
- Recovery: `short B1 -> emergency coolant replaces heat -> freeze basin -> B2 -> EXIT`

The fast route does not touch cold at all. Cold appears only when a plausible B1
miss enters the emergency quench zone, so the level synthesizes thermal states
without turning every interaction into a mandatory checklist.

## Authoritative implementation

- The primary route uses existing heat acquisition, timed barrier melting, B1,
  and blast steering unchanged.
- The recovery catch overlaps an existing cold source, freeze-water interaction,
  linked water hazard, and temporary collision surface. Core contact order lets
  the descending player acquire cold and freeze the basin before hazard handling.
- B2 sits at the far recovery stop and launches through an open right shaft to
  the same exit deck.
- No new shared-core feature, physics change, or Level 19 controller was added.

## Validation evidence

| Check | Result |
| --- | --- |
| accepted heat primary | PASS, 4.583s, heat + launch seal + B1 |
| primary without recovery coolant | same outcome and elapsed time |
| primary without heat | blocked at the solid launch seal |
| cold recovery | PASS, 8.133s, heat -> cold, B1 + B2 |
| recovery without coolant | dies on `water` |
| recovery without B2 | remains in the quench zone and cannot clear |
| recovery input samples | five B1-brake/B2-steer triples clear |
| constant left/neutral bypass | neither clears |
| primary ±30ms timing noise | 100/100 clear |

These checks establish selective mechanic use, route hierarchy, state replacement,
load-bearing recovery dependencies, and robust inputs. They do not prove fun.

## Verification

- `npm test`: 71/71 passing.
- `npm run validate:levels`: Levels 8–19 PASS.
- `npm run lint`: passing.
- `npm run build`: passing.
- local development HTTP response: 200.
- artifact: `artifacts/level-validation/level-19.json`.
- interactive browser capture remains unavailable; the near-final human feel gate
  is still required.

## Gate result

Level 19 and G9B are accepted without an engine request or new durable rule.
G3D is the next dependency-ready goal: define timed magnetic attachment/release
in the shared core before authoring Level 20 geometry.
