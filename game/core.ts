import { CONFIG } from './config.ts';
import {
  evaluateBlast,
  freshBombs,
  integratePlayerVelocity,
  movingPlatformAt,
} from './physics.ts';
import type { BlastEvaluation } from './physics.ts';
import type {
  ActiveTraversalState,
  BombState,
  Direction,
  LevelDefinition,
  PlayerState,
  Rect,
  TraversalStateKind,
} from './types.ts';

export type GameplayState = {
  levelElapsed: number;
  player: PlayerState;
  bombs: BombState[];
  comboCount: number;
  interactionStates: Record<string, { active: boolean; remainingSeconds: number }>;
};

export type DirectionSource = Direction | ((levelElapsed: number) => Direction);

export type GameplayEvent =
  | {
      type: 'moved';
      dt: number;
      point: { x: number; y: number };
      grounded: boolean;
    }
  | { type: 'landed'; x: number; footY: number; impactVelocity: number }
  | {
      type: 'bomb-exploded';
      bomb: Pick<BombState, 'x' | 'y' | 'label'>;
      blast: BlastEvaluation;
      playerBefore: Pick<PlayerState, 'controlVx' | 'blastVx' | 'vy'>;
      comboBefore: number;
      continuesAirChain: boolean;
      comboCount: number;
    }
  | { type: 'died'; reason: 'spikes' | 'fall' | 'hot-surface' | 'water' }
  | { type: 'cleared' }
  | {
      type: 'traversal-state-changed';
      previous: ActiveTraversalState;
      current: ActiveTraversalState;
      reason: 'acquired' | 'replaced' | 'expired';
    }
  | {
      type: 'traversal-interaction-contact';
      interactionId: string;
      interactionKind: string;
      stateKind: TraversalStateKind;
      accepted: boolean;
    }
  | {
      type: 'traversal-interaction-changed';
      interactionId: string;
      active: boolean;
      remainingSeconds: number;
      reason: 'activated' | 'deactivated' | 'expired';
    };

export function createGameplayState(level: LevelDefinition): GameplayState {
  return {
    levelElapsed: 0,
    player: {
      x: level.start.x,
      y: level.start.y,
      controlVx: 0,
      blastVx: 0,
      vy: 0,
      grounded: true,
      onMovingPlatform: false,
      traversalState: { kind: 'neutral', remainingSeconds: 0, sourceId: null },
    },
    bombs: freshBombs(level),
    comboCount: 0,
    interactionStates: Object.fromEntries(
      (level.traversalInteractions ?? []).map((interaction) => [
        interaction.id,
        { active: false, remainingSeconds: 0 },
      ]),
    ),
  };
}

export const bombIsPowered = (
  bomb: Pick<BombState, 'reactivatedByInteractionId'>,
  interactionStates: GameplayState['interactionStates'],
) => !bomb.reactivatedByInteractionId ||
  (interactionStates[bomb.reactivatedByInteractionId]?.active ?? false);

export const overlaps = (a: Rect, b: Rect) =>
  a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

export function spikeTriangles(strip: Rect) {
  const toothCount = Math.max(1, Math.round(strip.w / 24));
  const toothWidth = strip.w / toothCount;
  return Array.from({ length: toothCount }, (_, index) => {
    const left = strip.x + toothWidth * index;
    return [
      { x: left, y: strip.y },
      { x: left + toothWidth, y: strip.y },
      { x: left + toothWidth / 2, y: strip.y + strip.h },
    ];
  });
}

function triangleOverlapsRect(triangle: Array<{ x: number; y: number }>, rect: Rect) {
  const rectPoints = [
    { x: rect.x, y: rect.y },
    { x: rect.x + rect.w, y: rect.y },
    { x: rect.x + rect.w, y: rect.y + rect.h },
    { x: rect.x, y: rect.y + rect.h },
  ];
  const axes = [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    ...triangle.map((point, index) => {
      const next = triangle[(index + 1) % triangle.length];
      return { x: -(next.y - point.y), y: next.x - point.x };
    }),
  ];

  return axes.every((axis) => {
    const triangleProjection = triangle.map((point) => point.x * axis.x + point.y * axis.y);
    const rectProjection = rectPoints.map((point) => point.x * axis.x + point.y * axis.y);
    return (
      Math.max(...triangleProjection) >= Math.min(...rectProjection) &&
      Math.max(...rectProjection) >= Math.min(...triangleProjection)
    );
  });
}

export const touchesSpikes = (rect: Rect, spikes: Rect[] = []) =>
  spikes.some((strip) =>
    spikeTriangles(strip).some((triangle) => triangleOverlapsRect(triangle, rect)),
  );

const playerRect = (player: PlayerState): Rect => ({
  x: player.x,
  y: player.y,
  w: CONFIG.playerWidth,
  h: CONFIG.playerHeight,
});

const playerCenter = (player: PlayerState) => ({
  x: player.x + CONFIG.playerWidth / 2,
  y: player.y + CONFIG.playerHeight / 2,
});

const copyTraversalState = (state: ActiveTraversalState): ActiveTraversalState => ({ ...state });

function advanceTraversalState(state: GameplayState, dt: number): GameplayEvent[] {
  const active = state.player.traversalState;
  if (active.kind === 'neutral') return [];

  active.remainingSeconds = Math.max(0, active.remainingSeconds - dt);
  if (active.remainingSeconds > 0) return [];

  const previous = copyTraversalState(active);
  state.player.traversalState = { kind: 'neutral', remainingSeconds: 0, sourceId: null };
  return [{
    type: 'traversal-state-changed',
    previous,
    current: copyTraversalState(state.player.traversalState),
    reason: 'expired',
  }];
}

function advanceInteractionStates(state: GameplayState, dt: number): GameplayEvent[] {
  const events: GameplayEvent[] = [];
  for (const [interactionId, runtime] of Object.entries(state.interactionStates)) {
    if (!runtime.active) continue;
    runtime.remainingSeconds = Math.max(0, runtime.remainingSeconds - dt);
    if (runtime.remainingSeconds > 0) continue;
    runtime.active = false;
    events.push({
      type: 'traversal-interaction-changed',
      interactionId,
      active: false,
      remainingSeconds: 0,
      reason: 'expired',
    });
  }
  return events;
}

function applyTraversalContacts(
  state: GameplayState,
  level: LevelDefinition,
  seenInteractions: Set<string>,
): GameplayEvent[] {
  const events: GameplayEvent[] = [];
  const rect = playerRect(state.player);
  const source = level.traversalStateSources?.find((candidate) => overlaps(rect, candidate.rect));
  if (source) {
    const previous = copyTraversalState(state.player.traversalState);
    const changed = previous.kind !== source.grants || previous.sourceId !== source.id;
    state.player.traversalState = {
      kind: source.grants,
      remainingSeconds: source.durationSeconds,
      sourceId: source.id,
    };
    if (changed) {
      events.push({
        type: 'traversal-state-changed',
        previous,
        current: copyTraversalState(state.player.traversalState),
        reason: previous.kind === 'neutral' ? 'acquired' : 'replaced',
      });
    }
  }

  for (const interaction of level.traversalInteractions ?? []) {
    if (seenInteractions.has(interaction.id) || !overlaps(rect, interaction.rect)) continue;
    seenInteractions.add(interaction.id);
    const stateKind = state.player.traversalState.kind;
    events.push({
      type: 'traversal-interaction-contact',
      interactionId: interaction.id,
      interactionKind: interaction.kind,
      stateKind,
      accepted: stateKind !== 'neutral' && interaction.accepts.includes(stateKind),
    });
    if (
      stateKind !== 'neutral' &&
      interaction.accepts.includes(stateKind) &&
      interaction.deactivatesInteractionId
    ) {
      const target = state.interactionStates[interaction.deactivatesInteractionId];
      if (target?.active) {
        target.active = false;
        target.remainingSeconds = 0;
        events.push({
          type: 'traversal-interaction-changed',
          interactionId: interaction.deactivatesInteractionId,
          active: false,
          remainingSeconds: 0,
          reason: 'deactivated',
        });
      }
    }
    if (
      stateKind !== 'neutral' &&
      interaction.accepts.includes(stateKind) &&
      interaction.activeSeconds
    ) {
      const runtime = state.interactionStates[interaction.id] ?? {
        active: false,
        remainingSeconds: 0,
      };
      const wasActive = runtime.active;
      runtime.active = true;
      runtime.remainingSeconds = interaction.activeSeconds;
      state.interactionStates[interaction.id] = runtime;
      if (!wasActive) {
        events.push({
          type: 'traversal-interaction-changed',
          interactionId: interaction.id,
          active: true,
          remainingSeconds: runtime.remainingSeconds,
          reason: 'activated',
        });
      }
    }
  }
  return events;
}

function movePlayer(
  state: GameplayState,
  level: LevelDefinition,
  direction: Direction,
  dt: number,
) {
  const events: GameplayEvent[] = [];
  const { player } = state;
  const wasGrounded = player.grounded;
  const stabilizerId = level.movingPlatform?.stabilizedByInteractionId;
  const movingPlatformStabilized = stabilizerId
    ? state.interactionStates[stabilizerId]?.active ?? false
    : false;
  const movingBefore = level.movingPlatform
    ? movingPlatformAt(level.movingPlatform, state.levelElapsed, movingPlatformStabilized)
    : undefined;
  state.levelElapsed += dt;
  const movingAfter = level.movingPlatform
    ? movingPlatformAt(level.movingPlatform, state.levelElapsed, movingPlatformStabilized)
    : undefined;

  if (player.grounded && player.onMovingPlatform && movingBefore && movingAfter) {
    player.x += movingAfter.rect.x - movingBefore.rect.x;
  }

  const collisionPlatforms = [
    ...level.platforms.map((rect) => ({ rect, moving: false })),
    ...(level.meltableBarriers ?? [])
      .filter((barrier) =>
        !state.interactionStates[barrier.meltedByInteractionId]?.active,
      )
      .map((barrier) => ({ rect: barrier.rect, moving: false })),
    ...(level.traversalInteractions ?? [])
      .filter((interaction) =>
        interaction.kind === 'freeze-water' &&
        interaction.resultRect &&
        state.interactionStates[interaction.id]?.active,
      )
      .map((interaction) => ({ rect: interaction.resultRect!, moving: false })),
    ...(movingAfter ? [{ rect: movingAfter.rect, moving: true }] : []),
  ];

  Object.assign(player, integratePlayerVelocity(player, direction, dt));
  const oldX = player.x;
  const totalVx = player.controlVx + player.blastVx;
  player.x += totalVx * dt;
  for (const platform of collisionPlatforms) {
    if (!overlaps(playerRect(player), platform.rect)) continue;
    let collidedHorizontally = false;
    if (totalVx > 0 && oldX + CONFIG.playerWidth <= platform.rect.x + 2) {
      player.x = platform.rect.x - CONFIG.playerWidth;
      collidedHorizontally = true;
    } else if (totalVx < 0 && oldX >= platform.rect.x + platform.rect.w - 2) {
      player.x = platform.rect.x + platform.rect.w;
      collidedHorizontally = true;
    }
    if (collidedHorizontally) {
      player.controlVx = 0;
      player.blastVx = 0;
      break;
    }
  }

  const oldY = player.y;
  player.y += player.vy * dt;
  const impactVelocity = player.vy;
  player.grounded = false;
  player.onMovingPlatform = false;
  for (const platform of collisionPlatforms) {
    if (!overlaps(playerRect(player), platform.rect)) continue;
    if (player.vy >= 0 && oldY + CONFIG.playerHeight <= platform.rect.y + 4) {
      player.y = platform.rect.y - CONFIG.playerHeight;
      player.vy = 0;
      player.grounded = true;
      player.onMovingPlatform = platform.moving;
    } else if (player.vy < 0 && oldY >= platform.rect.y + platform.rect.h - 4) {
      player.y = platform.rect.y + platform.rect.h;
      player.vy = 0;
    }
  }

  if (!wasGrounded && player.grounded && impactVelocity > 250) {
    events.push({
      type: 'landed',
      x: player.x,
      footY: player.y + CONFIG.playerHeight,
      impactVelocity,
    });
  }
  if (player.grounded) state.comboCount = 0;
  events.push({ type: 'moved', dt, point: playerCenter(player), grounded: player.grounded });
  return events;
}

export function stepGameplay(
  state: GameplayState,
  level: LevelDefinition,
  directionSource: DirectionSource,
  dt: number,
) {
  const events: GameplayEvent[] = [
    ...advanceTraversalState(state, dt),
    ...advanceInteractionStates(state, dt),
  ];
  const seenInteractions = new Set<string>();

  for (let index = 0; index < 3; index += 1) {
    const direction = typeof directionSource === 'function'
      ? directionSource(state.levelElapsed)
      : directionSource;
    events.push(...movePlayer(state, level, direction, dt / 3));
    if (touchesSpikes(playerRect(state.player), level.spikes)) {
      events.push({ type: 'died', reason: 'spikes' });
      return events;
    }
    events.push(...applyTraversalContacts(state, level, seenInteractions));
    const hotSurface = level.hotSurfaces?.find((surface) =>
      overlaps(playerRect(state.player), surface.rect) &&
      !state.interactionStates[surface.cooledByInteractionId]?.active,
    );
    if (hotSurface) {
      events.push({ type: 'died', reason: 'hot-surface' });
      return events;
    }
    const waterHazard = level.waterHazards?.find((hazard) =>
      overlaps(playerRect(state.player), hazard.rect) &&
      !state.interactionStates[hazard.frozenByInteractionId]?.active,
    );
    if (waterHazard) {
      events.push({ type: 'died', reason: 'water' });
      return events;
    }
  }

  for (const bomb of state.bombs) {
    if (!bombIsPowered(bomb, state.interactionStates)) continue;
    bomb.timer -= dt;
    if (bomb.timer > 0) continue;

    const blast = evaluateBlast(state.player, bomb);
    const playerBefore = {
      controlVx: state.player.controlVx,
      blastVx: state.player.blastVx,
      vy: state.player.vy,
    };
    const comboBefore = state.comboCount;
    let continuesAirChain = false;
    if (blast.hit) {
      continuesAirChain = !state.player.grounded && state.comboCount > 0;
      state.comboCount = continuesAirChain ? state.comboCount + 1 : 1;
      state.player.blastVx += blast.impulseX;
      state.player.vy += blast.impulseY;
      state.player.grounded = false;
      state.player.onMovingPlatform = false;
    }
    events.push({
      type: 'bomb-exploded',
      bomb: { x: bomb.x, y: bomb.y, label: bomb.label },
      blast,
      playerBefore,
      comboBefore,
      continuesAirChain,
      comboCount: state.comboCount,
    });
    bomb.timer += CONFIG.bombRepeatInterval;
  }

  const exitUnlocked = !level.requiredCombo || state.comboCount >= level.requiredCombo;
  if (exitUnlocked && overlaps(playerRect(state.player), level.exit)) {
    events.push({ type: 'cleared' });
  }
  if (state.player.y > CONFIG.worldHeight + 80) {
    events.push({ type: 'died', reason: 'fall' });
  }
  return events;
}
