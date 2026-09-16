'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { caseStudies, categoryFilters } from '@/lib/data';

/**
 * /work index - the grid + filter piece the multi-page IA plan
 * (09-portfolio-multipage-ia.md) called for, replacing the old modal
 * viewer. Reuses categoryFilters and the CaseStudy shape already in
 * lib/data.ts rather than inventing a new data model. Deliberately no
 * SectionRail or WebGL here - this is a browsing/filtering tool, not a
 * narrative with chapters, so it stays plain and fast.
 */
export default function WorkIndexView() {
  const [active, setActive] = useState('all');

  const filtered = useMemo(
    () => (active === 'all' ? caseStudies : caseStudies.filter((s) => s.category === active)),
    [active]
  );

  return (
    <div className="w-full bg-[var(--background-primary)]">
      <header className="container-main pb-12 pt-32 lg:pb-16 lg:pt-40">
        <span className="mb-4 block font-mono text-xs uppercase tracking-[0.14em] text-accent-growth">
          Work
        </span>
        <h1 className="max-w-2xl font-display text-4xl font-semibold leading-[1.1] text-[var(--text-primary)] sm:text-5xl">
          Selected work &amp; systems
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--text-secondary)]">
          {caseStudies.length} projects: production builds, growth systems, and a few things I
          shipped just to prove I could.
        </p>
      </header>

      <div className="container-main mb-10 flex flex-wrap gap-2 lg:mb-14">
        {categoryFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActive(filter.id)}
            className={`rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-[0.06em] transition-colors ${
              active === filter.id
                ? 'border-accent-growth bg-accent-growth text-[var(--background-primary)]'
                : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-accent-growth/50 hover:text-[var(--text-primary)]'
            }`}
          >
            {filter.label} <span className="opacity-60">({filter.count})</span>
          </button>
        ))}
      </div>

      <div className="container-main pb-24 lg:pb-32">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((study, i) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: Math.min(i, 6) * 0.05 }}
            >
              <Link
                href={`/work/${study.id}`}
                className="group flex h-full flex-col justify-between rounded-2xl border border-[var(--border-color)] bg-[var(--background-surface)] p-6 transition-colors hover:border-accent-growth/40"
              >
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text-secondary)]">
                      {study.industry}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                      {study.category.replace('-', ' ')}
                    </span>
                  </div>
                  <h2 className="mb-2 font-display text-xl font-semibold text-[var(--text-primary)] transition-colors group-hover:text-accent-growth">
                    {study.company}
                  </h2>
                  <p className="line-clamp-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {study.context}
                  </p>
                </div>

                <div className="mt-8 flex items-end justify-between border-t border-[var(--border-color)]/60 pt-5">
                  <div>
                    <span className="block font-display text-2xl font-bold text-[var(--text-primary)]">
                      {study.metricValue}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--text-secondary)]">
                      {study.metricLabel}
                    </span>
                  </div>
                  <svg
                    className="h-5 w-5 flex-shrink-0 text-[var(--text-secondary)] transition-all group-hover:translate-x-1 group-hover:text-accent-growth"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
