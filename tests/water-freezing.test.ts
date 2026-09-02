import assert from 'node:assert/strict';
import test from 'node:test';

import { createGameplayState, stepGameplay } from '../game/core.ts';
import { validateLevel } from '../game/lab/evaluators.ts';
import { runReplay } from '../game/lab/replay-runner.ts';
import { LEVELS } from '../game/levels.ts';
import { LEVEL_10_CLEAN_REPLAY } from '../game/replays.ts';

const level10 = LEVELS[9];

test('Level 10 clean route freezes the crossing, uses B1, and clears', () => {
  const report = validateLevel(level10, LEVEL_10_CLEAN_REPLAY);
  assert.equal(report.status, 'pass');
  assert.equal(report.acceptedReplay.outcome, 'cleared');
  assert.deepEqual(report.acceptedReplay.acquiredStates, ['cold']);
  assert.deepEqual(report.acceptedReplay.acceptedInteractions, ['condensate-freeze']);
  assert.deepEqual(report.acceptedReplay.blastHits, ['B1']);
});

test('the condensate crossing rejects the same route without coolant', () => {
  const withoutCoolant = {
    ...level10,
    traversalStateSources: [],
  };
  const result = runReplay(withoutCoolant, LEVEL_10_CLEAN_REPLAY);
  assert.equal(result.outcome, 'died');
  assert.equal(result.deathReason, 'water');
  assert.deepEqual(result.acquiredStates, []);
  assert.deepEqual(result.acceptedInteractions, []);
});

test('the frozen collision surface disappears authoritatively when its timer expires', () => {
  const state = createGameplayState(level10);
  state.player.x = 450;
  state.player.y = 514;
  state.player.grounded = true;
  state.interactionStates['condensate-freeze'] = {
    active: true,
    remainingSeconds: 0.01,
  };

  const events = stepGameplay(state, level10, 0, 0.02);
  assert.ok(events.some((event) =>
    event.type === 'traversal-interaction-changed' &&
    event.interactionId === 'condensate-freeze' &&
    event.reason === 'expired',
  ));
  assert.ok(events.some((event) => event.type === 'died' && event.reason === 'water'));
});

test('Level 10 clean route keeps a broad steering window after the crossing', () => {
  for (const switchTime of [3.2, 3.3, 3.6, 3.9]) {
    const result = runReplay(level10, {
      ...LEVEL_10_CLEAN_REPLAY,
      id: `level-10-switch-${switchTime}`,
      keyframes: [
        { until: switchTime, direction: 1 },
        { until: Number.POSITIVE_INFINITY, direction: -1 },
      ],
    });
    assert.equal(result.outcome, 'cleared', `${switchTime}s should clear`);
  }
});
