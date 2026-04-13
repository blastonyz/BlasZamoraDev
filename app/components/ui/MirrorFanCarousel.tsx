'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import BrowserCard from './BrowserCard';

export type Project3DItem = {
  id: number;
  title: string;
  image: string;
  url: string;
  colorCard: [number, number, number];
};

type TransformResult = {
  translateX: number;
  translateZ: number;
  rotateY: number;
  scale: number;
  scaleY: number;
  zIndex: number;
  opacity: number;
  screenX: number;
  screenY: number;
  mirrored: boolean;
  mirrorStrength: number;
  distance: number;
  side: number;
};

const CARD_W = 220;
const CARD_H = 285;
const CENTER_Y = 42;
const TOP_OFFSET_PX = 100;

const R_BASE = 512;
const RADIUS_FACTOR = 2;
const RADIUS = R_BASE * RADIUS_FACTOR;
const PERSPECTIVE = 1120;
const SPACING_PX = CARD_W + 24;
const CENTER_SCALE = 1.08;
const SNAP_SEC = 0.2;

const DEBUG_W = 1000;
const DEBUG_H = 600;
const DEBUG_CENTER_X = 500;
const DEBUG_BASE_Y = 520;

const BASE_SHADOW = '0 12px 26px rgba(0,0,0,0.22)';
const CENTER_SHADOW = '0 20px 40px rgba(0,0,0,0.25)';

function wrapDelta(delta: number, total: number) {
  if (total <= 0) return 0;
  return ((((delta + total / 2) % total) + total) % total) - total / 2;
}

function nearestWrappedTarget(current: number, targetIndex: number, total: number) {
  if (total <= 0) return targetIndex;
  const base = ((targetIndex % total) + total) % total;
  const candidates = [base - total, base, base + total];
  return candidates.reduce((best, candidate) => {
    return Math.abs(candidate - current) < Math.abs(best - current) ? candidate : best;
  }, candidates[0]);
}

function computeCardTransforms(index: number, centerIndex: number, total: number): TransformResult {
  const safeTotal = Math.max(total, 1);
  const delta = wrapDelta(index - centerIndex, safeTotal);
  const distance = Math.abs(delta);

  const spacingDeg = (Math.atan(SPACING_PX / RADIUS) * 180) / Math.PI;
  const thetaDeg = delta * spacingDeg;
  const thetaRad = (thetaDeg * Math.PI) / 180;

  const x = Math.sin(thetaRad) * RADIUS;
  const z = Math.cos(thetaRad) * RADIUS - RADIUS;
  // Determine side from actual position to avoid wrap ambiguity (especially even card counts).
  const side = Math.abs(x) < 0.001 ? 0 : x > 0 ? 1 : -1;

  const projectionScale = PERSPECTIVE / Math.max(1, PERSPECTIVE + z);
  const screenX = x * projectionScale;
  const screenY = 0;

  const prominence = Math.max(0, 1 - distance * 0.78);
  const lateralShrink = Math.max(0.9, 1 - distance * 0.045);
  const scale = (1 + (CENTER_SCALE - 1) * prominence) * lateralShrink;
  const scaleY = 1 + Math.min(0.15, distance * 0.05);
  const rotateY = -thetaDeg * 0.72;

  const opacity = Math.max(0.7, 1 - distance * 0.1);
  const zIndex = 1000 - Math.round(distance * 100);
  // Progressive mirror: avoid abrupt flip on penultimate cards.
  // For 6 cards this starts near ~2.2 and reaches full mirror at 3.
  const mirrorStart = Math.max(2, safeTotal / 2 - 0.8);
  const mirrorFull = Math.max(mirrorStart + 0.001, safeTotal / 2);
  const mirrorStrength = Math.max(0, Math.min(1, (distance - mirrorStart) / (mirrorFull - mirrorStart)));
  const mirrored = mirrorStrength > 0.001;

  return {
    translateX: x,
    translateZ: z,
    rotateY,
    scale,
    scaleY,
    zIndex,
    opacity,
    screenX,
    screenY,
    mirrored,
    mirrorStrength,
    distance,
    side,
  };
}

export default function MirrorFanCarousel({ projects }: { projects: Project3DItem[] }) {
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const debugPathRef = useRef<SVGPathElement | null>(null);

  const hoverRef = useRef(false);
  const dragRef = useRef(false);
  const focusRef = useRef(false);

  const autoTweenRef = useRef<gsap.core.Tween | null>(null);
  const snapTweenRef = useRef<gsap.core.Tween | null>(null);
  const positionRef = useRef({ value: 0 });

  const dragStateRef = useRef({
    pointerId: -1,
    startX: 0,
    startPosition: 0,
    lastX: 0,
    lastTime: 0,
    velocityX: 0,
  });

  const cardCount = projects.length;

  const showDebugArc = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('debugArc') === '1';
  }, []);

  const isInteracting = useCallback(() => {
    return hoverRef.current || dragRef.current || focusRef.current;
  }, []);

  const getRoundedCenter = useCallback(
    (position: number) => {
      if (cardCount <= 0) return 0;
      return ((Math.round(position) % cardCount) + cardCount) % cardCount;
    },
    [cardCount]
  );

  const applyTransforms = useCallback(
    (centerPosition: number) => {
      if (cardCount <= 0) return;

      const roundedCenter = getRoundedCenter(centerPosition);

      cardRefs.current.forEach((cardEl, index) => {
        if (!cardEl) return;

        const t = computeCardTransforms(index, centerPosition, cardCount);
        const mirrorX = 1 - 2 * t.mirrorStrength;
        const rotY = t.rotateY * (1 - 0.22 * t.mirrorStrength);

        gsap.set(cardEl, {
          x: t.translateX,
          z: t.translateZ,
          rotationY: rotY,
          scaleX: t.scale * mirrorX,
          scaleY: t.scaleY,
          opacity: t.opacity,
          force3D: true,
        });

        cardEl.style.zIndex = String(t.zIndex);
        cardEl.style.willChange = 'transform, opacity, filter';
        cardEl.style.boxShadow = index === roundedCenter ? CENTER_SHADOW : BASE_SHADOW;

        const centerProminence = Math.max(0, 1 - t.distance * 0.55);
        const saturation = 0.8 + 0.25 * centerProminence;
        const brightness = 0.86 + 0.18 * centerProminence;
        cardEl.style.filter = `saturate(${saturation.toFixed(3)}) brightness(${brightness.toFixed(3)})`;

        cardEl.style.setProperty('--spec-opacity', (0.1 + 0.34 * centerProminence).toFixed(3));
        cardEl.style.setProperty('--mirror-opacity', (0.08 + 0.47 * t.mirrorStrength).toFixed(3));
      });

      if (showDebugArc && debugPathRef.current) {
        const projected = Array.from({ length: cardCount }, (_, index) => {
          const t = computeCardTransforms(index, centerPosition, cardCount);
          return {
            x: DEBUG_CENTER_X + t.screenX,
            y: DEBUG_BASE_Y + t.screenY,
          };
        }).sort((a, b) => a.x - b.x);

        const d = projected.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ');
        debugPathRef.current.setAttribute('d', d);
      }
    },
    [cardCount, getRoundedCenter, showDebugArc]
  );

  const pauseAuto = useCallback(() => {
    autoTweenRef.current?.pause();
  }, []);

  const resumeAutoIfIdle = useCallback(() => {
    if (!isInteracting()) autoTweenRef.current?.resume();
  }, [isInteracting]);

  const startAuto = useCallback(() => {
    autoTweenRef.current?.kill();
    autoTweenRef.current = null;

    if (cardCount <= 1) return;

    autoTweenRef.current = gsap.to(positionRef.current, {
      value: `+=${cardCount}`,
      duration: 28,
      ease: 'none',
      repeat: -1,
      overwrite: true,
      onUpdate: () => applyTransforms(positionRef.current.value),
    });

    if (isInteracting()) autoTweenRef.current.pause();
  }, [applyTransforms, cardCount, isInteracting]);

  const snapTo = useCallback(
    (targetIndex: number) => {
      if (cardCount <= 0) return;

      snapTweenRef.current?.kill();
      const targetPosition = nearestWrappedTarget(positionRef.current.value, targetIndex, cardCount);

      snapTweenRef.current = gsap.to(positionRef.current, {
        value: targetPosition,
        duration: SNAP_SEC,
        ease: 'power3.out',
        overwrite: true,
        onUpdate: () => applyTransforms(positionRef.current.value),
        onComplete: resumeAutoIfIdle,
      });
    },
    [applyTransforms, cardCount, resumeAutoIfIdle]
  );

  const rotateBy = useCallback(
    (delta: number) => {
      if (cardCount <= 0) return;
      pauseAuto();
      snapTo(Math.round(positionRef.current.value + delta));
    },
    [cardCount, pauseAuto, snapTo]
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (cardCount <= 0) return;
      dragRef.current = true;
      pauseAuto();
      snapTweenRef.current?.kill();

      dragStateRef.current.pointerId = event.pointerId;
      dragStateRef.current.startX = event.clientX;
      dragStateRef.current.startPosition = positionRef.current.value;
      dragStateRef.current.lastX = event.clientX;
      dragStateRef.current.lastTime = performance.now();
      dragStateRef.current.velocityX = 0;

      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [cardCount, pauseAuto]
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current || dragStateRef.current.pointerId !== event.pointerId || cardCount <= 0) return;

      const dragPixelsPerIndex = Math.max(90, SPACING_PX * 1.15);
      const deltaX = event.clientX - dragStateRef.current.startX;
      positionRef.current.value = dragStateRef.current.startPosition - deltaX / dragPixelsPerIndex;
      applyTransforms(positionRef.current.value);

      const now = performance.now();
      const dt = Math.max(1, now - dragStateRef.current.lastTime);
      dragStateRef.current.velocityX = (event.clientX - dragStateRef.current.lastX) / dt;
      dragStateRef.current.lastX = event.clientX;
      dragStateRef.current.lastTime = now;
    },
    [applyTransforms, cardCount]
  );

  const handlePointerEnd = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current || dragStateRef.current.pointerId !== event.pointerId || cardCount <= 0) return;

      dragRef.current = false;
      event.currentTarget.releasePointerCapture(event.pointerId);

      const inertiaImpulse = -dragStateRef.current.velocityX * 2.1;
      const projected = positionRef.current.value + inertiaImpulse;
      snapTo(Math.round(projected));
    },
    [cardCount, snapTo]
  );

  useEffect(() => {
    positionRef.current.value = 0;
    applyTransforms(0);
    startAuto();

    return () => {
      autoTweenRef.current?.kill();
      snapTweenRef.current?.kill();
      gsap.killTweensOf(positionRef.current);
    };
  }, [applyTransforms, cardCount, startAuto]);

  return (
    <div
      className="group relative w-full"
      style={{ height: 680 }}
      tabIndex={0}
      role="region"
      aria-label="Mirror fan project carousel"
      onPointerEnter={() => {
        hoverRef.current = true;
        pauseAuto();
      }}
      onPointerLeave={() => {
        hoverRef.current = false;
        resumeAutoIfIdle();
      }}
      onFocus={() => {
        focusRef.current = true;
        pauseAuto();
      }}
      onBlur={() => {
        focusRef.current = false;
        resumeAutoIfIdle();
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          rotateBy(-1);
        }
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          rotateBy(1);
        }
      }}
    >
      <div
        className="absolute inset-x-0 bottom-0 top-0 overflow-hidden"
        style={{ perspective: `${PERSPECTIVE}px` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
      >
        <div
          className="absolute"
          style={{
            width: CARD_W,
            height: CARD_H,
            top: `calc(${CENTER_Y}% - ${CARD_H / 2}px - ${TOP_OFFSET_PX}px)`,
            left: `calc(50% - ${CARD_W / 2}px)`,
            transformStyle: 'preserve-3d',
            transform: 'translate3d(0,0,0)',
          }}
        >
          {projects.map((project, index) => (
            <div
              key={project.id}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="absolute inset-0"
              style={{
                transform: 'translate3d(0,0,0)',
                backfaceVisibility: 'hidden',
                transition: 'filter 0.25s ease, box-shadow 0.25s ease, opacity 0.25s ease',
              }}
            >
              <BrowserCard {...project} />
              <div
                className="pointer-events-none absolute inset-0 rounded-xl"
                style={{
                  background: 'linear-gradient(155deg, rgba(255,255,255,0.26) 0%, rgba(255,255,255,0.1) 16%, rgba(255,255,255,0) 44%)',
                  opacity: 'var(--spec-opacity)',
                  transition: 'opacity 0.25s ease',
                }}
              />
              <div
                className="pointer-events-none absolute inset-0 rounded-xl"
                style={{
                  background: 'linear-gradient(205deg, rgba(190,238,255,0.25) 0%, rgba(190,238,255,0.02) 40%, rgba(0,0,0,0) 100%)',
                  mixBlendMode: 'screen',
                  opacity: 'var(--mirror-opacity)',
                  filter: 'blur(1.4px)',
                  transition: 'opacity 0.25s ease',
                }}
              />
            </div>
          ))}
        </div>

        {showDebugArc && (
          <svg className="pointer-events-none absolute inset-0" viewBox={`0 0 ${DEBUG_W} ${DEBUG_H}`} preserveAspectRatio="none" aria-hidden="true">
            <path ref={debugPathRef} d="" fill="none" stroke="rgba(120,220,255,0.35)" strokeWidth="2" strokeDasharray="8 6" />
            <text x="20" y="30" fill="rgba(180,240,255,0.9)" fontSize="16">
              R={RADIUS} | perspective={PERSPECTIVE} | spacingPx={SPACING_PX}
            </text>
          </svg>
        )}
      </div>

      <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 translate-y-2 items-center gap-5 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
        <button
          onClick={() => rotateBy(-1)}
          className="rounded-full px-6 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:scale-105 active:scale-95"
          style={{
            border: '1px solid rgba(142,249,252,0.35)',
            background: 'rgba(142,249,252,0.07)',
          }}
        >
          ←
        </button>
        <button
          onClick={() => rotateBy(1)}
          className="rounded-full px-6 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:scale-105 active:scale-95"
          style={{
            border: '1px solid rgba(142,249,252,0.35)',
            background: 'rgba(142,249,252,0.07)',
          }}
        >
          →
        </button>
      </div>
    </div>
  );
}
