# G10 Synthesis / Level 22 Report 001

## Level intent

`LEVEL 22 — POLARITY HANDOFF` uses only established verbs:

`furnace heat -> ignition circuit -> dormant B1 -> left through airborne induction coil -> magnetic replacement -> rail capture -> reverse right -> EXIT`

Heat is not a checklist pickup: it makes the only launch run. The B1 arc is the
only access to magnetism, and magnetism is the only access to the receiving deck.

## Authoritative implementation

- Existing heat acquisition powers an existing data-linked dormant charge.
- Existing single-slot state replacement changes heat to magnetic in an elevated
  induction source during B1 ascent.
- Existing rising-only magnetic capture attaches to a static bounded rail.
- Existing left/right control reverses the launch line and then traverses right;
  no new core rule, input, or level-private controller was added.
- Missing either half of the airborne handoff returns to the safe launch floor,
  where the normal repeating B1 cycle remains visible.

## Validation evidence

| Check | Result |
| --- | --- |
| accepted route | PASS, 6.367s, heat + ignition + B1 + magnetic + rail |
| no heat source | B1 remains dormant; route times out safely |
| no airborne induction coil | B1 launches and returns to start; no clear |
| no magnetic rail | heat-to-magnetic handoff occurs and returns to start; no clear |
| constant left / neutral / right | none clears |
| two reversal windows | 15 sampled input pairs clear |
| 80ms deterministic input noise | 100/100 clear |
| 30/50/60/120/144Hz | accepted route clears on all schedules |

These checks establish dependent state order, mechanic use, recovery, reachability,
and simple exploit rejection. They do not prove fun.

## Verification

- `npm test`: 92/92 passing.
- `npm run validate:levels`: Levels 8–22 PASS.
- artifact: `artifacts/level-validation/level-22.json`.
- lint, production build, and local HTTP checks are recorded after the complete
  Level 22 source state below.
- interactive browser capture remains unavailable; the near-final human feel gate
  is still required.

## Gate result

Level 22 is accepted without an engine extension. G10 remains active for Level 23,
which should use a different synthesis shape rather than another copy of the same
launch-to-rail handoff.
