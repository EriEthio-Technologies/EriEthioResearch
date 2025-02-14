'use client';

import { AdminLayout } from '@/components/admin';
import dynamic from 'next/dynamic';
import ErrorBoundary from '@/components/ErrorBoundary';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';

const ContentManager = dynamic(
  () => import('@/components/admin/ContentManager'),
  { 
    ssr: false,
    loading: () => <LoadingSkeleton rows={5} /> 
  }
);

export default function ContentManagementPage() {
  return (
    <AdminLayout title="Content Management">
      <ErrorBoundary fallback={<div className="text-red-500">Content manager failed to load</div>}>
        <ContentManager />
      </ErrorBoundary>
    </AdminLayout>
  );
} 