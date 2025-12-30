'use client';

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "./components/hero/Hero";
import Skills from "./components/skills/Skills";
import Projects from "./components/projects/Projects";
import ThreeScene from "./components/threescene/ThreeScene";
import LoadingScreen from "./components/LoadingScreen";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const projectsContentRef = useRef<HTMLDivElement>(null);
  const threeSceneRef = useRef<HTMLDivElement>(null);
  const threeSceneContentRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const skillsEndTriggerRef = useRef<HTMLDivElement>(null);
  const projectsEndTriggerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar mobile solo en cliente
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    if (isLoading) return; 

    const ctx = gsap.context(() => {
      // Detect if mobile
      const isMobileView = window.innerWidth < 768;
      const bgRef = isMobileView ? imageRef : videoRef;
      
      // Set initial states
      gsap.set(bgRef.current, { opacity: 0 });
      gsap.set(projectsRef.current, { opacity: 0, scale: 0.9 });
      gsap.set(projectsContentRef.current, { 
        opacity: 0, 
        y: 50,
        skewY: 5,
        skewX: -3
      });
      gsap.set(threeSceneRef.current, { opacity: 0, scale: 1, visibility: 'hidden' });
      gsap.set(threeSceneContentRef.current, { opacity: 0 });

      // Skills sliding up over Hero
      gsap.fromTo(
        skillsRef.current,
        { y: isMobileView? '120vh':'100vh' },
        {
          y: '-120vh',
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
          start: "top+=30vh bottom",
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

      // Skills scale down and fade out during third transition
      // Mobile: longer scroll distance for scaling
      gsap.to(skillsRef.current, {
        scale: 0.5,
        opacity: 0.3,
        ease: "power2.out",
        y: '-110vh',
        scrollTrigger: {
          trigger: skillsEndTriggerRef.current,
          start: isMobileView ? "top+=50vh bottom" : "top+=20vh bottom",
          end: isMobileView ? "top+=250vh bottom" : "top+=180vh bottom",
          scrub: true,
        },
      });

      // Background video/image fade in
      // Mobile: starts later and completes fully before Projects
      gsap.to(bgRef.current, {
        opacity: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: skillsEndTriggerRef.current,
          start: isMobileView ? "top+=80vh bottom" : "top+=20vh bottom",
          end: isMobileView ? "top+=200vh bottom" : "top+=100vh bottom",
          scrub: true,
        },
      });

      // Projects transition
      // Mobile: delayed start for later appearance
      gsap.to(projectsRef.current, {
        opacity: 1,
        scale: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: skillsEndTriggerRef.current,
          start: isMobileView ? "top+=100vh bottom" : "top+=1vh bottom",
          end: isMobileView ? "top+=250vh bottom" : "top+=120vh bottom",
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
            // Reset content animation
            gsap.set(projectsContentRef.current, {
              y: 50,
              skewY: 5,
              skewX: -3
            });
          }
        },
      });

      // Projects content animation - triggered by video opacity instead of scroll
      // Watches for when video is fully visible
      ScrollTrigger.create({
        trigger: skillsEndTriggerRef.current,
        start: isMobileView ? "top+=200vh bottom" : "top+=80vh bottom",
        onEnter: () => {
          gsap.to(projectsContentRef.current, {
            opacity: 1,
            y: 0,
            skewY: 0,
            skewX: 0,
            duration: 1.5,
            delay: 0.5,
            ease: "power3.out"
          });
        },
        onLeaveBack: () => {
          gsap.set(projectsContentRef.current, {
            opacity: 0,
            y: 50,
            skewY: 5,
            skewX: -3
          });
        }
      });

      // Transition from Projects to ThreeScene (Section 4)
      // Escalado concatenado con timeline - escala el VIDEO/IMAGEN, no el contenido
      const projectsToThreeTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: projectsEndTriggerRef.current,
          start: "top bottom",
          end: isMobileView ? "top bottom" : "top bottom",
          scrub: true,
        },
      });

      projectsToThreeTimeline
        .to(bgRef.current,
          { scale: 4, ease: "power2.in", duration: 2}
        )
        .to(projectsRef.current,
          { opacity: 0, ease: "power2.in", duration: 0.5 },
          "-=0.7" // Overlap
        )
        .fromTo(threeSceneRef.current,
          { opacity: 0, visibility: 'hidden' },
          { opacity: 1, visibility: 'visible', ease: "power2.out", duration: 0.8 },
          "-=0.4" // Overlap
        );

      // ThreeScene content fade in y pointer events
      gsap.to(threeSceneContentRef.current, {
        opacity: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: projectsEndTriggerRef.current,
          start: isMobileView ? "top+=40vh bottom" : "top+=25vh bottom",
          end: isMobileView ? "top+=80vh bottom" : "top+=50vh bottom",
          scrub: true,
          onEnter: () => {
            if (threeSceneRef.current) {
              threeSceneRef.current.style.pointerEvents = 'auto';
            }
          },
          onLeaveBack: () => {
            if (threeSceneRef.current) {
              threeSceneRef.current.style.pointerEvents = 'none';
            }
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
      {/* Background video/image - visible on third transition */}
      {isMobile ? (
        <div 
          ref={imageRef}
          className="fixed inset-0 z-0 pointer-events-none w-full h-full"
          style={{
            backgroundImage: 'url(/video-frame.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
      ) : (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="fixed inset-0 z-0 pointer-events-none w-full h-full object-cover"
        >
          <source src="/back-city.mp4" type="video/mp4" />
        </video>
      )}

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
        <div className="relative min-h-[180vh] md:min-h-[150vh] z-1">
          <div ref={skillsEndTriggerRef} className="w-full h-full" />
        </div>

        {/* Projects Section - reveals background video */}
        <div ref={projectsRef} className="fixed inset-0 z-30 pointer-events-none">
          <Projects contentRef={projectsContentRef} />
        </div>

        {/* Trigger for fourth transition */}
        <div className="relative min-h-[100vh] md:min-h-[80vh] z-1">
          <div ref={projectsEndTriggerRef} className="w-full h-full" />
        </div>

        {/* ThreeScene Section - Fourth section */}
        <div ref={threeSceneRef} className="fixed inset-0 z-40 pointer-events-none bg-black">
          <ThreeScene contentRef={threeSceneContentRef} />
        </div>
      </main>
    </div>
  );
}
