'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, FileText, Users, ArrowRight } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { can } from '@/lib/rbac';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ResearchStats {
  activeProjects: number;
  publications: number;
  collaborations: number;
}

interface RecentActivity {
  id: string;
  title: string;
  description: string;
  type: string;
  created_at: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function ResearchPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<ResearchStats>({
    activeProjects: 0,
    publications: 0,
    collaborations: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchData() {
      if (session?.user) {
        try {
          // Check if user has permission to read research data
          if (!can(session, 'read', 'research')) {
            router.push('/dashboard');
            return;
          }

          const [projectsCount, publicationsCount, collaborationsCount] = await Promise.all([
            supabase.from('research_projects').count(),
            supabase.from('publications').count(),
            supabase.from('collaborations').count(),
          ]);

          setStats({
            activeProjects: projectsCount.count || 0,
            publications: publicationsCount.count || 0,
            collaborations: collaborationsCount.count || 0,
          });

          const { data: activities } = await supabase
            .from('research_activities')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);

          if (activities) {
            setRecentActivity(activities);
          }
        } catch (error) {
          console.error('Error fetching research data:', error);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchData();
  }, [session, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="text-neon-cyan text-xl">Loading...</div>
      </div>
    );
  }

  const researchCategories = [
    {
      title: 'Active Projects',
      icon: BookOpen,
      count: stats.activeProjects,
      description: 'Ongoing research initiatives across various domains',
    },
    {
      title: 'Publications',
      icon: FileText,
      count: stats.publications,
      description: 'Published papers and research findings',
    },
    {
      title: 'Collaborations',
      icon: Users,
      count: stats.collaborations,
      description: 'Active research partnerships and collaborations',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl font-bold text-neon-cyan mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Research Hub
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Explore our research projects, publications, and collaborations
          </motion.p>
          {session?.user?.role === 'researcher' && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 px-6 py-2 bg-neon-magenta/20 text-neon-magenta border border-neon-magenta rounded-lg hover:bg-neon-magenta/30 transition-colors"
              onClick={() => router.push('/research/new')}
            >
              Create New Project
            </motion.button>
          )}
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {researchCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={index}
                variants={item}
                className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-neon-cyan/20 hover:border-neon-cyan/50 transition-all group cursor-pointer"
                onClick={() => router.push(`/research/${category.title.toLowerCase().replace(' ', '-')}`)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-full bg-neon-magenta/20">
                    <Icon className="w-6 h-6 text-neon-magenta" />
                  </div>
                  <span className="text-3xl font-bold text-neon-cyan">{category.count}</span>
                </div>
                <h3 className="text-xl font-semibold text-neon-magenta mb-2 flex items-center justify-between">
                  {category.title}
                  <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all" />
                </h3>
                <p className="text-gray-400">{category.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 p-6 bg-black/30 backdrop-blur-sm rounded-lg border border-neon-cyan/20"
        >
          <h2 className="text-2xl font-bold text-neon-cyan mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-black/50 rounded-lg">
                <div>
                  <h3 className="text-neon-magenta font-semibold">{activity.title}</h3>
                  <p className="text-gray-400">{activity.description}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(activity.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 