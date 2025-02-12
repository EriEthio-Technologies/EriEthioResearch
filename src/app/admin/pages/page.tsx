'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { Plus, Edit, Trash2, Eye, Lock, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PageBuilder from '@/components/admin/PageBuilder';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Page {
  id: string;
  title: string;
  slug: string;
  description?: string;
  settings: {
    requiresAuth?: boolean;
    layout?: string;
    theme?: string;
  };
  created_at: string;
  updated_at: string;
}

export default function PagesManagement() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchPages();
  }, []);

  async function fetchPages() {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (page: Page) => {
    if (!window.confirm('Are you sure you want to delete this page?')) return;

    try {
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', page.id);

      if (error) throw error;

      // Log activity
      await supabase.from('admin_activity').insert({
        type: 'page_deleted',
        description: `Page "${page.title}" was deleted`,
      });

      fetchPages();
    } catch (error) {
      console.error('Error deleting page:', error);
    }
  };

  if (loading) {
    return <div className="text-neon-cyan">Loading pages...</div>;
  }

  if (showBuilder) {
    return (
      <PageBuilder
        initialData={editingPage || undefined}
        onSave={() => {
          setShowBuilder(false);
          setEditingPage(null);
          fetchPages();
        }}
        onCancel={() => {
          setShowBuilder(false);
          setEditingPage(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-neon-cyan">Pages</h1>
        <button
          onClick={() => setShowBuilder(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-neon-magenta/20 text-neon-magenta border border-neon-magenta rounded-lg hover:bg-neon-magenta/30 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>New Page</span>
        </button>
      </div>

      <div className="grid gap-6">
        {pages.map((page) => (
          <motion.div
            key={page.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-neon-cyan/20 hover:border-neon-cyan/50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-neon-cyan flex items-center gap-2">
                  {page.title}
                  {page.settings.requiresAuth ? (
                    <Lock className="w-4 h-4 text-neon-magenta" />
                  ) : (
                    <Globe className="w-4 h-4 text-green-500" />
                  )}
                </h2>
                <p className="text-gray-400 mt-1">/{page.slug}</p>
                {page.description && (
                  <p className="text-gray-300 mt-2">{page.description}</p>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => router.push(`/${page.slug}`)}
                  className="p-2 text-gray-400 hover:text-neon-cyan transition-colors"
                  title="View"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setEditingPage(page);
                    setShowBuilder(true);
                  }}
                  className="p-2 text-gray-400 hover:text-neon-magenta transition-colors"
                  title="Edit"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(page)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4 mt-4 text-sm text-gray-400">
              <span>Layout: {page.settings.layout || 'default'}</span>
              <span>Theme: {page.settings.theme || 'dark'}</span>
              <span>Updated: {new Date(page.updated_at).toLocaleDateString()}</span>
            </div>
          </motion.div>
        ))}

        {pages.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No pages found. Create your first page by clicking the "New Page" button above.
          </div>
        )}
      </div>
    </div>
  );
} 