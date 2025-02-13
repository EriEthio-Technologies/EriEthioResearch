'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Publication {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  published_date: string;
  category: string;
  doi?: string;
}

export default function PublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPublications() {
      try {
        const { data, error } = await supabase
          .from('publications')
          .select('*')
          .order('published_date', { ascending: false });

        if (error) throw error;
        setPublications(data || []);
      } catch (error) {
        console.error('Error fetching publications:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPublications();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="text-neon-cyan text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-neon-cyan mb-8">Publications</h1>
        
        {publications.length === 0 ? (
          <div className="bg-black/30 backdrop-blur-sm border border-neon-cyan/20 rounded-lg p-8 text-center">
            <p className="text-gray-300 text-lg">
              No publications available yet. Check back soon for updates.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {publications.map((pub) => (
              <div
                key={pub.id}
                className="bg-black/30 backdrop-blur-sm border border-neon-cyan/20 rounded-lg p-6"
              >
                <h2 className="text-2xl font-semibold text-neon-magenta mb-2">
                  {pub.title}
                </h2>
                <div className="text-gray-400 mb-4">
                  <span className="text-neon-cyan">Authors:</span>{' '}
                  {pub.authors.join(', ')}
                </div>
                <p className="text-gray-300 mb-4">{pub.abstract}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="text-gray-400">
                    <span className="text-neon-cyan">Published:</span>{' '}
                    {new Date(pub.published_date).toLocaleDateString()}
                  </span>
                  <span className="text-gray-400">
                    <span className="text-neon-cyan">Category:</span>{' '}
                    {pub.category}
                  </span>
                  {pub.doi && (
                    <a
                      href={`https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neon-magenta hover:text-neon-magenta/80 transition-colors"
                    >
                      DOI: {pub.doi}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 