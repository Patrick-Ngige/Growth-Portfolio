'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { caseStudies } from '@/lib/data';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * A cinematic teaser for the home page, ported from trionn-rebuild's
 * src/components/home/work.js (Selected Work section): the row of cards
 * scrolls horizontally while pinned, each card rising into focus with a
 * cubic-eased translateY as it crosses the viewport's centre - then, instead
 * of trionn's arc-converge-into-Services reveal (specific to their own
 * content), the whole pinned panel dissolves to reveal whatever section
 * follows in the real page flow. Reusable wherever a pinned scroll needs to
 * hand off to the next section, not just here.
 *
 * Deliberately NOT wrapped in AnimatedSection or any container with
 * `overflow-hidden` on an ancestor - that broke a previous GSAP pin (see
 * PinnedPillars fix, 2026-09-13 commit). GSAP's `pin: true` uses
 * `position: fixed` while active, which isn't affected by ancestor overflow
 * the way CSS `position: sticky` is, but keeping this section un-nested
 * avoids the whole class of bug rather than relying on that distinction.
 */
const FEATURED = caseStudies.slice(0, 6);

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

    const rise = () => {
      const vw = window.innerWidth;
      cards.forEach((card) => {
        const r = card.getBoundingClientRect();
        const t = (r.left + r.width / 2) / vw;
        const p = gsap.utils.clamp(0, 1, (t - 0.5) / 0.45);
        const eased = p * p * p;
        card.style.transform = `translateY(${(eased * 90).toFixed(1)}px)`;
        card.style.opacity = String(gsap.utils.clamp(0.35, 1, 1 - eased * 0.7));
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
    <section ref={sectionRef} id="featured-work" className="relative w-full bg-[var(--background-primary)]">
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden">
        <div
          ref={introRef}
          className="absolute left-0 top-0 flex h-full flex-col justify-center gap-3 pl-[clamp(20px,5vw,64px)] pr-12 z-10 pointer-events-none"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--text-secondary)]">
            Featured Work
          </span>
          <h2 className="max-w-[10ch] text-section font-display font-semibold text-[var(--text-primary)]">
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
              className="flex w-[min(78vw,420px)] shrink-0 flex-col justify-between rounded-xl border border-[var(--border-color)] bg-[var(--background-surface)] p-8"
              style={{ height: 'min(56vh, 460px)', willChange: 'transform, opacity' }}
            >
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-accent-growth">
                  {study.industry}
                </span>
                <h3 className="mt-3 text-xl font-display font-semibold text-[var(--text-primary)]">
                  {study.company}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {study.context}
                </p>
              </div>
              <div>
                <b className="block font-display text-3xl font-semibold text-[var(--text-primary)]">
                  {study.metricValue}
                </b>
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  {study.metricLabel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
