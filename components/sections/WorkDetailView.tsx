'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { CaseStudy } from '@/lib/data';
import SectionRail, { type RailItem } from '@/components/motion/SectionRail';
import HeroCanvas from '@/components/motion/HeroCanvas';
import Counter from '@/components/anim/Counter';
import MagneticButton from '@/components/anim/MagneticButton';

/**
 * Client half of the work-detail page (the server half in
 * app/work/[slug]/page.tsx keeps generateStaticParams/generateMetadata,
 * which can't live in a 'use client' file). Direction: a cinematic
 * WebGL hero + editorial statement, verified live against fantasy.co's
 * own case-study pages this session (see the "Work Detail Concept"
 * artifact for the research trail) - rebuilt against this project's
 * real data, not Fantasy's copy or imagery.
 */

const RAIL_ITEMS: RailItem[] = [
  { id: 'overview', number: '01', label: 'Overview' },
  { id: 'challenge', number: '02', label: 'Challenge' },
  { id: 'approach', number: '03', label: 'Approach' },
  { id: 'build', number: '04', label: 'Build' },
  { id: 'result', number: '05', label: 'Result' },
];

const revealProps = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

export default function WorkDetailView({ study }: { study: CaseStudy }) {
  const numericMetric = parseFloat(study.metricValue.replace(/[^0-9.-]/g, ''));
  const hasMetricPrefix = study.metricValue.includes('+');

  return (
    <>
      <SectionRail items={RAIL_ITEMS} />

      <article className="w-full">
        {/* Hero - WebGL canvas backdrop, product-as-hero framing */}
        <header className="relative flex min-h-screen w-full flex-col justify-end overflow-hidden bg-[#09090B] px-[clamp(20px,5vw,64px)] pb-16 pt-32">
          <HeroCanvas />

          <div className="relative z-10 mb-auto">
            <Link
              href="/#work"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#A1A1AA] transition-colors hover:text-[#F4F4F5]"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Work
            </Link>
          </div>

          <div className="relative z-10">
            <span className="mb-5 block font-mono text-xs uppercase tracking-[0.14em] text-[#A1A1AA]">
              Work / {study.industry}
            </span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-4xl font-display text-5xl font-bold leading-[0.98] text-[#F4F4F5] sm:text-6xl lg:text-7xl"
            >
              {study.company}
            </motion.h1>

            <div className="mt-10 flex flex-wrap items-baseline gap-3 border-t border-white/10 pt-8">
              <span className="font-display text-4xl font-bold text-accent-growth">
                {isNaN(numericMetric) ? (
                  study.metricValue
                ) : (
                  <Counter value={numericMetric} prefix={hasMetricPrefix ? '+' : ''} duration={1.6} delay={0.4} />
                )}
              </span>
              <span className="font-mono text-sm uppercase tracking-[0.08em] text-[#A1A1AA]">
                {study.metricLabel}
              </span>
            </div>
          </div>
        </header>

        {/* 01 / Overview - editorial statement + honest placeholder collage */}
        <section id="overview" className="border-t border-[var(--border-color)]/30 bg-[#0d0d0c] py-20 lg:py-28">
          <div className="container-main">
            <motion.div {...revealProps} className="mb-14 flex items-start gap-5">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent-growth font-display text-sm font-bold text-[#09090B]">
                P.
              </span>
              <div>
                <span className="mb-3 block font-mono text-xs uppercase tracking-[0.14em] text-[#71717A]">01 / Overview</span>
                <p className="max-w-2xl font-display text-2xl font-semibold leading-[1.3] text-[#F4F4F5] lg:text-3xl">
                  {study.context}
                </p>
              </div>
            </motion.div>

            <motion.div
              {...revealProps}
              className="grid grid-cols-3 gap-3.5 sm:gap-4"
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="flex aspect-[9/14] items-center justify-center rounded-2xl border border-white/10 bg-[#141412]"
                  style={i === 1 ? { marginTop: '-24px', marginBottom: '-24px', borderColor: 'rgba(251,146,60,0.18)' } : undefined}
                >
                  <span className="px-3 text-center font-mono text-[9px] uppercase tracking-[0.06em] text-[#52525B]">
                    Screenshot pending
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Brisk chapters - alternating tone for rhythm, no padding */}
        <motion.section
          {...revealProps}
          id="challenge"
          className="border-t border-[var(--border-color)]/30 bg-[var(--background-primary)] py-16 lg:py-20"
        >
          <div className="container-main max-w-3xl">
            <span className="mb-4 block font-mono text-xs uppercase tracking-[0.14em] text-accent-growth">02 / Challenge</span>
            <p className="text-lg leading-relaxed text-[var(--text-primary)] lg:text-xl">{study.challenge}</p>
          </div>
        </motion.section>

        <motion.section
          {...revealProps}
          id="approach"
          className="border-t border-[var(--border-color)]/30 bg-[var(--surface-color)] py-16 dark:bg-[var(--background-surface)] lg:py-20"
        >
          <div className="container-main max-w-3xl">
            <span className="mb-4 block font-mono text-xs uppercase tracking-[0.14em] text-accent-growth">03 / Approach</span>
            <p className="text-lg leading-relaxed text-[var(--text-primary)] lg:text-xl">{study.approach}</p>
          </div>
        </motion.section>

        <motion.section
          {...revealProps}
          id="build"
          className="border-t border-[var(--border-color)]/30 bg-[var(--background-primary)] py-16 lg:py-20"
        >
          <div className="container-main max-w-3xl">
            <span className="mb-4 block font-mono text-xs uppercase tracking-[0.14em] text-accent-growth">04 / Build</span>
            <ul className="space-y-3">
              {study.technicalExecution.map((item) => (
                <li key={item} className="flex items-start gap-3 text-lg text-[var(--text-primary)]">
                  <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-growth" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.section>

        <motion.section
          {...revealProps}
          id="result"
          className="border-t border-[var(--border-color)]/30 bg-[var(--surface-color)] py-16 dark:bg-[var(--background-surface)] lg:py-28"
        >
          <div className="container-main max-w-3xl">
            <span className="mb-4 block font-mono text-xs uppercase tracking-[0.14em] text-accent-growth">05 / Result</span>
            <p className="text-xl leading-relaxed text-[var(--text-primary)] lg:text-2xl">{study.result}</p>

            <div className="mt-10 flex flex-wrap gap-2">
              {study.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[var(--border-color)] px-3 py-1 font-mono text-xs uppercase tracking-[0.06em] text-[var(--text-secondary)]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-14">
              <MagneticButton strength={30}>
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 rounded-full bg-accent-growth px-6 py-3 font-medium text-[var(--background-primary)] transition-colors hover:bg-accent-growth/90"
                >
                  <span>Work with me</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </MagneticButton>
            </div>
          </div>
        </motion.section>
      </article>
    </>
  );
}
