'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2, Users, Eye, Clock, ArrowUp } from 'lucide-react';

interface PageView {
  id: string;
  page_id: string;
  path: string;
  user_id?: string;
  referrer?: string;
  user_agent?: string;
  created_at: string;
}

interface PageAnalytics {
  path: string;
  views: number;
  uniqueVisitors: number;
  avgTimeOnPage: number;
  bounceRate: number;
}

interface DailyStats {
  date: string;
  views: number;
  uniqueVisitors: number;
}

export function PageAnalytics() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [analytics, setAnalytics] = useState<PageAnalytics[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);

  const supabase = createClient();

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
      const { data: views, error } = await supabase
        .from('page_views')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      setPageViews(views);

      // Process analytics by page
      const pageStats = processPageStats(views);
      setAnalytics(pageStats);

      // Process daily stats
      const dailyData = processDailyStats(views, startDate);
      setDailyStats(dailyData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const processPageStats = (views: PageView[]): PageAnalytics[] => {
    const stats = new Map<string, {
      views: number;
      uniqueVisitors: Set<string>;
      totalTimeOnPage: number;
      bounces: number;
    }>();

    views.forEach(view => {
      const current = stats.get(view.path) || {
        views: 0,
        uniqueVisitors: new Set<string>(),
        totalTimeOnPage: 0,
        bounces: 0
      };

      current.views++;
      if (view.user_id) {
        current.uniqueVisitors.add(view.user_id);
      }
      // Simplified time on page calculation
      current.totalTimeOnPage += 60; // Assume 60 seconds per view
      stats.set(view.path, current);
    });

    return Array.from(stats.entries()).map(([path, data]) => ({
      path,
      views: data.views,
      uniqueVisitors: data.uniqueVisitors.size,
      avgTimeOnPage: Math.round(data.totalTimeOnPage / data.views),
      bounceRate: Math.round((data.bounces / data.views) * 100)
    }));
  };

  const processDailyStats = (views: PageView[], startDate: Date): DailyStats[] => {
    const days = new Map<string, {
      views: number;
      uniqueVisitors: Set<string>;
    }>();

    // Initialize all days in the range
    const endDate = new Date();
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      days.set(dateStr, {
        views: 0,
        uniqueVisitors: new Set<string>()
      });
    }

    // Process views
    views.forEach(view => {
      const dateStr = new Date(view.created_at).toISOString().split('T')[0];
      const current = days.get(dateStr);
      if (current) {
        current.views++;
        if (view.user_id) {
          current.uniqueVisitors.add(view.user_id);
        }
      }
    });

    return Array.from(days.entries())
      .map(([date, data]) => ({
        date,
        views: data.views,
        uniqueVisitors: data.uniqueVisitors.size
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Page Analytics</h2>
        <Select
          value={timeRange}
          onValueChange={setTimeRange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <Eye className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                  <p className="text-2xl font-bold">
                    {pageViews.length.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Unique Visitors</p>
                  <p className="text-2xl font-bold">
                    {new Set(pageViews.map(v => v.user_id).filter(Boolean)).size.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <Clock className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Time on Page</p>
                  <p className="text-2xl font-bold">
                    {Math.round(analytics.reduce((acc, curr) => acc + curr.avgTimeOnPage, 0) / analytics.length)}s
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <ArrowUp className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Bounce Rate</p>
                  <p className="text-2xl font-bold">
                    {Math.round(analytics.reduce((acc, curr) => acc + curr.bounceRate, 0) / analytics.length)}%
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Traffic Overview</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="#2563eb"
                    name="Page Views"
                  />
                  <Line
                    type="monotone"
                    dataKey="uniqueVisitors"
                    stroke="#16a34a"
                    name="Unique Visitors"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Page Performance</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                  <TableHead className="text-right">Unique Visitors</TableHead>
                  <TableHead className="text-right">Avg. Time on Page</TableHead>
                  <TableHead className="text-right">Bounce Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.map(page => (
                  <TableRow key={page.path}>
                    <TableCell className="font-medium">{page.path}</TableCell>
                    <TableCell className="text-right">{page.views.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{page.uniqueVisitors.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{page.avgTimeOnPage}s</TableCell>
                    <TableCell className="text-right">{page.bounceRate}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </>
      )}
    </div>
  );
} 