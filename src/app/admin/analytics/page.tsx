'use client';

import { motion } from 'framer-motion';
import { BarChart } from 'lucide-react';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <motion.h1 
          className="text-4xl font-bold text-neon-cyan flex items-center space-x-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <BarChart className="w-10 h-10" />
          <span>Analytics Dashboard</span>
        </motion.h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <AnalyticsDashboard />
      </motion.div>
    </div>
  );
} 