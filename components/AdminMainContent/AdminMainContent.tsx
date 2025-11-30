'use client';

import { useState } from 'react';
import Image from 'next/image';
import DateRange from '@/components/MainContent/DateRange';
import AdminStatsCards from './AdminStatsCards';
import AdminUsersTable from './AdminUsersTable';
import type { AdminUser, AdminStats } from '@/lib/adminService';

interface AdminMainContentProps {
  users: AdminUser[];
  stats: AdminStats;
  loading: boolean;
  onUserDeleted: () => void;
}

export default function AdminMainContent({ 
  users, 
  stats, 
  loading,
  onUserDeleted 
}: AdminMainContentProps) {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());

  return (
    <div className="h-[774px] relative shrink-0 w-[872px]">
      <div className="absolute bg-white box-border content-stretch flex flex-col gap-[10px] h-[732px] items-start left-1/2 px-[75px] py-[42px] rounded-[8px] top-[42px] translate-x-[-50%] w-[872px]">
        <div className="content-stretch flex flex-col gap-[22px] items-start relative shrink-0 w-full">
          {/* Header Section */}
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
            <div className="content-stretch flex h-[113px] items-end justify-between relative shrink-0 w-full">
              <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[92.577px] text-black">
                Dashboard
              </p>
              <div className="relative shrink-0 size-[87px]">
                <Image
                  src="/pixelarticons_notes-multiple.svg"
                  alt="Dashboard"
                  width={87}
                  height={87}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Date Range Section */}
            <DateRange
              fromDate={fromDate}
              toDate={toDate}
              onFromDateChange={setFromDate}
              onToDateChange={setToDate}
            />
          </div>

          {/* Stats Cards */}
          <AdminStatsCards stats={stats} loading={loading} />

          {/* Users Table */}
          <AdminUsersTable 
            users={users} 
            loading={loading}
            onUserDeleted={onUserDeleted}
          />
        </div>
      </div>
    </div>
  );
}

