'use client';

import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center space-y-8"
    >
      <motion.h1 
        className="text-6xl font-bold text-neon-cyan"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        EriEthio Research
      </motion.h1>
      <motion.p 
        className="text-2xl text-neon-magenta"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Advancing Research & Innovation
      </motion.p>
      <motion.div 
        className="flex flex-col md:flex-row gap-4 justify-center mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <button className="px-8 py-3 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-colors">
          Explore Research
        </button>
        <button className="px-8 py-3 bg-neon-magenta/20 text-neon-magenta border border-neon-magenta rounded-lg hover:bg-neon-magenta/30 transition-colors">
          View Projects
        </button>
      </motion.div>
    </motion.div>
  );
} 