# Analytics & Monitoring Guide

## Overview

This guide covers the analytics and monitoring infrastructure for the EriEthio Research Platform, including real-time tracking, data collection, visualization, and alerting.

## Table of Contents

1. [Analytics Setup](#analytics-setup)
2. [Data Collection](#data-collection)
3. [Metrics & KPIs](#metrics--kpis)
4. [Visualization](#visualization)
5. [Alerting](#alerting)
6. [Performance Monitoring](#performance-monitoring)
7. [Security Monitoring](#security-monitoring)
8. [Troubleshooting](#troubleshooting)

## Analytics Setup

### 1. Page View Tracking

```typescript
// src/middleware.ts
import { createMiddleware } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const middleware = async (req: NextRequest) => {
  try {
    if (req.method !== 'GET') return NextResponse.next();
    
    // Skip tracking for static files
    if (
      req.nextUrl.pathname.startsWith('/_next') ||
      req.nextUrl.pathname.startsWith('/static') ||
      req.nextUrl.pathname.endsWith('.ico')
    ) {
      return NextResponse.next();
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    await supabase.rpc('track_page_view', {
      _path: req.nextUrl.pathname,
      _referrer: req.headers.get('referer'),
      _user_agent: req.headers.get('user-agent'),
      _session_id: req.cookies.get('session_id')?.value
    });

    return NextResponse.next();
  } catch (error) {
    console.error('Error tracking page view:', error);
    return NextResponse.next();
  }
};
```

### 2. Event Tracking

```typescript
// src/hooks/useAnalytics.ts
import { useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

export function useAnalytics() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const trackEvent = useCallback(async (
    eventType: string,
    properties: Record<string, any> = {}
  ) => {
    try {
      await supabase.from('analytics_events').insert({
        event_type: eventType,
        properties,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }, []);

  return { trackEvent };
}
```

## Data Collection

### 1. User Behavior

```typescript
// src/components/analytics/UserBehaviorTracker.tsx
import { useEffect } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';

export function UserBehaviorTracker() {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    let scrollDepth = 0;
    let timeOnPage = 0;
    const startTime = Date.now();

    const handleScroll = () => {
      const newDepth = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      if (newDepth > scrollDepth) {
        scrollDepth = newDepth;
        trackEvent('scroll_depth_reached', { depth: scrollDepth });
      }
    };

    const trackTimeOnPage = () => {
      timeOnPage = Math.round((Date.now() - startTime) / 1000);
      trackEvent('time_on_page', { seconds: timeOnPage });
    };

    window.addEventListener('scroll', handleScroll);
    const interval = setInterval(trackTimeOnPage, 30000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
      trackTimeOnPage();
    };
  }, []);

  return null;
}
```

### 2. Performance Metrics

```typescript
// src/utils/performance.ts
export function trackPerformanceMetrics() {
  if (typeof window === 'undefined') return;

  const { performance } = window;

  try {
    const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paintTiming = performance.getEntriesByType('paint');

    const metrics = {
      // Page load timing
      pageLoad: navigationTiming.loadEventEnd - navigationTiming.startTime,
      domInteractive: navigationTiming.domInteractive - navigationTiming.startTime,
      firstContentfulPaint: paintTiming.find(
        entry => entry.name === 'first-contentful-paint'
      )?.startTime,

      // Network timing
      dns: navigationTiming.domainLookupEnd - navigationTiming.domainLookupStart,
      tcp: navigationTiming.connectEnd - navigationTiming.connectStart,
      ttfb: navigationTiming.responseStart - navigationTiming.requestStart,

      // Resource timing
      resources: performance.getEntriesByType('resource').map(entry => ({
        name: entry.name,
        duration: entry.duration,
        size: entry.transferSize,
        type: entry.initiatorType
      }))
    };

    return metrics;
  } catch (error) {
    console.error('Error collecting performance metrics:', error);
    return null;
  }
}
```

## Metrics & KPIs

### 1. User Engagement

```sql
-- Active users
WITH daily_users AS (
  SELECT
    DATE_TRUNC('day', created_at) as date,
    COUNT(DISTINCT user_id) as users
  FROM page_views
  WHERE created_at >= NOW() - INTERVAL '30 days'
  GROUP BY 1
)
SELECT
  date,
  users as daily_active_users,
  AVG(users) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as rolling_7day_avg
FROM daily_users
ORDER BY date DESC;

-- Session duration
SELECT
  user_id,
  session_id,
  MAX(created_at) - MIN(created_at) as session_duration,
  COUNT(*) as page_views
FROM page_views
GROUP BY user_id, session_id
HAVING COUNT(*) > 1;

-- Content engagement
SELECT
  pages.title,
  COUNT(DISTINCT page_views.user_id) as unique_viewers,
  AVG(EXTRACT(EPOCH FROM (
    LEAD(created_at) OVER (PARTITION BY page_views.user_id ORDER BY created_at) - created_at
  ))) as avg_time_on_page
FROM page_views
JOIN pages ON pages.id = page_views.page_id
GROUP BY pages.id, pages.title
ORDER BY unique_viewers DESC;
```

### 2. Performance KPIs

```sql
-- Page load times
SELECT
  path,
  COUNT(*) as views,
  AVG(performance->>'pageLoad')::numeric as avg_page_load,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY (performance->>'pageLoad')::numeric) as p95_page_load
FROM page_views
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY path
HAVING COUNT(*) > 100
ORDER BY avg_page_load DESC;

-- Error rates
SELECT
  DATE_TRUNC('hour', created_at) as hour,
  COUNT(*) FILTER (WHERE status_code >= 500) as server_errors,
  COUNT(*) FILTER (WHERE status_code >= 400 AND status_code < 500) as client_errors,
  COUNT(*) as total_requests,
  ROUND(COUNT(*) FILTER (WHERE status_code >= 400)::numeric / COUNT(*)::numeric * 100, 2) as error_rate
FROM request_logs
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY hour
ORDER BY hour DESC;
```

## Visualization

### 1. Real-time Dashboard

```typescript
// src/components/analytics/RealTimeDashboard.tsx
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  LineChart,
  BarChart,
  PieChart
} from '@/components/charts';

export function RealTimeDashboard() {
  const [data, setData] = useState<any>(null);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchData = async () => {
      const [
        activeUsers,
        pageViews,
        errorRates
      ] = await Promise.all([
        fetchActiveUsers(),
        fetchPageViews(),
        fetchErrorRates()
      ]);

      setData({
        activeUsers,
        pageViews,
        errorRates
      });
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);

    return () => clearInterval(interval);
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <LineChart
          data={data.activeUsers}
          title="Active Users"
          xAxis="time"
          yAxis="count"
        />
      </div>
      <div>
        <BarChart
          data={data.pageViews}
          title="Top Pages"
          xAxis="path"
          yAxis="views"
        />
      </div>
      <div>
        <PieChart
          data={data.errorRates}
          title="Error Distribution"
        />
      </div>
    </div>
  );
}
```

### 2. Historical Reports

```typescript
// src/utils/reports.ts
export async function generateReport(
  reportType: string,
  startDate: Date,
  endDate: Date
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  switch (reportType) {
    case 'user_engagement': {
      const { data, error } = await supabase
        .rpc('generate_engagement_report', {
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString()
        });

      if (error) throw error;
      return data;
    }

    case 'content_performance': {
      const { data, error } = await supabase
        .rpc('generate_content_report', {
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString()
        });

      if (error) throw error;
      return data;
    }

    // Add more report types...
  }
}
```

## Alerting

### 1. Alert Configuration

```typescript
// src/config/alerts.ts
export const alertConfig = {
  errorRate: {
    threshold: 5, // Percentage
    interval: '5m',
    channels: ['slack', 'email']
  },
  responseTime: {
    threshold: 1000, // milliseconds
    interval: '1m',
    channels: ['slack']
  },
  diskUsage: {
    threshold: 85, // Percentage
    interval: '1h',
    channels: ['email']
  }
};

// src/utils/alerts.ts
export async function checkAlerts() {
  const metrics = await collectMetrics();

  for (const [name, config] of Object.entries(alertConfig)) {
    const value = metrics[name];
    if (value > config.threshold) {
      await sendAlert({
        name,
        value,
        threshold: config.threshold,
        channels: config.channels
      });
    }
  }
}
```

### 2. Alert Channels

```typescript
// src/utils/notifications.ts
export async function sendAlert({
  name,
  value,
  threshold,
  channels
}: AlertConfig) {
  const message = `
    Alert: ${name}
    Current Value: ${value}
    Threshold: ${threshold}
    Time: ${new Date().toISOString()}
  `;

  for (const channel of channels) {
    switch (channel) {
      case 'slack':
        await sendSlackMessage(message);
        break;
      case 'email':
        await sendEmail(message);
        break;
      // Add more channels...
    }
  }
}
```

## Performance Monitoring

### 1. Resource Usage

```typescript
// src/utils/monitoring.ts
export async function monitorResources() {
  const metrics = {
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    uptime: process.uptime()
  };

  await supabase.from('system_metrics').insert({
    timestamp: new Date().toISOString(),
    metrics
  });
}

// Set up monitoring interval
setInterval(monitorResources, 60000);
```

### 2. API Performance

```typescript
// src/middleware/performance.ts
export async function performanceMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextFunction
) {
  const start = process.hrtime();

  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1000000;

    supabase.from('api_metrics').insert({
      path: req.url,
      method: req.method,
      status_code: res.statusCode,
      duration_ms: duration,
      timestamp: new Date().toISOString()
    });
  });

  await next();
}
```

## Security Monitoring

### 1. Authentication Events

```typescript
// src/utils/auth-monitoring.ts
export async function trackAuthEvent(
  eventType: string,
  userId: string,
  metadata: Record<string, any> = {}
) {
  await supabase.from('auth_events').insert({
    event_type: eventType,
    user_id: userId,
    metadata,
    ip_address: metadata.ip_address,
    user_agent: metadata.user_agent,
    timestamp: new Date().toISOString()
  });
}

// Usage in auth callbacks
export const authCallbacks = {
  async signIn({ user, account, profile, credentials }) {
    await trackAuthEvent('sign_in', user.id, {
      provider: account.provider,
      ip_address: req.socket.remoteAddress,
      user_agent: req.headers['user-agent']
    });
  },
  // Add more callbacks...
};
```

### 2. Security Events

```typescript
// src/utils/security-monitoring.ts
export async function trackSecurityEvent(
  eventType: string,
  severity: 'low' | 'medium' | 'high' | 'critical',
  details: Record<string, any>
) {
  await supabase.from('security_events').insert({
    event_type: eventType,
    severity,
    details,
    timestamp: new Date().toISOString()
  });

  if (severity === 'high' || severity === 'critical') {
    await sendAlert({
      name: 'security_event',
      value: eventType,
      severity,
      channels: ['slack', 'email']
    });
  }
}
```

## Troubleshooting

### 1. Common Issues

```typescript
// src/utils/diagnostics.ts
export async function runDiagnostics() {
  const results = {
    database: await checkDatabaseConnection(),
    redis: await checkRedisConnection(),
    api: await checkApiEndpoints(),
    storage: await checkStorageAccess()
  };

  return results;
}

export async function checkDatabaseConnection() {
  try {
    const start = Date.now();
    await supabase.from('health_check').select('*').limit(1);
    return {
      status: 'healthy',
      latency: Date.now() - start
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message
    };
  }
}
```

### 2. Debug Logging

```typescript
// src/utils/logger.ts
export const logger = {
  info: (message: string, metadata: Record<string, any> = {}) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...metadata
    }));
  },
  error: (message: string, error: Error, metadata: Record<string, any> = {}) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      timestamp: new Date().toISOString(),
      ...metadata
    }));
  }
};
``` 