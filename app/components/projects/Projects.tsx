'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { orbitron, gradientStyle } from '../../lib/theme';
import ConcaveBezierCarousel, { type Project3DItem } from '../ui/ConcaveBezierCarousel';

// ─── Project data ──────────────────────────────────────────────────────────

const PROJECTS: Project3DItem[] = [
  { id: 0, title: 'DeFiar',      image: '/defiar.png',     url: 'defiar.xyz',       colorCard: [142, 249, 252] },
  { id: 1, title: 'Greenhouse',  image: '/greenhouse.png', url: 'greenhouse.app',   colorCard: [142, 252, 157] },
  { id: 2, title: 'MultiDAO',    image: '/multidao.png',   url: 'multidao.io',      colorCard: [142, 202, 252] },
  { id: 3, title: 'Road to Pro', image: '/roadtopro.png',  url: 'roadtopro.dev',    colorCard: [215, 252, 142] },
  { id: 4, title: 'Sanar',   image: '/sanar.png',      url: 'sanar.ong',        colorCard: [142, 252, 204] },
  { id: 5, title: 'TuAgro',      image: '/tuagro.png',     url: 'tuagro.com.ar',    colorCard: [252, 208, 142] },
];

// ─── Main ──────────────────────────────────────────────────────────────────

interface ProjectsProps {
  contentRef: React.RefObject<HTMLDivElement | null>;
}

export default function Projects({ contentRef }: ProjectsProps) {
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="projects-container relative w-full h-screen">
      <section className="relative z-10 min-h-screen flex items-start justify-center pt-8 md:pt-12">
        <div ref={contentRef} className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 w-full">

          {/* Title */}
          <div ref={titleRef} className="text-center mb-10">
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
          </div>

          {/* Concave reference carousel */}
          <ConcaveBezierCarousel projects={PROJECTS} />

        </div>
      </section>
    </div>
  );
}
