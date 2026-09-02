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

export const LEVEL_1_CLEAN_ROUTE: readonly DirectionKeyframe[] = [
  { until: 0.8, direction: 1 },
  { until: 0.9, direction: -1 },
  { until: 5.05, direction: 0 },
  { until: 5.3, direction: 1 },
  { until: 5.8, direction: 0 },
  { until: 6.05, direction: 1 },
  { until: 6.3, direction: 0 },
  { until: 6.55, direction: -1 },
  { until: 7.05, direction: 1 },
  { until: 7.55, direction: 0 },
  { until: 8.05, direction: 1 },
  { until: Number.POSITIVE_INFINITY, direction: 0 },
];

export const LEVEL_2_CLEAN_ROUTE: readonly DirectionKeyframe[] = [
  { until: 1.305, direction: 1 },
  { until: 1.37, direction: -1 },
  { until: 4.8, direction: 0 },
  { until: Number.POSITIVE_INFINITY, direction: 1 },
];

export const LEVEL_3_CLEAN_ROUTE: readonly DirectionKeyframe[] = [
  { until: 0.95, direction: 1 },
  { until: 1, direction: -1 },
  { until: 4.8, direction: 0 },
  { until: 4.9, direction: 1 },
  { until: 5.4, direction: -1 },
  { until: Number.POSITIVE_INFINITY, direction: 1 },
];

export const LEVEL_4_CLEAN_ROUTE: readonly DirectionKeyframe[] = [
  { until: 1.1279, direction: 1 },
  { until: 1.2559, direction: -1 },
  { until: 4.8148, direction: 0 },
  { until: Number.POSITIVE_INFINITY, direction: 1 },
];

export const LEVEL_5_CLEAN_ROUTE: readonly DirectionKeyframe[] = [
  { until: 0.5902, direction: 1 },
  { until: 0.6296, direction: -1 },
  { until: 4.8648, direction: 0 },
  { until: Number.POSITIVE_INFINITY, direction: 1 },
];

export const LEVEL_6_CLEAN_ROUTE: readonly DirectionKeyframe[] = [
  { until: 0.62, direction: 1 },
  { until: 0.7, direction: -1 },
  { until: 2, direction: 0 },
  { until: Number.POSITIVE_INFINITY, direction: 1 },
];

export const LEVEL_7_CLEAN_ROUTE: readonly DirectionKeyframe[] = [
  { until: 0.45, direction: 1 },
  { until: 0.5, direction: -1 },
  { until: 2.3, direction: 0 },
  { until: 4.62, direction: 1 },
  { until: 5.35, direction: -1 },
  { until: 5.65, direction: 1 },
  { until: 6.225, direction: 0 },
  { until: 6.72, direction: -1 },
  { until: Number.POSITIVE_INFINITY, direction: 0 },
];

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

export const LEVEL_18_CLEAN_ROUTE: readonly DirectionKeyframe[] = [
  { until: 3.05, direction: 1 },
  { until: 7.25, direction: -1 },
  { until: Number.POSITIVE_INFINITY, direction: 1 },
];

export const LEVEL_19_CLEAN_ROUTE: readonly DirectionKeyframe[] = [
  { until: Number.POSITIVE_INFINITY, direction: 1 },
];

export const LEVEL_19_RECOVERY_ROUTE: readonly DirectionKeyframe[] = [
  { until: 3.2, direction: 1 },
  { until: 3.6, direction: -1 },
  { until: 7.2, direction: 1 },
  { until: Number.POSITIVE_INFINITY, direction: -1 },
];

export const LEVEL_20_CLEAN_ROUTE: readonly DirectionKeyframe[] = [
  { until: Number.POSITIVE_INFINITY, direction: 1 },
];

export const LEVEL_21_CLEAN_ROUTE: readonly DirectionKeyframe[] = [
  { until: 3.64, direction: 1 },
  { until: Number.POSITIVE_INFINITY, direction: 0 },
];

export const LEVEL_22_CLEAN_ROUTE: readonly DirectionKeyframe[] = [
  { until: 3, direction: 1 },
  { until: 3.45, direction: -1 },
  { until: Number.POSITIVE_INFINITY, direction: 1 },
];

export const LEVEL_23_CLEAN_ROUTE: readonly DirectionKeyframe[] = [
  { until: 3.64, direction: 1 },
  { until: 9.2, direction: 0 },
  { until: Number.POSITIVE_INFINITY, direction: -1 },
];

export const LEVEL_24_CLEAN_ROUTE: readonly DirectionKeyframe[] = [
  { until: 5.95, direction: 1 },
  { until: Number.POSITIVE_INFINITY, direction: -1 },
];

export const LEVEL_25_CLEAN_ROUTE: readonly DirectionKeyframe[] = [
  { until: Number.POSITIVE_INFINITY, direction: 1 },
];

export const LEVEL_1_CLEAN_REPLAY: ReplayDefinition = {
  id: 'level-1-test-chamber-clean-route',
  levelId: 'level-1',
  description: 'Set up B1, climb the two broad decks through B2, then confirm the final B3 launch into the exit.',
  frameRate: 60,
  maxDurationSeconds: 12,
  keyframes: LEVEL_1_CLEAN_ROUTE,
};

export const LEVEL_2_CLEAN_REPLAY: ReplayDefinition = {
  id: 'level-2-trajectory-test-clean-route',
  levelId: 'level-2',
  description: 'Set a rightward B1 line, then steer through the visible opening and across the exit deck.',
  frameRate: 60,
  maxDurationSeconds: 8,
  keyframes: LEVEL_2_CLEAN_ROUTE,
};

export const LEVEL_3_CLEAN_REPLAY: ReplayDefinition = {
  id: 'level-3-tight-pocket-clean-route',
  levelId: 'level-3',
  description: 'Launch through the slot, counter-steer to brake, then settle into the exit pocket.',
  frameRate: 60,
  maxDurationSeconds: 8,
  keyframes: LEVEL_3_CLEAN_ROUTE,
};

export const LEVEL_4_CLEAN_REPLAY: ReplayDefinition = {
  id: 'level-4-air-combo-clean-route',
  levelId: 'level-4',
  description: 'Use B1 to meet floating B2 without touching down, then carry the 2X chain onto the exit deck.',
  frameRate: 60,
  maxDurationSeconds: 8,
  keyframes: LEVEL_4_CLEAN_ROUTE,
};

export const LEVEL_5_CLEAN_REPLAY: ReplayDefinition = {
  id: 'level-5-synthesis-clean-route',
  levelId: 'level-5',
  description: 'Take B1 across the first pit, meet B2 without touching the teeth, then descend through the exit.',
  frameRate: 60,
  maxDurationSeconds: 9,
  keyframes: LEVEL_5_CLEAN_ROUTE,
};

export const LEVEL_6_CLEAN_REPLAY: ReplayDefinition = {
  id: 'level-6-intercept-clean-route',
  levelId: 'level-6',
  description: 'Use B1 to intercept the moving platform at its rightward approach, land on it, then walk onto the exit deck.',
  frameRate: 60,
  maxDurationSeconds: 6,
  keyframes: LEVEL_6_CLEAN_ROUTE,
};

export const LEVEL_7_CLEAN_REPLAY: ReplayDefinition = {
  id: 'level-7-return-arc-clean-route',
  levelId: 'level-7',
  description: 'Clear the first teeth, use B2 to return left, settle left of B3, then launch into the upper-left exit.',
  frameRate: 60,
  maxDurationSeconds: 10,
  keyframes: LEVEL_7_CLEAN_ROUTE,
};

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

export const LEVEL_18_CLEAN_REPLAY: ReplayDefinition = {
  id: 'level-18-phase-shift-clean-route',
  levelId: 'level-18',
  description: 'Freeze and cross the vapor span, replace cold with heat, thaw it to drop on the right, then use B1 back to the exit.',
  frameRate: 60,
  maxDurationSeconds: 9,
  keyframes: LEVEL_18_CLEAN_ROUTE,
};

export const LEVEL_19_CLEAN_REPLAY: ReplayDefinition = {
  id: 'level-19-thermal-catch-clean-route',
  levelId: 'level-19',
  description: 'Acquire heat, melt the launch seal, then take clean B1 directly to the upper exit.',
  frameRate: 60,
  maxDurationSeconds: 8,
  keyframes: LEVEL_19_CLEAN_ROUTE,
};

export const LEVEL_19_RECOVERY_REPLAY: ReplayDefinition = {
  id: 'level-19-thermal-catch-recovery-route',
  levelId: 'level-19',
  description: 'Melt the launch seal, over-brake B1 into emergency coolant, freeze the basin, then recover through B2.',
  frameRate: 60,
  maxDurationSeconds: 10,
  keyframes: LEVEL_19_RECOVERY_ROUTE,
};

export const LEVEL_20_CLEAN_REPLAY: ReplayDefinition = {
  id: 'level-20-induction-rail-clean-route',
  levelId: 'level-20',
  description: 'Acquire magnetic charge, take B1 into automatic rail capture, traverse right, and fall from the rail end into the exit.',
  frameRate: 60,
  maxDurationSeconds: 9,
  keyframes: LEVEL_20_CLEAN_ROUTE,
};

export const LEVEL_21_CLEAN_REPLAY: ReplayDefinition = {
  id: 'level-21-shift-carrier-clean-route',
  levelId: 'level-21',
  description: 'Acquire magnetic charge, intercept the moving carrier with B1, shift right aboard, and ride to automatic receiving-end release.',
  frameRate: 60,
  maxDurationSeconds: 11,
  keyframes: LEVEL_21_CLEAN_ROUTE,
};

export const LEVEL_22_CLEAN_REPLAY: ReplayDefinition = {
  id: 'level-22-polarity-handoff-clean-route',
  levelId: 'level-22',
  description: 'Use heat to power B1, steer left through the airborne induction coil, then reverse right across the magnetic rail.',
  frameRate: 60,
  maxDurationSeconds: 10,
  keyframes: LEVEL_22_CLEAN_ROUTE,
};

export const LEVEL_23_CLEAN_REPLAY: ReplayDefinition = {
  id: 'level-23-quench-drop-clean-route',
  levelId: 'level-23',
  description: 'Ride the moving carrier, replace magnetism with cold during release, freeze the basin, then take B2 left to inspection.',
  frameRate: 60,
  maxDurationSeconds: 13,
  keyframes: LEVEL_23_CLEAN_ROUTE,
};

export const LEVEL_24_CLEAN_REPLAY: ReplayDefinition = {
  id: 'level-24-temper-circuit-clean-route',
  levelId: 'level-24',
  description: 'Build the cold route to B1, replace cold with heat on the locked carriage, wake B2, then return left to the temper deck.',
  frameRate: 60,
  maxDurationSeconds: 11,
  keyframes: LEVEL_24_CLEAN_ROUTE,
};

export const LEVEL_25_CLEAN_REPLAY: ReplayDefinition = {
  id: 'level-25-final-inspection-clean-route',
  levelId: 'level-25',
  description: 'Take the final B1-to-B2 air relay, cross the scanner, retain control, and choose the already-open departure.',
  frameRate: 60,
  maxDurationSeconds: 11,
  keyframes: LEVEL_25_CLEAN_ROUTE,
};

export const ACCEPTED_REPLAYS: readonly ReplayDefinition[] = [
  LEVEL_1_CLEAN_REPLAY,
  LEVEL_2_CLEAN_REPLAY,
  LEVEL_3_CLEAN_REPLAY,
  LEVEL_4_CLEAN_REPLAY,
  LEVEL_5_CLEAN_REPLAY,
  LEVEL_6_CLEAN_REPLAY,
  LEVEL_7_CLEAN_REPLAY,
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
  LEVEL_18_CLEAN_REPLAY,
  LEVEL_19_CLEAN_REPLAY,
  LEVEL_20_CLEAN_REPLAY,
  LEVEL_21_CLEAN_REPLAY,
  LEVEL_22_CLEAN_REPLAY,
  LEVEL_23_CLEAN_REPLAY,
  LEVEL_24_CLEAN_REPLAY,
  LEVEL_25_CLEAN_REPLAY,
];

export function directionAtTime(
  replay: readonly DirectionKeyframe[],
  elapsed: number,
): Direction {
  return replay.find((keyframe) => elapsed < keyframe.until)?.direction ?? 0;
}
