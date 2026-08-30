# Blast Escape — Decision Log

Record durable decisions that later Codex sessions should not casually rediscover or reverse. Keep entries short and evidence-based.

## D-001 — Existing hand-feel is a compatibility constraint

The current movement/blast response is already satisfying. Runtime extraction, deterministic simulation, and refactoring must characterize and preserve it before changing physics constants or control response.

## D-002 — One authoritative gameplay core

Do not create a second fake physics implementation for tooling. Real play, replay, and headless/evaluator paths should share the authoritative step/update logic wherever feasible.

## D-003 — Evaluators, not competing physics engines

The Level Lab may have multiple evaluators (reachability, exploit, noisy-human, mechanic verifier), but they should test the same world rules rather than each inventing different movement behavior.

## D-004 — Human calls are judgment gates, not permissions

Codex proceeds on routine engineering work. Human calls are reserved for authorship/taste, ambiguous play-feel, meaningful narrative changes, external-cost choices, or final human playtesting.

## D-005 — Nonverbal ending retains player agency

After the final scanner reveals that the order was cancelled, do not introduce a replacement quest marker or forced walking cutscene. The door is open and player control remains active; leaving is the player's action.

## D-006 — SpriteGen is an external production pipeline

Use `aldegad/sprite-gen` through its own skill/CLI contract where available. Do not vendor its whole implementation into Blast Escape without a specific technical reason. Approve protagonist identity before generating the complete state set.

## D-007 — Split mechanics and level production at real dependency seams

The original combined G3 and broad G8/G9 goals hid useful readiness boundaries.
Track a shared traversal-state substrate separately from cold, heat, and magnetism,
and track Levels 1–8, 9, 10–14, 15–19, and 20 separately. This lets existing blast
levels migrate once Level Lab is ready without waiting for all three later
mechanics, while still preventing mechanic-dependent level work from starting
early. Evidence: `docs/PROTOTYPE-AUDIT.md` and `docs/LEVEL-CURRICULUM.md`.

## D-008 — Extract existing time semantics before adopting fixed timestep

The prototype clamps each rendered frame to 34 ms, performs three movement and
collision substeps, then advances bomb timers once. Replacing this immediately
with a fixed-step accumulator could alter launch and fuse relationships. G1 will
first extract and test the current order, then compare candidate fixed/replay
scheduling against golden routes before changing runtime timing.

## D-009 — Preserve the existing restrained industrial visual language

The current palette, key art, and canvas pass already establish a coherent
graphite/violet factory with off-white protagonist, hot danger, mint powered
machinery, and gold outbound accents. G4 should formalize and pixelize this
direction, not restart it. Protagonist identity remains subject to HC-ART-001.

## D-010 — Gameplay emits events; presentation owns nondeterminism

The shared core owns movement, collision, hazards, bombs, blast response, combo,
death, and exit decisions, then emits ordered gameplay events. Canvas/React code
may turn those events into random particles, shake, flashes, and UI changes, but
presentation state cannot feed back into `stepGameplay`. This makes browser play
and headless replay share one authority without forcing visual effects into test
state.

## D-011 — One mutually exclusive temporary traversal state

Cold, heat, and magnetism share one player state slot with authoritative lifetime,
source, replacement, and expiry semantics. Touching factory equipment acquires or
refreshes state; touching a different source replaces it. This preserves the
small input vocabulary, prevents combinatorial simultaneous-state rules, and
gives all later mechanics one observable event/debug contract. World effects
remain owned by their mechanic goals rather than presentation code.

## D-012 — Level 9 teaches cold through one safe hot-surface application

Level 9 does not pull water freezing forward from the curriculum. It teaches an
unavoidable cold-source pickup and a broad, temporarily cooled floor plate, then
returns to one familiar blast launch. Water freezing remains Level 10. This keeps
the cold introduction observable and avoids asking the first cold level to teach
both state acquisition and temporary platform creation.

## D-013 — Frozen water is timed shared-core collision geometry

An accepted `freeze-water` interaction may expose one data-defined `resultRect`
for its active lifetime. The authoritative gameplay step uses that rectangle for
collision and suppresses only water hazards linked to the same interaction.
Expiry removes both protections before the next movement substep; rendering only
observes the result. This keeps runtime, replay, and later cold levels on one rule
instead of encoding an ice platform privately in Level 10 presentation code.

## D-014 — Cold stabilization reuses the authoritative moving-platform path

A moving platform may name one controlling interaction and one docking x
coordinate. While that interaction is active, `movingPlatformAt` returns the same
platform geometry at the dock with zero velocity; after expiry it returns to its
unchanged time-based cycle. Core collision, rider movement, replay, and rendering
all call that function. This adds a temporary machine state without creating a
Level 11-only platform implementation or changing Level 6 behaviour.

## D-015 — Heat melting removes linked barrier collision for a timed interval

A `melt-barrier` interaction may control one or more explicit meltable barriers.
While the interaction is active, the authoritative gameplay step omits those
barriers from collision; expiry restores them before the next movement substep.
Rendering observes the same interaction state. Neutral and cold contacts do not
activate the melt, preserving the mutually exclusive traversal-state contract
without adding a Level 15-only controller.

## D-016 — Dormant charge fuses advance only while their linked circuit is active

A bomb may reference one `reactivate-charge` interaction. Its authoritative fuse
does not decrement or explode while that interaction is inactive; activation
continues the existing timer and expiry pauses it without resetting progress.
Core, replay, and canvas query the same powered-state helper, so `DORMANT`, fuse
display, and blast behavior cannot drift. This is a shared bomb-data rule rather
than a Level 16 script.

## D-017 — Accepted interactions may explicitly deactivate a linked world state

A traversal interaction may name one other interaction state to deactivate.
Accepted contact sets that target inactive, clears its remaining lifetime, and
emits a `deactivated` event before the next movement substep. Level 18 uses this
generic link for heat to release a cold-created condensate span; the same contract
can later release other frozen machinery without parallel level scripts. State
replacement on the player remains governed by the single-slot D-011 contract.

## D-018 — Magnetic attachment is automatic, bounded rail motion

A rising player carrying the magnetic traversal state may attach automatically
when entering a `magnetic-attach` interaction with a data-defined rail rectangle
and lifetime. While attached, existing left/right control moves along that rail
and vertical motion is constrained. Reaching either rail end, attachment discharge,
or magnetic-state expiry releases into normal gravity. Capture only occurs while
rising, preventing rail-end release from immediately reattaching. This preserves
the no-new-input and no-free-flight contracts in runtime and replay.

## D-019 — Moving magnetic carriers reuse the shared platform motion authority

A `magnetic-attach` interaction may optionally define a `movingResult`, explicit
capture padding, and one configured path end for automatic release. The existing
`movingPlatformAt` function supplies the carrier rectangle and velocity to shared
contact, attachment, replay, and rendering helpers. An attached player inherits
the carrier's frame-to-frame displacement and may reposition only with existing
left/right control. A direction change at the configured endpoint releases back
to gravity. This extends D-018 without a second motion system, free flight, a new
input, or a Level 21-only controller.
