import assert from 'node:assert/strict';
import test from 'node:test';

import { validateLevel } from '../game/lab/evaluators.ts';
import { runReplay } from '../game/lab/replay-runner.ts';
import { LEVELS } from '../game/levels.ts';
import {
  LEVEL_17_CLEAN_REPLAY,
  LEVEL_17_RECOVERY_REPLAY,
} from '../game/replays.ts';

const level17 = LEVELS[16];

test('Level 17 preserves heat through B1 to melt the upper seal', () => {
  const report = validateLevel(level17, LEVEL_17_CLEAN_REPLAY);
  assert.equal(report.status, 'pass');
  assert.equal(report.acceptedReplay.outcome, 'cleared');
  assert.deepEqual(report.acceptedReplay.acquiredStates, ['heat']);
  assert.deepEqual(report.acceptedReplay.acceptedInteractions, ['upper-seal-melt']);
  assert.deepEqual(report.acceptedReplay.blastHits, ['B1']);
});

test('immediate heat pickup expires at the upper seal', () => {
  const result = runReplay(level17, {
    ...LEVEL_17_CLEAN_REPLAY,
    id: 'level-17-immediate-pickup',
    keyframes: [
      { until: 4.9, direction: 1 },
      { until: Number.POSITIVE_INFINITY, direction: -1 },
    ],
  });
  assert.equal(result.outcome, 'timeout');
  assert.deepEqual(result.acquiredStates, ['heat']);
  assert.deepEqual(result.blastHits, ['B1']);
  assert.deepEqual(result.acceptedInteractions, []);
  assert.equal(result.finalPlayer.x, 680);
});

test('the Level 17 route cannot open the upper seal without heat', () => {
  const result = runReplay(
    { ...level17, traversalStateSources: [] },
    LEVEL_17_CLEAN_REPLAY,
  );
  assert.equal(result.outcome, 'timeout');
  assert.deepEqual(result.acquiredStates, []);
  assert.deepEqual(result.acceptedInteractions, []);
  assert.equal(result.finalPlayer.x, 680);
});

test('an early pickup can recover through the furnace and repeating B1 cycle', () => {
  const result = runReplay(level17, LEVEL_17_RECOVERY_REPLAY);
  assert.equal(result.outcome, 'cleared');
  assert.deepEqual(result.blastHits, ['B1', 'B1']);
  assert.deepEqual(result.acceptedInteractions, ['upper-seal-melt']);
  assert.equal(result.landingCount, 3);
  assert.ok(result.elapsedSeconds > 11);
  assert.ok(result.elapsedSeconds < 12);
});

test('Level 17 delayed pickup has a seconds-wide timing window', () => {
  for (const waitTime of [0.4, 0.8, 1.2, 1.6, 1.8]) {
    const result = runReplay(level17, {
      ...LEVEL_17_CLEAN_REPLAY,
      id: `level-17-wait-${waitTime}`,
      keyframes: [
        { until: waitTime, direction: 0 },
        { until: 4.9, direction: 1 },
        { until: Number.POSITIVE_INFINITY, direction: -1 },
      ],
    });
    assert.equal(result.outcome, 'cleared', `${waitTime}s wait should clear`);
  }
});
