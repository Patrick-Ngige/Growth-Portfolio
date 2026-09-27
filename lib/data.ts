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
  images?: string[];
  tags: string[];
  inProgress?: boolean;
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
    id: 'kcb-bank',
    company: 'KCB Bank',
    industry: 'Enterprise / Finance',
    category: 'web',
    metricValue: '8',
    metricLabel: 'Regional Sites Shipped',
    context:
      'As part of the Creative Edge / FCB Nairobi team, spanning both the front-end build and the backend integration: KCB Group\'s website and its regional subsidiary sites (Kenya, Uganda, Tanzania, Rwanda/BPR, South Sudan, Bancassurance, Insurance) moved from the UI/UX team\'s designs to a hand-coded front-end in HTML, CSS, JavaScript, and jQuery, then into a headless WordPress build.',
    challenge:
      'A regional banking group needed one consistent site across its Kenya headquarters and every subsidiary market, on a front-end built to plug cleanly into a headless CMS rather than each country drifting into its own one-off theme.',
    approach:
      'Carried the UI/UX team\'s designs through the full build: a front-end in HTML, CSS, JavaScript, and jQuery, wired into a headless WordPress instance shared across KCB Group and its regional subsidiaries.',
    result:
      'Group site and regional subsidiary sites shipped and live on headless WordPress. Delivered as part of the Creative Edge / FCB Nairobi team, not solo client ownership.',
    technicalExecution: [
      'Front-end built in HTML, CSS, JavaScript, and jQuery from the UI/UX team\'s designs',
      'Integrated into a headless WordPress instance shared across KCB Group and its regional subsidiaries',
    ],
    images: [
      '/images/work/kcb-bank/kcb-ke.png',
      '/images/work/kcb-bank/kcb-group.png',
      '/images/work/kcb-bank/kcb-insurance.png',
      '/images/work/kcb-bank/kcb-bi.png',
      '/images/work/kcb-bank/kcb-ss.png',
      '/images/work/kcb-bank/kcb-bpr-rwanda.png',
      '/images/work/kcb-bank/kcb-tanzania.png',
      '/images/work/kcb-bank/kcb-uganda.png',
      '/images/work/kcb-bank/kcb-investor-relations.webp',
      '/images/work/kcb-bank/kcb-group-2.png',
      '/images/work/kcb-bank/kcb-about-2.png',
      '/images/work/kcb-bank/kcb-sports-football-2.png',
      '/images/work/kcb-bank/kcb-kenya-home-2.png',
      '/images/work/kcb-bank/kcb-rwanda-branches.png',
      '/images/work/kcb-bank/kcb-sahl-2.png',
      '/images/work/kcb-bank/kcb-diaspora-2.png',
      '/images/work/kcb-bank/kcb-uganda-credit-cards-2.png',
    ],
    tags: ['Enterprise', 'CMS', 'WordPress', 'jQuery', 'Banking'],
  },
  {
    id: 'im-bank',
    company: 'I&M Bank',
    industry: 'Enterprise / Finance',
    category: 'web',
    metricValue: '5',
    metricLabel: 'Regional Sites Maintained',
    context:
      'As part of the Creative Edge / FCB Nairobi team: ongoing maintenance and additional development across I&M Group\'s website and its regional subsidiary sites (Kenya, Uganda, Tanzania, Rwanda), a WordPress build inherited from a prior team, not built from scratch.',
    challenge:
      'A live, multi-country banking group site needed continuous upkeep and new feature work across five markets without disrupting an existing WordPress setup built before this engagement started.',
    approach:
      'Ongoing maintenance and additional development on the existing WordPress builds for I&M Group and its Kenya, Uganda, Tanzania, and Rwanda subsidiary sites.',
    result:
      'All five sites kept current and extended with new development as requirements come in, across the group and regional subsidiary sites.',
    technicalExecution: [
      'WordPress maintenance across I&M Group and its regional subsidiaries',
      'Additional feature development on the existing WordPress builds',
    ],
    images: [
      '/images/work/im-bank/im-group.png',
      '/images/work/im-bank/im-kenya.png',
      '/images/work/im-bank/im-tanzania.png',
      '/images/work/im-bank/im-uganda.png',
      '/images/work/im-bank/im-rwanda.png',
      '/images/work/im-bank/im-group-3.png',
      '/images/work/im-bank/im-capital-2.png',
      '/images/work/im-bank/im-kenya-3.png',
      '/images/work/im-bank/im-rwanda-3.png',
      '/images/work/im-bank/im-tanzania-3.png',
      '/images/work/im-bank/im-uganda-about-2.png',
      '/images/work/im-bank/im-uganda-speakup-2.png',
    ],
    tags: ['Enterprise', 'CMS', 'WordPress', 'Maintenance', 'Banking'],
  },
  {
    id: 'totalenergies-kenya',
    company: 'TotalEnergies Kenya',
    industry: 'Enterprise / Energy',
    category: 'web',
    metricValue: '1',
    metricLabel: 'Site Maintained',
    context:
      'As part of the Creative Edge / FCB Nairobi team: mainly maintenance on TotalEnergies Kenya\'s Drupal site, not a from-scratch build.',
    challenge:
      'A live enterprise Drupal site needed reliable upkeep for an energy brand running ongoing campaigns and content updates.',
    approach:
      'Mainly maintenance work on TotalEnergies Kenya\'s existing Drupal site.',
    result:
      'Site kept current and stable on Drupal.',
    technicalExecution: [
      'Drupal maintenance for TotalEnergies Kenya',
    ],
    images: [
      '/images/work/totalenergies-kenya/totalenergies-home.png',
      '/images/work/totalenergies-kenya/total-home.png',
      '/images/work/totalenergies-kenya/total-lpg.png',
      '/images/work/totalenergies-kenya/total-lpg-prices.png',
      '/images/work/totalenergies-kenya/total-safety.png',
      '/images/work/totalenergies-kenya/total-sports.png',
    ],
    tags: ['Enterprise', 'CMS', 'Drupal', 'Maintenance'],
  },
  {
    id: 'prime-bank',
    company: 'Prime Bank',
    industry: 'Enterprise / Finance',
    category: 'web',
    metricValue: '1',
    metricLabel: 'Site Shipped & Live',
    context:
      'As part of the Creative Edge / FCB Nairobi team, spanning both the front-end build and the backend integration: Prime Bank\'s website moved from the UI/UX team\'s designs to a hand-coded front-end in HTML, CSS, JavaScript, and jQuery, then into a headless WordPress build.',
    challenge:
      'Prime Bank needed a website that matched the bank\'s own standards for security and structure, on a front-end built to plug cleanly into a headless CMS rather than starting from a generic theme.',
    approach:
      'Carried the UI/UX team\'s designs through the full build: a front-end in HTML, CSS, JavaScript, and jQuery, wired into headless WordPress as the site\'s CMS.',
    result:
      'Shipped and live on headless WordPress.',
    technicalExecution: [
      'Front-end built in HTML, CSS, JavaScript, and jQuery from the UI/UX team\'s designs',
      'Integrated into headless WordPress as the site\'s CMS',
    ],
    images: [
      '/images/work/prime-bank/prime-bank.png',
      '/images/work/prime-bank/prime-bank-home-2.png',
      '/images/work/prime-bank/prime-bank-about.png',
      '/images/work/prime-bank/prime-bank-leadership.png',
      '/images/work/prime-bank/prime-bank-cards.png',
      '/images/work/prime-bank/prime-bank-savings.png',
      '/images/work/prime-bank/prime-bank-asset-finance.png',
      '/images/work/prime-bank/prime-bank-lending-solutions.png',
      '/images/work/prime-bank/prime-bank-contact.png',
    ],
    tags: ['Enterprise', 'CMS', 'WordPress', 'jQuery', 'Banking'],
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
    images: [
      '/images/work/strathmore-foundation/alumni-strathmore.png',
      '/images/work/strathmore-foundation/strath-foundation-home.png',
      '/images/work/strathmore-foundation/strath-foundation-about.png',
      '/images/work/strathmore-foundation/strath-foundation-what-we-do.png',
      '/images/work/strathmore-foundation/strath-foundation-kob-project.png',
      '/images/work/strathmore-foundation/strath-foundation-impact-stories.png',
      '/images/work/strathmore-foundation/strath-foundation-partnership.png',
      '/images/work/strathmore-foundation/strath-alumni-home.png',
      '/images/work/strathmore-foundation/strath-alumni-about.png',
      '/images/work/strathmore-foundation/strath-alumni-stp.png',
      '/images/work/strathmore-foundation/strath-alumni-suaya-awards.png',
      '/images/work/strathmore-foundation/strath-alumni-event.png',
      '/images/work/strathmore-foundation/strath-alumni-news.png',
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
    images: ['/images/work/ngige-growth-audit/audit-tool.jpg'],
    tags: ['AI', 'Solo Product', 'Next.js', 'Payments'],
  },
  {
    id: 'pulseke',
    company: 'PulseKE (personal project, solo product)',
    industry: 'SaaS / MarTech',
    category: 'strategy',
    metricValue: '8',
    metricLabel: 'Product Areas Designed & Built',
    context:
      'A solo-designed and built influencer marketing intelligence platform for the Kenyan and broader East African market, built Kenya-first with a from-scratch design system, not adapted from a Western tool',
    challenge:
      'Kenya\'s influencer economy is growing fast but stays fragmented: brands and agencies coordinate creator discovery, deal flow, and payments across spreadsheets, WhatsApp threads, M-Pesa confirmations, and manual analytics exports. International tools like Grin and AspireIQ ignore M-Pesa, KRA tax compliance, and local market specifics entirely, and no dedicated local platform filled that gap.',
    approach:
      'Designed and built a Kenya-first platform end to end across 8 modules: a live campaign-health Dashboard, Campaigns management, creator Discovery with niche/tier/platform filtering, deep-metrics Analytics, a brand-creator Hub, digital-signing Contracts, Payments scheduling and disbursement tracking, and AI Insights for recommendations and anomaly detection. Built a design system from scratch rather than relying on default Tailwind styling: a 6-level depth stack (--bg through --raised) for visual hierarchy on dark layouts without leaning on shadows, and colour-coded section accents (blue for metrics, teal for analytics, amber for alerts, green for live feed, purple for AI/sentiment) so the eye can jump straight to a section without reading labels. Dark mode is the default, not an afterthought, since the primary user is a marketing manager reviewing performance data for extended sessions, and charts read more legibly against a dark canvas.',
    result:
      'Shipped as a fully navigable prototype across all 8 modules, demo-ready for stakeholders and investors: a clean production build with zero TypeScript errors (tsc --noEmit), 12 statically generated routes, and a consistent design language throughout.',
    technicalExecution: [
      'Next.js 14 App Router (React Server Components + Client Components), TypeScript in strict mode',
      'Tailwind CSS plus a custom design-token system via CSS variables, chosen over Tailwind alone for runtime theming and contextual depth changes (e.g. a card elevating only on hover)',
      'Chart.js analytics visualizations, full dark mode, mobile-responsive layout with a collapsible sidebar',
      'Kenya-first product decisions: M-Pesa-first payouts, KRA withholding tax, EAT timezone, Swahili UI support',
      'API-shaped data layer designed for a one-file swap to live integrations',
    ],
    images: [
      '/images/work/pulseke/campaign-dashboard.jpg',
      '/images/work/pulseke/talent-discovery.jpg',
      '/images/work/pulseke/ai-insights.jpg',
      '/images/work/pulseke/advanced-analytics.jpg',
      '/images/work/pulseke/payments-compliance.jpg',
      '/images/work/pulseke/contracts-agreements.jpg',
    ],
    tags: ['Personal Project', 'SaaS', 'Next.js', 'Design System'],
  },
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
    images: [
      '/images/work/phoina-beauty/phoina-shop.png',
      '/images/work/phoina-beauty/phoina-makeup-studio.png',
      '/images/work/phoina-beauty/phoina-hair-studio.png',
      '/images/work/phoina-beauty/phoina-academy.png',
      '/images/work/phoina-beauty/phoina-event-gallery.png',
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
    id: 'university-organic-growth',
    company: 'A well-known Kenyan private university',
    industry: 'Education',
    category: 'strategy',
    metricValue: 'Significant',
    metricLabel: 'Organic Traffic Growth',
    context: 'An SEO content campaign for a well-known Kenyan private university',
    challenge:
      'The university needed to reach prospective students organically, without depending purely on paid acquisition for admissions traffic.',
    approach:
      'Built a data-driven content strategy shaped by Ahrefs keyword research and Hotjar behavior data, targeting prospective-student search intent.',
    result:
      'Organic traffic grew substantially. A full before/after breakdown is being documented and will be added here once verified.',
    technicalExecution: [
      'Ahrefs keyword research and content gap analysis',
      'Hotjar behavior data informing content structure',
      'On-page and technical SEO implementation',
    ],
    tags: ['SEO', 'Education', 'Content Strategy'],
  },
  {
    id: 'payment-gateway-organic-growth',
    company: 'An overseas payment gateway company operating across Africa',
    industry: 'Fintech',
    category: 'strategy',
    metricValue: 'Significant',
    metricLabel: 'Organic Traffic Growth',
    context: 'An SEO content campaign for an overseas payment gateway company operating across Africa',
    challenge:
      'The company needed to build search visibility and authority content for a fintech audience across multiple African markets.',
    approach:
      'Built a data-driven content strategy shaped by Ahrefs keyword research and Hotjar behavior data, tailored to a fintech/payments audience.',
    result:
      'Organic traffic grew substantially. A full before/after breakdown is being documented and will be added here once verified.',
    technicalExecution: [
      'Ahrefs keyword research and content gap analysis',
      'Hotjar behavior data informing content structure',
      'On-page and technical SEO implementation',
    ],
    tags: ['SEO', 'Fintech', 'Content Strategy'],
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
  {
    id: 'fearless-food-battles',
    company: 'Fearless Food Battles (personal project, concept for Golden Fry / Bidco Africa)',
    industry: 'FMCG / Brand Activation',
    category: 'web',
    metricValue: '$0',
    metricLabel: 'Recurring Infra Cost',
    context:
      'A personal concept project, not a commissioned client engagement: a mobile-first brand-activation web app designed for Golden Fry, a Bidco Africa cooking oil brand. Live demo: 1d67ed89.fearless-food-battles.pages.dev',
    challenge:
      'Cooking oil is a low-interest category. The concept needed to make people care about the brand by tapping into something they already care about: the food they cook with it.',
    approach:
      'Designed a gamified "food tribes" battle concept: users pick a food tribe, submit a plate, get judged by four AI-voiced characters, and climb national and county leaderboards, with a receipt-scan power move tying play back to a real purchase.',
    result:
      'Shipped as a fully working, deployed MVP: end-to-end battle flow, four AI judges, synthesized rap verdicts generated in-browser, WhatsApp Status sharing, national and county leaderboards, crews with fair divisional leagues, and a dual light/dark design system passing WCAG AA on key pairings, built and hosted at zero recurring cost.',
    technicalExecution: [
      'Next.js 14 (App Router) + TypeScript + React 18',
      'Web Audio API for synthesized rap verdicts, no audio files or licensing',
      'Gemini vision scanner implemented and ready to activate behind a mock-first architecture',
      'Supabase schema ready for a real shared, live leaderboard',
      'Deployed on Cloudflare Pages via next-on-pages, with edge AI routes',
    ],
    images: [
      '/images/work/fearless-food-battles/fearless-battle-1.png',
      '/images/work/fearless-food-battles/fearless-battle-2.png',
      '/images/work/fearless-food-battles/fearless-battle-3.png',
      '/images/work/fearless-food-battles/fearless-battle-4.png',
      '/images/work/fearless-food-battles/fearless-battle-5.png',
      '/images/work/fearless-food-battles/fearless-battle-6.png',
      '/images/work/fearless-food-battles/fearless-battle-7.png',
    ],
    tags: ['Personal Project', 'Next.js', 'Brand Concept', 'Gamification'],
  },
  {
    id: 'kenafric',
    company: 'Kenafric',
    industry: 'Manufacturing / FMCG',
    category: 'web',
    metricValue: '4+',
    metricLabel: 'Product Categories Covered',
    context: 'Development and maintenance for Kenafric, a Kenyan manufacturing group producing books, sweets, biscuits, beverages, and other consumer goods.',
    challenge: 'Kenafric needed its corporate website kept current and functioning to represent a large multi-brand manufacturing group online.',
    approach: 'Ongoing development and maintenance of the Kenafric corporate website.',
    result: 'Site kept live and current for the group.',
    technicalExecution: ['Website development and maintenance for Kenafric'],
    images: [
      '/images/work/kenafric/kenafric-home.png',
      '/images/work/kenafric/kenafric-home-2.png',
      '/images/work/kenafric/kenafric-about.png',
      '/images/work/kenafric/kenafric-about-us.png',
      '/images/work/kenafric/kenafric-careers.png',
      '/images/work/kenafric/kenafric-news.png',
      '/images/work/kenafric/kenafric-contact.png',
    ],
    tags: ['Manufacturing', 'Maintenance'],
  },
  {
    id: 'window-plus',
    company: 'Window Plus',
    industry: 'Retail / Home Improvement',
    category: 'web',
    metricValue: '1',
    metricLabel: 'Site Maintained',
    context: 'As part of the Creative Edge / FCB Nairobi team: development and maintenance for Window Plus, a Kenyan retailer of blinds, window films, and motorised window solutions.',
    challenge: 'Window Plus needed its site kept current across a varied product catalogue (blinds, films, motorisation) with room for fresh inspiration content to drive showroom visits.',
    approach: 'Ongoing development and maintenance of the Window Plus website, covering its product, inspiration, and about pages.',
    result: 'Site kept live and current across all product lines.',
    technicalExecution: ['Website development and maintenance for Window Plus'],
    images: [
      '/images/work/window-plus/window-plus-home.png',
      '/images/work/window-plus/window-plus-product.png',
      '/images/work/window-plus/window-plus-blinds.png',
      '/images/work/window-plus/window-plus-films.png',
      '/images/work/window-plus/window-plus-motorisation.png',
      '/images/work/window-plus/window-plus-inspo.png',
      '/images/work/window-plus/window-plus-about.png',
    ],
    tags: ['Retail', 'Maintenance', 'Home Improvement'],
  },
  {
    id: 'urgent-action-fund-africa',
    company: 'Urgent Action Fund-Africa',
    industry: 'Nonprofit / Human Rights',
    category: 'web',
    metricValue: '54',
    metricLabel: 'African Countries Served',
    context: 'As part of the Creative Edge / FCB Nairobi team: development and maintenance for Urgent Action Fund-Africa, a pan-African rapid-response grant-making fund for women\'s rights advocates, established in 2001.',
    challenge: 'A pan-African grant-making fund needed a site that could carry its mandate, grant applications, and thought-leadership publications clearly to advocates across the continent.',
    approach: 'Development and ongoing maintenance of the Urgent Action Fund-Africa website, covering its mandate, grant application flow, and publications library.',
    result: 'Site kept live and current, supporting grant applications and publication downloads across the fund\'s pan-African footprint.',
    technicalExecution: ['Website development and maintenance for Urgent Action Fund-Africa'],
    images: [
      '/images/work/urgent-action-fund-africa/uaf-home.png',
      '/images/work/urgent-action-fund-africa/uaf-about.png',
      '/images/work/urgent-action-fund-africa/uaf-actions.png',
      '/images/work/urgent-action-fund-africa/uaf-founders.png',
      '/images/work/urgent-action-fund-africa/uaf-grant.png',
      '/images/work/urgent-action-fund-africa/uaf-publications.png',
      '/images/work/urgent-action-fund-africa/uaf-news.png',
    ],
    tags: ['Nonprofit', 'Maintenance', 'Human Rights'],
  },
  {
    id: 'tomoca-coffee',
    company: 'Tomoca Coffee',
    industry: 'F&B / Retail',
    category: 'web',
    metricValue: '1',
    metricLabel: 'First East African Location Outside Ethiopia',
    context: 'Development and maintenance for Tomoca Coffee Kenya, the first Tomoca (Ethiopian coffee heritage brand) location established outside Ethiopia, opened in Nairobi in 2020.',
    challenge: 'Tomoca Coffee needed an online presence and shop that matched its heritage brand positioning as it expanded into the Kenyan market.',
    approach: 'Development and ongoing maintenance of the Tomoca Coffee Kenya website, including its online shop.',
    result: 'Site live and maintained, supporting the brand\'s first East African location outside Ethiopia.',
    technicalExecution: ['Website development and maintenance', 'Online shop for coffee products'],
    images: [
      '/images/work/tomoca-coffee/tomoca-home.png',
      '/images/work/tomoca-coffee/tomoca-shop.png',
      '/images/work/tomoca-coffee/tomoca-rostery.png',
      '/images/work/tomoca-coffee/tomoca-about.png',
      '/images/work/tomoca-coffee/tomoca-location.png',
      '/images/work/tomoca-coffee/tomoca-news.png',
    ],
    tags: ['F&B', 'E-commerce', 'Maintenance'],
  },
  {
    id: 'kap',
    company: 'Kenya Association of Physicians (KAP)',
    industry: 'Healthcare / Nonprofit',
    category: 'web',
    metricValue: '29th',
    metricLabel: 'Annual Scientific Conference Supported',
    context: 'Maintenance of the Kenya Association of Physicians website, a WordPress site representing physicians dedicated to quality specialized healthcare across the region.',
    challenge: 'KAP needed its professional association website kept current, including conference and journal information.',
    approach: 'Ongoing WordPress maintenance for the KAP site.',
    result: 'Site kept live and current, including active promotion of its Annual Scientific Conference.',
    technicalExecution: ['WordPress maintenance'],
    images: [
      '/images/work/kap/kap-home.png',
      '/images/work/kap/kap-kenya-home.png',
      '/images/work/kap/kap-kenya-about.png',
      '/images/work/kap/kap-kenya-conferences.png',
      '/images/work/kap/kap-kenya-ecsacop.png',
      '/images/work/kap/kap-kenya-videos.png',
      '/images/work/kap/kap-kenya-contacts.png',
    ],
    tags: ['Healthcare', 'WordPress', 'Maintenance'],
  },
  {
    id: 'kianda-school',
    company: 'Kianda School',
    industry: 'Education',
    category: 'web',
    metricValue: '1',
    metricLabel: 'New School Website Shipped',
    context: 'Development of the new Kianda School website.',
    challenge: 'Kianda School needed a new website.',
    approach: 'Built the new Kianda School website.',
    result: 'New site shipped and live.',
    technicalExecution: ['Website development for Kianda School'],
    images: [
      '/images/work/kianda-school/kianda-home.png',
      '/images/work/kianda-school/kianda-home-2.png',
      '/images/work/kianda-school/kianda-about.png',
      '/images/work/kianda-school/kianda-admissions.png',
      '/images/work/kianda-school/kianda-formation.png',
      '/images/work/kianda-school/kianda-activities.png',
      '/images/work/kianda-school/kianda-scholarship.png',
      '/images/work/kianda-school/kianda-news.png',
    ],
    tags: ['Education', 'Development'],
  },
  {
    id: 'sentinel-ai',
    company: 'Sentinel-AI (personal project, solo product)',
    industry: 'AI Security',
    category: 'strategy',
    metricValue: '30',
    metricLabel: 'Prompt-Injection Attacks Built',
    context:
      'A solo-built AI red-teaming tool for testing LLM applications against prompt-injection vulnerabilities, positioned for SMBs and emerging markets underserved by enterprise pentesting tools',
    challenge:
      'Enterprise AI red-teaming tools cost thousands to tens of thousands per year and are built for US/EU markets. Nothing affordable or self-hostable existed for SMBs, consultants, or African startups shipping LLM apps without security testing.',
    approach:
      'Built a human-in-the-loop red-teaming architecture (an LLM as attacker and judge, a human as the final decision-maker) instead of a fully autonomous model, since autonomous pentesting benchmarks well below human-reviewed approaches. Designed a focused 30-attack suite across 6 categories, each mapped to the OWASP LLM Top 10, with a deterministic, explainable risk-scoring formula.',
    result:
      'Shipped as a working prototype in a 2-week build: a Python CLI, a Flask web UI, a standalone React demo, and a model-agnostic LLM client supporting Claude, GPT-4o, and Ollama.',
    technicalExecution: [
      'Python CLI engine + Flask web UI',
      'React demo, runs fully in-browser with simulated responses',
      '30 attacks across 6 categories, mapped to the OWASP LLM Top 10',
      'Model-agnostic LLM client (Claude, GPT-4o, Ollama, custom endpoints)',
    ],
    tags: ['Personal Project', 'AI Security', 'Python', 'Prototype'],
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
  { label: 'Enterprise & Bank Clients', value: 4, suffix: '' },
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
  { label: 'Work', href: '/work' },
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
