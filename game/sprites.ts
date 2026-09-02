export const FOUNDRY_POD_MANIFEST_URL = '/sprites/foundry-pod/manifest.json';
export const FOUNDRY_POD_ATLAS_URL = '/sprites/foundry-pod/sprite-sheet-alpha.png';

export type PlayerAnimationState = 'idle' | 'walk' | 'airborne' | 'land';

type SpriteRect = { x: number; y: number; w: number; h: number };

type SpriteAnimationRow = {
  row: number;
  frames: number;
  fps: number;
  durations_ms: number[];
  loop: boolean;
  frame_variant: string;
};

export type SpriteManifest = {
  characterId: string;
  game_input: string;
  animation: {
    cellWidth: number;
    cellHeight: number;
    columns: number;
    rows: Record<PlayerAnimationState, SpriteAnimationRow>;
  };
  frame_layout: {
    sheetWidth: number;
    sheetHeight: number;
    cellWidth: number;
    cellHeight: number;
    rows: Record<PlayerAnimationState, SpriteRect[]>;
  };
};

export type SpriteFrame = {
  state: PlayerAnimationState;
  index: number;
  rect: SpriteRect;
};

export function animationDurationSeconds(
  manifest: SpriteManifest,
  state: PlayerAnimationState,
) {
  return manifest.animation.rows[state].durations_ms.reduce(
    (total, duration) => total + duration,
    0,
  ) / 1000;
}

export function playerAnimationStateFor(
  grounded: boolean,
  horizontalVelocity: number,
  landingElapsed: number,
  landingDuration: number,
): PlayerAnimationState {
  if (landingElapsed < landingDuration) return 'land';
  if (!grounded) return 'airborne';
  if (Math.abs(horizontalVelocity) >= 20) return 'walk';
  return 'idle';
}

export function animationFrameAt(
  manifest: SpriteManifest,
  state: PlayerAnimationState,
  elapsedSeconds: number,
): SpriteFrame {
  const animation = manifest.animation.rows[state];
  const rects = manifest.frame_layout.rows[state];
  if (!animation || !rects || animation.frames !== rects.length) {
    throw new Error(`Invalid sprite manifest row: ${state}`);
  }

  const totalDuration = animation.durations_ms.reduce(
    (total, duration) => total + duration,
    0,
  );
  if (totalDuration <= 0 || animation.durations_ms.length !== rects.length) {
    throw new Error(`Invalid sprite manifest timing: ${state}`);
  }

  const rawElapsed = Math.max(0, elapsedSeconds * 1000);
  const elapsed = animation.loop
    ? rawElapsed % totalDuration
    : Math.min(rawElapsed, Math.max(0, totalDuration - Number.EPSILON));
  let boundary = 0;
  let index = rects.length - 1;
  for (let frameIndex = 0; frameIndex < animation.durations_ms.length; frameIndex += 1) {
    boundary += animation.durations_ms[frameIndex];
    if (elapsed < boundary) {
      index = frameIndex;
      break;
    }
  }

  return { state, index, rect: rects[index] };
}

export function isSpriteManifest(value: unknown): value is SpriteManifest {
  if (!value || typeof value !== 'object') return false;
  const manifest = value as Partial<SpriteManifest>;
  return (
    manifest.characterId === 'foundry-pod' &&
    manifest.game_input === 'sprite-sheet-alpha.png' &&
    manifest.animation?.cellWidth === 32 &&
    manifest.animation?.cellHeight === 40 &&
    Boolean(manifest.animation?.rows) &&
    Boolean(manifest.frame_layout?.rows)
  );
}
