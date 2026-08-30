# G3A Traversal-State Substrate Report 001

## State contract

The player has one mutually exclusive temporary traversal-state slot:

- `neutral`;
- `cold`;
- `heat`;
- `magnetic`.

State is acquired by physically touching typed factory-source rectangles. Contact
refreshes duration; a different source replaces the current state; time advances
inside the authoritative gameplay step; expiry returns to neutral. No new player
input was added.

## Interaction contract

Levels may declare typed interaction rectangles for freezing water, stabilizing
machinery, cooling surfaces, melting barriers, thawing ice, reactivating charges,
or magnetic attachment. The shared core emits one contact result per interaction
per outer frame with the active state and whether the interaction accepts it.

G3A deliberately does not implement cold/heat/magnetic world effects. G3B–D own
those effects while consuming this shared event/state boundary.

## Runtime observability

Debug mode now shows:

- active traversal state and remaining lifetime;
- colored state-source bounds;
- interaction-target bounds.

Existing Levels 1–8 declare no state sources or interactions, so their shipping
behavior and visuals remain unchanged.

## Verification

- state starts neutral;
- source contact acquires and refreshes state;
- a different source replaces state;
- state expires according to authoritative time;
- interaction contact is deduplicated per frame and reports accepted/rejected;
- `npm test`: 18/18 passing, including existing Level 8 replay/evaluators;
- `npm run validate:levels`: Level 8 PASS;
- `npm run lint`: passing;
- `npm run build`: passing;
- local development route continues returning HTTP 200; interactive capture is
  still unavailable in this environment.

## Gate result

G3A is complete. Cold, heat, and magnetism can now share a deterministic state,
source, contact, event, test, and debug contract without adding controls or
forking gameplay logic.
