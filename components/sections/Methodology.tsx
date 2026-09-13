'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { methodologySteps } from '@/lib/data';
import SplitText from '@/components/anim/SplitText';
import MagneticButton from '@/components/anim/MagneticButton';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Rebuilt per the shared "SERVICES" inspo (a marquee heading over numbered
 * rows) combined with trionn-rebuild's about/process.js: steps sit dim and
 * dropped until the section pins and a scrub timeline lifts each one into
 * focus in its own time slot. The icon capsules from the inspo are stock
 * illustration Patrick doesn't have, so the numbered mark itself carries
 * that role instead of a placeholder graphic.
 */
const iconComponents = {
  search: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  lightbulb: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  code: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  rocket: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  chart: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  refresh: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
};

export default function Methodology() {
  const pinTrackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const track = pinTrackRef.current;
    const sticky = stickyRef.current;
    if (!track || !sticky || reduced) return;

    const steps = stepRefs.current.filter(Boolean) as HTMLDivElement[];
    gsap.set(steps, { opacity: 0.18, y: 26 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: track,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        pin: sticky,
        anticipatePin: 1,
      },
    });

    steps.forEach((step, i) => {
      tl.to(step, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.7 }, i * 0.9);
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section id="approach" className="relative w-full bg-[var(--background-primary)]">
      {/* Marquee heading, above the pinned reveal */}
      <div className="overflow-hidden border-y border-[var(--border-color)]/40 py-5">
        <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, i) => (
            <span
              key={i}
              className="flex items-center gap-10 text-[clamp(28px,6vw,64px)] font-display font-semibold uppercase tracking-tight text-[var(--text-primary)]"
              aria-hidden={i === 1}
            >
              Approach
              <span className="text-accent-growth">&bull;</span>
              Approach
              <span className="text-accent-growth">&bull;</span>
            </span>
          ))}
        </div>
      </div>

      <div className="container-main pt-16 lg:pt-20">
        <div className="mx-auto mb-16 flex max-w-2xl flex-col items-center justify-center text-center">
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
        </div>
      </div>

      {/* Pinned sequential reveal, ported from trionn-rebuild's about/process.js */}
      <div ref={pinTrackRef} className="relative" style={{ height: `${methodologySteps.length * 60}vh` }}>
        <div ref={stickyRef} className="flex h-screen w-full items-center">
          <div className="container-main">
            <div className="mx-auto flex max-w-3xl flex-col gap-3">
              {methodologySteps.map((step, i) => (
                <div
                  key={step.step}
                  ref={(el) => {
                    stepRefs.current[i] = el;
                  }}
                  className="flex items-center gap-6 rounded-2xl border border-[var(--border-color)]/40 bg-[var(--background-surface)] px-7 py-6"
                >
                  <span className="font-mono text-xs text-[var(--text-secondary)]">
                    {String(step.step).padStart(2, '0')}
                  </span>
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-accent-growth/10 text-accent-growth">
                    {iconComponents[step.icon as keyof typeof iconComponents]}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container-main pb-24 lg:pb-32">
        <div className="text-center">
          <p className="mb-4 text-body text-[var(--text-secondary)]">Ready to work together?</p>
          <MagneticButton>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-accent-growth px-6 py-3 font-medium text-[var(--background-primary)] transition-colors hover:bg-accent-growth/90"
            >
              <span>Get in touch</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
