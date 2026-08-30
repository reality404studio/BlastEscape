import assert from 'node:assert/strict';
import test from 'node:test';

import { createGameplayState, stepGameplay } from '../game/core.ts';
import type { GameplayEvent } from '../game/core.ts';
import { validateLevel } from '../game/lab/evaluators.ts';
import { runReplay } from '../game/lab/replay-runner.ts';
import { LEVELS } from '../game/levels.ts';
import { LEVEL_21_CLEAN_REPLAY } from '../game/replays.ts';

const level21 = LEVELS[20];

test('Level 21 intercepts, repositions on, and rides the moving magnetic carrier', () => {
  const report = validateLevel(level21, LEVEL_21_CLEAN_REPLAY);
  assert.equal(report.status, 'pass');
  assert.equal(report.acceptedReplay.outcome, 'cleared');
  assert.deepEqual(report.acceptedReplay.acquiredStates, ['magnetic']);
  assert.deepEqual(report.acceptedReplay.acceptedInteractions, ['shift-carrier']);
  assert.deepEqual(report.acceptedReplay.blastHits, ['B1']);
});

test('the moving carrier releases at receiving after one authoritative traversal', () => {
  const state = createGameplayState(level21);
  const events: GameplayEvent[] = [];
  for (let frame = 0; frame < 660; frame += 1) {
    const frameEvents = stepGameplay(
      state,
      level21,
      (elapsed) => elapsed < 3.64 ? 1 : 0,
      1 / 60,
    );
    events.push(...frameEvents);
    if (frameEvents.some((event) => event.type === 'cleared')) break;
  }

  assert.ok(events.some((event) => event.type === 'magnetic-attached'));
  assert.ok(events.some((event) =>
    event.type === 'magnetic-released' && event.reason === 'carrier-end',
  ));
  assert.ok(events.some((event) => event.type === 'cleared'));
  assert.equal(state.player.magneticAttachment, null);
});

test('the B1 route falls into the trench without magnetic charge', () => {
  const result = runReplay(
    { ...level21, traversalStateSources: [] },
    LEVEL_21_CLEAN_REPLAY,
  );
  assert.equal(result.outcome, 'died');
  assert.equal(result.deathReason, 'water');
  assert.deepEqual(result.acquiredStates, []);
  assert.deepEqual(result.acceptedInteractions, []);
  assert.deepEqual(result.blastHits, ['B1']);
});

test('carrier travel is load-bearing rather than decorative', () => {
  const interaction = level21.traversalInteractions![0];
  const stationaryCarrier = {
    ...level21,
    traversalInteractions: [{
      ...interaction,
      movingResult: {
        ...interaction.movingResult!,
        fromX: 230,
        toX: 231,
        speed: 85,
        phase: 0,
      },
    }],
  };
  const result = runReplay(stationaryCarrier, LEVEL_21_CLEAN_REPLAY);
  assert.equal(result.outcome, 'died');
  assert.equal(result.deathReason, 'water');
  assert.deepEqual(result.acceptedInteractions, ['shift-carrier']);
});

test('Level 21 carrier route has a readable repositioning window', () => {
  for (const switchTime of [3.58, 3.6, 3.62, 3.64, 3.66, 3.68, 3.7, 3.72, 3.74]) {
    const result = runReplay(level21, {
      ...LEVEL_21_CLEAN_REPLAY,
      id: `level-21-shift-${switchTime}`,
      keyframes: [
        { until: switchTime, direction: 1 },
        { until: Number.POSITIVE_INFINITY, direction: 0 },
      ],
    });
    assert.equal(result.outcome, 'cleared', `${switchTime}s should clear`);
  }
});

test('Level 21 clean route clears across supported frame schedules', () => {
  for (const frameRate of [30, 50, 60, 120, 144]) {
    const result = runReplay(level21, {
      ...LEVEL_21_CLEAN_REPLAY,
      id: `level-21-${frameRate}hz`,
      frameRate,
    });
    assert.equal(result.outcome, 'cleared', `${frameRate}Hz should clear`);
  }
});
