'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { caseStudies, type CaseStudy } from '@/lib/data';
import Counter from '@/components/anim/Counter';
import MagneticButton from '@/components/anim/MagneticButton';
import MagicButton from '@/components/ui/MagicButton';
import { useGalleryTiers, GalleryHero, GalleryPlaceholder, Coverflow, VerticalStack } from '@/components/sections/WorkGallery';

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

// Plain mono-colour label, no border/background/icon - exactly the
// ".chapter-pill" treatment approved in the "Case Study Structure"
// artifact (pamidordesign.co/work/rise's structural language), not the
// site's older bordered-badge ChapterPill this replaced.
function RailLabel({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      className={`font-mono text-[11px] uppercase tracking-[0.1em] ${dark ? 'text-[#009C4A]' : 'text-accent-growth'}`}
    >
      {children}
    </span>
  );
}

// A thin full-width rule before every chapter, matching pamidordesign.co's
// own convention (both Rise and Figcoms open every section - the meta grid,
// each numbered Approach step, each named chapter - with the same
// `h-[1.5px] w-full bg-rule` line, confirmed by inspecting their DOM live).
function SectionRule({ dark }: { dark?: boolean }) {
  return <div aria-hidden="true" className={`mb-8 h-px w-full lg:mb-10 ${dark ? 'bg-white/10' : 'bg-accent-growth/20'}`} />;
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

// Read off text already in the data rather than inventing a "Team" field:
// most agency work says "Creative Edge / FCB Nairobi" directly in its
// context sentence, and solo work says so in the company name itself
// (e.g. "PulseKE (personal project, solo product)").
function getTeamLabel(study: CaseStudy): string {
  if (/creative edge\s*\/\s*fcb nairobi/i.test(study.context)) return 'Creative Edge / FCB Nairobi';
  if (/personal project|solo-built|solo product/i.test(study.company)) return 'Solo';
  return 'Independent';
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
  const gallery = useGalleryTiers(study.images);

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
              className="max-w-4xl font-display text-5xl font-bold leading-[0.98] text-accent-growth sm:text-6xl lg:text-7xl"
            >
              {study.company}
            </motion.h1>

            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--text-primary)] lg:text-xl">{study.context}</p>

            {/* Tag pills right under the title - borrowed from pamidordesign.co's
                Rise case study (Product Design / Brand Design / UX|UI pills under
                the H1), approved via the "Case Study Structure" artifact. */}
            <div className="mt-6 flex flex-wrap gap-2">
              {study.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-accent-growth/25 bg-accent-growth/10 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-accent-growth"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* Overview through Build follow the site's light/dark tokens.
            No border between sections; each chapter gets its own layout
            instead of a divider line to tell them apart. */}
        <div className="bg-[var(--background-primary)]">

          {/* Meta grid - Rise's Role/Timeline/Year/Team row, adapted to
              fields this data model actually has: Industry, Type, Team
              (read off the case study's own context text, not invented),
              and Scope (the one metric, shown compactly here - it reappears
              big in the closing Results chapter, not duplicated in between). */}
          <section id="overview" className="py-14 lg:py-20">
            <div className="container-main">
              <motion.dl
                {...revealProps}
                className="grid grid-cols-2 gap-x-6 gap-y-8 border-y border-[var(--border-color)] py-7 sm:grid-cols-4 sm:py-8"
              >
                <div>
                  <dt className="mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-secondary)]">Industry</dt>
                  <dd className="text-sm text-[var(--text-primary)] sm:text-base">{study.industry}</dd>
                </div>
                <div>
                  <dt className="mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-secondary)]">Type</dt>
                  <dd className="text-sm text-[var(--text-primary)] sm:text-base">{CATEGORY_LABEL[study.category]}</dd>
                </div>
                <div>
                  <dt className="mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-secondary)]">Team</dt>
                  <dd className="text-sm text-[var(--text-primary)] sm:text-base">{getTeamLabel(study)}</dd>
                </div>
                <div>
                  <dt className="mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-secondary)]">Scope</dt>
                  <dd className="text-sm text-[var(--text-primary)] sm:text-base">
                    {study.metricValue} {study.metricLabel}
                  </dd>
                </div>
              </motion.dl>
            </div>
          </section>

          {/* My Role - the same left-rail/right-content shape used for
              every applicable chapter below, per the "Case Study Structure"
              artifact. Pulls from technicalExecution rather than duplicating
              it in a separate "Build" chapter further down (that chapter is
              gone now - this is the one place this content appears). */}
          <motion.section {...revealProps} id="role" className="pb-16 lg:pb-24">
            <div className="container-main">
              <SectionRule />
              <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:gap-16">
                <div>
                  <RailLabel>My Role</RailLabel>
                </div>
                <ul className="flex flex-col gap-3.5">
                  {study.technicalExecution.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-base leading-relaxed text-[var(--text-primary)]">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-growth" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Gallery hero - the lead shot, right after My Role. See
              WorkGallery.tsx for the coverflow and pinned-slider tiers,
              which are spaced out between the later chapters below instead
              of bunched here, so screenshots punctuate the narrative
              rather than being dumped in one block before it starts. */}
          <section id="gallery" className="pb-16 lg:pb-24">
            <div className="container-main">
              <motion.div {...revealProps}>
                {gallery.hero ? (
                  <GalleryHero src={gallery.hero} company={study.company} count={gallery.count} />
                ) : (
                  <GalleryPlaceholder />
                )}
              </motion.div>
            </div>
          </section>

          {/* Part 01 / Challenge - left rail (part number + pill), content
              on the right. Same rail shape as My Role and Approach below,
              per the "Case Study Structure" artifact: one consistent layout
              for every applicable chapter instead of a different treatment
              each time. Heading size/weight (20px/500) tuned down from an
              earlier, too-large 2xl/bold pass per direct feedback. */}
          <motion.section {...revealProps} id="challenge" className="py-16 lg:py-24">
            <div className="container-main">
              <SectionRule />
              <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:gap-16">
                <div>
                  <span className="mb-2 block font-display text-xs font-bold text-accent-growth opacity-40">Part 01</span>
                  <RailLabel>The Challenge</RailLabel>
                </div>
                <p className="text-xl font-medium leading-[1.4] text-[var(--text-primary)]">{study.challenge}</p>
              </div>
            </div>
          </motion.section>

          {/* Coverflow tier - a visual breather right after the tension of
              the Challenge statement, before Approach explains how it was
              solved. Only renders when there's real material for it (3+
              images left after the hero). */}
          {gallery.coverflowImages && (
            <motion.section {...revealProps} className="pb-20 lg:pb-28">
              <div className="container-main">
                <Coverflow images={gallery.coverflowImages} company={study.company} />
              </div>
            </motion.section>
          )}

          {/* Part 02 / Approach - same rail shape as Challenge and My Role. */}
          <motion.section {...revealProps} id="approach" className="py-16 lg:py-24">
            <div className="container-main">
              <SectionRule />
              <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:gap-16">
                <div>
                  <span className="mb-2 block font-display text-xs font-bold text-accent-growth opacity-40">Part 02</span>
                  <RailLabel>The Approach</RailLabel>
                </div>
                <p className="text-lg leading-relaxed text-[var(--text-primary)] lg:text-xl">{study.approach}</p>
              </div>
            </div>
          </motion.section>

          {/* Vertical stack - whatever screenshots are left after the hero
              and coverflow claim theirs, placed as a last visual beat right
              before the Results chapter closes the story out. Only renders
              when there's material left for it. Full-width, uncropped
              portrait screenshots in normal document flow (see
              WorkGallery.tsx) rather than the earlier GSAP-pinned
              horizontal slider, which fought against this project's own
              portrait screenshots by force-cropping them to 4:3. */}
          {gallery.stackImages.length > 0 && (
            <motion.section {...revealProps} className="pb-20 lg:pb-28">
              <div className="container-main">
                <SectionRule />
                <VerticalStack images={gallery.stackImages} company={study.company} />
              </div>
            </motion.section>
          )}

        </div>

        {/* Result + More work - the closing beat, kept permanently dark
            like Footer.tsx regardless of the site theme (see the header
            note above) - ink and accent colours here are hardcoded to the
            dark-mode set rather than the theme-reactive classes used
            elsewhere in this file, since --fixed-panel-bg (this band's
            background) is itself the light-mode accent colour: a
            theme-reactive accent-growth text/fill would vanish into its
            own background in light mode. Full-bleed, hard-edged, no
            gradient into it: the arpeggio.framer.website teardown found
            the same, a clean cut into its two black sections rather than
            a crossfade. */}
        <div style={{ background: 'var(--fixed-panel-bg-soft)' }}>
          <motion.section {...revealProps} id="result" className="py-24 lg:py-36">
            <div className="container-main">
              <SectionRule dark />
              <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:gap-16">
                <div>
                  <RailLabel dark>Result</RailLabel>
                </div>
                <div>
                  {/* The one number that matters, moved here from the old
                      Overview facts row per the "Case Study Structure"
                      artifact - shown once, big, right where the results
                      text backs it up, instead of floating alone at the top
                      of the page. */}
                  <div className="mb-10">
                    <span className="block break-words font-display text-6xl font-bold leading-none text-[#009C4A] sm:text-7xl">
                      {isNaN(numericMetric) ? (
                        study.metricValue
                      ) : (
                        <Counter value={numericMetric} prefix={metricPrefix} suffix={metricSuffix} duration={1.6} delay={0.2} />
                      )}
                    </span>
                    <span className="mt-3 block text-sm text-[#A1A1AA]">{study.metricLabel}</span>
                  </div>

                  {(() => {
                    if (study.inProgress) {
                      return (
                        <div className="rounded-2xl border border-dashed border-white/20 bg-white/[0.03] px-7 py-8 sm:px-9 sm:py-10">
                          <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[#F4F4F5]">
                            <ClockIcon />
                          </span>
                          <p className="font-display text-xl font-semibold leading-[1.35] text-[#A1A1AA] sm:text-2xl">
                            {study.result}
                          </p>
                        </div>
                      );
                    }
                    const highlights = splitResultHighlights(study.result);
                    if (highlights.length < 2) {
                      return (
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-7 py-8 sm:px-9 sm:py-10">
                          <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#009C4A] text-[#09090B]">
                            <CheckIcon />
                          </span>
                          <p className="font-display text-xl font-semibold leading-[1.35] text-[#F4F4F5] sm:text-2xl">
                            {study.result}
                          </p>
                        </div>
                      );
                    }
                    return (
                      <ul className="space-y-3">
                        {highlights.map((line) => (
                          <li
                            key={line}
                            className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5"
                          >
                            <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#009C4A] text-[#09090B]">
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
                      <MagicButton
                        href="/#contact"
                        colorsOverride={{
                          base: 'bg-[#009C4A]',
                          defaultText: 'text-[#09090B]',
                          // Not the same dark the surrounding band uses
                          // (--fixed-panel-bg-soft, #09090B in dark mode) -
                          // a fill that matches its own backdrop exactly
                          // becomes invisible once fully scaled, reading as
                          // "the button never transformed" even though the
                          // mechanics are working (this exact bug hit
                          // Footer's button too, same root cause).
                          hoverFill: 'bg-[#F4F4F5]',
                          hoverText: 'text-[#09090B]',
                          dot: 'bg-[#009C4A]',
                        }}
                      >
                        <span className="inline-flex items-center gap-2">
                          Work with me
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                      </MagicButton>
                    </MagneticButton>
                  </div>
                </div>
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
                    className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0d0d0c] p-6 transition-colors hover:border-[#009C4A]/40"
                  >
                    <span className="font-mono text-xs uppercase tracking-[0.12em] text-[#71717A]">{item.industry}</span>
                    <h3 className="mt-6 font-display text-xl font-semibold leading-snug text-[#F4F4F5]">{item.company}</h3>
                    <div className="mt-6 flex items-baseline gap-2 border-t border-white/10 pt-4">
                      <span className="font-display text-2xl font-bold text-[#009C4A]">{item.metricValue}</span>
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
