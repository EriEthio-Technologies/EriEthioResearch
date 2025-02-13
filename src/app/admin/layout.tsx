'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  BookOpen, 
  Users, 
  BarChart, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { can } from '@/lib/rbac';

const sidebarItems = [
  { 
    title: 'Products', 
    icon: Package, 
    href: '/admin/products',
    permission: { action: 'manage', subject: 'products' }
  },
  { 
    title: 'Research', 
    icon: BookOpen, 
    href: '/admin/research',
    permission: { action: 'manage', subject: 'research' }
  },
  { 
    title: 'Users', 
    icon: Users, 
    href: '/admin/users',
    permission: { action: 'manage', subject: 'users' }
  },
  { 
    title: 'Analytics', 
    icon: BarChart, 
    href: '/admin/analytics',
    permission: { action: 'read', subject: 'analytics' }
  },
  { 
    title: 'Settings', 
    icon: Settings, 
    href: '/admin/settings',
    permission: { action: 'manage', subject: 'settings' }
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (session?.user && session.user.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="text-neon-cyan text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden text-neon-cyan hover:text-neon-cyan/80 transition-colors"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <motion.div
        className={`fixed top-0 left-0 h-full bg-black/30 backdrop-blur-sm border-r border-neon-cyan/20 w-64 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-neon-cyan mb-8">Admin Panel</h1>
          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              if (!can(session, item.permission.action, item.permission.subject)) {
                return null;
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 text-gray-300 hover:text-neon-magenta hover:bg-black/20 rounded-lg p-3 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </motion.div>

      {/* Main content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
} 