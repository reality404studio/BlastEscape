import assert from 'node:assert/strict';
import test from 'node:test';

import { validateLevel } from '../game/lab/evaluators.ts';
import { runReplay } from '../game/lab/replay-runner.ts';
import { LEVELS } from '../game/levels.ts';
import {
  LEVEL_1_CLEAN_REPLAY,
  LEVEL_2_CLEAN_REPLAY,
  LEVEL_3_CLEAN_REPLAY,
  LEVEL_4_CLEAN_REPLAY,
  LEVEL_5_CLEAN_REPLAY,
  LEVEL_6_CLEAN_REPLAY,
  LEVEL_7_CLEAN_REPLAY,
} from '../game/replays.ts';

const BLAST_CURRICULUM_REPLAYS = [
  LEVEL_1_CLEAN_REPLAY,
  LEVEL_2_CLEAN_REPLAY,
  LEVEL_3_CLEAN_REPLAY,
  LEVEL_4_CLEAN_REPLAY,
  LEVEL_5_CLEAN_REPLAY,
  LEVEL_6_CLEAN_REPLAY,
  LEVEL_7_CLEAN_REPLAY,
] as const;

test('Levels 1–7 accepted routes clear and exercise their required blasts', () => {
  const expectedHits = [
    ['B1', 'B2', 'B3'],
    ['B1'],
    ['B1'],
    ['B1', 'B2'],
    ['B1', 'B2'],
    ['B1'],
    ['B1', 'B2', 'B3'],
  ];

  BLAST_CURRICULUM_REPLAYS.forEach((replay, index) => {
    const result = runReplay(LEVELS[index], replay);
    assert.equal(result.outcome, 'cleared', replay.id);
    assert.deepEqual(result.blastHits, expectedHits[index], replay.id);
  });
});

test('Levels 1–7 reject constant-direction bypasses and satisfy mechanic checks', () => {
  BLAST_CURRICULUM_REPLAYS.forEach((replay, index) => {
    const report = validateLevel(LEVELS[index], replay);
    const exploit = report.evaluations.find((entry) => entry.evaluator === 'exploit');
    const mechanic = report.evaluations.find((entry) => entry.evaluator === 'mechanic');
    assert.equal(exploit?.status, 'pass', replay.id);
    assert.equal(mechanic?.status, 'pass', replay.id);
    assert.ok(!report.evaluations.some((entry) => entry.status === 'fail'), replay.id);
  });
});

test('Levels 2–6 clean routes clear across supported frame schedules', () => {
  const schedules = [30, 50, 60, 120, 144];
  BLAST_CURRICULUM_REPLAYS.slice(1, 6).forEach((replay, replayIndex) => {
    const level = LEVELS[replayIndex + 1];
    schedules.forEach((frameRate) => {
      const result = runReplay(level, { ...replay, frameRate });
      assert.equal(result.outcome, 'cleared', `${replay.id} at ${frameRate}Hz`);
    });
  });
});

test('Level 4 preserves the uninterrupted 2X air-chain contract', () => {
  const result = runReplay(LEVELS[3], LEVEL_4_CLEAN_REPLAY);
  assert.equal(result.maximumAirCombo, 2);
  assert.equal(result.landingCount, 0);
});

test('Level 6 preserves the moving-platform intercept landing', () => {
  const result = runReplay(LEVELS[5], LEVEL_6_CLEAN_REPLAY);
  assert.equal(result.landingCount, 1);
  assert.ok(result.elapsedSeconds < 4);
});
