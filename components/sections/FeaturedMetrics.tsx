'use client';

import StripReveal from '@/components/motion/StripReveal';
import { MetricBlock } from '@/components/ui/CaseStudyCard';

/**
 * The featured-metrics band, split out of the old CaseStudies section when
 * the full case-study grid was removed from Home (per instruction: only
 * Featured Work remains there now). Kept on its own since the numbers are
 * still worth leading with, just without the full 11-project grid beneath
 * them - that full browsing experience is moving to the future /work page.
 *
 * A plain hand-rolled `<section>` here, deliberately NOT `AnimatedSection`/
 * `Section` - `StripReveal`'s `cover` mode needs to be a DIRECT child of the
 * section it pins (it reads `coverRef.current.parentElement` as the
 * trigger), and `Section` always wraps its children one level deeper inside
 * `.container-main`, which would make it pin that inner div instead of the
 * section's own full-bleed, backgrounded box.
 *
 * `min-h-screen` + flex centring matters for a second reason: `cover` mode
 * (ported verbatim from trionn-rebuild's `homeStripReveal`) only lands the
 * next section (Methodology) at exactly y:0 with no gap or overshoot when
 * this section's own natural height equals one viewport - see the
 * PinnedPillars.tsx / growth-engineer-brand HANDOFF.md notes on why that
 * math only works out at exactly 100vh.
 */
export default function FeaturedMetrics() {
  return (
    <section
      id="impact"
      className="relative flex min-h-screen w-full flex-col justify-center bg-[var(--surface-color)] py-24 dark:bg-[var(--background-surface)] lg:py-28"
    >
      {/* Plain grid, deliberately no entrance animation of its own (no more
          FlipRevealGrid rotateX flip) - the strip reveal handing off from
          Featured Work is already this section's entrance; a second,
          separate one stacked on top was redundant, the same reasoning
          that dropped AnimatedSection's fade from GrowthStack. */}
      <div className="container-main">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricBlock value="+280%" label="Checkout CR" />
          <MetricBlock value="4" label="Bank & Enterprise Sites" />
          <MetricBlock value="14" label="Growth Dimensions Analyzed" />
          <MetricBlock value="4" label="Years Building" />
        </div>
      </div>

      {/* Hands off into Methodology - colour-matched to its background
          (--background-primary) so the strips growing to solid colour and
          Methodology's own section, already scrolled into place underneath,
          read as one continuous surface with no visible seam. */}
      <StripReveal mode="cover" color="#C3C3C3" darkColor="#09090B" />
    </section>
  );
}
