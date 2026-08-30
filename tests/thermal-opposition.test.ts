import assert from 'node:assert/strict';
import test from 'node:test';

import { createGameplayState, stepGameplay } from '../game/core.ts';
import { validateLevel } from '../game/lab/evaluators.ts';
import { runReplay } from '../game/lab/replay-runner.ts';
import { LEVELS } from '../game/levels.ts';
import { LEVEL_18_CLEAN_REPLAY } from '../game/replays.ts';

const level18 = LEVELS[17];

test('Level 18 freezes then heat-releases the same span before B1', () => {
  const report = validateLevel(level18, LEVEL_18_CLEAN_REPLAY);
  assert.equal(report.status, 'pass');
  assert.equal(report.acceptedReplay.outcome, 'cleared');
  assert.deepEqual(report.acceptedReplay.acquiredStates, ['cold', 'heat']);
  assert.deepEqual(report.acceptedReplay.acceptedInteractions, [
    'phase-span-freeze',
    'phase-span-thaw',
  ]);
  assert.deepEqual(report.acceptedReplay.blastHits, ['B1']);
});

test('without cold, the route falls onto the blocked lower-left line', () => {
  const result = runReplay(
    {
      ...level18,
      traversalStateSources: level18.traversalStateSources?.filter(
        (source) => source.grants !== 'cold',
      ),
    },
    LEVEL_18_CLEAN_REPLAY,
  );
  assert.equal(result.outcome, 'timeout');
  assert.deepEqual(result.acquiredStates, []);
  assert.deepEqual(result.acceptedInteractions, []);
  assert.ok(result.finalPlayer.x < 480);
});

test('without heat, frozen collision blocks the B1 return shaft', () => {
  const result = runReplay(
    {
      ...level18,
      traversalStateSources: level18.traversalStateSources?.filter(
        (source) => source.grants !== 'heat',
      ),
    },
    LEVEL_18_CLEAN_REPLAY,
  );
  assert.equal(result.outcome, 'timeout');
  assert.deepEqual(result.acquiredStates, ['cold']);
  assert.deepEqual(result.acceptedInteractions, ['phase-span-freeze']);
  assert.deepEqual(result.blastHits, ['B1']);
  assert.equal(result.highestPointY, 314);
});

test('the heat contact must explicitly deactivate the linked cold interaction', () => {
  const withoutLink = {
    ...level18,
    traversalInteractions: level18.traversalInteractions?.map((interaction) =>
      interaction.id === 'phase-span-thaw'
        ? { ...interaction, deactivatesInteractionId: 'missing-span' }
        : interaction,
    ),
  };
  const result = runReplay(withoutLink, LEVEL_18_CLEAN_REPLAY);
  assert.equal(result.outcome, 'timeout');
  assert.deepEqual(result.acquiredStates, ['cold', 'heat']);
  assert.deepEqual(result.acceptedInteractions, [
    'phase-span-freeze',
    'phase-span-thaw',
  ]);
  assert.deepEqual(result.blastHits, ['B1']);
  assert.equal(result.highestPointY, 314);
});

test('deactivation removes the cold-created collision before the next substep', () => {
  const state = createGameplayState(level18);
  state.player.x = 760;
  state.player.y = 314;
  state.player.traversalState = {
    kind: 'heat',
    remainingSeconds: 5,
    sourceId: 'phase-furnace',
  };
  state.interactionStates['phase-span-freeze'] = {
    active: true,
    remainingSeconds: 5,
  };

  const events = stepGameplay(state, level18, 0, 1 / 60);
  assert.ok(events.some((event) =>
    event.type === 'traversal-interaction-changed' &&
    event.interactionId === 'phase-span-freeze' &&
    event.reason === 'deactivated',
  ));
  assert.equal(state.interactionStates['phase-span-freeze'].active, false);

  state.player.x = 574;
  state.player.y = 314;
  state.player.vy = 0;
  state.player.grounded = true;
  stepGameplay(state, level18, 0, 1 / 60);
  assert.equal(state.player.grounded, false);
});
