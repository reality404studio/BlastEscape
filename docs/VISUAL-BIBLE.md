# Blast Escape — Visual Bible

## Existing direction to preserve

The prototype establishes a restrained industrial language rather than neon
cyberpunk spectacle:

- near-black void and graphite/muted-violet steel;
- off-white robot as the primary readable subject;
- red-orange for danger and blast energy;
- amber/gold for outbound, shipping, and successful passage;
- mint-cyan only for powered machinery, relays, rails, and temporary active
  infrastructure;
- sparse plates, seams, ribs, dead conduits, bolts, inspection markings, and
  machine silhouettes;
- hard-edged pixel-like detail with limited soft atmospheric depth.

The existing `public/og.png`, in-game palette, and
`docs/ASSET-GENERATION-PROMPT.md` are reference evidence, not permission to
redesign the game.

## Pixel-art execution contract

- The authoritative canvas remains `960 x 540` world pixels. Character art uses
  a `32 x 40` frame around the existing `26 x 36` gameplay body, with a
  `3 px` horizontal margin and `2 px` vertical margin. Feet touch frame row 38;
  decorative pixels may not imply a different ground contact.
- Author at one world-pixel per source pixel. Build forms from mostly `2 x 2`
  clusters, retain single pixels only for controlled highlights or sparks, and
  render atlases with smoothing disabled. Responsive presentation may scale the
  whole canvas, but must use nearest-neighbour/pixelated sampling.
- Environment modules use an `8 px` construction grid with `4 px` secondary
  seams and `2 px` detail clusters. Collision geometry remains authoritative;
  decoration may overhang by at most `2 px` near a traversable edge.
- Keep colliders independent from decorative silhouette while making contact
  points visually honest.
- Use crisp silhouettes, small controlled clusters, and restrained texture.
- Avoid subpixel shimmer, heavy bloom, excessive gradients, or particles that
  hide trajectory and hazards.
- Gameplay state must remain readable in motion and with sound muted.

### Shipping palette

The runtime constants are the source of truth. Art may mix no more than one
intermediate shade between listed structural colours without a recorded update.

| Role | Colour | Use |
|---|---|---|
| void | `#07070b` | deepest negative space |
| upper atmosphere | `#17131e` | restrained violet depth |
| lower atmosphere | `#09080d` | floor-side falloff |
| structure | `#302c38` | primary steel mass |
| structure dark | `#211e28` | recess and underside |
| structure edge | `#716a79` | lit load-bearing edge |
| structure seam | `#3b3644` | panel separation |
| player shell | `#f2eee5` | protagonist focal mass |
| player shade | `#c8c3ba` | shell turning plane |
| sensor | `#17141c` | face/sensor recess |
| blast/danger | `#ff513e` | lethal heat and blast core |
| warm signal | `#ffad37` | status lamp and ignition |
| powered machinery | `#66f2d5` | relays, rails, temporary activation |
| cold | `#74d9ff` | coolant and frozen state |
| dispatch | `#ffc44f` | rare successful passage/ending cue |

### Edge, light, and texture rules

- Primary silhouettes receive a `1 px` dark edge; floor-bearing machinery may
  use `2 px` on the lower/void-facing side. Never outline every internal panel.
- Light reads from upper-left. Each object uses at most four tonal steps:
  recess, base, shade, highlight. Hot machinery may invert the edge locally at
  its emissive core, but bloom cannot carry state information.
- Keep large planes quiet: one seam, fastener, wear cluster, or inspection mark
  per `16 x 16` region is the normal ceiling. Texture cannot create false
  platforms, hazards, bombs, or pickups.
- Animated machinery moves whole pixels at the authoritative canvas resolution.
  Effects may interpolate smoothly, but state-bearing shapes snap to whole
  pixels before drawing.

## Protagonist contract

The protagonist is a tiny, mass-produced, unfinished industrial/service robot:
compact, off-white, armless, no visible jump mechanism, dark horizontal sensor,
and one restrained warm status light. It may be slightly cute through proportion,
but must not read as a superhero, astronaut, weapon platform, or expressive mascot
with a human face.

The current canvas robot is a placeholder identity reference, not an approved
full sprite set. G4 must present 2–4 base candidates at gameplay scale on
representative backgrounds. Open `HC-ART-001` before mass animation production.

### Candidate and silhouette requirements

- Neutral side-view silhouette occupies `20–26 px` width and `30–36 px` height
  inside the frame, leaving the existing gameplay body/collider unchanged.
- Two separately readable feet establish walking and landing. There are no arms,
  thruster pack, spring legs, weapon mount, cape, helmet rim, or other hardware
  that promises a jump or combat action.
- The dark horizontal sensor is the dominant facial cue. One amber status pixel
  or cluster may suggest warmth; there are no eyes, mouth, eyebrows, or text
  required to understand the character.
- Shell asymmetry comes from one service seam, hatch, fastener, or unfinished
  panel—not from a heroic accessory. The robot must read in off-white silhouette
  at actual gameplay size against both `#17131e` and `#302c38`.
- Approval evidence must show a neutral side view enlarged for inspection and an
  actual-size inset on representative factory structure. Candidate assessment is
  weighted: gameplay readability 40%, unfinished service-unit identity 30%,
  no-jump/no-combat honesty 20%, animation feasibility 10%.

## Environment zones

The factory should progress from mobility test chambers through cooling,
thermal work, electrical/magnetic transport, inspection, and dispatch. Each zone
gets distinct machinery shapes and a controlled accent emphasis while retaining
the shared structural palette.

Story props should look like equipment still executing stale instructions, not
organic ruins or a human-inhabited workspace. Humans may appear only as absent
traces or distant industrial-scale evidence, never as speaking characters.

| Levels | Zone language | Accent and narrative trace |
|---|---|---|
| 1–8 | mobility-test bays | graphite rigs, red blast pits, repeated calibration marks |
| 9–14 | coolant works | cold-blue pipes, condensate basins, insulated carriage hardware |
| 15–19 | thermal processing | red-orange furnace seams, quench equipment, dormant fuse housings |
| 20–24 | induction and transfer | mint rails/coils, suspended carriers, converging inspection marks |
| 25 | final inspection/dispatch | sparse clean geometry, scanner amber, rare gold open-door path |

## Effects hierarchy

Effects reinforce authoritative events:

1. one-frame/readable blast flash and expanding pressure shape;
2. player launch deformation and clear motion arc;
3. brief camera impulse and debris/contact particles;
4. distinct cold, heat, and magnetic state silhouettes;
5. success/dispatch emphasis using gold sparingly.

Effects must not alter gameplay timing or hide the next decision.
