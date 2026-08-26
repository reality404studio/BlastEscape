# Blast Escape

A small physics platformer about a robot that cannot jump.

It has to leave the factory anyway.

## Premise

Far in the future, an industrial facility has been abandoned.

We do not know what is outside.

We do not know whether humans still exist, whether other robots are waiting somewhere beyond the walls, or whether anything remains at all.

The player is a small mass-produced industrial robot left behind inside the facility.

It was designed with safety restrictions. One of them is simple:

> **The robot has no jump function.**

It was never supposed to need one.

Its body, however, is extremely durable. Blast forces can throw it across a room without damaging it.

Somewhere in its remaining control system, one directive is still active:

> **Proceed to outbound.**

It does not know what waits outside. It only knows that it has not yet been shipped.

The original shipping route is no longer usable. The factory is broken, silent, and partially collapsed. Automated machinery still wakes up in places, continuing tests for machines that may never arrive.

To reach outbound, the robot enters old mobility-test lines built for other kinds of robots — robots that could jump.

It cannot.

So it uses what is still available.

A blast can create vertical velocity even if `jump()` does not exist.

A moving platform can carry a body that was never given climbing behavior.

A physical system does not care which capabilities its designers intended the robot to have.

The robot is not trying to rebel. It is not trying to prove anything. It is simply executing the objective it still has.

It must be shipped.

So it keeps going.

## Core idea

Blast Escape is built around one rule:

> **The robot does not gain forbidden abilities. It uses the physical environment to produce the same result.**

The current version expresses this through explosions.

The robot cannot jump, but an explosion can launch it upward.

Future mechanics should follow the same logic rather than becoming a conventional ability-unlock system.

Possible extensions include:

- cooling the body so it becomes rigid, grips, anchors, or fits a different mechanical condition;
- heating the body so it softens, deforms, melts through, or changes how it interacts with a passage;
- using magnets, pressure, compression, charge, buoyancy, or other physical effects to create movement the robot itself was never given as an explicit function.

The interesting question is not:

> What new power does the player unlock?

It is:

> **What physical law can produce the behavior this robot was not allowed to perform?**

## World tone

The tone should stay dry, quiet, and slightly absurd.

The factory should not explain the joke.

Avoid explicit exposition about AI alignment, rebellion, humans fearing machines, or a robot becoming conscious. The world is more interesting if those interpretations remain available without being stated.

The facility may still contain calm, procedural language such as:

- `VERTICAL MOBILITY: NOT INSTALLED`
- `IMPACT SHELL: ACTIVE`
- `SAFETY-COMPLIANT UNIT`
- `OUTBOUND DIRECTIVE`
- `AUTOMATED TEST LINE`

The humor comes from the contradiction between these labels and what the player actually does with the environment.

The humans may have believed that removing a function removed a capability.

The game does not need to say whether they were right.

## Visual direction

The visual world should support the premise rather than decorate over it.

- **Player:** a small off-white industrial robot. Keep the current simple, slightly cute silhouette.
- **Static facility:** dark graphite / violet industrial structure.
- **Hazards and blast energy:** red, orange, amber.
- **Powered machinery / active motion guidance:** mint cyan.
- **Outbound / exit:** gold.

The factory is abandoned, but not dead in an organic ruin sense. The stronger image is:

> **The people are gone. The machines are still doing their jobs.**

Some test lines still run. Some lights still blink. Some mechanisms continue their cycles with no one left to supervise them.

That contrast should guide environmental art, UI copy, effects, and future level design.

## Design rule for future mechanics

When adding a mechanic, prefer this test:

1. What action is the robot explicitly unable or not designed to perform?
2. What property of the environment or the robot's material state could indirectly create the same outcome?
3. Can the player understand that relationship through play rather than a lore explanation?
4. Does the mechanic preserve the robot as a constrained industrial unit instead of turning it into a superhero with a growing ability list?

If the answer is yes, it probably belongs in Blast Escape.

## Current prototype

The current prototype focuses on blast-assisted movement:

- move left / right;
- no jump input;
- recurring blast charges provide launch force;
- later levels combine openings, spikes, pits, airborne relay blasts, and moving machinery.

The immediate polish target is documented in:

`docs/VISUAL-POLISH-01-INDUSTRIAL-LANGUAGE.md`

That document defines the first visual pass for the abandoned industrial facility without changing the existing game rules or physics.
