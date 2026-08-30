import assert from 'node:assert/strict';
import test from 'node:test';

import { createGameplayState, stepGameplay } from '../game/core.ts';
import type { GameplayEvent } from '../game/core.ts';
import { validateLevel } from '../game/lab/evaluators.ts';
import { runReplay } from '../game/lab/replay-runner.ts';
import { LEVELS } from '../game/levels.ts';
import { LEVEL_20_CLEAN_REPLAY } from '../game/replays.ts';

const level20 = LEVELS[19];

test('Level 20 uses magnetic B1 capture, the bounded rail, and automatic release', () => {
  const report = validateLevel(level20, LEVEL_20_CLEAN_REPLAY);
  assert.equal(report.status, 'pass');
  assert.equal(report.acceptedReplay.outcome, 'cleared');
  assert.deepEqual(report.acceptedReplay.acquiredStates, ['magnetic']);
  assert.deepEqual(report.acceptedReplay.acceptedInteractions, ['induction-rail']);
  assert.deepEqual(report.acceptedReplay.blastHits, ['B1']);
});

test('the same B1 route falls short of the crossing without magnetic charge', () => {
  const result = runReplay(
    { ...level20, traversalStateSources: [] },
    LEVEL_20_CLEAN_REPLAY,
  );
  assert.equal(result.outcome, 'died');
  assert.equal(result.deathReason, 'fall');
  assert.deepEqual(result.acquiredStates, []);
  assert.deepEqual(result.acceptedInteractions, []);
  assert.deepEqual(result.blastHits, ['B1']);
});

test('the accepted route attaches while rising and releases at the rail end', () => {
  const state = createGameplayState(level20);
  const events: GameplayEvent[] = [];
  for (let frame = 0; frame < 420; frame += 1) {
    const frameEvents = stepGameplay(state, level20, 1, 1 / 60);
    events.push(...frameEvents);
    if (frameEvents.some((event) => event.type === 'cleared')) break;
  }
  assert.ok(events.some((event) => event.type === 'magnetic-attached'));
  assert.ok(events.some((event) =>
    event.type === 'magnetic-released' && event.reason === 'rail-end',
  ));
  assert.ok(events.some((event) => event.type === 'cleared'));
  assert.equal(state.player.magneticAttachment, null);
});

test('attachment constrains vertical motion and discharges on its own timer', () => {
  const state = createGameplayState(level20);
  state.player.x = 400;
  state.player.y = 300;
  state.player.vy = -500;
  state.player.traversalState = {
    kind: 'magnetic',
    remainingSeconds: 5,
    sourceId: 'induction-coil',
  };
  state.player.magneticAttachment = {
    interactionId: 'induction-rail',
    remainingSeconds: 0.11,
  };

  stepGameplay(state, level20, 1, 0.1);
  assert.ok(state.player.x > 400);
  assert.equal(state.player.y, 166);
  assert.equal(state.player.vy, 0);

  const events = stepGameplay(state, level20, 0, 0.02);
  assert.ok(events.some((event) =>
    event.type === 'magnetic-released' && event.reason === 'discharged',
  ));
  assert.equal(state.player.magneticAttachment, null);
  assert.ok(state.player.y > 166);
});

test('magnetic state expiry releases an otherwise live attachment', () => {
  const state = createGameplayState(level20);
  state.player.x = 400;
  state.player.y = 166;
  state.player.traversalState = {
    kind: 'magnetic',
    remainingSeconds: 0.01,
    sourceId: 'induction-coil',
  };
  state.player.magneticAttachment = {
    interactionId: 'induction-rail',
    remainingSeconds: 2,
  };

  const events = stepGameplay(state, level20, 0, 0.02);
  assert.ok(events.some((event) =>
    event.type === 'magnetic-released' && event.reason === 'state-expired',
  ));
  assert.equal(state.player.traversalState.kind, 'neutral');
  assert.equal(state.player.magneticAttachment, null);
});

test('Level 20 clean route clears across supported frame schedules', () => {
  for (const frameRate of [30, 50, 60, 120, 144]) {
    const result = runReplay(level20, {
      ...LEVEL_20_CLEAN_REPLAY,
      id: `level-20-${frameRate}hz`,
      frameRate,
    });
    assert.equal(result.outcome, 'cleared', `${frameRate}Hz should clear`);
  }
});
