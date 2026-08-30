import type { Direction } from './types.ts';

export type DirectionKeyframe = {
  until: number;
  direction: Direction;
};

export type ReplayDefinition = {
  id: string;
  levelId: string;
  description: string;
  frameRate: number;
  maxDurationSeconds: number;
  keyframes: readonly DirectionKeyframe[];
};

export const LEVEL_8_CLEAN_ROUTE: readonly DirectionKeyframe[] = [
  { until: 2.9, direction: 1 },
  { until: 3.3, direction: -1 },
  { until: 3.7, direction: 1 },
  { until: 4.1, direction: -1 },
  { until: Number.POSITIVE_INFINITY, direction: 1 },
];

export const LEVEL_9_CLEAN_ROUTE: readonly DirectionKeyframe[] = [
  { until: 3.6, direction: 1 },
  { until: Number.POSITIVE_INFINITY, direction: -1 },
];

export const LEVEL_10_CLEAN_ROUTE: readonly DirectionKeyframe[] = [
  { until: 3.6, direction: 1 },
  { until: Number.POSITIVE_INFINITY, direction: -1 },
];

export const LEVEL_8_CLEAN_REPLAY: ReplayDefinition = {
  id: 'level-8-clean-route',
  levelId: 'level-8',
  description: 'Pinned launch, then reverse steering at each B2–B5 fuse.',
  frameRate: 60,
  maxDurationSeconds: 8,
  keyframes: LEVEL_8_CLEAN_ROUTE,
};

export const LEVEL_9_CLEAN_REPLAY: ReplayDefinition = {
  id: 'level-9-cold-start-clean-route',
  levelId: 'level-9',
  description: 'Acquire cold, cool the plate, reach the right wall for B1, then steer left into the exit.',
  frameRate: 60,
  maxDurationSeconds: 7,
  keyframes: LEVEL_9_CLEAN_ROUTE,
};

export const LEVEL_10_CLEAN_REPLAY: ReplayDefinition = {
  id: 'level-10-condensate-gap-clean-route',
  levelId: 'level-10',
  description: 'Acquire cold, freeze and cross the condensate, reach the right wall for B1, then steer left into the exit.',
  frameRate: 60,
  maxDurationSeconds: 7,
  keyframes: LEVEL_10_CLEAN_ROUTE,
};

export const ACCEPTED_REPLAYS: readonly ReplayDefinition[] = [
  LEVEL_8_CLEAN_REPLAY,
  LEVEL_9_CLEAN_REPLAY,
  LEVEL_10_CLEAN_REPLAY,
];

export function directionAtTime(
  replay: readonly DirectionKeyframe[],
  elapsed: number,
): Direction {
  return replay.find((keyframe) => elapsed < keyframe.until)?.direction ?? 0;
}
