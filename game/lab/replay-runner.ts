import { createGameplayState, stepGameplay } from '../core.ts';
import { directionAtTime } from '../replays.ts';
import type { ReplayDefinition } from '../replays.ts';
import type { LevelDefinition } from '../types.ts';

export type ReplayOutcome = 'cleared' | 'died' | 'timeout';

export type ReplayResult = {
  replayId: string;
  levelId: string;
  outcome: ReplayOutcome;
  elapsedSeconds: number;
  frames: number;
  frameRate: number;
  deathReason: 'spikes' | 'fall' | 'hot-surface' | null;
  blastExplosions: string[];
  blastHits: string[];
  acceptedInteractions: string[];
  acquiredStates: string[];
  landingCount: number;
  maximumAirCombo: number;
  highestPointY: number;
  finalPlayer: { x: number; y: number; controlVx: number; blastVx: number; vy: number };
};

export function runReplay(
  level: LevelDefinition,
  replay: ReplayDefinition,
): ReplayResult {
  if (replay.levelId !== level.id) {
    throw new Error(`Replay ${replay.id} targets ${replay.levelId}, not ${level.id}.`);
  }
  if (!Number.isFinite(replay.frameRate) || replay.frameRate <= 0) {
    throw new Error(`Replay ${replay.id} has invalid frameRate ${replay.frameRate}.`);
  }
  if (!Number.isFinite(replay.maxDurationSeconds) || replay.maxDurationSeconds <= 0) {
    throw new Error(`Replay ${replay.id} has invalid maxDurationSeconds.`);
  }

  const state = createGameplayState(level);
  const dt = Math.min(0.034, 1 / replay.frameRate);
  const frameLimit = Math.ceil(replay.maxDurationSeconds / dt);
  const blastExplosions: string[] = [];
  const blastHits: string[] = [];
  const acceptedInteractions: string[] = [];
  const acquiredStates: string[] = [];
  let landingCount = 0;
  let maximumAirCombo = 0;
  let highestPointY = state.player.y;
  let outcome: ReplayOutcome = 'timeout';
  let deathReason: ReplayResult['deathReason'] = null;
  let frames = 0;

  for (let frame = 0; frame < frameLimit; frame += 1) {
    frames = frame + 1;
    const events = stepGameplay(
      state,
      level,
      (elapsed) => directionAtTime(replay.keyframes, elapsed),
      dt,
    );
    highestPointY = Math.min(highestPointY, state.player.y);

    for (const event of events) {
      if (event.type === 'landed') landingCount += 1;
      if (event.type === 'traversal-state-changed' && event.reason !== 'expired') {
        if (!acquiredStates.includes(event.current.kind)) acquiredStates.push(event.current.kind);
      }
      if (event.type === 'traversal-interaction-contact' && event.accepted) {
        if (!acceptedInteractions.includes(event.interactionId)) {
          acceptedInteractions.push(event.interactionId);
        }
      }
      if (event.type === 'bomb-exploded') {
        blastExplosions.push(event.bomb.label);
        if (event.blast.hit) blastHits.push(event.bomb.label);
        maximumAirCombo = Math.max(maximumAirCombo, event.comboCount);
      } else if (event.type === 'cleared') {
        outcome = 'cleared';
      } else if (event.type === 'died') {
        outcome = 'died';
        deathReason = event.reason;
      }
    }
    if (outcome !== 'timeout') break;
  }

  return {
    replayId: replay.id,
    levelId: level.id,
    outcome,
    elapsedSeconds: state.levelElapsed,
    frames,
    frameRate: replay.frameRate,
    deathReason,
    blastExplosions,
    blastHits,
    acceptedInteractions,
    acquiredStates,
    landingCount,
    maximumAirCombo,
    highestPointY,
    finalPlayer: {
      x: state.player.x,
      y: state.player.y,
      controlVx: state.player.controlVx,
      blastVx: state.player.blastVx,
      vy: state.player.vy,
    },
  };
}
