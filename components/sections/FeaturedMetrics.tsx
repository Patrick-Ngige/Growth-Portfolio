'use client';

import { AnimatedSection } from '@/components/ui/Section';
import FlipRevealGrid from '@/components/motion/FlipRevealGrid';
import StripReveal from '@/components/motion/StripReveal';
import { MetricBlock } from '@/components/ui/CaseStudyCard';

/**
 * The featured-metrics band, split out of the old CaseStudies section when
 * the full case-study grid was removed from Home (per instruction: only
 * Featured Work remains there now). Kept on its own since the numbers are
 * still worth leading with, just without the full 11-project grid beneath
 * them - that full browsing experience is moving to the future /work page.
 *
 * StripReveal here is colour-matched to FeaturedWorkReel's fixed dark band
 * (#000000, the same neutral set as Footer.tsx) - the section right before
 * this one - so the handoff reads as a wipe uncovering this section rather
 * than a hard colour cut. `darkColor` is a separate, lighter neutral tone:
 * this section's own dark-mode background (--background-surface, #18181B)
 * sits too close to pure black for the wipe to read as visible against it.
 */
export default function FeaturedMetrics() {
  return (
    <AnimatedSection id="impact" variant="surface" size="md">
      <StripReveal color="#000000" darkColor="#050505" />
      <div className="container-main">
        <FlipRevealGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flip-reveal-card"><MetricBlock value="+280%" label="Checkout CR" /></div>
          <div className="flip-reveal-card"><MetricBlock value="4" label="Bank & Enterprise Sites" /></div>
          <div className="flip-reveal-card"><MetricBlock value="14" label="Growth Dimensions Analyzed" /></div>
          <div className="flip-reveal-card"><MetricBlock value="4" label="Years Building" /></div>
        </FlipRevealGrid>
      </div>
    </AnimatedSection>
  );
}
