'use client';

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "./components/hero/Hero";
import Skills from "./components/skills/Skills";
import Projects from "./components/projects/Projects";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const skillsEndTriggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(videoRef.current, { opacity: 0 });
      gsap.set(projectsRef.current, { opacity: 0, scale: 0.9 });

      // Skills sliding up over Hero
      gsap.fromTo(
        skillsRef.current,
        { y: '100vh' },
        {
          y: '-100vh',
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        }
      );

      // Fade out Hero as Skills appears
      gsap.to(heroRef.current, {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Skills scale down and fade out during third transition (0-40% of scroll)
      gsap.to(skillsRef.current, {
        scale: 0.7,
        opacity: 0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: skillsEndTriggerRef.current,
          start: "top+=30vh bottom",
          end: "top+=80vh bottom",
          scrub: true,
        },
      });

      // Background video fade in: starts after Skills fully fades (with margin)
      gsap.to(videoRef.current, {
        opacity: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: skillsEndTriggerRef.current,
          start: "top+=100vh bottom",
          end: "top top",
          scrub: true,
        },
      });

      // Projects transition: starts after Skills fully fades (with margin)
      gsap.to(projectsRef.current, {
        opacity: 1,
        scale: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: skillsEndTriggerRef.current,
          start: "top+=100vh bottom",
          end: "top top",
          scrub: true,
          onEnter: () => {
            if (projectsRef.current) {
              projectsRef.current.style.pointerEvents = 'auto';
            }
          },
          onLeaveBack: () => {
            if (projectsRef.current) {
              projectsRef.current.style.pointerEvents = 'none';
            }
          }
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-zinc-50 font-sans overflow-hidden">
      {/* Background video - visible on third transition */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 z-0 pointer-events-none w-full h-full object-cover opacity-0"
      >
        <source src="/parallel.mp4" type="video/mp4" />
      </video>

      <main className="w-full relative">
        {/* Hero Section */}
        <div ref={heroRef} className="relative min-h-[200vh] z-10 bg-white">
          <Hero />
        </div>

        {/* Skills Section */}
        <div ref={skillsRef} className="fixed inset-0 z-20 bg-white">
          <Skills />
        </div>

        {/* Trigger for third transition - extended scroll space for slower transition */}
        <div className="relative min-h-[200vh] z-1">
          <div ref={skillsEndTriggerRef} className="w-full h-full" />
        </div>

        {/* Projects Section - reveals background video */}
        <div ref={projectsRef} className="fixed inset-0 z-30 pointer-events-none">
          <Projects />
        </div>
      </main>
    </div>
  );
}
