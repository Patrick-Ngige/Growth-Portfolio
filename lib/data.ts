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
      'High-converting websites are not built on templates. They are engineered based on behavioral data. I design and develop experiences optimized for the metrics that matter: conversion rate, average order value, and customer lifetime value.',
  },
  {
    id: 'paid-media',
    title: 'Paid Media Strategy',
    icon: 'target',
    description:
      'Campaigns that scale require creative systems, audience architecture, and attribution infrastructure. I build and manage Meta, Google, and LinkedIn campaigns that compound rather than decay, tracked to attributable revenue, not vanity metrics.',
  },
  {
    id: 'analytics',
    title: 'Analytics & Experimentation',
    icon: 'flask',
    description:
      'Every claim should be testable. I implement measurement infrastructure, design experiments, and translate data into actionable insights: statistically significant results, not gut feelings.',
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
    context: 'Ecommerce development, a side project done in collaboration, for an emerging beauty brand struggling with cart abandonment and checkout flow',
    challenge:
      'Phoina Beauty needed a premium e-commerce experience that matched their brand positioning. Their existing checkout flow had high abandonment rates and did not reflect the luxury positioning of their products.',
    approach:
      'Redesigned the entire checkout experience with conversion psychology principles. Implemented trust signals at friction points, streamlined the checkout to a single page, and optimized form field placement based on user behavior data.',
    result:
      'Checkout completion rate improved substantially after the rebuild. A full before/after breakdown is being documented and will be added here once verified.',
    technicalExecution: [
      'Built on WooCommerce with custom checkout fields',
      'Implemented enhanced e-commerce tracking for funnel analysis',
      'Diagnosed the leak as cart abandonment, not a traffic problem, before rebuilding',
    ],
    tags: ['E-commerce', 'WooCommerce', 'CRO', 'Side Project', 'Collaboration'],
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
      'Shipped a 20+ language localization with proper tracking and attribution infrastructure in place, enabling multi-market launches without rebuilding the tracking setup each time.',
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
    company: 'KCB Bank, I&M Bank, TotalEnergies Kenya, Prime Bank',
    industry: 'Enterprise / Finance',
    category: 'web',
    metricValue: '4',
    metricLabel: 'Enterprise & Bank Sites Built',
    context:
      'As part of the Creative Edge / FCB Nairobi team, building websites for banks and enterprise clients, each matching that client\'s existing CMS infrastructure',
    challenge:
      'Each organization needed a modern, secure, well-structured website on the CMS their team already standardized on, not a one-size-fits-all rebuild.',
    approach:
      'Rebuilt KCB Bank\'s website on Statamic, focused on Core Web Vitals and information architecture as part of a broader SEO-driven redesign. Built a WordPress site for I&M Bank and a Drupal site for TotalEnergies Kenya, each matching the client\'s existing CMS. Currently building a website for Prime Bank.',
    result:
      'Three sites shipped (KCB, I&M, TotalEnergies); Prime Bank in development. Work delivered as part of the Creative Edge / FCB Nairobi team, not solo client ownership.',
    technicalExecution: [
      'Statamic build for KCB Bank',
      'WordPress build for I&M Bank',
      'Drupal build for TotalEnergies Kenya',
      'Prime Bank build in progress',
    ],
    tags: ['Enterprise', 'CMS', 'Statamic', 'WordPress', 'Drupal'],
  },
  {
    id: 'strathmore-foundation',
    company: 'Strathmore Foundation',
    industry: 'Education / Nonprofit',
    category: 'strategy',
    metricValue: '3',
    metricLabel: 'Platforms Wired to Server-Side Tracking',
    context: 'KOB STEM donation funnel measurement, ongoing, plus two live university sites',
    challenge:
      'Donation events needed to be measured accurately across GA4, Meta, and Google Ads without relying on client-side pixels alone, which lose events to ad blockers and browser tracking prevention.',
    approach:
      'Designed the GA4 and Google Tag Manager measurement architecture for the KOB STEM donation funnel, including a server-side purchase event verified against DPO Pay\'s payment callback and relayed to GA4, Meta CAPI, and Google Ads. Also built and shipped foundation.strathmore.edu and alumni.strathmore.edu.',
    result:
      'Server-side purchase event live and verified against the payment provider\'s callback. Both university sites shipped and live.',
    technicalExecution: [
      'GA4 + Google Tag Manager measurement architecture',
      'Server-side purchase event verified against DPO Pay\'s payment callback',
      'Events relayed to GA4, Meta CAPI, and Google Ads',
      'foundation.strathmore.edu and alumni.strathmore.edu built and shipped',
    ],
    tags: ['Analytics', 'Server-Side Tracking', 'GA4', 'Nonprofit'],
  },
  {
    id: 'ngige-growth-audit',
    company: 'Ngige Growth Audit (solo-built product)',
    industry: 'AI / SaaS',
    category: 'strategy',
    metricValue: '14',
    metricLabel: 'Growth Dimensions Analyzed',
    context: 'A solo-built AI growth-audit tool, designed, built, and shipped independently',
    challenge:
      'Most growth audits are manual and slow. Wanted a tool that could research a business live on the web and score it across the dimensions that actually predict growth.',
    approach:
      'Built the frontend on Next.js 15 and TypeScript, with the Claude API performing live web research and a Supabase backend. Wired in M-Pesa Daraja, Paystack, and Stripe payment rails for monetization.',
    result:
      'Shipped independently end to end: product design, frontend, AI research pipeline, backend, and payments.',
    technicalExecution: [
      'Next.js 15 + TypeScript frontend',
      'Claude API performing live web research',
      'Supabase backend',
      'M-Pesa Daraja, Paystack, and Stripe payment integration',
    ],
    tags: ['AI', 'Solo Product', 'Next.js', 'Payments'],
  },
  {
    id: 'organic-growth',
    company: 'A well-known Kenyan private university, and an international payment gateway operating across Africa',
    industry: 'Education / Fintech',
    category: 'strategy',
    metricValue: '+200%',
    metricLabel: 'Organic Traffic Growth',
    context: 'SEO content campaigns run for two different organizations: a Kenyan private university and an overseas payment gateway company with African operations',
    challenge:
      'Both organizations needed sustainable organic growth without depending purely on paid acquisition, one to reach prospective students, the other to build search visibility and authority content for a fintech audience across African markets.',
    approach:
      'Built data-driven content strategies shaped by Ahrefs keyword research and Hotjar behavior data, tailored to each organization\'s audience and search intent.',
    result:
      'Organic traffic grew substantially across both campaigns. A full before/after breakdown is being documented and will be added here once verified.',
    technicalExecution: [
      'Ahrefs keyword research and content gap analysis',
      'Hotjar behavior data informing content structure',
      'On-page and technical SEO implementation',
    ],
    tags: ['SEO', 'Content Strategy', 'Organic Growth'],
  },
  {
    id: 'analytics-dashboard',
    company: 'Analytics Dashboard (automated reporting)',
    industry: 'Data / Analytics',
    category: 'strategy',
    metricValue: '10K+',
    metricLabel: 'Data Points Processed Daily',
    context: 'An automated data pipeline and reporting system, built to replace manual reporting work',
    challenge:
      'Manual reporting was slow, error-prone, and required someone to pull and reconcile data by hand before it could be used for decisions.',
    approach:
      'Built automated data pipelines using SQL, MySQL, and n8n to collect, transform, and route data automatically instead of manually.',
    result:
      'Processes 10,000+ data points daily without manual intervention.',
    technicalExecution: [
      'SQL and MySQL data pipeline',
      'n8n workflow automation',
      'Automated daily processing at 10,000+ data points',
    ],
    tags: ['Automation', 'SQL', 'n8n', 'Analytics'],
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
    description: 'Rapid implementation of experiments using development capability, with no external dependencies or delays.',
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
  { label: 'Years Building', value: 4, suffix: '' },
  { label: 'Enterprise & Bank Sites', value: 4, suffix: '' },
  { label: 'Public GitHub Repos', value: 50, suffix: '+' },
  { label: 'Languages Localized', value: 20, suffix: '+' },
];

export const aboutNarrative = {
  paragraph1:
    'I started as a developer, building custom WordPress sites and front ends for small clients and internships in 2022.',
  paragraph2:
    'The last two and a half years have been full-time at Creative Edge / FCB Nairobi, progressing from intern to Web Developer on the iD7 division, building for banks, foundations, and payment platforms.',
  paragraph3:
    'I noticed most growth ideas stall waiting on a dev queue, so I build the fix myself: the front end, the tracking, and the automation, end to end.',
  paragraph4:
    'My approach is simple: build it, instrument it properly, and measure honestly instead of guessing.',
  paragraph5:
    'I work with founders, teams, and clients who need someone who can ship a growth idea, not just design one.',
};

export const navigationLinks = [
  { label: 'Work', href: '#work' },
  { label: 'Approach', href: '#approach' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export const socialLinks = [
  { label: 'LinkedIn', url: 'https://ke.linkedin.com/in/patrick-ngige-4b772623b' },
  { label: 'GitHub', url: 'https://github.com/Patrick-Ngige' },
];

export const categoryFilters = [
  { id: 'all', label: 'All Work', count: caseStudies.length },
  { id: 'web', label: 'Web & Conversion', count: caseStudies.filter((c) => c.category === 'web').length },
  { id: 'strategy', label: 'Growth Strategy', count: caseStudies.filter((c) => c.category === 'strategy').length },
];
