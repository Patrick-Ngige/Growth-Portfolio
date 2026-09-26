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
 * Curated down from an earlier 8-metric grid to the 4 strongest numbers -
 * enough to feel substantial without crowding the pinned viewport now that
 * a title and description sit above it. Every value traces back to a real
 * case study in lib/data.ts.
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
function LayersIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3l9 5-9 5-9-5 9-5zm-9 9l9 5 9-5m-18 5l9 5 9-5" />
    </svg>
  );
}
function TrendingUpIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 17l6-6 4 4 8-8m0 0h-5m5 0v5" />
    </svg>
  );
}
export interface Metric {
  value: string;
  label: string;
  icon: () => ReactElement;
}

export const METRICS: Metric[] = [
  { value: '14', label: 'Regional & Enterprise Sites', icon: GlobeIcon },
  { value: '+280%', label: 'Checkout Conversion Rate', icon: TrendingUpIcon },
  { value: '14', label: 'Case Studies Shipped', icon: LayersIcon },
  { value: '4', label: 'Years Building', icon: CalendarIcon },
];

function MetricCard({ value, label, icon: Icon }: Metric) {
  const numericValue = parseFloat(value.replace(/[^0-9.-]/g, ''));
  const hasPlus = value.includes('+') && value.indexOf('+') === 0;
  const suffix = value.includes('%') ? '%' : /\+$/.test(value) ? '+' : '';
  const prefix = hasPlus ? '+' : '';

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
      {METRICS.map((m) => (
        <MetricCard key={m.label} {...m} />
      ))}
    </div>
  );
}
