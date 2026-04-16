'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import BrowserCard from './BrowserCard';
import type { Project3DItem } from './types';
import { colors, shadows, gradientStyle } from '../../lib/theme';

type VisibleSlot = {
  x: number;
  z: number;
  scale: number;
  opacity: number;
  ry: number;
  clipPath: string;
};

const CARD_W = 280;
const CARD_H = 560;
const VISIBLE_SLOTS = 7;
const HALF_VISIBLE = Math.floor(VISIBLE_SLOTS / 2);

const WORLD_X_RANGE = 560;
const WORLD_Y_SCALE = 1.5;
const CLIP_OPENNESS = 1.95;
const CLIP_OVERFLOW_Y = 48;
const CENTER_EXTRA_HEIGHT = 10;
const REF_W = 459;

const TOP_CURVE = {
  p0: { x: 0.624878, y: 24.055 },  
  p1: { x: 175.784, y: 40.312 },   
  p2: { x: 275.767, y: 40.312 },   
  p3: { x: 458.125, y: 24.055 },   
};

const BOTTOM_CURVE = {
  p0: { x: 0.624878, y: 318.945 }, 
  p1: { x: 175.784, y: 298.189 },  
  p2: { x: 275.767, y: 298.189 },  
  p3: { x: 458.125, y: 318.945 },  
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const cubicAt = (t: number, p0: number, p1: number, p2: number, p3: number) => {
  const mt = 1 - t;
  return mt * mt * mt * p0 + 3 * mt * mt * t * p1 + 3 * mt * t * t * p2 + t * t * t * p3;
};

const solveBezierTForX = (x: number, p0x: number, p1x: number, p2x: number, p3x: number) => {
  let lo = 0;
  let hi = 1;

  for (let i = 0; i < 24; i += 1) {
    const mid = (lo + hi) / 2;
    const xAtMid = cubicAt(mid, p0x, p1x, p2x, p3x);
    if (xAtMid < x) lo = mid;
    else hi = mid;
  }

  return (lo + hi) / 2;
};

const toRefX = (worldX: number) => ((worldX + WORLD_X_RANGE) / (WORLD_X_RANGE * 2)) * REF_W;

type Curve = {
  p0: { x: number; y: number };
  p1: { x: number; y: number };
  p2: { x: number; y: number };
  p3: { x: number; y: number };
};

const curveYAtRefX = (refX: number, curve: Curve) => {
  const x = clamp(refX, Math.min(curve.p0.x, curve.p3.x), Math.max(curve.p0.x, curve.p3.x));
  const t = solveBezierTForX(x, curve.p0.x, curve.p1.x, curve.p2.x, curve.p3.x);
  return cubicAt(t, curve.p0.y, curve.p1.y, curve.p2.y, curve.p3.y);
};

const topYAtWorldX = (worldX: number) => curveYAtRefX(toRefX(worldX), TOP_CURVE);
const bottomYAtWorldX = (worldX: number) => curveYAtRefX(toRefX(worldX), BOTTOM_CURVE);
const midYAtWorldX = (worldX: number) => (topYAtWorldX(worldX) + bottomYAtWorldX(worldX)) / 2;

const getSlotX = (normalized: number) => {
  const slotOffset = normalized * HALF_VISIBLE;
  return slotOffset * (CARD_W ) + Math.sign(slotOffset) * slotOffset * slotOffset * 0.5;
};

const buildClipPath = (centerX: number, cardHeight: number = CARD_H) => {
  const sampleCount = 11;
  const centerMid = midYAtWorldX(centerX);

  const toLocalY = (worldY: number) => {
    // Open the clipping window so card content reads complete while preserving curve logic.
    return clamp(
      cardHeight / 2 + (worldY - centerMid) * WORLD_Y_SCALE * CLIP_OPENNESS,
      -CLIP_OVERFLOW_Y,
      cardHeight + CLIP_OVERFLOW_Y,
    );
  };

  const topPoints = Array.from({ length: sampleCount }, (_, index) => {
    const localX = (CARD_W / (sampleCount - 1)) * index;
    const worldX = centerX + localX - CARD_W / 2;
    const yLocal = toLocalY(topYAtWorldX(worldX));
    return `${localX.toFixed(2)},${yLocal.toFixed(2)}`;
  });

  const bottomPoints = Array.from({ length: sampleCount }, (_, index) => {
    const localX = CARD_W - (CARD_W / (sampleCount - 1)) * index;
    const worldX = centerX + localX - CARD_W / 2;
    const yLocal = toLocalY(bottomYAtWorldX(worldX));
    return `${localX.toFixed(2)},${yLocal.toFixed(2)}`;
  });

  return `path('M ${topPoints.join(' L ')} L ${bottomPoints.join(' L ')} Z')`;
};

const buildVisibleSlot = (offset: number): VisibleSlot => {
  const normalized = offset / HALF_VISIBLE;
  const distance = Math.abs(normalized);
  const x = getSlotX(normalized);
  const scale = 0.78 + distance * 0.24;
  const z = -72 + distance * 96;
  const opacity = 1 - distance * 0.55;
  const ry = distance === 0 ? 0 : -Math.sign(normalized) * (8 + distance * 40);

  return {
    x,
    z,
    scale,
    opacity,
    ry,
    clipPath: buildClipPath(x),
  };
};

export default function ConcaveBezierCarousel({ projects }: { projects: Project3DItem[] }) {
  const [current, setCurrent] = useState(0);
  const [motionCurrent, setMotionCurrent] = useState(0);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    setMotionCurrent(current);
  }, [current]);

  useEffect(() => {
    return () => {
      tweenRef.current?.kill();
    };
  }, []);

  const positioned = useMemo(() => {
    const n = projects.length;
    const hiddenRange = HALF_VISIBLE + 1;

    return projects.map((project, i) => {
      let offset = i - motionCurrent;
      if (offset > n / 2) offset -= n;
      if (offset < -n / 2) offset += n;

      if (Math.abs(offset) > hiddenRange) {
        const hiddenDepth = Math.min(Math.abs(offset), hiddenRange + 2);
        const hiddenOffset = Math.sign(offset || 1) * hiddenDepth;
        const hiddenSlot = buildVisibleSlot(hiddenOffset);
        return {
          project,
          slot: {
            ...hiddenSlot,
            opacity: 0,
            z: hiddenSlot.z - 140,
          },
          offset,
          interactive: false,
        };
      }

      return {
        project,
        slot: buildVisibleSlot(offset),
        offset,
        interactive: Math.abs(offset) <= HALF_VISIBLE && !isAnimatingRef.current,
      };
    });
  }, [motionCurrent, projects]);

  const rotate = (dir: -1 | 1) => {
    if (isAnimatingRef.current || projects.length === 0) return;

    const n = projects.length;
    const from = current;
    const to = (current + dir + n) % n;
    const progress = { t: 0 };

    tweenRef.current?.kill();
    isAnimatingRef.current = true;

    tweenRef.current = gsap.to(progress, {
      t: 1,
      duration: 0.42,
      ease: 'power2.inOut',
      onUpdate: () => {
        setMotionCurrent((from + dir * progress.t + n) % n);
      },
      onComplete: () => {
        isAnimatingRef.current = false;
        setCurrent(to);
        setMotionCurrent(to);
        tweenRef.current = null;
      },
    });
  };

  return (
    <div className="relative mx-auto flex min-h-[880px] w-full flex-col items-center overflow-hidden md:h-[880px]" role="region" aria-label="Concave reference project carousel">
      <section className="z-30 flex flex-col items-center gap-y-4 pt-2">
        <div
          className="h-[182px] w-[737px] bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/scifi-label.svg')", backgroundSize: '100% 100%' }}
        >
          <div className="flex h-full w-full items-center justify-center">
            <p
              className="text-3xl font-bold tracking-wide"
              style={{
                color: '#000000',
                backgroundImage: gradientStyle,
                padding: '10px',
                display: 'inline-block',
              }}
            >
              {projects[current]?.title}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {projects.map((_, index) => (
            <div
              key={index}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === current ? 'w-7' : 'w-2.5'
              }`}
              style={
                index === current
                  ? { background: colors.green, boxShadow: shadows.md }
                  : { background: `${colors.green}40` }
              }
            />
          ))}
        </div>
      </section>

      <section className="relative z-20 flex h-[560px] w-full items-center justify-center">
        {positioned.map(({ project, slot, offset, interactive }) => {
          const isCenterCard = Math.abs(offset) < 0.5;
          const cardHeight = CARD_H + (isCenterCard ? CENTER_EXTRA_HEIGHT : 0);
          const cardClipPath = isCenterCard ? buildClipPath(slot.x, cardHeight) : slot.clipPath;
          const cardZIndex = Math.max(10, 20 - Math.min(10, Math.round(Math.abs(offset) * 3)));

          return (
            <div
              key={project.id}
              role="button"
              tabIndex={interactive ? 0 : -1}
              aria-label={`Open project ${project.title}`}
              aria-hidden={!interactive}
              onClick={() => {
                if (!interactive) return;
                if (offset < 0) rotate(-1);
                if (offset > 0) rotate(1);
              }}
              onKeyDown={(event) => {
                if (!interactive) return;
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  if (offset < 0) rotate(-1);
                  if (offset > 0) rotate(1);
                }
              }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-left"
              style={{
                opacity: slot.opacity,
                zIndex: cardZIndex,
                pointerEvents: interactive ? 'auto' : 'none',
              }}
            >
              <div
                className="relative overflow-hidden rounded-xl border border-white/10"
                style={{
                  width: CARD_W,
                  height: cardHeight,
                  transform: `perspective(980px) translate3d(${slot.x}px, 0px, ${slot.z}px) rotateY(${slot.ry}deg) scale(${slot.scale})`,
                  clipPath: cardClipPath,
                }}
              >
                <div className="relative h-full w-full">
                  <BrowserCard {...project} />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.2),transparent_44%)]" />
                  {slot.ry !== 0 && (
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          slot.ry < 0
                            ? `linear-gradient(to right, transparent 30%, rgba(0,0,0,${(Math.abs(slot.ry) / 50) * 0.55}) 100%)`
                            : `linear-gradient(to left, transparent 30%, rgba(0,0,0,${(Math.abs(slot.ry) / 50) * 0.55}) 100%)`,
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <button
          type="button"
          aria-label="Previous"
          onClick={() => rotate(-1)}
          className="absolute left-3 top-1/2 z-40 h-11 w-11 -translate-y-1/2 rounded-full text-base transition"
          style={{
            background: `${colors.green}1A`,
            border: `2px solid ${colors.green}`,
            color: colors.green,
            boxShadow: shadows.md,
          }}
        >
          {'<'}
        </button>
        <button
          type="button"
          aria-label="Next"
          onClick={() => rotate(1)}
          className="absolute right-3 top-1/2 z-40 h-11 w-11 -translate-y-1/2 rounded-full text-base transition"
          style={{
            background: `${colors.green}1A`,
            border: `2px solid ${colors.green}`,
            color: colors.green,
            boxShadow: shadows.md,
          }}
        >
          {'>'}
        </button>
      </section>

    </div>
  );
}
