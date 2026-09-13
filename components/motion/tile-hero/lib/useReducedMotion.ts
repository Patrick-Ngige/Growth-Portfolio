"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;

/** The server cannot know the preference. Assuming "no" matches the default
 *  render; useSyncExternalStore corrects it immediately after hydration. */
const getServerSnapshot = () => false;

/**
 * Reduced-motion preference as reactive state — for the cases where the
 * preference changes what is *rendered*, not just what is animated (a 650vh
 * scroll track is markup, not motion, and cannot be branched from inside an
 * effect).
 */
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
