import assert from 'node:assert/strict';
import test from 'node:test';

import { jitterReplay, validateLevel } from '../game/lab/evaluators.ts';
import { runReplay } from '../game/lab/replay-runner.ts';
import { LEVELS } from '../game/levels.ts';
import { LEVEL_8_CLEAN_REPLAY } from '../game/replays.ts';

test('every authored level carries route intent and bounded pacing metadata', () => {
  assert.equal(LEVELS.length, 11);
  assert.equal(new Set(LEVELS.map((level) => level.id)).size, LEVELS.length);
  for (const level of LEVELS) {
    assert.ok(level.intent.primaryRoute.length > 0, `${level.id} needs a primary route`);
    assert.ok(level.intent.launchJobs.length > 0, `${level.id} needs launch jobs`);
    assert.ok(level.intent.landingWindows.length > 0, `${level.id} needs landing windows`);
    assert.ok(level.intent.timingWindows.length > 0, `${level.id} needs timing windows`);
    assert.ok(
      level.intent.targetFirstClearSeconds.min < level.intent.targetFirstClearSeconds.max,
      `${level.id} needs a bounded first-clear target`,
    );
  }
});

test('replay runner rejects a replay bound to the wrong level', () => {
  assert.throws(
    () => runReplay(LEVELS[6], LEVEL_8_CLEAN_REPLAY),
    /targets level-8, not level-7/,
  );
});

test('Level 8 passes all four evaluator families', () => {
  const report = validateLevel(LEVELS[7], LEVEL_8_CLEAN_REPLAY);
  assert.equal(report.status, 'pass');
  assert.deepEqual(
    [...new Set(report.evaluations.map((evaluation) => evaluation.evaluator))].sort(),
    ['exploit', 'mechanic', 'noisy-human', 'reachability'],
  );
  assert.equal(report.acceptedReplay.outcome, 'cleared');
  assert.deepEqual(report.acceptedReplay.blastHits, ['B1', 'B2', 'B3', 'B4', 'B5']);

  const noisy = report.evaluations.filter((evaluation) => evaluation.evaluator === 'noisy-human');
  assert.deepEqual(noisy.map((evaluation) => evaluation.metrics.clears), [96, 51]);
});

test('timing jitter is deterministic for a seed and preserves direction order', () => {
  const first = jitterReplay(LEVEL_8_CLEAN_REPLAY, 80, 42);
  const second = jitterReplay(LEVEL_8_CLEAN_REPLAY, 80, 42);
  assert.deepEqual(first.keyframes, second.keyframes);
  assert.deepEqual(
    first.keyframes.map((keyframe) => keyframe.direction),
    LEVEL_8_CLEAN_REPLAY.keyframes.map((keyframe) => keyframe.direction),
  );
});
