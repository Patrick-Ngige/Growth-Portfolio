'use client';

import { useEffect, useId, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface StripRevealProps {
  /**
   * 'uncover' (default, the only mode currently used on this site): strips
   * of `color` sit over the section this renders inside and peel away
   * bottom-to-top as it scrolls into view, revealing the content beneath.
   * 'cover': the section this renders inside pins, and strips of `color`
   * grow bottom-to-top until the whole frame is solid - an empty stage the
   * next section scrolls up into. Not currently used anywhere on this site,
   * kept for parity with the source component.
   */
  mode?: 'cover' | 'uncover';
  color: string;
  /** Colour used in dark mode. Defaults to `color` - pass an explicit value
   * whenever the section this covers has a dark-mode background close (or
   * identical) to `color`, or the wipe reads as invisible. Not part of the
   * original component - this site's dark/light toggle needs it. */
  darkColor?: string;
  count?: number;
  /** Per-strip stagger, in seconds of scrub. */
  each?: number;
  /** Slight >1 scale so strip seams never show. */
  overlap?: number;
  /** Stagger origin - 'end' (default) is the bottom strip leading. */
  from?: 'end' | 'start' | 'center';
  /** uncover only: pin the section so the peel plays on a stationary frame.
   * false (default) is the original site's short, unpinned peel. */
  pin?: boolean;
}

/**
 * Ported from the `nova-transitions` package (Patrick's own portable
 * extraction of this exact transition from the NOVASTUDIO site, verified
 * frame-accurate against the source: scaleY/transform-origin/stagger/
 * trigger values below are copied from its src/strip-reveal.js, not
 * re-derived). Reimplemented as a React component using this app's own
 * gsap/ScrollTrigger instance instead of the package's bundled copy, since
 * registering a second one would fight the first.
 *
 * Render as the first child of a `relative` section - 'uncover' covers that
 * section's own top; 'cover' pins that section and fills it with `color`.
 *
 * Colour reacts live to the `.dark` class via a scoped CSS variable rather
 * than a JS theme read at mount, so a mid-session theme toggle updates it
 * immediately - the same pattern the rest of the site's tokens use.
 */
export default function StripReveal({
  mode = 'uncover',
  color,
  darkColor,
  count,
  each = 0.05,
  overlap = 1.04,
  from = 'end',
  pin = false,
}: StripRevealProps) {
  const coverRef = useRef<HTMLDivElement>(null);
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, '');
  const scopeClass = `strip-reveal-${rawId}`;
  const stripCount = count ?? (mode === 'cover' ? 11 : 12);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cover = coverRef.current;
    const section = cover?.parentElement;
    if (!cover || !section || reduced) return;

    const strips = Array.from(cover.children) as HTMLElement[];

    const tween =
      mode === 'cover'
        ? gsap.fromTo(
            strips,
            { scaleY: 0 },
            {
              scaleY: overlap,
              transformOrigin: '50% 100%',
              ease: 'none',
              stagger: { each, from },
              scrollTrigger: {
                trigger: section,
                start: 'bottom bottom',
                end: '+=100%',
                pin: true,
                pinSpacing: false,
                scrub: true,
                anticipatePin: 1,
              },
            }
          )
        : gsap.fromTo(
            strips,
            { scaleY: overlap },
            {
              scaleY: 0,
              transformOrigin: '50% 0%',
              ease: 'none',
              stagger: { each, from },
              scrollTrigger: pin
                ? {
                    trigger: section,
                    start: 'top top',
                    end: '+=100%',
                    pin: true,
                    pinSpacing: true,
                    scrub: true,
                    anticipatePin: 1,
                  }
                : {
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
  }, [mode, each, overlap, from, pin]);

  return (
    <>
      <style>{`
        .${scopeClass} { --strip-reveal-color: ${color}; }
        .dark .${scopeClass} { --strip-reveal-color: ${darkColor ?? color}; }
      `}</style>
      <div
        ref={coverRef}
        aria-hidden="true"
        className={`${scopeClass} pointer-events-none absolute left-0 top-0 z-[8] flex h-screen w-full flex-col overflow-hidden`}
      >
        {Array.from({ length: stripCount }).map((_, i) => (
          <div key={i} className="w-full flex-1" style={{ background: 'var(--strip-reveal-color)' }} />
        ))}
      </div>
    </>
  );
}
