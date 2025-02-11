import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { ProjectStatus } from '@/lib/db/types';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ResearchProjectFormData {
  title: string;
  description: string;
  methodology: string;
  status: ProjectStatus;
  lead_researcher_id: string;
  start_date: string;
  end_date: string | null;
  tags: string[];
}

interface ResearchProjectFormProps {
  initialData?: ResearchProjectFormData;
  onSubmit: (data: ResearchProjectFormData) => Promise<void>;
  isLoading: boolean;
  mode: 'create' | 'edit';
}

interface Researcher {
  id: string;
  full_name: string;
  email: string;
}

const defaultProject: ResearchProjectFormData = {
  title: '',
  description: '',
  methodology: '',
  status: 'planning',
  lead_researcher_id: '',
  start_date: new Date().toISOString().split('T')[0],
  end_date: null,
  tags: [],
};

export default function ResearchProjectForm({ initialData, onSubmit, isLoading, mode }: ResearchProjectFormProps) {
  const [formData, setFormData] = useState<ResearchProjectFormData>(initialData || defaultProject);
  const [error, setError] = useState<string>('');
  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [newTag, setNewTag] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    async function fetchResearchers() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .eq('role', 'researcher');

        if (error) throw error;
        setResearchers(data || []);
      } catch (error) {
        console.error('Error fetching researchers:', error);
      }
    }

    fetchResearchers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.lead_researcher_id) {
      setError('Lead researcher is required');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleAddTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-500">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-neon-magenta mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-neon-magenta mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-neon-magenta mb-2">Methodology</label>
          <textarea
            value={formData.methodology}
            onChange={(e) => setFormData({ ...formData, methodology: e.target.value })}
            className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-neon-magenta mb-2">Lead Researcher</label>
          <select
            value={formData.lead_researcher_id}
            onChange={(e) => setFormData({ ...formData, lead_researcher_id: e.target.value })}
            className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
            required
          >
            <option value="">Select a researcher</option>
            {researchers.map((researcher) => (
              <option key={researcher.id} value={researcher.id}>
                {researcher.full_name} ({researcher.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-neon-magenta mb-2">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
            className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
          >
            <option value="planning">Planning</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div>
          <label className="block text-neon-magenta mb-2">Start Date</label>
          <input
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-neon-magenta mb-2">End Date (Optional)</label>
          <input
            type="date"
            value={formData.end_date || ''}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value || null })}
            className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-neon-magenta mb-2">Tags</label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="flex-1 px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
              placeholder="Enter a tag"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-neon-magenta/20 text-neon-magenta border border-neon-magenta rounded-lg hover:bg-neon-magenta/30 transition-colors"
            >
              Add Tag
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 px-3 py-1 bg-neon-cyan/10 text-neon-cyan rounded-full"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-red-500 hover:text-red-400"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <motion.button
          type="submit"
          disabled={isLoading}
          className={`px-6 py-3 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-colors ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? 'Saving...' : mode === 'create' ? 'Create Project' : 'Update Project'}
        </motion.button>
      </div>
    </form>
  );
} 