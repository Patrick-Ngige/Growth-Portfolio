'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { caseStudies } from '@/lib/data';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * The home page's one work-related section (per instruction: "we are only
 * going to remain with featured work, we can't have both" - the old full
 * CaseStudies grid was dropped from Home; the full 11-project browsing
 * experience moves to the future /work index page).
 *
 * Ported from trionn-rebuild's src/components/home/work.js (Selected Work):
 * the row of cards scrolls horizontally while pinned, each card rising into
 * focus with a cubic-eased translateY as it crosses the viewport's centre -
 * matched to the exact original math this time (150px rise, no opacity
 * fade - trionn's own `rise()` never touches opacity, only transform).
 * The pin releases the instant the row finishes scrolling (end = dist()
 * exactly, no padded tail) so the next section arrives immediately rather
 * than leaving dead scroll distance with nothing animating. The reveal
 * itself is a StripReveal on whatever section follows, colour-matched to
 * BAND_BG below - the same generic wipe trionn uses between sections,
 * instead of this component fading its own panel to nothing.
 *
 * Card geometry matches trionn's `.work-row`/`.work-card`/`.wc-shot`/
 * `.wc-meta` CSS exactly: row gap 3vw, card flex-basis 46vw x 74vh, image
 * area flex:1 with 8px radius and a mono label pinned to its top-left
 * corner, meta block flex:0 auto below with a 1.7rem/600 heading and a
 * 14px/40ch paragraph. Trionn fills the image area with a real photo;
 * Patrick doesn't have screenshots wired in yet, so each card gets one of
 * three gradient placeholders (same treatment as trionn's own shot-1/2/3
 * fallback gradients) with an honest "Screenshot pending" label instead of
 * a faked photo.
 *
 * Deliberately given its own FIXED dark colour band (not the theme's
 * flipping --background-primary/--text-primary tokens) so that in light
 * mode this section reads as a distinct panel against the cream page
 * around it, the same way trionn alternates light/dark sections rather
 * than using one flat background throughout. Colours are the same true
 * neutral black/charcoal/white set as Footer.tsx - no warm tint.
 *
 * Deliberately NOT wrapped in AnimatedSection or any container with
 * `overflow-hidden` on an ancestor - that broke a previous GSAP pin (see
 * PinnedPillars fix, 2026-09-13 commit).
 */
const FEATURED = caseStudies.slice(0, 6);

const BAND_BG = '#000000';
const INK = '#F5F5F5';
const INK_MUTED = '#8A8A8A';

// Same treatment as trionn's shot-1/shot-2/shot-3 fallback gradients, cycled
// per card - a stand-in for a real screenshot, not a faked photo.
const SHOT_GRADIENTS = [
  'linear-gradient(120deg, #3a3226, #1a1712), radial-gradient(80% 120% at 80% 10%, #4d4536, transparent)',
  'radial-gradient(90% 120% at 70% 20%, #4a1a12, #140806)',
  'linear-gradient(160deg, #1c2620, #0a0f0c)',
];

export default function FeaturedWorkReel() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pin = pinRef.current;
    const row = rowRef.current;
    if (!pin || !row || reduced) return;

    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    const dist = () => Math.max(0, row.scrollWidth - window.innerWidth);

    // Exact original rise() from work.js: translateY only, no opacity.
    const rise = () => {
      const vw = window.innerWidth;
      cards.forEach((card) => {
        const r = card.getBoundingClientRect();
        const t = (r.left + r.width / 2) / vw;
        const p = gsap.utils.clamp(0, 1, (t - 0.5) / 0.45);
        const eased = p * p * p;
        card.style.transform = `translateY(${(eased * 150).toFixed(1)}px)`;
      });
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pin,
        start: 'top top',
        end: () => '+=' + dist(),
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: rise,
        onRefresh: rise,
      },
    });

    // The intro label sits over the same horizontal space the first card
    // scrolls through, so it has to clear out of the way early instead of
    // sitting underneath/overlapping the cards for the whole scroll.
    const intro = introRef.current;
    if (intro) tl.to(intro, { autoAlpha: 0, duration: 0.25, ease: 'power1.in' }, 0);

    tl.to(row, { x: () => -dist(), ease: 'none', duration: 1 }, 0);

    rise();

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} id="work" className="relative w-full" style={{ background: BAND_BG }}>
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden">
        {/* trionn's .work-intro: flex-basis 34vw, height 70vh, gap 22px */}
        <div
          ref={introRef}
          className="absolute left-0 top-0 z-10 flex h-[70vh] w-[34vw] flex-col justify-center gap-[22px] pointer-events-none"
          style={{ paddingLeft: 'clamp(20px, 4vw, 64px)', paddingRight: '2vw' }}
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: INK_MUTED }}>
            Featured Work
          </span>
          <h2 className="text-section font-display font-semibold" style={{ color: INK }}>
            Selected work &amp; systems
          </h2>
        </div>
        {/* trionn's .work-row: gap 3vw, padding 0 4vw (left widened to clear the intro) */}
        <div
          ref={rowRef}
          className="flex h-full items-center gap-[3vw]"
          style={{ width: 'max-content', paddingLeft: '37vw', paddingRight: '4vw' }}
        >
          {FEATURED.map((study, i) => (
            // trionn's .work-card: flex-basis 46vw, height 74vh, column,
            // gap 26px. Widened to 75vw on mobile (3/4 of the viewport for
            // the active card) - 46vw reads as a sliver on a narrow phone
            // screen; trionn's own 46vw is tuned for wider viewports.
            <div
              key={study.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="flex h-[74vh] shrink-0 flex-[0_0_75vw] flex-col gap-[26px] sm:flex-[0_0_46vw]"
              style={{ willChange: 'transform' }}
            >
              {/* trionn's .wc-shot: flex:1, radius 8px, padding 30px, mono
                  label pinned top-left. Gradient placeholder stands in for
                  a real screenshot Patrick doesn't have yet. */}
              <div
                className="relative flex flex-1 flex-col justify-end overflow-hidden rounded-lg p-[30px] text-white"
                style={{ background: SHOT_GRADIENTS[i % SHOT_GRADIENTS.length] }}
              >
                <span className="absolute left-[30px] top-[30px] font-mono text-[11px] uppercase tracking-[0.14em] text-white/70">
                  {study.industry}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/70">
                  Screenshot pending
                </span>
              </div>
              {/* trionn's .wc-meta: flex:0 0 auto, gap 10px, h3 1.7rem/600, p 14px/40ch */}
              <div className="flex flex-none flex-col gap-[10px]">
                <h3 className="text-[1.7rem] font-display font-semibold" style={{ color: INK }}>
                  {study.company}
                </h3>
                <p className="max-w-[40ch] text-sm leading-relaxed" style={{ color: INK_MUTED }}>
                  {study.context}
                </p>
                <div className="mt-1">
                  <b className="block font-display text-2xl font-semibold" style={{ color: INK }}>
                    {study.metricValue}
                  </b>
                  <span className="font-mono text-[10px] uppercase tracking-[0.08em]" style={{ color: INK_MUTED }}>
                    {study.metricLabel}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
