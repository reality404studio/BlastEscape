# G5 Sprite Pipeline 001

Date: 2026-09-02
Goal: G5 Sprite Pipeline
Approved identity: A — Foundry Pod (HC-ART-001 / D-022)

## Outcome

The approved Foundry Pod is now a locked true-pixel base, a four-state
component-row animation set, and a runtime-consumed atlas/manifest pair. G5 is
DONE for the current playable character scope.

The shipping set contains:

- `idle`: 4 frames at 4 fps, looping;
- `walk`: 8 frames at 8 fps, looping;
- `airborne`: 4 frames at 8 fps, non-looping;
- `land`: 4 frames at 10 fps, non-looping.

All frames use `32 x 40` cells, transparent backgrounds, nearest-neighbour
presentation, and the Visual Bible's locked eight-colour subset. Runtime
collision remains the existing `26 x 36` box; the sprite is a presentation-only
`32 x 40` draw positioned around that box.

## Base lock

The source candidate was generated as
`artifacts/sprite-pipeline/foundry-pod-base-idle-v5.png`, then deterministically
extracted and palette-locked by SpriteGen. The canonical base is
`assets/generated/sprites/foundry-pod-base-v3/curated/frame-0.png`.

- Logical size: `32 x 40` RGBA.
- Non-transparent bounds: `(4, 3)` through `(27, 38)`; `23 x 35` silhouette.
- Margins: left 4, top 3, right 5, bottom 2.
- Edge pixels: 0.
- Chroma-adjacent pixels: 0.
- Palette: `#f2eee5`, `#07070b`, `#c8c3ba`, `#302c38`, `#17141c`,
  `#716a79`, `#211e28`, `#ffad37`.
- Identity checks: rounded shell, dark horizontal sensor, one restrained amber
  light, compact undercarriage, and two readable feet all survive at 1x.

## Generation and extraction provenance

- SpriteGen: `aldegad/sprite-gen` v1.59.0 at
  `27254c14c54deb638bfaace38a2806eed940e29f`.
- Engine: `component-row`.
- Request: `artifacts/sprite-pipeline/foundry-pod-production-request.json`.
- Production run: `assets/generated/sprites/foundry-pod/`.
- Raw generation: SpriteGen's exact per-state prompts and layout guides were
  shuttled through built-in ImageGen, then saved only under `raw/`. The nested
  `sprite-gen gen --provider codex` path was attempted first but its child
  `codex exec` exited `-9`; no generated pixels were patched or redrawn to work
  around that failure.
- Deterministic stages: SpriteGen extraction, pinned-palette conversion,
  preview/inspect, curation view, and atlas composition.
- Curation: all 20 extracted frames passed review, so no exclusion sidecar was
  needed (`curation_applied: false` means the complete default set was used).

Key SHA-256 values:

- locked base: `bf2697873f9387eed1ceef387922da3d37e14606cc7f5a7b225995f233e51b2b`
- raw idle: `c6d587a4ae26e8b3e8974f5792e3da39953129281b88a56fe4fcf4884beb524b`
- raw walk: `15c50c99515ed8e73c2469380abacc87b25baa84bbd275b970b88df8f38e1f3e`
- raw airborne: `cc1172afb676fe687c08944513cb79601b81eee2d8941b0fbdafca45413d17ab`
- raw land: `307d6faf5454059d1d5b837b8344d52198903e6ee1dcdc8fee3f9231f8eb1067`
- atlas: `71b1080e9537eaee972f21c19798b02736a4d5d441a52c7ad6e9a7c2cf9e3ad2`
- manifest: `8e1de39b428152167b2903cd9d43d79dee34d26fb9de655ba32dce93182f66de`

## Motion QA

`sprite-gen preview` and `sprite-gen inspect` both completed with `ok: true`.
Expanded contact-sheet review accepted every state:

- idle keeps a subtle shell/visor cycle; its generic low-motion warning is
  expected rather than a frozen row;
- walk has readable alternating contacts and a complete stride loop; logical
  height/safe-area warnings describe stride extension, not cropped pixels;
- airborne reads rise, tuck/apex, and descent at a stable logical scale despite
  two frames using consensus pitch;
- land reads contact, compression, and recovery with stable grounding.

Detailed state verdicts are recorded in
`assets/generated/sprites/foundry-pod/qa/qa-notes.md`.

## Runtime integration

The shipping files are copied to `public/sprites/foundry-pod/`. The canvas loads
the manifest and atlas, samples exact `frame_layout` rectangles and manifest
durations, prioritizes land then airborne/walk/idle, and mirrors the right-facing
art only at draw time. Physics, replay, level data, collision, and authoritative
gameplay state are unchanged. The legacy shape renderer remains only as a
load-failure fallback.

## Verification

- `npm test`: 122/122 pass, including four atlas/runtime timing tests.
- `npm run lint`: pass.
- `npm run build`: pass.
- Built atlas and manifest hashes exactly match their production and public
  sources.
- `git diff --check`: pass.
- `npx tsc --noEmit`: the two pre-existing readonly-fixture errors remain in
  `tests/heat-mechanic.test.ts` and `tests/heat-reactivation.test.ts`; no new
  sprite/runtime type error is reported.

Interactive browser capture remains an environment-level verification gap for
G6/G7 visual inspection, not a G5 asset/runtime contract blocker.
