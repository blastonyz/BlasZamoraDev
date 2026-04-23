'use client';

import { useMemo, useState } from 'react';
import { orbitron, colors } from '../../lib/theme';
import BrowserCard from './BrowserCard';
import type { Project3DItem } from './types';

export type FeaturedProject = Project3DItem & {
  accent: string;
  type: string;
  desc: string;
  tech: string[];
  live: string;
  repo: string;
};

interface FeaturedProjectsCarouselProps {
  projects: FeaturedProject[];
}

const borderBright = 'rgba(0,255,178,0.35)';
const textDim = '#5A8A7A';

export default function FeaturedProjectsCarousel({ projects }: FeaturedProjectsCarouselProps) {
  const [currentIdx, setCurrentIdx] = useState(0);

  const positioned = useMemo(() => {
    const total = projects.length;

    return projects.map((project, index) => {
      let offset = index - currentIdx;
      if (offset > total / 2) offset -= total;
      if (offset < -total / 2) offset += total;

      const absOff = Math.abs(offset);
      return {
        project,
        index,
        transform: `translateX(calc(-50% + ${offset * 260}px)) translateY(-50%) translateZ(${-absOff * 120}px) rotateY(${offset * -8}deg) scale(${absOff === 0 ? 1 : absOff === 1 ? 0.85 : 0.72})`,
        opacity: absOff === 0 ? 1 : absOff === 1 ? 0.7 : 0.4,
        zIndex: total - absOff,
      };
    });
  }, [currentIdx, projects]);

  const goTo = (index: number) => setCurrentIdx(index);
  const next = () => setCurrentIdx((prev) => (prev + 1) % projects.length);
  const prev = () => setCurrentIdx((prev) => (prev - 1 + projects.length) % projects.length);

  return (
    <section id="projects" className="px-0 py-8 md:px-0 md:py-10">
      <div className="mb-16 text-center">
        <span className="mb-3 block font-mono text-[11px] tracking-[0.35em]" style={{ color: colors.green }}>
          // 03 · FEATURED_WORK
        </span>
        <h2 className={`text-[clamp(28px,4vw,44px)] font-bold text-[#C8F0E8] ${orbitron.className}`}>
          <span style={{ color: colors.green }}>PROJECTS</span>
        </h2>
        <p className="mt-3 text-[15px]" style={{ color: textDim }}>
          Featured work and recent developments
        </p>
        <div
          className="mx-auto mt-5 h-[2px] w-20"
          style={{ background: `linear-gradient(90deg, transparent, ${colors.green}, transparent)` }}
        />
      </div>

      <div className="mb-[60px] flex items-center justify-center gap-8">
        <button
          type="button"
          onClick={prev}
          className="flex h-10 w-10 items-center justify-center border bg-transparent text-[18px] transition-colors"
          style={{ borderColor: borderBright, color: colors.green }}
        >
          ◀◀
        </button>
        <div className={`min-w-[200px] text-center text-base font-bold text-[#C8F0E8] ${orbitron.className}`}>
          {projects[currentIdx]?.title}
        </div>
        <button
          type="button"
          onClick={next}
          className="flex h-10 w-10 items-center justify-center border bg-transparent text-[18px] transition-colors"
          style={{ borderColor: borderBright, color: colors.green }}
        >
          ▶▶
        </button>
      </div>

      <div className="mb-12 flex justify-center gap-2">
        {projects.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Go to project ${index + 1}`}
            className="h-2 w-2 border transition-colors"
            style={{
              borderColor: borderBright,
              background: index === currentIdx ? colors.green : 'transparent',
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto h-[460px] max-w-[1100px]" style={{ perspective: '1200px' }}>
        <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
          {positioned.map(({ project, transform, opacity, zIndex }) => (
            <div
              key={project.id}
              className="absolute left-1/2 top-1/2 w-80 transition-all duration-500 ease-[cubic-bezier(.25,.46,.45,.94)]"
              style={{
                transform,
                opacity,
                zIndex,
              }}
            >
              <BrowserCard
                id={project.id}
                title={project.title}
                image={project.image}
                url={project.url}
                colorCard={project.colorCard}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
