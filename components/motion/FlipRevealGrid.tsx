'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * A reusable section-entrance transition, ported from trionn-rebuild's
 * src/components/home/facts.js ("Key facts"): cards start tipped back
 * (rotateX(-88deg), invisible) and flip up flat as you scroll into the
 * section - scrubbed directly to scroll position (not time-based), over a
 * short range (section top at 80% of viewport -> 25%). Lighter-weight than
 * the pinned work-reel transition; meant to be dropped onto any card grid
 * where a section needs to feel like it "arrives" rather than just fade in.
 *
 * Usage: wrap a grid of cards, give each direct child card the
 * `flip-reveal-card` class. The parent needs 3D perspective, which this
 * component supplies.
 */
export default function FlipRevealGrid({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const container = containerRef.current;
    if (!container || reduced) return;

    const cards = container.querySelectorAll('.flip-reveal-card');
    if (!cards.length) return;

    gsap.set(cards, { transformStyle: 'preserve-3d', opacity: 0, rotateX: -88 });
    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top 80%',
      end: 'top 25%',
      scrub: true,
      animation: gsap.to(cards, { rotateX: 0, opacity: 1, ease: 'none' }),
    });

    return () => st.kill();
  }, []);

  return (
    <div ref={containerRef} className={className} style={{ perspective: '1400px' }}>
      {children}
    </div>
  );
}
