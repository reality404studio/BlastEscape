# Blast Escape — Shared Engine Requests

Level-production or content sessions use this file when they discover that a shared runtime/tooling capability is missing.

Do **not** solve a shared-engine gap by adding a private one-off physics or mechanic fork inside one level range.

## Open requests

None.

## Resolved requests

### ER-001 — Timed interaction-result collision surfaces

**Status:** RESOLVED
**Requested by:** G9A / Level 10
**Need:** A `freeze-water` interaction must be able to expose a temporary shared-core collision surface and protect the corresponding water hazard.
**Why shared:** Browser play, replay, and later cold levels must resolve the same surface lifetime and collision rules.
**Minimal contract:** Level data names the interaction, result rectangle, active lifetime, and protected water span; `stepGameplay` owns activation, expiry, collision, and death.
**Evidence / reproduction:** `tests/water-freezing.test.ts`, `docs/reports/G9A-COLD-LEVEL-10-001.md`, and `artifacts/level-validation/level-10.json`.
**Workaround available:** no
**Blocks:** resolved for G9A Level 10
**Suggested owner:** G3 Mechanics / G1 Runtime

## Template

### ER-NNN — Short capability name

**Status:** OPEN  
**Requested by:** G? / level(s)  
**Need:**  
**Why shared:**  
**Minimal contract:**  
**Evidence / reproduction:**  
**Workaround available:** yes/no  
**Blocks:**  
**Suggested owner:** G1 Runtime / G2 Level Lab / G3 Mechanics

## Resolution

When implemented, mark `Status: RESOLVED`, link the commit/test evidence, and update any durable API/behavior decision in `DECISIONS.md`.
