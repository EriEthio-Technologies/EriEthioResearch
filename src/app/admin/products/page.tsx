'use client';

import { AdminLayout, DataTable } from '@/components/admin';
import { useAdminResource } from '@/hooks/useAdminResource';
import { supabaseAdmin } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ProductRow from './_components/ProductRow';

export default function ProductsManagement() {
  const router = useRouter();
  const {
    data: products,
    loading,
    actionLoading,
    handleDelete
  } = useAdminResource(supabaseAdmin, 'products');

  return (
    <AdminLayout
      title="Products Management"
      actions={
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center space-x-2 px-4 py-2 bg-neon-magenta/20 text-neon-magenta border border-neon-magenta rounded-lg hover:bg-neon-magenta/30 transition-colors"
          onClick={() => router.push('/admin/products/new')}
        >
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </motion.button>
      }
    >
      <DataTable headers={['Product', 'Price', 'Status', 'Created', 'Actions']}>
        {products.map((product) => (
          <ProductRow
            key={product.id}
            product={product}
            onDelete={() => handleDelete(product.id, `Product ${product.title} deleted`)}
            actionLoading={actionLoading}
          />
        ))}
      </DataTable>
    </AdminLayout>
  );
} 