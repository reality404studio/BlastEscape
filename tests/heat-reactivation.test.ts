import assert from 'node:assert/strict';
import test from 'node:test';

import { CONFIG } from '../game/config.ts';
import { createGameplayState, stepGameplay } from '../game/core.ts';
import { validateLevel } from '../game/lab/evaluators.ts';
import { runReplay } from '../game/lab/replay-runner.ts';
import { LEVELS } from '../game/levels.ts';
import { LEVEL_16_CLEAN_REPLAY } from '../game/replays.ts';

const level16 = LEVELS[15];

test('Level 16 uses heat to power dormant B1 and clear', () => {
  const report = validateLevel(level16, LEVEL_16_CLEAN_REPLAY);
  assert.equal(report.status, 'pass');
  assert.equal(report.acceptedReplay.outcome, 'cleared');
  assert.deepEqual(report.acceptedReplay.acquiredStates, ['heat']);
  assert.deepEqual(report.acceptedReplay.acceptedInteractions, ['charge-ignition']);
  assert.deepEqual(report.acceptedReplay.blastExplosions, ['B1']);
  assert.deepEqual(report.acceptedReplay.blastHits, ['B1']);
});

test('neutral and cold routes leave B1 dormant', () => {
  for (const [stateName, traversalStateSources] of [
    ['neutral', []],
    ['cold', level16.traversalStateSources?.map((source) => ({ ...source, grants: 'cold' as const }))],
  ] as const) {
    const result = runReplay(
      { ...level16, traversalStateSources },
      { ...LEVEL_16_CLEAN_REPLAY, id: `level-16-${stateName}-dormant` },
    );
    assert.equal(result.outcome, 'timeout');
    assert.deepEqual(result.acceptedInteractions, []);
    assert.deepEqual(result.blastExplosions, []);
  }
});

test('a dormant charge fuse does not advance with world time', () => {
  const state = createGameplayState(level16);
  const initialTimer = CONFIG.bombFuseDuration + level16.bombs[0].delay;
  for (let frame = 0; frame < 120; frame += 1) {
    stepGameplay(state, level16, 0, 1 / 60);
  }
  assert.ok(state.levelElapsed > 1.99);
  assert.equal(state.bombs[0].timer, initialTimer);
});

test('the linked ignition advances the fuse and expiry pauses it before movement', () => {
  const state = createGameplayState(level16);
  state.interactionStates['charge-ignition'] = { active: true, remainingSeconds: 1 };
  const initialTimer = state.bombs[0].timer;
  stepGameplay(state, level16, 0, 0.25);
  assert.ok(Math.abs(state.bombs[0].timer - (initialTimer - 0.25)) < 1e-9);

  state.interactionStates['charge-ignition'] = { active: true, remainingSeconds: 0.01 };
  const timerBeforeExpiry = state.bombs[0].timer;
  const events = stepGameplay(state, level16, 0, 0.02);
  assert.ok(events.some((event) =>
    event.type === 'traversal-interaction-changed' &&
    event.interactionId === 'charge-ignition' &&
    event.reason === 'expired',
  ));
  assert.equal(state.bombs[0].timer, timerBeforeExpiry);
});

test('Level 16 has a broad post-ignition reversal window', () => {
  for (const switchTime of [4.2, 4.4, 4.6, 4.8]) {
    const result = runReplay(level16, {
      ...LEVEL_16_CLEAN_REPLAY,
      id: `level-16-switch-${switchTime}`,
      keyframes: [
        { until: switchTime, direction: 1 },
        { until: Number.POSITIVE_INFINITY, direction: -1 },
      ],
    });
    assert.equal(result.outcome, 'cleared', `${switchTime}s should clear`);
  }
});
