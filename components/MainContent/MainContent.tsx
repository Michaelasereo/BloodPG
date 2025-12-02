'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import DateRange from './DateRange';
import TrendsChart from './TrendsChart';
import BloodPressureLogTable from './BloodPressureLogTable';
import SignInModal from '@/components/SignInModal/SignInModal';
import { useAuth } from '@/lib/authContext';
import type { MainTab, BloodPressureRecord } from '@/types';

interface MainContentProps {
  activeMainTab?: MainTab;
  allRecords: BloodPressureRecord[];
  recordsLoaded: boolean;
}

export default function MainContent({ activeMainTab = 'blood-pressure', allRecords, recordsLoaded }: MainContentProps) {
  const { user, signOut, signIn } = useAuth();
  // Set initial dates to show a wider range (last 30 days to today)
  // This ensures saved records are visible by default
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  const [fromDate, setFromDate] = useState(thirtyDaysAgo);
  const [toDate, setToDate] = useState(today);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserMenu && !(event.target as HTMLElement).closest('[data-node-id="37:2269"]')) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const filteredRecords = useMemo(() => {
    const filtered = allRecords.filter(record => {
      const recordDate = new Date(record.date);
      const from = new Date(fromDate);
      const to = new Date(toDate);

      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      recordDate.setHours(0, 0, 0, 0);

      return recordDate >= from && recordDate <= to;
    });
    console.log('🔍 Filtered records:', filtered.length, 'from', allRecords.length, 'total');
    return filtered;
  }, [allRecords, fromDate, toDate]);

  // Close modal when user signs in
  useEffect(() => {
    if (user && showSignInModal) {
      setShowSignInModal(false);
    }
  }, [user, showSignInModal]);

  // Auto-adjust date range when new records are saved
  useEffect(() => {
    if (allRecords.length === 0) return;

    const handleRecordSaved = () => {
      // Find the most recent record date
      const mostRecentDate = allRecords.reduce((latest, record) => {
        const recordDate = new Date(record.date);
        return recordDate > latest ? recordDate : latest;
      }, new Date(0));

      // Check if the most recent date is outside the current range
      const from = new Date(fromDate);
      const to = new Date(toDate);
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      mostRecentDate.setHours(0, 0, 0, 0);

      // If the most recent record is outside the range, adjust the range
      if (mostRecentDate < from || mostRecentDate > to) {
        // Expand range to include the new record (show last 30 days from most recent date)
        const newToDate = new Date(mostRecentDate);
        const newFromDate = new Date(mostRecentDate);
        newFromDate.setDate(newFromDate.getDate() - 30);
        
        setFromDate(newFromDate);
        setToDate(newToDate);
        console.log('📅 Auto-adjusted date range to include new record:', newFromDate, 'to', newToDate);
      }
    };

    window.addEventListener('bloodpg:record-saved', handleRecordSaved);
    return () => {
      window.removeEventListener('bloodpg:record-saved', handleRecordSaved);
    };
  }, [allRecords, fromDate, toDate]);

  return (
    <>
      <SignInModal isOpen={showSignInModal} onClose={() => setShowSignInModal(false)} />
      <div className="h-[774px] relative shrink-0 w-[872px]" data-node-id="15:1090">
      {/* User Profile / Sign In Section - Top Right */}
      <div className="absolute flex gap-[6px] items-center right-0 top-0" data-node-id="37:2320">
        {user ? (
          // Authenticated: Show User Profile
          <>
            <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid justify-items-start leading-[0] relative shrink-0 flex-shrink-0" data-node-id="37:2260">
              <div className="bg-[#d9d9d9] box-border col-[1] content-stretch flex gap-[7.5px] items-center justify-center ml-0 mt-0 p-0 relative rounded-full row-[1] size-[24px] overflow-hidden" data-node-id="37:2261">
                {user?.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt={user?.name || 'User'}
                    width={24}
                    height={24}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid justify-items-start leading-[0] relative shrink-0" data-node-id="37:2262">
                    <div className="col-[1] ml-0 mt-0 relative row-[1] size-[18px]" data-name="solar:user-bold" data-node-id="37:2263">
                      <Image
                        src="/solar_user-bold.svg"
                        alt="User"
                        width={18}
                        height={18}
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-[9px] items-center relative min-w-0" data-node-id="37:2266">
              <div className="flex flex-col gap-[1.791px] items-start relative min-w-0 max-w-[200px]" data-node-id="37:2267">
                <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic text-[16px] text-black truncate" data-node-id="37:2268">
                  {user?.name || user?.email || 'User'}
                </p>
              </div>
              <div className="relative shrink-0 size-[24px] flex-shrink-0" data-name="solar:menu-dots-bold" data-node-id="37:2269">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="cursor-pointer"
                >
                  <Image
                    src="/menu icon.svg"
                    alt="Menu"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-[30px] bg-white border border-[#dadada] rounded-[8px] shadow-lg py-2 min-w-[150px] z-50">
                    <button
                      onClick={async () => {
                        await signOut();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-[14px] text-black hover:bg-gray-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          // Not Authenticated: Show Sign In Button
          <div className="content-stretch flex gap-[5px] items-center relative shrink-0" data-node-id="I37:2320;37:2309">
            <button
              onClick={signIn}
              className="bg-white box-border content-stretch flex gap-[10px] h-[35px] items-center justify-center px-[18px] py-[6px] relative rounded-[20px] shrink-0 w-[171px] border border-[#dadada] border-solid hover:bg-gray-50 transition-colors"
              data-node-id="I37:2320;37:2310"
            >
              <div className="relative shrink-0 size-[16px]" data-name="devicon:google" data-node-id="I37:2320;37:2311">
                <svg width="16" height="16" viewBox="0 0 24 24" className="w-full h-full">
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
              <div className="content-stretch flex gap-[3px] items-center relative shrink-0" data-node-id="I37:2320;37:2317">
                <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-black tracking-[-0.12px]" data-node-id="I37:2320;37:2318">
                  Sign in with Google
                </p>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Main Content Card - Always visible */}
      <div className="absolute bg-white box-border content-stretch flex flex-col gap-[10px] h-[732px] items-start left-1/2 px-[75px] py-[42px] rounded-[8px] top-[42px] translate-x-[-50%] w-[872px]" data-node-id="15:1417">
        {activeMainTab === 'blood-pressure' && (
          <div className="content-stretch flex flex-col gap-[70px] items-start relative shrink-0 w-full" data-node-id="26:2148">
            {/* Records Header and Date Range Section */}
            <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-node-id="26:2147">
              <div className="content-stretch flex h-[113px] items-end justify-between relative shrink-0 w-full" data-node-id="15:1418">
                <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[92.577px] text-black" data-node-id="15:1419">
                  Records
                </p>
                <div className="relative shrink-0 size-[87px]" data-name="records" data-node-id="15:1420">
                  <Image
                    src="/records.svg"
                    alt="Records"
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

            {/* Blood Pressure Trends Section with Table */}
            <div className="content-stretch flex flex-col gap-[22px] items-start relative shrink-0 w-[722px]" data-node-id="37:4000">
              {/* Trends Header */}
              <TrendsChart 
                records={filteredRecords}
                fromDate={fromDate}
                toDate={toDate}
                onShowSignInModal={() => setShowSignInModal(true)}
              />

              {/* Table Section - Instant loading with preloaded records */}
              {!recordsLoaded ? (
                <div className="flex items-center justify-center h-[400px] w-full">
                  <p className="text-gray-500">Loading records...</p>
                </div>
              ) : (
                <BloodPressureLogTable records={filteredRecords} />
              )}
            </div>
          </div>
        )}
        {activeMainTab === 'glucose' && (
          <div className="content-stretch flex flex-col gap-[70px] items-start relative shrink-0 w-full">
            <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
              <div className="content-stretch flex h-[113px] items-end justify-between relative shrink-0 w-full">
                <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[92.577px] text-black">
                  Records
                </p>
                <div className="relative shrink-0 size-[87px]">
                  <Image
                    src="/records.svg"
                    alt="Records"
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
            <div className="text-center text-black w-full py-[100px]">
              Glucose Level content coming soon!
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
