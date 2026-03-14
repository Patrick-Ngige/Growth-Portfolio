'use client';

import { ReactNode, useEffect, useState } from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';

interface SmoothScrollProps {
  children: ReactNode;
  options?: {
    lerp?: number;
    duration?: number;
    smoothWheel?: boolean;
    wheelMultiplier?: number;
    touchMultiplier?: number;
    smoothTouch?: boolean;
  };
}

export default function SmoothScroll({
  children,
  options = {
    lerp: 0.1,
    duration: 1.2,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    smoothTouch: false
  }
}: SmoothScrollProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render Lenis on the client side to avoid hydration issues
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={options}>
      {children}
    </ReactLenis>
  );
}
