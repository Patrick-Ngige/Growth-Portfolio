// Case Studies and Content Data
// As specified in the strategy document

export interface CaseStudy {
  id: string;
  company: string;
  industry: string;
  category: 'web' | 'paid-media' | 'strategy';
  metricValue: string;
  metricLabel: string;
  context: string;
  challenge: string;
  approach: string;
  result: string;
  technicalExecution: string[];
  featuredImage?: string;
  tags: string[];
}

export interface Capability {
  id: string;
  title: string;
  icon: string;
  description: string;
  metrics?: string[];
}

export interface MetricSnapshot {
  label: string;
  value: number;
  suffix?: string;
}

export const capabilities: Capability[] = [
  {
    id: 'strategy',
    title: 'Growth Strategy & Funnels',
    icon: 'chart',
    description:
      'I map customer journeys, identify conversion bottlenecks, and design systems that turn casual browsers into paying customers. Every touchpoint is an opportunity to move metrics.',
  },
  {
    id: 'conversion',
    title: 'Conversion-Driven Web Design',
    icon: 'code',
    description:
      'High-converting websites are not built on templates—they are engineered based on behavioral data. I design and develop experiences optimized for the metrics that matter: conversion rate, average order value, and customer lifetime value.',
  },
  {
    id: 'paid-media',
    title: 'Paid Media Strategy',
    icon: 'target',
    description:
      'Campaigns that scale require creative systems, audience architecture, and attribution infrastructure. I build and manage Meta, Google, and LinkedIn campaigns that compound rather than decay. No vanity metrics—just attributable revenue.',
  },
  {
    id: 'analytics',
    title: 'Analytics & Experimentation',
    icon: 'flask',
    description:
      'Every claim should be testable. I implement measurement infrastructure, design experiments, and translate data into actionable insights. No gut feelings—just statistically significant results.',
  },
];

export const caseStudies: CaseStudy[] = [
  {
    id: 'phoina-beauty',
    company: 'Phoina Beauty',
    industry: 'E-commerce',
    category: 'web',
    metricValue: '+280%',
    metricLabel: 'Checkout Conversion Rate',
    context: 'Emerging beauty brand struggling with cart abandonment and checkout flow',
    challenge:
      'Phoina Beauty needed a premium e-commerce experience that matched their brand positioning. Their existing checkout flow had high abandonment rates and did not reflect the luxury positioning of their products.',
    approach:
      'Redesigned the entire checkout experience with conversion psychology principles. Implemented trust signals at friction points, streamlined the checkout to a single page, and optimized form field placement based on user behavior data.',
    result:
      'Cart abandonment decreased 45%. Average order value increased 32%. Mobile conversion rate reached 2.8%, above industry benchmark.',
    technicalExecution: [
      'Built on WooCommerce with custom checkout fields',
      'Implemented enhanced e-commerce tracking for funnel analysis',
      'Optimized page speed to 92 Lighthouse score',
      'Integrated multiple payment gateways with fallback logic',
    ],
    tags: ['E-commerce', 'WooCommerce', 'CRO', 'Conversion Optimization'],
  },
  {
    id: 'eatngo-brands',
    company: 'Eat\'N\'GO / Domino\'s / Coldstone Kenya',
    industry: 'Food & Beverage',
    category: 'web',
    metricValue: '23%',
    metricLabel: 'Reduction in CPA',
    context: 'Multi-brand restaurant group with separate websites for each brand',
    challenge:
      'Eat\'N\'GO Kenya manages multiple restaurant brands with separate websites. Each brand required consistent brand representation while maintaining individual identity. Performance and Core Web Vitals were affecting ad quality scores.',
    approach:
      'Built a multi-brand architecture with shared component library enabling rapid new brand deployment. Implemented systematic performance optimization across all properties. Focused on Core Web Vitals improvements to boost Google Ads Quality Scores.',
    result:
      'New brand deployment time reduced from weeks to days. Core Web Vitals improved from Poor to Excellent across all sites. Google Ads Quality Score improved, contributing to 23% reduction in cost-per-acquisition.',
    technicalExecution: [
      'Built shared component library with React',
      'Implemented systematic image optimization and lazy loading',
      'Configured proper caching strategies with service workers',
      'Set up unified analytics across all brand sites',
    ],
    tags: ['Multi-brand', 'Performance', 'Core Web Vitals', 'Component Library'],
  },
  {
    id: 'jackpot-lottery',
    company: 'Jackpot Lottery Online',
    industry: 'Gaming / Betting',
    category: 'strategy',
    metricValue: '20+',
    metricLabel: 'Language Implementations',
    context: 'International betting platform requiring multi-language support for global expansion',
    challenge:
      'Jackpot Lottery Online needed to expand into new markets with localized experiences. Their platform required proper tracking infrastructure for multi-touch attribution across 20+ languages and multiple currencies.',
    approach:
      'Built scalable internationalization (i18n) infrastructure enabling rapid market expansion. Implemented comprehensive tracking architecture across all conversion events for proper multi-touch attribution modeling. Created localized landing pages for each market.',
    result:
      'Successfully launched in 20+ markets with localized experiences. Implemented proper tracking enabling accurate attribution across the customer journey. Market expansion timeline reduced from months to weeks.',
    technicalExecution: [
      'Built scalable i18n infrastructure with proper fallbacks',
      'Implemented server-side tracking for accuracy',
      'Created proper UTM and attribution tracking',
      'Integrated with multiple analytics platforms',
    ],
    tags: ['i18n', 'Tracking', 'Multi-market', 'Attribution'],
  },
  {
    id: 'enterprise-cms',
    company: 'I&M Bank, KCB Group, TotalEnergies Kenya',
    industry: 'Enterprise / Finance',
    category: 'web',
    metricValue: '+45%',
    metricLabel: 'Organic Traffic Increase',
    context: 'Enterprise organizations requiring secure, performant CMS development',
    challenge:
      'Major enterprise organizations in Kenya needed modern, secure, and performant websites. Legacy systems were slow, difficult to maintain, and lacked proper SEO infrastructure. Security compliance was critical for financial institutions.',
    approach:
      'Developed enterprise-grade CMS solutions with focus on security compliance and performance at scale. Implemented comprehensive technical SEO infrastructure including structured data, sitemaps, and performance optimization. Created secure authentication and authorization systems.',
    result:
      'Organic traffic increased 45% year-over-year across managed sites. Site speed improvements reduced bounce rate by 32%. Security audit compliance achieved for all financial institution clients.',
    technicalExecution: [
      'Built on WordPress with custom security hardening',
      'Implemented technical SEO with structured data',
      'Optimized images and implemented CDN distribution',
      'Created automated backup and monitoring systems',
    ],
    tags: ['Enterprise', 'CMS', 'Security', 'Technical SEO', 'Performance'],
  },
];

export const methodologySteps = [
  {
    step: 1,
    title: 'Research',
    description: 'Deep dive into your current state: analytics audit, competitive analysis, and customer research.',
    icon: 'search',
  },
  {
    step: 2,
    title: 'Hypothesis',
    description: 'Formulation of testable assumptions based on research insights and growth potential prioritization.',
    icon: 'lightbulb',
  },
  {
    step: 3,
    title: 'Build',
    description: 'Rapid implementation of experiments using development capability—no external dependencies or delays.',
    icon: 'code',
  },
  {
    step: 4,
    title: 'Launch',
    description: 'Campaign deployment with proper tracking, segmentation, and measurement infrastructure.',
    icon: 'rocket',
  },
  {
    step: 5,
    title: 'Measure',
    description: 'Data collection and analysis against pre-defined success metrics and statistical significance.',
    icon: 'chart',
  },
  {
    step: 6,
    title: 'Iterate',
    description: 'Learning aggregation and next-experiment prioritization based on data insights.',
    icon: 'refresh',
  },
];

export const metricsSnapshot: MetricSnapshot[] = [
  { label: 'Projects Completed', value: 15, suffix: '+' },
  { label: 'Conversion Improvements', value: 35, suffix: '% avg' },
  { label: 'Ad Budget Managed', value: 50, suffix: 'K+' },
  { label: 'Years Experience', value: 2, suffix: '' },
];

export const aboutNarrative = {
  paragraph1:
    'I started my journey in marketing and development, always curious about what makes people click, convert, and come back for more.',
  paragraph2:
    'Early on, I noticed a gap: marketers had great ideas but waited weeks for developers to build them. I decided to bridge that gap by learning to build what I could design.',
  paragraph3:
    'Over the past 2 years, I have been building landing pages, running A/B tests, and managing ad campaigns for businesses looking to grow.',
  paragraph4:
    'My approach is simple: test fast, measure honestly, and keep improving. I am still learning every day and excited to take on new challenges.',
  paragraph5:
    'I work with founders and teams who are building something meaningful and need help getting their message in front of the right people.',
};

export const navigationLinks = [
  { label: 'Work', href: '#work' },
  { label: 'Approach', href: '#approach' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export const socialLinks = [
  { label: 'LinkedIn', url: 'https://linkedin.com/in/patrick-ngige' },
  { label: 'GitHub', url: 'https://github.com/Patrick-Ngige' },
  { label: 'Dribbble', url: 'https://dribbble.com' },
];

export const categoryFilters = [
  { id: 'all', label: 'All Work', count: caseStudies.length },
  { id: 'web', label: 'Web & Conversion', count: caseStudies.filter((c) => c.category === 'web').length },
  { id: 'paid-media', label: 'Paid Media', count: caseStudies.filter((c) => c.category === 'paid-media').length },
  { id: 'strategy', label: 'Growth Strategy', count: caseStudies.filter((c) => c.category === 'strategy').length },
];
