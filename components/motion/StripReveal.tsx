'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface StripRevealProps {
  color: string;
  count?: number;
}

/**
 * Ported from trionn-rebuild's components/transitions.js stripReveal(): a
 * row of vertical strips covers the top of whatever section renders this,
 * then peels away (scaleY 1.04 -> 0, staggered from the last strip) as that
 * section scrolls into view. Render it as the first child of a `relative`
 * section, colored to match whatever came before, so the handoff between
 * sections reads as a wipe instead of a hard cut.
 */
export default function StripReveal({ color, count = 12 }: StripRevealProps) {
  const coverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cover = coverRef.current;
    const section = cover?.parentElement;
    if (!cover || !section || reduced) return;

    const strips = Array.from(cover.children) as HTMLElement[];

    const tween = gsap.fromTo(
      strips,
      { scaleY: 1.04 },
      {
        scaleY: 0,
        transformOrigin: '50% 0%',
        ease: 'none',
        stagger: { each: 0.05, from: 'end' },
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'top 15%',
          scrub: true,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div
      ref={coverRef}
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 z-[8] flex h-screen w-full"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-full flex-1" style={{ background: color }} />
      ))}
    </div>
  );
}
