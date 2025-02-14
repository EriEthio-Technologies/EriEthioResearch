import * as Sentry from '@sentry/nextjs';

export function initMonitoring() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay(),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

export function logSecurityEvent(event: string, context: object) {
  Sentry.captureEvent({
    message: `Security Event: ${event}`,
    level: 'warning',
    contexts: { security: context }
  });
}

// Add to _app.tsx
initMonitoring(); 