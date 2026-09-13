'use client';

import { useEffect, useId, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface StripRevealProps {
  color: string;
  /** Cover colour used in dark mode. Defaults to `color` - pass an explicit
   * value whenever the section being revealed has a dark-mode background
   * close (or identical) to `color`, or the wipe reads as invisible. */
  darkColor?: string;
  count?: number;
}

/**
 * Ported from trionn-rebuild's components/transitions.js stripReveal(),
 * reoriented per instruction: a stack of horizontal bands covers the top of
 * whatever section renders this, then clears bottom-band-first, sweeping
 * upward as that section scrolls into view (`stagger: from: 'end'` on bands
 * ordered top-to-bottom means the last, bottom-most band animates first).
 * Render as the first child of a `relative` section.
 *
 * Colour reacts live to the `.dark` class via a scoped CSS variable rather
 * than a JS theme read at mount, so a mid-session theme toggle updates it
 * immediately - the same pattern the rest of the site's tokens use.
 */
export default function StripReveal({ color, darkColor, count = 12 }: StripRevealProps) {
  const coverRef = useRef<HTMLDivElement>(null);
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, '');
  const scopeClass = `strip-reveal-${rawId}`;

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
        transformOrigin: '50% 100%',
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
    <>
      <style>{`
        .${scopeClass} { --strip-reveal-color: ${color}; }
        .dark .${scopeClass} { --strip-reveal-color: ${darkColor ?? color}; }
      `}</style>
      <div
        ref={coverRef}
        aria-hidden="true"
        className={`${scopeClass} pointer-events-none absolute left-0 top-0 z-[8] flex h-screen w-full flex-col`}
      >
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="w-full flex-1" style={{ background: 'var(--strip-reveal-color)' }} />
        ))}
      </div>
    </>
  );
}
