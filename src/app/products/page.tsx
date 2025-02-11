'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { can } from '@/lib/rbac';
import { iconMap } from '@/lib/icons';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Product {
  id: string;
  title: string;
  price: number;
  features: string[];
  icon: keyof typeof iconMap;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function ProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchProducts() {
      if (session?.user) {
        try {
          // Check if user has permission to read products
          if (!can(session, 'read', 'products')) {
            router.push('/dashboard');
            return;
          }

          const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('status', 'active')
            .order('price');

          if (error) throw error;

          if (data) {
            setProducts(data);
          }
        } catch (error) {
          console.error('Error fetching products:', error);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchProducts();
  }, [session, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="text-neon-cyan text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl font-bold text-neon-cyan mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Research Products
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Access our suite of research tools and resources
          </motion.p>
          {session?.user?.role === 'admin' && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 px-6 py-2 bg-neon-magenta/20 text-neon-magenta border border-neon-magenta rounded-lg hover:bg-neon-magenta/30 transition-colors"
              onClick={() => router.push('/products/manage')}
            >
              Manage Products
            </motion.button>
          )}
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {products.map((product) => {
            const Icon = iconMap[product.icon];
            return (
              <motion.div
                key={product.id}
                variants={item}
                className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-neon-cyan/20 hover:border-neon-cyan/50 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-full bg-neon-magenta/20">
                    <Icon className="w-6 h-6 text-neon-magenta" />
                  </div>
                  <span className="text-2xl font-bold text-neon-cyan">
                    ${product.price}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-neon-magenta mb-4">{product.title}</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="text-gray-400 flex items-center">
                      <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button 
                  className="mt-6 w-full py-2 px-4 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan rounded hover:bg-neon-cyan/30 transition-colors"
                  onClick={() => router.push(`/products/${product.id}`)}
                >
                  Learn More
                </button>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 p-6 bg-black/30 backdrop-blur-sm rounded-lg border border-neon-cyan/20"
        >
          <h2 className="text-2xl font-bold text-neon-cyan mb-4">Enterprise Solutions</h2>
          <p className="text-gray-300 mb-4">
            Need a custom solution? We offer tailored research tools and services for enterprise clients.
          </p>
          <button 
            className="py-2 px-6 bg-neon-magenta/20 text-neon-magenta border border-neon-magenta rounded hover:bg-neon-magenta/30 transition-colors"
            onClick={() => router.push('/contact')}
          >
            Contact Sales
          </button>
        </motion.div>
      </div>
    </div>
  );
} 