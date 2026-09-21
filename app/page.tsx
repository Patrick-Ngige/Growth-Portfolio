import Hero from '@/components/sections/Hero';
import UnfairAdvantage from '@/components/sections/UnfairAdvantage';
import BeforeAfter from '@/components/sections/BeforeAfter';
import GrowthStack from '@/components/sections/GrowthStack';
import FeaturedWorkReel from '@/components/sections/FeaturedWorkReel';
import FeaturedMetrics from '@/components/sections/FeaturedMetrics';
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
      <BeforeAfter />
      <GrowthStack />
      <FeaturedWorkReel />
      <FeaturedMetrics />
      <Methodology />
      <About />
      <Contact />
    </>
  );
}
