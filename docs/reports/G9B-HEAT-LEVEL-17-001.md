# G9B Heat / Level 17 Report 001

## Level intent

`LEVEL 17 — HEAT WINDOW` turns remaining heat lifetime into route planning:

`wait -> furnace heat -> first-cycle B1 -> upper thermal seal -> EXIT`

Taking heat immediately is a plausible but insufficient attempt: the player
still reaches and uses B1, but arrives at the upper seal after heat expires. A
short wait before entering the furnace lane preserves enough lifetime for the
same route. No state is silently consumed and no new input is introduced.

## Authoritative implementation

- Level 17 uses the existing heat source lifetime, B1 bomb cycle, melt-barrier
  interaction, linked collision, and traversal-state expiry unchanged.
- The furnace lies under the upper seal. Its short duration makes pickup time
  visible while preserving a broad successful wait window.
- A failed upper attempt can walk off the right deck, land on safe lower floor,
  reacquire heat, and use B1's unchanged repeat cycle.
- No new shared-core feature, physics change, or one-off controller was needed.

## Validation evidence

| Check | Result |
| --- | --- |
| accepted delayed-pickup route | PASS, 6.183s, heat + B1 + upper seal melt |
| constant left/neutral/right bypass | none clears |
| ±100ms timing noise | 100/100 clear |
| immediate pickup | hits B1, expires, and stops at the solid upper seal |
| same delayed route without heat | hits B1 and stops at the same seal |
| delayed pickup samples | waits of 0.4, 0.8, 1.2, 1.6, and 1.8s clear |
| early-attempt recovery | drops, reacquires heat, hits repeating B1, clears at 11.783s |

These checks establish a load-bearing lifetime choice, reachability, recovery,
exploit rejection, and input tolerance. They do not prove fun.

## Verification

- `npm test`: 60/60 passing.
- `npm run validate:levels`: Levels 8–17 PASS.
- `npm run lint`: passing.
- `npm run build`: passing.
- local development HTTP response: 200.
- artifact: `artifacts/level-validation/level-17.json`.
- interactive browser capture remains unavailable; the near-final human feel gate
  is still required.

## Gate result

Level 17 is accepted without an engine request or new durable rule. G9B remains
active; Level 18 can now introduce one shared system that cold and heat alter in
opposite, readable ways.
