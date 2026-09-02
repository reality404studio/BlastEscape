import assert from 'node:assert/strict';
import test from 'node:test';

import { createGameplayState, stepGameplay } from '../game/core.ts';
import { validateLevel } from '../game/lab/evaluators.ts';
import { runReplay } from '../game/lab/replay-runner.ts';
import { LEVELS } from '../game/levels.ts';
import { LEVEL_15_CLEAN_REPLAY } from '../game/replays.ts';

const level15 = LEVELS[14];

test('Level 15 acquires heat, melts the seal, uses B1, and clears', () => {
  const report = validateLevel(level15, LEVEL_15_CLEAN_REPLAY);
  assert.equal(report.status, 'pass');
  assert.equal(report.acceptedReplay.outcome, 'cleared');
  assert.deepEqual(report.acceptedReplay.acquiredStates, ['heat']);
  assert.deepEqual(report.acceptedReplay.acceptedInteractions, ['thermal-seal-melt']);
  assert.deepEqual(report.acceptedReplay.blastHits, ['B1']);
});

test('the thermal seal rejects neutral and cold traversal states', () => {
  for (const [stateName, traversalStateSources] of [
    ['neutral', []],
    ['cold', level15.traversalStateSources?.map((source) => ({ ...source, grants: 'cold' as const }))],
  ] as const) {
    const result = runReplay(
      { ...level15, traversalStateSources },
      {
        ...LEVEL_15_CLEAN_REPLAY,
        id: `level-15-${stateName}-rejected`,
        maxDurationSeconds: 3,
        keyframes: [{ until: Number.POSITIVE_INFINITY, direction: 1 }],
      },
    );
    assert.equal(result.outcome, 'timeout');
    assert.ok(result.finalPlayer.x <= 334.01, `${stateName} should remain left of the seal`);
    assert.deepEqual(result.acceptedInteractions, []);
  }
});

test('removing the barrier exposes the exact no-heat bypass it prevents', () => {
  const result = runReplay(
    { ...level15, traversalStateSources: [], meltableBarriers: [] },
    LEVEL_15_CLEAN_REPLAY,
  );
  assert.equal(result.outcome, 'cleared');
  assert.deepEqual(result.acquiredStates, []);
  assert.deepEqual(result.acceptedInteractions, []);
});

test('melt expiry restores the seal before the next movement substep', () => {
  const state = createGameplayState(level15);
  state.player.x = 334;
  state.player.controlVx = 275;
  state.interactionStates['thermal-seal-melt'] = {
    active: true,
    remainingSeconds: 0.01,
  };

  const events = stepGameplay(state, level15, 1, 0.02);
  assert.ok(events.some((event) =>
    event.type === 'traversal-interaction-changed' &&
    event.interactionId === 'thermal-seal-melt' &&
    event.reason === 'expired',
  ));
  assert.equal(state.player.x, 334);
});

test('Level 15 keeps a broad steering window after the heat lesson', () => {
  for (const switchTime of [3.2, 3.3, 3.6, 3.9]) {
    const result = runReplay(level15, {
      ...LEVEL_15_CLEAN_REPLAY,
      id: `level-15-switch-${switchTime}`,
      keyframes: [
        { until: switchTime, direction: 1 },
        { until: Number.POSITIVE_INFINITY, direction: -1 },
      ],
    });
    assert.equal(result.outcome, 'cleared', `${switchTime}s should clear`);
  }
});
