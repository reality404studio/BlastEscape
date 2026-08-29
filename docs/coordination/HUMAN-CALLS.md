# Blast Escape — Human Calls

This ledger is for decisions that genuinely require human taste, judgment, external authority, or a final physical playtest. It is not a permission queue for normal engineering work.

## Open calls

None.

## Expected gates

### HC-ART-001 — Protagonist base identity

**Status:** NOT YET OPEN  
**Owner:** G4 Art Direction / G5 Sprite Pipeline  
**Decision needed:** choose or approve the base protagonist design before mass sprite generation.  
**Why human:** identity/silhouette is a taste and authorship decision; regenerating all states after changing it is expensive.  
**Expected evidence:** 2–4 candidates or SpriteGen curation view, shown at gameplay scale and on representative factory backgrounds.  
**Default if deferred:** select the most readable candidate that best communicates "unfinished armless service/industrial robot with no jump hardware" and record the choice as provisional.  
**Blocked work:** final character animation production.  
**Unblocked work:** environment art, runtime integration scaffold, effects, level tools.

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
