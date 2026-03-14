'use client';

import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/ui/Section';
import { cn } from '@/lib/utils';

const standardWorkflow = [
  { label: 'Idea', delay: 0 },
  { label: 'Brief', delay: 0.1 },
  { label: 'Dev Queue', delay: 0.3 },
  { label: 'Development', delay: 0.5 },
  { label: 'QA', delay: 0.7 },
  { label: 'Launch', delay: 0.9 },
  { label: 'Measure', delay: 1.1 },
];

const integratedWorkflow = [
  { label: 'Idea', delay: 0 },
  { label: 'Build', delay: 0.15 },
  { label: 'Launch', delay: 0.3 },
  { label: 'Measure', delay: 0.45 },
];

export default function UnfairAdvantage() {
  return (
    <AnimatedSection
      id="advantage"
      variant="surface"
      size="xl"
      className="relative overflow-hidden"
    >
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-accent-growth/5 to-transparent pointer-events-none" />

      <div className="container-main relative z-10">
        {/* Section Header */}
        <motion.div className="max-w-3xl mb-16">
          <h2 className="text-section font-display font-semibold mb-6 text-[var(--text-primary)]">
            Most growth marketers need a developer.{' '}
            <span className="text-accent-growth">I am the developer.</span>
          </h2>
          <p className="text-body text-[var(--text-secondary)]">
            I build what I design. No handoffs, no waiting, no communication gaps.
            Just fast execution on growth ideas.
          </p>
        </motion.div>

        {/* Workflow Comparison */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Standard Workflow */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[var(--text-secondary)]/20 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-[var(--text-secondary)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-display font-semibold text-[var(--text-secondary)]">
                Traditional Approach
              </h3>
            </div>

            {/* Workflow Visualization */}
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-zinc-700" />

              <div className="flex items-center justify-between relative">
                {standardWorkflow.map((step) => (
                  <motion.div
                    key={step.label}
                    className="flex flex-col items-center gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: step.delay * 0.5 }}
                  >
                    <div className="w-8 h-8 rounded-full bg-[var(--background-surface)] border border-[var(--border-color)]/30 flex items-center justify-center z-10">
                      <div className="w-2 h-2 rounded-full bg-[var(--text-secondary)]" />
                    </div>
                    <span className="text-xs font-mono text-[var(--text-secondary)] text-center">
                      {step.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Time Indicator */}
            <div className="mt-6 p-4 rounded-lg bg-[var(--background-primary)] border border-[var(--border-color)]/20">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-4 h-4 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="data-label text-red-500">1-2 Weeks</span>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">
                Traditional approach with handoffs between marketers and developers.
              </p>
            </div>
          </motion.div>

          {/* Integrated Workflow */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-accent-growth/20 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-accent-growth"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-display font-semibold text-accent-growth">
                My Approach
              </h3>
            </div>

            {/* Workflow Visualization */}
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-accent-growth/30" />

              <div className="flex items-center justify-between relative">
                {integratedWorkflow.map((step) => (
                  <motion.div
                    key={step.label}
                    className="flex flex-col items-center gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: step.delay * 0.5 }}
                  >
                    <motion.div
                      className="w-8 h-8 rounded-full bg-accent-growth flex items-center justify-center z-10"
                      animate={{ boxShadow: ['0 0 0 0 rgba(204, 255, 0, 0)', '0 0 20px 5px rgba(204, 255, 0, 0.3)', '0 0 0 0 rgba(204, 255, 0, 0)'] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="w-3 h-3 rounded-full bg-[var(--background-primary)]" />
                    </motion.div>
                    <span className="text-xs font-mono text-accent-growth text-center font-semibold">
                      {step.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Time Indicator */}
            <div className="mt-6 p-4 rounded-lg bg-accent-growth/10 border border-accent-growth/20">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-4 h-4 text-accent-growth"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span className="data-label text-accent-growth">Days, Not Weeks</span>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">
                I build, launch, and measure myself. Fast iteration without dependencies.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Three Capability Statements */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              ),
              text: 'I build landing pages and funnels that convert.',
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              ),
              text: 'I set up tracking and run A/B tests to improve results.',
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              ),
              text: 'I manage ad campaigns across Meta, Google, and more.',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-4 p-6 rounded-xl bg-[var(--background-primary)] border border-[var(--border-color)]/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent-growth/10 flex items-center justify-center text-accent-growth">
                {item.icon}
              </div>
              <p className="text-body font-medium text-[var(--text-primary)]">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
