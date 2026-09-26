'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Site loader, ported from trionn-rebuild's src/components/loader.js (mechanics
 * kept as-is per instruction, "customize later"): a crop-marked frame holds a
 * mark that fades/scales in, a counter animates 0 -> 100, and a word beneath
 * cycles through three brand words at each third of the count. On completion
 * the frame scales up and fades, the counter/word fade out, and the whole
 * panel slides up off-screen (yPercent -100) like a curtain lifting into the
 * page. Personalized word cycle for now: BUILD / INSTRUMENT / SHIP.
 *
 * Plays once per browser session (sessionStorage), not on every reload during
 * a single visit, and is skipped for prefers-reduced-motion.
 *
 * Matches trionn-rebuild's own main.js sequencing in one respect that
 * mattered: it calls `ScrollTrigger.refresh()` once, right as this loader
 * finishes (or immediately, on the skip path) - trionn defers ALL of its
 * sections' own GSAP setup until AFTER its loader's dismissal, then does
 * exactly this. This app's sections instead each set up their own
 * ScrollTrigger independently in their own effects, on normal React mount
 * timing, with no such coordination - which left room for a real bug: a
 * scroll-linked trigger whose position depends on another section's
 * runtime-computed layout (FeaturedWorkReel's `dist()`, which needs its
 * card row's actual rendered width) could get measured before that width
 * had settled, leaving it stale for the rest of the session. This refresh
 * is the safety net - forcing every trigger on the page to re-measure
 * against DOM state that even a browser mid-loading fonts/layout has had
 * several real seconds (this loader's own animation) to settle into.
 *
 * Deliberately mounts unconditionally and decides in useLayoutEffect (not
 * useEffect + a `visible` state gating the render) whether to actually play:
 * gating the JSX on state set inside the same effect meant the refs were
 * never attached on the first pass, so the whole animation silently no-op'd.
 * useLayoutEffect runs after the DOM commits but before paint, so a skip
 * decision here still never flashes the loader for repeat visits.
 */
const WORDS = ['BUILD', 'INSTRUMENT', 'SHIP'];
const SESSION_KEY = 'patrick-loader-shown';

export default function Loader() {
  const [gone, setGone] = useState(false);
  const markRef = useRef<SVGSVGElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const mark = markRef.current;
    const word = wordRef.current;
    const counter = counterRef.current;
    const panel = panelRef.current;
    if (!mark || !word || !counter || !panel) return;

    let reduced = false;
    let already = false;
    try {
      reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      // ignore
    }
    try {
      already = sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      // sessionStorage unavailable (private mode etc.)
    }

    if (reduced || already) {
      setGone(true);
      ScrollTrigger.refresh();
      return;
    }
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // ignore
    }

    // gsap.context() is load-bearing here, not just tidiness: this effect had
    // NO cleanup at all, so its tweens (including one driving `.pl-frame` via
    // a raw global string selector, not a ref) kept running/holding DOM
    // references with no way to stop them. Loader lives in the root layout
    // and unmounts itself (gone -> true, returning null) the instant its own
    // completion timeline finishes - if that unmount landed while a click
    // elsewhere on the page (e.g. a nav Link) triggered React's OWN unmount
    // of a different subtree in the same commit window, two independent,
    // un-cancelled GSAP timelines racing React's reconciler is exactly the
    // shape of bug that throws "Failed to execute 'removeChild': the node to
    // be removed is not a child of this node" and crashes the destination
    // page. Same root cause already fixed in FeaturedWorkReel.tsx and
    // StripReveal.tsx for their own pin:true timelines; this is the third
    // and most consequential instance since it runs on every single page.
    const ctx = gsap.context(() => {
      gsap.set(mark, { opacity: 0, scale: 0.86 });
      gsap.to(mark, { opacity: 1, scale: 1, duration: 1.4, ease: 'power2.out', delay: 0.15 });

      const state = { n: 0 };
      let lastWordIndex = -1;
      gsap.to(state, {
        n: 100,
        duration: 1.9,
        ease: 'power2.inOut',
        onUpdate: () => {
          counter.textContent = String(Math.round(state.n)).padStart(3, '0').split('').join(' ');
          const wi = Math.min(2, Math.floor(state.n / 34));
          if (wi !== lastWordIndex) {
            lastWordIndex = wi;
            gsap.fromTo(word, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35 });
            word.textContent = WORDS[wi];
          }
        },
        onComplete: () => {
          gsap
            .timeline({
              onComplete: () => {
                setGone(true);
                ScrollTrigger.refresh();
              },
            })
            .to(mark, { scale: 1.06, duration: 0.5 })
            .to([counter, word], { opacity: 0, duration: 0.35 }, 0)
            .to('.pl-frame', { opacity: 0, scale: 1.4, duration: 0.7, ease: 'power2.in' }, 0.25)
            .to(panel, { yPercent: -100, duration: 1.0, ease: 'power4.inOut' }, 0.35);
        },
      });
    }, panel);

    return () => {
      ctx.revert();
    };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={panelRef}
      aria-hidden="true"
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[var(--background-primary)]"
    >
      <div
        className="pl-frame relative"
        style={{ width: 'min(30vw, 264px)', aspectRatio: '1', border: '1px solid var(--border-color)' }}
      >
        <i className="absolute -top-2 -left-2 font-mono text-[13px] leading-none text-[var(--text-secondary)]">+</i>
        <i className="absolute -top-2 -right-2 font-mono text-[13px] leading-none text-[var(--text-secondary)]">+</i>
        <i className="absolute -bottom-2 -left-2 font-mono text-[13px] leading-none text-[var(--text-secondary)]">+</i>
        <i className="absolute -bottom-2 -right-2 font-mono text-[13px] leading-none text-[var(--text-secondary)]">+</i>
        <svg
          ref={markRef}
          viewBox="0 0 100 100"
          fill="none"
          className="absolute inset-0 m-auto"
          style={{ width: '44%', height: '44%' }}
        >
          <path
            d="M20 78 L20 40 L38 40 L38 22 L62 22 L62 40 L80 40 L80 78"
            stroke="var(--text-primary)"
            strokeWidth={6}
            strokeLinejoin="round"
          />
          <circle cx="50" cy="60" r="6" className="fill-accent-growth" />
        </svg>
      </div>
      <div
        ref={wordRef}
        className="mt-[22px] h-[14px] font-mono text-[11px] uppercase tracking-[0.34em] text-[var(--text-secondary)]"
      />
      {/* trionn's .pl-counter is position:absolute, bottom:12% of the whole
          panel - independent of the frame+word group above it, not stacked
          tightly beneath it. That's what actually spaces the composition
          out across the full screen instead of bunching everything in the
          centre. */}
      <div
        ref={counterRef}
        className="absolute bottom-[12%] left-0 right-0 text-center font-mono text-[13px] tracking-[0.45em] text-[var(--text-primary)]"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        000
      </div>
    </div>
  );
}
