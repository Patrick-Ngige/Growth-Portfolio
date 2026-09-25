'use client';

import type { ReactElement } from 'react';
import Counter from '@/components/anim/Counter';

/**
 * Shared stats content for FeaturedMetrics (the real "impact" section) and
 * FeaturedWorkReel's pinned reveal layer (the wipe transition leading into
 * it - see FeaturedWorkReel.tsx). Rendering the SAME component in both
 * places is what makes that handoff seamless: by the time the pin releases
 * and the real section scrolls into place, it's pixel-identical to what the
 * reveal layer just showed, so there's no visible swap.
 *
 * Expanded from the original 4 metrics (which read as sparse against a wide
 * section) to 8, each in its own icon-tagged card rather than a bare
 * number-over-label block - every value here traces back to a real case
 * study already in lib/data.ts, nothing invented for the sake of filling
 * the grid.
 */

function CalendarIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
function BuildingIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1m-1 4h1m4-4h1m-1 4h1m-5 8v-4h4v4" />
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
function TranslateIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5h7M7 3v2m0 14l4-9 4 9m-6.5-2h5M13 21l4-9 4 9m-6.5-2h5" />
    </svg>
  );
}
function DatabaseIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <ellipse cx="12" cy="6" rx="8" ry="3" strokeWidth={2} />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
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
  { value: '4', label: 'Enterprise & Bank Clients', icon: BuildingIcon },
  { value: '14', label: 'Regional & Enterprise Sites', icon: GlobeIcon },
  { value: '14', label: 'Case Studies Shipped', icon: LayersIcon },
  { value: '+280%', label: 'Checkout Conversion Rate', icon: TrendingUpIcon },
  { value: '20+', label: 'Languages Localized', icon: TranslateIcon },
  { value: '10K+', label: 'Data Points Processed Daily', icon: DatabaseIcon },
  { value: '50+', label: 'Public GitHub Repos', icon: CodeIcon },
];

function MetricCard({ value, label, icon: Icon }: Metric) {
  const numericValue = parseFloat(value.replace(/[^0-9.-]/g, ''));
  const hasPercent = value.includes('%');
  const hasPlus = value.includes('+') && value.indexOf('+') === 0;
  const suffix = value.includes('%') ? '%' : /\+$/.test(value) ? '+' : '';
  const prefix = hasPlus ? '+' : '';

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border-color)] bg-[var(--background-surface)] p-5 sm:p-6">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-growth/10 text-accent-growth">
        <Icon />
      </span>
      <div>
        <div className="font-mono text-3xl font-bold text-accent-growth sm:text-4xl">
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
    <div className="grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-4">
      {METRICS.map((m) => (
        <MetricCard key={m.label} {...m} />
      ))}
    </div>
  );
}
