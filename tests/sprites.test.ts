import assert from 'node:assert/strict';
import test from 'node:test';

import {
  animationDurationSeconds,
  animationFrameAt,
  isSpriteManifest,
  playerAnimationStateFor,
  type SpriteManifest,
} from '../game/sprites.ts';
import manifestFixture from '../public/sprites/foundry-pod/manifest.json' with { type: 'json' };

const manifest = manifestFixture as SpriteManifest;

test('Foundry Pod shipping manifest satisfies the runtime contract', () => {
  assert.equal(isSpriteManifest(manifest), true);
  assert.deepEqual(Object.keys(manifest.frame_layout.rows), [
    'idle',
    'walk',
    'airborne',
    'land',
  ]);
  assert.equal(manifest.frame_layout.rows.walk.length, 8);
  assert.equal(animationDurationSeconds(manifest, 'land'), 0.4);
});

test('looping animation timing samples manifest rectangles', () => {
  assert.deepEqual(animationFrameAt(manifest, 'walk', 0).rect, {
    x: 0,
    y: 40,
    w: 32,
    h: 40,
  });
  assert.equal(animationFrameAt(manifest, 'walk', 0.126).index, 1);
  assert.equal(animationFrameAt(manifest, 'walk', 1).index, 0);
});

test('non-looping animation timing holds its final frame', () => {
  assert.equal(animationFrameAt(manifest, 'airborne', 0).index, 0);
  assert.equal(animationFrameAt(manifest, 'airborne', 0.26).index, 2);
  assert.equal(animationFrameAt(manifest, 'airborne', 10).index, 3);
});

test('player animation state prioritizes landing, then air and movement', () => {
  assert.equal(playerAnimationStateFor(true, 0, 0.1, 0.4), 'land');
  assert.equal(playerAnimationStateFor(false, 80, 1, 0.4), 'airborne');
  assert.equal(playerAnimationStateFor(true, -40, 1, 0.4), 'walk');
  assert.equal(playerAnimationStateFor(true, 5, 1, 0.4), 'idle');
});
