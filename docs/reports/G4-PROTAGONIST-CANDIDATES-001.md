# G4 Protagonist Candidates 001

Date: 2026-08-31
Goal: G4 Art Direction / Protagonist
Gate: HC-ART-001

## Outcome

The existing restrained industrial direction is now expressed as an executable
pixel-art contract in `docs/VISUAL-BIBLE.md`. Three base-identity candidates were
generated for human judgment. These are identity evidence only: none is a
shipping sprite, source atlas, or animation set.

## Candidate evidence

| Option | Identity | Evidence | Readability | Service-unit identity | Input honesty | Animation feasibility | Total |
|---|---|---|---:|---:|---:|---:|---:|
| A | Foundry Pod | `artifacts/art-direction/protagonist-candidate-a-foundry-pod.png` | 38/40 | 28/30 | 20/20 | 9/10 | **95/100** |
| B | Inspection Wedge | `artifacts/art-direction/protagonist-candidate-b-inspection-wedge.png` | 35/40 | 24/30 | 15/20 | 8/10 | **82/100** |
| C | Cratelet Unit | `artifacts/art-direction/protagonist-candidate-c-cratelet-unit.png` | 32/40 | 28/30 | 20/20 | 7/10 | **87/100** |

These scores are the Director's preliminary rubric application, not a substitute
for the human identity decision.

- **A — Foundry Pod:** closest continuity with the key art and current runtime;
  sensor, shell, undercarriage, and two feet survive the gameplay-scale inset.
  It is the recommended/default candidate.
- **B — Inspection Wedge:** strongest forward direction, but the long shell and
  articulated lower structure can imply a more capable scouting/combat machine.
- **C — Cratelet Unit:** strongest vulnerable cargo/service-object reading, but
  its wide, quiet shell loses more identity when reduced into the `26 x 36`
  gameplay envelope.

## Generation provenance

- Tool/mode: built-in ImageGen, new raster concept sheets with `public/og.png`
  supplied as a style/palette reference.
- Shared prompt constraints: one neutral right-facing design; enlarged inspection
  view, gameplay-scale factory inset, and silhouette inset; armless; no human
  face, jump hardware, thrusters, weapons, text, animation poses, or action FX.
- Candidate-specific prompt focus: rounded foundry pod (A), chamfered directional
  inspection shell (B), clipped-corner crate/service shell (C).
- Source dimensions: `1672 x 941` RGB PNG for each candidate.
- SHA-256:
  - A: `839d1b80c3801735ef160650f21f170211bf34d54be2089186fc42b72c65d150`
  - B: `7a3778961a7f63a526f856df85e4675be6c599584cd2207d1bc95cebe6ee3741`
  - C: `56b3abaf20d9970b64dedbaf26b00d4f93131f13b140ec8eb540ba89dd6bc682`

## Pipeline boundary

The preferred SpriteGen repository/skill was checked before candidate work, but
no installed SpriteGen `SKILL.md` is available in this environment. This does not
block the identity gate. After approval, G5 must either install/read that skill
or record why an equivalent reproducible curation path is required. No complete
animation set may be generated before HC-ART-001 is resolved.
