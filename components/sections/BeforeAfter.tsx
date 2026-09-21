'use client';

import { motion } from 'framer-motion';

/**
 * Before/after, the pattern borrowed from Kora's home page: a pain card,
 * then a solved card arrives beside it while the first settles back. The
 * copy is this site's own thesis (from aboutNarrative: growth ideas stall
 * in a dev queue, so build the fix yourself), not invented claims. Colors
 * come from the theme tokens (--card-base / --card-active) so it reads in
 * both light and dark; the only accent is the site's existing orange, on
 * the check marks.
 */
const BEFORE = [
  'Growth ideas wait weeks in a dev queue.',
  'Tracking is bolted on after launch, if at all.',
  'Tests get judged on opinion, not a baseline.',
  'Every experiment needs three handoffs.',
];

const AFTER = [
  'I build the fix myself: front end, tracking, automation.',
  'Measurement ships with the page, not after it.',
  'Every change is compared against a baseline.',
  'One person, no handoffs, faster learning.',
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function BeforeAfter() {
  return (
    <section id="before-after" className="relative w-full bg-[var(--background-primary)] py-24 lg:py-32">
      <div className="container-main">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="data-label mb-4">The difference</p>
          <h2 className="text-section font-display font-semibold text-[var(--text-primary)]">
            Growth ideas shouldn&apos;t wait for a developer.
          </h2>
        </div>

        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease }}
            className="flex min-h-[360px] flex-col justify-between rounded-[28px] border border-[var(--border-color)] bg-[var(--card-base)] p-7 sm:p-9"
          >
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-secondary)]">Before</span>
              <h3 className="mt-4 font-display text-2xl font-semibold leading-tight text-[var(--text-secondary)] sm:text-3xl">
                Guessing, then waiting.
              </h3>
            </div>
            <ul className="mt-10 space-y-3">
              {BEFORE.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] leading-snug text-[var(--text-primary)] opacity-90">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-[var(--border-color)] text-[11px]"
                  >
                    ×
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 48 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease, delay: 0.25 }}
            className="flex min-h-[360px] flex-col justify-between rounded-[28px] border border-[var(--border-color)] bg-[var(--card-active)] p-7 shadow-xl shadow-black/20 sm:p-9"
          >
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.12em] text-accent-growth">After</span>
              <h3 className="mt-4 font-display text-2xl font-semibold leading-tight text-[var(--text-primary)] sm:text-3xl">
                Building it and measuring it.
              </h3>
            </div>
            <ul className="mt-10 space-y-3">
              {AFTER.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] leading-snug text-[var(--text-primary)]">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent-growth text-[11px] font-bold text-[var(--background-primary)]"
                  >
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
