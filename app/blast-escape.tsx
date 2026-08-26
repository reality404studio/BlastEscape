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
type Bomb = { x: number; y: number; timer: number; delay: number; label: string };
type Particle = { x: number; y: number; vx: number; vy: number; life: number };
type Wave = { x: number; y: number; radius: number; life: number };
type LaunchVector = { x: number; y: number; vx: number; vy: number; life: number };

const PLATFORMS: Rect[] = [
  { x: 0, y: 550, w: 960, h: 50 },
  { x: 396, y: 402, w: 224, h: 22 },
  { x: 704, y: 238, w: 210, h: 22 },
  { x: 0, y: 0, w: 18, h: 600 },
  { x: 942, y: 0, w: 18, h: 600 },
];

const BOMB_LAYOUT = [
  { x: 304, y: 532, delay: 0, label: 'B1' },
  { x: 535, y: 384, delay: 1.7, label: 'B2' },
  { x: 754, y: 220, delay: 3.2, label: 'B3' },
];

function freshBombs(): Bomb[] {
  return BOMB_LAYOUT.map((bomb) => ({
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
  const [debug, setDebug] = useState(false);
  const [status, setStatus] = useState<'playing' | 'escaped'>('playing');

  const restart = useCallback(() => resetRef.current(), []);

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
    let bombs = freshBombs();
    const player = { x: 92, y: 514, vx: 0, vy: 0, grounded: true };

    const reset = () => {
      Object.assign(player, { x: 92, y: 514, vx: 0, vy: 0, grounded: true });
      bombs = freshBombs();
      particles = [];
      waves = [];
      launchVectors = [];
      shake = 0;
      escapedAt = 0;
      setStatus('playing');
    };
    resetRef.current = reset;

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
      for (const platform of PLATFORMS) {
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
      for (const platform of PLATFORMS) {
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
      player.vx += impulseX;
      player.vy += impulseY;
      player.grounded = false;
      shake = CONFIG.screenShake;
      launchVectors.push({ x: centerX, y: centerY, vx: impulseX, vy: impulseY, life: 1.15 });
    };

    const update = (dt: number, time: number) => {
      if (escapedAt === 0) {
        for (let i = 0; i < 3; i += 1) movePlayer(dt / 3);
        for (const bomb of bombs) {
          bomb.timer -= dt;
          if (bomb.timer <= 0) {
            explode(bomb);
            bomb.timer += CONFIG.bombRepeatInterval;
          }
        }
        if (overlaps(playerRect(), { x: 822, y: 174, w: 54, h: 64 })) {
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

      PLATFORMS.forEach((platform, index) => {
        ctx.fillStyle = index < 3 ? '#302d38' : '#24212a';
        ctx.fillRect(platform.x, platform.y, platform.w, platform.h);
        if (index < 3) {
          ctx.fillStyle = '#706979';
          ctx.fillRect(platform.x, platform.y, platform.w, 3);
        }
      });

      ctx.fillStyle = 'rgba(255,200,86,0.09)';
      ctx.fillRect(812, 158, 74, 80);
      ctx.strokeStyle = '#ffc44f';
      ctx.lineWidth = 3;
      ctx.strokeRect(822, 174, 54, 64);
      ctx.fillStyle = '#ffc44f';
      ctx.beginPath(); ctx.arc(865, 207, 3, 0, Math.PI * 2); ctx.fill();
      ctx.font = '700 11px ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('EXIT', 849, 151);

      bombs.forEach((bomb) => {
        const visibleTimer = Math.max(0, bomb.timer);
        const fraction = Math.min(1, visibleTimer / CONFIG.bombFuseDuration);
        const urgency = 1 - fraction;
        const pulse = 1 + Math.sin(time / (105 - urgency * 55)) * 0.08;
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
        ctx.fillText(`grounded  ${player.grounded ? 'yes' : 'no'}`, 46, 115);
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
        <p className="mission"><span>Reach the exit.</span> You cannot jump.</p>
      </section>

      <section className="game-frame" aria-label="Blast Escape game">
        <canvas
          ref={canvasRef}
          width={960}
          height={600}
          aria-label="A platform room with three timed bombs and an exit high above the floor"
        />
        <div className="corner-label">ROOM 01 / TEST CHAMBER</div>
        {status === 'escaped' && (
          <button className="restart-overlay" onClick={restart} type="button">Ride again</button>
        )}
      </section>

      <section className="controls" aria-label="Controls">
        <div className="control-group"><span className="key">A</span><span className="key">←</span><small>MOVE LEFT</small></div>
        <div className="control-group"><span className="key">D</span><span className="key">→</span><small>MOVE RIGHT</small></div>
        <div className="control-group"><span className="key">R</span><small>RESTART</small></div>
        <div className="control-group debug-control"><span className="key">G</span><small>{debug ? 'DEBUG ON' : 'DEBUG'}</small></div>
      </section>
      <p className="hint">Get close. Pick a side. Let the blast do the jumping.</p>
    </main>
  );
}
