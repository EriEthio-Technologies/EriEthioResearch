import { type NextWebVitalsMetric } from 'next/app';
import { Sentry } from './sentry';

export function reportWebVitals(metric: NextWebVitalsMetric) {
  // Log to Sentry
  Sentry.captureMessage('Web Vitals', {
    level: 'info',
    extra: {
      metric,
    },
  });

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vitals:', metric);
  }

  // Send to custom analytics
  const body = JSON.stringify(metric);
  const url = '/api/analytics/vitals';

  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body);
  } else {
    fetch(url, {
      body,
      method: 'POST',
      keepalive: true,
    });
  }
}

export async function trackPageView(url: string) {
  try {
    await fetch('/api/analytics/pageview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
}

export async function trackEvent(name: string, properties?: Record<string, any>) {
  try {
    await fetch('/api/analytics/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, properties }),
    });
  } catch (error) {
    console.error('Error tracking event:', error);
  }
} 