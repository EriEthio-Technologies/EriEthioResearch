'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, Plus, Eye, History } from 'lucide-react';
import PageRenderer from '@/components/PageRenderer';
import PageBuilder from '@/components/admin/PageBuilder';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PageData {
  id: string;
  title: string;
  sections: PageSection[];
  meta: any;
  settings: any;
}

interface PageSection {
  id: string;
  type: string;
  content: string;
  // Add any other necessary properties
}

export default function EditPage() {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams?.get('slug');
  const sectionId = searchParams?.get('section');

  useEffect(() => {
    if (sectionId) {
      setSelectedSection(sectionId);
    }
  }, [sectionId]);

  useEffect(() => {
    if (!slug) {
      router.push('/admin/pages');
      return;
    }

    async function fetchPage() {
      try {
        const { data, error } = await supabase
          .from('pages')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        setPageData(data);
      } catch (error) {
        console.error('Error fetching page:', error);
        router.push('/admin/pages');
      } finally {
        setLoading(false);
      }
    }

    fetchPage();
  }, [slug, router]);

  const handleSave = async (updatedData: PageData) => {
    setSaving(true);
    try {
      // Save current version to revisions
      await supabase
        .from('page_revisions')
        .insert({
          page_id: pageData.id,
          sections: pageData.sections,
          meta: pageData.meta,
          settings: pageData.settings
        });

      // Update page
      const { error } = await supabase
        .from('pages')
        .update(updatedData)
        .eq('id', pageData.id);

      if (error) throw error;

      // Log activity
      await supabase.from('admin_activity').insert({
        type: 'page_updated',
        description: `Page "${pageData.title}" was updated`,
      });

      setPageData(updatedData);
      setSelectedSection(null);
    } catch (error) {
      console.error('Error saving page:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-neon-cyan text-xl">Loading...</div>
      </div>
    );
  }

  if (!pageData) {
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
            onClick={() => router.push('/admin/pages')}
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
            Edit Page: {pageData.title}
          </motion.h1>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center space-x-2 px-4 py-2 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-colors"
          >
            <Eye className="w-5 h-5" />
            <span>{isPreview ? 'Exit Preview' : 'Preview'}</span>
          </button>
          <button
            onClick={() => router.push(`/admin/pages/history?slug=${slug}`)}
            className="flex items-center space-x-2 px-4 py-2 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-colors"
          >
            <History className="w-5 h-5" />
            <span>History</span>
          </button>
        </div>
      </div>

      {isPreview ? (
        <div className="bg-black/30 backdrop-blur-sm p-8 rounded-lg border border-neon-cyan/20">
          <PageRenderer sections={pageData.sections} />
        </div>
      ) : (
        <PageBuilder
          initialData={pageData}
          selectedSection={selectedSection}
          onSectionSelect={setSelectedSection}
          onSave={handleSave}
          saving={saving}
        />
      )}
    </div>
  );
} 