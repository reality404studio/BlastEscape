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
type Wave = { x: number; y: number; radius: number; life: number };
type LaunchVector = { x: number; y: number; vx: number; vy: number; life: number };
type Level = {
  name: string;
  subtitle: string;
  hint: string;
  start: { x: number; y: number };
  platforms: Rect[];
  bombs: Array<{ x: number; y: number; delay: number; label: string; floating?: boolean }>;
  exit: Rect;
  opening?: Rect;
};

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
];

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

export default function BlastEscape() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysRef = useRef(new Set<string>());
  const resetRef = useRef<() => void>(() => undefined);
  const changeLevelRef = useRef<(index: number) => void>(() => undefined);
  const [debug, setDebug] = useState(false);
  const [status, setStatus] = useState<'playing' | 'escaped'>('playing');
  const [levelIndex, setLevelIndex] = useState(0);

  const restart = useCallback(() => resetRef.current(), []);
  const selectLevel = useCallback((index: number) => changeLevelRef.current(index), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame = 0;
    let previousTime = performance.now();
    let debugEnabled = false;
    let shake = 0;
    let escapedAt = 0;
    let particles: Particle[] = [];
    let waves: Wave[] = [];
    let launchVectors: LaunchVector[] = [];
    let comboCount = 0;
    let comboFlashCount = 0;
    let comboFlashLife = 0;
    let activeLevelIndex = 0;
    let bombs = freshBombs(LEVELS[activeLevelIndex]);
    const player = {
      x: LEVELS[activeLevelIndex].start.x,
      y: LEVELS[activeLevelIndex].start.y,
      vx: 0,
      vy: 0,
      grounded: true,
    };

    const reset = () => {
      const level = LEVELS[activeLevelIndex];
      Object.assign(player, {
        x: level.start.x,
        y: level.start.y,
        vx: 0,
        vy: 0,
        grounded: true,
      });
      bombs = freshBombs(level);
      particles = [];
      waves = [];
      launchVectors = [];
      comboCount = 0;
      comboFlashCount = 0;
      comboFlashLife = 0;
      shake = 0;
      escapedAt = 0;
      setStatus('playing');
    };
    resetRef.current = reset;
    changeLevelRef.current = (index: number) => {
      activeLevelIndex = Math.max(0, Math.min(LEVELS.length - 1, index));
      setLevelIndex(activeLevelIndex);
      reset();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (['a', 'd', 'arrowleft', 'arrowright', 'r', 'g'].includes(key)) event.preventDefault();
      if (key === 'r') reset();
      if (key === 'g' && !event.repeat) {
        debugEnabled = !debugEnabled;
        setDebug(debugEnabled);
      }
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

    const movePlayer = (dt: number) => {
      const level = LEVELS[activeLevelIndex];
      const keys = keysRef.current;
      const direction =
        (keys.has('d') || keys.has('arrowright') ? 1 : 0) -
        (keys.has('a') || keys.has('arrowleft') ? 1 : 0);
      const acceleration = player.grounded ? CONFIG.runAcceleration : CONFIG.airAcceleration;
      if (direction !== 0) player.vx += direction * acceleration * dt;
      else if (player.grounded) player.vx *= Math.pow(CONFIG.groundFriction, dt * 60);
      player.vx = Math.max(-CONFIG.maxRunSpeed, Math.min(CONFIG.maxRunSpeed, player.vx));
      player.vy = Math.min(CONFIG.maxFallSpeed, player.vy + CONFIG.gravity * dt);

      const oldX = player.x;
      player.x += player.vx * dt;
      for (const platform of level.platforms) {
        if (!overlaps(playerRect(), platform)) continue;
        if (player.vx > 0 && oldX + CONFIG.playerWidth <= platform.x + 2) {
          player.x = platform.x - CONFIG.playerWidth;
        } else if (player.vx < 0 && oldX >= platform.x + platform.w - 2) {
          player.x = platform.x + platform.w;
        }
        player.vx = 0;
      }

      const oldY = player.y;
      player.y += player.vy * dt;
      player.grounded = false;
      for (const platform of level.platforms) {
        if (!overlaps(playerRect(), platform)) continue;
        if (player.vy >= 0 && oldY + CONFIG.playerHeight <= platform.y + 4) {
          player.y = platform.y - CONFIG.playerHeight;
          player.vy = 0;
          player.grounded = true;
        } else if (player.vy < 0 && oldY >= platform.y + platform.h - 4) {
          player.y = platform.y + platform.h;
          player.vy = 0;
        }
      }
      if (player.grounded) comboCount = 0;
    };

    const explode = (bomb: Bomb) => {
      waves.push({ x: bomb.x, y: bomb.y, radius: 8, life: 1 });
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
      player.vx += impulseX;
      player.vy += impulseY;
      player.grounded = false;
      shake = CONFIG.screenShake;
      launchVectors.push({ x: centerX, y: centerY, vx: impulseX, vy: impulseY, life: 1.15 });
    };

    const update = (dt: number, time: number) => {
      if (escapedAt === 0) {
        const level = LEVELS[activeLevelIndex];
        for (let i = 0; i < 3; i += 1) movePlayer(dt / 3);
        for (const bomb of bombs) {
          bomb.timer -= dt;
          if (bomb.timer <= 0) {
            explode(bomb);
            bomb.timer += CONFIG.bombRepeatInterval;
          }
        }
        if (overlaps(playerRect(), level.exit)) {
          escapedAt = time;
          setStatus('escaped');
        }
        if (player.y > CONFIG.worldHeight + 80) reset();
      }

      particles.forEach((particle) => {
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;
        particle.vy += 500 * dt;
        particle.life -= dt;
      });
      particles = particles.filter((particle) => particle.life > 0);
      waves.forEach((wave) => {
        wave.radius += 420 * dt;
        wave.life -= dt * 1.7;
      });
      waves = waves.filter((wave) => wave.life > 0);
      launchVectors.forEach((vector) => (vector.life -= dt));
      launchVectors = launchVectors.filter((vector) => vector.life > 0);
      comboFlashLife = Math.max(0, comboFlashLife - dt);
      shake *= Math.pow(0.04, dt);
    };

    const drawArrow = (
      startX: number,
      startY: number,
      endX: number,
      endY: number,
      color: string,
    ) => {
      const angle = Math.atan2(endY - startY, endX - startX);
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(endX - 9 * Math.cos(angle - 0.5), endY - 9 * Math.sin(angle - 0.5));
      ctx.lineTo(endX - 9 * Math.cos(angle + 0.5), endY - 9 * Math.sin(angle + 0.5));
      ctx.closePath();
      ctx.fill();
    };

    const draw = (time: number) => {
      const level = LEVELS[activeLevelIndex];
      ctx.setTransform(canvas.width / CONFIG.worldWidth, 0, 0, canvas.height / CONFIG.worldHeight, 0, 0);
      ctx.clearRect(0, 0, CONFIG.worldWidth, CONFIG.worldHeight);
      const gradient = ctx.createLinearGradient(0, 0, 0, CONFIG.worldHeight);
      gradient.addColorStop(0, '#17131e');
      gradient.addColorStop(1, '#08080d');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, CONFIG.worldWidth, CONFIG.worldHeight);
      ctx.save();
      if (shake > 0.15) ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);

      ctx.strokeStyle = 'rgba(255,255,255,0.035)';
      ctx.lineWidth = 1;
      for (let x = 20; x < 960; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 600); ctx.stroke();
      }
      for (let y = 30; y < 600; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(960, y); ctx.stroke();
      }

      level.platforms.forEach((platform) => {
        const isBoundary = platform.h === CONFIG.worldHeight || platform.y === 0;
        ctx.fillStyle = isBoundary ? '#24212a' : '#302d38';
        ctx.fillRect(platform.x, platform.y, platform.w, platform.h);
        if (!isBoundary) {
          ctx.fillStyle = '#706979';
          ctx.fillRect(platform.x, platform.y, platform.w, 3);
        }
      });

      if (level.opening) {
        ctx.fillStyle = 'rgba(102, 242, 213, 0.06)';
        ctx.fillRect(level.opening.x, level.opening.y - 8, level.opening.w, level.opening.h + 16);
        ctx.strokeStyle = debugEnabled ? 'rgba(102, 242, 213, 0.8)' : 'rgba(102, 242, 213, 0.22)';
        ctx.lineWidth = debugEnabled ? 2 : 1;
        ctx.setLineDash(debugEnabled ? [6, 5] : []);
        ctx.strokeRect(level.opening.x, level.opening.y - 8, level.opening.w, level.opening.h + 16);
        ctx.setLineDash([]);
        ctx.fillStyle = debugEnabled ? '#66f2d5' : 'rgba(102, 242, 213, 0.52)';
        ctx.font = '700 10px ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(
          debugEnabled ? `${level.opening.w - CONFIG.playerWidth} PX PLAYER WINDOW` : 'OPENING',
          level.opening.x + level.opening.w / 2,
          level.opening.y + 53,
        );
      }

      const exit = level.exit;
      ctx.fillStyle = 'rgba(255,200,86,0.09)';
      ctx.fillRect(exit.x - 10, exit.y - 16, exit.w + 20, exit.h + 16);
      ctx.strokeStyle = '#ffc44f';
      ctx.lineWidth = 3;
      ctx.strokeRect(exit.x, exit.y, exit.w, exit.h);
      ctx.fillStyle = '#ffc44f';
      ctx.beginPath(); ctx.arc(exit.x + exit.w - 11, exit.y + exit.h / 2, 3, 0, Math.PI * 2); ctx.fill();
      ctx.font = '700 11px ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('EXIT', exit.x + exit.w / 2, exit.y - 23);

      bombs.forEach((bomb) => {
        const visibleTimer = Math.max(0, bomb.timer);
        const fraction = Math.min(1, visibleTimer / CONFIG.bombFuseDuration);
        const urgency = 1 - fraction;
        const pulse = 1 + Math.sin(time / (105 - urgency * 55)) * 0.08;
        if (bomb.floating) {
          const hover = Math.sin(time / 220) * 3;
          ctx.strokeStyle = `rgba(102, 242, 213, ${0.28 + (hover + 3) * 0.035})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(bomb.x, bomb.y + 28, 31 + hover, 8, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.strokeStyle = 'rgba(102, 242, 213, 0.18)';
          ctx.beginPath();
          ctx.ellipse(bomb.x, bomb.y + 28, 45 - hover, 12, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = '#66f2d5';
          ctx.font = '700 10px ui-monospace, monospace';
          ctx.textAlign = 'center';
          ctx.fillText('AIR RELAY', bomb.x, bomb.y + 52);
        }
        if (debugEnabled) {
          ctx.strokeStyle = 'rgba(255,92,72,0.34)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([7, 7]);
          ctx.beginPath(); ctx.arc(bomb.x, bomb.y, CONFIG.explosionRadius, 0, Math.PI * 2); ctx.stroke();
          ctx.setLineDash([]);
          ctx.strokeStyle = 'rgba(255,255,255,0.25)';
          ctx.beginPath();
          ctx.moveTo(bomb.x, bomb.y);
          ctx.lineTo(player.x + CONFIG.playerWidth / 2, player.y + CONFIG.playerHeight / 2);
          ctx.stroke();
        }
        ctx.fillStyle = '#f4f0e8';
        ctx.beginPath(); ctx.arc(bomb.x, bomb.y, 13 * pulse, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ff503d';
        ctx.beginPath(); ctx.arc(bomb.x, bomb.y, 7 * pulse, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#ffb13b';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(bomb.x, bomb.y, 21, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - fraction));
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.font = '700 12px ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(visibleTimer.toFixed(1), bomb.x, bomb.y - 29);
      });

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
      ctx.globalAlpha = 1;

      if (debugEnabled) {
        launchVectors.forEach((vector) => {
          drawArrow(vector.x, vector.y, vector.x + vector.vx * 0.16, vector.y + vector.vy * 0.16, '#66f2d5');
        });
        drawArrow(
          player.x + CONFIG.playerWidth / 2,
          player.y - 5,
          player.x + CONFIG.playerWidth / 2 + player.vx * 0.14,
          player.y - 5 + player.vy * 0.14,
          '#6eb6ff',
        );
      }

      ctx.fillStyle = '#f3f0ea';
      roundedRect(ctx, player.x, player.y, CONFIG.playerWidth, CONFIG.playerHeight, 5);
      ctx.fill();
      ctx.fillStyle = '#ff4e3a';
      ctx.fillRect(player.x + 5, player.y + 9, 16, 5);
      ctx.fillStyle = '#16131b';
      ctx.fillRect(player.x + (player.vx >= 0 ? 17 : 6), player.y + 10, 3, 3);

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

      if (debugEnabled) {
        ctx.fillStyle = 'rgba(7, 9, 13, 0.82)';
        roundedRect(ctx, 30, 28, 276, 92, 8); ctx.fill();
        ctx.fillStyle = '#66f2d5';
        ctx.font = '700 12px ui-monospace, monospace';
        ctx.textAlign = 'left';
        ctx.fillText('DEBUG / G', 46, 50);
        ctx.fillStyle = '#d8d4dc';
        ctx.font = '12px ui-monospace, monospace';
        ctx.fillText(`velocity  x ${player.vx.toFixed(1)}  y ${player.vy.toFixed(1)}`, 46, 73);
        ctx.fillText(`timers    ${bombs.map((bomb) => bomb.timer.toFixed(1)).join(' / ')}`, 46, 94);
        ctx.fillText(`grounded  ${player.grounded ? 'yes' : 'no'}  combo ${comboCount}`, 46, 115);
      }

      if (escapedAt > 0) {
        ctx.fillStyle = 'rgba(4,4,8,0.64)';
        ctx.fillRect(0, 0, CONFIG.worldWidth, CONFIG.worldHeight);
        ctx.fillStyle = '#ffc44f';
        ctx.font = '900 74px ui-sans-serif, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('ESCAPED', 480, 284);
        ctx.fillStyle = '#f5f2eb';
        ctx.font = '600 16px ui-monospace, monospace';
        ctx.fillText('PRESS R TO RIDE AGAIN', 480, 322);
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
          <p className="eyebrow">Movement experiment / v0</p>
          <h1>Blast Escape</h1>
        </div>
        <div className="level-nav" aria-label="Select level">
          {LEVELS.map((level, index) => (
            <button
              className={levelIndex === index ? 'level-button active' : 'level-button'}
              key={level.name}
              onClick={() => selectLevel(index)}
              type="button"
            >
              {index + 1}
            </button>
          ))}
        </div>
        <p className="mission"><span>Reach the exit.</span> You cannot jump.</p>
      </section>

      <section className="game-frame" aria-label="Blast Escape game">
        <canvas
          ref={canvasRef}
          width={960}
          height={600}
          aria-label={`${LEVELS[levelIndex].name}: ${LEVELS[levelIndex].subtitle}`}
        />
        <div className="corner-label">{LEVELS[levelIndex].name} / {LEVELS[levelIndex].subtitle}</div>
        {status === 'escaped' && (
          <button
            className="restart-overlay"
            onClick={() => levelIndex === 0 ? selectLevel(1) : restart()}
            type="button"
          >
            {levelIndex === 0 ? 'Play Level 2' : 'Ride again'}
          </button>
        )}
      </section>

      <section className="controls" aria-label="Controls">
        <div className="control-group"><span className="key">A</span><span className="key">←</span><small>MOVE LEFT</small></div>
        <div className="control-group"><span className="key">D</span><span className="key">→</span><small>MOVE RIGHT</small></div>
        <div className="control-group"><span className="key">R</span><small>RESTART</small></div>
        <div className="control-group debug-control"><span className="key">G</span><small>{debug ? 'DEBUG ON' : 'DEBUG'}</small></div>
      </section>
      <p className="hint">{LEVELS[levelIndex].hint}</p>
    </main>
  );
}
