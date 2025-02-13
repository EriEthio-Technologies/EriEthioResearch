'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Package, 
  BookOpen, 
  Users, 
  BarChart, 
  Settings,
  Menu,
  X,
  Home,
  FileText,
  BookOpenCheck
} from 'lucide-react';

const sidebarItems = [
  { 
    title: 'Overview', 
    icon: Home, 
    href: '/admin',
  },
  { 
    title: 'Publications', 
    icon: FileText, 
    href: '/admin/publications',
  },
  { 
    title: 'Research', 
    icon: BookOpenCheck, 
    href: '/admin/research',
  },
  { 
    title: 'Users', 
    icon: Users, 
    href: '/admin/users',
  },
  { 
    title: 'Analytics', 
    icon: BarChart, 
    href: '/admin/analytics',
  },
  { 
    title: 'Settings', 
    icon: Settings, 
    href: '/admin/settings',
  },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 lg:hidden text-gray-600 hover:text-gray-900 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Admin Panel</h1>
          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 rounded-lg p-3 transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-900'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
} 