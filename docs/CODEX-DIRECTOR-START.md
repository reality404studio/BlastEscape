# Start Blast Escape in Codex `/goal`

Use one project-director session first. Do not manually create eleven independent sessions before the director inspects the repository and dependencies.

## Paste this into Codex `/goal`

```text
Finish Blast Escape as the polished approximately one-hour pixel-art game defined by this repository.

Act as the project director as well as an implementer. You are responsible for decomposing the final outcome into bounded goals, deciding dependency order, starting only work whose prerequisites are ready, maintaining repository-based status, and carrying routine engineering work forward without repeatedly asking me for permission.

Before planning or editing, read in this order:
1. AGENTS.md
2. docs/GOAL-ORCHESTRATION.md
3. docs/LEVEL-DESIGN-GRAMMAR.md
4. docs/coordination/STATUS.md
5. docs/coordination/GOALS.md
6. docs/coordination/HUMAN-CALLS.md
7. docs/coordination/DECISIONS.md
8. docs/coordination/ENGINE-REQUESTS.md

Then inspect the actual repository and reconcile those documents with reality. The current implementation is a prototype, so do not assume the proposed architecture already exists.

Your operating rules:
- The existing movement/blast hand-feel is a compatibility constraint. Characterize it before refactoring it.
- Do not mass-produce levels before the reusable gameplay core / level-data / validation path is stable enough to support them.
- Runtime and simulation should share authoritative gameplay logic rather than drift into separate physics engines.
- Use multiple evaluators (reachability, exploit, noisy-human, mechanic verification where practical) to reject bad level candidates; do not claim automated solvers prove fun.
- Preserve the no-jump identity and the nonverbal story/ending contract.
- Keep the final game bounded. Do not add combat, enemies, inventory, currency, skill trees, dialogue systems, branching narrative, or unrelated feature creep.
- Use `https://github.com/aldegad/sprite-gen` as the preferred character-sprite production/curation pipeline when available. Read its installed SKILL.md before using it. Do not generate the complete animation set until the protagonist identity human gate is approved.
- Veo or other video generation may be used as motion/effect reference if useful, but the shipping game must not depend on nondeterministic video generation.

You may reorganize the proposed G0–G11 goal graph if repository evidence supports a better decomposition. If you change a durable dependency or contract, record why in docs/coordination/DECISIONS.md.

Human interaction policy:
- Do not ask me for routine implementation permission.
- When genuinely human judgment is necessary, create a concrete `HUMAN CALL` entry in docs/coordination/HUMAN-CALLS.md with options, evidence, default-if-deferred, blocked work, and unblocked work.
- Continue all unblocked work after opening a human call.
- Human judgment is specifically expected for protagonist identity before mass sprite generation, unresolved play-feel choices that automation cannot decide, material changes to visual/narrative direction, nontrivial new external-generation cost/dependencies, and the final end-to-end feel pass.

Monitoring:
- Keep docs/coordination/STATUS.md concise and current at meaningful state transitions.
- Keep docs/coordination/GOALS.md as the durable goal/dependency registry.
- If a level/content goal needs a shared-engine feature, use docs/coordination/ENGINE-REQUESTS.md rather than forking one-off behavior.
- Back completion claims with tests, reports, screenshots/artifacts, playable evidence, or other appropriate verification.

Begin by auditing the existing prototype against the orchestration contract, update the goal registry/status to reflect the real starting point, then execute the highest-leverage READY goal. Do not start by redesigning visuals or generating many levels.
```

## What the human needs to do

Normally: start this one `/goal` session and let the director work.

When the director produces a `HUMAN CALL`, inspect only the supplied evidence/options and answer the decision. You should not need to understand Git internals, assign every subgoal manually, or continuously supervise routine implementation.

The two planned mandatory checkpoints are:

1. approve/choose the protagonist base identity before full SpriteGen animation production;
2. play one near-final build end-to-end before the director declares the game finished.

Additional calls are allowed only for the judgment categories defined in `docs/GOAL-ORCHESTRATION.md`.
