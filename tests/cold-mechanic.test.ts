import assert from 'node:assert/strict';
import test from 'node:test';

import { validateLevel } from '../game/lab/evaluators.ts';
import { runReplay } from '../game/lab/replay-runner.ts';
import { LEVELS } from '../game/levels.ts';
import { LEVEL_9_CLEAN_REPLAY } from '../game/replays.ts';

const level9 = LEVELS[8];

test('Level 9 clean route acquires cold, cools the plate, uses B1, and clears', () => {
  const report = validateLevel(level9, LEVEL_9_CLEAN_REPLAY);
  assert.equal(report.status, 'pass');
  assert.equal(report.acceptedReplay.outcome, 'cleared');
  assert.deepEqual(report.acceptedReplay.acquiredStates, ['cold']);
  assert.deepEqual(report.acceptedReplay.acceptedInteractions, ['hot-plate-cooling']);
  assert.deepEqual(report.acceptedReplay.blastHits, ['B1']);
});

test('the hot plate rejects the same route when coolant acquisition is removed', () => {
  const withoutCoolant = {
    ...level9,
    traversalStateSources: [],
  };
  const result = runReplay(withoutCoolant, LEVEL_9_CLEAN_REPLAY);
  assert.equal(result.outcome, 'died');
  assert.equal(result.deathReason, 'hot-surface');
  assert.deepEqual(result.acquiredStates, []);
  assert.deepEqual(result.acceptedInteractions, []);
});

test('Level 9 clean route has a broad, non-frame-perfect steering window', () => {
  for (const switchTime of [3.2, 3.3, 3.6, 3.9]) {
    const result = runReplay(level9, {
      ...LEVEL_9_CLEAN_REPLAY,
      id: `level-9-switch-${switchTime}`,
      keyframes: [
        { until: switchTime, direction: 1 },
        { until: Number.POSITIVE_INFINITY, direction: -1 },
      ],
    });
    assert.equal(result.outcome, 'cleared', `${switchTime}s should clear`);
  }
});
