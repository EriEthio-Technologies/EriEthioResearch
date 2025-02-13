"use client"

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import PageRenderer from '@/components/PageRenderer';
import { useSession } from 'next-auth/react';
import { supabase } from '@/lib/supabase';

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function HomePage() {
  const { data: session } = useSession();
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase
          .from('pages')
          .select('*')
          .eq('slug', 'home')
          .single();

        if (error) throw error;
        setPageData(data);
      } catch (error) {
        console.error('Error fetching page data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Welcome to EriEthio Research</h1>
      <div className="prose max-w-none">
        <p className="text-lg mb-4">
          Discover groundbreaking research and collaboration opportunities between Eritrea and Ethiopia.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Research Projects</h2>
            <p>
              Explore ongoing research projects and find opportunities for collaboration.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Publications</h2>
            <p>
              Access the latest publications and research findings from our community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}