import assert from 'node:assert/strict';
import test from 'node:test';

import { createGameplayState, stepGameplay } from '../game/core.ts';
import { LEVELS } from '../game/levels.ts';
import type { LevelDefinition, TraversalStateSource } from '../game/types.ts';

const startSource = (
  grants: TraversalStateSource['grants'],
  id = `${grants}-source`,
): TraversalStateSource => ({
  id,
  rect: { x: 88, y: 500, w: 44, h: 54 },
  grants,
  durationSeconds: 1,
});

const withTraversal = (
  sources: LevelDefinition['traversalStateSources'] = [],
  interactions: LevelDefinition['traversalInteractions'] = [],
): LevelDefinition => ({
  ...LEVELS[0],
  id: 'state-test',
  traversalStateSources: sources,
  traversalInteractions: interactions,
});

test('players start neutral and acquire a temporary state by touching a factory source', () => {
  const level = withTraversal([startSource('cold')]);
  const state = createGameplayState(level);
  assert.deepEqual(state.player.traversalState, {
    kind: 'neutral',
    remainingSeconds: 0,
    sourceId: null,
  });

  const events = stepGameplay(state, level, 0, 1 / 60);
  assert.deepEqual(state.player.traversalState, {
    kind: 'cold',
    remainingSeconds: 1,
    sourceId: 'cold-source',
  });
  assert.equal(
    events.filter((event) => event.type === 'traversal-state-changed').length,
    1,
  );
});

test('touching another source replaces the current state without a new input', () => {
  const coldLevel = withTraversal([startSource('cold')]);
  const heatLevel = withTraversal([startSource('heat')]);
  const state = createGameplayState(coldLevel);
  stepGameplay(state, coldLevel, 0, 1 / 60);

  const events = stepGameplay(state, heatLevel, 0, 1 / 60);
  assert.equal(state.player.traversalState.kind, 'heat');
  const change = events.find((event) => event.type === 'traversal-state-changed');
  assert.ok(change && change.type === 'traversal-state-changed');
  assert.equal(change.reason, 'replaced');
  assert.equal(change.previous.kind, 'cold');
  assert.equal(change.current.kind, 'heat');
});

test('state lifetime advances in the authoritative core and expires to neutral', () => {
  const sourceLevel = withTraversal([startSource('magnetic')]);
  const emptyLevel = withTraversal();
  const state = createGameplayState(sourceLevel);
  stepGameplay(state, sourceLevel, 0, 1 / 60);

  const first = stepGameplay(state, emptyLevel, 0, 0.6);
  assert.equal(first.some((event) => event.type === 'traversal-state-changed'), false);
  assert.equal(state.player.traversalState.kind, 'magnetic');

  const second = stepGameplay(state, emptyLevel, 0, 0.4);
  const expiry = second.find((event) => event.type === 'traversal-state-changed');
  assert.ok(expiry && expiry.type === 'traversal-state-changed');
  assert.equal(expiry.reason, 'expired');
  assert.equal(state.player.traversalState.kind, 'neutral');
});

test('interaction contacts report whether the active state is accepted once per frame', () => {
  const interaction = {
    id: 'water-a',
    rect: { x: 88, y: 500, w: 44, h: 54 },
    kind: 'freeze-water' as const,
    accepts: ['cold'] as const,
  };
  const coldLevel = withTraversal([startSource('cold')], [{
    ...interaction,
    accepts: [...interaction.accepts],
  }]);
  const neutralLevel = withTraversal([], [{
    ...interaction,
    accepts: [...interaction.accepts],
  }]);

  const coldEvents = stepGameplay(createGameplayState(coldLevel), coldLevel, 0, 1 / 60);
  const coldContacts = coldEvents.filter(
    (event) => event.type === 'traversal-interaction-contact',
  );
  assert.equal(coldContacts.length, 1);
  assert.equal(coldContacts[0].accepted, true);

  const neutralEvents = stepGameplay(createGameplayState(neutralLevel), neutralLevel, 0, 1 / 60);
  const neutralContact = neutralEvents.find(
    (event) => event.type === 'traversal-interaction-contact',
  );
  assert.ok(neutralContact && neutralContact.type === 'traversal-interaction-contact');
  assert.equal(neutralContact.accepted, false);
});
