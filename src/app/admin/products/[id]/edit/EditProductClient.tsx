'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '@/components/ProductForm';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sku: string;
  stock: number;
  images: Array<{
    url: string;
    alt: string;
  }>;
}

export default function EditProductClient() {
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        router.push('/admin/products');
      } finally {
        setIsFetching(false);
      }
    }

    fetchProduct();
  }, [params.id, router]);

  const handleSubmit = async (formData: Product) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: formData.name,
          description: formData.description,
          price: formData.price,
          category: formData.category,
          status: formData.status,
          image_url: formData.image_url,
          tags: formData.tags,
          specifications: formData.specifications,
        })
        .eq('id', params.id);

      if (error) throw error;

      // Log activity
      await supabase.from('admin_activity').insert({
        type: 'product_updated',
        description: `Product "${formData.name}" was updated`,
      });

      router.push('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-neon-cyan text-xl">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-red-500">Product not found</div>
      </div>
    );
  }

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
            Edit Product
          </motion.h1>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/30 backdrop-blur-sm p-8 rounded-lg border border-neon-cyan/20"
      >
        <ProductForm
          initialData={product}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          mode="edit"
        />
      </motion.div>
    </div>
  );
} 