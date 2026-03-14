'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useSpring } from 'framer-motion';
import { AnimatedSection } from '@/components/ui/Section';
import { methodologySteps } from '@/lib/data';
import { cn } from '@/lib/utils';
import SplitText from '@/components/anim/SplitText';
import MagneticButton from '@/components/anim/MagneticButton';

const iconComponents = {
  search: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  ),
  lightbulb: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    </svg>
  ),
  code: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
      />
    </svg>
  ),
  rocket: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  ),
  chart: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  ),
  refresh: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  ),
};

interface TimelineNodeProps {
  step: typeof methodologySteps[0];
  index: number;
  isLast: boolean;
}

function TimelineNode({ step, index, isLast }: TimelineNodeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: '-50px 0px -50px 0px' });

  return (
    <div ref={ref} className="relative flex gap-8 pb-16 last:pb-0">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-[27px] top-16 bottom-0 w-0.5 bg-[var(--border-color)]/20">
          <motion.div
            className="w-full bg-accent-growth origin-top"
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            style={{ height: 'calc(100% - 64px)' }}
          />
        </div>
      )}

      {/* Node */}
      <motion.div
        className="relative flex-shrink-0"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
      >
        <div
          className={cn(
            'w-14 h-14 rounded-full flex items-center justify-center z-10 relative',
            'bg-[var(--background-surface)] border-2 border-[var(--border-color)]/20',
            'transition-all duration-500',
            isInView && 'border-accent-growth shadow-lg shadow-accent-growth/20'
          )}
        >
          {isInView && (
            <motion.div
              className="absolute inset-0 rounded-full bg-accent-growth/20"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 }}
            />
          )}
          <div
            className={cn(
              'transition-colors duration-300',
              isInView ? 'text-accent-growth' : 'text-[var(--text-secondary)]'
            )}
          >
            {iconComponents[step.icon as keyof typeof iconComponents]}
          </div>
        </div>

        {/* Step Number */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-mono text-[var(--text-secondary)]">
          {String(step.step).padStart(2, '0')}
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        className="pt-1"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 + 0.1 }}
      >
        <h3 className="text-lg font-display font-semibold mb-2 text-[var(--text-primary)]">
          {step.title}
        </h3>
        <p className="text-body text-[var(--text-secondary)] max-w-md">
          {step.description}
        </p>
      </motion.div>
    </div>
  );
}

export default function Methodology() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const smoothedProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <AnimatedSection id="approach" variant="default" size="xl">
      <div className="container-main">
        {/* Section Header */}
        <motion.div className="mb-16 max-w-2xl w-full flex flex-col items-center justify-center" ref={containerRef}>
          <SplitText
            text="My Approach"
            as="h2"
            className="text-section font-display font-semibold mb-4 text-[var(--text-primary)]"
            animation="slideUp"
            delay={0}
          />
          <SplitText
            text="How I work: test ideas, measure results, and keep improving. Simple and focused on real outcomes."
            as="p"
            className="text-body text-[var(--text-secondary)]"
            animation="fadeIn"
            delay={0.2}
          />
        </motion.div>

        {/* Timeline Visualization */}
        <div className="max-w-2xl">
          {methodologySteps.map((step, index) => (
            <TimelineNode
              key={step.step}
              step={step}
              index={index}
              isLast={index === methodologySteps.length - 1}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-body text-[var(--text-secondary)] mb-4">
            Ready to work together?
          </p>
          <MagneticButton>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent-growth text-[var(--background-primary)] font-medium hover:bg-accent-growth/90 transition-colors cursor-pointer"
            >
              <span>Get in touch</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </MagneticButton>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
