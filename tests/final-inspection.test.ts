import assert from 'node:assert/strict';
import test from 'node:test';

import { createGameplayState, stepGameplay } from '../game/core.ts';
import { validateLevel } from '../game/lab/evaluators.ts';
import { runReplay } from '../game/lab/replay-runner.ts';
import { LEVELS } from '../game/levels.ts';
import { LEVEL_25_CLEAN_REPLAY } from '../game/replays.ts';

const level25 = LEVELS[24];

test('Level 25 completes the final blast relay, scan, and chosen departure', () => {
  const report = validateLevel(level25, LEVEL_25_CLEAN_REPLAY);
  assert.equal(report.status, 'pass');
  assert.equal(report.acceptedReplay.outcome, 'cleared');
  assert.deepEqual(report.acceptedReplay.blastHits, ['B1', 'B2']);
  assert.equal(report.acceptedReplay.maximumAirCombo, 2);
  assert.equal(report.acceptedReplay.dispatchScanned, true);
});

test('the scanner reveals cancellation without clearing or removing control', () => {
  const state = createGameplayState(level25);
  let scanned = false;
  let cleared = false;
  for (let frame = 0; frame < 420; frame += 1) {
    const events = stepGameplay(state, level25, scanned ? 0 : 1, 1 / 60);
    if (events.some((event) => event.type === 'dispatch-scanned')) scanned = true;
    if (events.some((event) => event.type === 'cleared')) cleared = true;
    if (scanned) break;
  }
  assert.equal(scanned, true);
  assert.equal(cleared, false);
  const scannedX = state.player.x;

  for (let frame = 0; frame < 180; frame += 1) {
    const events = stepGameplay(state, level25, 0, 1 / 60);
    assert.equal(events.some((event) => event.type === 'cleared'), false);
  }
  assert.equal(state.dispatchScanned, true);
  assert.ok(state.player.x < level25.dispatchSequence!.departure.x - 26);
  assert.ok(Math.abs(state.player.controlVx) < 0.01);

  for (let frame = 0; frame < 45; frame += 1) {
    const events = stepGameplay(state, level25, -1, 1 / 60);
    assert.equal(events.some((event) => event.type === 'cleared'), false);
  }
  assert.ok(state.player.x < scannedX);
});

test('the open departure only clears after the scanner has been crossed', () => {
  const state = createGameplayState(level25);
  state.player.x = 936;
  state.player.y = 264;
  state.player.grounded = true;
  const beforeScan = stepGameplay(state, level25, 0, 1 / 60);
  assert.equal(beforeScan.some((event) => event.type === 'cleared'), false);

  state.dispatchScanned = true;
  const afterScan = stepGameplay(state, level25, 0, 1 / 60);
  assert.equal(afterScan.some((event) => event.type === 'cleared'), true);
});

test('the final departure remains a player-controlled rightward action', () => {
  const state = createGameplayState(level25);
  let scanned = false;
  for (let frame = 0; frame < 420; frame += 1) {
    const events = stepGameplay(state, level25, 1, 1 / 60);
    if (events.some((event) => event.type === 'dispatch-scanned')) {
      scanned = true;
      break;
    }
  }
  assert.equal(scanned, true);

  let cleared = false;
  for (let frame = 0; frame < 180; frame += 1) {
    const events = stepGameplay(state, level25, 1, 1 / 60);
    if (events.some((event) => event.type === 'cleared')) {
      cleared = true;
      break;
    }
  }
  assert.equal(cleared, true);
});

test('B2 and the uninterrupted air chain are required to reach dispatch', () => {
  const result = runReplay(
    { ...level25, bombs: level25.bombs.filter((bomb) => bomb.label !== 'B2') },
    LEVEL_25_CLEAN_REPLAY,
  );
  assert.notEqual(result.outcome, 'cleared');
  assert.equal(result.dispatchScanned, false);
  assert.deepEqual(result.blastHits, ['B1']);
  assert.ok(result.maximumAirCombo < 2);
});

test('Level 25 clean route clears across supported frame schedules', () => {
  for (const frameRate of [30, 50, 60, 120, 144]) {
    const result = runReplay(level25, {
      ...LEVEL_25_CLEAN_REPLAY,
      id: `level-25-${frameRate}hz`,
      frameRate,
    });
    assert.equal(result.outcome, 'cleared', `${frameRate}Hz should clear`);
    assert.equal(result.dispatchScanned, true);
  }
});
