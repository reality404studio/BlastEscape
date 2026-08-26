'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const CONFIG = {
  worldWidth: 960,
  worldHeight: 600,
  playerWidth: 26,
  playerHeight: 36,
  runAcceleration: 1900,
  airAcceleration: 760,
  maxRunSpeed: 275,
  groundFriction: 0.8,
  blastAirRetention: 0.985,
  blastGroundRetention: 0.68,
  gravity: 1180,
  maxFallSpeed: 920,
  explosionRadius: 154,
  explosionImpulse: 830,
  explosionMinImpulse: 370,
  explosionMaxImpulse: 900,
  explosionVerticalBias: 58,
  bombFuseDuration: 4.8,
  bombRepeatInterval: 5.6,
  screenShake: 10,
} as const;

type Rect = { x: number; y: number; w: number; h: number };
type Bomb = {
  x: number;
  y: number;
  timer: number;
  delay: number;
  label: string;
  floating?: boolean;
};
type Particle = { x: number; y: number; vx: number; vy: number; life: number };
type ContactParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
};
type Wave = { x: number; y: number; radius: number; life: number };
type BlastFlash = { x: number; y: number; life: number };
type MovingPlatform = {
  fromX: number;
  toX: number;
  y: number;
  w: number;
  h: number;
  speed: number;
  phase: number;
};
type Level = {
  name: string;
  subtitle: string;
  hint: string;
  start: { x: number; y: number };
  platforms: Rect[];
  bombs: Array<{ x: number; y: number; delay: number; label: string; floating?: boolean }>;
  exit: Rect;
  opening?: Rect;
  spikes?: Rect[];
  pit?: Rect;
  movingPlatform?: MovingPlatform;
  requiredCombo?: number;
};

// How long the clear overlay holds before the next level loads.
const LEVEL_ADVANCE_DELAY = 1600;

const VISUAL = {
  void: '#07070b',
  backgroundTop: '#17131e',
  backgroundBottom: '#09080d',
  structure: '#302c38',
  structureDark: '#211e28',
  structureEdge: '#716a79',
  structureSeam: '#3b3644',
  player: '#f2eee5',
  playerShade: '#c8c3ba',
  sensor: '#17141c',
  hot: '#ff513e',
  amber: '#ffad37',
  mint: '#66f2d5',
  gold: '#ffc44f',
} as const;

const LEVELS: Level[] = [
  {
    name: 'LEVEL 1',
    subtitle: 'TEST CHAMBER',
    hint: 'Get close. Pick a side. Let the blast do the jumping.',
    start: { x: 92, y: 514 },
    platforms: [
      { x: 0, y: 550, w: 960, h: 50 },
      { x: 396, y: 402, w: 224, h: 22 },
      { x: 704, y: 238, w: 210, h: 22 },
      { x: 0, y: 0, w: 18, h: 600 },
      { x: 942, y: 0, w: 18, h: 600 },
    ],
    bombs: [
      { x: 304, y: 532, delay: 0, label: 'B1' },
      { x: 535, y: 384, delay: 1.7, label: 'B2' },
      { x: 754, y: 220, delay: 3.2, label: 'B3' },
    ],
    exit: { x: 822, y: 174, w: 54, h: 64 },
  },
  {
    name: 'LEVEL 2',
    subtitle: 'TRAJECTORY TEST',
    hint: 'Choose your launch line. Steer through the opening while airborne.',
    start: { x: 92, y: 514 },
    platforms: [
      { x: 0, y: 550, w: 960, h: 50 },
      { x: 18, y: 330, w: 477, h: 28 },
      { x: 610, y: 330, w: 332, h: 28 },
      { x: 0, y: 0, w: 960, h: 18 },
      { x: 0, y: 0, w: 18, h: 600 },
      { x: 942, y: 0, w: 18, h: 600 },
    ],
    bombs: [{ x: 460, y: 532, delay: 0, label: 'B1' }],
    exit: { x: 838, y: 266, w: 54, h: 64 },
    opening: { x: 495, y: 330, w: 115, h: 28 },
  },
  {
    name: 'LEVEL 3',
    subtitle: 'TIGHT POCKET',
    hint: 'Thread the slot. Brake in midair. Land in the pocket.',
    start: { x: 92, y: 464 },
    platforms: [
      { x: 0, y: 500, w: 390, h: 22 },
      { x: 18, y: 300, w: 372, h: 22 },
      { x: 490, y: 300, w: 30, h: 22 },
      { x: 560, y: 360, w: 110, h: 22 },
      { x: 520, y: 170, w: 180, h: 22 },
      { x: 700, y: 170, w: 28, h: 330 },
      { x: 0, y: 0, w: 18, h: 600 },
      { x: 942, y: 0, w: 18, h: 600 },
    ],
    bombs: [{ x: 350, y: 482, delay: 0, label: 'B1' }],
    exit: { x: 588, y: 296, w: 54, h: 64 },
    opening: { x: 390, y: 300, w: 100, h: 22 },
  },
  {
    name: 'LEVEL 4',
    subtitle: 'AIR COMBO',
    hint: 'First blast starts the chain. Meet the floating bomb before you touch down.',
    start: { x: 92, y: 514 },
    platforms: [
      { x: 0, y: 550, w: 960, h: 50 },
      { x: 18, y: 350, w: 432, h: 22 },
      { x: 580, y: 350, w: 140, h: 22 },
      { x: 750, y: 190, w: 192, h: 22 },
      { x: 0, y: 0, w: 960, h: 18 },
      { x: 0, y: 0, w: 18, h: 600 },
      { x: 942, y: 0, w: 18, h: 600 },
    ],
    bombs: [
      { x: 400, y: 532, delay: 0, label: 'B1' },
      { x: 625, y: 260, delay: 0.7, label: 'B2', floating: true },
    ],
    exit: { x: 842, y: 126, w: 54, h: 64 },
    opening: { x: 450, y: 350, w: 130, h: 22 },
  },
  {
    name: 'LEVEL 5',
    subtitle: 'SYNTHESIS I',
    hint: 'Find the line between the void and the teeth.',
    start: { x: 92, y: 514 },
    platforms: [
      { x: 0, y: 550, w: 300, h: 50 },
      { x: 370, y: 500, w: 160, h: 22 },
      { x: 600, y: 360, w: 342, h: 22 },
      { x: 300, y: 200, w: 130, h: 20 },
      { x: 0, y: 0, w: 960, h: 18 },
      { x: 0, y: 0, w: 18, h: 600 },
      { x: 942, y: 0, w: 18, h: 600 },
    ],
    bombs: [
      { x: 190, y: 532, delay: 0, label: 'B1' },
      { x: 455, y: 470, delay: 0.75, label: 'B2', floating: true },
    ],
    exit: { x: 842, y: 296, w: 54, h: 64 },
    spikes: [{ x: 300, y: 220, w: 130, h: 65 }],
    pit: { x: 300, y: 500, w: 300, h: 100 },
  },
  {
    name: 'LEVEL 6',
    subtitle: 'INTERCEPT',
    hint: 'Launch for where the platform will be. Close blast, fast exit. Wide blast, safer ride.',
    start: { x: 92, y: 514 },
    platforms: [
      { x: 0, y: 550, w: 330, h: 50 },
      { x: 840, y: 450, w: 102, h: 22 },
      { x: 0, y: 0, w: 960, h: 18 },
      { x: 0, y: 0, w: 18, h: 600 },
      { x: 942, y: 0, w: 18, h: 600 },
    ],
    bombs: [{ x: 250, y: 532, delay: -2.8, label: 'B1' }],
    exit: { x: 876, y: 386, w: 54, h: 64 },
    pit: { x: 330, y: 450, w: 510, h: 150 },
    movingPlatform: {
      fromX: 440,
      toX: 700,
      y: 450,
      w: 140,
      h: 22,
      speed: 140,
      phase: 2.14,
    },
  },
  {
    name: 'LEVEL 7',
    subtitle: 'RETURN ARC',
    hint: 'Clear the hanging teeth after B1. Return left with B2, then launch from the left side of B3.',
    start: { x: 92, y: 514 },
    platforms: [
      { x: 0, y: 550, w: 330, h: 50 },
      { x: 40, y: 140, w: 210, h: 22 },
      { x: 250, y: 300, w: 250, h: 22 },
      { x: 400, y: 470, w: 390, h: 22 },
      { x: 360, y: 70, w: 140, h: 20 },
      { x: 0, y: 0, w: 960, h: 18 },
      { x: 0, y: 0, w: 18, h: 600 },
      { x: 942, y: 0, w: 18, h: 600 },
    ],
    bombs: [
      { x: 250, y: 532, delay: -2.5, label: 'B1' },
      { x: 680, y: 452, delay: -0.2, label: 'B2' },
      { x: 400, y: 282, delay: 1.9, label: 'B3' },
    ],
    exit: { x: 120, y: 76, w: 54, h: 64 },
    spikes: [
      { x: 250, y: 322, w: 70, h: 58 },
      { x: 360, y: 90, w: 140, h: 70 },
    ],
    pit: { x: 330, y: 470, w: 630, h: 130 },
  },
  {
    name: 'LEVEL 8',
    subtitle: 'AIR SLALOM',
    hint: 'Hold right into the launch post. B1 lifts off, then flip direction on every blast: left, right, left, right.',
    start: { x: 92, y: 514 },
    platforms: [
      { x: 0, y: 550, w: 484, h: 50 },
      { x: 470, y: 508, w: 14, h: 42 },
      { x: 0, y: 0, w: 960, h: 18 },
      { x: 0, y: 0, w: 18, h: 600 },
      { x: 942, y: 0, w: 18, h: 600 },
    ],
    bombs: [
      { x: 410, y: 532, delay: -2.4, label: 'B1' },
      { x: 590, y: 452, delay: -1.9, label: 'B2', floating: true },
      { x: 445, y: 346, delay: -1.5, label: 'B3', floating: true },
      { x: 656, y: 213, delay: -1.1, label: 'B4', floating: true },
      { x: 491, y: 135, delay: -0.7, label: 'B5', floating: true },
    ],
    exit: { x: 550, y: 97, w: 86, h: 70 },
    pit: { x: 484, y: 500, w: 476, h: 100 },
    requiredCombo: 5,
  },
];

function movingPlatformAt(platform: MovingPlatform, time: number) {
  const travelTime = (platform.toX - platform.fromX) / platform.speed;
  const cycleTime = travelTime * 2;
  const cyclePosition = (time + platform.phase) % cycleTime;
  const movingRight = cyclePosition < travelTime;
  const x = movingRight
    ? platform.fromX + cyclePosition * platform.speed
    : platform.toX - (cyclePosition - travelTime) * platform.speed;

  return {
    rect: { x, y: platform.y, w: platform.w, h: platform.h },
    velocityX: movingRight ? platform.speed : -platform.speed,
  };
}

function freshBombs(level: Level): Bomb[] {
  return level.bombs.map((bomb) => ({
    ...bomb,
    timer: CONFIG.bombFuseDuration + bomb.delay,
  }));
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
}

function spikeTriangles(strip: Rect) {
  const toothCount = Math.max(1, Math.round(strip.w / 24));
  const toothWidth = strip.w / toothCount;
  return Array.from({ length: toothCount }, (_, index) => {
    const left = strip.x + toothWidth * index;
    return [
      { x: left, y: strip.y },
      { x: left + toothWidth, y: strip.y },
      { x: left + toothWidth / 2, y: strip.y + strip.h },
    ];
  });
}

function triangleOverlapsRect(triangle: Array<{ x: number; y: number }>, rect: Rect) {
  const rectPoints = [
    { x: rect.x, y: rect.y },
    { x: rect.x + rect.w, y: rect.y },
    { x: rect.x + rect.w, y: rect.y + rect.h },
    { x: rect.x, y: rect.y + rect.h },
  ];
  const axes = [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    ...triangle.map((point, index) => {
      const next = triangle[(index + 1) % triangle.length];
      return { x: -(next.y - point.y), y: next.x - point.x };
    }),
  ];

  return axes.every((axis) => {
    const triangleProjection = triangle.map((point) => point.x * axis.x + point.y * axis.y);
    const rectProjection = rectPoints.map((point) => point.x * axis.x + point.y * axis.y);
    return (
      Math.max(...triangleProjection) >= Math.min(...rectProjection) &&
      Math.max(...rectProjection) >= Math.min(...triangleProjection)
    );
  });
}

export default function BlastEscape() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysRef = useRef(new Set<string>());
  const resetRef = useRef<() => void>(() => undefined);
  const changeLevelRef = useRef<(index: number) => void>(() => undefined);
  const [status, setStatus] = useState<'playing' | 'escaped'>('playing');
  const [levelIndex, setLevelIndex] = useState(0);
  const [clearedLevels, setClearedLevels] = useState<number[]>([]);

  const selectLevel = useCallback((index: number) => changeLevelRef.current(index), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame = 0;
    let previousTime = performance.now();
    let shake = 0;
    let escapedAt = 0;
    let particles: Particle[] = [];
    let contactParticles: ContactParticle[] = [];
    let waves: Wave[] = [];
    let blastFlashes: BlastFlash[] = [];
    let landingSquash = 0;
    let comboCount = 0;
    let comboFlashCount = 0;
    let comboFlashLife = 0;
    let activeLevelIndex = 0;
    let levelElapsed = 0;
    let bombs = freshBombs(LEVELS[activeLevelIndex]);
    const player = {
      x: LEVELS[activeLevelIndex].start.x,
      y: LEVELS[activeLevelIndex].start.y,
      controlVx: 0,
      blastVx: 0,
      vy: 0,
      grounded: true,
      onMovingPlatform: false,
    };

    const horizontalVelocity = () => player.controlVx + player.blastVx;
    const reset = () => {
      const level = LEVELS[activeLevelIndex];
      Object.assign(player, {
        x: level.start.x,
        y: level.start.y,
        controlVx: 0,
        blastVx: 0,
        vy: 0,
        grounded: true,
        onMovingPlatform: false,
      });
      levelElapsed = 0;
      bombs = freshBombs(level);
      particles = [];
      contactParticles = [];
      waves = [];
      blastFlashes = [];
      landingSquash = 0;
      comboCount = 0;
      comboFlashCount = 0;
      comboFlashLife = 0;
      shake = 0;
      escapedAt = 0;
      setStatus('playing');
    };
    resetRef.current = reset;
    const goToLevel = (index: number) => {
      activeLevelIndex = Math.max(0, Math.min(LEVELS.length - 1, index));
      setLevelIndex(activeLevelIndex);
      reset();
    };
    changeLevelRef.current = goToLevel;

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (['a', 'd', 'arrowleft', 'arrowright', 'r'].includes(key)) event.preventDefault();
      if (key === 'r') reset();
      keysRef.current.add(key);
    };
    const onKeyUp = (event: KeyboardEvent) => keysRef.current.delete(event.key.toLowerCase());
    const onBlur = () => keysRef.current.clear();
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);

    const playerRect = (): Rect => ({
      x: player.x,
      y: player.y,
      w: CONFIG.playerWidth,
      h: CONFIG.playerHeight,
    });
    const overlaps = (a: Rect, b: Rect) =>
      a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    const touchesSpikes = (rect: Rect, spikes: Rect[] = []) =>
      spikes.some((strip) =>
        spikeTriangles(strip).some((triangle) => triangleOverlapsRect(triangle, rect)),
      );

    const movePlayer = (dt: number) => {
      const level = LEVELS[activeLevelIndex];
      const wasGrounded = player.grounded;
      const movingBefore = level.movingPlatform
        ? movingPlatformAt(level.movingPlatform, levelElapsed)
        : undefined;
      levelElapsed += dt;
      const movingAfter = level.movingPlatform
        ? movingPlatformAt(level.movingPlatform, levelElapsed)
        : undefined;

      if (player.grounded && player.onMovingPlatform && movingBefore && movingAfter) {
        player.x += movingAfter.rect.x - movingBefore.rect.x;
      }

      const collisionPlatforms = [
        ...level.platforms.map((rect) => ({ rect, moving: false })),
        ...(movingAfter ? [{ rect: movingAfter.rect, moving: true }] : []),
      ];
      const keys = keysRef.current;
      const direction =
        (keys.has('d') || keys.has('arrowright') ? 1 : 0) -
        (keys.has('a') || keys.has('arrowleft') ? 1 : 0);
      const acceleration = player.grounded ? CONFIG.runAcceleration : CONFIG.airAcceleration;
      if (direction !== 0) player.controlVx += direction * acceleration * dt;
      else if (player.grounded) {
        player.controlVx *= Math.pow(CONFIG.groundFriction, dt * 60);
      }
      player.controlVx = Math.max(
        -CONFIG.maxRunSpeed,
        Math.min(CONFIG.maxRunSpeed, player.controlVx),
      );
      const blastRetention = player.grounded
        ? CONFIG.blastGroundRetention
        : CONFIG.blastAirRetention;
      player.blastVx *= Math.pow(blastRetention, dt * 60);
      if (Math.abs(player.blastVx) < 0.5) player.blastVx = 0;
      player.vy = Math.min(CONFIG.maxFallSpeed, player.vy + CONFIG.gravity * dt);

      const oldX = player.x;
      const totalVx = horizontalVelocity();
      player.x += totalVx * dt;
      for (const platform of collisionPlatforms) {
        if (!overlaps(playerRect(), platform.rect)) continue;
        let collidedHorizontally = false;
        if (totalVx > 0 && oldX + CONFIG.playerWidth <= platform.rect.x + 2) {
          player.x = platform.rect.x - CONFIG.playerWidth;
          collidedHorizontally = true;
        } else if (totalVx < 0 && oldX >= platform.rect.x + platform.rect.w - 2) {
          player.x = platform.rect.x + platform.rect.w;
          collidedHorizontally = true;
        }
        if (collidedHorizontally) {
          player.controlVx = 0;
          player.blastVx = 0;
          break;
        }
      }

      const oldY = player.y;
      player.y += player.vy * dt;
      const impactVelocity = player.vy;
      player.grounded = false;
      player.onMovingPlatform = false;
      for (const platform of collisionPlatforms) {
        if (!overlaps(playerRect(), platform.rect)) continue;
        if (player.vy >= 0 && oldY + CONFIG.playerHeight <= platform.rect.y + 4) {
          player.y = platform.rect.y - CONFIG.playerHeight;
          player.vy = 0;
          player.grounded = true;
          player.onMovingPlatform = platform.moving;
        } else if (player.vy < 0 && oldY >= platform.rect.y + platform.rect.h - 4) {
          player.y = platform.rect.y + platform.rect.h;
          player.vy = 0;
        }
      }
      if (!wasGrounded && player.grounded && impactVelocity > 250) {
        landingSquash = Math.min(1, (impactVelocity - 250) / 430 + 0.32);
        const footY = player.y + CONFIG.playerHeight;
        for (let index = 0; index < 4; index += 1) {
          const direction = index < 2 ? -1 : 1;
          contactParticles.push({
            x: player.x + CONFIG.playerWidth / 2 + direction * (4 + Math.random() * 7),
            y: footY - 2,
            vx: direction * (32 + Math.random() * 64),
            vy: -(24 + Math.random() * 66),
            life: 0.18 + Math.random() * 0.12,
            size: 2 + Math.random() * 2,
            color: index === 0 || index === 3 ? '#d5c9b7' : '#8d8791',
          });
        }
      }
      if (player.grounded) comboCount = 0;
    };

    const explode = (bomb: Bomb) => {
      waves.push({ x: bomb.x, y: bomb.y, radius: 8, life: 1 });
      blastFlashes.push({ x: bomb.x, y: bomb.y, life: 1 });
      for (let i = 0; i < 18; i += 1) {
        const angle = (Math.PI * 2 * i) / 18 + Math.random() * 0.25;
        const speed = 100 + Math.random() * 270;
        particles.push({
          x: bomb.x,
          y: bomb.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0.55 + Math.random() * 0.35,
        });
      }

      const centerX = player.x + CONFIG.playerWidth / 2;
      const centerY = player.y + CONFIG.playerHeight / 2;
      const rawX = centerX - bomb.x;
      const rawY = centerY - bomb.y;
      const distance = Math.hypot(rawX, rawY);
      if (distance > CONFIG.explosionRadius) return;

      const biasedY = rawY - CONFIG.explosionVerticalBias;
      const length = Math.max(1, Math.hypot(rawX, biasedY));
      const falloff = 1 - distance / CONFIG.explosionRadius;
      const impulse = Math.min(
        CONFIG.explosionMaxImpulse,
        Math.max(
          CONFIG.explosionMinImpulse,
          CONFIG.explosionImpulse * (0.35 + falloff * 0.88),
        ),
      );
      const impulseX = (rawX / length) * impulse;
      const impulseY = (biasedY / length) * impulse;
      const continuesAirChain = !player.grounded && comboCount > 0;
      comboCount = continuesAirChain ? comboCount + 1 : 1;
      if (continuesAirChain) {
        comboFlashCount = comboCount;
        comboFlashLife = 1.5;
      }
      player.blastVx += impulseX;
      player.vy += impulseY;
      player.grounded = false;
      player.onMovingPlatform = false;
      shake = CONFIG.screenShake;
    };

    const update = (dt: number, time: number) => {
      if (escapedAt === 0) {
        const level = LEVELS[activeLevelIndex];
        for (let i = 0; i < 3; i += 1) {
          movePlayer(dt / 3);
          if (touchesSpikes(playerRect(), level.spikes)) {
            reset();
            return;
          }
        }
        for (const bomb of bombs) {
          bomb.timer -= dt;
          if (bomb.timer <= 0) {
            explode(bomb);
            bomb.timer += CONFIG.bombRepeatInterval;
          }
        }
        const exitUnlocked = !level.requiredCombo || comboCount >= level.requiredCombo;
        if (exitUnlocked && overlaps(playerRect(), level.exit)) {
          escapedAt = time;
          setStatus('escaped');
          const clearedIndex = activeLevelIndex;
          setClearedLevels((previous) =>
            previous.includes(clearedIndex) ? previous : [...previous, clearedIndex],
          );
        }
        if (player.y > CONFIG.worldHeight + 80) reset();
      } else if (
        activeLevelIndex < LEVELS.length - 1 &&
        time - escapedAt > LEVEL_ADVANCE_DELAY
      ) {
        goToLevel(activeLevelIndex + 1);
      }

      particles.forEach((particle) => {
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;
        particle.vy += 500 * dt;
        particle.life -= dt;
      });
      particles = particles.filter((particle) => particle.life > 0);
      contactParticles.forEach((particle) => {
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;
        particle.vy += 620 * dt;
        particle.life -= dt;
      });
      contactParticles = contactParticles.filter((particle) => particle.life > 0);
      waves.forEach((wave) => {
        wave.radius += 420 * dt;
        wave.life -= dt * 1.7;
      });
      waves = waves.filter((wave) => wave.life > 0);
      blastFlashes.forEach((flash) => (flash.life -= dt * 9));
      blastFlashes = blastFlashes.filter((flash) => flash.life > 0);
      comboFlashLife = Math.max(0, comboFlashLife - dt);
      landingSquash = Math.max(0, landingSquash - dt * 5.5);
      shake *= Math.pow(0.04, dt);
    };

    const draw = (time: number) => {
      const level = LEVELS[activeLevelIndex];
      const movingPlatform = level.movingPlatform
        ? movingPlatformAt(level.movingPlatform, levelElapsed)
        : undefined;
      ctx.setTransform(canvas.width / CONFIG.worldWidth, 0, 0, canvas.height / CONFIG.worldHeight, 0, 0);
      ctx.clearRect(0, 0, CONFIG.worldWidth, CONFIG.worldHeight);
      const gradient = ctx.createLinearGradient(0, 0, 0, CONFIG.worldHeight);
      gradient.addColorStop(0, VISUAL.backgroundTop);
      gradient.addColorStop(1, VISUAL.backgroundBottom);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, CONFIG.worldWidth, CONFIG.worldHeight);
      ctx.save();
      if (shake > 0.15) ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);

      // Sparse factory wall language: large plates, dead conduits and structural ribs.
      ctx.strokeStyle = 'rgba(151, 139, 164, 0.055)';
      ctx.lineWidth = 1;
      [156, 342, 566, 790].forEach((x, index) => {
        ctx.beginPath();
        ctx.moveTo(x, index % 2 === 0 ? 0 : 72);
        ctx.lineTo(x, index % 2 === 0 ? 510 : 600);
        ctx.stroke();
      });
      [122, 286, 468].forEach((y) => {
        ctx.beginPath();
        ctx.moveTo(24, y);
        ctx.lineTo(936, y);
        ctx.stroke();
      });
      ctx.fillStyle = 'rgba(11, 10, 15, 0.42)';
      [72, 474, 884].forEach((x) => ctx.fillRect(x, 0, 18, 600));
      ctx.fillStyle = 'rgba(73, 63, 80, 0.18)';
      [77, 479, 889].forEach((x) => ctx.fillRect(x, 0, 3, 600));
      ctx.strokeStyle = 'rgba(111, 101, 121, 0.09)';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(114, 0);
      ctx.lineTo(114, 198);
      ctx.lineTo(184, 198);
      ctx.lineTo(184, 384);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(822, 0);
      ctx.lineTo(822, 242);
      ctx.lineTo(760, 242);
      ctx.lineTo(760, 418);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255, 173, 55, 0.07)';
      for (let x = 238; x < 754; x += 96) ctx.fillRect(x, 116, 26, 2);

      if (level.pit) {
        const pitGradient = ctx.createLinearGradient(0, level.pit.y, 0, level.pit.y + level.pit.h);
        pitGradient.addColorStop(0, 'rgba(5, 4, 9, 0.42)');
        pitGradient.addColorStop(1, 'rgba(0, 0, 2, 0.98)');
        ctx.fillStyle = pitGradient;
        ctx.fillRect(level.pit.x, level.pit.y, level.pit.w, level.pit.h);
        ctx.fillStyle = 'rgba(255, 81, 62, 0.42)';
        for (let x = level.pit.x + 10; x < level.pit.x + level.pit.w - 6; x += 28) {
          ctx.save();
          ctx.translate(x, level.pit.y + 5);
          ctx.rotate(-0.7);
          ctx.fillRect(-2, -6, 4, 15);
          ctx.restore();
        }
        ctx.fillStyle = 'rgba(255, 173, 55, 0.15)';
        ctx.fillRect(level.pit.x, level.pit.y, level.pit.w, 2);
      }

      const track = level.movingPlatform;
      if (track) {
        const trackY = track.y + track.h / 2;
        ctx.strokeStyle = 'rgba(102, 242, 213, 0.16)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(track.fromX + track.w / 2, trackY);
        ctx.lineTo(track.toX + track.w / 2, trackY);
        ctx.stroke();
        [track.fromX, track.toX].forEach((x) => {
          ctx.fillStyle = VISUAL.structureDark;
          ctx.fillRect(x + track.w / 2 - 7, trackY - 8, 14, 16);
          ctx.fillStyle = 'rgba(102, 242, 213, 0.62)';
          ctx.fillRect(x + track.w / 2 - 2, trackY - 4, 4, 8);
        });
      }

      level.platforms.forEach((platform) => {
        const isBoundary = platform.h === CONFIG.worldHeight || platform.y === 0;
        ctx.fillStyle = isBoundary ? VISUAL.structureDark : VISUAL.structure;
        ctx.fillRect(platform.x, platform.y, platform.w, platform.h);
        if (!isBoundary) {
          ctx.fillStyle = VISUAL.structureEdge;
          ctx.fillRect(platform.x, platform.y, platform.w, 3);
          ctx.fillStyle = 'rgba(11, 10, 15, 0.38)';
          ctx.fillRect(platform.x, platform.y + Math.min(9, platform.h - 3), platform.w, 2);
          ctx.strokeStyle = VISUAL.structureSeam;
          ctx.lineWidth = 1;
          for (let seamX = platform.x + 86; seamX < platform.x + platform.w; seamX += 92) {
            ctx.beginPath();
            ctx.moveTo(seamX, platform.y + 5);
            ctx.lineTo(seamX, platform.y + platform.h - 3);
            ctx.stroke();
          }
          ctx.fillStyle = 'rgba(166, 155, 174, 0.34)';
          for (let boltX = platform.x + 15; boltX < platform.x + platform.w; boltX += 76) {
            ctx.fillRect(boltX, platform.y + 7, 2, 2);
          }
        }
      });

      if (movingPlatform) {
        const { rect, velocityX } = movingPlatform;
        ctx.fillStyle = '#252e31';
        ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
        ctx.fillStyle = VISUAL.mint;
        ctx.fillRect(rect.x + 4, rect.y, rect.w - 8, 3);
        ctx.strokeStyle = 'rgba(102, 242, 213, 0.46)';
        ctx.lineWidth = 1;
        ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
        ctx.fillStyle = '#12171a';
        ctx.fillRect(rect.x + 8, rect.y + 8, rect.w - 16, rect.h - 12);

        const direction = Math.sign(velocityX);
        ctx.strokeStyle = 'rgba(102, 242, 213, 0.68)';
        ctx.lineWidth = 1.5;
        for (let x = rect.x + 42; x <= rect.x + rect.w - 30; x += 32) {
          ctx.beginPath();
          ctx.moveTo(x - direction * 6, rect.y + 10);
          ctx.lineTo(x, rect.y + 14);
          ctx.lineTo(x - direction * 6, rect.y + 18);
          ctx.stroke();
        }
      }

      level.spikes?.forEach((strip) => {
        ctx.fillStyle = '#c52f2b';
        spikeTriangles(strip).forEach((triangle) => {
          ctx.beginPath();
          ctx.moveTo(triangle[0].x, triangle[0].y);
          ctx.lineTo(triangle[1].x, triangle[1].y);
          ctx.lineTo(triangle[2].x, triangle[2].y);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#ff6a47';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        });
        ctx.fillStyle = '#ffb05a';
        ctx.fillRect(strip.x, strip.y, strip.w, 2);
      });

      if (level.opening) {
        ctx.fillStyle = 'rgba(102, 242, 213, 0.06)';
        ctx.fillRect(level.opening.x, level.opening.y - 8, level.opening.w, level.opening.h + 16);
        ctx.strokeStyle = 'rgba(102, 242, 213, 0.22)';
        ctx.lineWidth = 1;
        ctx.strokeRect(level.opening.x, level.opening.y - 8, level.opening.w, level.opening.h + 16);
        ctx.fillStyle = 'rgba(102, 242, 213, 0.52)';
        ctx.font = '700 10px ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(
          'OPENING',
          level.opening.x + level.opening.w / 2,
          level.opening.y + 53,
        );
      }

      const exit = level.exit;
      const exitUnlocked = !level.requiredCombo || comboCount >= level.requiredCombo;
      const exitColor = exitUnlocked ? VISUAL.gold : '#77717f';
      ctx.fillStyle = exitUnlocked ? 'rgba(255,200,86,0.055)' : 'rgba(119,113,127,0.05)';
      ctx.fillRect(exit.x - 13, exit.y - 20, exit.w + 26, exit.h + 20);
      ctx.fillStyle = '#241f27';
      ctx.fillRect(exit.x - 5, exit.y - 5, exit.w + 10, exit.h + 5);
      ctx.fillStyle = '#0d0c11';
      ctx.fillRect(exit.x + 4, exit.y + 4, exit.w - 8, exit.h - 4);
      ctx.strokeStyle = exitColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(exit.x, exit.y, exit.w, exit.h);
      ctx.fillStyle = exitColor;
      ctx.fillRect(exit.x, exit.y, exit.w, 3);
      ctx.fillRect(exit.x + exit.w - 6, exit.y + 8, 2, exit.h - 16);
      ctx.beginPath();
      ctx.arc(exit.x + exit.w - 11, exit.y + exit.h / 2, 3, 0, Math.PI * 2);
      ctx.fill();
      if (exitUnlocked) {
        ctx.strokeStyle = 'rgba(255, 196, 79, 0.64)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(exit.x + 14, exit.y + exit.h / 2);
        ctx.lineTo(exit.x + exit.w - 20, exit.y + exit.h / 2);
        ctx.lineTo(exit.x + exit.w - 27, exit.y + exit.h / 2 - 6);
        ctx.moveTo(exit.x + exit.w - 20, exit.y + exit.h / 2);
        ctx.lineTo(exit.x + exit.w - 27, exit.y + exit.h / 2 + 6);
        ctx.stroke();
      }
      ctx.font = '700 10px ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(
        exitUnlocked ? 'OUTBOUND' : `${level.requiredCombo}X TO OPEN`,
        exit.x + exit.w / 2,
        exit.y - 10,
      );

      bombs.forEach((bomb) => {
        const visibleTimer = Math.max(0, bomb.timer);
        const fraction = Math.min(1, visibleTimer / CONFIG.bombFuseDuration);
        const urgency = 1 - fraction;
        const pulse = 1 + Math.sin(time / (105 - urgency * 55)) * 0.08;
        if (bomb.floating) {
          const hover = Math.sin(time / 220) * 3;
          ctx.strokeStyle = `rgba(102, 242, 213, ${0.2 + (hover + 3) * 0.025})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.ellipse(bomb.x, bomb.y + 28, 31 + hover, 8, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.strokeStyle = 'rgba(102, 242, 213, 0.18)';
          ctx.beginPath();
          ctx.ellipse(bomb.x, bomb.y + 28, 45 - hover, 12, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = 'rgba(102, 242, 213, 0.78)';
          ctx.font = '700 9px ui-monospace, monospace';
          ctx.textAlign = 'center';
          ctx.fillText('AIR RELAY', bomb.x, bomb.y + 52);
        }
        ctx.save();
        ctx.translate(bomb.x, bomb.y);
        ctx.scale(pulse, pulse);
        ctx.fillStyle = '#27222a';
        roundedRect(ctx, -15, -12, 30, 24, 5);
        ctx.fill();
        ctx.strokeStyle = '#8f838d';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#e7ded0';
        ctx.fillRect(-11, -8, 22, 3);
        ctx.fillStyle = VISUAL.hot;
        ctx.fillRect(-15, -2, 30, 7);
        ctx.fillStyle = '#4b2c2d';
        ctx.fillRect(-10, 0, 20, 3);
        ctx.fillStyle = '#171419';
        ctx.fillRect(-4, -16, 8, 5);
        ctx.fillStyle = urgency > 0.72 ? '#fff1dc' : VISUAL.amber;
        ctx.fillRect(-2, -15, 4, 3);
        ctx.restore();
        ctx.strokeStyle = VISUAL.amber;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(bomb.x, bomb.y, 21, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - fraction));
        ctx.stroke();
        ctx.fillStyle = '#f4f0e8';
        ctx.font = '700 11px ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(visibleTimer.toFixed(1), bomb.x, bomb.y - 29);
        ctx.fillStyle = 'rgba(244, 240, 232, 0.62)';
        ctx.font = '700 8px ui-monospace, monospace';
        ctx.fillText(bomb.label, bomb.x, bomb.y + 31);
      });

      blastFlashes.forEach((flash) => {
        ctx.globalAlpha = flash.life * 0.85;
        ctx.fillStyle = '#fff5dc';
        ctx.fillRect(flash.x - 18 * flash.life, flash.y - 18 * flash.life, 36 * flash.life, 36 * flash.life);
      });
      ctx.globalAlpha = 1;
      waves.forEach((wave) => {
        ctx.strokeStyle = `rgba(255,180,55,${wave.life})`;
        ctx.lineWidth = 7 * wave.life + 1;
        ctx.beginPath(); ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2); ctx.stroke();
      });
      particles.forEach((particle) => {
        ctx.globalAlpha = Math.min(1, particle.life * 2);
        ctx.fillStyle = particle.life > 0.35 ? '#ffd35d' : '#ff543d';
        ctx.fillRect(particle.x - 3, particle.y - 3, 6, 6);
      });
      contactParticles.forEach((particle) => {
        ctx.globalAlpha = Math.min(1, particle.life * 5);
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
      });
      ctx.globalAlpha = 1;


      ctx.save();
      ctx.translate(player.x + CONFIG.playerWidth / 2, player.y + CONFIG.playerHeight);
      ctx.scale(1 + landingSquash * 0.08, 1 - landingSquash * 0.12);
      ctx.translate(-CONFIG.playerWidth / 2, -CONFIG.playerHeight);
      ctx.fillStyle = VISUAL.player;
      roundedRect(ctx, 0, 0, CONFIG.playerWidth, CONFIG.playerHeight, 5);
      ctx.fill();
      ctx.fillStyle = VISUAL.playerShade;
      ctx.fillRect(3, 24, 20, 2);
      ctx.fillRect(5, 34, 6, 2);
      ctx.fillRect(15, 34, 6, 2);
      ctx.fillStyle = VISUAL.sensor;
      roundedRect(ctx, 4, 8, 18, 7, 2);
      ctx.fill();
      ctx.fillStyle = VISUAL.hot;
      ctx.fillRect(horizontalVelocity() >= 0 ? 17 : 6, 10, 3, 3);
      ctx.fillStyle = '#6c6670';
      ctx.font = '700 6px ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('U-07', 13, 31);
      ctx.restore();

      if (activeLevelIndex === 3 && comboCount === 1 && !player.grounded) {
        ctx.fillStyle = 'rgba(7, 9, 13, 0.82)';
        roundedRect(ctx, player.x - 34, player.y - 34, 94, 22, 5);
        ctx.fill();
        ctx.fillStyle = '#66f2d5';
        ctx.font = '700 10px ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('AIR CHAIN 1', player.x + CONFIG.playerWidth / 2, player.y - 19);
      }

      if (comboFlashLife > 0 && comboFlashCount >= 2) {
        const comboScale = 1 + Math.min(0.18, comboFlashLife * 0.12);
        ctx.save();
        ctx.translate(CONFIG.worldWidth / 2, 72);
        ctx.scale(comboScale, comboScale);
        ctx.fillStyle = `rgba(102, 242, 213, ${Math.min(1, comboFlashLife * 1.6)})`;
        ctx.font = '900 30px ui-sans-serif, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${comboFlashCount}X AIR COMBO`, 0, 0);
        ctx.fillStyle = `rgba(244, 240, 232, ${Math.min(0.85, comboFlashLife)})`;
        ctx.font = '700 10px ui-monospace, monospace';
        ctx.fillText('NO LANDING BETWEEN BLASTS', 0, 20);
        ctx.restore();
      }


      if (escapedAt > 0) {
        const nextLevel = LEVELS[activeLevelIndex + 1];
        ctx.fillStyle = 'rgba(4,4,8,0.64)';
        ctx.fillRect(0, 0, CONFIG.worldWidth, CONFIG.worldHeight);
        ctx.fillStyle = VISUAL.gold;
        ctx.font = '900 74px ui-sans-serif, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(nextLevel ? 'OUTBOUND' : 'ALL CLEAR', 480, 284);
        ctx.fillStyle = '#f5f2eb';
        ctx.font = '600 16px ui-monospace, monospace';
        if (nextLevel) {
          ctx.fillText(`NEXT / ${nextLevel.name} — ${nextLevel.subtitle}`, 480, 322);
          const progress = Math.min(1, (time - escapedAt) / LEVEL_ADVANCE_DELAY);
          ctx.fillStyle = 'rgba(255, 196, 79, 0.2)';
          ctx.fillRect(390, 344, 180, 4);
          ctx.fillStyle = VISUAL.gold;
          ctx.fillRect(390, 344, 180 * progress, 4);
        } else {
          ctx.fillText('EVERY DIRECTIVE COMPLETE / UNIT U-07 IS OUT', 480, 322);
        }
      }
      ctx.restore();
    };

    const frame = (time: number) => {
      const dt = Math.min(0.034, Math.max(0, (time - previousTime) / 1000));
      previousTime = time;
      update(dt, time);
      draw(time);
      animationFrame = requestAnimationFrame(frame);
    };
    animationFrame = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  return (
    <main className="game-shell">
      <section className="topbar" aria-label="Game information">
        <div>
          <p className="eyebrow">Abandoned mobility facility / line 07</p>
          <h1>Blast Escape</h1>
        </div>
        <div className="level-nav" aria-label="Select level">
          {LEVELS.map((level, index) => (
            <button
              aria-label={`${level.name}${clearedLevels.includes(index) ? ' (cleared)' : ''}`}
              className={[
                'level-button',
                levelIndex === index ? 'active' : '',
                clearedLevels.includes(index) ? 'cleared' : '',
              ].filter(Boolean).join(' ')}
              key={level.name}
              onClick={() => selectLevel(index)}
              type="button"
            >
              {index + 1}
            </button>
          ))}
        </div>
        <p className="mission"><span>Outbound directive</span> Jump module: not installed</p>
      </section>

      <section className="game-frame" aria-label="Blast Escape game">
        <canvas
          ref={canvasRef}
          width={960}
          height={600}
          aria-label={`${LEVELS[levelIndex].name}: ${LEVELS[levelIndex].subtitle}`}
        />
        <div className="corner-label">{LEVELS[levelIndex].name} / {LEVELS[levelIndex].subtitle}</div>
        {status === 'escaped' && levelIndex === LEVELS.length - 1 && (
          <button className="restart-overlay" onClick={() => selectLevel(0)} type="button">
            Run it again from Level 1
          </button>
        )}
      </section>

      <section className="controls" aria-label="Controls">
        <div className="control-group"><span className="key">A</span><span className="key">←</span><small>MOVE LEFT</small></div>
        <div className="control-group"><span className="key">D</span><span className="key">→</span><small>MOVE RIGHT</small></div>
        <div className="control-group"><span className="key">R</span><small>RESTART</small></div>
      </section>
      <p className="hint">{LEVELS[levelIndex].hint}</p>
    </main>
  );
}
