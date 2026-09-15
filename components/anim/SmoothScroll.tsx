'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ReactLenis } from '@studio-freight/react-lenis';

/**
 * Root-level Lenis, deliberately gated to `/work` routes only.
 *
 * Home (`/`) leans on GSAP ScrollTrigger extensively - PinnedPillars,
 * FeaturedWorkReel, Methodology, GrowthStack's marquees - all keyed to
 * native `window` scroll and already verified working exactly as
 * intended. Lenis intercepts scroll input; running it globally would
 * mean re-verifying every one of those pins against Lenis's own RAF
 * loop (the classic Lenis+ScrollTrigger integration gotcha) for a page
 * that never asked for the smoother feel in the first place. Scoping
 * this to the newer `/work` pages gets the buttery scroll where it was
 * actually requested with zero risk to what's already shipped: on any
 * other route this renders as a no-op passthrough, native scroll,
 * unchanged.
 */
const ENABLED_PREFIX = '/work';

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
    smoothTouch: false,
  },
}: SmoothScrollProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const enabled = mounted && !!pathname && pathname.startsWith(ENABLED_PREFIX);

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={options}>
      {children}
    </ReactLenis>
  );
}
