import assert from 'node:assert/strict';
import test from 'node:test';

import { createGameplayState, stepGameplay } from '../game/core.ts';
import { LEVELS } from '../game/levels.ts';
import { directionAtTime, LEVEL_8_CLEAN_ROUTE } from '../game/replays.ts';
import type { Direction } from '../game/types.ts';

type ReplayOutcome = {
  outcome: 'cleared' | 'died' | 'timeout';
  elapsed: number;
  comboCount: number;
};

function runLevel8(
  fps: number,
  direction: Direction | ((elapsed: number) => Direction),
  duration = 8,
): ReplayOutcome {
  const level = LEVELS[7];
  const state = createGameplayState(level);
  const dt = Math.min(0.034, 1 / fps);
  const frameLimit = Math.ceil(duration / dt);

  for (let frame = 0; frame < frameLimit; frame += 1) {
    const events = stepGameplay(state, level, direction, dt);
    if (events.some((event) => event.type === 'cleared')) {
      return { outcome: 'cleared', elapsed: state.levelElapsed, comboCount: state.comboCount };
    }
    if (events.some((event) => event.type === 'died')) {
      return { outcome: 'died', elapsed: state.levelElapsed, comboCount: state.comboCount };
    }
  }
  return { outcome: 'timeout', elapsed: state.levelElapsed, comboCount: state.comboCount };
}

test('the authoritative core clears the Level 8 clean route across supported frame schedules', () => {
  for (const fps of [144, 120, 60, 50, 30]) {
    const result = runLevel8(
      fps,
      (elapsed) => directionAtTime(LEVEL_8_CLEAN_ROUTE, elapsed),
    );
    assert.equal(result.outcome, 'cleared', `${fps} Hz should clear`);
    assert.equal(result.comboCount, 5, `${fps} Hz should use all five blasts`);
    assert.ok(
      result.elapsed >= 4.39 && result.elapsed <= 4.45,
      `${fps} Hz clear time ${result.elapsed} should remain in the characterized window`,
    );
  }
});

test('holding a single direction does not bypass the Level 8 steering lesson', () => {
  for (const direction of [-1, 0, 1] as const) {
    const result = runLevel8(60, direction);
    assert.notEqual(result.outcome, 'cleared', `direction ${direction} must not clear`);
  }
});

test('gameplay events preserve movement-before-bomb ordering', () => {
  const level = LEVELS[0];
  const state = createGameplayState(level);
  state.bombs[0].timer = 0;

  const events = stepGameplay(state, level, 0, 1 / 60);
  assert.deepEqual(events.slice(0, 3).map((event) => event.type), [
    'moved',
    'moved',
    'moved',
  ]);
  assert.equal(events[3]?.type, 'bomb-exploded');
});
