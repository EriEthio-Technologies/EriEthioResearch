'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { can } from '@/lib/rbac';
import { ArrowLeft, Check, Info, Star } from 'lucide-react';
import { iconMap } from '@/lib/icons';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ProductDetail {
  id: string;
  title: string;
  description: string;
  price: number;
  features: string[];
  specifications: Record<string, string>;
  benefits: string[];
  icon: keyof typeof iconMap;
  status: string;
}

export default function ProductDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchProduct() {
      if (session?.user) {
        try {
          if (!can(session, 'read', 'products')) {
            router.push('/dashboard');
            return;
          }

          const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', params.id)
            .single();

          if (error) throw error;

          if (data) {
            setProduct(data);
          }
        } catch (error) {
          console.error('Error fetching product:', error);
          router.push('/products');
        } finally {
          setLoading(false);
        }
      }
    }

    fetchProduct();
  }, [session, router, params.id]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="text-neon-cyan text-xl">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="text-red-500">Product not found</div>
      </div>
    );
  }

  const Icon = iconMap[product.icon];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center text-neon-magenta mb-8 hover:text-neon-magenta/80 transition-colors"
          onClick={() => router.push('/products')}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Products
        </motion.button>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-black/30 backdrop-blur-sm p-8 rounded-lg border border-neon-cyan/20"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 rounded-full bg-neon-magenta/20">
                <Icon className="w-8 h-8 text-neon-magenta" />
              </div>
              <span className="px-4 py-2 bg-neon-cyan/20 text-neon-cyan rounded-full">
                ${product.price}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-neon-cyan mb-4">{product.title}</h1>
            <p className="text-gray-300 mb-6">{product.description}</p>
            
            <h2 className="text-xl font-semibold text-neon-magenta mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2" />
              Key Features
            </h2>
            <ul className="space-y-3 mb-6">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-neon-cyan mr-2 flex-shrink-0 mt-1" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            <button 
              className="w-full py-3 bg-neon-magenta/20 text-neon-magenta border border-neon-magenta rounded-lg hover:bg-neon-magenta/30 transition-colors"
              onClick={() => router.push('/contact')}
            >
              Request Demo
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-neon-cyan/20">
              <h2 className="text-xl font-semibold text-neon-magenta mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2" />
                Specifications
              </h2>
              <dl className="space-y-3">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <dt className="text-gray-400">{key}</dt>
                    <dd className="text-neon-cyan">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {product.benefits && (
              <div className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-neon-cyan/20">
                <h2 className="text-xl font-semibold text-neon-magenta mb-4">Benefits</h2>
                <ul className="space-y-3">
                  {product.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-neon-cyan mr-2 flex-shrink-0 mt-1" />
                      <span className="text-gray-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
} 