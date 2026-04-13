'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  zIndex: number;
  opacity: number;
  screenX: number;
  screenY: number;
};

const CARD_W = 220;
const CARD_H = 285;
const CENTER_Y = 42;
const TOP_OFFSET_PX = 100;
const BASE_SHADOW = '0 10px 24px rgba(0,0,0,0.22)';
const CENTER_SHADOW = '0 18px 34px rgba(0,0,0,0.24)';
const DEBUG_W = 1000;
const DEBUG_H = 600;
const DEBUG_CENTER_X = 500;
const DEBUG_BASE_Y = 520;

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

export function computeCardTransforms(
  index: number,
  centerIndex: number,
  R: number,
  perspective: number,
  spacing: number,
  total: number,
  centerScale = 1.08
): TransformResult {
  const safeTotal = Math.max(total, 1);
  const safeR = Math.max(R, 1);
  const safePerspective = Math.max(perspective, 1);
  const safeSpacing = Math.max(spacing, 1);

  const dynamicAngle = (Math.atan(safeSpacing / safeR) * 180) / Math.PI;
  const fallbackAngle = 360 / safeTotal;
  const angleStep = Number.isFinite(dynamicAngle) && dynamicAngle > 0 ? dynamicAngle : fallbackAngle;

  const delta = wrapDelta(index - centerIndex, safeTotal);
  const distance = Math.abs(delta);
  const angleDeg = delta * angleStep;
  const angleRad = (angleDeg * Math.PI) / 180;

  // Fan layout: X opens horizontally; Z adds depth without full cylindrical wrap.
  const translateX = Math.sin(angleRad) * safeR;
  const translateZ = Math.cos(angleRad) * safeR - safeR;
  const rotateY = -angleDeg * 0.7;

  // Screen-space projection used by debug overlay so it matches CSS perspective.
  const projectionDenominator = Math.max(1, safePerspective + translateZ);
  const projectionScale = safePerspective / projectionDenominator;
  const screenX = translateX * projectionScale;
  const screenY = 0;

  const prominence = Math.max(0, 1 - distance * 0.82);
  const scale = 1 + (centerScale - 1) * prominence;
  const opacity = Math.max(0.24, 1 - distance * 0.16 * (1200 / safePerspective));
  const zIndex = 1000 - Math.round(distance * 100);

  return { translateX, translateZ, rotateY, scale, zIndex, opacity, screenX, screenY };
}

export default function Project3DCarousel({ projects }: { projects: Project3DItem[] }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef(false);
  const dragRef = useRef(false);
  const focusRef = useRef(false);
  const autoTweenRef = useRef<gsap.core.Tween | null>(null);
  const snapTweenRef = useRef<gsap.core.Tween | null>(null);
  const positionRef = useRef({ value: 0 });
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const debugPathRef = useRef<SVGPathElement | null>(null);
  const dragStateRef = useRef({
    pointerId: -1,
    startX: 0,
    startPosition: 0,
    lastX: 0,
    lastTime: 0,
    velocityX: 0,
  });

  const [radiusBase, setRadiusBase] = useState(480);
  const [radiusFactor, setRadiusFactor] = useState(1);
  const [perspective, setPerspective] = useState(1200);
  const [spacing, setSpacing] = useState(CARD_W + 24);
  const [centerScale, setCenterScale] = useState(1.08);
  const [transitionDuration, setTransitionDuration] = useState(0.4);
  const [showDebugArc, setShowDebugArc] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const cardCount = projects.length;
  const effectiveRadius = useMemo(() => {
    return Math.max(120, Math.round(radiusBase * radiusFactor));
  }, [radiusBase, radiusFactor]);

  const angleStep = useMemo(() => {
    if (cardCount <= 0) return 0;
    const dynamic = (Math.atan(Math.max(spacing, 1) / Math.max(effectiveRadius, 1)) * 180) / Math.PI;
    const fallback = 360 / cardCount;
    return Number.isFinite(dynamic) && dynamic > 0 ? dynamic : fallback;
  }, [cardCount, spacing, effectiveRadius]);

  const getRoundedCenter = useCallback((position: number) => {
    if (cardCount <= 0) return 0;
    return ((Math.round(position) % cardCount) + cardCount) % cardCount;
  }, [cardCount]);

  const isInteracting = useCallback(() => {
    return hoverRef.current || dragRef.current || focusRef.current;
  }, []);

  const applyTransforms = useCallback(
    (centerPosition: number) => {
      if (cardCount <= 0) return;

      const roundedCenter = getRoundedCenter(centerPosition);

      cardRefs.current.forEach((cardEl, index) => {
        if (!cardEl) return;

        const transform = computeCardTransforms(
          index,
          centerPosition,
          effectiveRadius,
          perspective,
          spacing,
          cardCount,
          centerScale
        );

        gsap.set(cardEl, {
          x: transform.translateX,
          z: transform.translateZ,
          rotationY: transform.rotateY,
          scale: transform.scale,
          opacity: transform.opacity,
          force3D: true,
        });

        cardEl.style.zIndex = String(transform.zIndex);
        cardEl.style.willChange = 'transform, opacity';
        cardEl.style.boxShadow = index === roundedCenter ? CENTER_SHADOW : BASE_SHADOW;

        const prominence = centerScale > 1
          ? Math.max(0, Math.min(1, (transform.scale - 1) / (centerScale - 1)))
          : 0;
        const saturation = 0.9 + 0.22 * prominence;
        const brightness = 0.9 + 0.18 * prominence;
        const hueShift = (1 - prominence) * -8;
        cardEl.style.filter = `saturate(${saturation.toFixed(3)}) brightness(${brightness.toFixed(3)}) hue-rotate(${hueShift.toFixed(2)}deg)`;
        cardEl.style.setProperty('--spec-opacity', (0.1 + 0.32 * prominence).toFixed(3));
      });

      if (showDebugArc && debugPathRef.current) {
        const projected = Array.from({ length: cardCount }, (_, index) => {
          const t = computeCardTransforms(
            index,
            centerPosition,
            effectiveRadius,
            perspective,
            spacing,
            cardCount,
            centerScale
          );
          return {
            x: DEBUG_CENTER_X + t.screenX,
            y: DEBUG_BASE_Y + t.screenY,
          };
        }).sort((a, b) => a.x - b.x);

        const d = projected
          .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
          .join(' ');
        debugPathRef.current.setAttribute('d', d);
      }
    },
    [cardCount, centerScale, effectiveRadius, getRoundedCenter, perspective, showDebugArc, spacing]
  );

  const pauseAuto = useCallback(() => {
    autoTweenRef.current?.pause();
  }, []);

  const resumeAutoIfIdle = useCallback(() => {
    if (!isInteracting()) {
      autoTweenRef.current?.resume();
    }
  }, [isInteracting]);

  const startAuto = useCallback(() => {
    autoTweenRef.current?.kill();
    autoTweenRef.current = null;

    if (cardCount <= 1 || reducedMotion) return;

    // One logical lap per ~26s keeps the movement readable and light.
    autoTweenRef.current = gsap.to(positionRef.current, {
      value: `+=${cardCount}`,
      duration: 26,
      ease: 'none',
      repeat: -1,
      overwrite: true,
      onUpdate: () => applyTransforms(positionRef.current.value),
    });

    if (isInteracting()) {
      autoTweenRef.current.pause();
    }
  }, [applyTransforms, cardCount, isInteracting, reducedMotion]);

  const snapTo = useCallback(
    (targetIndex: number) => {
      if (cardCount <= 0) return;

      snapTweenRef.current?.kill();
      const targetPosition = nearestWrappedTarget(positionRef.current.value, targetIndex, cardCount);

      snapTweenRef.current = gsap.to(positionRef.current, {
        value: targetPosition,
        duration: reducedMotion ? 0 : transitionDuration,
        ease: reducedMotion ? 'none' : 'power3.out',
        overwrite: true,
        onUpdate: () => applyTransforms(positionRef.current.value),
        onComplete: resumeAutoIfIdle,
      });
    },
    [applyTransforms, cardCount, reducedMotion, resumeAutoIfIdle, transitionDuration]
  );

  const rotateBy = useCallback(
    (delta: number) => {
      if (cardCount <= 0) return;
      pauseAuto();
      const nextIndex = Math.round(positionRef.current.value + delta);
      snapTo(nextIndex);
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
      if (!dragRef.current || dragStateRef.current.pointerId !== event.pointerId || cardCount <= 0) {
        return;
      }

      const dragPixelsPerIndex = Math.max(80, spacing * 2);
      const deltaX = event.clientX - dragStateRef.current.startX;
      positionRef.current.value = dragStateRef.current.startPosition - deltaX / dragPixelsPerIndex;
      applyTransforms(positionRef.current.value);

      const now = performance.now();
      const dt = Math.max(1, now - dragStateRef.current.lastTime);
      dragStateRef.current.velocityX = (event.clientX - dragStateRef.current.lastX) / dt;
      dragStateRef.current.lastX = event.clientX;
      dragStateRef.current.lastTime = now;
    },
    [applyTransforms, cardCount, spacing]
  );

  const endPointerDrag = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current || dragStateRef.current.pointerId !== event.pointerId || cardCount <= 0) {
        return;
      }

      dragRef.current = false;
      event.currentTarget.releasePointerCapture(event.pointerId);

      // Fallback throw model (inertia-like): velocity in px/ms to index impulse.
      const inertiaImpulse = -dragStateRef.current.velocityX * 2.2;
      const projected = positionRef.current.value + inertiaImpulse;
      const nearestIndex = Math.round(projected);
      snapTo(nearestIndex);
    },
    [cardCount, snapTo]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        rotateBy(-1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        rotateBy(1);
      }
    },
    [rotateBy]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const queryDebug = new URLSearchParams(window.location.search).get('debugArc') === '1';
    if (queryDebug) setShowDebugArc(true);

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    positionRef.current.value = 0;
    applyTransforms(positionRef.current.value);
    startAuto();

    return () => {
      autoTweenRef.current?.kill();
      snapTweenRef.current?.kill();
      gsap.killTweensOf(positionRef.current);
    };
  }, [applyTransforms, cardCount, reducedMotion, startAuto]);

  useEffect(() => {
    applyTransforms(positionRef.current.value);
  }, [applyTransforms, effectiveRadius, perspective, spacing, centerScale]);

  const draggablePluginAvailable = useMemo(() => {
    return Boolean((gsap as unknown as { plugins?: Record<string, unknown> }).plugins?.Draggable);
  }, []);

  return (
    <div
      className="group relative w-full"
      style={{ height: 680 }}
      tabIndex={0}
      role="region"
      aria-label="Project carousel"
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
      onKeyDown={handleKeyDown}
    >
      <div className="mb-4 grid gap-2 rounded-xl border border-cyan-200/20 bg-black/20 p-3 text-xs text-cyan-100/90 md:grid-cols-3">
        <label className="flex items-center gap-2">
          <span className="w-28">R base: {radiusBase}</span>
          <input type="range" min={200} max={700} value={radiusBase} onChange={(e) => setRadiusBase(Number(e.target.value))} />
        </label>
        <label className="flex items-center gap-2">
          <span className="w-28">Radius factor: {radiusFactor.toFixed(2)}</span>
          <input type="range" min={0.5} max={3} step={0.05} value={radiusFactor} onChange={(e) => setRadiusFactor(Number(e.target.value))} />
        </label>
        <label className="flex items-center gap-2">
          <span className="w-28">Perspective: {perspective}</span>
          <input type="range" min={800} max={1800} step={20} value={perspective} onChange={(e) => setPerspective(Number(e.target.value))} />
        </label>
        <label className="flex items-center gap-2">
          <span className="w-28">Spacing px: {spacing}</span>
          <input type="range" min={20} max={140} value={spacing} onChange={(e) => setSpacing(Number(e.target.value))} />
        </label>
        <label className="flex items-center gap-2">
          <span className="w-28">Center scale: {centerScale.toFixed(2)}</span>
          <input type="range" min={1.02} max={1.2} step={0.01} value={centerScale} onChange={(e) => setCenterScale(Number(e.target.value))} />
        </label>
        <label className="flex items-center gap-2">
          <span className="w-28">Snap sec: {transitionDuration.toFixed(2)}</span>
          <input
            type="range"
            min={0.2}
            max={1}
            step={0.05}
            value={transitionDuration}
            onChange={(e) => setTransitionDuration(Number(e.target.value))}
          />
        </label>
        <label className="flex items-center gap-2 md:col-span-2">
          <input type="checkbox" checked={showDebugArc} onChange={(e) => setShowDebugArc(e.target.checked)} />
          <span>Debug arc</span>
        </label>
        <div className="text-cyan-100/70 md:text-right">
          {draggablePluginAvailable ? 'GSAP Draggable plugin detected' : 'Pointer fallback drag enabled'}
        </div>
      </div>

      <div
        ref={viewportRef}
        className="absolute inset-x-0 bottom-0 top-28 overflow-hidden"
        style={{ perspective: `${perspective}px` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endPointerDrag}
        onPointerCancel={endPointerDrag}
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
                transition: 'filter 0.35s ease, box-shadow 0.35s ease',
              }}
            >
              <BrowserCard {...project} />
              <div
                className="pointer-events-none absolute inset-0 rounded-xl"
                style={{
                  background:
                    'linear-gradient(155deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.10) 14%, rgba(255,255,255,0) 42%)',
                  opacity: 'var(--spec-opacity)',
                  transition: 'opacity 0.35s ease',
                }}
              />
            </div>
          ))}
        </div>

        {showDebugArc && (
          <svg
            className="pointer-events-none absolute inset-0"
            viewBox={`0 0 ${DEBUG_W} ${DEBUG_H}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              ref={debugPathRef}
              d=""
              fill="none"
              stroke="rgba(120,220,255,0.35)"
              strokeWidth="2"
              strokeDasharray="8 6"
            />
            <text x="20" y="30" fill="rgba(180,240,255,0.9)" fontSize="16">
              R={effectiveRadius} | perspective={perspective} | angleStep={angleStep.toFixed(2)}
            </text>
          </svg>
        )}
      </div>

      <div
        className="pointer-events-none absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 translate-y-2 items-center gap-5 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100"
      >
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
