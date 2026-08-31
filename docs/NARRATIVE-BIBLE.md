# Blast Escape — Narrative Bible

## Canon

An unshipped industrial robot wakes or resumes operation inside an abandoned
factory. The automated facility still treats it as a unit moving through
mobility tests, production, inspection, and dispatch. With no arms and no jump
function, it misuses active equipment to continue toward shipment.

At final dispatch, the system reveals that the robot's order was cancelled. No
new assignment replaces it. The external door is already open. Control remains
with the player, who may leave under their own input.

## Delivery rules

- no dialogue, named protagonist, narrator, dialogue boxes, lore dumps, or
  explanatory cutscene;
- use environment, machinery behavior, symbols, sparse industrial labels,
  silhouettes, staging, and repetition/change across zones;
- text may label industrial function, status, or destination, but must not speak
  as a character or explain the theme;
- the robot's direction toward outbound should be inferable before the ending;
- cancellation should be legible through scanner/status behavior and staging,
  not a paragraph;
- after the reveal, do not force walking, lock controls, add a substitute quest
  marker, or make the open door a cinematic prop.

## Story progression

1. **Test line:** the factory's blast trials incidentally become locomotion.
2. **Production systems:** cooling and heat stations operate without supervision;
   the robot becomes temporary material moving through them.
3. **Transport/inspection:** magnetic infrastructure and scanners increasingly
   frame the robot as inventory bound for dispatch.
4. **Dispatch:** the expected fulfillment fails because the order is cancelled.
5. **Open exit:** the system has no answer; the player's continued control is
   the final narrative fact.

## Executable zone staging

The presentation mapping in `game/presentation.ts` is the runtime source of
truth for zone boundaries and motifs.

| Levels | Function | Repeated visual evidence | Change the player should notice |
|---|---|---|---|
| 1–8 | mobility test line | calibration rulers, blast cells, repeated test bays | the space measures units rather than housing people |
| 9–14 | coolant works | insulated pipes, drips, transfer tanks | the robot is routed through material-processing infrastructure |
| 15–19 | thermal processing | furnace columns, vent slits, quench housings | production systems continue operating without supervision |
| 20–24 | induction transfer | overhead rails, coils, empty unit carriers | the robot increasingly occupies an inventory/shipment route |
| 25 | final inspection / dispatch | empty unit bays, inspection frames, outbound chevrons | expected shipment staging terminates at a cancelled slot and open exit |

Functional labels may identify these departments, but the motif progression
must still read if text is ignored. Background props stay low-contrast and may
not resemble usable platforms, active hazards, state sources, or route markers.

## Ending acceptance

The ending must be understandable without sound, retain movement controls from
reveal through departure, permit a pause before leaving, and only enter the final
credits/completion state after the player crosses the open exit threshold.

The former prototype final overlay (`ALL CLEAR` / `EVERY DIRECTIVE COMPLETE`)
has been removed. The scanner cancellation and player-chosen departure in D-020
are the canonical runtime behavior.
