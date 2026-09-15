import { notFound } from 'next/navigation';
import { caseStudies } from '@/lib/data';
import WorkDetailView from '@/components/sections/WorkDetailView';

/**
 * Server half - generateStaticParams/generateMetadata can't live in a
 * 'use client' file, so the actual page markup (WebGL hero, framer
 * reveals, MagneticButton) lives in components/sections/WorkDetailView.
 */

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.id }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const study = caseStudies.find((c) => c.id === params.slug);
  if (!study) return {};
  return {
    title: study.company,
    description: study.context,
  };
}

export default function WorkDetailPage({ params }: { params: { slug: string } }) {
  const study = caseStudies.find((c) => c.id === params.slug);
  if (!study) notFound();

  return <WorkDetailView study={study} />;
}
