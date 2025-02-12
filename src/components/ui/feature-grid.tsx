'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface FeatureGridProps {
  title?: string;
  items: Feature[];
  columns?: number;
  gap?: 'sm' | 'md' | 'lg';
  padding?: 'sm' | 'md' | 'lg';
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

const gapSizes = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8'
};

const paddingSizes = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
};

export function FeatureGrid({
  title,
  items,
  columns = 4,
  gap = 'lg',
  padding = 'lg'
}: FeatureGridProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} ${gapSizes[gap]} px-4 max-w-7xl mx-auto mt-16`}
    >
      {title && (
        <motion.h2
          className="text-3xl font-bold text-neon-cyan mb-8 col-span-full text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {title}
        </motion.h2>
      )}

      {items.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <motion.div
            key={index}
            variants={item}
            className={`flex flex-col items-center ${paddingSizes[padding]} bg-black/50 backdrop-blur-sm rounded-lg border border-neon-cyan/20 hover:border-neon-cyan/50 transition-colors`}
          >
            <div className="p-3 rounded-full bg-neon-cyan/20 mb-4">
              <Icon className="w-6 h-6 text-neon-cyan" />
            </div>
            <h3 className="text-xl font-semibold text-neon-cyan mb-2">{feature.title}</h3>
            <p className="text-gray-400 text-center">{feature.description}</p>
          </motion.div>
        );
      })}
    </motion.div>
  );
} 