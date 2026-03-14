'use client';

import { useEffect, useRef } from 'react';

// Performance monitoring hook
export function usePerformanceMonitoring() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Core Web Vitals monitoring
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('[Performance] LCP:', entry.startTime.toFixed(2) + 'ms');
        }
        if (entry.entryType === 'first-input') {
          console.log('[Performance] FID:', (entry as any).processingStart - entry.startTime + 'ms');
        }
        if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
          console.log('[Performance] CLS:', (entry as any).value);
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
    } catch (e) {
      // Browser doesn't support this observer
    }

    return () => observer.disconnect();
  }, []);
}

// Preconnect to external domains
export function usePreconnect() {
  useEffect(() => {
    // Preconnect to font domains
    const fonts = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ];

    fonts.forEach((url) => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = url;
      document.head.appendChild(link);
    });

    // DNS prefetch for analytics
    const analytics = ['https://www.google-analytics.com'];
    analytics.forEach((url) => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = url;
      document.head.appendChild(link);
    });
  }, []);
}

// Image optimization helper
export function optimizeImageUrl(url: string, width: number = 800): string {
  // If using a service like unsplash, add width parameter
  if (url.includes('unsplash.com')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}w=${width}&q=80&auto=format`;
  }
  return url;
}

// Reduce motion preference hook
export function useReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Lazy image component with Intersection Observer
interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
}

export function LazyImage({ src, alt, className, placeholder }: LazyImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    if ('loading' in HTMLImageElement.prototype) {
      img.loading = 'lazy';
      setIsLoaded(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            img.src = src;
            img.onload = () => setIsLoaded(true);
            observer.unobserve(img);
          }
        });
      },
      { rootMargin: '50px' }
    );

    observer.observe(img);

    return () => observer.disconnect();
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && placeholder && (
        <div
          className="absolute inset-0 bg-surface-dark animate-pulse"
          style={{ backgroundImage: `url(${placeholder})`, backgroundSize: 'cover' }}
        />
      )}
      <img
        ref={imgRef}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}

// Add missing import
import { useState } from 'react';

// Bundle size optimization - dynamic imports for heavy components
export function useDynamicImport<T>(
  importFn: () => Promise<{ default: T }>,
  condition: boolean = true
): T | null {
  const [component, setComponent] = useState<T | null>(null);

  useEffect(() => {
    if (condition) {
      importFn().then((mod) => setComponent(mod.default));
    }
  }, [importFn, condition]);

  return component;
}

// Script optimization - defer non-critical scripts
export function deferScript(src: string, id: string) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = src;
    script.id = id;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
    };
  }, [src, id]);
}
