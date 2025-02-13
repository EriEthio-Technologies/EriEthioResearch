'use client';

import { useEffect, useState } from 'react';
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
    async function fetchStats() {
      try {
        // Fetch users count
        const { count: usersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact' });

        // Fetch research count
        const { count: researchCount } = await supabase
          .from('research_projects')
          .select('*', { count: 'exact' });

        // Fetch products count
        const { count: productsCount } = await supabase
          .from('products')
          .select('*', { count: 'exact' });

        // Fetch page views count
        const { count: viewsCount } = await supabase
          .from('page_views')
          .select('*', { count: 'exact' });

        setStats({
          totalUsers: usersCount || 0,
          totalResearch: researchCount || 0,
          totalProducts: productsCount || 0,
          totalViews: viewsCount || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-neon-cyan',
      borderColor: 'border-neon-cyan',
    },
    {
      title: 'Research Projects',
      value: stats.totalResearch,
      icon: BookOpen,
      color: 'text-neon-magenta',
      borderColor: 'border-neon-magenta',
    },
    {
      title: 'Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'text-neon-cyan',
      borderColor: 'border-neon-cyan',
    },
    {
      title: 'Page Views',
      value: stats.totalViews,
      icon: BarChart,
      color: 'text-neon-magenta',
      borderColor: 'border-neon-magenta',
    },
  ];

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
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`bg-black/30 backdrop-blur-sm border ${stat.borderColor} rounded-lg p-6`}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-semibold ${stat.color}`}>{stat.title}</h2>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="text-3xl font-bold text-gray-100">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-black/30 backdrop-blur-sm border border-neon-cyan rounded-lg p-6">
        <h2 className="text-xl font-semibold text-neon-cyan mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {/* Add recent activity items here */}
          <p className="text-gray-300">No recent activity to display.</p>
        </div>
      </div>
    </div>
  );
} 