'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { caseStudies, type CaseStudy } from '@/lib/data';
import Counter from '@/components/anim/Counter';
import MagneticButton from '@/components/anim/MagneticButton';
import WorkGallery from '@/components/sections/WorkGallery';

/**
 * Client half of the work-detail page (the server half in
 * app/work/[slug]/page.tsx keeps generateStaticParams/generateMetadata,
 * which can't live in a 'use client' file). Direction: a cinematic
 * hero + editorial statement, verified live against fantasy.co's own
 * case-study pages this session (see the "Work Detail Concept" artifact
 * for the research trail) - rebuilt against this project's real data,
 * not Fantasy's copy or imagery.
 *
 * The WebGL backdrop (components/motion/HeroCanvas.tsx) is deliberately
 * NOT mounted here for now - measured at 2-3fps in this session's own
 * verification, and the underlying cost couldn't be cleanly isolated
 * from a possible fixed per-frame GPU overhead in the sandboxed test
 * browser itself, so it needs a real-device check before it comes back.
 * The component still exists, untouched, ready to re-enable.
 *
 * The SectionRail scroll menu is disabled for the same reason: paused
 * for now at the user's request while other parts of the page are
 * still being reworked, not removed. components/motion/SectionRail.tsx
 * is untouched and ready to re-enable.
 *
 * Backgrounds are theme-reactive from here down (Overview through Build
 * use the site's CSS variable tokens), per a live teardown of
 * arpeggio.framer.website's own case-study page: that page stays white
 * for nearly every ordinary section and spends its only two full-black
 * bands on Credits and the closing CTA, a hard-edged cut with no
 * gradient or crossfade, not an alternating light/dark rhythm. Result +
 * More work is our equivalent closing beat, kept permanently dark the
 * same way Footer.tsx is always dark regardless of the site theme
 * ("the one place that's always dark") - so it reuses that literal
 * fixed-dark palette rather than a CSS variable.
 */

const CATEGORY_LABEL: Record<CaseStudy['category'], string> = {
  web: 'Web & Conversion',
  'paid-media': 'Paid Media',
  strategy: 'Growth Strategy',
};

// Icon-tagged meta rows and chapter pills, borrowed from Kora's case-study
// pages (kora.framer.media/cases/sitemark): small icon next to each label
// instead of bare mono text.
function IndustryIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1m-1 4h1m4-4h1m-1 4h1m-5 8v-4h4v4" />
    </svg>
  );
}
function TypeIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5h16M4 12h10M4 19h16" />
    </svg>
  );
}
function StackIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3l9 5-9 5-9-5 9-5zm-9 9l9 5 9-5m-18 5l9 5 9-5" />
    </svg>
  );
}
function ChallengeIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86l-8.18 14.18A1 1 0 003 19.5h18a1 1 0 00.89-1.46L13.71 3.86a1 1 0 00-1.72 0z" />
    </svg>
  );
}
function ApproachIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" strokeWidth={2} />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 9l-4.5 6L9 12.5" />
    </svg>
  );
}
function BuildIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.27 6.96L12 12l8.73-5.04M12 22.08V12" />
    </svg>
  );
}
function ResultIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 17l6-6 4 4 8-8m0 0h-5m5 0v5" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" strokeWidth={2} />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 7v5l3 3" />
    </svg>
  );
}

function ChapterPill({ icon, label, dark }: { icon: ReactNode; label: string; dark?: boolean }) {
  return (
    <span
      className={
        dark
          ? 'mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.1em] text-accent-growth'
          : 'mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--background-surface)] px-3 py-1.5 font-mono text-xs uppercase tracking-[0.1em] text-accent-growth lg:mb-6'
      }
    >
      {icon}
      {label}
    </span>
  );
}

// Splits a result sentence/paragraph into individual claims for the
// checklist below, borrowed from Kora's "Results" chapter (a list of
// checkmarked wins, not one paragraph). No new facts invented - same
// text, just broken at sentence boundaries.
function splitResultHighlights(result: string): string[] {
  return result
    .split(/(?<=[.!?])\s+(?=[A-Z])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

const revealProps = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

export default function WorkDetailView({ study }: { study: CaseStudy }) {
  const metricParts = study.metricValue.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
  const metricPrefix = metricParts?.[1] ?? '';
  const numericMetric = metricParts ? parseFloat(metricParts[2]) : NaN;
  const metricSuffix = metricParts?.[3] ?? '';
  const moreWork = caseStudies.filter((c) => c.id !== study.id).slice(0, 3);

  return (
    <>
      <article className="w-full">
        {/* Hero - static gradient for now (WebGL backdrop paused, see the
            note above), theme-reactive: eases between the surface and
            primary background tokens instead of a fixed warm-dark stop. */}
        <header
          className="relative flex min-h-[72vh] w-full flex-col justify-end overflow-hidden px-[clamp(20px,5vw,64px)] pb-14 pt-32"
          style={{ background: 'linear-gradient(160deg, var(--background-surface) 0%, var(--background-primary) 60%)' }}
        >
          <div className="relative z-10 mb-auto">
            <Link
              href="/#work"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Work
            </Link>
          </div>

          <div className="relative z-10">
            <span className="mb-5 block font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)]">
              Work / {study.industry}
            </span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-4xl font-display text-5xl font-bold leading-[0.98] text-[var(--text-primary)] sm:text-6xl lg:text-7xl"
            >
              {study.company}
            </motion.h1>

            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--text-primary)] lg:text-xl">{study.context}</p>
          </div>
        </header>

        {/* Overview through Build follow the site's light/dark tokens.
            No border between sections; each chapter gets its own layout
            instead of a divider line to tell them apart. */}
        <div className="bg-[var(--background-primary)]">

          {/* Facts + headline metric, the proof-first opener borrowed from
              Kora's case pages: who/what/with-what on the left, the one
              number that matters on the right. Only fields that exist in
              the data, no invented metrics. */}
          <section id="overview" className="py-16 lg:py-24">
            <div className="container-main">
              <motion.div {...revealProps} className="grid gap-3.5 sm:gap-4 lg:grid-cols-[1.4fr_1fr]">
                <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--background-surface)] p-6 sm:p-8">
                  <dl className="grid gap-5 sm:grid-cols-[120px_1fr] sm:gap-y-6">
                    <dt className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-secondary)]">
                      <IndustryIcon />
                      Industry
                    </dt>
                    <dd className="text-base text-[var(--text-primary)]">{study.industry}</dd>
                    <dt className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-secondary)]">
                      <TypeIcon />
                      Type
                    </dt>
                    <dd className="text-base text-[var(--text-primary)]">{CATEGORY_LABEL[study.category]}</dd>
                    <dt className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-secondary)]">
                      <StackIcon />
                      Stack
                    </dt>
                    <dd className="flex flex-wrap gap-2">
                      {study.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-[var(--border-color)] px-3 py-1 font-mono text-xs uppercase tracking-[0.06em] text-[var(--text-secondary)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </dd>
                  </dl>
                </div>
                <div className="flex flex-col justify-between rounded-2xl border border-[var(--border-color)] bg-[var(--background-surface)] p-6 sm:p-8">
                  <span className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-secondary)]">Headline result</span>
                  <div className="mt-8">
                    <span className="block break-words font-display text-5xl font-bold leading-none text-accent-growth sm:text-6xl">
                      {isNaN(numericMetric) ? (
                        study.metricValue
                      ) : (
                        <Counter value={numericMetric} prefix={metricPrefix} suffix={metricSuffix} duration={1.6} delay={0.2} />
                      )}
                    </span>
                    <span className="mt-3 block text-sm text-[var(--text-secondary)]">{study.metricLabel}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Gallery - see WorkGallery.tsx for the tiered hero/coverflow/
              fanned-stack composition and why each tier only renders when
              there's enough real material for it. */}
          <section id="gallery" className="pb-16 lg:pb-24">
            <div className="container-main">
              <motion.div {...revealProps}>
                <WorkGallery images={study.images} company={study.company} />
              </motion.div>
            </div>
          </section>

          {/* 01 / Challenge - a pull-quote, not a paragraph: this chapter
              is one tension to sit with, so it gets the biggest type of
              any chapter and a side accent instead of a label-over-text
              layout. */}
          <motion.section {...revealProps} id="challenge" className="py-24 lg:py-32">
            <div className="container-main">
              <div className="flex gap-6 lg:gap-10">
                <span className="hidden flex-shrink-0 font-display text-[10vw] font-bold leading-none text-[var(--text-primary)] opacity-[0.05] lg:block lg:text-[7rem]">
                  01
                </span>
                <div className="border-l-2 border-accent-growth/40 pl-6 lg:pl-10">
                  <ChapterPill icon={<ChallengeIcon />} label="The Challenge" />
                  <p className="max-w-3xl font-display text-3xl font-semibold leading-[1.25] text-[var(--text-primary)] lg:text-4xl">
                    {study.challenge}
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* 02 / Approach - asymmetric two-column: number+label held to a
              narrow left rail, the approach text and the tools it used
              together on the right, so "how" and "with what" read as one
              beat instead of tags bolted onto the closing chapter. */}
          <motion.section {...revealProps} id="approach" className="py-20 lg:py-28">
            <div className="container-main">
              <div className="grid gap-8 lg:grid-cols-[160px_1fr] lg:gap-16">
                <div>
                  <span className="font-display text-5xl font-bold text-[var(--text-primary)] opacity-10">02</span>
                  <div className="mt-2">
                    <ChapterPill icon={<ApproachIcon />} label="The Approach" />
                  </div>
                </div>
                <div>
                  <p className="max-w-2xl text-lg leading-relaxed text-[var(--text-primary)] lg:text-xl">{study.approach}</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* 03 / Build - a grid of cards instead of a bulleted list, so
              the technical execution reads as a system of parts, not a
              checklist. */}
          <motion.section {...revealProps} id="build" className="py-20 lg:py-28">
            <div className="container-main">
              <ChapterPill icon={<BuildIcon />} label="The Build" />
              <div className="grid gap-3.5 sm:grid-cols-2 sm:gap-4">
                {study.technicalExecution.map((item, i) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-[var(--border-color)] bg-[var(--background-surface)] p-6"
                  >
                    <span className="mb-3 block font-mono text-xs text-accent-growth">{String(i + 1).padStart(2, '0')}</span>
                    <p className="text-base leading-snug text-[var(--text-primary)]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

        </div>

        {/* Result + More work - the closing beat, kept permanently dark
            like Footer.tsx regardless of the site theme (see the header
            note above). Full-bleed, hard-edged, no gradient into it: the
            arpeggio.framer.website teardown found the same, a clean cut
            into its two black sections rather than a crossfade. */}
        <div className="bg-[#09090B]">
          <motion.section {...revealProps} id="result" className="py-24 lg:py-36">
            <div className="container-main">
              <ChapterPill icon={<ResultIcon />} label="The Results" dark />

              {(() => {
                if (study.inProgress) {
                  return (
                    <div className="max-w-2xl rounded-2xl border border-dashed border-white/20 bg-white/[0.03] px-7 py-8 sm:px-9 sm:py-10">
                      <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[#F4F4F5]">
                        <ClockIcon />
                      </span>
                      <p className="font-display text-2xl font-semibold leading-[1.3] text-[#A1A1AA] sm:text-3xl">
                        {study.result}
                      </p>
                    </div>
                  );
                }
                const highlights = splitResultHighlights(study.result);
                if (highlights.length < 2) {
                  return (
                    <div className="max-w-2xl rounded-2xl border border-white/10 bg-white/5 px-7 py-8 sm:px-9 sm:py-10">
                      <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-accent-growth text-[#09090B]">
                        <CheckIcon />
                      </span>
                      <p className="font-display text-2xl font-semibold leading-[1.3] text-[#F4F4F5] sm:text-3xl">
                        {study.result}
                      </p>
                    </div>
                  );
                }
                return (
                  <ul className="max-w-2xl space-y-3">
                    {highlights.map((line) => (
                      <li
                        key={line}
                        className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5"
                      >
                        <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent-growth text-[#09090B]">
                          <CheckIcon />
                        </span>
                        <span className="text-base leading-snug text-[#F4F4F5] sm:text-lg">{line}</span>
                      </li>
                    ))}
                  </ul>
                );
              })()}

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

          <section id="more-work" className="pb-24 lg:pb-32">
            <div className="container-main">
              <div className="mb-8 flex items-end justify-between gap-4">
                <h2 className="font-display text-2xl font-semibold text-[#F4F4F5] lg:text-3xl">More work</h2>
                <Link href="/work" className="text-sm font-medium text-[#A1A1AA] transition-colors hover:text-[#F4F4F5]">
                  View all
                </Link>
              </div>
              <div className="grid gap-3.5 sm:gap-4 md:grid-cols-3">
                {moreWork.map((item) => (
                  <Link
                    key={item.id}
                    href={`/work/${item.id}`}
                    className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0d0d0c] p-6 transition-colors hover:border-accent-growth/40"
                  >
                    <span className="font-mono text-xs uppercase tracking-[0.12em] text-[#71717A]">{item.industry}</span>
                    <h3 className="mt-6 font-display text-xl font-semibold leading-snug text-[#F4F4F5]">{item.company}</h3>
                    <div className="mt-6 flex items-baseline gap-2 border-t border-white/10 pt-4">
                      <span className="font-display text-2xl font-bold text-accent-growth">{item.metricValue}</span>
                      <span className="text-xs text-[#A1A1AA]">{item.metricLabel}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

        </div>
      </article>
    </>
  );
}
