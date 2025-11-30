'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';

const ADMIN_EMAIL = 'asereopeyemimichael@gmail.com';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      // Not logged in, redirect to admin login
      router.push('/admin/login');
      return;
    }

    if (user.email !== ADMIN_EMAIL) {
      // Not admin, redirect to home
      router.push('/');
      return;
    }

    // User is admin
    setIsAuthorized(true);
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f2f2f2]">
        <p className="text-black">Loading...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

