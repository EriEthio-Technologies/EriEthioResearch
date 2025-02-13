'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface ResearchProject {
  id: string;
  title: string;
  description: string;
  status: 'ongoing' | 'completed' | 'planned';
  start_date: string;
  end_date?: string;
  researchers: string[];
  tags: string[];
}

export default function ResearchPage() {
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase
          .from('research_projects')
          .select('*')
          .order('start_date', { ascending: false });

        if (error) throw error;
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching research projects:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="text-neon-cyan text-xl">Loading...</div>
      </div>
    );
  }

  const getStatusColor = (status: ResearchProject['status']) => {
    switch (status) {
      case 'ongoing':
        return 'text-green-400';
      case 'completed':
        return 'text-blue-400';
      case 'planned':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-neon-cyan mb-8">Research Projects</h1>
        
        {projects.length === 0 ? (
          <div className="bg-black/30 backdrop-blur-sm border border-neon-cyan/20 rounded-lg p-8 text-center">
            <p className="text-gray-300 text-lg">
              No research projects available yet. Check back soon for updates.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-black/30 backdrop-blur-sm border border-neon-cyan/20 rounded-lg p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-semibold text-neon-magenta">
                    {project.title}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(project.status)}`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </div>
                
                <p className="text-gray-300 mb-4">{project.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm mb-4">
                  <span className="text-gray-400">
                    <span className="text-neon-cyan">Started:</span>{' '}
                    {new Date(project.start_date).toLocaleDateString()}
                  </span>
                  {project.end_date && (
                    <span className="text-gray-400">
                      <span className="text-neon-cyan">Completed:</span>{' '}
                      {new Date(project.end_date).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <h3 className="text-neon-cyan mb-2">Researchers</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.researchers.map((researcher, index) => (
                      <span
                        key={index}
                        className="bg-black/50 px-3 py-1 rounded-full text-gray-300 text-sm"
                      >
                        {researcher}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-neon-cyan mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-neon-magenta/20 px-3 py-1 rounded-full text-neon-magenta text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 