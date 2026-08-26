# Visual Polish 01 — Abandoned Industrial Language

## Goal

Polish the existing Blast Escape prototype without changing its game rules.

The world should read as a far-future abandoned robot factory whose automated test infrastructure is still partially running. The player is a simple industrial robot that was intentionally built without a jump function for safety, but is physically durable enough to survive blast forces. Its remaining directive is simply to reach outbound / leave the facility.

The joke should remain dry and implicit: the robot is not "rebelling" and the game should not explain AI safety or alignment directly. It is only executing its objective using environmental physics that the original designers did not intend as locomotion.

The visual polish should make the game feel authored and coherent while preserving the current small, slightly crude arcade-game charm.

## Existing visual language to preserve

The current game already has the right semantic seeds:

- player: bright off-white body;
- static environment: dark violet/graphite metal;
- danger / blast: red, orange, amber;
- active machinery / usable system guidance: mint cyan (`#66f2d5` family);
- exit: amber/gold;
- debug overlays: separate from normal presentation.

Do not replace this palette with a new aesthetic. Refine it into a consistent industrial grammar.

## Hard constraints

This PR is a visual/effects pass only.

Do **not** change:

- player acceleration, gravity, speed, friction, collision or blast impulse;
- bomb fuse timing, repeat timing, radius or launch behavior;
- level geometry, platform placement, exits, pits, spikes or moving-platform motion;
- controls, level selection or restart behavior;
- success conditions or level order;
- debug calculations / trajectory information;
- dependencies or rendering technology.

Use the existing Canvas 2D implementation and CSS. No external sprite packs, raster assets, SVG asset pipeline, shaders, WebGL migration, sound work, or new libraries.

Do not turn this into a large architecture refactor. Small drawing helpers or palette constants are fine when they reduce repetition.

## Visual grammar

### 1. Environment — dead facility, not generic neon arena

Static geometry should feel like large industrial plates rather than plain rectangles.

For non-boundary platforms:

- retain the dark graphite/violet body;
- retain a narrow top lip / readable walkable edge;
- add very low-contrast panel seams or occasional plate divisions;
- optionally add sparse 1–2 px bolt/rivet marks where they do not create visual noise;
- keep decoration substantially darker than gameplay silhouettes.

Boundaries should remain darker and quieter than playable platforms.

Background treatment:

- reduce the feeling of a generic evenly spaced debug grid;
- replace or soften it into sparse structural seams / factory panel lines;
- add only a few distant industrial hints using Canvas primitives (for example vertical conduits, dark frame members, or broken panel seams);
- never make background detail compete with moving machinery, hazards, bombs, player or exit.

The facility should look abandoned, but not organically ruined. The stronger idea is: **the humans are gone; the machines are still doing their jobs.**

### 2. Player — preserve the tiny white robot

Keep the current 26×36-ish compact white silhouette and its simple characterful proportions. Do not redesign it into a detailed humanoid, mascot, astronaut, or combat robot.

Refine only enough to read as a mass-produced industrial unit:

- off-white shell remains the dominant body color;
- one small dark visor/sensor area;
- one restrained warm status mark may remain;
- optional tiny body seam / unit mark is allowed if readable at gameplay scale;
- no large facial expression;
- no elaborate limb animation.

The robot should still feel slightly cute because of its proportions, but its design language should be utilitarian rather than decorative.

### 3. Semantic color ownership

Normal gameplay must follow this ownership:

- **off-white:** player / neutral physical body;
- **graphite/violet:** static facility structure;
- **red/orange/amber:** hazard, blast energy, urgency;
- **mint cyan:** powered machinery, active system path, motion guidance, relay affordance;
- **gold:** outbound / exit objective.

Mint must not spread into general decoration. If everything glows mint, the mechanic-reading benefit is lost.

### 4. Moving machinery

The existing moving platform already uses the correct mint semantic family. Refine it so it reads as an active automated factory component rather than a glowing game platform.

Desired cues:

- dark mechanical body;
- narrow mint powered edge / status rail;
- travel track remains visible but quiet;
- directional chevrons or motion marks remain restrained;
- endpoint markers may remain;
- avoid strong bloom or sci-fi hologram styling.

### 5. Bombs — industrial blast charge, not fantasy pickup

Keep all fuse and explosion behavior unchanged.

Visually, bombs should read as a factory test / pressure charge that happens to become locomotion for this robot.

Refine using Canvas primitives only:

- preserve strong warm danger ownership;
- make the core slightly more mechanical / manufactured (ring, casing, small banding, or compact capsule/charge cues are acceptable);
- fuse countdown remains readable at a glance;
- floating bombs keep mint relay context, but the bomb itself remains danger-owned rather than becoming mint;
- avoid cartoon fuse, military grenade, or high-detail weapon styling.

### 6. Hazards and void

Spikes:

- stay unmistakably lethal;
- reduce decorative glow if needed so they feel like dangerous test hardware rather than neon game spikes;
- retain warm hazard color and a hard bright edge.

Pits:

- should read as missing / unreachable factory volume rather than a decorated hazard panel;
- dark depth first;
- only sparse warm warning marks near the accessible edge if useful;
- do not fill the void with visual noise.

### 7. Exit / outbound

Keep gold/amber ownership and immediate readability.

The exit should feel like an industrial outbound gate / shipping endpoint, not a treasure portal.

Allowed refinements:

- simple frame structure;
- small status lamp;
- understated `OUTBOUND` or existing `EXIT` labeling;
- minimal floor/door guidance.

Do not add lore exposition or a cutscene in this PR.

## Effects polish

Effects should be short, physical and pixel-like. The goal is tactile response, not spectacle.

### Explosion

Keep the existing screen shake and blast gameplay exactly unchanged.

Refine visual response toward:

- 1 very brief bright impact flash;
- square / rectangular hot fragments rather than soft magic particles;
- blast wave remains fast and readable;
- warm core colors dominate;
- particles should decay quickly enough not to obscure the next movement decision.

### Landing

Add one small landing feedback effect when the player transitions from airborne to grounded with meaningful downward speed.

Suggested treatment:

- 2–5 tiny square dust/spark pixels from the feet;
- very short lifetime;
- neutral pale-gray or low-intensity warm metal-contact color;
- no gameplay force and no camera shake;
- do not trigger continuously while standing.

This may require minimal previous-grounded / pre-collision vertical-speed tracking, but must not alter physics state or collision outcomes.

### Mechanical contact

Optional only if it stays tiny and local:

- 1–2 short sparks on a hard wall/ceiling impact above a sensible speed threshold.

Do not add a generalized collision-effects engine in this pass.

### Player motion

A very small visual squash/compression on hard landing is allowed only if implemented as drawing transform / visual offset and does not change the collision rectangle.

Do not introduce animation that changes gameplay dimensions.

## UI / copy treatment

Keep this PR primarily visual. Small copy changes are allowed only where they strengthen the industrial framing without adding exposition.

Good direction:

- the facility speaks in terse system language;
- the robot is treated as a unit, not a hero;
- outbound is an objective, not a dramatic escape monologue.

Possible restrained replacements, if they fit the current composition:

- eyebrow: `ABANDONED MOBILITY FACILITY` or similarly dry facility identity;
- mission: `OUTBOUND DIRECTIVE` + a short note that jump is unavailable;
- exit label may become `OUTBOUND` if it remains clearer than `EXIT`.

Do not add paragraphs of lore, explicit references to AI alignment, humans fearing AI, rebellion, model restrictions, or explanatory jokes. The visual contradiction should carry the sarcasm.

## Implementation guidance

Primary files expected:

- `app/blast-escape.tsx`
- `app/globals.css`

Optional new local drawing helpers/constants are fine inside `app/blast-escape.tsx` if they keep the draw loop understandable.

Prefer one small palette/visual constant object over repeating new literal colors everywhere, but do not refactor unrelated physics constants.

Keep debug mode visually useful. Normal-mode polish must not make debug overlays unreadable.

## Acceptance scenes

Visually inspect at minimum:

1. **Level 1 / TEST CHAMBER**
   - verifies the baseline factory language, player, bombs, platforms, exit and explosion response.
2. **Level 5 / SYNTHESIS I**
   - verifies pit + spikes + floating bomb without losing gameplay readability.
3. **Level 6 / INTERCEPT**
   - verifies moving machinery and mint semantic ownership.

## Acceptance criteria

The pass is accepted when all of the following are true:

- the same level geometry and game behavior remain intact;
- the player remains immediately visible against every current level;
- static facility, danger, powered machinery and outbound each have distinct semantic color ownership;
- normal play no longer reads primarily as "shapes on a dark debug grid";
- the background is richer but quieter than gameplay objects;
- the moving platform reads as machinery, not a generic neon platform;
- bombs read as industrial blast/test charges while preserving clear fuse timing;
- explosion and landing feedback feel more tactile but do not obscure control;
- no new visual effect changes collision, impulse, timings or player dimensions;
- Level 5 hazards remain obvious and Level 6 motion cues remain legible;
- the result still feels like a small deliberate arcade game, not a high-detail cinematic platformer.

## Verification

Run:

```bash
npm run lint
npm run build
git diff --check
```

Then perform a manual desktop smoke of Levels 1, 5 and 6, including at least one blast launch and one landing in each relevant scene.

## Explicit non-goals / deferred

- sound design;
- title screen / ending / story sequence;
- new levels;
- new mechanics;
- character backstory exposition;
- external art assets;
- sprite-sheet pipeline;
- mobile-control redesign;
- level-select redesign;
- accessibility feature expansion;
- gameplay balancing;
- physics changes.
