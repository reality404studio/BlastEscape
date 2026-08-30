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

export type LevelDefinition = {
  name: string;
  subtitle: string;
  hint: string;
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
