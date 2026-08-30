# G9A Cold / Level 11 Report 001

## Level intent

`LEVEL 11 — COLD LOCK` adds one cold application and reuses a broad blast route:

`START -> coolant -> lock transfer carriage -> B1 -> locked carriage -> inspection deck -> EXIT`

- Cold contact fixes the moving carriage at a visibly marked dock.
- The carriage adjoins the right deck, making the landing and crossing broad.
- A launch post fixes B1 setup; a brief coast settles the player onto the deck.
- The start floor is safe before commitment; a missed carriage falls into the pit.
- Expiring cold-created blast routes remain reserved for Level 12.

## Authoritative implementation

- Moving-platform data can name a controlling interaction and dock coordinate.
- `movingPlatformAt` returns the dock with zero velocity while stabilized and the
  original cycle at all other times.
- Runtime collision, rider motion, replay, and rendering consume that same result.
- The dock marker, blue platform edge, and `CARRIAGE LOCKED` label expose the
  state without adding input or dialogue.

## Validation evidence

| Check | Result |
| --- | --- |
| accepted route | PASS, 4.483s |
| required state | cold acquired |
| required interaction | `carriage-lock` accepted |
| required blast | B1 hit |
| constant left/neutral bypass | neither clears |
| ±100ms switch jitter | 100/100 clear |
| settle/resume window | 2.5–2.7s / 3.1–3.5s grid clears |
| same replay without coolant source | misses carriage and dies on `fall` |
| occupied lock expiry | carriage resumes cycle; player falls |

Holding right is intentionally not classified as an exploit in this introduction:
the cold interaction remains mandatory, and the level's new lesson is reading the
machine lock rather than a steering reversal. Evaluators reject broken routes and
bypasses; they do not prove fun.

## Verification

- `npm test`: 30/30 passing.
- `npm run validate:levels`: Levels 8–11 PASS.
- `npm run lint`: passing.
- `npm run build`: passing.
- artifacts: `artifacts/level-validation/level-8.json` through `level-11.json`.
- visual browser capture remains unavailable; the near-final human feel gate is
  still required.

## Gate result

The Level 11 slice is accepted. The machinery-stabilization rule is shared and
does not alter the locked Level 6 moving-platform cycle. G9A remains active and
Level 12 may now test blast timing while a cold-created route expires.
