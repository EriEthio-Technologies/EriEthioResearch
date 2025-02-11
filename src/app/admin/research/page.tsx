'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Eye, 
  Tag, 
  Calendar, 
  User, 
  Search,
  Filter,
  BarChart,
  Clock,
  Users,
  Archive
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { ProjectStatus } from '@/lib/db/types';
import BulkActionsMenu from '@/components/BulkActionsMenu';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ResearchProject {
  id: string;
  title: string;
  description: string;
  methodology: string;
  status: ProjectStatus;
  lead_researcher_id: string;
  start_date: string;
  end_date: string | null;
  created_at: string;
  tags: string[];
  lead_researcher: {
    full_name: string;
    email: string;
  };
}

interface Analytics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalResearchers: number;
  statusBreakdown: Record<ProjectStatus, number>;
  tagCounts: Record<string, number>;
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

const statusColors = {
  planning: 'text-yellow-500',
  in_progress: 'text-blue-500',
  completed: 'text-green-500',
  archived: 'text-gray-500'
};

export default function ResearchManagement() {
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ResearchProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch projects
        const { data, error } = await supabase
          .from('research_projects')
          .select(`
            *,
            lead_researcher:profiles(full_name, email)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProjects(data || []);

        // Extract all unique tags
        const tags = new Set<string>();
        data?.forEach(project => {
          project.tags?.forEach(tag => tags.add(tag));
        });
        setAllTags(Array.from(tags));

        // Calculate analytics
        const analytics: Analytics = {
          totalProjects: data?.length || 0,
          activeProjects: data?.filter(p => p.status === 'in_progress').length || 0,
          completedProjects: data?.filter(p => p.status === 'completed').length || 0,
          totalResearchers: new Set(data?.map(p => p.lead_researcher_id)).size,
          statusBreakdown: {
            planning: data?.filter(p => p.status === 'planning').length || 0,
            in_progress: data?.filter(p => p.status === 'in_progress').length || 0,
            completed: data?.filter(p => p.status === 'completed').length || 0,
            archived: data?.filter(p => p.status === 'archived').length || 0,
          },
          tagCounts: data?.reduce((acc, project) => {
            project.tags?.forEach(tag => {
              acc[tag] = (acc[tag] || 0) + 1;
            });
            return acc;
          }, {} as Record<string, number>) || {},
        };
        setAnalytics(analytics);
      } catch (error) {
        console.error('Error fetching research data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...projects];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        project.lead_researcher.full_name.toLowerCase().includes(term) ||
        project.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    // Apply tag filters
    if (selectedTags.length > 0) {
      filtered = filtered.filter(project =>
        selectedTags.every(tag => project.tags.includes(tag))
      );
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, statusFilter, selectedTags]);

  async function handleDeleteProject(id: string, title: string) {
    if (!window.confirm('Are you sure you want to delete this research project?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('research_projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProjects(projects.filter(project => project.id !== id));

      // Log activity
      await supabase.from('admin_activity').insert({
        type: 'project_deleted',
        description: `Research project "${title}" was deleted`,
      });
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  }

  async function handleUpdateStatus(id: string, newStatus: ProjectStatus, title: string) {
    try {
      const { error } = await supabase
        .from('research_projects')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setProjects(projects.map(project => 
        project.id === id ? { ...project, status: newStatus } : project
      ));

      // Log activity
      await supabase.from('admin_activity').insert({
        type: 'project_status_updated',
        description: `Research project "${title}" status was updated to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating project status:', error);
    }
  }

  const handleBulkAction = async (action: string, data?: any) => {
    try {
      switch (action) {
        case 'delete':
          const { error: deleteError } = await supabase
            .from('research_projects')
            .delete()
            .in('id', selectedProjects);
          
          if (deleteError) throw deleteError;

          // Log activity
          await supabase.from('admin_activity').insert({
            type: 'projects_bulk_deleted',
            description: `${selectedProjects.length} research projects were deleted`,
          });
          break;

        case 'archive':
          const { error: archiveError } = await supabase
            .from('research_projects')
            .update({ status: 'archived' })
            .in('id', selectedProjects);
          
          if (archiveError) throw archiveError;

          // Log activity
          await supabase.from('admin_activity').insert({
            type: 'projects_bulk_archived',
            description: `${selectedProjects.length} research projects were archived`,
          });
          break;

        case 'status':
          const { error: statusError } = await supabase
            .from('research_projects')
            .update({ status: data })
            .in('id', selectedProjects);
          
          if (statusError) throw statusError;

          // Log activity
          await supabase.from('admin_activity').insert({
            type: 'projects_bulk_status_updated',
            description: `Status updated to "${data}" for ${selectedProjects.length} research projects`,
          });
          break;

        case 'tags':
          const { error: tagsError } = await supabase
            .from('research_projects')
            .update({ tags: data })
            .in('id', selectedProjects);
          
          if (tagsError) throw tagsError;

          // Log activity
          await supabase.from('admin_activity').insert({
            type: 'projects_bulk_tags_updated',
            description: `Tags updated for ${selectedProjects.length} research projects`,
          });
          break;
      }

      // Refresh projects list
      fetchData();
      // Clear selection
      setSelectedProjects([]);
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const bulkActions = [
    {
      name: 'delete',
      label: 'Delete Selected',
      icon: Trash2,
      requiresConfirmation: true,
    },
    {
      name: 'archive',
      label: 'Archive Selected',
      icon: Archive,
      requiresConfirmation: true,
    },
    {
      name: 'status',
      label: 'Update Status',
      icon: Clock,
      requiresInput: true,
      inputType: 'select',
      options: ['draft', 'in_progress', 'completed', 'on_hold'],
    },
    {
      name: 'tags',
      label: 'Update Tags',
      icon: Tag,
      requiresInput: true,
      inputType: 'tags',
    },
  ];

  const toggleProjectSelection = (projectId: string) => {
    setSelectedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const toggleAllProjects = () => {
    setSelectedProjects(prev =>
      prev.length === projects.length ? [] : projects.map(p => p.id)
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-neon-cyan text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <motion.h1 
          className="text-4xl font-bold text-neon-cyan"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Research Management
        </motion.h1>
        <div className="flex items-center space-x-4">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2 px-4 py-2 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-colors"
            onClick={() => setShowAnalytics(!showAnalytics)}
          >
            <BarChart className="w-5 h-5" />
            <span>Analytics</span>
          </motion.button>
          <BulkActionsMenu
            selectedItems={selectedProjects}
            onBulkAction={handleBulkAction}
            actions={bulkActions}
          />
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2 px-4 py-2 bg-neon-magenta/20 text-neon-magenta border border-neon-magenta rounded-lg hover:bg-neon-magenta/30 transition-colors"
            onClick={() => router.push('/admin/research/new')}
          >
            <Plus className="w-5 h-5" />
            <span>Add Project</span>
          </motion.button>
        </div>
      </div>

      {showAnalytics && analytics && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-neon-cyan/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-neon-magenta">Total Projects</h3>
              <BarChart className="w-5 h-5 text-neon-cyan" />
            </div>
            <p className="text-3xl font-bold text-neon-cyan">{analytics.totalProjects}</p>
          </div>
          <div className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-neon-cyan/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-neon-magenta">Active Projects</h3>
              <Clock className="w-5 h-5 text-neon-cyan" />
            </div>
            <p className="text-3xl font-bold text-neon-cyan">{analytics.activeProjects}</p>
          </div>
          <div className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-neon-cyan/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-neon-magenta">Completed</h3>
              <Check className="w-5 h-5 text-neon-cyan" />
            </div>
            <p className="text-3xl font-bold text-neon-cyan">{analytics.completedProjects}</p>
          </div>
          <div className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-neon-cyan/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-neon-magenta">Researchers</h3>
              <Users className="w-5 h-5 text-neon-cyan" />
            </div>
            <p className="text-3xl font-bold text-neon-cyan">{analytics.totalResearchers}</p>
          </div>
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'all')}
            className="px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="planning">Planning</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
          <select
            multiple
            value={selectedTags}
            onChange={(e) => setSelectedTags(Array.from(e.target.selectedOptions, option => option.value))}
            className="px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
          >
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6"
      >
        {filteredProjects.map((project) => (
          <motion.div
            key={project.id}
            variants={item}
            className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-neon-cyan/20 hover:border-neon-cyan/50 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold text-neon-magenta">{project.title}</h2>
                <p className="text-gray-400">{project.description}</p>
              </div>
              <select
                value={project.status}
                onChange={(e) => handleUpdateStatus(project.id, e.target.value as ProjectStatus, project.title)}
                className={`px-3 py-1 rounded-full bg-black/30 border border-neon-cyan/20 ${statusColors[project.status]} focus:outline-none focus:border-neon-cyan`}
              >
                <option value="planning">Planning</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center space-x-2 text-gray-300">
                <Calendar className="w-4 h-4 text-neon-magenta" />
                <span>Start: {new Date(project.start_date).toLocaleDateString()}</span>
              </div>
              {project.end_date && (
                <div className="flex items-center space-x-2 text-gray-300">
                  <Calendar className="w-4 h-4 text-neon-magenta" />
                  <span>End: {new Date(project.end_date).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex items-center space-x-2 text-gray-300">
                <User className="w-4 h-4 text-neon-magenta" />
                <span>Lead: {project.lead_researcher.full_name}</span>
              </div>
            </div>

            {project.tags && project.tags.length > 0 && (
              <div className="flex items-center space-x-2 mb-4">
                <Tag className="w-4 h-4 text-neon-magenta" />
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-sm bg-neon-cyan/10 text-neon-cyan rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => router.push(`/research/${project.id}`)}
                className="p-2 text-gray-400 hover:text-neon-cyan transition-colors"
                title="View"
              >
                <Eye className="w-5 h-5" />
              </button>
              <button
                onClick={() => router.push(`/admin/research/${project.id}/edit`)}
                className="p-2 text-gray-400 hover:text-neon-magenta transition-colors"
                title="Edit"
              >
                <Pencil className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDeleteProject(project.id, project.title)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
} 