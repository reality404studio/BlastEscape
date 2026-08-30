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

export const LEVEL_11_CLEAN_ROUTE: readonly DirectionKeyframe[] = [
  { until: 2.6, direction: 1 },
  { until: 3.3, direction: 0 },
  { until: Number.POSITIVE_INFINITY, direction: 1 },
];

export const LEVEL_12_CLEAN_ROUTE: readonly DirectionKeyframe[] = [
  { until: 4.2, direction: 1 },
  { until: Number.POSITIVE_INFINITY, direction: -1 },
];

export const LEVEL_13_CLEAN_ROUTE: readonly DirectionKeyframe[] = [
  { until: 3.92, direction: 1 },
  { until: Number.POSITIVE_INFINITY, direction: 0 },
];

export const LEVEL_13_RECOVERY_ROUTE: readonly DirectionKeyframe[] = [
  { until: 3.1, direction: 1 },
  { until: 4.2, direction: -1 },
  { until: Number.POSITIVE_INFINITY, direction: 1 },
];

export const LEVEL_14_CLEAN_ROUTE: readonly DirectionKeyframe[] = [
  { until: 5.95, direction: 1 },
  { until: Number.POSITIVE_INFINITY, direction: -1 },
];

export const LEVEL_14_MASTERY_ROUTE: readonly DirectionKeyframe[] = [
  { until: 1.75, direction: 1 },
  { until: 1.9, direction: -1 },
  { until: 3.2, direction: 0 },
  { until: Number.POSITIVE_INFINITY, direction: 1 },
];

export const LEVEL_15_CLEAN_ROUTE: readonly DirectionKeyframe[] = [
  { until: 3.6, direction: 1 },
  { until: Number.POSITIVE_INFINITY, direction: -1 },
];

export const LEVEL_16_CLEAN_ROUTE: readonly DirectionKeyframe[] = [
  { until: 4.5, direction: 1 },
  { until: Number.POSITIVE_INFINITY, direction: -1 },
];

export const LEVEL_17_CLEAN_ROUTE: readonly DirectionKeyframe[] = [
  { until: 1.4, direction: 0 },
  { until: 4.9, direction: 1 },
  { until: Number.POSITIVE_INFINITY, direction: -1 },
];

export const LEVEL_17_RECOVERY_ROUTE: readonly DirectionKeyframe[] = [
  { until: 4.9, direction: 1 },
  { until: 6.2, direction: -1 },
  { until: 7.5, direction: 1 },
  { until: 8.7, direction: -1 },
  { until: 10.5, direction: 1 },
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

export const LEVEL_11_CLEAN_REPLAY: ReplayDefinition = {
  id: 'level-11-cold-lock-clean-route',
  levelId: 'level-11',
  description: 'Acquire cold, lock the transfer carriage at its dock, launch from B1, settle onto it, then cross the inspection deck to the exit.',
  frameRate: 60,
  maxDurationSeconds: 8,
  keyframes: LEVEL_11_CLEAN_ROUTE,
};

export const LEVEL_12_CLEAN_REPLAY: ReplayDefinition = {
  id: 'level-12-thaw-clock-clean-route',
  levelId: 'level-12',
  description: 'Acquire cold, freeze and race across the trench, use B1 on its first fuse, then steer left into the exit.',
  frameRate: 60,
  maxDurationSeconds: 8,
  keyframes: LEVEL_12_CLEAN_ROUTE,
};

export const LEVEL_13_CLEAN_REPLAY: ReplayDefinition = {
  id: 'level-13-cold-catch-clean-route',
  levelId: 'level-13',
  description: 'Freeze the basin, launch from B1, then brake left onto the upper exit deck.',
  frameRate: 60,
  maxDurationSeconds: 8,
  keyframes: LEVEL_13_CLEAN_ROUTE,
};

export const LEVEL_13_RECOVERY_REPLAY: ReplayDefinition = {
  id: 'level-13-cold-catch-recovery-route',
  levelId: 'level-13',
  description: 'Over-brake B1 onto the frozen basin, then recover right through B2 into the exit.',
  frameRate: 60,
  maxDurationSeconds: 9,
  keyframes: LEVEL_13_RECOVERY_ROUTE,
};

export const LEVEL_14_CLEAN_REPLAY: ReplayDefinition = {
  id: 'level-14-blue-circuit-clean-route',
  levelId: 'level-14',
  description: 'Freeze the intake, lock the carriage, take offset B1 to the carriage, then B2 left into the exit.',
  frameRate: 60,
  maxDurationSeconds: 9,
  keyframes: LEVEL_14_CLEAN_ROUTE,
};

export const LEVEL_14_MASTERY_REPLAY: ReplayDefinition = {
  id: 'level-14-blue-circuit-mastery-route',
  levelId: 'level-14',
  description: 'Brake directly over B1, then use its stronger vertical launch to bypass the carriage and B2.',
  frameRate: 60,
  maxDurationSeconds: 7,
  keyframes: LEVEL_14_MASTERY_ROUTE,
};

export const LEVEL_15_CLEAN_REPLAY: ReplayDefinition = {
  id: 'level-15-thermal-seal-clean-route',
  levelId: 'level-15',
  description: 'Acquire heat, melt and cross the partition, reach the right wall for B1, then steer left into the exit.',
  frameRate: 60,
  maxDurationSeconds: 7,
  keyframes: LEVEL_15_CLEAN_ROUTE,
};

export const LEVEL_16_CLEAN_REPLAY: ReplayDefinition = {
  id: 'level-16-reignition-clean-route',
  levelId: 'level-16',
  description: 'Acquire heat, power the ignition terminal, wait at the right wall for B1, then steer left into the exit.',
  frameRate: 60,
  maxDurationSeconds: 8,
  keyframes: LEVEL_16_CLEAN_ROUTE,
};

export const LEVEL_17_CLEAN_REPLAY: ReplayDefinition = {
  id: 'level-17-heat-window-clean-route',
  levelId: 'level-17',
  description: 'Delay furnace pickup, reach first-cycle B1, then carry the remaining heat left through the upper seal.',
  frameRate: 60,
  maxDurationSeconds: 8,
  keyframes: LEVEL_17_CLEAN_ROUTE,
};

export const LEVEL_17_RECOVERY_REPLAY: ReplayDefinition = {
  id: 'level-17-heat-window-recovery-route',
  levelId: 'level-17',
  description: 'Pick heat too early, bounce off the upper seal, drop to the furnace, then recover through the repeating B1 cycle.',
  frameRate: 60,
  maxDurationSeconds: 14,
  keyframes: LEVEL_17_RECOVERY_ROUTE,
};

export const ACCEPTED_REPLAYS: readonly ReplayDefinition[] = [
  LEVEL_8_CLEAN_REPLAY,
  LEVEL_9_CLEAN_REPLAY,
  LEVEL_10_CLEAN_REPLAY,
  LEVEL_11_CLEAN_REPLAY,
  LEVEL_12_CLEAN_REPLAY,
  LEVEL_13_CLEAN_REPLAY,
  LEVEL_14_CLEAN_REPLAY,
  LEVEL_15_CLEAN_REPLAY,
  LEVEL_16_CLEAN_REPLAY,
  LEVEL_17_CLEAN_REPLAY,
];

export function directionAtTime(
  replay: readonly DirectionKeyframe[],
  elapsed: number,
): Direction {
  return replay.find((keyframe) => elapsed < keyframe.until)?.direction ?? 0;
}
