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
