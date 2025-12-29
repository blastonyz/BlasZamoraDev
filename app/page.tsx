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
  const skillsRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const projectsContentRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const skillsEndTriggerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return; // Don't initialize animations until loading is complete

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(videoRef.current, { opacity: 0 });
      gsap.set(projectsRef.current, { opacity: 0, scale: 0.9 });
      gsap.set(projectsContentRef.current, { 
        opacity: 0, 
        y: 50,
        skewY: 5,
        skewX: -3
      });

      // Skills sliding up over Hero
      gsap.fromTo(
        skillsRef.current,
        { y: '110vh' },
        {
          y: '-110vh',
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

      // Hide Hero completely during third transition
      gsap.to(heroRef.current, {
        visibility: 'hidden',
        scrollTrigger: {
          trigger: skillsEndTriggerRef.current,
          start: "top bottom",
          end: "top bottom",
          scrub: false,
          onEnter: () => {
            if (heroRef.current) {
              heroRef.current.style.visibility = 'hidden';
            }
          },
          onLeaveBack: () => {
            if (heroRef.current) {
              heroRef.current.style.visibility = 'visible';
            }
          }
        },
      });

      // Skills scale down and fade out during third transition (0-40% of scroll)
      gsap.to(skillsRef.current, {
        scale: 0.5,
        opacity: 0,
        ease: "power2.out",
        y: '-110vh',
        scrollTrigger: {
          trigger: skillsEndTriggerRef.current,
          start: "top+=100vh bottom",
          end: "top+=450vh bottom",
          scrub: true,
        },
      });

      // Background video fade in: starts after Skills fully fades (with margin)
      gsap.to(videoRef.current, {
        opacity: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: skillsEndTriggerRef.current,
          start: "top+=50vh bottom",
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
          start: "top+=1vh bottom",
          end: "top top",
          scrub: true,
          onEnter: () => {
            if (projectsRef.current) {
              projectsRef.current.style.pointerEvents = 'auto';
            }
            // Trigger content animation after Projects becomes visible
            gsap.to(projectsContentRef.current, {
              opacity: 1,
              y: 0,
              skewY: 0,
              skewX: 0,
              duration: 1.5,
              delay: 0.8,
              ease: "power3.out"
            });
          },
          onLeaveBack: () => {
            if (projectsRef.current) {
              projectsRef.current.style.pointerEvents = 'none';
            }
            // Reset content animation
            gsap.set(projectsContentRef.current, {
              opacity: 0,
              y: 50,
              skewY: 5,
              skewX: -3
            });
          }
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
      {/* Background video - visible on third transition */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 z-0 pointer-events-none w-full h-full object-cover opacity-0"
      >
        <source src="/back-city.mp4" type="video/mp4" />
      </video>

      <main className="w-full relative">
        {/* Hero Section */}
        <div ref={heroRef} className="relative min-h-[200vh] z-10 bg-white">
          <Hero />
        </div>

        {/* Skills Section */}
        <div ref={skillsRef} className="fixed inset-0 z-20 bg-black">
          <Skills />
        </div>

        {/* Trigger for third transition - extended scroll space for slower transition */}
        <div className="relative min-h-[200vh] z-1">
          <div ref={skillsEndTriggerRef} className="w-full h-full" />
        </div>

        {/* Projects Section - reveals background video */}
        <div ref={projectsRef} className="fixed inset-0 z-30 pointer-events-none">
          <Projects contentRef={projectsContentRef} />
        </div>
      </main>
    </div>
  );
}
