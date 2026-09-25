'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { caseStudies } from '@/lib/data';
import MetricsGrid from './MetricsGrid';

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
 *
 * Extended with a second scroll leg: once the card row finishes scrolling,
 * the whole reel (stage) continues sliding fully off-screen to the left
 * while the stats section (rendered as a layer behind it, off-screen to the
 * right) slides into the same space in sync - one continuous wipe rather
 * than a card-scroll followed by a separate vertical hand-off.
 *
 * Card geometry matches trionn's `.work-row`/`.work-card`/`.wc-shot`/
 * `.wc-meta` CSS exactly: row gap 3vw, card flex-basis 46vw x 74vh, image
 * area flex:1 with 8px radius and a mono label pinned to its top-left
 * corner, meta block flex:0 auto below with a 1.7rem/600 heading and a
 * 14px/40ch paragraph. Real screenshots are used where study.images has
 * one; otherwise a gradient placeholder with an honest "Screenshot pending"
 * label stands in.
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
// 13, not 6: bumped so PulseKE is reachable from the homepage reel, not
// just the /work index page.
const FEATURED = caseStudies.slice(0, 13);

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
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const stageRef = useRef(null);
  const rowRef = useRef(null);
  const introRef = useRef(null);
  const statsLayerRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pin = pinRef.current;
    const stage = stageRef.current;
    const row = rowRef.current;
    const statsLayer = statsLayerRef.current;
    if (!pin || !stage || !row || !statsLayer || reduced) return;

    const cards = cardRefs.current.filter(Boolean);
    const dist = () => Math.max(0, row.scrollWidth - window.innerWidth);
    // Second leg of the scroll: once the last card has docked, the whole
    // reel (not just that card) slides fully off-screen left while the
    // stats section - sitting behind it the whole time, just off-screen to
    // the right - slides into the same space at the same rate.
    const revealPx = () => window.innerWidth;

    // Exact original rise() from work.js: translateY only, no opacity.
    const rise = () => {
      const vw = window.innerWidth;
      cards.forEach((card) => {
        const r = card.getBoundingClientRect();
        const t = (r.left + r.width / 2) / vw;
        const p = gsap.utils.clamp(0, 1, (t - 0.5) / 0.45);
        const eased = p * p * p;
        card.style.transform = 'translateY(' + (eased * 150).toFixed(1) + 'px)';
      });
    };

    const D = dist();
    const R = revealPx();

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pin,
        start: 'top top',
        end: () => '+=' + (dist() + revealPx()),
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: rise,
        onRefresh: rise,
      },
    });

    const intro = introRef.current;
    if (intro) {
      tl.to(intro, { autoAlpha: 0, duration: D * 0.25, ease: 'power1.in' }, 0);
    }

    tl.to(row, { x: () => -dist(), ease: 'none', duration: D }, 0);
    tl.to(stage, { x: () => -revealPx(), ease: 'none', duration: R }, D);
    tl.fromTo(statsLayer, { x: R }, { x: 0, ease: 'none', duration: R }, D);

    rise();

    return () => {
      tl.scrollTrigger && tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} id="work" className="relative w-full" style={{ background: BAND_BG }}>
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden">
        <div
          ref={statsLayerRef}
          className="absolute inset-0 z-0 flex items-center bg-[var(--surface-color)] dark:bg-[var(--background-surface)]"
          style={{ willChange: 'transform' }}
          aria-hidden="true"
        >
          <div className="container-main w-full">
            <MetricsGrid />
          </div>
        </div>

        <div ref={stageRef} className="absolute inset-0 z-10" style={{ willChange: 'transform' }}>
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

          <div
            ref={rowRef}
            className="flex h-full items-center gap-[3vw]"
            style={{ width: 'max-content', paddingLeft: '37vw', paddingRight: '4vw' }}
          >
            {FEATURED.map((study, i) => (
              <Link
                key={study.id}
                href={'/work/' + study.id}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="flex h-[74vh] shrink-0 flex-[0_0_75vw] flex-col gap-[26px] sm:flex-[0_0_46vw]"
                style={{ willChange: 'transform' }}
              >
                <div
                  className="relative flex flex-1 flex-col justify-end overflow-hidden rounded-lg p-[30px] text-white"
                  style={study.images && study.images[0] ? undefined : { background: SHOT_GRADIENTS[i % SHOT_GRADIENTS.length] }}
                >
                  {study.images && study.images[0] && (
                    <>
                      <img
                        src={study.images[0]}
                        alt={study.company + ' screenshot'}
                        className="absolute inset-0 h-full w-full object-cover object-top"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    </>
                  )}
                  <span className="absolute left-[30px] top-[30px] z-10 font-mono text-[11px] uppercase tracking-[0.14em] text-white/70">
                    {study.industry}
                  </span>
                  {!(study.images && study.images[0]) && (
                    <span className="relative z-10 font-mono text-[11px] uppercase tracking-[0.14em] text-white/70">
                      Screenshot pending
                    </span>
                  )}
                </div>
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
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
