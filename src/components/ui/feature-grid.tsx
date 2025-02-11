'use client';

import { motion } from 'framer-motion';
import { Beaker, BookOpen, Users, Lightbulb } from 'lucide-react';

const features = [
  {
    icon: Beaker,
    title: 'Research Excellence',
    description: 'Cutting-edge research methodologies and tools'
  },
  {
    icon: BookOpen,
    title: 'Knowledge Hub',
    description: 'Comprehensive database of research papers and findings'
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'Connect with researchers and institutions'
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Transforming research into practical solutions'
  }
];

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

export function FeatureGrid() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 max-w-7xl mx-auto mt-16"
    >
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <motion.div
            key={index}
            variants={item}
            className="flex flex-col items-center p-6 bg-black/50 backdrop-blur-sm rounded-lg border border-neon-cyan/20 hover:border-neon-cyan/50 transition-colors"
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