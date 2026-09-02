# G8A Blast Curriculum Migration 001

Date: 2026-08-31
Goal: G8A Blast Curriculum Migration / Preservation

## Outcome

Levels 1–7 now have named, repository-owned accepted replays and machine-readable
Level Lab reports. No movement constant, bomb timing, collision order, level
geometry, or exit geometry changed. The slice locks the prototype curriculum as
evidence before later visual and release work.

| Level | Accepted route | Time | Required blast evidence | Validator |
|---|---|---:|---|---|
| 1 Test Chamber | three broad deck launches | 8.033s | B1, B2, B3 | WARN |
| 2 Trajectory Test | opening trajectory | 5.900s | B1 | PASS |
| 3 Tight Pocket | slot and counter-steer | 6.133s | B1 | PASS |
| 4 Air Combo | uninterrupted relay | 6.167s | B1, B2; 2X | PASS |
| 5 Synthesis I | pit/teeth route | 6.800s | B1, B2 | PASS |
| 6 Intercept | moving-platform landing | 3.200s | B1; one landing | PASS |
| 7 Return Arc | B2 reversal and B3 return | 7.283s | B1, B2, B3 | WARN |

The WARN status on Levels 1 and 7 is intentional and contains no failing
evaluation: reachability, constant-direction exploit rejection, and mechanic use
all pass. Their multi-landing routes do not define a time-keyframe jitter profile
because a human corrects them from visible position, while the current replay
schema can perturb only absolute switch times. Treating that mismatch as a high
robustness score would overstate the evidence. It remains a later play-feel check,
not a reason to fork physics or rewrite established geometry.

## Multi-evaluator evidence

- All seven accepted replays clear at 60Hz and hit every required bomb.
- `hold-left`, `neutral`, and `hold-right` fail to clear every level.
- Levels 2–6 clear with the same replay at 30, 50, 60, 120, and 144Hz.
- Deterministic jitter results:
  - Level 2: 100/100 at 30ms.
  - Level 3: 72/100 at 10ms (the intentionally tight pocket lesson).
  - Level 4: 83/100 at 30ms while preserving the 2X air chain.
  - Level 5: 100/100 at 10ms across the hazard synthesis.
  - Level 6: 91/100 at 30ms and 68/100 at 50ms.
- Reports: `artifacts/level-validation/level-1.json` through
  `artifacts/level-validation/level-7.json`.
- Regression tests: `tests/blast-curriculum.test.ts`.

These evaluators reject broken routes, missing mechanic use, and simple bypasses.
They do not prove fun or certify the intended first-clear times.

## Verification

- `npm run validate:levels`: Levels 1 and 7 WARN as described; Levels 2–25 PASS;
  no FAIL results and exit code 0.
- `npm test`: 116/116 pass.
- Core, physics, config, and authored level geometry files are unchanged except
  for adding validation contracts to the existing Level 1–7 definitions.
