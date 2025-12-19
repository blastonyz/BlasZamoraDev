'use client';

import { useState, useEffect } from 'react';
import MaskReveal from '../ui/MaskReveal';
import TechSlider from '../ui/TechSlider';
import { orbitron, colors, shadows, gradientStyle } from '../../lib/theme';

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-full h-full overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none h-min-screen">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.1] bg-grid"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-background-light dark:to-background-dark"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-secondary/10 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="scan-line"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-[85vh] flex items-center pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
          <div className="flex flex-col lg:flex-row justify-center lg:justify-between gap-8 lg:gap-16">
            {/* Left Content */}
            <div className="w-full lg:flex-1 text-center lg:text-left lg:max-w-xl lg:pt-12">

              <h1 className={`text-3xl tracking-tight font-extrabold text-gray-400 sm:text-4xl md:text-5xl lg:text-6xl mb-4 ${orbitron.className}`}>
                <span className="block">Architecting the</span>
                <span 
                  className="block text-transparent bg-clip-text neon-text glitch-effect" 
                  data-text="Digital Future"
                  style={{ backgroundImage: gradientStyle }}
                >
                  Digital Future
                </span>
              </h1>

              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 sm:mt-3 sm:text-base md:text-lg lg:mx-0 font-light border-l-2 pl-4" style={{ borderColor: colors.green }}>
                Frontend engineer specializing in high-performance interfaces and immersive web experiences. Merging clean code with futuristic design aesthetics.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <a 
                  className={`group relative px-8 py-3 text-background-dark font-bold text-lg rounded-sm overflow-hidden ${orbitron.className}`}
                  style={{ backgroundColor: colors.green, boxShadow: shadows.md }}
                  href="#projects"
                >
                  <div className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                  <span className="relative">VIEW PROTOCOLS</span>
                </a>
                <a 
                  className={`px-8 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold text-lg rounded-sm transition-all flex items-center justify-center gap-2 ${orbitron.className}`}
                  style={{ borderColor: colors.cyan }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = colors.green;
                    e.currentTarget.style.color = colors.green;
                    e.currentTarget.style.boxShadow = shadows.md;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = colors.cyan;
                    e.currentTarget.style.color = '';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  href="#contact"
                >
                  <span className="material-icons text-sm">download</span> CV_DATA
                </a>
              </div>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-3 gap-4 border-t pt-6" style={{ borderColor: `${colors.cyan}33` }}>
                <div>
                  <p className={`text-3xl font-bold text-gray-500 ${orbitron.className}`}>5+</p>
                  <p className="text-xs uppercase tracking-widest" style={{ color: colors.green }}>Years Exp</p>
                </div>
                <div>
                  <p className={`text-3xl font-bold text-gray-500 ${orbitron.className}`}>42</p>
                  <p className="text-xs uppercase tracking-widest" style={{ color: colors.mint }}>Projects</p>
                </div>
                <div>
                  <p className={`text-3xl font-bold text-gray-500 ${orbitron.className}`}>100%</p>
                  <p className="text-xs uppercase tracking-widest" style={{ color: colors.cyan }}>Uptime</p>
                </div>
              </div>
            </div>

            {/* Right Content - Image */}
            <div className="flex-shrink-0 flex justify-center lg:justify-start">
              <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] lg:w-[400px] lg:h-[400px]">
                {/* Orbital Rings 
                <div className="absolute inset-0 border rounded-full animate-[spin_10s_linear_infinite]" style={{ borderColor: `${colors.green}33` }}></div>
                <div className="absolute inset-[10%] border border-dashed rounded-full animate-[spin_15s_linear_infinite_reverse]" style={{ borderColor: `${colors.mint}4D` }}></div>
                <div className="absolute inset-[20%] border rounded-full animate-[spin_20s_linear_infinite]" style={{ borderColor: `${colors.cyan}1A` }}></div>
*/}
                {/* Main Image Container */}
                <div className="relative h-full w-full rounded-full border-4 bg-surface-dark group" style={{ borderColor: `${colors.green}4D`, boxShadow: shadows.glow }}>
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-top from-background-dark via-transparent to-transparent z-10 pointer-events-none"></div>

                  <div className="absolute inset-0 flex justify-center">
                    <MaskReveal/>
                  </div>
                  {/* Mask Overlay SVG
                  <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[60%] h-[40%] pointer-events-none z-20 mix-blend-screen opacity-90">
                    <svg 
                      className="w-full h-full drop-shadow-[0_0_10px_rgba(0,255,157,0.8)]" 
                      fill="none" 
                      viewBox="0 0 200 150" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M40 20 L60 80 L140 80 L160 20" fill="rgba(0, 255, 157, 0.1)" stroke="#00ff9d" strokeWidth="2"></path>
                      <path d="M70 90 L130 90 L100 130 Z" fill="none" stroke="#00ff9d" strokeWidth="3"></path>
                      <circle className="animate-pulse" cx="100" cy="110" r="15" stroke="#00ff9d" strokeWidth="2" fill="none"></circle>
                      <line stroke="#00b8ff" strokeWidth="2" x1="20" x2="40" y1="40" y2="80"></line>
                      <line stroke="#00b8ff" strokeWidth="2" x1="180" x2="160" y1="40" y2="80"></line>
                    </svg>
                  </div> */}
                </div>

                {/* HUD Elements */}
                <div 
                  className="absolute top-[-20px] right-[-5%] bg-surface-dark border p-3 rounded backdrop-blur-sm z-30 hidden lg:block"
                  style={{ borderColor: `${colors.green}66`, boxShadow: shadows.md }}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-sm" style={{ color: colors.green }}>wifi</span>
                    <span className={`text-xs text-gray-40 ${orbitron.className}`}>Signal: Strong</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      <TechSlider />

      <style jsx>{`
        .scan-line {
          width: 100%;
          height: 100px;
          z-index: 10;
          background: linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0, 255, 157, 0.1) 50%, rgba(0,0,0,0) 100%);
          opacity: 0.1;
          background-size: 100% 2px;
          animation: scanline 10s linear infinite;
          pointer-events: none;
          position: fixed;
          top: 0;
          left: 0;
        }

        @keyframes scanline {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .glitch-effect {
          position: relative;
        }

        .bg-grid {
          background-size: 40px 40px;
          mask-image: linear-gradient(to bottom, transparent, 10%, black, 90%, transparent);
        }

        .bg-grid-pattern {
          background-image: linear-gradient(to right, #1f2937 1px, transparent 1px), 
                            linear-gradient(to bottom, #1f2937 1px, transparent 1px);
        }
      `}</style>
    </div>
  );
}
