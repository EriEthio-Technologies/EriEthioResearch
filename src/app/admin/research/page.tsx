'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { AdminLayout, DataTable } from '@/components/admin';
import { useAdminResource } from '@/hooks/useAdminResource';
import { supabaseAdmin } from '@/lib/supabase';
import ResearchRow from './_components/ResearchRow';

export default function ResearchManagement() {
  const router = useRouter();
  const {
    data: projects,
    loading,
    actionLoading,
    handleDelete
  } = useAdminResource(supabaseAdmin, 'research_projects');

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
      <DataTable headers={['Project', 'Status', 'Lead', 'Created', 'Actions']}>
        {projects.map((project) => (
          <ResearchRow
            key={project.id}
            project={project}
            onDelete={() => handleDelete(project.id, `Project ${project.title} deleted`)}
            actionLoading={actionLoading}
          />
        ))}
      </DataTable>
    </AdminLayout>
  );
} 