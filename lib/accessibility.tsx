'use client';

import React from 'react';

// Accessibility utilities

// Focus trap for modals
export function trapFocus(element: HTMLElement) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0] as HTMLElement;
  const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
    if (e.key === 'Escape') {
      // Emit escape event for modal to handle
      element.dispatchEvent(new CustomEvent('modal:close'));
    }
  };

  element.addEventListener('keydown', handleKeyDown);
  firstFocusable?.focus();

  return () => element.removeEventListener('keydown', handleKeyDown);
}

// Announce to screen readers
export function announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);

  setTimeout(() => {
    announcement.remove();
  }, 1000);
}

// Skip to main content link
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent-growth-dark focus:text-background-primary focus:font-medium focus:rounded-lg"
    >
      Skip to main content
    </a>
  );
}

// Reduced motion styles
export const reducedMotionStyles = {
  transition: 'none',
  animation: 'none',
  transform: 'none',
} as const;

// Generate unique IDs for accessibility
let idCounter = 0;
export function generateId(prefix: string = 'a11y'): string {
  return `${prefix}-${++idCounter}`;
}

// Check color contrast ratio
export function getContrastRatio(foreground: string, background: string): number {
  const getLuminance = (hex: string): number => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = ((rgb >> 16) & 0xff) / 255;
    const g = ((rgb >> 8) & 0xff) / 255;
    const b = ((rgb >> 0) & 0xff) / 255;

    const [rLinear, gLinear, bLinear] = [r, g, b].map((c) =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );

    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

// WCAG AA compliance check
export function meetsWCAGAA(foreground: string, background: string, isLargeText: boolean = false): boolean {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

// Accessible form validation
export interface FormError {
  field: string;
  message: string;
}

export function validateForm(
  values: Record<string, string>,
  rules: Record<string, (value: string) => string | null>
): FormError[] {
  const errors: FormError[] = [];

  Object.entries(rules).forEach(([field, rule]) => {
    const value = values[field] || '';
    const error = rule(value);
    if (error) {
      errors.push({ field, message: error });
    }
  });

  return errors;
}

// Common validation rules
export const formRules = {
  required: (message: string) => (value: string) =>
    value.trim() ? null : message,

  email: () => (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : 'Please enter a valid email address',

  minLength: (min: number) => (value: string) =>
    value.length >= min ? null : `Please enter at least ${min} characters`,
};

// Focus management for page transitions
export function restoreFocus() {
  const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const previouslyFocused = document.activeElement as HTMLElement;

  // Store the element that had focus
  if (previouslyFocused && previouslyFocused.tagName !== 'BODY') {
    sessionStorage.setItem('lastFocusedElement', previouslyFocused.tagName);
  }

  // Restore focus on next page
  const lastFocused = sessionStorage.getItem('lastFocusedElement');
  if (lastFocused) {
    const element = document.querySelector(focusableSelector) as HTMLElement;
    element?.focus();
    sessionStorage.removeItem('lastFocusedElement');
  }
}
