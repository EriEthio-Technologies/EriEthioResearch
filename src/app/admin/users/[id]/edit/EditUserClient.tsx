'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft } from 'lucide-react';
import UserForm from '@/components/UserForm';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function EditUserClient() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
        router.push('/admin/users');
      } finally {
        setIsFetching(false);
      }
    }

    fetchUser();
  }, [params.id, router]);

  const handleSubmit = async (formData: any) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          role: formData.role,
          bio: formData.bio,
          avatar_url: formData.avatar_url,
          social_links: formData.social_links,
          expertise: formData.expertise,
          status: formData.status,
        })
        .eq('id', params.id);

      if (error) throw error;

      // Log activity
      await supabase.from('admin_activity').insert({
        type: 'user_updated',
        description: `User "${formData.full_name}" was updated`,
      });

      router.push('/admin/users');
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-neon-cyan text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-red-500">User not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={() => router.push('/admin/users')}
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
            Edit User
          </motion.h1>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/30 backdrop-blur-sm p-8 rounded-lg border border-neon-cyan/20"
      >
        <UserForm
          initialData={user}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          mode="edit"
        />
      </motion.div>
    </div>
  );
} 