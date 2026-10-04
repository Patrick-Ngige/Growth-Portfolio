'use client';

import Link from 'next/link';
import { navigationLinks, socialLinks } from '@/lib/data';
import MagicButton from '@/components/ui/MagicButton';

/**
 * Rebuilt per the "Pixcut Studio" reference screenshot: two bordered,
 * rounded panels side by side on a dark page - a narrow left card (brand
 * blurb + CTA) and a wider right card (Menu / Utility Pages / Contact Us
 * columns, then a divider and a bottom bar with copyright + icon-only
 * socials, all inside that same right panel). Ink colours match the
 * reference exactly - true neutral charcoal/white, not the warm
 * brown-tinted palette used elsewhere on the site. The green lives only on
 * the two cards now - the page itself (--footer-bg) is pure black in dark
 * mode (the footer is the one place that's always literally black there)
 * and just the site's normal page colour in light mode, no dedicated dark
 * or colour treatment of its own. Earlier this page background also went
 * green, then slate/navy; both read as one colour decision too many once
 * the cards themselves already carry the accent - a live teardown of
 * kora.framer.media's section backgrounds found the same restraint (one
 * green section, one black section, one cream footer, never the same
 * colour move stacked twice in one place).
 */
const PAGE_BG = 'var(--footer-bg)';
const CARD_BG = '#06301C';
const CARD_BORDER = '#1F5C3B';
const INK = '#F5F5F5';
const INK_MUTED = '#8FB89D';
const INK_DIM = '#C7C7C7';
const LINE = CARD_BORDER;

// Same hover treatment as Header's nav links: ink brightens and a thin
// accent bar grows in from the left under the text, rather than the
// opacity-only hover this had before (which did nothing visible, since
// the ink was already fully opaque).
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group relative inline-block text-sm text-[#C7C7C7] transition-colors hover:text-[#F5F5F5]"
    >
      {children}
      <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 bg-[#009C4A] transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}

const socialIcons: Record<string, React.ReactNode> = {
  LinkedIn: (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  GitHub: (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.755-1.333-1.755-1.089-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.469-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.5 11.5 0 013.003-.404c1.02.005 2.047.138 3.003.404 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  ),
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{ background: PAGE_BG }}
      className="px-[clamp(20px,5vw,64px)] py-16"
    >
      <div className="mx-auto flex max-w-[1240px] flex-col gap-5 lg:flex-row">
        {/* Left panel: brand + CTA */}
        <div
          className="flex flex-col justify-between gap-8 rounded-[1.75rem] border p-9 lg:w-[34%]"
          style={{ background: CARD_BG, borderColor: CARD_BORDER }}
        >
          <div>
            <Link href="/" className="font-display text-lg font-semibold" style={{ color: INK }}>
              Patrick<span className="text-accent-growth">.</span>
            </Link>
            <p className="mt-3.5 max-w-[30ch] text-sm leading-relaxed" style={{ color: INK_MUTED }}>
              Developer-first Growth Engineer building the systems behind measurable growth.
            </p>
          </div>
          <MagicButton
            href="#contact"
            colorsOverride={{
              base: 'bg-[#F5F5F5]',
              defaultText: 'text-[#06301C]',
              // Not CARD_BG (#06301C) - a fill matching the card it sits
              // on exactly becomes invisible once fully scaled, reading as
              // "the button never transformed" even though the mechanics
              // are working correctly underneath.
              hoverFill: 'bg-[#009C4A]',
              hoverText: 'text-[#06301C]',
              dot: 'bg-[#F5F5F5]',
            }}
            className="w-fit"
          >
            Get In Touch
          </MagicButton>
        </div>

        {/* Right panel: link columns + bottom bar, all in one card */}
        <div
          className="flex-1 rounded-[1.75rem] border p-9"
          style={{ background: CARD_BG, borderColor: CARD_BORDER }}
        >
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h4 className="font-mono text-[10.5px] font-normal uppercase tracking-[0.12em]" style={{ color: INK_MUTED }}>
                Menu
              </h4>
              <ul className="mt-4 flex flex-col gap-2.5">
                {navigationLinks.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-[10.5px] font-normal uppercase tracking-[0.12em]" style={{ color: INK_MUTED }}>
                Utility Pages
              </h4>
              <ul className="mt-4 flex flex-col gap-2.5">
                <li>
                  <FooterLink href="#contact">Resume</FooterLink>
                </li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h4 className="font-mono text-[10.5px] font-normal uppercase tracking-[0.12em]" style={{ color: INK_MUTED }}>
                Contact Us
              </h4>
              <div className="mt-4 flex flex-col gap-2.5 text-sm" style={{ color: INK_DIM }}>
                <FooterLink href="mailto:wakemanjajr@gmail.com">wakemanjajr@gmail.com</FooterLink>
                <p>Nairobi, Kenya</p>
                <p>Available Worldwide</p>
              </div>
            </div>
          </div>

          <div
            className="mt-9 flex flex-col items-start gap-3.5 border-t pt-5 font-mono text-[10.5px] tracking-[0.04em] sm:flex-row sm:items-center sm:justify-between"
            style={{ borderColor: LINE, color: INK_MUTED }}
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
                  {socialIcons[link.label]}
                </a>
              ))}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
