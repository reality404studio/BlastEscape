import assert from 'node:assert/strict';
import test from 'node:test';

import { validateLevel } from '../game/lab/evaluators.ts';
import { runReplay } from '../game/lab/replay-runner.ts';
import { LEVELS } from '../game/levels.ts';
import {
  LEVEL_13_CLEAN_REPLAY,
  LEVEL_13_RECOVERY_REPLAY,
} from '../game/replays.ts';

const level13 = LEVELS[12];

test('Level 13 primary route uses the frozen approach and B1 to clear directly', () => {
  const report = validateLevel(level13, LEVEL_13_CLEAN_REPLAY);
  assert.equal(report.status, 'pass');
  assert.equal(report.acceptedReplay.outcome, 'cleared');
  assert.deepEqual(report.acceptedReplay.acquiredStates, ['cold']);
  assert.deepEqual(report.acceptedReplay.acceptedInteractions, ['catch-basin-freeze']);
  assert.deepEqual(report.acceptedReplay.blastHits, ['B1']);
  assert.equal(report.acceptedReplay.landingCount, 0);
});

test('Level 13 over-braked B1 route lands on the ice and recovers through B2', () => {
  const result = runReplay(level13, LEVEL_13_RECOVERY_REPLAY);
  assert.equal(result.outcome, 'cleared');
  assert.deepEqual(result.acceptedInteractions, ['catch-basin-freeze']);
  assert.deepEqual(result.blastHits, ['B1', 'B2']);
  assert.equal(result.landingCount, 1);
  assert.ok(result.elapsedSeconds > 6);
  assert.ok(result.elapsedSeconds < 7);
});

test('the recovery input thaws into water when B2 is removed', () => {
  const withoutBackupCharge = {
    ...level13,
    bombs: level13.bombs.filter((bomb) => bomb.label !== 'B2'),
  };
  const result = runReplay(withoutBackupCharge, LEVEL_13_RECOVERY_REPLAY);
  assert.equal(result.outcome, 'died');
  assert.equal(result.deathReason, 'water');
  assert.equal(result.landingCount, 1);
  assert.equal(result.blastHits.includes('B2'), false);
});

test('the Level 13 primary route enters water without coolant', () => {
  const result = runReplay(
    { ...level13, traversalStateSources: [] },
    LEVEL_13_CLEAN_REPLAY,
  );
  assert.equal(result.outcome, 'died');
  assert.equal(result.deathReason, 'water');
  assert.deepEqual(result.acquiredStates, []);
  assert.deepEqual(result.acceptedInteractions, []);
});

test('Level 13 recovery survives a practical range of over-braking inputs', () => {
  for (const [brakeTime, recoverTime] of [
    [3.05, 4.05],
    [3.1, 4.1],
    [3.1, 4.2],
    [3.15, 4.3],
    [3.2, 4.2],
  ] as const) {
    const result = runReplay(level13, {
      ...LEVEL_13_RECOVERY_REPLAY,
      id: `level-13-recovery-${brakeTime}-${recoverTime}`,
      keyframes: [
        { until: brakeTime, direction: 1 },
        { until: recoverTime, direction: -1 },
        { until: Number.POSITIVE_INFINITY, direction: 1 },
      ],
    });
    assert.equal(result.outcome, 'cleared', `${brakeTime}s/${recoverTime}s should clear`);
    assert.ok(result.landingCount >= 1);
    assert.deepEqual(result.blastHits, ['B1', 'B2']);
  }
});
