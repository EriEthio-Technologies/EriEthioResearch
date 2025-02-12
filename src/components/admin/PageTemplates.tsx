'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { Plus, Trash2, Copy, Edit, Save } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Template {
  id: string;
  name: string;
  description: string;
  sections: any[];
  meta: any;
  settings: any;
  created_at: string;
  updated_at: string;
}

interface PageTemplatesProps {
  onSelect?: (template: Template) => void;
  onClose?: () => void;
}

export default function PageTemplates({ onSelect, onClose }: PageTemplatesProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [newTemplate, setNewTemplate] = useState<Partial<Template>>({
    name: '',
    description: ''
  });
  const [showNewForm, setShowNewForm] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    try {
      const { data, error } = await supabase
        .from('page_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSaveTemplate = async (template: Partial<Template>) => {
    try {
      const { data, error } = await supabase
        .from('page_templates')
        .upsert({
          id: template.id,
          name: template.name,
          description: template.description,
          sections: template.sections || [],
          meta: template.meta || {},
          settings: template.settings || {},
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Log activity
      await supabase.from('admin_activity').insert({
        type: template.id ? 'template_updated' : 'template_created',
        description: `Page template "${template.name}" was ${template.id ? 'updated' : 'created'}`,
      });

      fetchTemplates();
      setEditingTemplate(null);
      setShowNewForm(false);
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  const handleDeleteTemplate = async (template: Template) => {
    if (!window.confirm('Are you sure you want to delete this template?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('page_templates')
        .delete()
        .eq('id', template.id);

      if (error) throw error;

      // Log activity
      await supabase.from('admin_activity').insert({
        type: 'template_deleted',
        description: `Page template "${template.name}" was deleted`,
      });

      fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-neon-cyan text-xl">Loading templates...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neon-cyan">Page Templates</h2>
        <button
          onClick={() => setShowNewForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-neon-magenta/20 text-neon-magenta border border-neon-magenta rounded-lg hover:bg-neon-magenta/30 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>New Template</span>
        </button>
      </div>

      {showNewForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-neon-cyan/20 space-y-4"
        >
          <h3 className="text-lg font-semibold text-neon-cyan">New Template</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-neon-magenta mb-2">Name</label>
              <input
                type="text"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-neon-magenta mb-2">Description</label>
              <textarea
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowNewForm(false)}
                className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveTemplate(newTemplate)}
                className="flex items-center space-x-2 px-4 py-2 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-colors"
              >
                <Save className="w-5 h-5" />
                <span>Save Template</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-neon-cyan/20 hover:border-neon-cyan/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-neon-cyan">{template.name}</h3>
                <p className="text-gray-400 mt-1">{template.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSelect?.(template)}
                  className="p-2 text-gray-400 hover:text-neon-cyan transition-colors"
                  title="Use Template"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setEditingTemplate(template)}
                  className="p-2 text-gray-400 hover:text-neon-magenta transition-colors"
                  title="Edit"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteTemplate(template)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              Last updated: {new Date(template.updated_at).toLocaleString()}
            </div>
          </motion.div>
        ))}
      </div>

      {editingTemplate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/90 p-8 rounded-lg border border-neon-cyan/20 max-w-lg w-full mx-4"
          >
            <h2 className="text-2xl font-bold text-neon-cyan mb-6">Edit Template</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-neon-magenta mb-2">Name</label>
                <input
                  type="text"
                  value={editingTemplate.name}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                  className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-neon-magenta mb-2">Description</label>
                <textarea
                  value={editingTemplate.description}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
                  className="w-full px-4 py-2 bg-black/30 border border-neon-cyan/20 rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setEditingTemplate(null)}
                  className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveTemplate(editingTemplate)}
                  className="flex items-center space-x-2 px-4 py-2 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 