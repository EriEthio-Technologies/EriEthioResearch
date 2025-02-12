'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { can } from '@/lib/rbac';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ResearchItem {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  author: {
    name: string;
    role: string;
  };
  tags: string[];
}

export async function generateStaticParams() {
  return [
    { category: 'active-projects' },
    { category: 'publications' },
    { category: 'collaborations' }
  ];
}

export default function ResearchCategoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [items, setItems] = useState<ResearchItem[]>([]);
  const [loading, setLoading] = useState(true);

  const category = params.category as string;
  const categoryTitle = category.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchData() {
      if (session?.user) {
        try {
          if (!can(session, 'read', 'research')) {
            router.push('/dashboard');
            return;
          }

          let table;
          switch (category) {
            case 'active-projects':
              table = 'research_projects';
              break;
            case 'publications':
              table = 'publications';
              break;
            case 'collaborations':
              table = 'collaborations';
              break;
            default:
              router.push('/research');
              return;
          }

          const { data, error } = await supabase
            .from(table)
            .select('*, author:profiles(*)')
            .order('created_at', { ascending: false });

          if (error) throw error;

          if (data) {
            setItems(data.map(item => ({
              ...item,
              author: {
                name: item.author.full_name,
                role: item.author.role,
              }
            })));
          }
        } catch (error) {
          console.error('Error fetching research data:', error);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchData();
  }, [session, router, category]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="text-neon-cyan text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center text-neon-magenta mb-8 hover:text-neon-magenta/80 transition-colors"
          onClick={() => router.push('/research')}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Research Hub
        </motion.button>

        <motion.h1 
          className="text-4xl font-bold text-neon-cyan mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {categoryTitle}
        </motion.h1>

        <div className="grid gap-6">
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-neon-cyan/20 hover:border-neon-cyan/50 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-semibold text-neon-magenta">{item.title}</h2>
                <span className="px-3 py-1 bg-neon-cyan/20 text-neon-cyan text-sm rounded-full">
                  {item.status}
                </span>
              </div>
              <p className="text-gray-300 mb-4">{item.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-neon-magenta" />
                  {new Date(item.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-neon-magenta" />
                  {item.author.name} ({item.author.role})
                </div>
                {item.tags && (
                  <div className="flex items-center">
                    <Tag className="w-4 h-4 mr-2 text-neon-magenta" />
                    {item.tags.join(', ')}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 