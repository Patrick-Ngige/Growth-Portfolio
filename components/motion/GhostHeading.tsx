import type { ReactNode } from 'react';

/**
 * Oversized, near-invisible outline word sitting behind a real heading -
 * adds depth and scale without a new color or asset. Prototyped in the
 * "borrowed elements" artboard against thirdway.com's "Six teams" section
 * header; this is that same treatment.
 *
 * `ghost` is a single short word (renders in one line, absolutely
 * positioned behind `children`) - long phrases will overflow sideways on
 * narrow viewports, so keep it to one word per instance.
 */
export default function GhostHeading({
  ghost,
  children,
  align = 'left',
}: {
  ghost: string;
  children: ReactNode;
  align?: 'left' | 'center';
}) {
  return (
    <div className="relative">
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -top-[0.15em] select-none whitespace-nowrap font-display text-[13vw] font-bold leading-none text-[var(--text-primary)] opacity-[0.05] sm:text-[9vw] lg:text-[7vw] ${
          align === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0'
        }`}
      >
        {ghost}
      </span>
      <div className="relative">{children}</div>
    </div>
  );
}
