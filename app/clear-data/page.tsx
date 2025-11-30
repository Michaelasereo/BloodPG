'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ClearDataPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear localStorage
    try {
      localStorage.removeItem('bloodpg-records');
      localStorage.removeItem('bloodpg-medications');
      console.log('✅ Cleared localStorage');
    } catch (error) {
      console.error('❌ Error clearing localStorage:', error);
    }

    // Clear Supabase (already done via API, but ensure it's cleared)
    fetch('/api/admin/clear-data', {
      method: 'POST',
    })
      .then(res => res.json())
      .then(data => {
        console.log('✅ Cleared Supabase:', data.message);
        // Redirect to home after clearing
        setTimeout(() => {
          router.push('/');
        }, 1000);
      })
      .catch(err => {
        console.error('❌ Error clearing Supabase:', err);
        // Still redirect even if Supabase clear fails
        setTimeout(() => {
          router.push('/');
        }, 1000);
      });
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f2f2f2]">
      <div className="text-center">
        <p className="text-[18px] text-black mb-4">🧹 Clearing all data...</p>
        <p className="text-[14px] text-[#757575]">This will clear both localStorage and Supabase data.</p>
        <p className="text-[14px] text-[#757575] mt-2">Redirecting to home page...</p>
      </div>
    </div>
  );
}

