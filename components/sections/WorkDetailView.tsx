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

        {/* One continuous dark canvas from here to the end - deliberately
            fixed, not theme-reactive, same precedent already set by
            Footer.tsx and FeaturedWorkReel elsewhere on this site ("the
            one place that's always dark"). No border between sections;
            each chapter gets its own layout instead of a divider line to
            tell them apart. */}
        <div className="bg-[#09090B]">

          {/* 01 / Overview - editorial statement + honest placeholder collage */}
          <section id="overview" className="py-20 lg:py-28">
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

              <motion.div {...revealProps} className="grid grid-cols-3 gap-3.5 sm:gap-4">
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

          {/* 02 / Challenge - a pull-quote, not a paragraph: this chapter
              is one tension to sit with, so it gets the biggest type of
              any chapter and a side accent instead of a label-over-text
              layout. */}
          <motion.section {...revealProps} id="challenge" className="py-24 lg:py-32">
            <div className="container-main">
              <div className="flex gap-6 lg:gap-10">
                <span className="hidden flex-shrink-0 font-display text-[10vw] font-bold leading-none text-white/[0.04] lg:block lg:text-[7rem]">
                  02
                </span>
                <div className="border-l-2 border-accent-growth/40 pl-6 lg:pl-10">
                  <span className="mb-4 block font-mono text-xs uppercase tracking-[0.14em] text-accent-growth lg:hidden">02 / Challenge</span>
                  <p className="max-w-3xl font-display text-3xl font-semibold leading-[1.25] text-[#F4F4F5] lg:text-4xl">
                    {study.challenge}
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* 03 / Approach - asymmetric two-column: number+label held to a
              narrow left rail, the approach text and the tools it used
              together on the right, so "how" and "with what" read as one
              beat instead of tags bolted onto the closing chapter. */}
          <motion.section {...revealProps} id="approach" className="py-20 lg:py-28">
            <div className="container-main">
              <div className="grid gap-8 lg:grid-cols-[160px_1fr] lg:gap-16">
                <div>
                  <span className="font-display text-5xl font-bold text-white/10">03</span>
                  <span className="mt-2 block font-mono text-xs uppercase tracking-[0.14em] text-[#71717A]">Approach</span>
                </div>
                <div>
                  <p className="max-w-2xl text-lg leading-relaxed text-[#D4D4D8] lg:text-xl">{study.approach}</p>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {study.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.06em] text-[#A1A1AA]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* 04 / Build - a grid of cards instead of a bulleted list, so
              the technical execution reads as a system of parts, not a
              checklist. */}
          <motion.section {...revealProps} id="build" className="py-20 lg:py-28">
            <div className="container-main">
              <span className="mb-8 block font-mono text-xs uppercase tracking-[0.14em] text-accent-growth">04 / Build</span>
              <div className="grid gap-3.5 sm:grid-cols-2 sm:gap-4">
                {study.technicalExecution.map((item, i) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-[#0d0d0c] p-6"
                  >
                    <span className="mb-3 block font-mono text-xs text-accent-growth">{String(i + 1).padStart(2, '0')}</span>
                    <p className="text-base leading-snug text-[#F4F4F5]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* 05 / Result - the closing statement, biggest and plainest
              beat on the page: just the outcome and the ask, nothing
              competing for attention. */}
          <motion.section {...revealProps} id="result" className="py-24 lg:py-36">
            <div className="container-main">
              <span className="mb-6 block font-mono text-xs uppercase tracking-[0.14em] text-accent-growth">05 / Result</span>
              <p className="max-w-3xl font-display text-3xl font-semibold leading-[1.25] text-[#F4F4F5] lg:text-4xl">
                {study.result}
              </p>

              <div className="mt-14">
                <MagneticButton strength={30}>
                  <Link
                    href="/#contact"
                    className="inline-flex items-center gap-2 rounded-full bg-accent-growth px-6 py-3 font-medium text-[#09090B] transition-colors hover:bg-accent-growth/90"
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

        </div>
      </article>
    </>
  );
}
