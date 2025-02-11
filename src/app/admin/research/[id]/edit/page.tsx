'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, Users, BookOpen, Flag } from 'lucide-react';
import ResearchProjectForm from '@/components/ResearchProjectForm';
import CollaboratorsManager from '@/components/CollaboratorsManager';
import PublicationsManager from '@/components/PublicationsManager';
import MilestonesManager from '@/components/MilestonesManager';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type ActiveTab = 'details' | 'collaborators' | 'publications' | 'milestones';

export default function EditResearchProject() {
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('details');
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    async function fetchProject() {
      try {
        const { data, error } = await supabase
          .from('research_projects')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setProject(data);
      } catch (error) {
        console.error('Error fetching research project:', error);
        router.push('/admin/research');
      } finally {
        setIsFetching(false);
      }
    }

    fetchProject();
  }, [params.id, router]);

  const handleSubmit = async (formData: any) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('research_projects')
        .update({
          title: formData.title,
          description: formData.description,
          methodology: formData.methodology,
          status: formData.status,
          lead_researcher_id: formData.lead_researcher_id,
          start_date: formData.start_date,
          end_date: formData.end_date,
          tags: formData.tags,
        })
        .eq('id', params.id);

      if (error) throw error;

      // Log activity
      await supabase.from('admin_activity').insert({
        type: 'project_updated',
        description: `Research project "${formData.title}" was updated`,
      });

      router.push('/admin/research');
    } catch (error) {
      console.error('Error updating research project:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-neon-cyan text-xl">Loading...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-red-500">Research project not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={() => router.push('/admin/research')}
            className="text-neon-magenta hover:text-neon-magenta/80 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>
          <motion.h1 
            className="text-4xl font-bold text-neon-cyan"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Edit Research Project
          </motion.h1>
        </div>
      </div>

      <div className="flex space-x-4 border-b border-neon-cyan/20">
        <button
          className={`px-4 py-2 -mb-px text-lg font-medium transition-colors ${
            activeTab === 'details'
              ? 'text-neon-cyan border-b-2 border-neon-cyan'
              : 'text-gray-400 hover:text-neon-cyan'
          }`}
          onClick={() => setActiveTab('details')}
        >
          Project Details
        </button>
        <button
          className={`px-4 py-2 -mb-px text-lg font-medium transition-colors flex items-center space-x-2 ${
            activeTab === 'collaborators'
              ? 'text-neon-cyan border-b-2 border-neon-cyan'
              : 'text-gray-400 hover:text-neon-cyan'
          }`}
          onClick={() => setActiveTab('collaborators')}
        >
          <Users className="w-5 h-5" />
          <span>Collaborators</span>
        </button>
        <button
          className={`px-4 py-2 -mb-px text-lg font-medium transition-colors flex items-center space-x-2 ${
            activeTab === 'publications'
              ? 'text-neon-cyan border-b-2 border-neon-cyan'
              : 'text-gray-400 hover:text-neon-cyan'
          }`}
          onClick={() => setActiveTab('publications')}
        >
          <BookOpen className="w-5 h-5" />
          <span>Publications</span>
        </button>
        <button
          className={`px-4 py-2 -mb-px text-lg font-medium transition-colors flex items-center space-x-2 ${
            activeTab === 'milestones'
              ? 'text-neon-cyan border-b-2 border-neon-cyan'
              : 'text-gray-400 hover:text-neon-cyan'
          }`}
          onClick={() => setActiveTab('milestones')}
        >
          <Flag className="w-5 h-5" />
          <span>Milestones</span>
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/30 backdrop-blur-sm p-8 rounded-lg border border-neon-cyan/20"
      >
        {activeTab === 'details' ? (
          <ResearchProjectForm
            initialData={project}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            mode="edit"
          />
        ) : activeTab === 'collaborators' ? (
          <CollaboratorsManager
            projectId={params.id as string}
            leadResearcherId={project.lead_researcher_id}
          />
        ) : activeTab === 'publications' ? (
          <PublicationsManager
            projectId={params.id as string}
          />
        ) : (
          <MilestonesManager
            projectId={params.id as string}
          />
        )}
      </motion.div>
    </div>
  );
} 