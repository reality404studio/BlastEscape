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

- Establish one logical pixel scale for shipping sprites and environment tiles;
  scale by whole-number multiples where practical.
- Keep colliders independent from decorative silhouette while making contact
  points visually honest.
- Use crisp silhouettes, small controlled clusters, and restrained texture.
- Avoid subpixel shimmer, heavy bloom, excessive gradients, or particles that
  hide trajectory and hazards.
- Gameplay state must remain readable in motion and with sound muted.

## Protagonist contract

The protagonist is a tiny, mass-produced, unfinished industrial/service robot:
compact, off-white, armless, no visible jump mechanism, dark horizontal sensor,
and one restrained warm status light. It may be slightly cute through proportion,
but must not read as a superhero, astronaut, weapon platform, or expressive mascot
with a human face.

The current canvas robot is a placeholder identity reference, not an approved
full sprite set. G4 must present 2–4 base candidates at gameplay scale on
representative backgrounds. Open `HC-ART-001` before mass animation production.

## Environment zones

The factory should progress from mobility test chambers through cooling,
thermal work, electrical/magnetic transport, inspection, and dispatch. Each zone
gets distinct machinery shapes and a controlled accent emphasis while retaining
the shared structural palette.

Story props should look like equipment still executing stale instructions, not
organic ruins or a human-inhabited workspace. Humans may appear only as absent
traces or distant industrial-scale evidence, never as speaking characters.

## Effects hierarchy

Effects reinforce authoritative events:

1. one-frame/readable blast flash and expanding pressure shape;
2. player launch deformation and clear motion arc;
3. brief camera impulse and debris/contact particles;
4. distinct cold, heat, and magnetic state silhouettes;
5. success/dispatch emphasis using gold sparingly.

Effects must not alter gameplay timing or hide the next decision.
