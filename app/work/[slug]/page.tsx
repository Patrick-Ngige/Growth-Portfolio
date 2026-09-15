import Link from 'next/link';
import { notFound } from 'next/navigation';
import { caseStudies } from '@/lib/data';
import SectionRail, { type RailItem } from '@/components/motion/SectionRail';

/**
 * Case study detail page, one per project (per the multi-page IA plan,
 * `09-portfolio-multipage-ia.md`). Carries the SectionRail proven this
 * session against seasats.com's own live nav - a page like this, with
 * real narrative chapters (Overview/Challenge/Approach/Build/Result),
 * is the shape that mechanism was built for, unlike the /work index's
 * grid-and-filter layout.
 */

const RAIL_ITEMS: RailItem[] = [
  { id: 'overview', number: '01', label: 'Overview' },
  { id: 'challenge', number: '02', label: 'Challenge' },
  { id: 'approach', number: '03', label: 'Approach' },
  { id: 'build', number: '04', label: 'Build' },
  { id: 'result', number: '05', label: 'Result' },
];

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.id }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const study = caseStudies.find((c) => c.id === params.slug);
  if (!study) return {};
  return {
    title: study.company,
    description: study.context,
  };
}

export default function WorkDetailPage({ params }: { params: { slug: string } }) {
  const study = caseStudies.find((c) => c.id === params.slug);
  if (!study) notFound();

  return (
    <>
      <SectionRail items={RAIL_ITEMS} />

      <article className="w-full">
        {/* Hero */}
        <header className="container-main pb-16 pt-8 lg:pb-24 lg:pt-12">
          <Link
            href="/#work"
            className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Work
          </Link>

          <span className="mb-4 block font-mono text-xs uppercase tracking-[0.14em] text-accent-growth">
            {study.industry}
          </span>
          <h1 className="max-w-4xl font-display text-4xl font-semibold leading-[1.08] text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
            {study.company}
          </h1>

          <div className="mt-10 flex flex-wrap items-baseline gap-3 border-t border-[var(--border-color)]/40 pt-8">
            <span className="font-display text-4xl font-bold text-accent-growth">{study.metricValue}</span>
            <span className="font-mono text-sm uppercase tracking-[0.08em] text-[var(--text-secondary)]">
              {study.metricLabel}
            </span>
          </div>
        </header>

        {/* Chapters - ids match SectionRail's items exactly */}
        <section id="overview" className="border-t border-[var(--border-color)]/30 bg-[var(--background-primary)] py-16 lg:py-20">
          <div className="container-main max-w-3xl">
            <span className="mb-4 block font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)]">01 / Overview</span>
            <p className="text-xl leading-relaxed text-[var(--text-primary)] lg:text-2xl">{study.context}</p>
          </div>
        </section>

        <section id="challenge" className="border-t border-[var(--border-color)]/30 bg-[var(--surface-color)] py-16 dark:bg-[var(--background-surface)] lg:py-20">
          <div className="container-main max-w-3xl">
            <span className="mb-4 block font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)]">02 / Challenge</span>
            <p className="text-lg leading-relaxed text-[var(--text-primary)]">{study.challenge}</p>
          </div>
        </section>

        <section id="approach" className="border-t border-[var(--border-color)]/30 bg-[var(--background-primary)] py-16 lg:py-20">
          <div className="container-main max-w-3xl">
            <span className="mb-4 block font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)]">03 / Approach</span>
            <p className="text-lg leading-relaxed text-[var(--text-primary)]">{study.approach}</p>
          </div>
        </section>

        <section id="build" className="border-t border-[var(--border-color)]/30 bg-[var(--surface-color)] py-16 dark:bg-[var(--background-surface)] lg:py-20">
          <div className="container-main max-w-3xl">
            <span className="mb-4 block font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)]">04 / Build</span>
            <ul className="space-y-3">
              {study.technicalExecution.map((item) => (
                <li key={item} className="flex items-start gap-3 text-lg text-[var(--text-primary)]">
                  <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-growth" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="result" className="border-t border-[var(--border-color)]/30 bg-[var(--background-primary)] py-16 lg:py-24">
          <div className="container-main max-w-3xl">
            <span className="mb-4 block font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)]">05 / Result</span>
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
          </div>
        </section>
      </article>
    </>
  );
}
