import assert from 'node:assert/strict';
import test from 'node:test';

import { validateLevel } from '../game/lab/evaluators.ts';
import { runReplay } from '../game/lab/replay-runner.ts';
import { LEVELS } from '../game/levels.ts';
import { LEVEL_22_CLEAN_REPLAY } from '../game/replays.ts';

const level22 = LEVELS[21];

test('Level 22 hands off from heat ignition to airborne magnetism', () => {
  const report = validateLevel(level22, LEVEL_22_CLEAN_REPLAY);
  assert.equal(report.status, 'pass');
  assert.equal(report.acceptedReplay.outcome, 'cleared');
  assert.deepEqual(report.acceptedReplay.acquiredStates, ['heat', 'magnetic']);
  assert.deepEqual(report.acceptedReplay.acceptedInteractions, [
    'handoff-ignition',
    'handoff-rail',
  ]);
  assert.deepEqual(report.acceptedReplay.blastHits, ['B1']);
});

test('without heat, the launch charge remains dormant on the safe floor', () => {
  const result = runReplay(
    {
      ...level22,
      traversalStateSources: level22.traversalStateSources?.filter(
        (source) => source.grants !== 'heat',
      ),
    },
    LEVEL_22_CLEAN_REPLAY,
  );
  assert.equal(result.outcome, 'timeout');
  assert.deepEqual(result.blastExplosions, []);
  assert.deepEqual(result.acceptedInteractions, []);
  assert.deepEqual(result.acquiredStates, []);
});

test('without the airborne coil, powered B1 returns to the safe launch floor', () => {
  const result = runReplay(
    {
      ...level22,
      traversalStateSources: level22.traversalStateSources?.filter(
        (source) => source.grants !== 'magnetic',
      ),
    },
    LEVEL_22_CLEAN_REPLAY,
  );
  assert.equal(result.outcome, 'timeout');
  assert.equal(result.landingCount, 1);
  assert.equal(result.finalPlayer.x, 260);
  assert.deepEqual(result.blastHits, ['B1']);
  assert.deepEqual(result.acquiredStates, ['heat']);
  assert.deepEqual(result.acceptedInteractions, ['handoff-ignition']);
});

test('without the rail, the successful state handoff returns to the launch floor', () => {
  const result = runReplay(
    { ...level22, traversalInteractions: level22.traversalInteractions?.slice(0, 1) },
    LEVEL_22_CLEAN_REPLAY,
  );
  assert.equal(result.outcome, 'timeout');
  assert.equal(result.landingCount, 1);
  assert.equal(result.finalPlayer.x, 260);
  assert.deepEqual(result.acquiredStates, ['heat', 'magnetic']);
  assert.deepEqual(result.acceptedInteractions, ['handoff-ignition']);
});

test('Level 22 accepts broad reversal windows around both handoff inputs', () => {
  for (const leftTime of [2.96, 2.98, 3, 3.02, 3.04]) {
    for (const rightTime of [3.35, 3.45, 3.55]) {
      const result = runReplay(level22, {
        ...LEVEL_22_CLEAN_REPLAY,
        id: `level-22-${leftTime}-${rightTime}`,
        keyframes: [
          { until: leftTime, direction: 1 },
          { until: rightTime, direction: -1 },
          { until: Number.POSITIVE_INFINITY, direction: 1 },
        ],
      });
      assert.equal(result.outcome, 'cleared', `${leftTime}s/${rightTime}s should clear`);
    }
  }
});

test('Level 22 clean route clears across supported frame schedules', () => {
  for (const frameRate of [30, 50, 60, 120, 144]) {
    const result = runReplay(level22, {
      ...LEVEL_22_CLEAN_REPLAY,
      id: `level-22-${frameRate}hz`,
      frameRate,
    });
    assert.equal(result.outcome, 'cleared', `${frameRate}Hz should clear`);
  }
});
