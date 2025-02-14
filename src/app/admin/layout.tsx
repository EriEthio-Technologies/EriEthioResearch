'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Sidebar } from '@/components/admin/Sidebar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Session } from 'next-auth';

// Define a custom user type that includes the 'role' property
interface CustomUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string; // Add the role property
}

// Extend the session type to use the custom user type
interface CustomSession extends Session {
  user: CustomUser;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session || session.user.role !== 'admin') {
      router.push('/auth/signin');
    }
  }, [session, router]);

  if (!session) return <LoadingSpinner />;

  return (
    <div className="flex h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
