'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="text-neon-cyan text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-neon-cyan/20 p-6">
          <h1 className="text-3xl font-bold text-neon-cyan mb-6">
            Welcome, {session?.user?.email}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Dashboard Cards */}
            <div className="bg-black/50 p-6 rounded-lg border border-neon-magenta/20">
              <h2 className="text-xl font-semibold text-neon-magenta mb-4">Research Projects</h2>
              <p className="text-gray-300">View and manage your research projects</p>
            </div>
            
            <div className="bg-black/50 p-6 rounded-lg border border-neon-magenta/20">
              <h2 className="text-xl font-semibold text-neon-magenta mb-4">Publications</h2>
              <p className="text-gray-300">Access your published works and drafts</p>
            </div>
            
            <div className="bg-black/50 p-6 rounded-lg border border-neon-magenta/20">
              <h2 className="text-xl font-semibold text-neon-magenta mb-4">Analytics</h2>
              <p className="text-gray-300">Track research impact and metrics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 