'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '@/components/ProductForm';
import { supabase } from '@/lib/supabase/client';

interface NewProductForm {
  name: string;
  description: string;
  price: number;
  sku: string;
  stock: number;
}

export default function NewProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: NewProductForm) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('products')
        .insert([formData]);

      if (error) throw error;

      // Log activity
      await supabase.from('admin_activity').insert({
        type: 'product_created',
        description: `New product "${formData.name}" was created`,
      });

      router.push('/admin/products');
    } catch (error) {
      console.error('Error creating product:', error);
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
            onClick={() => router.push('/admin/products')}
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
            New Product
          </motion.h1>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/30 backdrop-blur-sm p-8 rounded-lg border border-neon-cyan/20"
      >
        <ProductForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </motion.div>
    </div>
  );
} 