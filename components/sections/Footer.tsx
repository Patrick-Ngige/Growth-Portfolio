'use client';

import Link from 'next/link';
import { socialLinks } from '@/lib/data';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-[var(--border-color)]/10 bg-[var(--background-primary)]">
      <div className="container-main">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="text-lg font-display font-semibold">
            <span className="text-[var(--text-primary)]">Patrick</span>
            <span className="text-accent-growth">.</span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-6">
            <Link
              href="#work"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Work
            </Link>
            <Link
              href="#approach"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Approach
            </Link>
            <Link
              href="#about"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              About
            </Link>
            <Link
              href="#contact"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--text-secondary)] hover:text-accent-growth transition-colors"
                aria-label={link.label}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-xs text-[var(--text-secondary)]">
            © {currentYear} Patrick Ngige. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
