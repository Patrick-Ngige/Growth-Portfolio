import { Metadata } from 'next';

export const siteMetadata = {
  title: {
    default: 'Patrick Ngige | Growth Marketer | Web, Paid Media & Conversion Strategy',
    template: '%s | Patrick Ngige',
  },
  description:
    'Growth Marketer who bridges Front-End Development and Performance Marketing. I design, launch, and scale digital systems that turn traffic into revenue.',
  keywords: [
    'Growth Marketer',
    'Performance Marketing',
    'Conversion Rate Optimization',
    'Paid Media Strategy',
    'Web Development',
    'CRO',
    'A/B Testing',
    'Digital Marketing',
    'Startup Growth',
    'Growth Strategy',
  ],
  authors: [{ name: 'Patrick Ngige' }],
  creator: 'Patrick Ngige',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://patrick-growth.com',
    siteName: 'Patrick Ngige | Growth Marketer',
    title: 'Patrick Ngige | Growth Marketer | Web, Paid Media & Conversion Strategy',
    description:
      'Growth Marketer who bridges Front-End Development and Performance Marketing. I design, launch, and scale digital systems that turn traffic into revenue.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Patrick Ngige - Growth Marketer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Patrick Ngige | Growth Marketer',
    description:
      'Growth Marketer who bridges Front-End Development and Performance Marketing.',
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
  jobTitle: 'Growth Marketer',
  description:
    'Growth Marketer who bridges Front-End Development and Performance Marketing to scale startups.',
  url: 'https://patrick-growth.com',
  sameAs: [
    'https://linkedin.com/in/patrick-ngige',
    'https://github.com/Patrick-Ngige',
  ],
  knowsAbout: [
    'Growth Marketing',
    'Paid Media',
    'Conversion Optimization',
    'Web Development',
    'A/B Testing',
    'Analytics',
  ],
};
