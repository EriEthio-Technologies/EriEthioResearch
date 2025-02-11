'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  BookOpen,
  Beaker,
  Package,
  LogOut
} from 'lucide-react';
import { BottomNav } from '@/components/ui/bottom-nav';
import { motion } from 'framer-motion';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Research Hub', href: '/research', icon: Beaker },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Blog', href: '/blog', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-background crt-effect">
      <div className="flex h-screen">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="hidden md:block w-64 bg-black/80 backdrop-blur-lg border-r-2 border-neon-cyan"
        >
          <div className="flex h-full flex-col">
            <div className="flex-1 space-y-1 p-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.name}
                    whileHover={{ x: 5, scale: 1.02 }}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-neon-magenta hover:text-neon-cyan transition-colors"
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
            <div className="p-4 border-t border-neon-cyan/20">
              <Button
                variant="ghost"
                className="w-full justify-start text-neon-magenta hover:text-neon-cyan"
                onClick={() => logout()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main content */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 overflow-y-auto p-8 pb-20"
        >
          {children}
        </motion.main>

        {/* Bottom Navigation (mobile only) */}
        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  );
} 