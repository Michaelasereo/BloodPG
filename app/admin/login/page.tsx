'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { signInWithGoogle } from '@/lib/auth';

const ADMIN_EMAIL = 'asereopeyemimichael@gmail.com';

export default function AdminLoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      // Check if user is admin
      if (user.email === ADMIN_EMAIL) {
        router.push('/admin');
      } else {
        // Non-admin user, redirect to home
        router.push('/');
      }
    }
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    try {
      // Pass /admin as the redirect destination
      await signInWithGoogle('/admin');
      // After successful sign-in, the auth callback will redirect to /admin
    } catch (error) {
      console.error('Admin sign-in error:', error);
      alert('Failed to sign in. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f2f2f2]">
        <p className="text-black">Loading...</p>
      </div>
    );
  }

  // If already admin, redirect will happen via useEffect
  if (user && user.email === ADMIN_EMAIL) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f2f2f2]">
      <div className="bg-white rounded-[21px] p-[60px] max-w-[500px] w-full shadow-lg">
        <div className="flex flex-col gap-[30px] items-center">
          <div className="text-center">
            <h1 className="font-['Helvetica_Neue:Medium',sans-serif] text-[32px] text-black mb-2">
              Admin Login
            </h1>
            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[16px] text-[#757575]">
              Sign in with your admin account to access the dashboard
            </p>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="bg-white box-border content-stretch flex gap-[10px] h-[50px] items-center justify-center px-[24px] py-[12px] relative rounded-[20px] shrink-0 w-full border border-[#dadada] border-solid hover:bg-gray-50 transition-colors"
          >
            <div className="relative shrink-0 size-[20px]">
              <svg width="20" height="20" viewBox="0 0 24 24" className="w-full h-full">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </div>
            <div className="content-stretch flex gap-[3px] items-center relative shrink-0">
              <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-black tracking-[-0.14px]">
                Continue with Google
              </p>
            </div>
          </button>

          {user && user.email !== ADMIN_EMAIL && (
            <div className="bg-red-50 border border-red-200 rounded-[8px] p-4 w-full">
              <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[14px] text-red-700 text-center">
                Access denied. Only admin accounts can access this page.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

