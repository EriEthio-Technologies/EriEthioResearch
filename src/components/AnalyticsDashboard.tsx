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
import { Package, Users, BookOpen, Activity, Flag } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Analytics {
  overview: {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    totalResearchers: number;
    totalPublications: number;
    totalMilestones: number;
  };
  projectsByStatus: {
    name: string;
    value: number;
  }[];
  projectsByMonth: {
    date: string;
    projects: number;
    publications: number;
  }[];
  researcherContributions: {
    name: string;
    projects: number;
    publications: number;
  }[];
  milestoneCompletion: {
    name: string;
    completed: number;
    total: number;
  }[];
}

const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#0088FE'];

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    try {
      // Fetch all required data
      const [
        { count: totalProjects },
        { count: activeProjects },
        { count: completedProjects },
        { count: totalResearchers },
        { count: totalPublications },
        { count: totalMilestones },
        { data: projectStatusData },
        { data: monthlyData },
        { data: researcherData },
        { data: milestoneData }
      ] = await Promise.all([
        supabase.from('research_projects').select('*', { count: 'exact', head: true }),
        supabase.from('research_projects').select('*', { count: 'exact', head: true }).eq('status', 'in_progress'),
        supabase.from('research_projects').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'researcher'),
        supabase.from('publications').select('*', { count: 'exact', head: true }),
        supabase.from('milestones').select('*', { count: 'exact', head: true }),
        supabase.from('research_projects').select('status'),
        supabase.from('research_projects').select('created_at'),
        supabase.from('profiles').select('full_name, research_projects(id), publications(id)').eq('role', 'researcher'),
        supabase.from('milestones').select('status')
      ]);

      // Process project status data
      const statusCounts = projectStatusData?.reduce((acc, { status }) => {
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const projectsByStatus = Object.entries(statusCounts || {}).map(([name, value]) => ({
        name,
        value
      }));

      // Process monthly data
      const monthlyProjects = new Map<string, number>();
      const monthlyPublications = new Map<string, number>();

      monthlyData?.forEach(({ created_at }) => {
        const month = new Date(created_at).toISOString().slice(0, 7);
        monthlyProjects.set(month, (monthlyProjects.get(month) || 0) + 1);
      });

      const projectsByMonth = Array.from(monthlyProjects.entries())
        .map(([date, projects]) => ({
          date,
          projects,
          publications: monthlyPublications.get(date) || 0
        }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-12); // Last 12 months

      // Process researcher data
      const researcherContributions = researcherData?.map(researcher => ({
        name: researcher.full_name,
        projects: researcher.research_projects?.length || 0,
        publications: researcher.publications?.length || 0
      })) || [];

      // Process milestone data
      const milestoneCompletion = [
        {
          name: 'Completed',
          completed: milestoneData?.filter(m => m.status === 'completed').length || 0,
          total: milestoneData?.length || 0
        },
        {
          name: 'In Progress',
          completed: milestoneData?.filter(m => m.status === 'in_progress').length || 0,
          total: milestoneData?.length || 0
        },
        {
          name: 'Pending',
          completed: milestoneData?.filter(m => m.status === 'pending').length || 0,
          total: milestoneData?.length || 0
        }
      ];

      setAnalytics({
        overview: {
          totalProjects: totalProjects || 0,
          activeProjects: activeProjects || 0,
          completedProjects: completedProjects || 0,
          totalResearchers: totalResearchers || 0,
          totalPublications: totalPublications || 0,
          totalMilestones: totalMilestones || 0
        },
        projectsByStatus,
        projectsByMonth,
        researcherContributions,
        milestoneCompletion
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="text-neon-cyan">Loading analytics...</div>;
  }

  if (!analytics) {
    return <div className="text-red-500">Failed to load analytics</div>;
  }

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-neon-cyan/20"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-neon-magenta">Total Projects</h3>
            <Package className="w-5 h-5 text-neon-cyan" />
          </div>
          <p className="text-3xl font-bold text-neon-cyan">{analytics.overview.totalProjects}</p>
          <div className="mt-2 text-sm text-gray-400">
            {analytics.overview.activeProjects} active, {analytics.overview.completedProjects} completed
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-neon-cyan/20"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-neon-magenta">Researchers</h3>
            <Users className="w-5 h-5 text-neon-cyan" />
          </div>
          <p className="text-3xl font-bold text-neon-cyan">{analytics.overview.totalResearchers}</p>
          <div className="mt-2 text-sm text-gray-400">
            Contributing to {analytics.overview.activeProjects} active projects
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-neon-cyan/20"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-neon-magenta">Publications</h3>
            <BookOpen className="w-5 h-5 text-neon-cyan" />
          </div>
          <p className="text-3xl font-bold text-neon-cyan">{analytics.overview.totalPublications}</p>
          <div className="mt-2 text-sm text-gray-400">
            Across {analytics.overview.totalProjects} research projects
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Project Status Distribution */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-neon-cyan/20"
        >
          <h3 className="text-xl font-semibold text-neon-magenta mb-6">Project Status Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.projectsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {analytics.projectsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Monthly Activity */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-neon-cyan/20"
        >
          <h3 className="text-xl font-semibold text-neon-magenta mb-6">Monthly Activity</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.projectsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="projects" stroke="#00C49F" name="New Projects" />
                <Line type="monotone" dataKey="publications" stroke="#FFBB28" name="Publications" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Researcher Contributions */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-neon-cyan/20"
        >
          <h3 className="text-xl font-semibold text-neon-magenta mb-6">Researcher Contributions</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.researcherContributions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="projects" fill="#0088FE" name="Projects" />
                <Bar dataKey="publications" fill="#00C49F" name="Publications" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Milestone Progress */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-neon-cyan/20"
        >
          <h3 className="text-xl font-semibold text-neon-magenta mb-6">Milestone Progress</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.milestoneCompletion}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#00C49F" name="Completed" stackId="a" />
                <Bar dataKey="total" fill="#FF8042" name="Total" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 