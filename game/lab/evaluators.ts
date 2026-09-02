import { runReplay } from './replay-runner.ts';
import type { ReplayResult } from './replay-runner.ts';
import type { DirectionKeyframe, ReplayDefinition } from '../replays.ts';
import type { LevelDefinition, SimplePolicyId } from '../types.ts';

export type EvaluationStatus = 'pass' | 'warn' | 'fail';

export type EvaluationResult = {
  evaluator: 'reachability' | 'exploit' | 'noisy-human' | 'mechanic';
  id: string;
  status: EvaluationStatus;
  summary: string;
  metrics: Record<string, string | number | boolean | string[]>;
};

export type LevelValidationReport = {
  schemaVersion: 1;
  levelId: string;
  levelName: string;
  replayId: string;
  status: EvaluationStatus;
  evaluations: EvaluationResult[];
  acceptedReplay: ReplayResult;
  caveat: string;
};

const SIMPLE_POLICIES: Record<SimplePolicyId, -1 | 0 | 1> = {
  'hold-left': -1,
  neutral: 0,
  'hold-right': 1,
};

function replayWithConstantDirection(
  source: ReplayDefinition,
  policy: SimplePolicyId,
): ReplayDefinition {
  return {
    ...source,
    id: `${source.id}-${policy}`,
    keyframes: [{ until: Number.POSITIVE_INFINITY, direction: SIMPLE_POLICIES[policy] }],
  };
}

function createRandom(seed: number) {
  let state = seed >>> 0 || 0x9e3779b9;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x100000000;
  };
}

export function jitterReplay(
  source: ReplayDefinition,
  jitterMilliseconds: number,
  seed: number,
): ReplayDefinition {
  const random = createRandom(seed);
  const jitterSeconds = jitterMilliseconds / 1000;
  const finite = source.keyframes
    .filter((keyframe) => Number.isFinite(keyframe.until))
    .map((keyframe) => keyframe.until + (random() * 2 - 1) * jitterSeconds)
    .sort((a, b) => a - b);
  let finiteIndex = 0;
  const keyframes: DirectionKeyframe[] = source.keyframes.map((keyframe) => ({
    direction: keyframe.direction,
    until: Number.isFinite(keyframe.until)
      ? finite[finiteIndex++]
      : Number.POSITIVE_INFINITY,
  }));

  return {
    ...source,
    id: `${source.id}-jitter-${jitterMilliseconds}ms-${seed}`,
    keyframes,
  };
}

export function evaluateReachability(
  level: LevelDefinition,
  replay: ReplayDefinition,
): { evaluation: EvaluationResult; replayResult: ReplayResult } {
  const result = runReplay(level, replay);
  const passed = result.outcome === 'cleared';
  return {
    replayResult: result,
    evaluation: {
      evaluator: 'reachability',
      id: 'accepted-route-clears',
      status: passed ? 'pass' : 'fail',
      summary: passed
        ? `Accepted replay clears in ${result.elapsedSeconds.toFixed(3)}s.`
        : `Accepted replay ended as ${result.outcome}.`,
      metrics: {
        outcome: result.outcome,
        elapsedSeconds: result.elapsedSeconds,
        maximumAirCombo: result.maximumAirCombo,
      },
    },
  };
}

export function evaluateSimpleExploits(
  level: LevelDefinition,
  replay: ReplayDefinition,
): EvaluationResult {
  const policies = level.validation.simplePoliciesMustFail ?? [];
  if (policies.length === 0) {
    return {
      evaluator: 'exploit',
      id: 'simple-policy-bypass',
      status: 'warn',
      summary: 'No simple-policy rejection contract is defined for this level.',
      metrics: { testedPolicies: [] },
    };
  }

  const outcomes = policies.map((policy) => ({
    policy,
    outcome: runReplay(level, replayWithConstantDirection(replay, policy)).outcome,
  }));
  const bypasses = outcomes.filter((outcome) => outcome.outcome === 'cleared');
  return {
    evaluator: 'exploit',
    id: 'simple-policy-bypass',
    status: bypasses.length === 0 ? 'pass' : 'fail',
    summary: bypasses.length === 0
      ? 'No forbidden constant-direction policy clears the level.'
      : `Unexpected bypasses: ${bypasses.map(({ policy }) => policy).join(', ')}.`,
    metrics: {
      testedPolicies: policies,
      bypassPolicies: bypasses.map(({ policy }) => policy),
    },
  };
}

export function evaluateMechanicUse(
  level: LevelDefinition,
  result: ReplayResult,
): EvaluationResult {
  const requiredHits = level.validation.requiredBlastHits ?? [];
  const requiredInteractions = level.validation.requiredInteractions ?? [];
  const requiredStates = level.validation.requiredStates ?? [];
  const requiredCombo = level.validation.minimumAirCombo ?? 0;
  if (
    requiredHits.length === 0 &&
    requiredInteractions.length === 0 &&
    requiredStates.length === 0 &&
    requiredCombo === 0
  ) {
    return {
      evaluator: 'mechanic',
      id: 'intended-mechanic-use',
      status: 'warn',
      summary: 'No machine-checkable mechanic-use contract is defined for this level.',
      metrics: {
        requiredBlastHits: [],
        requiredInteractions: [],
        requiredStates: [],
        minimumAirCombo: 0,
      },
    };
  }

  const actualHits = [...new Set(result.blastHits)];
  const actualInteractions = [...new Set(result.acceptedInteractions)];
  const actualStates = [...new Set(result.acquiredStates)];
  const missingHits = requiredHits.filter((label) => !actualHits.includes(label));
  const missingInteractions = requiredInteractions.filter(
    (id) => !actualInteractions.includes(id),
  );
  const missingStates = requiredStates.filter((state) => !actualStates.includes(state));
  const comboPassed = result.maximumAirCombo >= requiredCombo;
  const passed =
    missingHits.length === 0 &&
    missingInteractions.length === 0 &&
    missingStates.length === 0 &&
    comboPassed;
  return {
    evaluator: 'mechanic',
    id: 'intended-mechanic-use',
    status: passed ? 'pass' : 'fail',
    summary: passed
      ? 'Accepted replay exercises the required blasts and combo.'
      : 'Accepted replay does not exercise every required mechanic condition.',
    metrics: {
      requiredBlastHits: requiredHits,
      actualBlastHits: actualHits,
      missingBlastHits: missingHits,
      requiredInteractions,
      actualInteractions,
      missingInteractions,
      requiredStates,
      actualStates,
      missingStates,
      minimumAirCombo: requiredCombo,
      actualMaximumAirCombo: result.maximumAirCombo,
    },
  };
}

export function evaluateNoisyHuman(
  level: LevelDefinition,
  replay: ReplayDefinition,
): EvaluationResult[] {
  const profiles = level.validation.noisyHumanProfiles ?? [];
  if (profiles.length === 0) {
    return [{
      evaluator: 'noisy-human',
      id: 'timing-jitter',
      status: 'warn',
      summary: 'No noisy-human robustness profile is defined for this level.',
      metrics: { profiles: 0 },
    }];
  }

  return profiles.map((profile, profileIndex) => {
    let clears = 0;
    for (let sample = 0; sample < profile.samples; sample += 1) {
      const seed = (profileIndex + 1) * 1000003 + sample + 1;
      const noisy = jitterReplay(replay, profile.jitterMilliseconds, seed);
      if (runReplay(level, noisy).outcome === 'cleared') clears += 1;
    }
    const clearRate = clears / profile.samples;
    const passed = clearRate >= profile.minimumClearRate;
    return {
      evaluator: 'noisy-human',
      id: `timing-jitter-${profile.jitterMilliseconds}ms`,
      status: passed ? 'pass' : 'fail',
      summary: `${clears}/${profile.samples} deterministic jittered replays cleared.`,
      metrics: {
        jitterMilliseconds: profile.jitterMilliseconds,
        samples: profile.samples,
        clears,
        clearRate,
        minimumClearRate: profile.minimumClearRate,
      },
    };
  });
}

export function validateLevel(
  level: LevelDefinition,
  replay: ReplayDefinition,
): LevelValidationReport {
  const reachability = evaluateReachability(level, replay);
  const evaluations = [
    reachability.evaluation,
    evaluateSimpleExploits(level, replay),
    ...evaluateNoisyHuman(level, replay),
    evaluateMechanicUse(level, reachability.replayResult),
  ];
  const status = evaluations.some((evaluation) => evaluation.status === 'fail')
    ? 'fail'
    : evaluations.some((evaluation) => evaluation.status === 'warn')
      ? 'warn'
      : 'pass';

  return {
    schemaVersion: 1,
    levelId: level.id,
    levelName: `${level.name} — ${level.subtitle}`,
    replayId: replay.id,
    status,
    evaluations,
    acceptedReplay: reachability.replayResult,
    caveat: 'These evaluators reject broken or contract-violating routes; they do not prove fun.',
  };
}
