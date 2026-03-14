'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { caseStudies, type CaseStudy } from '@/lib/data';
import { cn } from '@/lib/utils';
import Counter from '@/components/anim/Counter';

// Individual Case Study Card
interface CaseStudyCardProps {
  study: CaseStudy;
  onClick: (study: CaseStudy) => void;
  index: number;
}

export function CaseStudyCard({ study, onClick, index }: CaseStudyCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Extract numeric value for counter animation
  const numericValue = parseFloat(study.metricValue.replace(/[^0-9.-]/g, ''));
  const hasPercent = study.metricValue.includes('%');
  const hasPlus = study.metricValue.includes('+');

  return (
    <motion.div
      className="group relative cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(study)}
    >
      {/* Card Container */}
      <div
        className={cn(
          'relative h-full rounded-2xl overflow-hidden transition-all duration-500',
          'bg-[var(--background-surface)] border border-[var(--border-color)]',
          'group-hover:border-accent-growth/30 group-hover:shadow-lg group-hover:shadow-accent-growth/10'
        )}
      >
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background-primary)] to-transparent z-10" />
          {/* Placeholder gradient for demo - in production, use actual images */}
          <div
            className={cn(
              'w-full h-full transition-transform duration-700',
              'bg-gradient-to-br from-[var(--background-surface)] to-[var(--background-primary)]',
              isHovered && 'scale-110'
            )}
          >
            {/* Metric Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center z-20">
                <div className="text-5xl font-mono font-bold text-accent-growth mb-2">
                  {study.metricValue}
                </div>
                <div className="text-sm font-mono text-[var(--text-secondary)] uppercase tracking-widest">
                  {study.metricLabel}
                </div>
              </div>
            </div>
          </div>

          {/* Category Badge */}
          <div className="absolute top-4 left-4 z-30">
            <span className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-[var(--background-primary)]/80 backdrop-blur-sm border border-[var(--border-color)]/20 text-[var(--text-secondary)]">
              {study.category.replace('-', ' ')}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Company */}
          <h3 className="text-xl font-display font-semibold mb-2 text-[var(--text-primary)]">
            {study.company}
          </h3>

          {/* Context */}
          <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2">
            {study.context}
          </p>

          {/* Technical Details */}
          <div className="flex flex-wrap gap-2 mb-4">
            {study.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded text-xs font-mono text-[var(--text-secondary)] bg-[var(--background-primary)]/50 border border-[var(--border-color)]/10"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Hover Indicator */}
          <div className="flex items-center gap-2 text-accent-growth opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-sm font-medium">View Case Study</span>
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
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
          </div>
        </div>

        {/* Hover Border Glow */}
        <div
          className={cn(
            'absolute inset-0 rounded-2xl transition-opacity duration-500 pointer-events-none',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            boxShadow: 'inset 0 0 0 1px rgba(234, 88, 12, 0.3)',
          }}
        />
      </div>
    </motion.div>
  );
}

// Metric Block Component (for modal and featured displays)
interface MetricBlockProps {
  value: string;
  label: string;
}

export function MetricBlock({ value, label }: MetricBlockProps) {
  // Extract numeric value for counter animation
  const numericValue = parseFloat(value.replace(/[^0-9.-]/g, ''));
  const hasPercent = value.includes('%');
  const hasPlus = value.includes('+');
  const prefix = hasPlus ? '+' : '';

  return (
    <div className="glass rounded-xl p-6 text-center">
      <div className="text-4xl sm:text-5xl font-mono font-bold text-accent-growth mb-2">
        {isNaN(numericValue) ? (
          value
        ) : (
          <Counter
            value={numericValue}
            prefix={prefix}
            suffix={hasPercent ? '%' : ''}
            duration={2}
            delay={0.2}
          />
        )}
      </div>
      <div className="text-sm font-mono uppercase tracking-widest text-[var(--text-secondary)]">
        {label}
      </div>
    </div>
  );
}

export default CaseStudyCard;
