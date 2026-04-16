'use client';

import { ResponsiveProvider } from '@/app/contexts/ResponsiveContext';
import { ReactNode } from 'react';

export function ClientLayout({ children }: { children: ReactNode }) {
  return <ResponsiveProvider>{children}</ResponsiveProvider>;
}
