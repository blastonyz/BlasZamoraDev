'use client';

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "./components/hero/Hero";
import Skills from "./components/skills/Skills";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroRef = useRef(null);
  const skillsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate Skills sliding up over Hero
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
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-zinc-50 font-sans overflow-hidden">
      <main className="w-full relative">
        <div ref={heroRef} className="relative min-h-[200vh] bg-white">
          <Hero />
        </div>
        <div ref={skillsRef} className="fixed inset-0 z-10 bg-white">
          <Skills />
        </div>
      </main>
    </div>
  );
}
