import assert from 'node:assert/strict';
import test from 'node:test';

import { validateLevel } from '../game/lab/evaluators.ts';
import { runReplay } from '../game/lab/replay-runner.ts';
import { LEVELS } from '../game/levels.ts';
import { LEVEL_23_CLEAN_REPLAY } from '../game/replays.ts';

const level23 = LEVELS[22];

test('Level 23 turns carrier release into a cold landing and B2 relaunch', () => {
  const report = validateLevel(level23, LEVEL_23_CLEAN_REPLAY);
  assert.equal(report.status, 'pass');
  assert.equal(report.acceptedReplay.outcome, 'cleared');
  assert.deepEqual(report.acceptedReplay.acquiredStates, ['magnetic', 'cold']);
  assert.deepEqual(report.acceptedReplay.acceptedInteractions, [
    'quench-carrier',
    'quench-basin-freeze',
  ]);
  assert.deepEqual(report.acceptedReplay.blastHits, ['B1', 'B2']);
  assert.equal(report.acceptedReplay.landingCount, 1);
});

test('carrier release enters water without the coolant curtain', () => {
  const result = runReplay(
    {
      ...level23,
      traversalStateSources: level23.traversalStateSources?.filter(
        (source) => source.grants !== 'cold',
      ),
    },
    LEVEL_23_CLEAN_REPLAY,
  );
  assert.equal(result.outcome, 'died');
  assert.equal(result.deathReason, 'water');
  assert.deepEqual(result.acquiredStates, ['magnetic']);
  assert.deepEqual(result.acceptedInteractions, ['quench-carrier']);
});

test('cold acquisition alone cannot protect the basin without its freeze contact', () => {
  const result = runReplay(
    {
      ...level23,
      traversalInteractions: level23.traversalInteractions?.filter(
        (interaction) => interaction.id !== 'quench-basin-freeze',
      ),
    },
    LEVEL_23_CLEAN_REPLAY,
  );
  assert.equal(result.outcome, 'died');
  assert.equal(result.deathReason, 'water');
  assert.deepEqual(result.acquiredStates, ['magnetic', 'cold']);
  assert.deepEqual(result.acceptedInteractions, ['quench-carrier']);
});

test('B2 is required after the successful frozen landing', () => {
  const result = runReplay(
    { ...level23, bombs: level23.bombs.filter((bomb) => bomb.label !== 'B2') },
    LEVEL_23_CLEAN_REPLAY,
  );
  assert.notEqual(result.outcome, 'cleared');
  assert.deepEqual(result.blastHits, ['B1']);
  assert.equal(result.landingCount, 1);
  assert.deepEqual(result.acceptedInteractions, [
    'quench-carrier',
    'quench-basin-freeze',
  ]);
});

test('Level 23 accepts carrier-position and B2-steer variation', () => {
  for (const carrierShift of [3.58, 3.62, 3.64, 3.68, 3.72, 3.74]) {
    for (const b2Steer of [9.1, 9.2, 9.3]) {
      const result = runReplay(level23, {
        ...LEVEL_23_CLEAN_REPLAY,
        id: `level-23-${carrierShift}-${b2Steer}`,
        keyframes: [
          { until: carrierShift, direction: 1 },
          { until: b2Steer, direction: 0 },
          { until: Number.POSITIVE_INFINITY, direction: -1 },
        ],
      });
      assert.equal(result.outcome, 'cleared', `${carrierShift}s/${b2Steer}s should clear`);
    }
  }
});

test('Level 23 clean route clears across supported frame schedules', () => {
  for (const frameRate of [30, 50, 60, 120, 144]) {
    const result = runReplay(level23, {
      ...LEVEL_23_CLEAN_REPLAY,
      id: `level-23-${frameRate}hz`,
      frameRate,
    });
    assert.equal(result.outcome, 'cleared', `${frameRate}Hz should clear`);
  }
});
