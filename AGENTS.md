# Blast Escape agent guidance

## Project-scale `/goal` work

When a task is about turning Blast Escape into the finished game, coordinating multiple Codex sessions, adding major systems, producing many levels/assets, or declaring the project complete, read these before planning:

1. `docs/GOAL-ORCHESTRATION.md`
2. `docs/coordination/STATUS.md`
3. `docs/coordination/GOALS.md`
4. `docs/coordination/HUMAN-CALLS.md`
5. `docs/coordination/DECISIONS.md`

Treat the repository as shared project memory. Update coordination documents at meaningful state transitions instead of relying on chat history.

Proceed autonomously on routine engineering work. A human call is required only for the judgment gates described in `docs/GOAL-ORCHESTRATION.md`. When human judgment is needed, open/update `docs/coordination/HUMAN-CALLS.md` with a concrete decision package and continue any unblocked work.

Do not declare a project goal complete merely because code was written. Use the acceptance/evidence gates in the goal registry and orchestration contract.

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

If level production requires a shared runtime/tooling feature, add an entry to `docs/coordination/ENGINE-REQUESTS.md` rather than creating a private one-off engine fork.

## Visual work

Gameplay-level authoring guidance does not override a visual-only task's hard non-goals. If a visual-polish contract says level geometry, physics, timing, or rules are out of scope, do not alter them as part of that visual pass.

For protagonist sprite production, use `aldegad/sprite-gen` through its own installed skill/CLI contract where available. Do not mass-produce character states until the protagonist base identity has passed the human approval gate recorded in `docs/coordination/HUMAN-CALLS.md`.
