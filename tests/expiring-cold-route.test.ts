import assert from 'node:assert/strict';
import test from 'node:test';

import { validateLevel } from '../game/lab/evaluators.ts';
import { runReplay } from '../game/lab/replay-runner.ts';
import { LEVELS } from '../game/levels.ts';
import { LEVEL_12_CLEAN_REPLAY } from '../game/replays.ts';

const level12 = LEVELS[11];

test('Level 12 uses the first-cycle blast before the frozen route thaws', () => {
  const report = validateLevel(level12, LEVEL_12_CLEAN_REPLAY);
  assert.equal(report.status, 'pass');
  assert.equal(report.acceptedReplay.outcome, 'cleared');
  assert.deepEqual(report.acceptedReplay.acquiredStates, ['cold']);
  assert.deepEqual(report.acceptedReplay.acceptedInteractions, ['thaw-clock-freeze']);
  assert.deepEqual(report.acceptedReplay.blastHits, ['B1']);
  assert.ok(Math.abs(report.acceptedReplay.elapsedSeconds - 5) < 1 / 60);
});

test('the same Level 12 route enters water without coolant', () => {
  const result = runReplay({ ...level12, traversalStateSources: [] }, LEVEL_12_CLEAN_REPLAY);
  assert.equal(result.outcome, 'died');
  assert.equal(result.deathReason, 'water');
  assert.deepEqual(result.acquiredStates, []);
  assert.deepEqual(result.acceptedInteractions, []);
  assert.deepEqual(result.blastHits, []);
});

test('a late route dies on thaw but can survive to the repeat blast when ice is extended', () => {
  const lateReplay = {
    ...LEVEL_12_CLEAN_REPLAY,
    id: 'level-12-late-route-control',
    maxDurationSeconds: 12,
    keyframes: [
      { until: 1.4, direction: 0 as const },
      { until: 9.8, direction: 1 as const },
      { until: Number.POSITIVE_INFINITY, direction: -1 as const },
    ],
  };
  const late = runReplay(level12, lateReplay);
  assert.equal(late.outcome, 'died');
  assert.equal(late.deathReason, 'water');
  assert.deepEqual(late.acceptedInteractions, ['thaw-clock-freeze']);
  assert.deepEqual(late.blastHits, ['B1']);

  const extendedIce = {
    ...level12,
    traversalInteractions: level12.traversalInteractions?.map((interaction) => ({
      ...interaction,
      activeSeconds: 20,
    })),
  };
  const extended = runReplay(extendedIce, lateReplay);
  assert.equal(extended.outcome, 'cleared');
  assert.deepEqual(extended.blastHits, ['B1', 'B1']);
  assert.ok(extended.elapsedSeconds > 10);
});

test('Level 12 first-cycle reversal has a practical timing window', () => {
  for (const switchTime of [4.12, 4.16, 4.2, 4.24, 4.27]) {
    const result = runReplay(level12, {
      ...LEVEL_12_CLEAN_REPLAY,
      id: `level-12-switch-${switchTime}`,
      keyframes: [
        { until: switchTime, direction: 1 },
        { until: Number.POSITIVE_INFINITY, direction: -1 },
      ],
    });
    assert.equal(result.outcome, 'cleared', `${switchTime}s should clear`);
  }
});

test('Level 12 clean route clears across supported frame schedules', () => {
  for (const frameRate of [30, 50, 60, 120, 144]) {
    const result = runReplay(level12, {
      ...LEVEL_12_CLEAN_REPLAY,
      id: `level-12-${frameRate}hz`,
      frameRate,
    });
    assert.equal(result.outcome, 'cleared', `${frameRate}Hz should clear`);
  }
});
