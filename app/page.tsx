'use client';

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "./components/hero/Hero";
import Skills from "./components/skills/Skills";
import Projects from "./components/projects/Projects";
import LoadingScreen from "./components/LoadingScreen";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const projectsContentRef = useRef<HTMLDivElement>(null);
  const skillsContentRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return; 

    const ctx = gsap.context(() => {
      // Hero fade out
      gsap.to(heroRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Grid glow effect
      gsap.to(gridRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top+=50vh top",
          end: "bottom+=50vh top",
          toggleClass: { targets: gridRef.current, className: "active-glow" },
        },
      });
    });

    return () => ctx.revert();
  }, [isLoading]);

  if (isLoading) {
    return <LoadingScreen onLoadComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="bg-white font-sans overflow-hidden">
      {/* Fixed Grid Background */}
      <div ref={gridRef} className="bg-grid bg-grid-pattern opacity-[0.05] z-0"></div>
      
      <main className="w-full relative">
        {/* Hero Section - 1st */}
        <div ref={heroRef} className="relative min-h-screen z-10 bg-white">
          <Hero />
        </div>

        {/* Projects Section - 2nd (Fixed with scrollable content) */}
        <div className="relative z-20">
          <div ref={projectsRef} className="bg-transparent">
            <div ref={projectsContentRef}>
              <Projects contentRef={projectsContentRef} />
            </div>
          </div>
        </div>

        {/* Skills Section - 3rd (Fixed with scrollable content) */}
        <div className="relative min-h-screen z-30">
          <div ref={skillsRef} className="sticky top-0 h-screen bg-black">
            <div ref={skillsContentRef}>
              <Skills />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}