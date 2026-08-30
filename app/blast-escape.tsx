'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CONFIG } from '@/game/config';
import { bombIsPowered, createGameplayState, spikeTriangles, stepGameplay } from '@/game/core';
import { LEVELS } from '@/game/levels';
import { movingPlatformAt, playerHorizontalVelocity } from '@/game/physics';
import { directionAtTime, LEVEL_8_CLEAN_ROUTE } from '@/game/replays';
import type { GameplayEvent } from '@/game/core';
import type { Direction } from '@/game/types';

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
type LaunchVector = { x: number; y: number; vx: number; vy: number; life: number; label: string };
type TrajectoryPoint = { x: number; y: number };
type TrajectoryTrace = {
  bombLabel: string;
  points: TrajectoryPoint[];
  elapsed: number;
  sampleElapsed: number;
  active: boolean;
};
// How long the clear overlay holds before the next level loads.
const LEVEL_ADVANCE_DELAY = 1600;
const MAX_RECENT_TRAJECTORIES = 5;
const MAX_TRAJECTORY_POINTS = 150;
const MAX_TRAJECTORY_DURATION = 5;
const TRAJECTORY_SAMPLE_INTERVAL = 1 / 30;
const TRAJECTORY_COLORS = ['#66f2d5', '#6eb6ff', '#ffc44f', '#ff8f70', '#c9a7ff'];

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
  cold: '#74d9ff',
  gold: '#ffc44f',
} as const;

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
  const demoRef = useRef<() => void>(() => undefined);
  const [debug, setDebug] = useState(false);
  const [status, setStatus] = useState<'playing' | 'escaped'>('playing');
  const [levelIndex, setLevelIndex] = useState(0);
  const [clearedLevels, setClearedLevels] = useState<number[]>([]);

  const selectLevel = useCallback((index: number) => changeLevelRef.current(index), []);
  const playDemo = useCallback(() => demoRef.current(), []);

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
    let contactParticles: ContactParticle[] = [];
    let waves: Wave[] = [];
    let blastFlashes: BlastFlash[] = [];
    let landingSquash = 0;
    let launchVectors: LaunchVector[] = [];
    let trajectoryTraces: TrajectoryTrace[] = [];
    let activeTrace: TrajectoryTrace | undefined;
    const initialGameplay = createGameplayState(LEVELS[0]);
    let comboCount = initialGameplay.comboCount;
    let comboFlashCount = 0;
    let comboFlashLife = 0;
    let activeLevelIndex = 0;
    let levelElapsed = initialGameplay.levelElapsed;
    let demoActive = false;
    let bombs = initialGameplay.bombs;
    let interactionStates = initialGameplay.interactionStates;
    const player = initialGameplay.player;

    const horizontalVelocity = () => playerHorizontalVelocity(player);
    const playerCenter = (): TrajectoryPoint => ({
      x: player.x + CONFIG.playerWidth / 2,
      y: player.y + CONFIG.playerHeight / 2,
    });
    const recordTracePoint = (
      trace: TrajectoryTrace,
      force = false,
      point = playerCenter(),
    ) => {
      const previous = trace.points.at(-1);
      if (force || !previous || Math.hypot(point.x - previous.x, point.y - previous.y) >= 2) {
        trace.points.push(point);
      }
    };
    const finishActiveTrace = () => {
      if (!activeTrace) return;
      activeTrace.active = false;
      activeTrace = undefined;
    };
    const startTrajectoryTrace = (bombLabel: string) => {
      if (!debugEnabled) return;
      finishActiveTrace();
      const trace: TrajectoryTrace = {
        bombLabel,
        points: [playerCenter()],
        elapsed: 0,
        sampleElapsed: 0,
        active: true,
      };
      trajectoryTraces = [
        ...trajectoryTraces.slice(-(MAX_RECENT_TRAJECTORIES - 1)),
        trace,
      ];
      activeTrace = trace;
    };
    const sampleActiveTrace = (
      dt: number,
      point = playerCenter(),
      grounded = player.grounded,
    ) => {
      if (!activeTrace) return;
      activeTrace.elapsed += dt;
      activeTrace.sampleElapsed += dt;
      if (grounded) {
        recordTracePoint(activeTrace, true, point);
        finishActiveTrace();
        return;
      }
      if (activeTrace.sampleElapsed >= TRAJECTORY_SAMPLE_INTERVAL) {
        activeTrace.sampleElapsed %= TRAJECTORY_SAMPLE_INTERVAL;
        recordTracePoint(activeTrace, false, point);
      }
      if (
        activeTrace.elapsed >= MAX_TRAJECTORY_DURATION ||
        activeTrace.points.length >= MAX_TRAJECTORY_POINTS
      ) {
        finishActiveTrace();
      }
    };

    const reset = (clearTrajectories = true) => {
      const level = LEVELS[activeLevelIndex];
      if (clearTrajectories) {
        trajectoryTraces = [];
        activeTrace = undefined;
      } else {
        finishActiveTrace();
      }
      const freshGameplay = createGameplayState(level);
      Object.assign(player, freshGameplay.player);
      levelElapsed = freshGameplay.levelElapsed;
      demoActive = false;
      bombs = freshGameplay.bombs;
      interactionStates = freshGameplay.interactionStates;
      particles = [];
      contactParticles = [];
      waves = [];
      blastFlashes = [];
      landingSquash = 0;
      launchVectors = [];
      comboCount = freshGameplay.comboCount;
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
    demoRef.current = () => {
      activeLevelIndex = LEVELS.findIndex((level) => level.id === 'level-8');
      setLevelIndex(activeLevelIndex);
      reset();
      demoActive = true;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (['a', 'd', 'arrowleft', 'arrowright', 'r', 'g'].includes(key)) event.preventDefault();
      if (key === 'r') reset();
      if (['a', 'd', 'arrowleft', 'arrowright'].includes(key)) demoActive = false;
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

    const addLandingEffects = (
      event: Extract<GameplayEvent, { type: 'landed' }>,
    ) => {
      landingSquash = Math.min(1, (event.impactVelocity - 250) / 430 + 0.32);
      for (let index = 0; index < 4; index += 1) {
        const direction = index < 2 ? -1 : 1;
        contactParticles.push({
          x: event.x + CONFIG.playerWidth / 2 + direction * (4 + Math.random() * 7),
          y: event.footY - 2,
          vx: direction * (32 + Math.random() * 64),
          vy: -(24 + Math.random() * 66),
          life: 0.18 + Math.random() * 0.12,
          size: 2 + Math.random() * 2,
          color: index === 0 || index === 3 ? '#d5c9b7' : '#8d8791',
        });
      }
    };

    const addBombEffects = (
      event: Extract<GameplayEvent, { type: 'bomb-exploded' }>,
    ) => {
      const { bomb, blast } = event;
      waves.push({ x: bomb.x, y: bomb.y, radius: 8, life: 1 });
      blastFlashes.push({ x: bomb.x, y: bomb.y, life: 1 });
      for (let index = 0; index < 18; index += 1) {
        const angle = (Math.PI * 2 * index) / 18 + Math.random() * 0.25;
        const speed = 100 + Math.random() * 270;
        particles.push({
          x: bomb.x,
          y: bomb.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0.55 + Math.random() * 0.35,
        });
      }

      if (demoActive) {
        console.info('[LEVEL8_DEMO]', bomb.label, JSON.stringify({
          time: levelElapsed.toFixed(2),
          x: blast.centerX.toFixed(1),
          y: blast.centerY.toFixed(1),
          distance: blast.distance.toFixed(1),
          controlVx: event.playerBefore.controlVx.toFixed(1),
          blastVx: event.playerBefore.blastVx.toFixed(1),
          vy: event.playerBefore.vy.toFixed(1),
          comboCount: event.comboBefore,
        }));
      }
      if (!blast.hit) return;

      if (event.continuesAirChain) {
        comboFlashCount = event.comboCount;
        comboFlashLife = 1.5;
      }
      shake = CONFIG.screenShake;
      launchVectors.push({
        x: blast.centerX,
        y: blast.centerY,
        vx: blast.impulseX,
        vy: blast.impulseY,
        life: 1.15,
        label: bomb.label,
      });
      startTrajectoryTrace(bomb.label);
    };

    const update = (dt: number, time: number) => {
      if (escapedAt === 0) {
        const level = LEVELS[activeLevelIndex];
        const keys = keysRef.current;
        const manualDirection = ((keys.has('d') || keys.has('arrowright') ? 1 : 0) -
          (keys.has('a') || keys.has('arrowleft') ? 1 : 0)) as Direction;
        const gameplay = { levelElapsed, player, bombs, comboCount, interactionStates };
        const events = stepGameplay(
          gameplay,
          level,
          demoActive
            ? (elapsed) => directionAtTime(LEVEL_8_CLEAN_ROUTE, elapsed)
            : manualDirection,
          dt,
        );
        levelElapsed = gameplay.levelElapsed;
        bombs = gameplay.bombs;
        comboCount = gameplay.comboCount;
        interactionStates = gameplay.interactionStates;

        for (const event of events) {
          if (event.type === 'moved') {
            sampleActiveTrace(event.dt, event.point, event.grounded);
          } else if (event.type === 'landed') {
            addLandingEffects(event);
          } else if (event.type === 'bomb-exploded') {
            addBombEffects(event);
          } else if (event.type === 'cleared') {
            escapedAt = time;
            finishActiveTrace();
            setStatus('escaped');
            const clearedIndex = activeLevelIndex;
            setClearedLevels((previous) =>
              previous.includes(clearedIndex) ? previous : [...previous, clearedIndex],
            );
          } else if (event.type === 'died') {
            if (demoActive && event.reason === 'fall') {
              console.info('[LEVEL8_DEMO] fell', JSON.stringify({ time: levelElapsed.toFixed(2) }));
            }
            reset(false);
            return;
          }
        }
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
      launchVectors.forEach((vector) => (vector.life -= dt));
      launchVectors = launchVectors.filter((vector) => vector.life > 0);
      comboFlashLife = Math.max(0, comboFlashLife - dt);
      landingSquash = Math.max(0, landingSquash - dt * 5.5);
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
      const stabilizerId = level.movingPlatform?.stabilizedByInteractionId;
      const movingPlatformStabilized = stabilizerId
        ? interactionStates[stabilizerId]?.active ?? false
        : false;
      const movingPlatform = level.movingPlatform
        ? movingPlatformAt(
          level.movingPlatform,
          levelElapsed,
          movingPlatformStabilized,
        )
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

      level.traversalStateSources?.forEach((source) => {
        if (
          source.grants !== 'cold' &&
          source.grants !== 'heat' &&
          source.grants !== 'magnetic'
        ) return;
        const isCold = source.grants === 'cold';
        const isHeat = source.grants === 'heat';
        const sourceColor = isCold ? VISUAL.cold : isHeat ? VISUAL.hot : VISUAL.mint;
        ctx.fillStyle = isCold ? '#172a32' : isHeat ? '#321b18' : '#17302d';
        ctx.fillRect(source.rect.x, source.rect.y, source.rect.w, source.rect.h);
        ctx.strokeStyle = sourceColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(source.rect.x, source.rect.y, source.rect.w, source.rect.h);
        ctx.fillStyle = isCold
          ? 'rgba(116, 217, 255, 0.28)'
          : isHeat
            ? 'rgba(255, 81, 62, 0.32)'
            : 'rgba(102, 242, 213, 0.3)';
        for (let x = source.rect.x + 9; x < source.rect.x + source.rect.w; x += 18) {
          ctx.fillRect(x, source.rect.y + 7, 5, source.rect.h - 14);
        }
        ctx.fillStyle = sourceColor;
        ctx.font = '700 8px ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(
          isCold ? 'COOLANT' : isHeat ? 'FURNACE' : 'INDUCTION',
          source.rect.x + source.rect.w / 2,
          source.rect.y - 7,
        );
      });

      if (debugEnabled) {
        const stateColors = {
          cold: '#74d9ff',
          heat: VISUAL.hot,
          magnetic: VISUAL.mint,
        } as const;
        level.traversalStateSources?.forEach((source) => {
          ctx.fillStyle = `${stateColors[source.grants]}24`;
          ctx.fillRect(source.rect.x, source.rect.y, source.rect.w, source.rect.h);
          ctx.strokeStyle = stateColors[source.grants];
          ctx.setLineDash([5, 4]);
          ctx.strokeRect(source.rect.x, source.rect.y, source.rect.w, source.rect.h);
          ctx.setLineDash([]);
        });
        level.traversalInteractions?.forEach((interaction) => {
          ctx.strokeStyle = 'rgba(255, 196, 79, 0.72)';
          ctx.setLineDash([3, 3]);
          ctx.strokeRect(
            interaction.rect.x,
            interaction.rect.y,
            interaction.rect.w,
            interaction.rect.h,
          );
          ctx.setLineDash([]);
        });
      }

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

      level.waterHazards?.forEach((hazard) => {
        const frozen = interactionStates[hazard.frozenByInteractionId]?.active ?? false;
        const waterGradient = ctx.createLinearGradient(0, hazard.rect.y, 0, hazard.rect.y + hazard.rect.h);
        waterGradient.addColorStop(0, frozen ? 'rgba(116, 217, 255, 0.38)' : 'rgba(42, 118, 155, 0.86)');
        waterGradient.addColorStop(1, frozen ? 'rgba(35, 80, 105, 0.82)' : 'rgba(8, 33, 50, 0.98)');
        ctx.fillStyle = waterGradient;
        ctx.fillRect(hazard.rect.x, hazard.rect.y, hazard.rect.w, hazard.rect.h);
        ctx.fillStyle = frozen ? '#d8f7ff' : 'rgba(116, 217, 255, 0.58)';
        for (let x = hazard.rect.x + 8; x < hazard.rect.x + hazard.rect.w; x += 30) {
          ctx.fillRect(x, hazard.rect.y + 3, 18, frozen ? 3 : 2);
        }
      });

      level.traversalInteractions?.forEach((interaction) => {
        if (
          interaction.kind !== 'freeze-water' ||
          !interaction.resultRect ||
          !interactionStates[interaction.id]?.active
        ) return;
        ctx.fillStyle = 'rgba(116, 217, 255, 0.82)';
        ctx.fillRect(
          interaction.resultRect.x,
          interaction.resultRect.y,
          interaction.resultRect.w,
          interaction.resultRect.h,
        );
        ctx.fillStyle = '#d8f7ff';
        ctx.fillRect(
          interaction.resultRect.x,
          interaction.resultRect.y,
          interaction.resultRect.w,
          3,
        );
        ctx.fillStyle = VISUAL.cold;
        ctx.font = '700 8px ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(
          'CONDENSATE FROZEN',
          interaction.resultRect.x + interaction.resultRect.w / 2,
          interaction.resultRect.y - 7,
        );
      });

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
        if (track.stabilizedX !== undefined) {
          ctx.strokeStyle = 'rgba(116, 217, 255, 0.58)';
          ctx.setLineDash([4, 3]);
          ctx.strokeRect(track.stabilizedX, track.y - 5, track.w, track.h + 10);
          ctx.setLineDash([]);
          ctx.fillStyle = VISUAL.cold;
          ctx.font = '700 8px ui-monospace, monospace';
          ctx.textAlign = 'center';
          ctx.fillText('COLD DOCK', track.stabilizedX + track.w / 2, track.y - 10);
        }
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

      level.meltableBarriers?.forEach((barrier) => {
        const melted = interactionStates[barrier.meltedByInteractionId]?.active ?? false;
        if (melted) {
          ctx.fillStyle = 'rgba(255, 81, 62, 0.34)';
          ctx.fillRect(barrier.rect.x - 8, barrier.rect.y + barrier.rect.h - 5, barrier.rect.w + 16, 5);
          ctx.fillStyle = VISUAL.amber;
          ctx.font = '700 8px ui-monospace, monospace';
          ctx.textAlign = 'center';
          ctx.fillText('SEAL OPEN', barrier.rect.x + barrier.rect.w / 2, barrier.rect.y - 7);
          return;
        }
        ctx.fillStyle = '#33282d';
        ctx.fillRect(barrier.rect.x, barrier.rect.y, barrier.rect.w, barrier.rect.h);
        ctx.fillStyle = '#564048';
        for (let y = barrier.rect.y + 12; y < barrier.rect.y + barrier.rect.h; y += 28) {
          ctx.fillRect(barrier.rect.x + 3, y, barrier.rect.w - 6, 3);
        }
        ctx.fillStyle = VISUAL.hot;
        ctx.fillRect(barrier.rect.x, barrier.rect.y + barrier.rect.h / 2 - 3, barrier.rect.w, 6);
        ctx.strokeStyle = '#ffb05a';
        ctx.lineWidth = 1;
        ctx.strokeRect(barrier.rect.x, barrier.rect.y, barrier.rect.w, barrier.rect.h);
        ctx.fillStyle = VISUAL.hot;
        ctx.font = '700 8px ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('THERMAL SEAL', barrier.rect.x + barrier.rect.w / 2, barrier.rect.y - 7);
      });

      level.traversalInteractions?.forEach((interaction) => {
        if (interaction.kind !== 'reactivate-charge') return;
        const active = interactionStates[interaction.id]?.active ?? false;
        ctx.fillStyle = active ? '#3b201d' : '#242126';
        ctx.fillRect(interaction.rect.x, interaction.rect.y, interaction.rect.w, interaction.rect.h);
        ctx.strokeStyle = active ? VISUAL.hot : '#756b76';
        ctx.lineWidth = 2;
        ctx.strokeRect(interaction.rect.x, interaction.rect.y, interaction.rect.w, interaction.rect.h);
        ctx.fillStyle = active ? '#ffb05a' : '#756b76';
        for (let x = interaction.rect.x + 10; x < interaction.rect.x + interaction.rect.w; x += 18) {
          ctx.fillRect(x, interaction.rect.y + 8, 5, interaction.rect.h - 16);
        }
        ctx.fillStyle = active ? VISUAL.hot : '#8f838d';
        ctx.font = '700 8px ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(
          active ? 'CHARGE ONLINE' : 'IGNITION',
          interaction.rect.x + interaction.rect.w / 2,
          interaction.rect.y - 7,
        );
      });

      level.traversalInteractions?.forEach((interaction) => {
        if (interaction.kind !== 'thaw-ice' || !interaction.deactivatesInteractionId) return;
        const spanFrozen = interactionStates[interaction.deactivatesInteractionId]?.active ?? false;
        ctx.fillStyle = '#321b18';
        ctx.fillRect(interaction.rect.x, interaction.rect.y, interaction.rect.w, interaction.rect.h);
        ctx.strokeStyle = VISUAL.hot;
        ctx.lineWidth = 2;
        ctx.strokeRect(interaction.rect.x, interaction.rect.y, interaction.rect.w, interaction.rect.h);
        ctx.fillStyle = spanFrozen ? 'rgba(255, 81, 62, 0.34)' : 'rgba(255, 176, 90, 0.5)';
        for (let x = interaction.rect.x + 10; x < interaction.rect.x + interaction.rect.w; x += 18) {
          ctx.fillRect(x, interaction.rect.y + 8, 5, interaction.rect.h - 16);
        }
        ctx.fillStyle = VISUAL.hot;
        ctx.font = '700 8px ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(
          spanFrozen ? 'THAW CONTROL' : 'SPAN OPEN',
          interaction.rect.x + interaction.rect.w / 2,
          interaction.rect.y - 7,
        );
      });

      level.traversalInteractions?.forEach((interaction) => {
        if (interaction.kind !== 'magnetic-attach' || !interaction.resultRect) return;
        const attached = player.magneticAttachment?.interactionId === interaction.id;
        const active = attached || (interactionStates[interaction.id]?.active ?? false);
        const rail = interaction.resultRect;
        ctx.fillStyle = '#20282a';
        ctx.fillRect(rail.x, rail.y, rail.w, rail.h);
        ctx.fillStyle = active ? VISUAL.mint : 'rgba(102, 242, 213, 0.3)';
        ctx.fillRect(rail.x + 4, rail.y + rail.h - 4, rail.w - 8, 3);
        ctx.strokeStyle = active ? VISUAL.mint : 'rgba(102, 242, 213, 0.42)';
        ctx.lineWidth = active ? 2 : 1;
        ctx.strokeRect(rail.x, rail.y, rail.w, rail.h);
        for (let x = rail.x + 18; x < rail.x + rail.w; x += 42) {
          ctx.fillStyle = active ? '#b8fff0' : '#4a7770';
          ctx.fillRect(x, rail.y + 4, 6, 4);
        }
        ctx.fillStyle = VISUAL.mint;
        ctx.font = '700 8px ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(
          attached ? 'MAG LOCK' : 'INDUCTION RAIL',
          rail.x + rail.w / 2,
          rail.y - 7,
        );
      });

      level.hotSurfaces?.forEach((surface) => {
        const cooled = interactionStates[surface.cooledByInteractionId]?.active ?? false;
        ctx.fillStyle = cooled ? 'rgba(116, 217, 255, 0.72)' : 'rgba(255, 81, 62, 0.86)';
        ctx.fillRect(surface.rect.x, surface.rect.y, surface.rect.w, surface.rect.h);
        ctx.fillStyle = cooled ? '#d8f7ff' : '#ffb05a';
        for (let x = surface.rect.x + 8; x < surface.rect.x + surface.rect.w; x += 22) {
          ctx.fillRect(x, surface.rect.y + 2, 10, 2);
        }
        ctx.fillStyle = cooled ? VISUAL.cold : VISUAL.hot;
        ctx.font = '700 8px ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(
          cooled ? 'PLATE COOLED' : 'OVERHEAT',
          surface.rect.x + surface.rect.w / 2,
          surface.rect.y - 7,
        );
      });

      if (movingPlatform) {
        const { rect, velocityX } = movingPlatform;
        ctx.fillStyle = '#252e31';
        ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
        ctx.fillStyle = movingPlatformStabilized ? VISUAL.cold : VISUAL.mint;
        ctx.fillRect(rect.x + 4, rect.y, rect.w - 8, 3);
        ctx.strokeStyle = movingPlatformStabilized
          ? 'rgba(116, 217, 255, 0.72)'
          : 'rgba(102, 242, 213, 0.46)';
        ctx.lineWidth = 1;
        ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
        ctx.fillStyle = '#12171a';
        ctx.fillRect(rect.x + 8, rect.y + 8, rect.w - 16, rect.h - 12);

        if (movingPlatformStabilized) {
          ctx.fillStyle = VISUAL.cold;
          ctx.font = '700 8px ui-monospace, monospace';
          ctx.textAlign = 'center';
          ctx.fillText('CARRIAGE LOCKED', rect.x + rect.w / 2, rect.y + 17);
        } else {
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
        const powered = bombIsPowered(bomb, interactionStates);
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
        ctx.fillStyle = powered ? VISUAL.hot : '#625963';
        ctx.fillRect(-15, -2, 30, 7);
        ctx.fillStyle = '#4b2c2d';
        ctx.fillRect(-10, 0, 20, 3);
        ctx.fillStyle = '#171419';
        ctx.fillRect(-4, -16, 8, 5);
        ctx.fillStyle = powered
          ? (urgency > 0.72 ? '#fff1dc' : VISUAL.amber)
          : '#77717f';
        ctx.fillRect(-2, -15, 4, 3);
        ctx.restore();
        ctx.strokeStyle = powered ? VISUAL.amber : '#625963';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(bomb.x, bomb.y, 21, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - fraction));
        ctx.stroke();
        ctx.fillStyle = '#f4f0e8';
        ctx.font = '700 11px ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(powered ? visibleTimer.toFixed(1) : '--', bomb.x, bomb.y - 29);
        if (!powered) {
          ctx.fillStyle = '#8f838d';
          ctx.font = '700 8px ui-monospace, monospace';
          ctx.fillText('DORMANT', bomb.x, bomb.y + 43);
        }
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

      if (debugEnabled) {
        trajectoryTraces.forEach((trace, index) => {
          if (trace.points.length < 2) return;
          const age = trajectoryTraces.length - 1 - index;
          ctx.globalAlpha = trace.active ? 0.9 : Math.max(0.28, 0.7 - age * 0.1);
          ctx.strokeStyle = TRAJECTORY_COLORS[index % TRAJECTORY_COLORS.length];
          ctx.lineWidth = trace.active ? 2.5 : 1.5;
          ctx.beginPath();
          trace.points.forEach((point, pointIndex) => {
            if (pointIndex === 0) ctx.moveTo(point.x, point.y);
            else ctx.lineTo(point.x, point.y);
          });
          ctx.stroke();
          const origin = trace.points[0];
          ctx.fillStyle = ctx.strokeStyle;
          ctx.beginPath();
          ctx.arc(origin.x, origin.y, trace.active ? 4 : 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.font = '700 10px ui-monospace, monospace';
          ctx.textAlign = 'left';
          ctx.fillText(trace.bombLabel, origin.x + 7, origin.y - 7);
        });
        ctx.globalAlpha = 1;
        launchVectors.forEach((vector) => {
          drawArrow(vector.x, vector.y, vector.x + vector.vx * 0.16, vector.y + vector.vy * 0.16, '#66f2d5');
          ctx.fillStyle = '#66f2d5';
          ctx.font = '700 10px ui-monospace, monospace';
          ctx.textAlign = 'left';
          ctx.fillText(vector.label, vector.x + 7, vector.y - 7);
        });
        drawArrow(
          player.x + CONFIG.playerWidth / 2,
          player.y - 5,
          player.x + CONFIG.playerWidth / 2 + horizontalVelocity() * 0.14,
          player.y - 5 + player.vy * 0.14,
          '#6eb6ff',
        );
      }

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
      if (player.traversalState.kind === 'cold') {
        ctx.strokeStyle = `rgba(116, 217, 255, ${0.55 + Math.sin(time / 120) * 0.18})`;
        ctx.lineWidth = 2;
        roundedRect(ctx, -3, -3, CONFIG.playerWidth + 6, CONFIG.playerHeight + 6, 7);
        ctx.stroke();
        ctx.fillStyle = VISUAL.cold;
        ctx.fillRect(3, 2, 3, 3);
        ctx.fillRect(20, 19, 2, 2);
      }
      if (player.traversalState.kind === 'heat') {
        ctx.strokeStyle = `rgba(255, 81, 62, ${0.58 + Math.sin(time / 95) * 0.2})`;
        ctx.lineWidth = 2;
        roundedRect(ctx, -3, -3, CONFIG.playerWidth + 6, CONFIG.playerHeight + 6, 7);
        ctx.stroke();
        ctx.fillStyle = '#ffb05a';
        ctx.fillRect(3, 19, 3, 3);
        ctx.fillRect(20, 2, 2, 2);
      }
      if (player.traversalState.kind === 'magnetic') {
        ctx.strokeStyle = `rgba(102, 242, 213, ${0.58 + Math.sin(time / 105) * 0.2})`;
        ctx.lineWidth = 2;
        roundedRect(ctx, -3, -3, CONFIG.playerWidth + 6, CONFIG.playerHeight + 6, 7);
        ctx.stroke();
        ctx.fillStyle = VISUAL.mint;
        ctx.fillRect(3, 2, 3, 3);
        ctx.fillRect(20, 19, 2, 2);
        if (player.magneticAttachment) ctx.fillRect(8, -6, 10, 3);
      }
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

      if (debugEnabled) {
        ctx.fillStyle = 'rgba(7, 9, 13, 0.82)';
        roundedRect(ctx, 30, 28, 390, 156, 8); ctx.fill();
        ctx.fillStyle = '#66f2d5';
        ctx.font = '700 12px ui-monospace, monospace';
        ctx.textAlign = 'left';
        ctx.fillText('DEBUG / G', 46, 50);
        ctx.fillStyle = '#d8d4dc';
        ctx.font = '12px ui-monospace, monospace';
        ctx.fillText(`control vx  ${player.controlVx.toFixed(1)}`, 46, 73);
        ctx.fillText(`blast vx    ${player.blastVx.toFixed(1)}`, 46, 92);
        ctx.fillText(`total vx    ${horizontalVelocity().toFixed(1)}  vy ${player.vy.toFixed(1)}`, 46, 111);
        ctx.fillText(
          `trace       ${activeTrace?.bombLabel ?? 'idle'}  recent ${trajectoryTraces.length}/${MAX_RECENT_TRAJECTORIES}`,
          46,
          130,
        );
        ctx.fillText(
          `timers      ${bombs.map((bomb) => `${bomb.label}:${bomb.timer.toFixed(1)}`).join(' ')}`,
          46,
          149,
        );
        ctx.fillText(
          `state       ${player.traversalState.kind}  ${player.traversalState.remainingSeconds.toFixed(2)}s`,
          46,
          168,
        );
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
        <button className="demo-control" onClick={playDemo} type="button">5X DEMO</button>
        <div className="control-group debug-control"><span className="key">G</span><small>{debug ? 'DEBUG ON' : 'DEBUG'}</small></div>
      </section>
      <p className="hint">{LEVELS[levelIndex].hint}</p>
    </main>
  );
}
