import type { ReactNode, MouseEventHandler } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ColorSet {
  base: string;
  defaultText: string;
  hoverFill: string;
  hoverText: string;
  dot: string;
}

interface MagicButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: MouseEventHandler;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'inverse';
  size?: 'md' | 'lg';
  /** Escape hatch for components with their own fixed (non-theme) palette,
   * e.g. Footer.tsx, which stays white-on-dark-green regardless of the
   * site's light/dark mode rather than following --accent-growth. */
  colorsOverride?: ColorSet;
}

/**
 * The three-part button hover reverse-engineered from kora.framer.media's
 * "Our Services" CTA, confirmed by sampling every moving part (fill layer,
 * both text copies, accent dot) frame-by-frame during a real hover rather
 * than guessing from how it looks:
 *
 *   1. Fill reveal - the button's own background colour never changes; a
 *      separate small seed element sits centred inside it and scales up
 *      (measured final value: scale(10,10) relative to its own tiny size)
 *      to cover the whole pill, clipped by the button's own rounded
 *      corners (`overflow-hidden`). Reads as the button "filling in" from
 *      a point at its centre, not an edge wipe.
 *   2. Text flip - two stacked copies of the label swap with opposite
 *      rotation, not a plain opacity cross-fade: the outgoing copy spins
 *      out to +30deg/scale 0.9 while the incoming one spins in from
 *      -30deg/scale 0.9 to 0/scale 1, both losing/gaining opacity at the
 *      same time.
 *   3. Accent dot - invisible at rest (scale 0), pops to scale 1 in the
 *      same timeframe as the fill.
 *
 * All three were measured running concurrently over roughly the same
 * ~300ms window, which `duration-300` on every layer reproduces. Built
 * with plain CSS `group-hover` (no JS) since nothing here needs to measure
 * a sibling element the way the nav pill did - each button is a closed,
 * self-contained system.
 */
export default function MagicButton({
  children,
  className,
  href,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  colorsOverride,
}: MagicButtonProps) {
  const sizeClasses = size === 'lg' ? 'px-8 py-4 text-base' : 'px-6 py-3 text-sm';

  // primary: solid green, fills white on hover, text flips to green.
  // inverse: transparent/outlined, fills green on hover, text flips to white -
  // the same two directions the site's existing Button.tsx primary/outline
  // variants already used, just with the fill+flip mechanics added.
  const colors =
    colorsOverride ??
    (variant === 'primary'
      ? {
          base: 'bg-accent-growth',
          defaultText: 'text-[var(--background-primary)]',
          hoverFill: 'bg-[var(--background-primary)]',
          hoverText: 'text-accent-growth',
          dot: 'bg-accent-growth',
        }
      : {
          // border-transparent on hover: the fill sits inside the border
          // (inset-0 aligns to the padding box), so the ring stays visible
          // as its own 2px edge around the now-filled button even when its
          // colour happens to match - explicit removal instead of relying
          // on a colour coincidence that breaks the moment hoverFill isn't
          // the exact same accent-growth value (e.g. via colorsOverride).
          base: 'border-2 border-accent-growth bg-transparent transition-[border-color] duration-300 group-hover:border-transparent',
          defaultText: 'text-accent-growth',
          hoverFill: 'bg-accent-growth',
          hoverText: 'text-[var(--background-primary)]',
          dot: 'bg-[var(--background-primary)]',
        });

  const content = (
    <>
      {/* inset-0 + rounded-full means this element is always exactly the
          button's own pill shape at scale(1), so it fully covers the
          button regardless of how wide any given label makes it - a fixed
          px seed scaled up by a fixed multiplier (the first version of
          this) stopped covering buttons wider than the multiplier allowed
          for, leaving their edges unfilled on hover. */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 scale-0 rounded-full transition-transform duration-300 ease-out group-hover:scale-100',
          colors.hoverFill
        )}
      />
      <span className="relative z-10 grid place-items-center">
        <span
          className={cn(
            'col-start-1 row-start-1 transition-[opacity,transform] duration-300 ease-out group-hover:-rotate-[30deg] group-hover:scale-90 group-hover:opacity-0',
            colors.defaultText
          )}
        >
          {children}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            'col-start-1 row-start-1 rotate-[30deg] scale-90 opacity-0 transition-[opacity,transform] duration-300 ease-out group-hover:rotate-0 group-hover:scale-100 group-hover:opacity-100',
            colors.hoverText
          )}
        >
          {children}
        </span>
      </span>
      <span
        aria-hidden="true"
        className={cn(
          'relative z-10 h-1.5 w-1.5 scale-0 rounded-full transition-transform duration-300 ease-out group-hover:scale-100',
          colors.dot
        )}
      />
    </>
  );

  const sharedClassName = cn(
    'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium transition-transform duration-300 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-growth focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background-primary)]',
    colors.base,
    sizeClasses,
    className
  );

  if (href) {
    return (
      <Link href={href} className={sharedClassName} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={sharedClassName} onClick={onClick}>
      {content}
    </button>
  );
}
