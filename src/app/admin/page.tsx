'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { BarChart, Users, BookOpen, Package } from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalResearch: number;
  totalProducts: number;
  totalViews: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalResearch: 0,
    totalProducts: 0,
    totalViews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const tables = ['profiles', 'research_projects', 'products', 'page_views'];

        const counts = await Promise.all(
          tables.map(async (table) => {
            const { count } = await supabase.from(table).select('*', { count: 'exact' });
            return count || 0;
          })
        );

        setStats({
          totalUsers: counts[0],
          totalResearch: counts[1],
          totalProducts: counts[2],
          totalViews: counts[3],
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = useMemo(
    () => [
      { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-neon-cyan', borderColor: 'border-neon-cyan' },
      { title: 'Research Projects', value: stats.totalResearch, icon: BookOpen, color: 'text-neon-magenta', borderColor: 'border-neon-magenta' },
      { title: 'Products', value: stats.totalProducts, icon: Package, color: 'text-neon-cyan', borderColor: 'border-neon-cyan' },
      { title: 'Page Views', value: stats.totalViews, icon: BarChart, color: 'text-neon-magenta', borderColor: 'border-neon-magenta' },
    ],
    [stats]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-neon-cyan text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-neon-cyan mb-8">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map(({ title, value, icon: Icon, color, borderColor }, index) => (
          <div key={index} className={`bg-black/30 backdrop-blur-sm border ${borderColor} rounded-lg p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold ${color}`}>{title}</h2>
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <p className="text-3xl font-bold text-gray-100">{value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-black/30 backdrop-blur-sm border border-neon-cyan rounded-lg p-6">
        <h2 className="text-xl font-semibold text-neon-cyan mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <p className="text-gray-300">No recent activity to display.</p>
        </div>
      </div>
    </div>
  );
}

;