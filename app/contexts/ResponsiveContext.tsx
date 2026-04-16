'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type BreakPoint = 'mobile' | 'tablet' | 'desktop';

interface WindowSize {
  width: number;
  height: number;
}

interface ResponsiveContextType {
  windowSize: WindowSize;
  breakpoint: BreakPoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const ResponsiveContext = createContext<ResponsiveContextType | undefined>(undefined);

export function ResponsiveProvider({ children }: { children: ReactNode }) {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
  });
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Set initial size
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    setIsHydrated(true);

    // Handle resize
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine breakpoint
  const breakpoint: BreakPoint =
    windowSize.width < 640 ? 'mobile' : windowSize.width < 1024 ? 'tablet' : 'desktop';

  const contextValue: ResponsiveContextType = isHydrated
    ? {
        windowSize,
        breakpoint,
        isMobile: breakpoint === 'mobile',
        isTablet: breakpoint === 'tablet',
        isDesktop: breakpoint === 'desktop',
      }
    : {
        windowSize: { width: 0, height: 0 },
        breakpoint: 'desktop',
        isMobile: false,
        isTablet: false,
        isDesktop: true,
      };

  return (
    <ResponsiveContext.Provider value={contextValue}>
      {children}
    </ResponsiveContext.Provider>
  );
}

export function useResponsive() {
  const context = useContext(ResponsiveContext);
  if (context === undefined) {
    throw new Error('useResponsive must be used within ResponsiveProvider');
  }
  return context;
}
