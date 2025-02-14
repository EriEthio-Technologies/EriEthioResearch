'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { AdminLayout, DataTable } from '@/components/admin';
import { useAdminResource } from '@/hooks/useAdminResource';
import { supabaseAdmin } from '@/lib/supabase';
import ResearchRow from './_components/ResearchRow';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Virtuoso } from 'react-virtuoso';

export default function ResearchManagement() {
  const router = useRouter();
  const {
    data: projects,
    loading,
    actionLoading,
    handleDelete
  } = useAdminResource(supabaseAdmin, 'research_projects');

  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: ['research'],
    queryFn: async ({ pageParam = 0 }) => {
      const { data, error } = await supabaseAdmin
        .from('research')
        .select('*')
        .range(pageParam, pageParam + 9);
      return data;
    },
    getNextPageParam: (lastPage, pages) => pages.length * 10
  });

  return (
    <AdminLayout
      title="Research Management"
      actions={
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center space-x-2 px-4 py-2 bg-neon-magenta/20 text-neon-magenta border border-neon-magenta rounded-lg hover:bg-neon-magenta/30 transition-colors"
          onClick={() => router.push('/admin/research/new')}
        >
          <Plus className="w-5 h-5" />
          <span>Add Project</span>
        </motion.button>
      }
    >
      <Virtuoso
        useWindowScroll
        data={data?.pages.flat()}
        endReached={() => fetchNextPage()}
        itemContent={(index, project) => (
          <ResearchRow key={project.id} project={project} />
        )}
      />
    </AdminLayout>
  );
} 