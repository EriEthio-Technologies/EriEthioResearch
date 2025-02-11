'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { Package, Users, BookOpen, Activity } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  totalResearchProjects: number;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    created_at: string;
  }>;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalUsers: 0,
    totalResearchProjects: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [
          { count: productsCount },
          { count: usersCount },
          { count: projectsCount },
          { data: activities }
        ] = await Promise.all([
          supabase.from('products').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('research_projects').select('*', { count: 'exact', head: true }),
          supabase.from('admin_activity').select('*').order('created_at', { ascending: false }).limit(5)
        ]);

        setStats({
          totalProducts: productsCount || 0,
          totalUsers: usersCount || 0,
          totalResearchProjects: projectsCount || 0,
          recentActivity: activities || [],
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-neon-cyan text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.h1 
        className="text-4xl font-bold text-neon-cyan"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Admin Dashboard
      </motion.h1>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <motion.div
          variants={item}
          className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-neon-cyan/20"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-neon-magenta">Total Products</h2>
            <Package className="w-6 h-6 text-neon-cyan" />
          </div>
          <p className="text-3xl font-bold text-neon-cyan mt-2">{stats.totalProducts}</p>
        </motion.div>

        <motion.div
          variants={item}
          className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-neon-cyan/20"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-neon-magenta">Total Users</h2>
            <Users className="w-6 h-6 text-neon-cyan" />
          </div>
          <p className="text-3xl font-bold text-neon-cyan mt-2">{stats.totalUsers}</p>
        </motion.div>

        <motion.div
          variants={item}
          className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-neon-cyan/20"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-neon-magenta">Research Projects</h2>
            <BookOpen className="w-6 h-6 text-neon-cyan" />
          </div>
          <p className="text-3xl font-bold text-neon-cyan mt-2">{stats.totalResearchProjects}</p>
        </motion.div>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-neon-cyan/20"
      >
        <div className="flex items-center space-x-2 mb-6">
          <Activity className="w-6 h-6 text-neon-magenta" />
          <h2 className="text-xl font-semibold text-neon-magenta">Recent Activity</h2>
        </div>
        <div className="space-y-4">
          {stats.recentActivity.map((activity) => (
            <motion.div
              key={activity.id}
              variants={item}
              className="flex items-start space-x-4 text-gray-300"
            >
              <div className="w-2 h-2 rounded-full bg-neon-cyan mt-2" />
              <div>
                <p>{activity.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(activity.created_at).toLocaleDateString()} - {activity.type}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
} 