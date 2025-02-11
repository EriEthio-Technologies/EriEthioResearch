'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, Tag, Check, Info, Star } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ProductDetail {
  id: string;
  title: string;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  benefits: string[];
  imageUrl?: string;
  tags: string[];
  category: string;
}

export default function ProductDetailPage() {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'benefits'>('overview');
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

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
      router.push('/products');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="text-neon-cyan text-xl">Loading product details...</div>
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 px-4 py-16">
      <div className="max-w-7xl mx-auto">
        <motion.button
          onClick={() => router.push('/products')}
          className="flex items-center text-neon-magenta mb-8 hover:text-neon-magenta/80 transition-colors"
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Products
        </motion.button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {product.imageUrl && (
              <motion.div 
                className="w-full aspect-video rounded-lg overflow-hidden bg-black/30 border border-neon-cyan/20"
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}

            <div className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-neon-cyan/20">
              <h1 className="text-3xl font-bold text-neon-cyan mb-4">{product.title}</h1>
              <p className="text-gray-300 mb-6">{product.description}</p>
              
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <motion.span
                      key={index}
                      className="px-3 py-1 rounded-full flex items-center gap-1 bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Tag className="w-4 h-4" />
                      <span>{tag}</span>
                    </motion.span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Tabs */}
            <div className="flex space-x-4 border-b border-neon-cyan/20">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 -mb-px text-lg font-medium transition-colors ${
                  activeTab === 'overview'
                    ? 'text-neon-cyan border-b-2 border-neon-cyan'
                    : 'text-gray-400 hover:text-neon-cyan'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`px-4 py-2 -mb-px text-lg font-medium transition-colors ${
                  activeTab === 'specs'
                    ? 'text-neon-cyan border-b-2 border-neon-cyan'
                    : 'text-gray-400 hover:text-neon-cyan'
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab('benefits')}
                className={`px-4 py-2 -mb-px text-lg font-medium transition-colors ${
                  activeTab === 'benefits'
                    ? 'text-neon-cyan border-b-2 border-neon-cyan'
                    : 'text-gray-400 hover:text-neon-cyan'
                }`}
              >
                Benefits
              </button>
            </div>

            {/* Tab Content */}
            <div className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-neon-cyan/20">
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h2 className="text-xl font-semibold text-neon-magenta flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Key Features
                  </h2>
                  <ul className="space-y-3">
                    {product.features.map((feature, index) => (
                      <motion.li
                        key={index}
                        className="flex items-start gap-3 text-gray-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Check className="w-5 h-5 text-neon-cyan flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {activeTab === 'specs' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-xl font-semibold text-neon-magenta flex items-center gap-2 mb-4">
                    <Info className="w-5 h-5" />
                    Technical Specifications
                  </h2>
                  <dl className="space-y-3">
                    {Object.entries(product.specifications).map(([key, value], index) => (
                      <motion.div
                        key={key}
                        className="flex justify-between"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <dt className="text-gray-400">{key}</dt>
                        <dd className="text-neon-cyan">{value}</dd>
                      </motion.div>
                    ))}
                  </dl>
                </motion.div>
              )}

              {activeTab === 'benefits' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-xl font-semibold text-neon-magenta flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5" />
                    Benefits
                  </h2>
                  <ul className="space-y-3">
                    {product.benefits.map((benefit, index) => (
                      <motion.li
                        key={index}
                        className="flex items-start gap-3 text-gray-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Check className="w-5 h-5 text-neon-cyan flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>

            {/* Call to Action */}
            <motion.div
              className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-neon-cyan/20 text-center"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-xl font-semibold text-neon-cyan mb-4">Ready to Get Started?</h3>
              <p className="text-gray-300 mb-6">
                Contact our team to learn more about how {product.title} can help your research.
              </p>
              <motion.button
                onClick={() => router.push('/contact')}
                className="px-8 py-3 bg-neon-magenta/20 text-neon-magenta border border-neon-magenta rounded-lg hover:bg-neon-magenta/30 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Sales
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 