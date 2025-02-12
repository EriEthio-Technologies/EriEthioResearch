'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import {
  Users,
  Eye,
  Clock,
  ArrowUp,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  Chrome,
  Firefox,
  Safari,
  Map,
  Activity,
  MousePointer,
  Search
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface AnalyticsData {
  overview: {
    totalViews: number;
    uniqueVisitors: number;
    avgTimeOnPage: number;
    bounceRate: number;
  };
  traffic: {
    date: string;
    views: number;
    visitors: number;
  }[];
  devices: {
    name: string;
    value: number;
  }[];
  browsers: {
    name: string;
    value: number;
  }[];
  locations: {
    country: string;
    visits: number;
  }[];
  pages: {
    path: string;
    views: number;
    avgTime: number;
  }[];
  events: {
    type: string;
    count: number;
  }[];
  referrers: {
    source: string;
    visits: number;
  }[];
  searchTerms: {
    term: string;
    count: number;
  }[];
}

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('7d');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Get the date range
      const now = new Date();
      const days = parseInt(timeRange);
      const startDate = new Date(now.setDate(now.getDate() - days));

      // Fetch page views
      const { data: pageViews } = await supabase
        .from('page_views')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      // Fetch page events
      const { data: pageEvents } = await supabase
        .from('page_events')
        .select('*')
        .gte('created_at', startDate.toISOString());

      if (!pageViews || !pageEvents) throw new Error('Failed to fetch data');

      // Process analytics data
      const analyticsData: AnalyticsData = {
        overview: {
          totalViews: pageViews.length,
          uniqueVisitors: new Set(pageViews.map(v => v.user_id || v.session_id)).size,
          avgTimeOnPage: calculateAverageTimeOnPage(pageViews),
          bounceRate: calculateBounceRate(pageViews)
        },
        traffic: processTrafficData(pageViews),
        devices: processDeviceData(pageViews),
        browsers: processBrowserData(pageViews),
        locations: processLocationData(pageViews),
        pages: processPageData(pageViews),
        events: processEventData(pageEvents),
        referrers: processReferrerData(pageViews),
        searchTerms: processSearchTerms(pageViews)
      };

      setData(analyticsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for data processing
  const calculateAverageTimeOnPage = (views: any[]) => {
    // Implementation
    return 0;
  };

  const calculateBounceRate = (views: any[]) => {
    // Implementation
    return 0;
  };

  const processTrafficData = (views: any[]) => {
    // Implementation
    return [];
  };

  const processDeviceData = (views: any[]) => {
    // Implementation
    return [];
  };

  const processBrowserData = (views: any[]) => {
    // Implementation
    return [];
  };

  const processLocationData = (views: any[]) => {
    // Implementation
    return [];
  };

  const processPageData = (views: any[]) => {
    // Implementation
    return [];
  };

  const processEventData = (events: any[]) => {
    // Implementation
    return [];
  };

  const processReferrerData = (views: any[]) => {
    // Implementation
    return [];
  };

  const processSearchTerms = (views: any[]) => {
    // Implementation
    return [];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-neon-cyan text-xl">Loading analytics...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-red-500">Failed to load analytics data</div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-neon-cyan">Analytics Dashboard</h2>
        <Select
          value={timeRange}
          onValueChange={setTimeRange}
          options={[
            { value: '7d', label: 'Last 7 days' },
            { value: '30d', label: 'Last 30 days' },
            { value: '90d', label: 'Last 90 days' }
          ]}
        />
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Eye className="w-8 h-8 text-neon-cyan" />
            <div>
              <p className="text-sm text-gray-400">Total Views</p>
              <p className="text-2xl font-bold text-neon-cyan">
                {data.overview.totalViews.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Users className="w-8 h-8 text-neon-cyan" />
            <div>
              <p className="text-sm text-gray-400">Unique Visitors</p>
              <p className="text-2xl font-bold text-neon-cyan">
                {data.overview.uniqueVisitors.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Clock className="w-8 h-8 text-neon-cyan" />
            <div>
              <p className="text-sm text-gray-400">Avg. Time on Page</p>
              <p className="text-2xl font-bold text-neon-cyan">
                {data.overview.avgTimeOnPage}s
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <ArrowUp className="w-8 h-8 text-neon-cyan" />
            <div>
              <p className="text-sm text-gray-400">Bounce Rate</p>
              <p className="text-2xl font-bold text-neon-cyan">
                {data.overview.bounceRate}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Traffic Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-neon-cyan mb-4">Traffic Overview</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.traffic}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#2563eb"
                name="Page Views"
              />
              <Line
                type="monotone"
                dataKey="visitors"
                stroke="#16a34a"
                name="Unique Visitors"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Device & Browser Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-neon-cyan mb-4">Device Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.devices}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {data.devices.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random()*16777215).toString(16)}`} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-neon-cyan mb-4">Browser Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.browsers}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {data.browsers.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random()*16777215).toString(16)}`} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Geographic Distribution */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-neon-cyan mb-4">Geographic Distribution</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.locations}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="country" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="visits" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Page Performance */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-neon-cyan mb-4">Page Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2">Page</th>
                <th className="text-right py-2">Views</th>
                <th className="text-right py-2">Avg. Time</th>
              </tr>
            </thead>
            <tbody>
              {data.pages.map((page, index) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="py-2">{page.path}</td>
                  <td className="text-right">{page.views.toLocaleString()}</td>
                  <td className="text-right">{page.avgTime}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Event Tracking */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-neon-cyan mb-4">Event Tracking</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.events}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Referrers & Search Terms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-neon-cyan mb-4">Top Referrers</h3>
          <div className="space-y-4">
            {data.referrers.map((referrer, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-300">{referrer.source}</span>
                <span className="text-neon-cyan">{referrer.visits}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-neon-cyan mb-4">Top Search Terms</h3>
          <div className="space-y-4">
            {data.searchTerms.map((term, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-300">{term.term}</span>
                <span className="text-neon-cyan">{term.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
} 