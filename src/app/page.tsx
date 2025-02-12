"use client"

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import PageRenderer from '@/components/PageRenderer';
import { useSession } from 'next-auth/react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function HomePage() {
  const { data: session } = useSession();
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPage() {
      try {
        const { data, error } = await supabase
          .from('pages')
          .select('*')
          .eq('slug', '/')
          .eq('status', 'published')
          .single();

        if (error) throw error;
        setPageData(data);
      } catch (error) {
        console.error('Error fetching page:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPage();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="text-neon-cyan text-xl">Loading...</div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="text-red-500">Page not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 px-4 py-16">
      <div className="max-w-7xl mx-auto">
        <PageRenderer
          sections={pageData.sections}
          isEditing={session?.user?.role === 'admin'}
          onSectionClick={(section) => {
            if (session?.user?.role === 'admin') {
              window.location.href = `/admin/pages/edit?slug=${pageData.slug}&section=${section.id}`;
            }
          }}
        />
      </div>
    </div>
  );
}