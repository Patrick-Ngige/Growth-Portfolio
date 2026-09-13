import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";

let registered = false;

/**
 * Named-ease vocabulary, keyed by intent rather than by section.
 *
 * Extend the set only when a genuinely new intent appears, and name by
 * intent, never by the component that first needed it — that is what keeps
 * separately-built pieces feeling like one system.
 */
export const EASE = {
  scrub: "th-ease-scrub",
  glide: "th-ease-glide",
  portal: "th-ease-portal",
  sway: "th-ease-sway",
} as const;

export function registerEases() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(CustomEase);

  CustomEase.create(EASE.scrub, "M0,0 C0.22,0.04 0.36,1 1,1");
  CustomEase.create(EASE.glide, "M0,0 C0.16,0.5 0.3,1 1,1");
  CustomEase.create(EASE.portal, "M0,0 C0.12,0.7 0.32,1 1,1");
  CustomEase.create(EASE.sway, "M0,0 C0.3,0.15 0.25,1 1,1");

  registered = true;
}
