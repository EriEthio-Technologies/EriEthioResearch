'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const AdminLayout = ({
  title,
  children,
  actions,
  className
}: {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("space-y-8", className)}>
    <div className="flex justify-between items-center">
      <motion.h1 
        className="text-4xl font-bold text-neon-cyan"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {title}
      </motion.h1>
      <div className="flex items-center gap-4">
        {actions}
      </div>
    </div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/30 backdrop-blur-sm rounded-lg border border-neon-cyan/20 overflow-hidden"
    >
      {children}
    </motion.div>
  </div>
); 