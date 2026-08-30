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

const movingCarrierLevel = {
  ...level20,
  id: 'moving-carrier-test',
  traversalInteractions: [{
    id: 'moving-carrier',
    rect: { x: 250, y: 120, w: 300, h: 150 },
    kind: 'magnetic-attach' as const,
    accepts: ['magnetic' as const],
    activeSeconds: 5,
    movingResult: {
      fromX: 300,
      toX: 500,
      y: 150,
      w: 120,
      h: 16,
      speed: 50,
      phase: 0,
    },
    movingCapturePadding: { horizontal: 16, above: 12, below: 80 },
    releaseAtMovingEnd: 'to' as const,
  }],
};

test('moving magnetic capture follows the carrier rather than its swept path', () => {
  const capture = createGameplayState(movingCarrierLevel);
  capture.player.x = 330;
  capture.player.y = 205;
  capture.player.vy = -300;
  capture.player.grounded = false;
  capture.player.traversalState = {
    kind: 'magnetic',
    remainingSeconds: 6,
    sourceId: 'test-coil',
  };
  stepGameplay(capture, movingCarrierLevel, 0, 1 / 60);
  assert.equal(capture.player.magneticAttachment?.interactionId, 'moving-carrier');

  const miss = createGameplayState(movingCarrierLevel);
  miss.player.x = 470;
  miss.player.y = 205;
  miss.player.vy = -300;
  miss.player.grounded = false;
  miss.player.traversalState = {
    kind: 'magnetic',
    remainingSeconds: 6,
    sourceId: 'test-coil',
  };
  stepGameplay(miss, movingCarrierLevel, 0, 1 / 60);
  assert.equal(miss.player.magneticAttachment, null);
});

test('an attached player inherits moving-carrier displacement', () => {
  const state = createGameplayState(movingCarrierLevel);
  state.player.x = 330;
  state.player.y = 166;
  state.player.grounded = false;
  state.player.traversalState = {
    kind: 'magnetic',
    remainingSeconds: 6,
    sourceId: 'test-coil',
  };
  state.player.magneticAttachment = {
    interactionId: 'moving-carrier',
    remainingSeconds: 5,
  };

  stepGameplay(state, movingCarrierLevel, 0, 0.1);
  assert.ok(Math.abs(state.player.x - 335) < 0.001);
  assert.equal(state.player.y, 166);
  assert.equal(state.player.vy, 0);
});

test('a moving carrier releases automatically at its configured path end', () => {
  const interaction = movingCarrierLevel.traversalInteractions[0];
  const shortCarrierLevel = {
    ...movingCarrierLevel,
    traversalInteractions: [{
      ...interaction,
      movingResult: {
        ...interaction.movingResult,
        fromX: 300,
        toX: 310,
        speed: 10,
        phase: 0.95,
      },
    }],
  };
  const state = createGameplayState(shortCarrierLevel);
  state.player.x = 305;
  state.player.y = 166;
  state.player.grounded = false;
  state.player.traversalState = {
    kind: 'magnetic',
    remainingSeconds: 6,
    sourceId: 'test-coil',
  };
  state.player.magneticAttachment = {
    interactionId: 'moving-carrier',
    remainingSeconds: 5,
  };

  const events = stepGameplay(state, shortCarrierLevel, 0, 0.1);
  assert.ok(events.some((event) =>
    event.type === 'magnetic-released' && event.reason === 'carrier-end',
  ));
  assert.equal(state.player.magneticAttachment, null);
});
