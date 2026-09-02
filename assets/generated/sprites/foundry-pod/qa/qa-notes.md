# Foundry Pod motion QA

Reviewed: 2026-09-02 (Asia/Seoul)
Reviewer: Codex director
Base lock: `foundry-pod-base-v3/curated/frame-0.png`

## Verdict

- `idle`: PASS — four-frame breathing/visor cycle remains on model; the tiny motion warning is expected for a compact idle.
- `walk`: PASS — eight frames show readable alternating foot contacts and a complete stride loop. Native-height and safe-area warnings describe the intended stride extension; no pixels are cropped.
- `airborne`: PASS — four frames read as rise, tuck/apex, and descent while preserving silhouette and palette. Pitch-consensus warnings did not create scale jitter or clipped pixels.
- `land`: PASS — four frames show contact, compression, and recovery with stable ground alignment.

## Cross-state checks

- Identity, visor placement, side module, ivory shell, dark outline, and single amber indicator remain recognizable in every state.
- The locked eight-color palette is preserved.
- Contact sheets show no transparency holes, chroma spill, duplicate/collapsed animation rows, or edge clipping.
- All extracted frames are accepted for atlas composition; no curation exclusions are required.

## Non-blocking generator warnings

- `idle` motion score is marginally below the generic threshold because the state is deliberately subtle.
- `walk` logical-height and safe-area warnings are caused by the widest/tallest stride poses, not crop loss.
- `airborne` used consensus pitch for two frames after candidate pitches collapsed; the resulting logical scale is visually consistent.
