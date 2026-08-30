import assert from 'node:assert/strict';
import test from 'node:test';

import { createGameplayState, stepGameplay } from '../game/core.ts';
import { validateLevel } from '../game/lab/evaluators.ts';
import { runReplay } from '../game/lab/replay-runner.ts';
import { LEVELS } from '../game/levels.ts';
import { movingPlatformAt } from '../game/physics.ts';
import { LEVEL_11_CLEAN_REPLAY } from '../game/replays.ts';

const level11 = LEVELS[10];

test('Level 11 clean route locks the carriage, uses B1, and clears', () => {
  const report = validateLevel(level11, LEVEL_11_CLEAN_REPLAY);
  assert.equal(report.status, 'pass');
  assert.equal(report.acceptedReplay.outcome, 'cleared');
  assert.deepEqual(report.acceptedReplay.acquiredStates, ['cold']);
  assert.deepEqual(report.acceptedReplay.acceptedInteractions, ['carriage-lock']);
  assert.deepEqual(report.acceptedReplay.blastHits, ['B1']);
  assert.equal(report.acceptedReplay.landingCount, 1);
});

test('the same Level 11 route misses the cycling carriage without coolant', () => {
  const withoutCoolant = {
    ...level11,
    traversalStateSources: [],
  };
  const result = runReplay(withoutCoolant, LEVEL_11_CLEAN_REPLAY);
  assert.equal(result.outcome, 'died');
  assert.equal(result.deathReason, 'fall');
  assert.deepEqual(result.acquiredStates, []);
  assert.deepEqual(result.acceptedInteractions, []);
  assert.equal(result.landingCount, 0);
});

test('stabilization fixes the existing carriage at its dock with zero velocity', () => {
  const platform = level11.movingPlatform;
  assert.ok(platform);
  const first = movingPlatformAt(platform, 0, true);
  const later = movingPlatformAt(platform, 2.75, true);
  assert.equal(first.rect.x, platform.stabilizedX);
  assert.deepEqual(later, first);
  assert.equal(first.velocityX, 0);
  assert.notEqual(movingPlatformAt(platform, 2.75).rect.x, platform.stabilizedX);
});

test('an occupied carriage releases back to its normal cycle when the lock expires', () => {
  const state = createGameplayState(level11);
  state.levelElapsed = 3;
  state.player.x = 400;
  state.player.y = 414;
  state.player.grounded = true;
  state.player.onMovingPlatform = true;
  state.interactionStates['carriage-lock'] = {
    active: true,
    remainingSeconds: 0.01,
  };

  const expiryFrame = stepGameplay(state, level11, 0, 0.02);
  assert.ok(expiryFrame.some((event) =>
    event.type === 'traversal-interaction-changed' &&
    event.interactionId === 'carriage-lock' &&
    event.reason === 'expired',
  ));
  assert.equal(state.player.grounded, false);

  let fell = false;
  for (let frame = 0; frame < 180 && !fell; frame += 1) {
    const events = stepGameplay(state, level11, 0, 1 / 60);
    fell = events.some((event) => event.type === 'died' && event.reason === 'fall');
  }
  assert.equal(fell, true);
});

test('Level 11 launch settling has a broad timing window', () => {
  for (const settleTime of [2.5, 2.6, 2.7]) {
    for (const resumeTime of [3.1, 3.3, 3.5]) {
      const result = runReplay(level11, {
        ...LEVEL_11_CLEAN_REPLAY,
        id: `level-11-settle-${settleTime}-${resumeTime}`,
        keyframes: [
          { until: settleTime, direction: 1 },
          { until: resumeTime, direction: 0 },
          { until: Number.POSITIVE_INFINITY, direction: 1 },
        ],
      });
      assert.equal(result.outcome, 'cleared', `${settleTime}s/${resumeTime}s should clear`);
    }
  }
});
