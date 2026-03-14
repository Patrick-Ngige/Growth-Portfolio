'use client';

import { useEffect, useCallback } from 'react';

// Analytics tracking configuration
const ANALYTICS_CONFIG = {
  gtmId: process.env.NEXT_PUBLIC_GTM_ID || '',
  gaId: process.env.NEXT_PUBLIC_GA_ID || '',
};

// Event types for tracking
interface TrackEventProps {
  event: string;
  category?: string;
  action?: string;
  label?: string;
  value?: number;
  [key: string]: unknown;
}

// Main analytics hook
export function useAnalytics() {
  const trackEvent = useCallback((eventName: string, properties?: Record<string, unknown>) => {
    // Google Tag Manager
    if (typeof window !== 'undefined' && ANALYTICS_CONFIG.gtmId) {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: eventName,
        ...properties,
      });
    }

    // Google Analytics
    if (typeof window !== 'undefined' && ANALYTICS_CONFIG.gaId && (window as any).gtag) {
      (window as any).gtag('event', eventName, properties);
    }

    // Development logging
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', eventName, properties);
    }
  }, []);

  const trackPageView = useCallback((url: string, title: string) => {
    trackEvent('page_view', {
      page_location: url,
      page_title: title,
    });
  }, [trackEvent]);

  return { trackEvent, trackPageView };
}

// Scroll depth tracking
export function useScrollDepth(thresholds: number[] = [25, 50, 75, 100]) {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const depths = new Set<number>();

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      thresholds.forEach((threshold) => {
        if (scrollPercent >= threshold && !depths.has(threshold)) {
          depths.add(threshold);
          trackEvent('scroll_depth', {
            depth_percent: threshold,
            depth_category: `${threshold}%`,
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [thresholds, trackEvent]);
}

// Time on page tracking
export function useTimeOnPage() {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const startTime = Date.now();

    const handleBeforeUnload = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      trackEvent('page_time', {
        time_seconds: timeSpent,
        time_category: timeSpent < 30 ? 'less_30s' : timeSpent < 60 ? '30s_1m' : 'over_1m',
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [trackEvent]);
}

// Video/Audio engagement tracking
export function useMediaEngagement(mediaId: string, mediaType: 'video' | 'audio') {
  const { trackEvent } = useAnalytics();

  return {
    onPlay: () => {
      trackEvent('media_play', { media_id: mediaId, media_type: mediaType });
    },
    onPause: () => {
      trackEvent('media_pause', { media_id: mediaId, media_type: mediaType });
    },
    onComplete: () => {
      trackEvent('media_complete', { media_id: mediaId, media_type: mediaType });
    },
    onProgress: (percent: number) => {
      trackEvent('media_progress', { media_id: mediaId, media_type: mediaType, percent });
    },
  };
}

// Form interaction tracking
export function useFormTracking(formId: string) {
  const { trackEvent } = useAnalytics();

  return {
    onFieldFocus: (fieldName: string) => {
      trackEvent('form_focus', { form_id: formId, field_name: fieldName });
    },
    onFieldChange: (fieldName: string) => {
      trackEvent('form_change', { form_id: formId, field_name: fieldName });
    },
    onSubmit: () => {
      trackEvent('form_submit', { form_id: formId });
    },
    onSuccess: () => {
      trackEvent('form_success', { form_id: formId });
    },
    onError: (error: string) => {
      trackEvent('form_error', { form_id: formId, error_message: error });
    },
  };
}

// Outbound link tracking
export function useOutboundTracking() {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      const link = target.closest('a');

      if (link) {
        const href = link.getAttribute('href');
        const isExternal =
          href?.startsWith('http://') ||
          href?.startsWith('https://') ||
          href?.startsWith('mailto:') ||
          href?.startsWith('tel:');

        if (isExternal && href) {
          const url = new URL(href, window.location.origin);
          const isSameDomain = url.hostname === window.location.hostname;

          if (!isSameDomain) {
            trackEvent('outbound_click', {
              url: href,
              domain: url.hostname,
              link_text: link.textContent?.trim() || 'unknown',
              link_location: getElementLocation(link),
            });
          }
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [trackEvent]);
}

// Helper to get element location in page
function getElementLocation(element: Element): string {
  const section = element.closest('section, header, footer, nav');
  if (section?.id) {
    return section.id;
  }
  return 'unknown';
}

// Download tracking
export function useDownloadTracking() {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (link) {
        const href = link.getAttribute('href');
        const isDownload = link.hasAttribute('download');

        if (isDownload && href) {
          const extension = href.split('.').pop()?.toLowerCase() || 'unknown';
          trackEvent('file_download', {
            file_url: href,
            file_extension: extension,
            file_name: link.download || href.split('/').pop() || 'unknown',
          });
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [trackEvent]);
}

// Error tracking
export function useErrorTracking() {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleError = (event: ErrorEvent) => {
      trackEvent('javascript_error', {
        error_message: event.message,
        error_filename: event.filename,
        error_lineno: event.lineno,
        error_colno: event.colno,
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackEvent('unhandled_promise_rejection', {
        reason: event.reason?.toString() || 'Unknown',
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [trackEvent]);
}

// E-commerce tracking (for when products are added)
export function useEcommerceTracking() {
  const { trackEvent } = useAnalytics();

  return {
    viewItem: (item: { id: string; name: string; price: number }) => {
      trackEvent('view_item', {
        item_id: item.id,
        item_name: item.name,
        value: item.price,
        currency: 'USD',
      });
    },
    addToCart: (item: { id: string; name: string; price: number; quantity: number }) => {
      trackEvent('add_to_cart', {
        item_id: item.id,
        item_name: item.name,
        value: item.price * item.quantity,
        currency: 'USD',
        quantity: item.quantity,
      });
    },
    beginCheckout: (items: Array<{ id: string; price: number }>) => {
      trackEvent('begin_checkout', {
        value: items.reduce((sum, item) => sum + item.price, 0),
        currency: 'USD',
        item_count: items.length,
      });
    },
    purchase: (transactionId: string, items: Array<{ id: string; price: number }>) => {
      trackEvent('purchase', {
        transaction_id: transactionId,
        value: items.reduce((sum, item) => sum + item.price, 0),
        currency: 'USD',
        item_count: items.length,
      });
    },
  };
}
