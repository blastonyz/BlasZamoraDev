'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { orbitron, colors } from '../../lib/theme';

const technologies = [
  'REACT',
  'TYPESCRIPT',
  'TAILWIND',
  'NODE.JS',
  'WEBGL',
  'THREE.JS',
  'NEXT.JS',
  'GRAPHQL',
];

const techColors = [colors.green, colors.mint, colors.cyan];

export default function TechSlider() {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sliderRef.current) return;

    gsap.to(sliderRef.current, {
      xPercent: -50,
      duration: 20,
      ease: 'none',
      repeat: -1,
    });
  }, []);

  return (
    <div 
      className="w-screen max-w-full py-3 overflow-x-hidden relative z-50 m-3 sm:m-0" 
      style={{ 
        backgroundColor: `${colors.green}0D`, 
        borderTop: `1px solid ${colors.green}33`, 
        borderBottom: `1px solid ${colors.green}33` 
      }}
    >
      <div ref={sliderRef} className="flex whitespace-nowrap space-x-12 items-center will-change-transform">
        {[...Array(2)].map((_, arrayIndex) => (
          <div key={arrayIndex} className="flex space-x-12">
            {technologies.map((tech, techIndex) => (
              <span 
                key={`${arrayIndex}-${tech}`}
                className={`text-gray-400 font-bold text-xl flex items-center gap-2 ${orbitron.className}`}
              >
                <span style={{ color: techColors[techIndex % techColors.length] }}>•</span> {tech}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
