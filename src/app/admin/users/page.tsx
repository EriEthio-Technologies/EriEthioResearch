'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { UserRole } from '@/lib/db/types';
import { useUserManagement } from '@/hooks/useUserManagement';
import ErrorBoundary from '@/components/ErrorBoundary';
import { AdminLayout, DataTable } from '@/components/admin';
import { UserRow } from './_components/UserRow';
import { useQuery } from '@tanstack/react-query';
import { Virtuoso } from 'react-virtuoso';
import { UserLoadingSkeleton } from '@/components/LoadingSkeleton';

const UsersManagementWithErrorBoundary = () => (
  <ErrorBoundary fallback={<div className="text-red-500 p-4">Error loading users management</div>}>
    <UsersManagement />
  </ErrorBoundary>
);

export default function UsersManagement() {
  const {
    users,
    loading,
    actionLoading,
    error,
    handleDeleteUser,
    handleUpdateRole
  } = useUserManagement();
  const router = useRouter();

  const { data, fetchNextPage } = useQuery({
    queryKey: ['users'],
    queryFn: async ({ pageParam = 0 }) => {
      const { data } = await supabaseAdmin
        .from('users')
        .select('*')
        .range(pageParam, pageParam + 9);
      return data;
    },
    getNextPageParam: (lastPage, pages) => pages.length * 10
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-neon-cyan text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    throw new Error(error);
  }

  return (
    <AdminLayout 
      title="Users Management"
      actions={
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center space-x-2 px-4 py-2 bg-neon-magenta/20 text-neon-magenta border border-neon-magenta rounded-lg hover:bg-neon-magenta/30 transition-colors"
          onClick={() => router.push('/admin/users/new')}
        >
          <Plus className="w-5 h-5" />
          <span>Add User</span>
        </motion.button>
      }
    >
      <Virtuoso
        useWindowScroll
        data={data?.pages.flat()}
        endReached={() => fetchNextPage()}
        components={{
          LoadingIndicator: () => <UserLoadingSkeleton />
        }}
        itemContent={(index, user) => (
          <UserRow key={user.id} user={user} onDelete={handleDeleteUser} />
        )}
      />
    </AdminLayout>
  );
}