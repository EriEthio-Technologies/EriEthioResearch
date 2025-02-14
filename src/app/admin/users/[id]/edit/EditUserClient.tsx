'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft } from 'lucide-react';
import UserForm from '@/components/UserForm';
import { z } from 'zod';
import { withAdmin } from '@/lib/withAdmin';
import { logSecurityEvent } from '@/lib/audit';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const userSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'editor', 'viewer']),
  password: z.string().min(8).optional()
});

export default withAdmin(['admin'])(function EditUserClient() {
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
      // 2FA check for admin role changes
      if (formData.role === 'admin') {
        const { data: tfa } = await supabase
          .from('user_tfa')
          .select('verified')
          .eq('user_id', session.user.id)
          .single();

        if (!tfa?.verified) {
          throw new Error('2FA required for admin role changes');
        }
      }

      // Audit logging
      await logSecurityEvent('user_update', {
        target_user: params.id,
        changes: Object.keys(formData)
      });

      const validatedData = userSchema.parse(formData);

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: validatedData.full_name,
          role: validatedData.role,
          bio: validatedData.bio,
          avatar_url: validatedData.avatar_url,
          social_links: validatedData.social_links,
          expertise: validatedData.expertise,
          status: validatedData.status,
        })
        .eq('id', params.id);

      if (error) throw error;

      // Log activity
      await supabase.from('admin_activity').insert({
        type: 'user_updated',
        description: `User "${validatedData.full_name}" was updated`,
      });

      // Add audit logging
      await supabase.from('audit_logs').insert({
        action: 'user_update',
        user_id: params.id,
        performed_by: session.user.id
      });

      router.push('/admin/users');
    } catch (error) {
      console.error('Validation error:', error);
      await logSecurityEvent('user_update_failed', {
        error: error.message,
        user_id: params.id
      });
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
}); 