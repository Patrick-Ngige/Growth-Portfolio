'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/ui/Section';
import Button, { AnimatedButton } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

// Analytics tracking hook
function useAnalytics() {
  const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
    // In production, replace with actual analytics (GA4, GTM, etc.)
    if (typeof window !== 'undefined' && (window as unknown as { dataLayer?: unknown[] }).dataLayer) {
      (window as unknown as { dataLayer: unknown[] }).dataLayer.push({
        event: eventName,
        ...properties,
      });
    }
    console.log('[Analytics]', eventName, properties);
  };

  return { trackEvent };
}

export default function Contact() {
  const { trackEvent } = useAnalytics();

  // Track section visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            trackEvent('section_view', {
              section: 'contact',
              timestamp: Date.now(),
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    const contactSection = document.getElementById('contact');
    if (contactSection) {
      observer.observe(contactSection);
    }

    return () => observer.disconnect();
  }, [trackEvent]);

  const handleScheduleClick = () => {
    trackEvent('cta_click', {
      cta_type: 'schedule_audit',
      cta_location: 'contact',
      conversion: true,
    });
  };

  const handleEmailClick = () => {
    trackEvent('cta_click', {
      cta_type: 'email_initiated',
      cta_location: 'contact',
    });
  };

  const handleLinkedInClick = () => {
    trackEvent('outbound_click', {
      platform: 'linkedin',
      location: 'contact',
    });
  };

  return (
    <AnimatedSection id="contact" variant="dark" size="xl">
      <div className="container-main">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-growth/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          {/* Section Label */}
          <motion.p
            className="data-label mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Ready to Scale
          </motion.p>

          {/* Main Headline */}
          <motion.h2
            className="text-section font-display font-semibold mb-6 text-[var(--text-primary)]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Let&apos;s grow your business.
          </motion.h2>

          {/* Body Copy */}
          <motion.p
            className="text-body text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            I work with founders and marketing teams ready to invest in systematic growth.
            If you&apos;re looking for someone to execute experiments that move metrics,
            let&apos;s talk.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <AnimatedButton
              size="lg"
              onClick={handleScheduleClick}
              containerClass="shadow-glow"
            >
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Schedule a Growth Audit
              </span>
            </AnimatedButton>

            <Button size="lg" variant="outline" onClick={handleEmailClick}>
              <a href="mailto:hello@patrick-growth.com" className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Start a Conversation
              </a>
            </Button>
          </motion.div>

          {/* Pre-qualification */}
          <motion.div
            className="p-6 rounded-xl bg-[var(--background-primary)]/50 border border-[var(--border-color)]/20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-accent-growth animate-pulse" />
              <span className="data-label text-accent-growth">Currently Accepting Clients</span>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">
              <strong className="text-[var(--text-primary)]">
                Q1 2025 availability.
              </strong>{' '}
              Ideal engagements include: conversion rate optimization projects, paid media
              setup and scaling, and full-funnel growth strategy.
            </p>
          </motion.div>

          {/* Alternative Contact */}
          <motion.div
            className="mt-10 flex items-center justify-center gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-sm text-[var(--text-secondary)]">Find me on:</span>
            <div className="flex items-center gap-4">
              <a
                href="https://linkedin.com/in/patrick-ngige"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkedInClick}
                className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-accent-growth transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
              <a
                href="https://github.com/Patrick-Ngige"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-accent-growth transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </a>
              <a
                href="https://dribbble.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-accent-growth transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.814zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z" />
                </svg>
                Dribbble
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
}
