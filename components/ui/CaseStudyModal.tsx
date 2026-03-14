'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CaseStudy } from '@/lib/data';

interface CaseStudyModalProps {
  study: CaseStudy | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CaseStudyModal({ study, isOpen, onClose }: CaseStudyModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!study) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
          onClick={handleOverlayClick}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-[10000] w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer shadow-lg"
            aria-label="Close modal"
            style={{ position: 'fixed', top: '20px', right: '20px' }}
          >
            <svg className="w-6 h-6" fill="none" stroke="#18181B" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Modal Content */}
          <motion.div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl bg-white m-4"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Hero Section */}
            <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center z-10">
                  <div className="text-6xl font-mono font-bold text-[#EA580C] mb-2">
                    {study.metricValue}
                  </div>
                  <div className="text-lg font-mono uppercase tracking-widest text-gray-500">
                    {study.metricLabel}
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-[#EA580C]/10 text-[#EA580C] border border-[#EA580C]/20">
                    {study.category.replace('-', ' ')}
                  </span>
                  <span className="text-sm text-gray-500">{study.industry}</span>
                </div>
                <h2 className="text-3xl font-display font-semibold text-gray-900">
                  {study.company}
                </h2>
              </div>

              {/* Context */}
              <div className="mb-8">
                <p className="text-base text-gray-600">
                  {study.context}
                </p>
              </div>

              {/* Grid: Challenge, Approach, Result */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="p-6 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-[#EA580C]/10 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-[#EA580C]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                    <h3 className="font-display font-semibold text-gray-900">
                      The Challenge
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {study.challenge}
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </div>
                    <h3 className="font-display font-semibold text-gray-900">
                      The Approach
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {study.approach}
                  </p>
                </div>
              </div>

              {/* Result */}
              <div className="mb-8 p-6 rounded-xl bg-[#EA580C]/10 border border-[#EA580C]/20">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#EA580C] flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                  <h3 className="font-display font-semibold text-[#EA580C]">
                    The Result
                  </h3>
                </div>
                <p className="text-base text-gray-900 leading-relaxed">
                  {study.result}
                </p>
              </div>

              {/* Technical Execution */}
              <div className="mb-8">
                <h3 className="font-display font-semibold text-gray-900 mb-4">
                  Technical Execution
                </h3>
                <ul className="space-y-3">
                  {study.technicalExecution.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#EA580C]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#EA580C]" />
                      </div>
                      <span className="text-sm text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-200">
                {study.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-mono text-gray-500 bg-gray-100 border border-gray-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Button */}
              <div className="mt-8 flex justify-center">
                <button
                  className="px-8 py-4 rounded-lg bg-[#EA580C] text-white font-medium hover:bg-[#EA580C]/90 transition-all duration-300 shadow-lg cursor-pointer text-base"
                  aria-label="View project"
                >
                  View Project Details
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
