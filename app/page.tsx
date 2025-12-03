'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header/Header';
import ThemeToggle from '@/components/Sidebar/ThemeToggle';
import MainTabs from '@/components/MainTabs/MainTabs';
import Sidebar from '@/components/Sidebar/Sidebar';
import MainContent from '@/components/MainContent/MainContent';
import AuthGuard from '@/components/AuthGuard/AuthGuard';
import { getAllBloodPressureRecords } from '@/lib/dataService';
import { getAllMedicationsForRecords } from '@/lib/supabaseService';
import { useAuth } from '@/lib/authContext';
// import '@/lib/initData'; // Dummy data initialization disabled for testing
import '@/lib/clearAllData'; // Make clear functions available in console
import type { MainTab, BloodPressureRecord } from '@/types';
import type { Medication } from '@/types';

export default function Home() {
  const { user } = useAuth();
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('blood-pressure');
  const [allRecords, setAllRecords] = useState<BloodPressureRecord[]>([]);
  const [recordsLoaded, setRecordsLoaded] = useState(false);
  const [medicationsMap, setMedicationsMap] = useState<Map<number, Medication[]>>(new Map());
  const [medicationsLoaded, setMedicationsLoaded] = useState(false);

  // Clear all data when user signs out
  useEffect(() => {
    if (!user) {
      // User signed out - clear all data
      setAllRecords([]);
      setMedicationsMap(new Map());
      setRecordsLoaded(false);
      setMedicationsLoaded(false);
      console.log('🧹 Cleared all data on sign out');
    }
  }, [user]);

  // Pre-load records when app starts (background loading)
  useEffect(() => {
    const loadRecordsOnStart = async () => {
      try {
        const records = await getAllBloodPressureRecords();
        setAllRecords(records);
        setRecordsLoaded(true);
        console.log('✅ Pre-loaded', records.length, 'records on app start');
      } catch (error) {
        console.error('Failed to pre-load records:', error);
        setRecordsLoaded(true); // Set to true even on error to avoid infinite loading
      }
    };

    loadRecordsOnStart();

    // Listen for record updates to refresh the pre-loaded data
    const handleRecordSaved = () => {
      console.log('🔄 Refreshing pre-loaded records after save...');
      loadRecordsOnStart();
    };

    window.addEventListener('bloodpg:record-saved', handleRecordSaved);
    return () => {
      window.removeEventListener('bloodpg:record-saved', handleRecordSaved);
    };
  }, []);

  // Pre-load medications for all records when records are loaded
  useEffect(() => {
    const loadMedicationsOnStart = async () => {
      if (!recordsLoaded || allRecords.length === 0) {
        return;
      }

      try {
        const recordIds = allRecords.map(r => r.id).filter(id => id !== undefined) as number[];
        if (recordIds.length > 0) {
          const medsMap = await getAllMedicationsForRecords(recordIds);
          setMedicationsMap(medsMap);
          setMedicationsLoaded(true);
          console.log('✅ Pre-loaded medications for', medsMap.size, 'records');
        } else {
          setMedicationsLoaded(true);
        }
      } catch (error) {
        console.error('Failed to pre-load medications:', error);
        setMedicationsLoaded(true); // Set to true even on error
      }
    };

    loadMedicationsOnStart();

    // Listen for record updates to refresh medications
    const handleRecordSaved = async () => {
      // Wait a bit for medications to be linked, then refresh records first, then medications
      setTimeout(async () => {
        // First refresh records to get the latest data including new record
        const records = await getAllBloodPressureRecords();
        setAllRecords(records);
        
        // Then refresh medications cache with the updated records
        if (records.length > 0) {
          console.log('🔄 Refreshing pre-loaded medications after save...');
          const recordIds = records.map(r => r.id).filter(id => id !== undefined) as number[];
          if (recordIds.length > 0) {
            // Add a small delay to ensure medications are fully linked in the database
            await new Promise(resolve => setTimeout(resolve, 300));
            const medsMap = await getAllMedicationsForRecords(recordIds);
            setMedicationsMap(medsMap);
            console.log('✅ Refreshed medications cache for', medsMap.size, 'records');
            console.log('📋 Medications map:', Array.from(medsMap.entries()).map(([id, meds]) => ({ recordId: id, count: meds.length })));
          }
        }
      }, 500); // Small delay to ensure medications are linked
    };

    window.addEventListener('bloodpg:record-saved', handleRecordSaved);
    return () => {
      window.removeEventListener('bloodpg:record-saved', handleRecordSaved);
    };
  }, [recordsLoaded, allRecords]);

  return (
    <div className="bg-[#f2f2f2] relative size-full min-h-screen">
      <Header />
      <div className="flex gap-[15px] items-start w-full px-[30px] py-[20px]">
        <div className="flex gap-[15px] items-start">
          <ThemeToggle />
          <div className="h-[774px] relative shrink-0 w-[420px]">
            {/* MainTabs above the left pane */}
            <div className="absolute bg-white box-border content-stretch flex flex-col gap-[10px] h-[33px] items-center justify-center left-0 px-[5px] py-[6px] rounded-[21px] top-0" data-name="tab-container">
              <MainTabs activeTab={activeMainTab} onTabChange={setActiveMainTab} />
            </div>
            {/* Sidebar below MainTabs */}
            <Sidebar 
              activeMainTab={activeMainTab} 
              allRecords={allRecords}
              recordsLoaded={recordsLoaded}
              medicationsMap={medicationsMap}
              medicationsLoaded={medicationsLoaded}
            />
          </div>
        </div>
        <MainContent 
          activeMainTab={activeMainTab}
          allRecords={allRecords}
          recordsLoaded={recordsLoaded}
        />
      </div>
    </div>
  );
}

