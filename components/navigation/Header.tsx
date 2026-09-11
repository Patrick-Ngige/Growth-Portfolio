'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { navigationLinks } from '@/lib/data';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-[var(--background-primary)]/80 dark:bg-[var(--background-primary)]/80 backdrop-blur-lg border-b border-[var(--border-color)]/10'
            : 'bg-transparent'
        )}
        role="banner"
      >
        <div className="container-main">
          <div className="flex items-center justify-between h-20">
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
              className="hidden md:flex items-center gap-8"
              role="navigation"
              aria-label="Main navigation"
            >
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] dark:text-[var(--text-secondary)] dark:hover:text-[var(--text-primary)] transition-colors relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-growth focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background-primary)]"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-growth transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}

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
              <a
                href="#contact"
                className="hidden lg:inline-flex items-center px-4 py-2 text-sm font-medium text-[var(--background-primary)] bg-accent-growth rounded-lg hover:bg-accent-growth/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-growth focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background-primary)]"
              >
                Work with me
              </a>
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
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-[var(--background-primary)]"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile menu"
          >
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]/10">
                <Link
                  href="/"
                  className="text-xl font-display font-semibold"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Patrick Ngige - Growth Engineer Home"
                >
                  <span className="text-[var(--text-primary)]">
                    Patrick
                  </span>
                  <span className="text-accent-growth">.</span>
                </Link>
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

              {/* Mobile Navigation */}
              <nav
                className="flex-1 flex flex-col items-center justify-center gap-8 p-6"
                role="navigation"
                aria-label="Mobile navigation"
              >
                {navigationLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className="text-3xl font-display font-semibold text-[var(--text-primary)] hover:text-accent-growth transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-growth rounded-lg px-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Mobile Footer */}
              <div className="p-6 border-t border-[var(--border-color)]/10">
                <a
                  href="#contact"
                  className="flex items-center justify-center w-full py-4 text-lg font-medium text-[var(--background-primary)] bg-accent-growth rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-growth focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background-primary)]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Work with me
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-20" aria-hidden="true" />
    </>
  );
}
