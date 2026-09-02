# G7 Environmental Storytelling 001

Date: 2026-08-31
Goal: G7 Environmental Storytelling

## Outcome

The 25-level factory progression now has one data-owned presentation map and a
runtime background pass that changes department without touching gameplay:

- Levels 1–8 repeat calibration rulers, blast cells, and test bays.
- Levels 9–14 introduce insulated pipe runs, condensate drips, and transfer
  tanks in the cold accent.
- Levels 15–19 replace them with furnace columns, vent slits, and quench
  housings in restrained hot accents.
- Levels 20–24 add overhead rails, coils, and empty carrier silhouettes so the
  route reads increasingly as inventory transfer.
- Level 25 becomes sparse final inspection/dispatch: empty unit bays, inspection
  frames, gold outbound chevrons, and an open-door silhouette reinforce the
  authoritative scanner/departure sequence.

Sparse department labels identify industrial function but do not narrate or
speak. The motif progression remains visible without reading them. Props render
behind gameplay at low opacity and do not enter `LevelDefinition`, collision,
replay, or event state.

## Evidence

- `game/presentation.ts` owns the tested Level 1–25 zone mapping and motif list.
- `app/blast-escape.tsx` renders the five background grammars.
- `docs/NARRATIVE-BIBLE.md` records the executable staging contract.
- `tests/presentation.test.ts` verifies complete boundary coverage and three
  functional motifs per zone.
- `npm test`: 118/118 pass.
- `npm run lint`: pass.
- `npm run build`: pass.

Interactive visual inspection remains before G7 is DONE because browser capture
is unavailable in the current environment. The local playable endpoint returns
HTTP 200 and is carried in Draft PR #5.
