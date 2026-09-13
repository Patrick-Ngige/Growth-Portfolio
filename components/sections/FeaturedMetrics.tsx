'use client';

import { AnimatedSection } from '@/components/ui/Section';
import FlipRevealGrid from '@/components/motion/FlipRevealGrid';
import { MetricBlock } from '@/components/ui/CaseStudyCard';

/**
 * The featured-metrics band, split out of the old CaseStudies section when
 * the full case-study grid was removed from Home (per instruction: only
 * Featured Work remains there now). Kept on its own since the numbers are
 * still worth leading with, just without the full 11-project grid beneath
 * them - that full browsing experience is moving to the future /work page.
 */
export default function FeaturedMetrics() {
  return (
    <AnimatedSection id="impact" variant="surface" size="md">
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
