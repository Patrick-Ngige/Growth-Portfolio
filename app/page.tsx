import Hero from '@/components/sections/Hero';
import UnfairAdvantage from '@/components/sections/UnfairAdvantage';
import GrowthStack from '@/components/sections/GrowthStack';
import WorkflowDiagram from '@/components/sections/WorkflowDiagram';
import FeaturedWorkReel from '@/components/sections/FeaturedWorkReel';
import Methodology from '@/components/sections/Methodology';
import About from '@/components/sections/About';
import Contact from '@/components/sections/Contact';

// Static export configuration
export const dynamic = 'force-static';
export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <Hero />
      <UnfairAdvantage />
      <GrowthStack />
      <WorkflowDiagram />
      <FeaturedWorkReel />
      <Methodology />
      <About />
      <Contact />
    </>
  );
}
