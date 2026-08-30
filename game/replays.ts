import type { Direction } from './types.ts';

export type DirectionKeyframe = {
  until: number;
  direction: Direction;
};

export const LEVEL_8_CLEAN_ROUTE: readonly DirectionKeyframe[] = [
  { until: 2.9, direction: 1 },
  { until: 3.3, direction: -1 },
  { until: 3.7, direction: 1 },
  { until: 4.1, direction: -1 },
  { until: Number.POSITIVE_INFINITY, direction: 1 },
];

export function directionAtTime(
  replay: readonly DirectionKeyframe[],
  elapsed: number,
): Direction {
  return replay.find((keyframe) => elapsed < keyframe.until)?.direction ?? 0;
}
