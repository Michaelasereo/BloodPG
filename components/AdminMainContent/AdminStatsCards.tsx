'use client';

import type { AdminStats } from '@/lib/adminService';

interface AdminStatsCardsProps {
  stats: AdminStats;
  loading: boolean;
}

export default function AdminStatsCards({ stats, loading }: AdminStatsCardsProps) {
  if (loading) {
    return (
      <div className="content-stretch flex gap-[18px] items-start relative shrink-0 w-full">
        <div className="bg-[#f4f4f4] h-[139px] rounded-[8px] w-[234px] flex items-center justify-center">
          <p className="text-[#757575]">Loading...</p>
        </div>
        <div className="bg-[#f4f4f4] h-[139px] rounded-[8px] w-[234px] flex items-center justify-center">
          <p className="text-[#757575]">Loading...</p>
        </div>
        <div className="bg-[#f4f4f4] h-[139px] rounded-[8px] w-[234px] flex items-center justify-center">
          <p className="text-[#757575]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-stretch flex gap-[18px] items-start relative shrink-0 w-full">
      {/* Total Users Card */}
      <div className="bg-[#f4f4f4] h-[139px] rounded-[8px] relative w-[234px]">
        <div className="absolute left-[18px] top-[9px]">
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-black tracking-[0.16px]">
            Total Users
          </p>
        </div>
        <div className="absolute left-[18px] top-[88px]">
          <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[29px] text-black tracking-[0.29px]">
            {stats.totalUsers}
          </p>
        </div>
      </div>

      {/* Total Records Card */}
      <div className="bg-[#f4f4f4] h-[139px] rounded-[8px] relative w-[234px]">
        <div className="absolute left-[18px] top-[9px]">
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-black tracking-[0.16px]">
            Total Record count
          </p>
        </div>
        <div className="absolute left-[18px] top-[88px]">
          <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[29px] text-black tracking-[0.29px]">
            {stats.totalRecords}
          </p>
        </div>
      </div>

      {/* Average Blood Pressure Card */}
      <div className="bg-[#f4f4f4] h-[139px] rounded-[8px] relative w-[234px]">
        <div className="absolute left-[18px] top-[9px]">
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-black tracking-[0.16px] w-[110px] whitespace-pre-wrap">
            Average Blood Pressure
          </p>
        </div>
        <div className="absolute left-[18px] top-[88px]">
          <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[24px] text-black tracking-[0.24px]">
            {stats.averageSystolic}/{stats.averageDiastolic} mmHg
          </p>
        </div>
      </div>
    </div>
  );
}

