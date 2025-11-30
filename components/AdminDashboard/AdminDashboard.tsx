'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import AdminStatsCards from './AdminStatsCards';
import AdminUsersTable from './AdminUsersTable';
import DateRange from '@/components/MainContent/DateRange';
import { getAllUsers, getAdminStats, type AdminUser, type AdminStats } from '@/lib/adminService';

export default function AdminDashboard() {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setLoading(true);
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

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user and all their records? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      // Refresh data
      const [usersData, statsData] = await Promise.all([
        getAllUsers(),
        getAdminStats(),
      ]);
      setUsers(usersData);
      setStats(statsData);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="h-[774px] relative shrink-0 w-[872px] flex items-center justify-center">
        <p className="text-black">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="h-[774px] relative shrink-0 w-[872px]">
      <div className="absolute bg-white h-[732px] left-1/2 rounded-[8px] top-[42px] translate-x-[-50%] w-[872px]">
        <div className="absolute h-[650px] left-[75px] top-[42px] w-[722px]">
          {/* Header Section */}
          <div className="absolute h-[143px] left-0 top-0 w-[722px]">
            <div className="absolute content-stretch flex h-[113px] items-end justify-between left-0 top-0 w-[722px]">
              <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[92.577px] text-black">
                Dashboard
              </p>
              <div className="relative shrink-0 size-[87px]">
                <Image
                  src="/pixelarticons_dashbaord.svg"
                  alt="Dashboard"
                  width={87}
                  height={87}
                  className="object-contain"
                />
              </div>
            </div>
            {/* Date Range */}
            <div className="absolute content-stretch flex gap-[9px] items-center left-0 top-[117px]">
              <DateRange
                fromDate={fromDate}
                toDate={toDate}
                onFromDateChange={setFromDate}
                onToDateChange={setToDate}
              />
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <AdminStatsCards
              totalUsers={stats.totalUsers}
              totalRecords={stats.totalRecords}
              averageBloodPressure={stats.averageBloodPressure}
            />
          )}

          {/* Users Table */}
          <div className="absolute h-[181px] left-[83px] top-[407px] w-[722px]">
            <AdminUsersTable
              users={users}
              onDeleteUser={handleDeleteUser}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

