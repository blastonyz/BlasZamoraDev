'use client';

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
  return (
    <div 
      className="w-screen max-w-full py-3 overflow-x-hidden relative z-20 mt-10" 
      style={{ 
        backgroundColor: `${colors.green}0D`, 
        borderTop: `1px solid ${colors.green}33`, 
        borderBottom: `1px solid ${colors.green}33` 
      }}
    >
      <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite] space-x-12 items-center will-change-transform">
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
