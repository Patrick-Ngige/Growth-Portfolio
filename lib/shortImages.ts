// Fixed 1440x900-viewport captures (not full-page screenshots) plus a few
// genuinely landscape dashboard/app shots (PulseKE, Fearless Food Battles) -
// measured directly off the files in public/images/work, not guessed.
// These read as short, squat rectangles next to a full-page portrait
// screenshot's natural aspect ratio, which breaks the two-up vertical
// stack's rhythm (see WorkGallery.tsx's VerticalStack). Hero and Coverflow
// both crop via object-cover, so aspect ratio doesn't matter there - and
// WorkIndexView's single-image preview prefers these too, since a full-page
// portrait screenshot cropped into that box loses far more than a shorter
// one does.
//
// Lives in its own file (not exported from WorkGallery.tsx) so pages that
// only need the classification - like the /work index - don't pull in that
// component's framer-motion-heavy gallery tiers just for one constant.
export const SHORT_IMAGES = new Set<string>([
  '/images/work/ngige-growth-audit/audit-tool.jpg',
  '/images/work/fearless-food-battles/fearless-battle-6.png',
  '/images/work/fearless-food-battles/fearless-battle-5.png',
  '/images/work/pulseke/contracts-agreements.jpg',
  '/images/work/fearless-food-battles/fearless-battle-1.png',
  '/images/work/fearless-food-battles/fearless-battle-3.png',
  '/images/work/pulseke/payments-compliance.jpg',
  '/images/work/fearless-food-battles/fearless-battle-2.png',
  '/images/work/kcb-bank/kcb-ke.png',
  '/images/work/kcb-bank/kcb-group.png',
  '/images/work/kcb-bank/kcb-insurance.png',
  '/images/work/kcb-bank/kcb-bi.png',
  '/images/work/kcb-bank/kcb-ss.png',
  '/images/work/kcb-bank/kcb-bpr-rwanda.png',
  '/images/work/kcb-bank/kcb-tanzania.png',
  '/images/work/kcb-bank/kcb-uganda.png',
  '/images/work/im-bank/im-group.png',
  '/images/work/im-bank/im-kenya.png',
  '/images/work/im-bank/im-tanzania.png',
  '/images/work/im-bank/im-uganda.png',
  '/images/work/im-bank/im-rwanda.png',
  '/images/work/totalenergies-kenya/totalenergies-home.png',
  '/images/work/prime-bank/prime-bank.png',
  '/images/work/strathmore-foundation/alumni-strathmore.png',
  '/images/work/kenafric/kenafric-home.png',
  '/images/work/tomoca-coffee/tomoca-home.png',
  '/images/work/kap/kap-home.png',
  '/images/work/kianda-school/kianda-home.png',
  '/images/work/fearless-food-battles/fearless-battle-4.png',
  '/images/work/fearless-food-battles/fearless-battle-7.png',
  '/images/work/pulseke/talent-discovery.jpg',
  '/images/work/pulseke/ai-insights.jpg',
  '/images/work/pulseke/campaign-dashboard.jpg',
  '/images/work/pulseke/advanced-analytics.jpg',
]);
