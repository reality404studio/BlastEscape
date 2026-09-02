# G2 Level Lab Report 001

## Authoring path

All eight existing levels now live in `game/levels.ts` and carry required design
intent alongside geometry:

- primary route;
- launch jobs;
- landing and timing windows;
- recovery behavior;
- mastery shortcut;
- new/recombined skills;
- bounded target first-clear time;
- machine-checkable validation conditions where available.

Changing or adding a level no longer requires editing the React/canvas component.
Vite reload and the existing level selector provide immediate real-runtime
playtest access; a generalized editor UI remains an explicit non-goal.

## Replay and report path

- `game/replays.ts` registers accepted, named input tracks.
- `game/lab/replay-runner.ts` drives the authoritative `stepGameplay` core and
  records outcome, timing, blasts, landings, combo, height, death, and final state.
- `npm run validate:levels` writes deterministic JSON evidence under
  `artifacts/level-validation/` and exits nonzero when an evaluator fails.

## Evaluators

The Level 8 reference report runs four independent evaluator families over the
same authoritative core:

| Evaluator | Contract | Result |
| --- | --- | --- |
| reachability | accepted route clears | PASS at 4.433s |
| exploit | hold-left, neutral, hold-right do not clear | PASS |
| noisy-human | deterministic switch jitter, ±30ms / ±80ms | PASS, 96% / 51% |
| mechanic | B1–B5 hit and 5X combo reached | PASS |

The noisy-human result isolates switch-time jitter around an otherwise ideal
route. It is not interchangeable with broader practical-player estimates that
also include positioning and behavioral error.

## Verification

- `npm test`: 14/14 passing.
- `npm run validate:levels`: PASS, `level-8.json` generated.
- `npm run lint`: passing.
- `npm run build`: passing.
- artifact: `artifacts/level-validation/level-8.json`.

## Gate result

G2 is complete for dependency purposes. The Level Lab can author a data-driven
level, run accepted input against the production core, reject simple bypasses,
sample deterministic timing noise, verify intended mechanics, and emit
machine-readable evidence. These checks reject broken candidates; they do not
certify fun or replace real playtesting.
