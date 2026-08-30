# Blast Escape — Game Bible

## Product promise

Blast Escape is a compact, approximately one-hour single-player pixel-art
physics platformer. An unshipped industrial robot with no jump hardware crosses
an abandoned but still-operating factory by deliberately standing near timed
industrial charges and steering the resulting blast arcs.

The player's pleasure comes from reading a setup, committing to an imperfect
physical launch, correcting in the air, and converting a near-miss into a
recovery or a cleaner next attempt. The game should feel authored and tactile,
not like a generic precision platformer or an ability checklist.

## Player verbs

- move left;
- move right;
- restart quickly;
- pause/resume through release UI;
- exploit factory equipment and temporary factory states through movement and
  positioning, without adding a jump or action-button vocabulary.

Explosion-based locomotion remains the primary grammar. Midair steering is
intentional but imperfect. Later mechanics change the robot or environment long
enough to create traversal opportunities; they do not turn the robot into a
combat character.

## Scope

- Target: 25 authored levels plus the dispatch ending.
- Target median first playthrough: 55–65 minutes.
- Levels 1–8: blast traversal curriculum already present in prototype form.
- Levels 9–19: cold and heat are introduced, combined with blast, and reused.
- Levels 20–25: magnetism introduction followed by selective synthesis.
- Ending: dispatch scan, cancelled order, already-open exit, player-controlled
  departure.

The exact level count may move slightly only when playtime evidence supports a
better bounded result.

## Experience pillars

1. **No jump, no arms.** The missing capability defines both play and character.
2. **Commit, steer, recover.** Difficulty comes from readable physical jobs and
   timing windows, not hidden pixel-perfect coordinates.
3. **Factory misuse.** Charges, cooling, heat, rails, carriers, and scanners keep
   doing industrial work; the robot repurposes them for passage.
4. **Mute-readable impact.** Motion, timing, flashes, deformation, debris, and
   camera response communicate events without depending on sound.
5. **Quiet nonverbal story.** Environment and staging carry meaning; the ending
   does not explain itself in dialogue or take control away.

## Difficulty and failure

- Early success should validate the correct idea before demanding precision.
- Later difficulty should come from route composition, timing, interception,
  state management, and consequences more often than narrower platforms.
- Difficult arcs explicitly define clean success, recoverable failure, costly
  detour, or death.
- Restart must be fast enough that a failed attempt feels like useful feedback.
- Mastery shortcuts are welcome when they are intentional and uncommon for a
  first-time player.

## Hard non-goals

No combat, enemies, inventory, currency, skill trees, dialogue system, branching
narrative, forced ending walk, jump button, or unrelated input expansion. Do not
grow the project with procedural content, online services, or generation-time
dependencies that the shipping game needs at runtime.

## Completion evidence

The product is not finished until the completion gates in
`docs/GOAL-ORCHESTRATION.md` are satisfied, including automated build and
gameplay evidence plus one human end-to-end release-candidate playthrough.
