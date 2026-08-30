export type Rect = { x: number; y: number; w: number; h: number };

export type BombDefinition = {
  x: number;
  y: number;
  delay: number;
  label: string;
  floating?: boolean;
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
};

export type LandingWindowKind = 'none' | 'wide' | 'medium' | 'tight';
export type TimingWindowKind = 'open' | 'commit' | 'intercept' | 'expiring';
export type RecoveryKind = 'safe' | 'recoverable' | 'costly' | 'fatal';
export type SimplePolicyId = 'hold-left' | 'neutral' | 'hold-right';

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
};

export type PlayerState = {
  x: number;
  y: number;
  controlVx: number;
  blastVx: number;
  vy: number;
  grounded: boolean;
  onMovingPlatform: boolean;
};

export type Direction = -1 | 0 | 1;
