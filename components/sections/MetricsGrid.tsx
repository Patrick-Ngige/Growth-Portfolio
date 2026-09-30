'use client';

import type { ReactElement } from 'react';
import Counter from '@/components/anim/Counter';

/**
 * The stats content revealed behind FeaturedWorkReel's sliding card row -
 * this IS the impact section now, not a preview of a separate one further
 * down the page. A prior version rendered this same grid a second time in
 * its own FeaturedMetrics section beneath the reel, which read as two
 * different stats blocks rather than one continuous reveal; that section
 * (and the GSAP pin it used to hand off into Methodology) has been removed,
 * folding everything into this single appearance.
 *
 * These four numbers used to also appear a second time, in About.tsx's own
 * "Impact at a Glance" mini-grid - now removed as a duplicate of this
 * section, with its numbers (all still current, audited against lib/data.ts
 * and the site's own case-study count) migrated here instead of kept in two
 * places.
 */

function CalendarIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" strokeWidth={2} />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M12 3c2.5 2.7 4 6 4 9s-1.5 6.3-4 9c-2.5-2.7-4-6-4-9s1.5-6.3 4-9z" />
    </svg>
  );
}
function BriefcaseIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 7v12a2 2 0 002 2h14a2 2 0 002-2V7M3 7l1.5-3h15L21 7M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
    </svg>
  );
}
function CodeIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
}
export interface Metric {
  value: string;
  label: string;
  icon: () => ReactElement;
}

export const METRICS: Metric[] = [
  { value: '4', label: 'Years Building', icon: CalendarIcon },
  { value: '4', label: 'Enterprise & Bank Clients', icon: BriefcaseIcon },
  { value: '50+', label: 'Public GitHub Repos', icon: CodeIcon },
  { value: '20+', label: 'Languages Localized', icon: GlobeIcon },
];

function MetricCard({ value, label, icon: Icon, highlight }: Metric & { highlight?: boolean }) {
  const numericValue = parseFloat(value.replace(/[^0-9.-]/g, ''));
  const hasPlus = value.includes('+') && value.indexOf('+') === 0;
  const suffix = value.includes('%') ? '%' : /\+$/.test(value) ? '+' : '';
  const prefix = hasPlus ? '+' : '';

  // One card carries a solid accent-growth fill instead of the neutral
  // surface + tinted-icon treatment the other three use - the strongest
  // number (checkout conversion lift) gets to read as the standout instead
  // of blending in, and it's the only place on the site where accent-growth
  // is used as a fill this large rather than for text, icons, or a border.
  if (highlight) {
    return (
      <div className="flex flex-col gap-5 rounded-2xl bg-accent-growth p-6 sm:p-7">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--background-primary)]/15 text-[var(--background-primary)]">
          <Icon />
        </span>
        <div>
          <div className="font-mono text-4xl font-bold text-[var(--background-primary)] sm:text-5xl">
            {isNaN(numericValue) ? (
              value
            ) : (
              <Counter value={numericValue} prefix={prefix} suffix={suffix} duration={1.8} delay={0.15} />
            )}
          </div>
          <p className="mt-2 text-sm text-[var(--background-primary)]/80">{label}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-[var(--border-color)] bg-[var(--background-surface)] p-6 sm:p-7">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-growth/10 text-accent-growth">
        <Icon />
      </span>
      <div>
        <div className="font-mono text-4xl font-bold text-accent-growth sm:text-5xl">
          {isNaN(numericValue) ? (
            value
          ) : (
            <Counter value={numericValue} prefix={prefix} suffix={suffix} duration={1.8} delay={0.15} />
          )}
        </div>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">{label}</p>
      </div>
    </div>
  );
}

export default function MetricsGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5">
      {METRICS.map((m, i) => (
        <MetricCard key={m.label} {...m} highlight={i === 1} />
      ))}
    </div>
  );
}
