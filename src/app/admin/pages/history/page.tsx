'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, RotateCcw, Eye } from 'lucide-react';
import PageRenderer from '@/components/PageRenderer';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PageRevision {
  id: string;
  created_at: string;
  sections: Array<{
    id: string;
    type: string;
    content: string;
  }>;
  meta: {
    title?: string;
    description?: string;
  };
}

export default function PageHistory() {
  const [page, setPage] = useState<any>(null);
  const [revisions, setRevisions] = useState<PageRevision[]>([]);
  const [selectedRevision, setSelectedRevision] = useState<PageRevision | null>(null);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams?.get('slug');

  useEffect(() => {
    if (!slug) {
      router.push('/admin/pages');
      return;
    }

    async function fetchData() {
      try {
        // Fetch page
        const { data: pageData, error: pageError } = await supabase
          .from('pages')
          .select('*')
          .eq('slug', slug)
          .single();

        if (pageError) throw pageError;
        setPage(pageData);

        // Fetch revisions
        const { data: revisionData, error: revisionError } = await supabase
          .from('page_revisions')
          .select(`
            *,
            author:profiles (
              full_name,
              email
            )
          `)
          .eq('page_id', pageData.id)
          .order('created_at', { ascending: false });

        if (revisionError) throw revisionError;
        setRevisions(revisionData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        router.push('/admin/pages');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug, router]);

  const handleRestore = async (revision: PageRevision) => {
    if (!window.confirm('Are you sure you want to restore this version?')) {
      return;
    }

    setRestoring(true);
    try {
      // Save current version to revisions
      await supabase
        .from('page_revisions')
        .insert({
          page_id: page.id,
          sections: page.sections,
          meta: page.meta,
          settings: page.settings
        });

      // Restore selected revision
      const { error } = await supabase
        .from('pages')
        .update({
          sections: revision.sections,
          meta: revision.meta,
          settings: revision.settings
        })
        .eq('id', page.id);

      if (error) throw error;

      // Log activity
      await supabase.from('admin_activity').insert({
        type: 'page_restored',
        description: `Page "${page.title}" was restored to version from ${new Date(revision.created_at).toLocaleString()}`,
      });

      router.push(`/admin/pages/edit?slug=${slug}`);
    } catch (error) {
      console.error('Error restoring revision:', error);
    } finally {
      setRestoring(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-neon-cyan text-xl">Loading...</div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-red-500">Page not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={() => router.push(`/admin/pages/edit?slug=${slug}`)}
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
            Page History: {page.title}
          </motion.h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revisions List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-semibold text-neon-magenta">Revisions</h2>
          <div className="space-y-2">
            {revisions.map((revision) => (
              <motion.div
                key={revision.id}
                className={`p-4 rounded-lg border transition-colors ${
                  selectedRevision?.id === revision.id
                    ? 'bg-neon-cyan/10 border-neon-cyan'
                    : 'bg-black/30 border-neon-cyan/20 hover:border-neon-cyan/50'
                }`}
                onClick={() => setSelectedRevision(revision)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-neon-cyan">
                    {new Date(revision.created_at).toLocaleString()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRevision(revision);
                      }}
                      className="p-2 text-gray-400 hover:text-neon-cyan transition-colors"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestore(revision);
                      }}
                      className="p-2 text-gray-400 hover:text-neon-magenta transition-colors"
                      title="Restore"
                      disabled={restoring}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  By {revision.author.full_name || revision.author.email}
                </div>
              </motion.div>
            ))}

            {revisions.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No revisions found
              </div>
            )}
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-neon-magenta mb-4">Preview</h2>
          {selectedRevision ? (
            <div className="bg-black/30 backdrop-blur-sm p-8 rounded-lg border border-neon-cyan/20">
              <PageRenderer sections={selectedRevision.sections} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-[60vh] bg-black/30 backdrop-blur-sm rounded-lg border border-neon-cyan/20">
              <div className="text-gray-400">
                Select a revision to preview
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 