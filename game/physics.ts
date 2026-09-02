import { CONFIG } from './config.ts';
import type {
  BombDefinition,
  BombState,
  Direction,
  LevelDefinition,
  MovingPlatform,
  PlayerState,
  Rect,
  TraversalInteraction,
} from './types.ts';

export function playerHorizontalVelocity(player: PlayerState) {
  return player.controlVx + player.blastVx;
}

export function movingPlatformAt(
  platform: MovingPlatform,
  time: number,
  stabilized = false,
) {
  if (stabilized && platform.stabilizedX !== undefined) {
    return {
      rect: {
        x: platform.stabilizedX,
        y: platform.y,
        w: platform.w,
        h: platform.h,
      },
      velocityX: 0,
    };
  }

  const travelTime = (platform.toX - platform.fromX) / platform.speed;
  const cycleTime = travelTime * 2;
  const cyclePosition = (time + platform.phase) % cycleTime;
  const movingRight = cyclePosition < travelTime;
  const x = movingRight
    ? platform.fromX + cyclePosition * platform.speed
    : platform.toX - (cyclePosition - travelTime) * platform.speed;

  return {
    rect: { x, y: platform.y, w: platform.w, h: platform.h },
    velocityX: movingRight ? platform.speed : -platform.speed,
  };
}

export function traversalInteractionResultAt(
  interaction: TraversalInteraction,
  time: number,
): Rect | undefined {
  return traversalInteractionMotionAt(interaction, time)?.rect;
}

export function traversalInteractionMotionAt(
  interaction: TraversalInteraction,
  time: number,
) {
  if (interaction.movingResult) return movingPlatformAt(interaction.movingResult, time);
  return interaction.resultRect
    ? { rect: interaction.resultRect, velocityX: 0 }
    : undefined;
}

export function traversalInteractionContactAt(
  interaction: TraversalInteraction,
  time: number,
): Rect {
  const movingResult = interaction.movingResult
    ? traversalInteractionMotionAt(interaction, time)?.rect
    : undefined;
  if (!movingResult) return interaction.rect;

  const padding = interaction.movingCapturePadding ?? {
    horizontal: 0,
    above: 0,
    below: 0,
  };
  return {
    x: movingResult.x - padding.horizontal,
    y: movingResult.y - padding.above,
    w: movingResult.w + padding.horizontal * 2,
    h: movingResult.h + padding.above + padding.below,
  };
}

export function freshBombs(level: LevelDefinition): BombState[] {
  return level.bombs.map((bomb) => ({
    ...bomb,
    timer: CONFIG.bombFuseDuration + bomb.delay,
  }));
}

export function integratePlayerVelocity(
  player: PlayerState,
  direction: Direction,
  dt: number,
) {
  const acceleration = player.grounded ? CONFIG.runAcceleration : CONFIG.airAcceleration;
  let controlVx = player.controlVx;
  if (direction !== 0) controlVx += direction * acceleration * dt;
  else if (player.grounded) {
    controlVx *= Math.pow(CONFIG.groundFriction, dt * 60);
  }
  controlVx = Math.max(-CONFIG.maxRunSpeed, Math.min(CONFIG.maxRunSpeed, controlVx));

  const blastRetention = player.grounded
    ? CONFIG.blastGroundRetention
    : CONFIG.blastAirRetention;
  let blastVx = player.blastVx * Math.pow(blastRetention, dt * 60);
  if (Math.abs(blastVx) < 0.5) blastVx = 0;

  const vy = Math.min(CONFIG.maxFallSpeed, player.vy + CONFIG.gravity * dt);
  return { controlVx, blastVx, vy };
}

export type BlastEvaluation = {
  hit: boolean;
  centerX: number;
  centerY: number;
  distance: number;
  impulseX: number;
  impulseY: number;
};

export function evaluateBlast(
  player: PlayerState,
  bomb: Pick<BombDefinition, 'x' | 'y'>,
): BlastEvaluation {
  const centerX = player.x + CONFIG.playerWidth / 2;
  const centerY = player.y + CONFIG.playerHeight / 2;
  const rawX = centerX - bomb.x;
  const rawY = centerY - bomb.y;
  const distance = Math.hypot(rawX, rawY);
  if (distance > CONFIG.explosionRadius) {
    return { hit: false, centerX, centerY, distance, impulseX: 0, impulseY: 0 };
  }

  const biasedY = rawY - CONFIG.explosionVerticalBias;
  const length = Math.max(1, Math.hypot(rawX, biasedY));
  const falloff = 1 - distance / CONFIG.explosionRadius;
  const impulse = Math.min(
    CONFIG.explosionMaxImpulse,
    Math.max(
      CONFIG.explosionMinImpulse,
      CONFIG.explosionImpulse * (0.35 + falloff * 0.88),
    ),
  );

  return {
    hit: true,
    centerX,
    centerY,
    distance,
    impulseX: (rawX / length) * impulse,
    impulseY: (biasedY / length) * impulse,
  };
}
