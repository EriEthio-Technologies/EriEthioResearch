'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useInfiniteQuery, QueryFunctionContext } from '@tanstack/react-query';
import { Virtuoso } from 'react-virtuoso';
import { SupabaseClient } from '@/lib/supabase';
import ErrorBoundary from '@/components/ErrorBoundary';
import { AdminLayout } from '@/components/admin';
import { UserRow } from './_components/UserRow';
import { UserLoadingSkeleton } from '@/components/LoadingSkeleton';

interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER';
  created_at: string;
}

const UsersFetcher = () => {
  const { data, fetchNextPage } = useInfiniteQuery<User[]>({
    queryKey: ['users'],
    queryFn: async ({ pageParam = 0 }: QueryFunctionContext) => {
      const supabaseAdmin = SupabaseClient.getAdminInstance();
      
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .range(pageParam, pageParam + 9)
        .order('created_at', { ascending: false });

      if (error) throw new Error(`Supabase error: ${error.message}`);
      return data || [];
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => 
      lastPage.length ? allPages.length * 10 : undefined,
  });

  return (
    <Virtuoso
      useWindowScroll
      data={data?.pages.flat() as User[]}
      endReached={() => fetchNextPage()}
      components={{
        Footer: () => <UserLoadingSkeleton />
      }}
      itemContent={(index, user: User) => (
        <UserRow key={user.id} user={user} />
      )}
    />
  );
};

function UsersManagement() {
  const router = useRouter();

  return (
    <AdminLayout 
      title="User Management"
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
      <ErrorBoundary fallback={<div className="text-red-500 p-4">Error loading users</div>}>
        <UsersFetcher />
      </ErrorBoundary>
    </AdminLayout>
  );
}

export default UsersManagement;