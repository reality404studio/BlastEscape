import assert from 'node:assert/strict';
import test from 'node:test';

import { CONFIG } from '../game/config.ts';
import { LEVELS } from '../game/levels.ts';
import {
  evaluateBlast,
  freshBombs,
  integratePlayerVelocity,
  movingPlatformAt,
  playerHorizontalVelocity,
} from '../game/physics.ts';
import { directionAtTime, LEVEL_8_CLEAN_ROUTE } from '../game/replays.ts';
import type { PlayerState } from '../game/types.ts';

const basePlayer = (overrides: Partial<PlayerState> = {}): PlayerState => ({
  x: 92,
  y: 514,
  controlVx: 0,
  blastVx: 0,
  vy: 0,
  grounded: true,
  onMovingPlatform: false,
  traversalState: { kind: 'neutral', remainingSeconds: 0, sourceId: null },
  ...overrides,
});

const closeTo = (actual: number, expected: number, tolerance = 1e-9) => {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `expected ${actual} to be within ${tolerance} of ${expected}`,
  );
};

test('locks the prototype movement and blast constants', () => {
  assert.deepEqual(CONFIG, {
    worldWidth: 960,
    worldHeight: 600,
    playerWidth: 26,
    playerHeight: 36,
    runAcceleration: 1900,
    airAcceleration: 760,
    maxRunSpeed: 275,
    groundFriction: 0.8,
    blastAirRetention: 0.985,
    blastGroundRetention: 0.68,
    gravity: 1180,
    maxFallSpeed: 920,
    explosionRadius: 154,
    explosionImpulse: 830,
    explosionMinImpulse: 370,
    explosionMaxImpulse: 900,
    explosionVerticalBias: 58,
    bombFuseDuration: 4.8,
    bombRepeatInterval: 5.6,
    screenShake: 10,
  });
});

test('preserves grounded acceleration, reference-rate gravity, and velocity composition', () => {
  const next = integratePlayerVelocity(basePlayer({ blastVx: 100 }), 1, 1 / 60);

  closeTo(next.controlVx, 31.666666666666668);
  closeTo(next.blastVx, 68);
  closeTo(next.vy, 19.666666666666668);
  closeTo(playerHorizontalVelocity({ ...basePlayer(), ...next }), 99.66666666666667);
});

test('preserves weaker air control and long-lived airborne blast momentum', () => {
  const next = integratePlayerVelocity(
    basePlayer({ grounded: false, controlVx: 20, blastVx: 500, vy: -300 }),
    -1,
    1 / 60,
  );

  closeTo(next.controlVx, 7.333333333333334);
  closeTo(next.blastVx, 492.5);
  closeTo(next.vy, -280.3333333333333);
});

test('preserves direct-over-bomb launch and vertical bias', () => {
  const direct = evaluateBlast(basePlayer({ x: 337 }), { x: 350, y: 532 });
  assert.equal(direct.hit, true);
  closeTo(direct.distance, 0);
  closeTo(direct.impulseX, 0);
  closeTo(direct.impulseY, -900);

  const offset = evaluateBlast(basePlayer({ x: 387 }), { x: 350, y: 532 });
  assert.equal(offset.hit, true);
  closeTo(offset.distance, 50);
  closeTo(offset.impulseX, 511.7460926513848);
  closeTo(offset.impulseY, -593.6254674756063);

  const outside = evaluateBlast(basePlayer({ x: 504 }), { x: 350, y: 532 });
  assert.equal(outside.hit, false);
  assert.equal(outside.impulseX, 0);
  assert.equal(outside.impulseY, 0);
});

test('preserves moving-platform phase and direction', () => {
  const platform = LEVELS[5].movingPlatform;
  assert.ok(platform);
  const atStart = movingPlatformAt(platform, 0);

  closeTo(atStart.rect.x, 660.4, 1e-10);
  assert.equal(atStart.velocityX, -140);
});

test('preserves locked Level 7 route geometry', () => {
  const level = LEVELS[6];
  assert.equal(level.subtitle, 'RETURN ARC');
  assert.deepEqual(level.start, { x: 92, y: 514 });
  assert.deepEqual(level.bombs, [
    { x: 250, y: 532, delay: -2.5, label: 'B1' },
    { x: 680, y: 452, delay: -0.2, label: 'B2' },
    { x: 400, y: 282, delay: 1.9, label: 'B3' },
  ]);
  assert.deepEqual(level.exit, { x: 120, y: 76, w: 54, h: 64 });
  assert.deepEqual(level.spikes, [
    { x: 250, y: 322, w: 70, h: 58 },
    { x: 360, y: 90, w: 140, h: 70 },
  ]);
});

test('preserves Level 8 fuse schedule and clean-route steering switches', () => {
  const bombs = freshBombs(LEVELS[7]);
  assert.deepEqual(
    bombs.map((bomb) => Number(bomb.timer.toFixed(1))),
    [2.4, 2.9, 3.3, 3.7, 4.1],
  );
  assert.deepEqual(
    [2.899, 2.9, 3.299, 3.3, 3.699, 3.7, 4.099, 4.1].map((time) =>
      directionAtTime(LEVEL_8_CLEAN_ROUTE, time),
    ),
    [1, -1, -1, 1, 1, -1, -1, 1],
  );
});
