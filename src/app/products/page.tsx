'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { Search, Filter, Tag, ArrowRight } from 'lucide-react';
import { useAdminResource } from '@supabase/supabase-js';
import { Virtuoso } from 'react-virtuoso';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Product {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  tags: string[];
  category: string;
}

const ProductsList = () => {
  const { data: products } = useAdminResource<Product>(
    supabase,
    'products'
  );
  
  return (
    <Virtuoso
      data={products}
      itemContent={(index, product) => (
        <ProductRow key={product.id} product={product} />
      )}
    />
  );
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, selectedTags, products]);

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) throw error;

      setProducts(data || []);
      
      // Extract unique tags and categories
      const tags = new Set<string>();
      const cats = new Set<string>();
      data?.forEach((product: Product) => {
        product.tags?.forEach((tag: string) => tags.add(tag));
        if (product.category) cats.add(product.category);
      });
      
      setAllTags(Array.from(tags));
      setCategories(Array.from(cats));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }

  function filterProducts() {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(product =>
        selectedTags.every(tag => product.tags.includes(tag))
      );
    }

    setFilteredProducts(filtered);
  }

  function toggleTag(tag: string) {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="text-neon-cyan text-xl">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 px-4 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-neon-cyan mb-4">Our Products</h1>
          <p className="text-gray-300 text-lg max-w-3xl">
            Discover our cutting-edge research tools and solutions designed to accelerate your scientific discoveries.
          </p>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-black/30 backdrop-blur-sm border border-neon-cyan/20 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-neon-cyan/50"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-black/30 backdrop-blur-sm border border-neon-cyan/20 rounded-lg text-gray-300 appearance-none focus:outline-none focus:border-neon-cyan/50"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tags */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {allTags.map(tag => (
              <motion.button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full flex items-center gap-1 border transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-neon-magenta/20 text-neon-magenta border-neon-magenta'
                    : 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30 hover:bg-neon-cyan/20'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Tag className="w-4 h-4" />
                <span>{tag}</span>
              </motion.button>
            ))}
          </div>
        )}

        {/* Products Grid */}
        <AnimatePresence mode="popLayout">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-black/30 backdrop-blur-sm rounded-lg border border-neon-cyan/20 overflow-hidden hover:border-neon-cyan/50 transition-colors"
                onClick={() => router.push(`/products/${product.id}`)}
              >
                {product.imageUrl && (
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-neon-cyan mb-2 group-hover:text-neon-magenta transition-colors">
                    {product.title}
                  </h2>
                  <p className="text-gray-300 mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  
                  {product.tags && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-sm rounded-full bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30"
                        >
                          {tag}
                        </span>
                      ))}
                      {product.tags.length > 3 && (
                        <span className="px-2 py-1 text-sm rounded-full bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30">
                          +{product.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  
                  <motion.div
                    className="flex items-center text-neon-magenta group-hover:translate-x-2 transition-transform"
                    whileHover={{ x: 5 }}
                  >
                    <span className="mr-2">Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-400 text-lg">
              No products found matching your criteria.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
} 