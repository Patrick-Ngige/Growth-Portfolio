'use client';

import { useState } from 'react';
import { AnimatedSection } from '@/components/ui/Section';

/**
 * A hoverable "how it's built" pipeline: hover a stage on the left, the
 * matching node and connecting line on the right light up. Prototyped in
 * the "borrowed elements" artboard as a recreation of daqconsulting.com's
 * "Neural Core" data-platform diagram - the stages here are Patrick's own
 * real workflow (capture -> instrument -> test -> ship), not a fabricated
 * generic pipeline.
 */
const STAGES = [
  {
    step: '01',
    label: 'Capture',
    node: 'Raw Events',
    body: 'Every user action lands raw, client and server side, before anything is aggregated or labelled.',
  },
  {
    step: '02',
    label: 'Instrument',
    node: 'GA4 / GTM',
    body: 'Events get named, deduplicated, and wired into GA4, GTM, and server-side tracking, so they hold up under scrutiny.',
  },
  {
    step: '03',
    label: 'Test',
    node: 'A/B Test',
    body: 'Real experiments against real traffic, not opinions. Only what moves a metric ships forward.',
  },
  {
    step: '04',
    label: 'Ship',
    node: 'Production',
    body: 'Straight to production, since I build, launch, and measure myself. No separate dev queue in the way.',
  },
];

export default function WorkflowDiagram() {
  const [active, setActive] = useState(0);

  return (
    <AnimatedSection id="workflow" variant="dark" size="lg">
      <div className="container-main">
        <div className="mb-12 max-w-2xl">
          <span className="data-label mb-4 block text-accent-growth">How it&apos;s built</span>
          <h2 className="text-section font-display font-semibold text-[var(--text-primary)]">
            From raw event to shipped experiment.
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr] lg:items-start">
          <ul className="flex flex-col gap-1">
            {STAGES.map((stage, i) => (
              <li key={stage.step}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className={`w-full rounded-lg border-l-2 px-4 py-3 text-left transition-colors duration-200 ${
                    i <= active
                      ? 'border-accent-growth bg-[var(--background-surface)] text-[var(--text-primary)]'
                      : 'border-transparent text-[var(--text-secondary)]'
                  }`}
                >
                  <span className="mr-2 font-mono text-xs text-accent-growth">{stage.step}</span>
                  {stage.label}
                </button>
              </li>
            ))}
          </ul>

          <div>
            <div className="flex items-center overflow-x-auto rounded-xl border border-[var(--border-color)] bg-[var(--background-surface)]/40 px-6 py-10">
              {STAGES.map((stage, i) => (
                <div key={stage.node} className="flex flex-shrink-0 items-center">
                  {i > 0 && (
                    <div className="relative mx-1 h-px w-10 bg-[var(--border-color)] sm:w-16">
                      {i <= active && (
                        <div className="absolute inset-0 origin-left scale-x-100 bg-accent-growth transition-transform duration-500" />
                      )}
                    </div>
                  )}
                  <div
                    className={`w-24 flex-shrink-0 rounded-lg border px-3 py-4 text-center font-mono text-xs transition-colors duration-300 sm:w-28 ${
                      i <= active
                        ? 'border-accent-growth bg-accent-growth/10 text-[var(--text-primary)]'
                        : 'border-[var(--border-color)] text-[var(--text-secondary)]'
                    }`}
                  >
                    {stage.node}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--text-secondary)]">
              {STAGES[active].body}
            </p>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
