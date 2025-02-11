'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { LayoutDashboard, BookOpen, Flask, Package } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const navItems = [
    { href: '/products', label: 'Products', icon: Package },
    { href: '/research', label: 'Research', icon: Flask },
    { href: '/blog', label: 'Blog', icon: BookOpen },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 z-50 w-full bg-black/80 backdrop-blur-lg border-t-2 border-neon-cyan crt-effect"
    >
      <div className="flex justify-around py-3 px-4 max-w-screen-xl mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300",
                isActive(item.href) 
                  ? "text-neon-cyan" 
                  : "text-neon-magenta hover:text-neon-cyan"
              )}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="h-5 w-5" />
              </motion.div>
              <motion.span
                className="text-xs font-medium"
                whileHover={{ y: -2 }}
              >
                {item.label}
              </motion.span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
} 