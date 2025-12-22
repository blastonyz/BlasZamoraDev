'use client';

import { useState, useEffect, useRef } from 'react';
import MaskReveal from '../ui/MaskReveal';
import TechSlider from '../ui/TechSlider';
import { orbitron, colors, shadows, gradientStyle } from '../../lib/theme';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

export default function Hero() {
  const [mounted, setMounted] = useState(false);

    const titleRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    setMounted(true);

    const split = new SplitText(".title", { type: "chars" });
    gsap.from(split.chars, {
      opacity: 0,
      x: 50,
      stagger: 0.1,
      duration: 0.6,
      ease: "back"
    });

     gsap.from(titleRef.current, {
          opacity:0,
          x:-100,
          duration: 1.5,
          ease: 'easeOut',
        });
  }, []);


  return (
    <div className="hero-container relative w-full">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.1] bg-grid"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-background-light dark:to-background-dark"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-secondary/10 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="scan-line"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-[85vh] flex flex-col items-center">
        <div className="max-w-7xl mx-auto px-4 mt-16 w-full sm:px-6 md:mt-16 flex-1 flex items-center">
          <div className="flex flex-col lg:flex-row justify-center lg:justify-between gap-6 lg:gap-16 w-full">
            {/* Left Content */}
            <div className="w-full lg:flex-1 text-center lg:text-left lg:max-w-xl lg:pt-12 order-2 lg:order-1">

              <h1 className={`text-3xl tracking-tight font-extrabold text-gray-400 sm:text-4xl md:text-5xl lg:text-6xl mb-4 ${orbitron.className} title`}>
                <span className="block">Architecting the</span>
               
              </h1>

              <h1 ref={titleRef} className={`text-3xl tracking-tight font-extrabold text-gray-400 sm:text-4xl md:text-5xl lg:text-6xl mb-4 ${orbitron.className}`}>
                 <span 
                  className="block neon-text glitch-effect" 
                  data-text="Digital Future"
                  style={{ 
                    backgroundImage: gradientStyle,
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    color: 'transparent'
                  }}
                >
                  Digital Future
                </span>
              </h1>

              <p className="mt-2 text-sm text-gray-700 font-bold max-w-xl mx-auto dark:text-gray-400 sm:mt-3 sm:text-base md:text-lg lg:mx-0 font-light border-l-2 pl-4" style={{ borderColor: colors.green }}>
                Frontend engineer specializing in high-performance interfaces and immersive web experiences. Merging clean code with futuristic design aesthetics.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <a 
                  className={`group relative px-8 py-3 text-background-dark font-bold text-lg rounded-sm overflow-hidden ${orbitron.className}`}
                  style={{ background: gradientStyle, boxShadow: shadows.md }}
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
              <div className="grid grid-cols-3 gap-4 border-t py-8 sm:mt-0" style={{ borderColor: `${colors.cyan}33` }}>
                <div>
                  <p className={`text-3xl font-bold text-gray-400 ${orbitron.className}`}>5+</p>
                  <p className="text-xs uppercase tracking-widest" style={{ color: colors.green }}>Years Exp</p>
                </div>
                <div>
                  <p className={`text-3xl font-bold text-gray-400 ${orbitron.className}`}>42</p>
                  <p className="text-xs uppercase tracking-widest" style={{ color: colors.mint }}>Projects</p>
                </div>
                <div>
                  <p className={`text-3xl font-bold text-gray-400 ${orbitron.className}`}>100%</p>
                  <p className="text-xs uppercase tracking-widest" style={{ color: colors.cyan }}>Uptime</p>
                </div>
              </div>
            </div>

            {/* Right Content - Image */}
            <div className="flex-shrink-0 flex justify-center lg:justify-start order-1 lg:order-2">
              <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] lg:w-[400px] lg:h-[400px]">
            
                <div className="relative h-full w-full rounded-full border-4 bg-surface-dark group" style={{ borderColor: `${colors.green}4D`, boxShadow: shadows.glow }}>
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-top from-background-dark via-transparent to-transparent z-10 pointer-events-none"></div>

                  <div className="absolute inset-0 flex justify-center" style={{ touchAction: 'pan-y' }}>
                    <MaskReveal/>
                  </div>
                  
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

        <TechSlider />
      </section>
    </div>
  );
}
