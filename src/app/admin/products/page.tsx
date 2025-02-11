'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { iconMap } from '@/lib/icons';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Product {
  id: string;
  title: string;
  price: number;
  status: string;
  icon: keyof typeof iconMap;
  created_at: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  async function handleDeleteProduct(id: string) {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProducts(products.filter(product => product.id !== id));

      // Log activity
      await supabase.from('admin_activity').insert({
        type: 'product_deleted',
        description: `Product ${id} was deleted`,
      });
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-neon-cyan text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <motion.h1 
          className="text-4xl font-bold text-neon-cyan"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Products Management
        </motion.h1>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center space-x-2 px-4 py-2 bg-neon-magenta/20 text-neon-magenta border border-neon-magenta rounded-lg hover:bg-neon-magenta/30 transition-colors"
          onClick={() => router.push('/admin/products/new')}
        >
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </motion.button>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="bg-black/30 backdrop-blur-sm rounded-lg border border-neon-cyan/20 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neon-cyan/20">
                <th className="px-6 py-4 text-left text-neon-magenta">Product</th>
                <th className="px-6 py-4 text-left text-neon-magenta">Price</th>
                <th className="px-6 py-4 text-left text-neon-magenta">Status</th>
                <th className="px-6 py-4 text-left text-neon-magenta">Created</th>
                <th className="px-6 py-4 text-right text-neon-magenta">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const Icon = iconMap[product.icon];
                return (
                  <motion.tr
                    key={product.id}
                    variants={item}
                    className="border-b border-neon-cyan/10 hover:bg-black/20"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-full bg-neon-magenta/20">
                          <Icon className="w-5 h-5 text-neon-magenta" />
                        </div>
                        <span className="text-gray-300">{product.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-neon-cyan">${product.price}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-sm rounded-full bg-neon-cyan/20 text-neon-cyan">
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {new Date(product.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-3">
                        <button
                          onClick={() => router.push(`/products/${product.id}`)}
                          className="p-2 text-gray-400 hover:text-neon-cyan transition-colors"
                          title="View"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                          className="p-2 text-gray-400 hover:text-neon-magenta transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
} 