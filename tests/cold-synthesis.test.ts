import assert from 'node:assert/strict';
import test from 'node:test';

import { validateLevel } from '../game/lab/evaluators.ts';
import { runReplay } from '../game/lab/replay-runner.ts';
import { LEVELS } from '../game/levels.ts';
import {
  LEVEL_14_CLEAN_REPLAY,
  LEVEL_14_MASTERY_REPLAY,
} from '../game/replays.ts';

const level14 = LEVELS[13];

test('Level 14 primary route synthesizes both cold interactions and both blasts', () => {
  const report = validateLevel(level14, LEVEL_14_CLEAN_REPLAY);
  assert.equal(report.status, 'pass');
  assert.equal(report.acceptedReplay.outcome, 'cleared');
  assert.deepEqual(report.acceptedReplay.acquiredStates, ['cold']);
  assert.deepEqual(report.acceptedReplay.acceptedInteractions, [
    'circuit-intake-freeze',
    'circuit-carriage-lock',
  ]);
  assert.deepEqual(report.acceptedReplay.blastHits, ['B1', 'B2']);
  assert.equal(report.acceptedReplay.landingCount, 2);
});

test('Level 14 mastery route converts a closer B1 launch into a faster direct clear', () => {
  const primary = runReplay(level14, LEVEL_14_CLEAN_REPLAY);
  const mastery = runReplay(level14, LEVEL_14_MASTERY_REPLAY);
  assert.equal(mastery.outcome, 'cleared');
  assert.deepEqual(mastery.blastHits, ['B1']);
  assert.equal(mastery.landingCount, 0);
  assert.ok(mastery.elapsedSeconds < primary.elapsedSeconds - 2);
});

test('Level 14 primary route depends on coolant and the stabilized carriage', () => {
  const withoutCoolant = runReplay(
    { ...level14, traversalStateSources: [] },
    LEVEL_14_CLEAN_REPLAY,
  );
  assert.equal(withoutCoolant.outcome, 'died');
  assert.equal(withoutCoolant.deathReason, 'water');

  assert.ok(level14.movingPlatform);
  const withoutLock = runReplay(
    {
      ...level14,
      movingPlatform: {
        ...level14.movingPlatform,
        stabilizedByInteractionId: 'missing-circuit-lock',
      },
    },
    LEVEL_14_CLEAN_REPLAY,
  );
  assert.equal(withoutLock.outcome, 'timeout');
  assert.equal(withoutLock.landingCount, 0);
});

test('B2 is required by the primary route but intentionally bypassed by mastery', () => {
  const withoutB2 = {
    ...level14,
    bombs: level14.bombs.filter((bomb) => bomb.label !== 'B2'),
  };
  assert.equal(runReplay(withoutB2, LEVEL_14_CLEAN_REPLAY).outcome, 'timeout');
  assert.equal(runReplay(withoutB2, LEVEL_14_MASTERY_REPLAY).outcome, 'cleared');
});

test('Level 14 mastery positioning has a practical braking window', () => {
  for (const [brakeTime, settleTime] of [
    [1.72, 1.84],
    [1.75, 1.9],
    [1.75, 1.93],
  ] as const) {
    const result = runReplay(level14, {
      ...LEVEL_14_MASTERY_REPLAY,
      id: `level-14-mastery-${brakeTime}-${settleTime}`,
      keyframes: [
        { until: brakeTime, direction: 1 },
        { until: settleTime, direction: -1 },
        { until: 3.2, direction: 0 },
        { until: Number.POSITIVE_INFINITY, direction: 1 },
      ],
    });
    assert.equal(result.outcome, 'cleared', `${brakeTime}s/${settleTime}s should clear`);
    assert.deepEqual(result.blastHits, ['B1']);
  }
});
