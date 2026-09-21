'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const CONTACT_EMAIL = 'wakemanjajr@gmail.com';
const NEEDS = ['Landing page build', 'Analytics & tracking', 'Automation', 'CRO experiments', 'Not sure yet'];
const TIMELINES = ['As soon as possible', 'Within 1-2 months', 'Just exploring'];

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

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [needs, setNeeds] = useState<string[]>([]);
  const [timeline, setTimeline] = useState(TIMELINES[0]);
  const [context, setContext] = useState('');

  const toggleNeed = (need: string) =>
    setNeeds((prev) => (prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    trackEvent('cta_click', {
      cta_type: 'contact_form_submit',
      cta_location: 'contact',
      conversion: true,
      needs,
      timeline,
    });
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Needs: ${needs.length ? needs.join(', ') : 'Not specified'}`,
      `Timeline: ${timeline}`,
      '',
      'Stack and growth problem:',
      context || '(not provided)',
    ].join('\n');
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      `Project enquiry from ${name}`
    )}&body=${encodeURIComponent(body)}`;
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

          {/* Qualifying form: what, when, and context, so the first message
              already tells me if it's a fit. No backend on this static
              export, so submit opens a prefilled email. */}
          <motion.form
            onSubmit={handleSubmit}
            className="mb-12 rounded-2xl border border-[var(--border-color)] bg-[var(--background-surface)] p-6 text-left sm:p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[var(--text-primary)]">Name</span>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--background-primary)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-accent-growth focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[var(--text-primary)]">Email</span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--background-primary)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-accent-growth focus:outline-none"
                />
              </label>
            </div>

            <fieldset className="mt-6">
              <legend className="mb-3 text-sm font-medium text-[var(--text-primary)]">What do you need?</legend>
              <div className="flex flex-wrap gap-2">
                {NEEDS.map((need) => {
                  const on = needs.includes(need);
                  return (
                    <button
                      key={need}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleNeed(need)}
                      className={cn(
                        'rounded-full border px-4 py-2 text-sm transition-colors',
                        on
                          ? 'border-accent-growth bg-accent-growth text-[var(--background-primary)]'
                          : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-accent-growth/60 hover:text-[var(--text-primary)]'
                      )}
                    >
                      {need}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="mt-6">
              <legend className="mb-3 text-sm font-medium text-[var(--text-primary)]">When do you need it?</legend>
              <div className="flex flex-wrap gap-2">
                {TIMELINES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={timeline === t}
                    onClick={() => setTimeline(t)}
                    className={cn(
                      'rounded-full border px-4 py-2 text-sm transition-colors',
                      timeline === t
                        ? 'border-accent-growth bg-accent-growth text-[var(--background-primary)]'
                        : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-accent-growth/60 hover:text-[var(--text-primary)]'
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="mt-6 block">
              <span className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                Current stack and the growth problem
              </span>
              <textarea
                rows={4}
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="e.g. WordPress site, GA4 not tracking checkout, we can't tell which channel converts."
                className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--background-primary)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-accent-growth focus:outline-none"
              />
            </label>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[var(--text-secondary)]">
                Opens a prefilled email to me with your answers.
              </p>
              <Button type="submit" size="lg">
                Send my details
              </Button>
            </div>
          </motion.form>

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
                Limited availability for select projects.
              </strong>{' '}
              Alongside a full-time role, taking on a small number of engagements: landing page
              builds, analytics and tracking setup, automation workflows, and CRO experiments.
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
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
}
