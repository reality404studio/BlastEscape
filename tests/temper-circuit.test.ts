import assert from 'node:assert/strict';
import test from 'node:test';

import { validateLevel } from '../game/lab/evaluators.ts';
import { runReplay } from '../game/lab/replay-runner.ts';
import { LEVELS } from '../game/levels.ts';
import { LEVEL_24_CLEAN_REPLAY } from '../game/replays.ts';

const level24 = LEVELS[23];

test('Level 24 hands a cold-built B1 route to heat-powered B2', () => {
  const report = validateLevel(level24, LEVEL_24_CLEAN_REPLAY);
  assert.equal(report.status, 'pass');
  assert.equal(report.acceptedReplay.outcome, 'cleared');
  assert.deepEqual(report.acceptedReplay.acquiredStates, ['cold', 'heat']);
  assert.deepEqual(report.acceptedReplay.acceptedInteractions, [
    'temper-intake-freeze',
    'temper-carriage-lock',
    'temper-ignition',
  ]);
  assert.deepEqual(report.acceptedReplay.blastHits, ['B1', 'B2']);
});

test('the lower intake rejects the route without cold', () => {
  const result = runReplay(
    {
      ...level24,
      traversalStateSources: level24.traversalStateSources?.filter(
        (source) => source.grants !== 'cold',
      ),
    },
    LEVEL_24_CLEAN_REPLAY,
  );
  assert.equal(result.outcome, 'died');
  assert.equal(result.deathReason, 'water');
  assert.deepEqual(result.blastHits, []);
});

test('carriage stabilization is required for the B1 transfer', () => {
  const result = runReplay(
    {
      ...level24,
      traversalInteractions: level24.traversalInteractions?.filter(
        (interaction) => interaction.id !== 'temper-carriage-lock',
      ),
    },
    LEVEL_24_CLEAN_REPLAY,
  );
  assert.equal(result.outcome, 'timeout');
  assert.deepEqual(result.blastHits, ['B1']);
  assert.deepEqual(result.acquiredStates, ['cold']);
  assert.deepEqual(result.acceptedInteractions, ['temper-intake-freeze']);
});

test('B2 remains dormant without the furnace handoff', () => {
  const result = runReplay(
    {
      ...level24,
      traversalStateSources: level24.traversalStateSources?.filter(
        (source) => source.grants !== 'heat',
      ),
    },
    LEVEL_24_CLEAN_REPLAY,
  );
  assert.equal(result.outcome, 'timeout');
  assert.deepEqual(result.blastHits, ['B1']);
  assert.deepEqual(result.acquiredStates, ['cold']);
  assert.deepEqual(result.acceptedInteractions, [
    'temper-intake-freeze',
    'temper-carriage-lock',
  ]);
});

test('B2 is load-bearing after both state phases succeed', () => {
  const result = runReplay(
    { ...level24, bombs: level24.bombs.filter((bomb) => bomb.label !== 'B2') },
    LEVEL_24_CLEAN_REPLAY,
  );
  assert.equal(result.outcome, 'timeout');
  assert.deepEqual(result.acquiredStates, ['cold', 'heat']);
  assert.deepEqual(result.blastHits, ['B1']);
  assert.ok(result.acceptedInteractions.includes('temper-ignition'));
});

test('Level 24 final B2 return has a broad steering window', () => {
  for (const switchTime of [5.8, 5.85, 5.9, 5.95, 6, 6.05, 6.1, 6.15]) {
    const result = runReplay(level24, {
      ...LEVEL_24_CLEAN_REPLAY,
      id: `level-24-${switchTime}`,
      keyframes: [
        { until: switchTime, direction: 1 },
        { until: Number.POSITIVE_INFINITY, direction: -1 },
      ],
    });
    assert.equal(result.outcome, 'cleared', `${switchTime}s should clear`);
  }
});

test('Level 24 clean route clears across supported frame schedules', () => {
  for (const frameRate of [30, 50, 60, 120, 144]) {
    const result = runReplay(level24, {
      ...LEVEL_24_CLEAN_REPLAY,
      id: `level-24-${frameRate}hz`,
      frameRate,
    });
    assert.equal(result.outcome, 'cleared', `${frameRate}Hz should clear`);
  }
});
