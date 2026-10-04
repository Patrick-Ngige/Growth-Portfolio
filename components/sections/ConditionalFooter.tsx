'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

// The /work index is meant to be a still, non-scrolling page (its own list
// scrolls internally instead) - a full Footer stacked underneath would add
// page-level scroll height, working against that. Every other route still
// gets the real Footer. Exact-match only ('/work'), not '/work/[slug]' -
// individual case-study pages keep their footer as normal.
export default function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname === '/work') return null;
  return <Footer />;
}
