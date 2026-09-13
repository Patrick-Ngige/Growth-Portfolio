'use client';

import Link from 'next/link';
import { navigationLinks, socialLinks } from '@/lib/data';

/**
 * Rebuilt per the "Pixcut Studio" reference screenshot the user shared: a
 * brand blurb + CTA on the left, then Menu / Utility / Contact columns, a
 * bottom bar with copyright and socials. Fixed dark band regardless of the
 * site's light/dark toggle (matching FeaturedWorkReel's own fixed band) -
 * the footer is the one place on the page that's always the "close of day"
 * dark, the same way trionn-rebuild alternates fixed section themes rather
 * than one flat background throughout.
 */
const INK = '#F3EEE3';
const INK_MUTED = '#8A8378';
const INK_DIM = '#D8D2C4';
const BAND_BG = '#14110D';
const LINE = '#2A2722';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ background: BAND_BG }} className="px-[clamp(20px,5vw,64px)] pb-7 pt-14">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-10 sm:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="font-display text-lg font-semibold" style={{ color: INK }}>
            Patrick<span className="text-accent-growth">.</span>
          </Link>
          <p className="mt-3.5 max-w-[32ch] text-sm leading-relaxed" style={{ color: INK_MUTED }}>
            Developer-first Growth Engineer building the systems behind measurable growth.
            Nairobi, Kenya, working remotely.
          </p>
          <a
            href="#contact"
            className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-3 font-mono text-[11px] uppercase tracking-[0.1em] transition-opacity hover:opacity-90"
            style={{ background: INK, color: BAND_BG }}
          >
            Work With Me
          </a>
        </div>

        <div>
          <h4 className="font-mono text-[10.5px] font-normal uppercase tracking-[0.12em]" style={{ color: INK_MUTED }}>
            Menu
          </h4>
          <ul className="mt-4 flex flex-col gap-2.5">
            {navigationLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm transition-colors hover:opacity-100"
                  style={{ color: INK_DIM }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-[10.5px] font-normal uppercase tracking-[0.12em]" style={{ color: INK_MUTED }}>
            Utility
          </h4>
          <ul className="mt-4 flex flex-col gap-2.5">
            <li>
              <a href="#contact" className="text-sm" style={{ color: INK_DIM }}>
                Resume
              </a>
            </li>
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm"
                  style={{ color: INK_DIM }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-[10.5px] font-normal uppercase tracking-[0.12em]" style={{ color: INK_MUTED }}>
            Contact
          </h4>
          <div className="mt-4 flex flex-col gap-2.5 text-sm" style={{ color: INK_DIM }}>
            <a href="mailto:wakemanjajr@gmail.com">wakemanjajr@gmail.com</a>
            <p>Nairobi, Kenya</p>
            <p>Available for remote work</p>
          </div>
        </div>
      </div>

      <div
        className="mx-auto mt-10 flex max-w-[1240px] flex-col items-start gap-3.5 border-t pt-5.5 font-mono text-[10.5px] tracking-[0.04em] sm:flex-row sm:items-center sm:justify-between"
        style={{ borderColor: LINE, color: '#726B5F' }}
      >
        <span>© {currentYear} Patrick Ngige. All rights reserved.</span>
        <span className="flex gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: INK_MUTED }}
              aria-label={link.label}
            >
              {link.label}
            </a>
          ))}
        </span>
      </div>
    </footer>
  );
}
