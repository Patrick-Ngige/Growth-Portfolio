'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { navigationLinks } from '@/lib/data';
import { createSpring } from './spring';
import MagicButton from '@/components/ui/MagicButton';

type PillKey = 'x' | 'y' | 'w' | 's' | 'o';
type PillPose = Record<PillKey, number>;

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [veil, setVeil] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  const navLinksRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const pill = useRef<{
    spring: ReturnType<typeof createSpring<PillKey>>;
    parked: () => PillPose;
    hovered: (a: HTMLElement) => PillPose;
    link: HTMLElement | null;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Spring-driven nav pill, ported from a hand-rolled reference
  // implementation rather than Framer Motion's layoutId: a real spring
  // keeps its velocity when the target changes mid-flight, so flicking
  // the pointer between links continues smoothly instead of restarting
  // the way layoutId's own FLIP animation does. The parked pose sits
  // below and slightly left of the first link (40% scale, invisible) -
  // hovering any link for the first time, or right after the pointer
  // leaves the nav, springs UP from there, and that combined vertical +
  // horizontal motion is what reads as a diagonal "entering from an
  // angle" effect. Moving directly between adjacent links is a flat
  // horizontal slide with no vertical component at all - confirmed by
  // comparing both cases frame-by-frame against kora.framer.media's own
  // nav before porting the mechanics here.
  useEffect(() => {
    const navEl = navLinksRef.current;
    const pillEl = pillRef.current;
    if (!navEl || !pillEl) return;

    const firstLink = () => navEl.querySelector<HTMLElement>('a');
    const parked = (): PillPose => {
      const first = firstLink();
      const h = first?.offsetHeight ?? 36;
      return { x: first?.offsetLeft ?? 0, y: h * 1.35, w: first?.offsetWidth ?? 80, s: 0.4, o: 0 };
    };
    const hovered = (a: HTMLElement): PillPose => ({ x: a.offsetLeft, y: 0, w: a.offsetWidth, s: 1, o: 1 });
    const apply = (v: PillPose) => {
      pillEl.style.width = `${v.w}px`;
      pillEl.style.opacity = String(Math.max(0, Math.min(1, v.o)));
      pillEl.style.transform = `translate3d(${v.x}px, ${v.y}px, 0) scale(${v.s})`;
    };

    const spring = createSpring<PillKey>(parked(), apply);
    pill.current = { spring, parked, hovered, link: null };
    spring.jump(parked());

    // On resize, re-measure without animating (link widths/positions
    // change with viewport width, the pill shouldn't visibly relayout).
    const ro = new ResizeObserver(() => {
      const cur = pill.current;
      if (!cur) return;
      spring.jump(cur.link ? cur.hovered(cur.link) : cur.parked());
    });
    ro.observe(navEl);
    return () => {
      ro.disconnect();
      spring.stop();
      pill.current = null;
    };
  }, []);

  /** Send the pill to link `a`, or back to its parked pose when `a` is null. */
  const highlight = (a: Element | null) => {
    const navEl = navLinksRef.current;
    const p = pill.current;
    if (!navEl || !p) return;
    navEl.querySelectorAll<HTMLElement>('a[data-nav-link]').forEach((x) => {
      x.style.color = '';
    });
    const link = a && window.matchMedia('(min-width: 768px)').matches ? (a as HTMLElement) : null;
    p.link = link;
    const target = link ? p.hovered(link) : p.parked();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) p.spring.jump(target);
    else p.spring.to(target);
    if (link) link.style.color = 'var(--background-primary)';
    setVeil(!!link);
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  // Determine if we're in dark mode (after mount to avoid hydration mismatch)
  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <>
      {/* Skip to Main Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent-growth focus:text-[var(--background-primary)] focus:font-medium focus:rounded-lg"
      >
        Skip to main content
      </a>

      {/* Veil: dims + blurs the page behind the header while a nav link is
          hovered. Deliberately a SIBLING of <header>, not nested inside it -
          header has `-translate-x-1/2`, and a transformed ancestor becomes
          the containing block for any `position: fixed` descendant (CSS
          spec behaviour), so a veil nested inside header would size itself
          against header's own small box instead of the viewport and never
          visibly cover the page. z-40 (below header's z-50, above normal
          page content) gets the same "above the page, below the bar"
          layering without relying on nesting. */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none fixed inset-0 z-40 bg-[rgba(0,30,15,0.16)] opacity-0 backdrop-blur-[10px] transition-opacity duration-[400ms]',
          veil && 'opacity-100'
        )}
      />

      <header
        className="fixed left-1/2 top-4 z-50 w-[min(1180px,calc(100%-2rem))] -translate-x-1/2"
        role="banner"
      >
        <div
          className={cn(
            // A crisp, near-opaque pill (not a translucent tint of the page
            // background) so it stays legible whether it's floating over a
            // near-white section or one of the site's fixed-dark panels
            // (PinnedPillars, WorkDetailView's closing sections, Footer).
            // relative+overflow-hidden so the glass sheen below can clip to
            // the pill's own rounded corners.
            'relative flex items-center justify-between overflow-hidden rounded-full border border-black/10 bg-white/95 px-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8)] backdrop-blur-lg ring-1 ring-inset ring-white/40 transition-shadow duration-300 h-16 dark:border-white/10 dark:bg-[#18181B]/95 dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] dark:ring-white/10',
            isScrolled ? 'shadow-lg shadow-black/10' : 'shadow-sm shadow-black/5'
          )}
        >
            {/* Glass sheen: a soft light-to-transparent gradient across the
                top half of the pill, the tasteful side of "glossy" (a subtle
                highlight, not a plastic-button shine). Pointer-events-none
                and behind the real content, which paints over it in normal
                DOM order. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/50 via-white/0 to-transparent dark:from-white/[0.06] dark:via-transparent"
            />

            {/* Logo */}
            <Link
              href="/"
              className="text-xl font-display font-semibold tracking-tight hover:opacity-80 transition-opacity"
              aria-label="Patrick Ngige - Growth Engineer Home"
            >
              <span className="text-[var(--text-primary)]">
                Patrick
              </span>
              <span className="text-accent-growth">.</span>
            </Link>

            {/* Desktop Navigation */}
            <nav
              className="hidden md:flex items-center gap-1"
              role="navigation"
              aria-label="Main navigation"
            >
              {/* Pointer/focus handlers live on this inner wrapper, not the
                  outer <nav>, so the theme toggle and CTA button (also
                  inside <nav> but not real nav links) never trigger the
                  pill - closest('a') would otherwise match the CTA too. */}
              <div
                ref={navLinksRef}
                className="relative flex items-center gap-1"
                onPointerOver={(e) => e.pointerType === 'mouse' && highlight((e.target as Element).closest('a'))}
                onPointerLeave={() => highlight(null)}
                onFocus={(e) => highlight((e.target as Element).closest('a'))}
                onBlur={() => highlight(null)}
              >
                <span
                  ref={pillRef}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 top-0 z-0 h-full w-0 rounded-full bg-accent-growth opacity-0"
                  style={{ transformOrigin: '50% 50%', willChange: 'transform, opacity' }}
                />
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    data-nav-link
                    className="relative z-10 rounded-full px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors delay-100 duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-growth focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background-primary)]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Theme Toggle */}
              {mounted && (
                <button
                  onClick={toggleTheme}
                  className={cn(
                    'p-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-growth',
                    isDark
                      ? 'hover:bg-[var(--background-surface)]'
                      : 'hover:bg-[var(--surface-color)]'
                  )}
                  aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDark ? (
                    <svg
                      className="w-5 h-5 text-accent-growth"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-[var(--text-primary)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                  )}
                </button>
              )}

              {/* CTA */}
              <MagicButton href="#contact" size="md" className="hidden lg:inline-flex">
                Work with me
              </MagicButton>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-growth rounded-lg"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg
                className="w-6 h-6 text-[var(--text-primary)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
        </div>
      </header>

      {/* Mobile Menu Overlay - indexed display type on a marquee backdrop
          (research/decision trail: see the "Mobile Nav Concepts" artifact
          from this session, the "Blend" card). Mode switcher on the left,
          close on the right, per explicit correction to the picked option -
          the collapsed pill stays hamburger-only, the toggle only appears
          once this overlay is open. */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] overflow-hidden bg-[var(--background-primary)]"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile menu"
          >
            <div className="relative flex h-full flex-col">
              {/* Menu top row: mode switcher left, close right */}
              <div className="flex items-center justify-between p-6">
                {mounted && (
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg transition-colors hover:bg-[var(--background-surface)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-growth"
                    aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                  >
                    {isDark ? (
                      <svg
                        className="w-5 h-5 text-accent-growth"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-[var(--text-primary)]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                      </svg>
                    )}
                  </button>
                )}
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-growth rounded-lg"
                  aria-label="Close menu"
                >
                  <svg
                    className="w-6 h-6 text-[var(--text-primary)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Ambient marquee backdrop: same animate-marquee /
                  animate-marquee-reverse keyframes GrowthStack's tool rows
                  already use, just decorative and low-opacity here - two
                  bands run one direction, the middle band runs the other,
                  matching the picked reference exactly. */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <div className="absolute left-0 top-[18%] flex w-max animate-marquee gap-8 opacity-[0.05] motion-reduce:animate-none">
                  {[0, 1].map((i) => (
                    <span
                      key={i}
                      className="whitespace-nowrap font-display text-6xl font-bold text-[var(--text-primary)]"
                    >
                      PATRICK NGIGE &middot; GROWTH ENGINEER &middot; PATRICK NGIGE &middot; GROWTH ENGINEER &middot;
                    </span>
                  ))}
                </div>
                <div className="absolute left-0 top-[45%] flex w-max animate-marquee-reverse gap-8 opacity-[0.05] motion-reduce:animate-none">
                  {[0, 1].map((i) => (
                    <span
                      key={i}
                      className="whitespace-nowrap font-display text-6xl font-bold text-[var(--text-primary)]"
                    >
                      BUILD &middot; INSTRUMENT &middot; AUTOMATE &middot; BUILD &middot; INSTRUMENT &middot; AUTOMATE &middot;
                    </span>
                  ))}
                </div>
                <div className="absolute left-0 top-[72%] flex w-max animate-marquee gap-8 opacity-[0.05] motion-reduce:animate-none">
                  {[0, 1].map((i) => (
                    <span
                      key={i}
                      className="whitespace-nowrap font-display text-6xl font-bold text-[var(--text-primary)]"
                    >
                      PATRICK NGIGE &middot; GROWTH ENGINEER &middot; PATRICK NGIGE &middot; GROWTH ENGINEER &middot;
                    </span>
                  ))}
                </div>
              </div>

              {/* Mobile Navigation: indexed rows, hairline rule above every
                  row but the first */}
              <nav
                className="relative z-10 flex flex-1 flex-col justify-center px-8"
                role="navigation"
                aria-label="Mobile navigation"
              >
                {navigationLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className={cn(
                      'flex items-baseline gap-4 py-4',
                      index > 0 && 'border-t border-[var(--border-color)]/40'
                    )}
                  >
                    <span className="font-mono text-xs text-accent-growth">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <Link
                      href={link.href}
                      className="font-display text-3xl font-semibold text-[var(--text-primary)] transition-all duration-300 hover:translate-x-4 hover:text-accent-growth focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-growth rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Mobile Footer */}
              <div className="relative z-10 p-6 border-t border-[var(--border-color)]/10">
                <MagicButton
                  href="#contact"
                  size="lg"
                  className="w-full text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Work with me
                </MagicButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-24" aria-hidden="true" />
    </>
  );
}
