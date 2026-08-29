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
