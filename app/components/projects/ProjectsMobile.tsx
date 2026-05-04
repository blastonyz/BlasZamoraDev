'use client';

import { useRef, useState } from 'react';
import BrowserCard from '../ui/BrowserCard';
import { orbitron, gradientStyle, colors, shadows } from '../../lib/theme';
import type { Project3DItem } from '../ui/types';

interface ProjectsMobileProps {
  projects: Project3DItem[];
  onOpenProject: (project: Project3DItem) => void;
}

export default function ProjectsMobile({ projects, onOpenProject }: ProjectsMobileProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const pointerIdRef = useRef<number | null>(null);
  const startXRef = useRef<number | null>(null);
  const startYRef = useRef<number | null>(null);
  const lastXRef = useRef<number | null>(null);
  const lastYRef = useRef<number | null>(null);
  const hasSwipedRef = useRef(false);
  const SWIPE_THRESHOLD = 24;

  const next = () => {
    setActiveIndex((prev) => Math.min(prev + 1, projects.length - 1));
  };

  const prev = () => {
    setActiveIndex((prev) => Math.max(prev - 1, 0));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    pointerIdRef.current = e.pointerId;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    lastXRef.current = e.clientX;
    lastYRef.current = e.clientY;
    hasSwipedRef.current = false;

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== e.pointerId) return;
    if (hasSwipedRef.current || startXRef.current === null || startYRef.current === null) return;

    const deltaX = e.clientX - startXRef.current;
    const deltaY = e.clientY - startYRef.current;
    lastXRef.current = e.clientX;
    lastYRef.current = e.clientY;

    // Only trigger swipe when horizontal movement is dominant.
    if (Math.abs(deltaX) < Math.abs(deltaY)) return;

    if (deltaX <= -SWIPE_THRESHOLD) {
      hasSwipedRef.current = true;
      next();
    } else if (deltaX >= SWIPE_THRESHOLD) {
      hasSwipedRef.current = true;
      prev();
    }
  };

  const resetPointer = () => {
    pointerIdRef.current = null;
    startXRef.current = null;
    startYRef.current = null;
    lastXRef.current = null;
    lastYRef.current = null;
    hasSwipedRef.current = false;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== e.pointerId) return;

    if (!hasSwipedRef.current && startXRef.current !== null && startYRef.current !== null) {
      const endX = e.clientX ?? lastXRef.current ?? startXRef.current;
      const endY = e.clientY ?? lastYRef.current ?? startYRef.current;
      const deltaX = endX - startXRef.current;
      const deltaY = endY - startYRef.current;

      // Fallback for quick flicks where onTouchMove can be sparse.
      if (Math.abs(deltaX) >= SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0) next();
        else prev();
      }
    }

    e.currentTarget.releasePointerCapture(e.pointerId);
    resetPointer();
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current === e.pointerId) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore if pointer capture was already released by browser
      }
      resetPointer();
    }
  };

  return (
    <div className="relative w-full">
      {/* Title */}
      <div className="text-center mb-0">
        <h2
          className={`text-5xl md:text-7xl font-bold mb-6 ${orbitron.className}`}
          style={{
            backgroundImage: gradientStyle,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
          }}
        >
          PROJECTS
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Featured work and recent developments
        </p>
        <button
          type="button"
          onClick={() => onOpenProject(projects[activeIndex])}
          className={`mx-auto mt-4 text-xl tracking-[0.08em] sm:text-2xl ${orbitron.className}`}
          style={{
            backgroundImage: gradientStyle,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'block',
          }}
        >
          {projects[activeIndex]?.title} ›
        </button>

      </div>

      {/* Action Buttons */}
      <div className="mb-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => onOpenProject(projects[activeIndex])}
            className={`border px-4 py-3 text-[12px] tracking-[0.22em] text-white/85 ${orbitron.className}`}
            style={{
              borderColor: `${colors.green}66`,
              background: `${colors.green}10`,
              boxShadow: shadows.sm,
            }}
          >
            VIEW DETAILS
          </button>
          {projects[activeIndex]?.live && (
            <a
              href={projects[activeIndex].live}
              target="_blank"
              rel="noopener noreferrer"
              className={`border px-4 py-3 text-[12px] tracking-[0.22em] text-white/85 ${orbitron.className}`}
              style={{
                borderColor: `${colors.green}66`,
                background: `${colors.green}10`,
                boxShadow: shadows.sm,
              }}
            >
              LIVE ↗
            </a>
          )}
        </div>

      {/* Carousel Container */}
      <div
        className="relative h-[560px] sm:h-[640px] w-full overflow-hidden rounded-2xl mt-[30px]"
        style={{ touchAction: 'pan-y' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            perspective: '1000px',
            perspectiveOrigin: 'center 50%',
            paddingTop: '35px',
          }}
        >
          <div
            className="relative flex items-center justify-center pt-4"
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            {projects.map((project, index) => {
              const offset = index - activeIndex;
              const isActive = offset === 0;
              const isVisible = offset >= 0 && offset <= 3; // Show active + 3 behind

              // 3D positioning
              const xPosition = offset * 30;
              const yPosition = offset * -30 - 6;
              const zPosition = offset * -80;

              // Fade out gradually for deeper cards
              const opacity = isVisible ? (isActive ? 0.85 : Math.max(0.2, 0.65 - offset * 0.15)) : 0;

              return (
                <div
                  key={project.id}
                  className="absolute transition-all duration-500 ease-out rounded-2xl"
                  onClick={() => {
                    if (!isActive) setActiveIndex(index);
                  }}
                  style={{
                    width: '280px',
                    height: '440px',
                    transform: `
                      translateX(${xPosition}px)
                      translateY(${yPosition}px)
                      translateZ(${zPosition}px)
                    `,
                    opacity,
                    zIndex: isVisible ? (isActive ? 10 : 5 - offset) : 0,
                    pointerEvents: isVisible ? 'auto' : 'none',
                  }}
                >
                  <BrowserCard {...project} disableShadow />
                </div>
              );
            })}
          </div>
        </div>

        {/* Indicator Dots */}
        <div className="absolute left-1/2 -translate-x-1/2 flex gap-2 z-50" style={{ top: '0px' }}>
          {projects.map((_, index) => (
            <div
              key={index}
              className={`h-2.5 transition-all duration-300 ${
                index === activeIndex
                  ? 'w-7'
                  : 'w-2.5'
              }`}
              style={index === activeIndex
                ? { background: colors.green, boxShadow: shadows.md }
                : { background: `${colors.green}40` }
              }
            />
          ))}
        </div>
      </div>

      {/* Swipe Hint */}
      <div
        className="mt-2 flex items-center justify-center"
      >
        <div
          className="z-50 flex items-center gap-3 px-4 py-2 rounded-md"
          style={{
            border: `1px solid ${colors.green}66`,
            background: `${colors.green}14`,
            boxShadow: shadows.sm,
          }}
        >
          <span className="text-sm font-bold" style={{ color: `${colors.green}AA` }}>←</span>
          <span className={`text-[11px] tracking-wider ${orbitron.className}`} style={{ color: `${colors.green}CC` }}>
            SWIPE
          </span>
          <span className="text-sm font-bold" style={{ color: `${colors.green}AA` }}>→</span>
        </div>
      </div>

      {/* Mobile Footer Info */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-400">
          {activeIndex + 1} / {projects.length}
        </p>
      </div>
    </div>
  );
}
