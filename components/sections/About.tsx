'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { AnimatedSection } from '@/components/ui/Section';
import { aboutNarrative } from '@/lib/data';

export default function About() {
  const narrativeRef = useRef<HTMLDivElement>(null);
  const isNarrativeInView = useInView(narrativeRef, { once: true, margin: '-100px' });

  return (
    <AnimatedSection id="about" variant="surface" size="xl">
      <div className="container-main">
        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left Column - Narrative */}
          <div ref={narrativeRef}>
            <motion.h2
              className="text-section font-display font-semibold mb-8 text-[var(--text-primary)]"
              initial={{ opacity: 0, y: 20 }}
              animate={isNarrativeInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              The Growth Journey
            </motion.h2>

            <div className="space-y-6">
              {[
                aboutNarrative.paragraph1,
                aboutNarrative.paragraph2,
                aboutNarrative.paragraph3,
                aboutNarrative.paragraph4,
                aboutNarrative.paragraph5,
              ].map((paragraph, index) => (
                <motion.p
                  key={index}
                  className="text-body text-[var(--text-secondary)] leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isNarrativeInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            {/* CTA Link */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0 }}
              animate={isNarrativeInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 }}
            >
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-accent-growth hover:text-accent-growth/80 transition-colors"
              >
                <span className="font-medium">Let&apos;s work together on your next project</span>
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
            </motion.div>
          </div>

          {/* Right Column - Value Proposition & Visual */}
          <div>
            {/* Value Proposition Card */}
            <motion.div
              className="p-6 rounded-xl bg-accent-growth/10 border border-accent-growth/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-display font-semibold mb-4 text-accent-growth">
                What I Bring
              </h3>
              <ul className="space-y-3">
                {[
                  'I build what I design, no waiting on developers',
                  'I ship on regulated, high-traffic sites: banks and financial platforms',
                  'I instrument what I build with GA4, GTM, and server-side tracking',
                  'I automate the repetitive parts with n8n and the Claude API',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-accent-growth/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-growth" />
                    </div>
                    <span className="text-sm text-[var(--text-secondary)]">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
