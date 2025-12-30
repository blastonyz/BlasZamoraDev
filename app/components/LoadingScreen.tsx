'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Image from 'next/image';
import { orbitron, gradientStyle } from '../lib/theme';

interface LoadingScreenProps {
  onLoadComplete: () => void;
}

export default function LoadingScreen({ onLoadComplete }: LoadingScreenProps) {
  const logoRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Simulate loading time or wait for actual resources
    const loadingTimer = setTimeout(() => {
      setIsComplete(true);
    }, 2500);

    return () => clearTimeout(loadingTimer);
  }, []);

  useEffect(() => {
    if (isComplete && logoRef.current && containerRef.current) {
      // Logo explodes to cover entire screen
      gsap.to(logoRef.current, {
        scale: 25,
        duration: 0.4,
        ease: "power2.in",
      });

      // Fade out entire loading screen
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.4,
        delay: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          onLoadComplete();
        }
      });
    }
  }, [isComplete, onLoadComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center"
    >
      {/* Rotating Logo */}
      <div ref={logoRef} className="relative w-32 h-32 mb-8 animate-spin z-50">
        <Image
          src="/logo.svg"
          alt="Loading"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Loading Text with Gradient */}
      <h2
        className={`text-3xl font-bold tracking-wider ${orbitron.className} z-10`}
        style={{
          backgroundImage: gradientStyle,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent'
        }}
      >
        CARGANDO
      </h2>
    </div>
  );
}
