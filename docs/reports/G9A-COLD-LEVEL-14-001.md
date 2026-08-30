# G9A Cold / Level 14 Report 001

## Level intent

`LEVEL 14 — BLUE CIRCUIT` closes the bounded cold curriculum by combining its
existing pieces into two legible routes:

- Primary: `START -> coolant -> freeze intake -> lock carriage -> B1 -> carriage -> B2 -> EXIT`
- Mastery: brake directly over B1, use the stronger proximity launch, and reach
  the upper exit deck without the carriage landing or B2.

The default launch stop deliberately offsets B1 so a first-clear player lands on
the stabilized carriage. The mastery route asks for learned blast positioning,
not a new mechanic or hidden input.

## Authoritative implementation

- Level 14 uses the existing cold source, `freeze-water`, `stabilize-machine`,
  moving-platform, bomb-cycle, and blast-distance logic unchanged.
- The frozen intake and carriage lock are temporary but cover one prepared
  B1-to-B2 sequence.
- B1 proximity alone separates the route hierarchy: the primary stop produces a
  carriage arc, while a deliberate brake before the stop produces a direct arc.
- Existing runtime rendering consumes the same level data used by the replay and
  evaluators; there is no one-off Level 14 controller.

## Validation evidence

| Check | Result |
| --- | --- |
| primary accepted route | PASS, 6.583s, B1 + B2, two landings |
| mastery route | PASS, 4.317s, B1 only, no intermediate landing |
| required state/interactions | cold + intake freeze + carriage lock |
| constant left/neutral/right bypass | none clears |
| primary ±80ms timing noise | 100/100 clear |
| same primary input without coolant | dies on `water` |
| primary input without carriage stabilization | times out before a landing |
| primary input without B2 | times out; mastery still clears |
| mastery braking samples | three neighboring brake/settle pairs clear using B1 only |

These checks establish reachability, load-bearing dependencies, exploit rejection,
timing tolerance, and a distinct mastery route. They do not prove fun.

## Verification

- `npm test`: 45/45 passing.
- `npm run validate:levels`: Levels 8–14 PASS.
- `npm run lint`: passing.
- `npm run build`: passing.
- local development HTTP response: 200.
- artifact: `artifacts/level-validation/level-14.json`.
- interactive browser capture remains unavailable; the near-final human feel gate
  is still required.

## Gate result

Level 14 and G9A are accepted without an engine request or durable contract
change. The next dependency-ready work is G3C: introduce heat through the shared
traversal-state substrate before producing Levels 15–19.
