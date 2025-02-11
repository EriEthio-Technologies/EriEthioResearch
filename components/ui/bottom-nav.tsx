'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { LayoutDashboard, BookOpen, Beaker, Package } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();

  const links = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/research',
      label: 'Research',
      icon: BookOpen,
    },
    {
      href: '/products',
      label: 'Products',
      icon: Package,
    },
    {
      href: '/blog',
      label: 'Blog',
      icon: Beaker,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background px-4 backdrop-blur-lg md:hidden">
      {links.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-col items-center justify-center space-y-1',
              isActive ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: isActive ? 1.2 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <Icon className="h-5 w-5" />
            </motion.div>
            <span className="text-xs font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
} 