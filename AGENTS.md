# Blast Escape agent guidance

## Level work

When creating, tuning, or reviewing gameplay levels, read `docs/LEVEL-DESIGN-GRAMMAR.md` first.

Treat that document as the design source of truth for level authoring.

In particular:

- define the intended route before changing coordinates;
- reason in terms of launch jobs, landing windows, timing windows, recovery states, and mastery shortcuts;
- avoid brute-force multi-parameter coordinate tuning;
- change one parameter family at a time and re-test the clean route plus plausible near-misses;
- preserve the existing global physics unless several levels demonstrate the same systemic problem;
- prefer recombining learned mechanics over adding a large new system for every later level.

For Level 7, preserve the `RETURN ARC` intent and route hierarchy documented in the level-design grammar unless the user explicitly changes that contract.

## Visual work

Gameplay-level authoring guidance does not override a visual-only task's hard non-goals. If a visual-polish contract says level geometry, physics, timing, or rules are out of scope, do not alter them as part of that visual pass.
