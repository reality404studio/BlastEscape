export type Rect = { x: number; y: number; w: number; h: number };

export type BombDefinition = {
  x: number;
  y: number;
  delay: number;
  label: string;
  floating?: boolean;
  reactivatedByInteractionId?: string;
};

export type BombState = BombDefinition & { timer: number };

export type MovingPlatform = {
  fromX: number;
  toX: number;
  y: number;
  w: number;
  h: number;
  speed: number;
  phase: number;
  stabilizedByInteractionId?: string;
  stabilizedX?: number;
};

export type LandingWindowKind = 'none' | 'wide' | 'medium' | 'tight';
export type TimingWindowKind = 'open' | 'commit' | 'intercept' | 'expiring';
export type RecoveryKind = 'safe' | 'recoverable' | 'costly' | 'fatal';
export type SimplePolicyId = 'hold-left' | 'neutral' | 'hold-right';
export type TraversalStateKind = 'neutral' | 'cold' | 'heat' | 'magnetic';
export type TraversalInteractionKind =
  | 'freeze-water'
  | 'stabilize-machine'
  | 'cool-surface'
  | 'melt-barrier'
  | 'thaw-ice'
  | 'reactivate-charge'
  | 'magnetic-attach';

export type ActiveTraversalState = {
  kind: TraversalStateKind;
  remainingSeconds: number;
  sourceId: string | null;
};

export type TraversalStateSource = {
  id: string;
  rect: Rect;
  grants: Exclude<TraversalStateKind, 'neutral'>;
  durationSeconds: number;
};

export type TraversalInteraction = {
  id: string;
  rect: Rect;
  kind: TraversalInteractionKind;
  accepts: Array<Exclude<TraversalStateKind, 'neutral'>>;
  activeSeconds?: number;
  resultRect?: Rect;
};

export type HotSurface = {
  id: string;
  rect: Rect;
  cooledByInteractionId: string;
};

export type WaterHazard = {
  id: string;
  rect: Rect;
  frozenByInteractionId: string;
};

export type MeltableBarrier = {
  id: string;
  rect: Rect;
  meltedByInteractionId: string;
};

export type LevelIntent = {
  primaryRoute: string;
  launchJobs: Array<{ bomb: string; job: string }>;
  landingWindows: Array<{
    target: string;
    kind: LandingWindowKind;
    description: string;
  }>;
  timingWindows: Array<{
    target: string;
    kind: TimingWindowKind;
    description: string;
  }>;
  recovery: { kind: RecoveryKind; description: string };
  masteryShortcut: string | null;
  newConcept: string;
  recombinedSkills: string[];
  targetFirstClearSeconds: { min: number; max: number };
};

export type LevelValidationContract = {
  requiredBlastHits?: string[];
  requiredInteractions?: string[];
  requiredStates?: Array<Exclude<TraversalStateKind, 'neutral'>>;
  minimumAirCombo?: number;
  simplePoliciesMustFail?: SimplePolicyId[];
  noisyHumanProfiles?: Array<{
    jitterMilliseconds: number;
    samples: number;
    minimumClearRate: number;
  }>;
};

export type LevelDefinition = {
  id: string;
  name: string;
  subtitle: string;
  hint: string;
  intent: LevelIntent;
  validation: LevelValidationContract;
  start: { x: number; y: number };
  platforms: Rect[];
  bombs: BombDefinition[];
  exit: Rect;
  opening?: Rect;
  spikes?: Rect[];
  pit?: Rect;
  movingPlatform?: MovingPlatform;
  requiredCombo?: number;
  traversalStateSources?: TraversalStateSource[];
  traversalInteractions?: TraversalInteraction[];
  hotSurfaces?: HotSurface[];
  waterHazards?: WaterHazard[];
  meltableBarriers?: MeltableBarrier[];
};

export type PlayerState = {
  x: number;
  y: number;
  controlVx: number;
  blastVx: number;
  vy: number;
  grounded: boolean;
  onMovingPlatform: boolean;
  traversalState: ActiveTraversalState;
};

export type Direction = -1 | 0 | 1;
