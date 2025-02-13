"use client"

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="text-neon-cyan text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Hero Section */}
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-neon-cyan mb-6">
              Welcome to EriEthio Research
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Discover groundbreaking research and collaboration opportunities between Eritrea and Ethiopia.
              Join our community of researchers, innovators, and thought leaders.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/research"
                className="bg-neon-cyan/20 text-neon-cyan border border-neon-cyan hover:bg-neon-cyan hover:text-black px-6 py-3 rounded-lg transition-all"
              >
                Explore Research
              </Link>
              <Link
                href="/auth/signin"
                className="bg-neon-magenta/20 text-neon-magenta border border-neon-magenta hover:bg-neon-magenta hover:text-black px-6 py-3 rounded-lg transition-all"
              >
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Sections */}
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Research Projects */}
            <div className="bg-black/30 backdrop-blur-sm border border-neon-cyan/20 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-neon-cyan mb-4">Research Projects</h2>
              <p className="text-gray-300 mb-4">
                Explore ongoing research projects and find opportunities for collaboration across various disciplines.
              </p>
              <Link
                href="/research"
                className="text-neon-cyan hover:text-neon-cyan/80 transition-colors"
              >
                View Projects →
              </Link>
            </div>

            {/* Publications */}
            <div className="bg-black/30 backdrop-blur-sm border border-neon-magenta/20 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-neon-magenta mb-4">Publications</h2>
              <p className="text-gray-300 mb-4">
                Access the latest publications, research findings, and academic papers from our community.
              </p>
              <Link
                href="/publications"
                className="text-neon-magenta hover:text-neon-magenta/80 transition-colors"
              >
                Browse Publications →
              </Link>
            </div>

            {/* Collaboration */}
            <div className="bg-black/30 backdrop-blur-sm border border-neon-cyan/20 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-neon-cyan mb-4">Collaboration</h2>
              <p className="text-gray-300 mb-4">
                Connect with researchers, institutions, and industry partners to drive innovation forward.
              </p>
              <Link
                href="/contact"
                className="text-neon-cyan hover:text-neon-cyan/80 transition-colors"
              >
                Get Started →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Research Section */}
      <div className="py-16 px-4 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-neon-magenta mb-8">Latest Research</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Add research cards here */}
          </div>
        </div>
      </div>
    </div>
  );
}