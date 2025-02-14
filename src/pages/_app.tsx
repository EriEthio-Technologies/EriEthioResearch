import { initMonitoring } from '@/lib/monitoring';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

// Initialize Sentry monitoring
initMonitoring();

export default MyApp;

export function reportWebVitals(metric) {
  if (process.env.NODE_ENV === 'production') {
    const body = JSON.stringify(metric);
    const url = '/api/web-vitals';

    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, body);
    } else {
      fetch(url, { body, method: 'POST', keepalive: true });
    }
  }
} 