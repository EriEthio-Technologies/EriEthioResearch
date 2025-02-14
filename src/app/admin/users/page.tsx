'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { UserRole } from '@/lib/db/types';
import { useUserManagement } from '@/hooks/useUserManagement';
import  ErrorBoundary  from '@/components/ErrorBoundary';
import { AdminLayout, DataTable } from '@/components/admin';
import { UserRow } from './_components/UserRow';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { Virtuoso } from 'react-virtuoso';
import { UserLoadingSkeleton } from '@/components/LoadingSkeleton';
import { SupabaseClient } from '@/lib/supabase';
import type { QueryFunctionContext } from '@tanstack/react-query';

interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

const UserContent = ({ users }: { users: User[] }) => (
  <div className="space-y-4">
    {users.map(user => (
      <UserRow key={user.id} user={user} />
    ))}
  </div>
);

const UsersManagementWithErrorBoundary = () => (
  <ErrorBoundary fallback={<div className="text-red-500 p-4">Error loading users management</div>}>
    <UsersManagement />
  </ErrorBoundary>
);

const UsersManagementList = () => {
  const { data, fetchNextPage } = useInfiniteQuery<User[]>({
    queryKey: ['users'],
     queryFn: async ({ pageParam }: { pageParam: number }) => { 
        const supabaseAdmin = SupabaseClient.getAdminInstance();
        const { data } = await supabaseAdmin.from('users')
          .select('*')
          .range(pageParam, pageParam + 9);
      return data || [];
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return allPages.length * 10;
    }
  });

  return (
    <Virtuoso
      data={data?.pages.flat()}
      itemContent={(index, user) => (
        <UserRow key={user.id} user={user} />
      )}
    />
  );
};

const UsersFetcher = () => {
  const { data, fetchNextPage } = useInfiniteQuery<User[]>({
    queryKey: ['users'],
    queryFn: async ({ pageParam = 0 }) => {
      const supabaseAdmin = SupabaseClient.getAdminInstance();
      
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .range(pageParam, pageParam + 9)
        .order('created_at', { ascending: false });

      if (error) throw new Error(`Supabase error: ${error.message}`);
      return data as User[];
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => 
      lastPage.length ? allPages.length * 10 : undefined,
  });

  return (
    <Virtuoso
      useWindowScroll
      data={data?.pages.flat()}
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
  const { loading, error } = useUserManagement();
  const router = useRouter();

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