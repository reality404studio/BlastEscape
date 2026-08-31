# Blast Escape — Human Calls

This ledger is for decisions that genuinely require human taste, judgment, external authority, or a final physical playtest. It is not a permission queue for normal engineering work.

## Open calls

### HC-ART-001 — Protagonist base identity

**Status:** OPEN
**Owner:** G4 Art Direction / G5 Sprite Pipeline
**Decision needed:** choose the base protagonist identity before full sprite and animation production.
**Why human:** the silhouette is a taste/authorship decision, and changing it after animation production would invalidate expensive downstream work.
**Options:**
1. **A — Foundry Pod (Director recommendation):** closest key-art continuity and clearest gameplay-scale separation of shell, sensor, undercarriage, and feet.
2. **B — Inspection Wedge:** strongest forward direction, with a more technical/scout-like character.
3. **C — Cratelet Unit:** most vulnerable cargo/service-unit identity, with a deliberately plain wide shell.
4. **Request one bounded revision:** name the candidate to revise and one or two concrete traits to retain/change; do not start a new visual direction without recording that material change.
**Evidence:** `docs/reports/G4-PROTAGONIST-CANDIDATES-001.md` and the three PNGs in `artifacts/art-direction/`.
**Default if deferred:** provisionally select A because it scores highest on the executable rubric and best preserves the existing key-art/runtime identity.
**Blocked work:** final character source sprite, complete animation/state production, and G5 runtime atlas integration.
**Unblocked work:** environment art, deterministic runtime integration scaffold, FX, environmental story, Level 1–8 evidence, and release infrastructure.

## Expected gates

### HC-QA-001 — End-to-end release playthrough

**Status:** NOT YET OPEN  
**Owner:** G11 Final QA / Release  
**Decision needed:** play the release candidate end-to-end and report feel/fairness/readability blockers.  
**Why human:** automated simulation can verify reachability and robustness but cannot certify fun, frustration quality, or narrative landing.  
**Expected evidence:** playable release candidate, known-issues list, playtime estimate.  
**Default if deferred:** do not call the game fully validated; mark release as technically complete but awaiting human feel pass.  
**Blocked work:** final "finished" declaration.  
**Unblocked work:** technical QA and cleanup.

## Call template

When opening a real call, copy this section and move it under **Open calls**.

### HC-AREA-NNN — Short title

**Status:** OPEN  
**Owner:** G? / workstream  
**Decision needed:**  
**Why human:**  
**Options:**  
1.  
2.  
3.  
**Evidence:**  
**Default if deferred:**  
**Blocked work:**  
**Unblocked work:**

## Resolution rule

When the human answers, change `Status` to `RESOLVED`, record the choice and date/commit, and copy any durable design/architecture consequence to `DECISIONS.md`. Do not delete the history.
