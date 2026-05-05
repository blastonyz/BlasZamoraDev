'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import TechSlider from '../ui/TechSlider';
import { orbitron, colors, shadows, gradientStyle } from '../../lib/theme';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

const MaskReveal = dynamic(() => import('../ui/MaskReveal'), {
  ssr: false,
});

export default function Hero() {
  const [heroImageReady, setHeroImageReady] = useState(false);
  const [showMesh, setShowMesh] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);
  const ringOneRef = useRef<HTMLDivElement>(null);
  const ringTwoRef = useRef<HTMLDivElement>(null);
  const ringThreeRef = useRef<HTMLDivElement>(null);
  const signalDotRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      const split = new SplitText(".title", { type: "chars" });
      
      gsap.fromTo(split.chars, 
        {
          opacity: 0,
          y: 20
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.03,
          duration: 0.3,
          ease: "power1.out",
          force3D: true
        }
      );

      gsap.fromTo(titleRef.current,
        {
          opacity: 0,
          y: 20
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: 0.2,
          ease: "power1.out",
          force3D: true
        }
      );

      if (scanLineRef.current) {
        const scanTl = gsap.timeline({ repeat: -1, repeatDelay: 0.25 });
        scanTl
          .set(scanLineRef.current, { yPercent: -120, opacity: 0 })
          .to(scanLineRef.current, { opacity: 0.72, duration: 0.28, ease: 'power1.out' })
          .to(scanLineRef.current, { yPercent: 220, duration: 3.8, ease: 'none' }, 0)
          .to(scanLineRef.current, { opacity: 0, duration: 0.5, ease: 'power1.in' }, 3.2);
      }

      if (ringOneRef.current) {
        gsap.to(ringOneRef.current, {
          scale: 1.08,
          boxShadow: `0 0 32px ${colors.green}44, inset 0 0 18px ${colors.green}22`,
          duration: 1.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          transformOrigin: '50% 50%',
        });
      }

      if (ringTwoRef.current) {
        gsap.to(ringTwoRef.current, {
          scale: 1.05,
          opacity: 0.52,
          duration: 2.2,
          delay: 0.28,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          transformOrigin: '50% 50%',
        });
      }

      if (ringThreeRef.current) {
        gsap.to(ringThreeRef.current, {
          rotate: 360,
          duration: 28,
          repeat: -1,
          ease: 'none',
          transformOrigin: '50% 50%',
        });
      }

      if (signalDotRef.current) {
        gsap.to(signalDotRef.current, {
          opacity: 0.18,
          duration: 0.9,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!heroImageReady) return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let idleId: number | null = null;

    const show = () => {
      timeoutId = setTimeout(() => setShowMesh(true), 350);
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(show, { timeout: 1200 });
    } else {
      show();
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (idleId !== null && typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }
    };
  }, [heroImageReady]);


  return (
    <div className="hero-container relative w-full">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-background-light dark:to-background-dark"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-secondary/10 blur-[120px] rounded-full mix-blend-screen"></div>
        <div
          ref={scanLineRef}
          className="absolute left-0 right-0 z-10 h-[2px]"
          style={{
            top: 0,
            background: `linear-gradient(90deg, transparent, ${colors.green}, transparent)`,
            filter: `drop-shadow(0 0 10px ${colors.green}88)`,
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-[85vh] flex flex-col items-center mx-4">
        <div className="max-w-7xl mx-10 px-4 mt-20 w-full sm:px-6 md:mt-16 flex-1 flex items-center">
          <div className="flex flex-col lg:flex-row justify-center lg:justify-between gap-4 lg:gap-16 w-full">
            {/* Left Content */}
            <div className="w-full lg:flex-1 text-center lg:text-left lg:max-w-xl lg:pt-12 order-2 lg:order-1">

              <h1 className={`text-3xl tracking-tight font-extrabold text-gray-400 sm:text-4xl md:text-5xl lg:text-6xl mb-4 ${orbitron.className} title`}>
                <span className="block">Architecting the</span>
               
              </h1>

              <h1 ref={titleRef} className={`relative mb-4 text-3xl font-extrabold tracking-tight text-gray-400 sm:text-4xl md:text-5xl lg:text-6xl ${orbitron.className}`}>
                <span
                  aria-hidden="true"
                  className="absolute inset-0 block"
                  style={{
                    color: '#000000',
                    transform: 'translate(1px, 4px)',
                    textShadow: '0 2px 2px rgba(0, 0, 0, 0.98), 0 6px 18px rgba(0, 0, 0, 0.92)',
                    pointerEvents: 'none',
                  }}
                >
                  Digital Future
                </span>
                <span 
                  className="relative z-10 block neon-text glitch-effect" 
                  data-text="Digital Future"
                  style={{ 
                    backgroundImage: gradientStyle,
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    color: 'transparent',
                    WebkitTextStroke: '0.8px rgba(0, 0, 0, 0.55)',
                    filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.75))'
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
                  className={`group relative px-8 py-3 text-background-dark font-bold text-lg overflow-hidden ${orbitron.className}`}
                  style={{ background: gradientStyle, boxShadow: shadows.md }}
                  href="#projects"
                >
                  <div className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                  <span className="relative text-white "
                   style={{ 
                   textShadow: '0 2px 4px rgba(22, 20, 20, 0.8), 0 4px 12px rgba(255, 255, 255, 0.6)',
                  }}>VIEW PROJECTS</span>
                </a>
                <a 
                  className={`px-8 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold text-lg transition-all flex items-center justify-center gap-2 ${orbitron.className}`}
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
            <div className="flex-shrink-0 flex justify-center lg:justify-center order-1 lg:order-2 lg:self-center">
              <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] lg:w-[400px] lg:h-[400px]">
                <div
                  ref={ringOneRef}
                  className="pointer-events-none absolute inset-0 rounded-full border"
                  style={{ borderColor: `${colors.green}80` }}
                />
                <div
                  ref={ringTwoRef}
                  className="pointer-events-none absolute -inset-5 rounded-full border"
                  style={{ borderColor: `${colors.green}3D` }}
                />
                <div
                  ref={ringThreeRef}
                  className="pointer-events-none absolute -inset-10 rounded-full border border-dashed"
                  style={{ borderColor: `${colors.green}30` }}
                />
            
                <div className="relative h-full w-full rounded-full border-4 bg-surface-dark group" style={{ borderColor: `${colors.green}4D`, boxShadow: shadows.glow }}>
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-top from-background-dark via-transparent to-transparent z-10 pointer-events-none"></div>

                  <div className="absolute inset-0 pointer-events-none z-[1]">
                    <Image
                      src="/yo-vin.png"
                      alt="Blas profile"
                      fill
                      priority
                      sizes="(max-width: 768px) 220px, (max-width: 1200px) 350px, 400px"
                      className="object-contain p-[10%]"
                      onLoad={() => setHeroImageReady(true)}
                    />
                  </div>

                  {showMesh && (
                    <div className="absolute inset-0 z-[2] flex justify-center" style={{ touchAction: 'pan-y' }}>
                      <MaskReveal />
                    </div>
                  )}
                  
                </div>

                {/* HUD Elements */}
                <div 
                  className="absolute top-[-20px] right-[-5%] bg-surface-dark border p-3 rounded backdrop-blur-sm z-30 hidden lg:block"
                  style={{ borderColor: `${colors.green}66`, boxShadow: shadows.md }}
                >
                  <div className="flex items-center gap-2">
                    <span ref={signalDotRef} className="material-icons text-sm" style={{ color: colors.green }}>wifi</span>
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
