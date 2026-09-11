'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { AnimatedSection } from '@/components/ui/Section';
import { CaseStudyCard, MetricBlock } from '@/components/ui/CaseStudyCard';
import CaseStudyModal from '@/components/ui/CaseStudyModal';
import { caseStudies, categoryFilters, type CaseStudy } from '@/lib/data';
import { cn } from '@/lib/utils';
import MagneticButton from '@/components/anim/MagneticButton';

export default function CaseStudies() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredStudies =
    activeFilter === 'all'
      ? caseStudies
      : caseStudies.filter((study) => study.category === activeFilter);

  const openStudy = (study: CaseStudy) => {
    setSelectedStudy(study);
    setIsModalOpen(true);
  };

  return (
    <AnimatedSection id="work" variant="surface" size="xl">
      <div className="container-main">
        {/* Section Header */}
        <motion.div className="mb-12">
          <h2 className="text-section font-display font-semibold mb-4 text-[var(--text-primary)]">
            Selected Work
          </h2>
          <p className="text-body text-[var(--text-secondary)] max-w-2xl">
            Projects I have worked on and the results achieved.
          </p>
        </motion.div>

        {/* Featured Metrics - Responsive Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <MetricBlock value="+280%" label="Checkout CR" />
          <MetricBlock value="4" label="Bank & Enterprise Sites" />
          <MetricBlock value="14" label="Growth Dimensions Analyzed" />
          <MetricBlock value="4" label="Years Building" />
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          className="flex flex-wrap gap-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          {categoryFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-mono uppercase tracking-wider transition-all duration-300',
                activeFilter === filter.id
                  ? 'bg-accent-growth text-[var(--background-primary)]'
                  : 'bg-[var(--background-primary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-accent-growth/50 hover:text-[var(--text-primary)]'
              )}
            >
              {filter.label}
              <span className="ml-2 opacity-50">({filter.count})</span>
            </button>
          ))}
        </motion.div>

        {/* Case Studies Grid */}
        <motion.div
          className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredStudies.map((study, index) => (
              <motion.div
                key={study.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <CaseStudyCard study={study} onClick={openStudy} index={index} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredStudies.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-body text-[var(--text-secondary)]">
              No case studies found in this category.
            </p>
          </motion.div>
        )}

        {/* Bottom CTA */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-body text-[var(--text-secondary)] mb-4">
            Have a project in mind? Let me know!
          </p>
          <MagneticButton>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent-growth text-[var(--background-primary)] font-medium hover:bg-accent-growth/90 transition-colors cursor-pointer"
            >
              <span>Let&apos;s chat</span>
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

      {/* Case Study Modal */}
      <CaseStudyModal
        study={selectedStudy}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </AnimatedSection>
  );
}
