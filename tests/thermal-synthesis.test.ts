import assert from 'node:assert/strict';
import test from 'node:test';

import { validateLevel } from '../game/lab/evaluators.ts';
import { runReplay } from '../game/lab/replay-runner.ts';
import { LEVELS } from '../game/levels.ts';
import {
  LEVEL_19_CLEAN_REPLAY,
  LEVEL_19_RECOVERY_REPLAY,
} from '../game/replays.ts';

const level19 = LEVELS[18];

test('Level 19 primary route uses heat and B1 without checklist cold', () => {
  const report = validateLevel(level19, LEVEL_19_CLEAN_REPLAY);
  assert.equal(report.status, 'pass');
  assert.equal(report.acceptedReplay.outcome, 'cleared');
  assert.deepEqual(report.acceptedReplay.acquiredStates, ['heat']);
  assert.deepEqual(report.acceptedReplay.acceptedInteractions, ['launch-seal-melt']);
  assert.deepEqual(report.acceptedReplay.blastHits, ['B1']);
});

test('the fast heat route remains unchanged when recovery coolant is removed', () => {
  const withoutCoolant = {
    ...level19,
    traversalStateSources: level19.traversalStateSources?.filter(
      (source) => source.grants !== 'cold',
    ),
  };
  const baseline = runReplay(level19, LEVEL_19_CLEAN_REPLAY);
  const result = runReplay(withoutCoolant, LEVEL_19_CLEAN_REPLAY);
  assert.equal(result.outcome, 'cleared');
  assert.equal(result.elapsedSeconds, baseline.elapsedSeconds);
  assert.deepEqual(result.acquiredStates, ['heat']);
});

test('the primary route cannot pass the launch seal without heat', () => {
  const result = runReplay(
    {
      ...level19,
      traversalStateSources: level19.traversalStateSources?.filter(
        (source) => source.grants !== 'heat',
      ),
    },
    LEVEL_19_CLEAN_REPLAY,
  );
  assert.equal(result.outcome, 'timeout');
  assert.deepEqual(result.acceptedInteractions, []);
  assert.equal(result.finalPlayer.x, 194);
});

test('a short B1 arc replaces heat with cold and recovers through B2', () => {
  const result = runReplay(level19, LEVEL_19_RECOVERY_REPLAY);
  assert.equal(result.outcome, 'cleared');
  assert.deepEqual(result.acquiredStates, ['heat', 'cold']);
  assert.deepEqual(result.acceptedInteractions, [
    'launch-seal-melt',
    'emergency-basin-freeze',
  ]);
  assert.deepEqual(result.blastHits, ['B1', 'B2']);
  assert.ok(result.elapsedSeconds > 8);
  assert.ok(result.elapsedSeconds < 8.3);
});

test('the recovery branch requires both emergency coolant and B2', () => {
  const withoutCoolant = runReplay(
    {
      ...level19,
      traversalStateSources: level19.traversalStateSources?.filter(
        (source) => source.grants !== 'cold',
      ),
    },
    LEVEL_19_RECOVERY_REPLAY,
  );
  assert.equal(withoutCoolant.outcome, 'died');
  assert.equal(withoutCoolant.deathReason, 'water');

  const withoutB2 = runReplay(
    { ...level19, bombs: level19.bombs.filter((bomb) => bomb.label !== 'B2') },
    LEVEL_19_RECOVERY_REPLAY,
  );
  assert.equal(withoutB2.outcome, 'timeout');
  assert.deepEqual(withoutB2.blastHits, ['B1']);
  assert.ok(withoutB2.finalPlayer.x <= 300);
});

test('Level 19 recovery has a practical B1-brake and B2-steer window', () => {
  for (const [brakeTime, recoverTime, returnTime] of [
    [3.15, 3.55, 7],
    [3.2, 3.6, 7.1],
    [3.2, 3.6, 7.2],
    [3.25, 3.65, 7.3],
    [3.25, 3.7, 7.4],
  ] as const) {
    const result = runReplay(level19, {
      ...LEVEL_19_RECOVERY_REPLAY,
      id: `level-19-recovery-${brakeTime}-${recoverTime}-${returnTime}`,
      keyframes: [
        { until: brakeTime, direction: 1 },
        { until: recoverTime, direction: -1 },
        { until: returnTime, direction: 1 },
        { until: Number.POSITIVE_INFINITY, direction: -1 },
      ],
    });
    assert.equal(
      result.outcome,
      'cleared',
      `${brakeTime}s/${recoverTime}s/${returnTime}s should clear`,
    );
    assert.deepEqual(result.blastHits, ['B1', 'B2']);
  }
});
