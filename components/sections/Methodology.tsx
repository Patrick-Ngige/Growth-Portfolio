'use client';

import { useEffect, useRef, useState } from 'react';
import { methodologySteps } from '@/lib/data';
import SplitText from '@/components/anim/SplitText';
import MagneticButton from '@/components/anim/MagneticButton';

/**
 * Sticky-stack version (option B): intro column on the left, cards on
 * the right that each pin with a small staggered offset while the next
 * one slides up over them. Covered cards scale down and dim; the seated
 * card holds the lighter gray. All of it is driven by scroll position
 * (one scroll listener writing styles directly, no re-render per
 * frame), so it scrubs both directions. Every card keeps the same fixed
 * height. Gray, not white, and no AI-default palette.
 */
const iconComponents = {
  search: (
    <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  lightbulb: (
    <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  code: (
    <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  rocket: (
    <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  chart: (
    <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  refresh: (
    <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
};

const TAGS: Record<number, string[]> = {
  1: ['Analytics Audit', 'Competitive Research', 'Customer Insight'],
  2: ['Testable Assumptions', 'Prioritization', 'Growth Potential'],
  3: ['Rapid Implementation', 'No Handoffs', 'Full Stack'],
  4: ['Tracking Setup', 'Segmentation', 'Deployment'],
  5: ['Data Collection', 'Significance', 'Success Metrics'],
  6: ['Learning Loop', 'Next Experiment', 'Prioritization'],
};

const CAPSULE_GRADIENT: Record<number, string> = {
  1: 'linear-gradient(135deg, #0EA5E9, #0369A1)',
  2: 'linear-gradient(135deg, #FBBF24, #D97706)',
  3: 'linear-gradient(135deg, #FB923C, #C2410C)',
  4: 'linear-gradient(135deg, #EC4899, #9D174D)',
  5: 'linear-gradient(135deg, #34D399, #047857)',
  6: 'linear-gradient(135deg, #A78BFA, #6D28D9)',
};

const STICK_STEP = 14;
const COVER_RANGE = 300;
const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const hexToRgb = (hex: string) => {
  const h = hex.trim().replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};
const mix = (t: number, base: number[], active: number[]) =>
  `rgb(${base.map((b, i) => Math.round(b + (active[i] - b) * t)).join(",")})`;

export default function Methodology() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!cards.length) return;


    let lastActive = 0;

    const update = () => {
      const rootStyle = getComputedStyle(document.documentElement);
      const baseRgb = hexToRgb(rootStyle.getPropertyValue('--card-base'));
      const activeRgb = hexToRgb(rootStyle.getPropertyValue('--card-active'));
      const tops = cards.map((c) => c.getBoundingClientRect().top);
      const stuck = cards.map((c) => parseFloat(getComputedStyle(c).top) || 0);

      // arrival[i]: how far card i has travelled into its stuck position (0 far below, 1 seated)
      const arrival = cards.map((_, i) => (i === 0 ? 1 : clamp(1 - (tops[i] - stuck[i]) / COVER_RANGE)));

      let active = 0;
      arrival.forEach((a, i) => {
        if (a >= 0.98) active = i;
      });
      if (active !== lastActive) {
        lastActive = active;
        setActiveIdx(active);
      }

      cards.forEach((card, i) => {
        let depth = 0;
        for (let k = i + 1; k < cards.length; k++) depth += arrival[k];
        const d = Math.min(depth, 3);
        const own = i === 0 ? 1 : arrival[i];
        const next = i < cards.length - 1 ? arrival[i + 1] : 0;
        const highlight = clamp(own * (1 - next));
        card.style.transform = `scale(${(1 - 0.045 * d).toFixed(3)})`;
        card.style.opacity = (1 - 0.14 * d).toFixed(3);
        card.style.background = mix(highlight, baseRgb, activeRgb);
      });
    };

    const onScroll = () => {
      update();
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    const themeObserver = new MutationObserver(update);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => {
      themeObserver.disconnect();

      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section id="approach" className="relative w-full bg-[var(--background-primary)] py-24 lg:py-32">
      <div className="container-main">
        <div className="grid gap-12 lg:grid-cols-[360px_1fr] lg:gap-16">
          <div className="flex flex-col items-center text-center lg:sticky lg:top-1/2 lg:-translate-y-1/2 lg:self-start">
            <SplitText
              text="How the work gets done"
              as="h2"
              className="text-section font-display font-semibold mb-4 text-[var(--text-primary)]"
              animation="slideUp"
              delay={0}
            />
            <SplitText
              text="Six steps, repeated: test ideas, measure results, keep improving. Simple and focused on real outcomes."
              as="p"
              className="text-body text-[var(--text-secondary)]"
              animation="fadeIn"
              delay={0.2}
            />
            <div className="mt-8">
              <MagneticButton>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--background-surface)] border border-[var(--border-color)] px-6 py-3 font-medium text-[var(--text-primary)] transition-colors hover:border-accent-growth/50"
                >
                  <span>Work with me</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </MagneticButton>
            </div>
          </div>

          <div className="flex flex-col gap-[26vh] pb-[24vh]">
            {methodologySteps.map((step, i) => {
              return (
                <div
                  key={step.step}
                  data-step={step.step}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className="sticky w-full origin-top rounded-[28px] border border-[var(--border-color)]/50 px-7 py-7 will-change-transform sm:px-9 sm:py-8"
                  style={{
                    top: `calc(20vh + ${i * STICK_STEP}px)`,
                    zIndex: i + 1,
                    background: "var(--card-base)",
                  }}
                >
                  <div className="flex items-center justify-between gap-5">
                    <div className="min-w-0 flex-1">
                      <span className="font-mono text-[11px] text-[var(--text-secondary)]">
                        {String(step.step).padStart(2, '0')}
                      </span>
                      <h3 className="mt-1 truncate font-display text-xl font-bold uppercase tracking-tight text-[var(--text-primary)] sm:text-2xl">
                        {step.title}
                      </h3>
                    </div>
                    <div
                      className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-white sm:h-12 sm:w-12"
                      style={{ background: CAPSULE_GRADIENT[step.step] }}
                    >
                      {iconComponents[step.icon as keyof typeof iconComponents]}
                    </div>
                  </div>

                  <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--text-secondary)]">{step.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {TAGS[step.step].map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[var(--chip-bg)] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--text-primary)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
