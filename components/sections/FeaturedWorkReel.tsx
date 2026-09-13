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
 * Instead of trionn's arc-converge-into-Services reveal (specific to their
 * own content), the whole pinned panel dissolves to reveal whatever section
 * follows in the real page flow - reusable regardless of what that is.
 *
 * Deliberately given its own FIXED dark colour band (not the theme's
 * flipping --background-primary/--text-primary tokens) so that in light
 * mode this section reads as a distinct panel against the cream page
 * around it, the same way trionn alternates light/dark sections rather
 * than using one flat background throughout.
 *
 * Deliberately NOT wrapped in AnimatedSection or any container with
 * `overflow-hidden` on an ancestor - that broke a previous GSAP pin (see
 * PinnedPillars fix, 2026-09-13 commit).
 */
const FEATURED = caseStudies.slice(0, 6);

const BAND_BG = '#14110D';
const CARD_BG = '#211D17';
const CARD_BORDER = '#332C22';
const INK = '#F3EEE3';
const INK_MUTED = '#A79E8E';

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
        end: () => '+=' + (dist() + window.innerHeight * 1.2),
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

    tl.to(row, { x: () => -dist(), ease: 'none', duration: 1.4 }, 0);
    tl.to(pin, { autoAlpha: 0, duration: 0.6, ease: 'power2.in' }, '+=0.1');

    rise();

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} id="work" className="relative w-full" style={{ background: BAND_BG }}>
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden">
        <div
          ref={introRef}
          className="absolute left-0 top-0 flex h-full flex-col justify-center gap-3 pl-[clamp(20px,5vw,64px)] pr-12 z-10 pointer-events-none"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: INK_MUTED }}>
            Featured Work
          </span>
          <h2 className="max-w-[10ch] text-section font-display font-semibold" style={{ color: INK }}>
            Selected work &amp; systems
          </h2>
        </div>
        <div
          ref={rowRef}
          className="flex h-full items-center gap-8 pl-[42vw] pr-[10vw]"
          style={{ width: 'max-content' }}
        >
          {FEATURED.map((study, i) => (
            <div
              key={study.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="flex w-[min(78vw,420px)] shrink-0 flex-col overflow-hidden rounded-xl border"
              style={{
                height: 'min(56vh, 460px)',
                willChange: 'transform',
                background: CARD_BG,
                borderColor: CARD_BORDER,
              }}
            >
              {/* Project image placeholder (trionn's .wc-shot) - Patrick doesn't
                  have screenshots wired in yet; reserving the space and
                  labelling it honestly rather than faking a photo. */}
              <div
                className="flex h-[42%] items-center justify-center border-b"
                style={{ borderColor: CARD_BORDER, background: 'rgba(255,255,255,0.02)' }}
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: INK_MUTED }}>
                  Screenshot pending
                </span>
              </div>
              <div className="flex flex-1 flex-col justify-between p-7">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-accent-growth">
                    {study.industry}
                  </span>
                  <h3 className="mt-3 text-xl font-display font-semibold" style={{ color: INK }}>
                    {study.company}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: INK_MUTED }}>
                    {study.context}
                  </p>
                </div>
                <div>
                  <b className="block font-display text-3xl font-semibold" style={{ color: INK }}>
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
