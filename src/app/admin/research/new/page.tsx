'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft } from 'lucide-react';
import ResearchProjectForm from '@/components/ResearchProjectForm';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function NewResearchProject() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: any) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('research_projects')
        .insert([formData]);

      if (error) throw error;

      // Log activity
      await supabase.from('admin_activity').insert({
        type: 'project_created',
        description: `New research project "${formData.title}" was created`,
      });

      router.push('/admin/research');
    } catch (error) {
      console.error('Error creating research project:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={() => router.push('/admin/research')}
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
            New Research Project
          </motion.h1>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/30 backdrop-blur-sm p-8 rounded-lg border border-neon-cyan/20"
      >
        <ResearchProjectForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          mode="create"
        />
      </motion.div>
    </div>
  );
} 