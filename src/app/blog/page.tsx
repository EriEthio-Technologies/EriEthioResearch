'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  published_date: string;
  category: string;
  tags: string[];
  slug: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('published_date', { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
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
        <h1 className="text-4xl font-bold text-neon-cyan mb-8">Blog</h1>
        
        {posts.length === 0 ? (
          <div className="bg-black/30 backdrop-blur-sm border border-neon-cyan/20 rounded-lg p-8 text-center">
            <p className="text-gray-300 text-lg">
              No blog posts available yet. Check back soon for updates.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group"
              >
                <article className="h-full bg-black/30 backdrop-blur-sm border border-neon-cyan/20 rounded-lg p-6 hover:border-neon-cyan/50 transition-colors">
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      <div className="text-sm text-gray-400 mb-2">
                        {new Date(post.published_date).toLocaleDateString()} • {post.category}
                      </div>
                      <h2 className="text-2xl font-semibold text-neon-magenta group-hover:text-neon-magenta/80 transition-colors mb-2">
                        {post.title}
                      </h2>
                      <p className="text-gray-300 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="mt-auto">
                      <div className="mb-4">
                        <span className="text-neon-cyan text-sm">By {post.author}</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-neon-magenta/20 px-3 py-1 rounded-full text-neon-magenta text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 