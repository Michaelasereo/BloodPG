'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header/Header';
import ThemeToggle from '@/components/Sidebar/ThemeToggle';
import AdminSidebar from '@/components/AdminSidebar/AdminSidebar';
import AdminMainContent from '@/components/AdminMainContent/AdminMainContent';
import AdminGuard from '@/components/AdminGuard/AdminGuard';
import { clearAllData } from '@/lib/clearAllData';
import type { AdminUser, AdminStats } from '@/lib/adminService';

export default function AdminDashboard() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalRecords: 0,
    averageSystolic: 0,
    averageDiastolic: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setLoading(true);
        const { getAllUsers, getAdminStats } = await import('@/lib/adminService');
        const [usersData, statsData] = await Promise.all([
          getAllUsers(),
          getAdminStats(),
        ]);
        setUsers(usersData);
        setStats(statsData);
      } catch (error) {
        console.error('Error loading admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

  const handleUserDeleted = async () => {
    // Reload data after user deletion
    const { getAllUsers, getAdminStats } = await import('@/lib/adminService');
    const [usersData, statsData] = await Promise.all([
      getAllUsers(),
      getAdminStats(),
    ]);
    setUsers(usersData);
    setStats(statsData);
  };

  const handleClearAllData = async () => {
    if (!confirm('⚠️ Are you sure you want to clear ALL data? This will delete:\n- All blood pressure records\n- All medications\n- All localStorage data\n\nThis action cannot be undone!')) {
      return;
    }

    try {
      await clearAllData();
      // Data will be cleared and page will reload automatically
    } catch (error) {
      console.error('Error clearing data:', error);
      alert('Failed to clear data. Please try again.');
    }
  };

  return (
    <AdminGuard>
      <div className="bg-[#f2f2f2] relative size-full min-h-screen">
        <Header />
        <div className="flex gap-[15px] items-start w-full px-[30px] py-[20px]">
          <div className="flex gap-[15px] items-start">
            <ThemeToggle />
            <AdminSidebar onClearData={handleClearAllData} />
          </div>
          <AdminMainContent 
            users={users}
            stats={stats}
            loading={loading}
            onUserDeleted={handleUserDeleted}
          />
        </div>
      </div>
    </AdminGuard>
  );
}
