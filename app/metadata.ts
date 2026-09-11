import { Metadata } from 'next';

export const siteMetadata = {
  title: {
    default: 'Patrick Ngige | Growth Engineer | Frontend Development & Conversion Systems',
    template: '%s | Patrick Ngige',
  },
  description:
    'Growth Engineer and frontend developer who builds and instruments the web systems behind measurable growth: production front-ends, tracked experiments, and automation.',
  keywords: [
    'Growth Engineer',
    'Frontend Developer',
    'Conversion Rate Optimization',
    'Web Development',
    'CRO',
    'A/B Testing',
    'Marketing Automation',
    'Analytics Instrumentation',
    'Next.js Developer',
    'Growth Engineering',
  ],
  authors: [{ name: 'Patrick Ngige' }],
  creator: 'Patrick Ngige',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://growth-portfolio.vercel.app',
    siteName: 'Patrick Ngige | Growth Engineer',
    title: 'Patrick Ngige | Growth Engineer | Frontend Development & Conversion Systems',
    description:
      'Growth Engineer and frontend developer who builds and instruments the web systems behind measurable growth: production front-ends, tracked experiments, and automation.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Patrick Ngige - Growth Engineer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Patrick Ngige | Growth Engineer',
    description:
      'Growth Engineer and frontend developer who builds and instruments the web systems behind measurable growth.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'standard' as const,
      'max-snippet': -1,
    },
  },
};

export const metadata: Metadata = {
  ...siteMetadata,
};

export const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Patrick Ngige',
  jobTitle: 'Growth Engineer',
  description:
    'Growth Engineer and frontend developer who builds and instruments the web systems behind measurable growth for banks, foundations, and payment platforms.',
  url: 'https://growth-portfolio.vercel.app',
  sameAs: [
    'https://ke.linkedin.com/in/patrick-ngige-4b772623b',
    'https://github.com/Patrick-Ngige',
  ],
  knowsAbout: [
    'Growth Engineering',
    'Frontend Development',
    'Conversion Optimization',
    'Web Development',
    'A/B Testing',
    'Analytics Instrumentation',
    'Marketing Automation',
  ],
};
