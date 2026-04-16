'use client';

import { useState } from 'react';
import BrowserCard from '../ui/BrowserCard';
import { orbitron, gradientStyle, colors, shadows } from '../../lib/theme';
import type { Project3DItem } from '../ui/Project3DCarousel';

interface ProjectsMobileProps {
  projects: Project3DItem[];
}

export default function ProjectsMobile({ projects }: ProjectsMobileProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const next = () => {
    setActiveIndex((prev) => Math.min(prev + 1, projects.length - 1));
  };

  const prev = () => {
    setActiveIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="relative w-full">
      {/* Title */}
      <div className="text-center mb-12">
        <h2
          className={`text-4xl sm:text-5xl font-bold mb-4 ${orbitron.className}`}
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
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          Featured work and recent developments
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative h-[555px] sm:h-[600px] w-full overflow-hidden rounded-2xl">
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            perspective: '1000px',
            perspectiveOrigin: 'center 50%',
          }}
        >
          <div
            className="relative flex items-center justify-center"
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
              const yPosition = offset * -30;
              const zPosition = offset * -80;

              // Fade out gradually for deeper cards
              const opacity = isVisible ? (isActive ? 0.85 : Math.max(0.2, 0.65 - offset * 0.15)) : 0;

              return (
                <div
                  key={project.id}
                  className="absolute transition-all duration-500 ease-out rounded-2xl"
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

        {/* Navigation Buttons */}
        <div className="absolute left-1/2 flex -translate-x-1/2 gap-3 z-50" style={{ bottom: 'calc(1.5rem - 25px)' }}>
          <button
            onClick={prev}
            disabled={activeIndex === 0}
            className="h-11 w-11 rounded-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold transition-all duration-200 text-lg"
            style={{
              background: `${colors.green}1A`,
              border: `2px solid ${colors.green}`,
              color: colors.green,
              boxShadow: shadows.md,
            }}
          >
            ←
          </button>
          <button
            onClick={next}
            disabled={activeIndex === projects.length - 1}
            className="h-11 w-11 rounded-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold transition-all duration-200 text-lg"
            style={{
              background: `${colors.green}1A`,
              border: `2px solid ${colors.green}`,
              color: colors.green,
              boxShadow: shadows.md,
            }}
          >
            →
          </button>
        </div>

        {/* Indicator Dots */}
        <div className="absolute left-1/2 -translate-x-1/2 flex gap-2 z-50" style={{ top: 'calc(1.5rem - 25px)' }}>
          {projects.map((_, index) => (
            <div
              key={index}
              className={`h-2.5 rounded-full transition-all duration-300 ${
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

      {/* Mobile Footer Info */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-400">
          {activeIndex + 1} / {projects.length}
        </p>
      </div>
    </div>
  );
}
