'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import BloodPressureEntry from './BloodPressureEntry';
import MedicationsEntry from './MedicationsEntry';
import RecordsEntry from './RecordsEntry';
import RecordsDateFilter from './RecordsDateFilter';
import DatePicker from './DatePicker';
import SignInModal from '@/components/SignInModal/SignInModal';
import { useAuth } from '@/lib/authContext';
import type { SidebarTab, BloodPressureFormData, BloodPressureRecord, Medication } from '@/types';
import { formatDateOrdinal, isDateToday, navigateDate } from '@/lib/dateUtils';
import { saveBloodPressureRecordUnified, getAllBloodPressureRecords } from '@/lib/dataService';
import { getSupabaseClient } from '@/lib/supabase';

interface SidebarProps {
  activeMainTab: 'blood-pressure' | 'glucose';
  allRecords: BloodPressureRecord[];
  recordsLoaded: boolean;
  medicationsMap: Map<number, Medication[]>;
  medicationsLoaded: boolean;
}

export default function Sidebar({ activeMainTab, allRecords, recordsLoaded, medicationsMap, medicationsLoaded }: SidebarProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SidebarTab>('enter');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Auto-update date to today if it's a new day (check every minute)
  useEffect(() => {
    const checkDate = () => {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      const selectedDateStr = selectedDate.toISOString().split('T')[0];
      
      // If selected date is in the past and it's a new day, update to today
      if (selectedDateStr < todayStr) {
        setSelectedDate(today);
      }
    };

    // Check immediately
    checkDate();

    // Check every minute
    const interval = setInterval(checkDate, 60000);

    return () => clearInterval(interval);
  }, [selectedDate]);

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };

    if (showDatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDatePicker]);

  const handleDateNavigation = (direction: 'next' | 'prev') => {
    setSelectedDate(navigateDate(selectedDate, direction));
  };

  const [saving, setSaving] = useState(false);
  const [pendingSaveData, setPendingSaveData] = useState<BloodPressureFormData | null>(null);

  const handleSaveBP = async (data: BloodPressureFormData): Promise<boolean> => {
    // Check if user is authenticated
    if (!user) {
      setPendingSaveData(data);
      setShowSignInModal(true);
      return false; // Return false to indicate save was not successful
    }

    setSaving(true);
    try {
      const record = {
        date: selectedDate,
        am: {
          systolic: parseInt(data.am.systolic) || 0,
          diastolic: parseInt(data.am.diastolic) || 0,
          preMedication: data.am.preMedication,
          postMedication: data.am.postMedication,
        },
        pm: {
          systolic: parseInt(data.pm.systolic) || 0,
          diastolic: parseInt(data.pm.diastolic) || 0,
          preMedication: data.pm.preMedication,
          postMedication: data.pm.postMedication,
        },
        medications: [],
      };
      
      const savedRecord = await saveBloodPressureRecordUnified(record);
      
      if (savedRecord) {
        alert('Blood pressure record saved successfully!');
        // Notify other components to refresh
        window.dispatchEvent(new CustomEvent('bloodpg:record-saved'));
        return true; // Return true to indicate save was successful
      } else {
        alert('Failed to save record. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Error saving record:', error);
      alert('An error occurred while saving. Please try again.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Auto-save after user signs in if there's pending data
  useEffect(() => {
    // When user signs in and there's pending data, auto-save
    if (user && pendingSaveData) {
      // Close modal if it's open
      if (showSignInModal) {
        setShowSignInModal(false);
      }
      
      // Auto-save the pending data
      const performPendingSave = async () => {
        setSaving(true);
        try {
          const record = {
            date: selectedDate,
            am: {
              systolic: parseInt(pendingSaveData.am.systolic) || 0,
              diastolic: parseInt(pendingSaveData.am.diastolic) || 0,
              preMedication: pendingSaveData.am.preMedication,
              postMedication: pendingSaveData.am.postMedication,
            },
            pm: {
              systolic: parseInt(pendingSaveData.pm.systolic) || 0,
              diastolic: parseInt(pendingSaveData.pm.diastolic) || 0,
              preMedication: pendingSaveData.pm.preMedication,
              postMedication: pendingSaveData.pm.postMedication,
            },
            medications: [],
          };
          
          const savedRecord = await saveBloodPressureRecordUnified(record);
          
          if (savedRecord) {
            // Notify other components to refresh
            window.dispatchEvent(new CustomEvent('bloodpg:record-saved'));
            setPendingSaveData(null); // Clear pending data after successful save
            // Notify BloodPressureEntry to update its state (go to disabled/saved state)
            window.dispatchEvent(new CustomEvent('bloodpg:save-success'));
          } else {
            alert('Failed to save record. Please try again.');
          }
        } catch (error) {
          console.error('Error saving record:', error);
          alert('An error occurred while saving. Please try again.');
        } finally {
          setSaving(false);
        }
      };
      
      // Small delay to ensure auth state is fully updated
      setTimeout(() => {
        performPendingSave();
      }, 100);
    } else if (user && showSignInModal && !pendingSaveData) {
      // User signed in but no pending save - just close modal
      setShowSignInModal(false);
    }
  }, [user, pendingSaveData, selectedDate, showSignInModal]);

  const handleSaveMedications = async (medications: Array<{name: string, dosage: string, frequency: string}>) => {
    if (!user) {
      setShowSignInModal(true);
      return false;
    }

    setSaving(true);
    try {
      // Normalize dates for comparison (same logic as BloodPressureEntry)
      const normalizeDate = (date: Date): string => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d.toISOString().split('T')[0];
      };

      const selectedDateStr = normalizeDate(selectedDate);
      
      // Use allRecords prop instead of fetching fresh data
      const todayRecord = allRecords.find((r: BloodPressureRecord) => {
        const recordDate = new Date(r.date);
        const recordDateStr = normalizeDate(recordDate);
        return recordDateStr === selectedDateStr;
      });

      console.log('🔍 Looking for record for medications, date:', selectedDateStr);
      console.log('📊 Available records:', allRecords.map(r => ({
        date: normalizeDate(new Date(r.date)),
        id: r.id
      })));

      if (!todayRecord) {
        console.log('❌ No record found for date:', selectedDateStr);
        alert('Please save a blood pressure record first before adding medications.');
        return false;
      }

      console.log('✅ Found record for medications:', todayRecord.id);

      // Save medications to Supabase and link them to the record
      const supabase = getSupabaseClient();
      
      // Filter out empty medications
      const validMedications = medications.filter(m => m.name && m.name.trim() !== '');
      
      if (validMedications.length === 0) {
        alert('Please add at least one medication.');
        return false;
      }

      // Save each medication and link to record
      const medicationStrings: string[] = [];
      
      for (const med of validMedications) {
        // Check if medication already exists for this user
        const { data: existingMed } = await supabase
          .from('medications')
          .select('id')
          .eq('user_id', user.id)
          .eq('name', med.name)
          .eq('dosage', med.dosage || '')
          .eq('frequency', med.frequency || '')
          .single();

        let medicationId: number;
        
        if (existingMed) {
          medicationId = existingMed.id;
        } else {
          // Create new medication
          const { data: newMed, error: medError } = await supabase
            .from('medications')
            .insert([{
              user_id: user.id,
              name: med.name,
              dosage: med.dosage || '',
              frequency: med.frequency || ''
            }])
            .select()
            .single();

          if (medError || !newMed) {
            console.error('Error saving medication:', medError);
            continue;
          }
          medicationId = newMed.id;
        }

        // Link medication to record
        const { error: linkError } = await supabase
          .from('record_medications')
          .upsert({
            record_id: todayRecord.id,
            medication_id: medicationId
          }, {
            onConflict: 'record_id,medication_id'
          });

        if (linkError) {
          console.error('Error linking medication to record:', linkError);
        } else {
          // Format dosage: add "mg" if it's a number and doesn't already have "mg"
          const formatDosage = (dosage: string): string => {
            if (!dosage || dosage.trim() === '') return '';
            const trimmed = dosage.trim();
            // Check if it already contains "mg" (case insensitive)
            if (/\bmg\b/i.test(trimmed)) {
              return trimmed;
            }
            // If it's a number, add "mg"
            if (/^\d+$/.test(trimmed)) {
              return `${trimmed}mg`;
            }
            // Otherwise return as is
            return trimmed;
          };
          
          const formattedDosage = formatDosage(med.dosage || '');
          medicationStrings.push(`${med.name} ${formattedDosage} ${med.frequency || ''}`.trim());
        }
      }

      // Update the record with medications array (for backward compatibility)
      const updatedRecord = {
        ...todayRecord,
        medications: medicationStrings
      };

      // Refresh records
      window.dispatchEvent(new CustomEvent('bloodpg:record-saved'));
      alert('Medications saved successfully!');
      return true;
    } catch (error) {
      console.error('Error saving medications:', error);
      alert('Failed to save medications. Please try again.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    console.log('Cancel action');
  };

  return (
    <>
      <SignInModal 
        isOpen={showSignInModal} 
        onClose={() => {
          setShowSignInModal(false);
          // Clear pending data if user cancels
          setPendingSaveData(null);
        }} 
      />
      <div className="h-[774px] relative shrink-0 w-[420px]">
      <div className="absolute bg-white box-border content-stretch flex gap-[10px] items-center justify-center left-0 px-[15px] py-[22px] rounded-[12px] top-[42px] w-[420px]">
        <div className="h-[688px] relative shrink-0 w-[387px]">
          <div className="absolute box-border content-stretch flex flex-col gap-[18px] items-center left-[-14.5px] p-[18px] top-[-21px] w-[417px]">
            <div className="content-stretch flex flex-col gap-[18px] items-start relative shrink-0 w-[379px]">
              {/* Header Section */}
              <div className="h-[145px] relative shrink-0 w-full">
                <div className="absolute content-stretch flex gap-[5px] items-center left-0 top-0">
                  <div className="relative shrink-0 size-[24px]">
                    <Image
                      src={activeMainTab === 'blood-pressure' ? "/logobloodpressure.svg" : "/logoblackglucose.svg"}
                      alt={activeMainTab === 'blood-pressure' ? "Blood Pressure" : "Glucose Level"}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-black tracking-[-0.24px]">
                    {activeMainTab === 'blood-pressure' ? 'Blood Pressure' : 'Glucose Level'}
                  </p>
                </div>

                {/* Sub-tabs */}
                <div className="absolute contents left-0 top-[66px]">
                  <div className="absolute h-0 left-0 top-[100px] w-[379px]">
                    <div className="absolute bottom-[-0.5px] left-0 right-0 top-[-0.5px] border-t border-[#d1d1d1]"></div>
                  </div>
                  <div className="absolute content-stretch flex gap-[25px] h-[34px] items-start left-0 top-[66px] w-[371.527px]">
                    <div className={`content-stretch flex flex-col gap-[18px] items-start relative shrink-0 w-[130px]`}>
                      <button
                        onClick={() => setActiveTab('enter')}
                        className="content-stretch flex gap-[4px] items-end relative shrink-0 w-full"
                      >
                        <div className={`relative shrink-0 size-[16px] ${
                          activeTab === 'enter' ? '' : 'opacity-40'
                        }`}>
                          <Image
                            src="/mdi_invoice-receive-outline.svg"
                            alt="Enter"
                            width={16}
                            height={16}
                            className={`object-contain ${
                              activeTab === 'enter' ? 'brightness-0' : ''
                            }`}
                          />
                        </div>
                        <p className={`font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] tracking-[-0.14px] ${
                          activeTab === 'enter' ? 'text-black' : 'text-neutral-400'
                        }`}>
                          Enter information
                        </p>
                      </button>
                      {activeTab === 'enter' && (
                        <div className="h-0 relative shrink-0 w-[125px]">
                          <div className="absolute inset-[-0.5px_0%]">
                            <div className="h-[1px] bg-black w-full"></div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className={`content-stretch flex flex-col gap-[18px] items-start relative shrink-0 ${
                      activeTab === 'medications' ? 'w-[100px]' : ''
                    }`}>
                      <button
                        onClick={() => setActiveTab('medications')}
                        className="content-stretch flex items-end relative shrink-0 w-full"
                      >
                        <div className={`relative shrink-0 size-[16px] ${
                          activeTab === 'medications' ? '' : 'opacity-40'
                        }`}>
                          <Image
                            src="/medications.svg"
                            alt="Medications"
                            width={16}
                            height={16}
                            className="object-contain"
                          />
                        </div>
                        <p className={`font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] tracking-[-0.14px] ${
                          activeTab === 'medications' ? 'text-black' : 'text-neutral-400'
                        }`}>
                          Medications
                        </p>
                      </button>
                      {activeTab === 'medications' && (
                        <div className="h-0 relative shrink-0 w-[125px]">
                          <div className="absolute inset-[-0.5px_0%]">
                            <div className="h-[1px] bg-black w-full"></div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className={`content-stretch flex flex-col gap-[18px] items-start relative shrink-0 ${
                      activeTab === 'records' ? 'w-[70px]' : ''
                    }`}>
                      <button
                        onClick={() => setActiveTab('records')}
                        className="content-stretch flex gap-[4px] items-end relative shrink-0 w-full"
                      >
                        <div className={`relative shrink-0 size-[16px] ${
                          activeTab === 'records' ? '' : 'opacity-40'
                        }`}>
                          <Image
                            src="/pixelarticons_notes-multiple.svg"
                            alt="Records"
                            width={16}
                            height={16}
                            className="object-contain"
                          />
                        </div>
                        <p className={`font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] tracking-[-0.14px] ${
                          activeTab === 'records' ? 'text-black' : 'text-neutral-400'
                        }`}>
                          Records
                        </p>
                      </button>
                      {activeTab === 'records' && (
                        <div className="h-0 relative shrink-0 w-[125px]">
                          <div className="absolute inset-[-0.5px_0%]">
                            <div className="h-[1px] bg-black w-full"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Date Navigation */}
                {activeTab !== 'records' && (
                  <div className="absolute content-stretch flex items-center right-0 top-[119px]" ref={datePickerRef}>
                    <button
                      onClick={() => handleDateNavigation('prev')}
                      className="flex items-center justify-center relative shrink-0"
                    >
                      <div className="flex-none">
                        <div className="relative size-[20.455px]">
                          <Image
                            src="/back_icon.svg"
                            alt="Previous"
                            width={20.455}
                            height={20.455}
                            className="object-contain"
                          />
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      className="bg-[#ededed] box-border content-stretch flex gap-[12px] items-center justify-center px-[9px] py-[3px] relative rounded-[3.068px] shrink-0"
                    >
                      <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-black tracking-[-0.64px]">
                        {isDateToday(selectedDate) ? 'Today' : formatDateOrdinal(selectedDate)}
                      </p>
                    </button>
                    {showDatePicker && (
                      <DatePicker
                        selectedDate={selectedDate}
                        onDateSelect={setSelectedDate}
                        onClose={() => setShowDatePicker(false)}
                      />
                    )}
                    <button
                      onClick={() => handleDateNavigation('next')}
                      className="flex items-center justify-center relative shrink-0"
                    >
                      <div className="flex-none">
                        <div className="relative size-[20.455px]">
                          <Image
                            src="/next_icon.svg"
                            alt="Next"
                            width={20.455}
                            height={20.455}
                            className="object-contain"
                          />
                        </div>
                      </div>
                    </button>
                  </div>
                )}
                {/* Date Filter for Records Tab */}
                {activeTab === 'records' && (
                  <RecordsDateFilter onFilterChange={(filter) => {
                    // Pass filter to RecordsEntry via a custom event or state
                    window.dispatchEvent(new CustomEvent('bloodpg:filter-changed', { detail: filter }));
                  }} />
                )}
              </div>

              {/* Content Area */}
              <div className="w-full">
                {activeTab === 'enter' && (
                  <BloodPressureEntry
                    selectedDate={selectedDate}
                    allRecords={allRecords}
                    onSave={handleSaveBP}
                    onCancel={handleCancel}
                  />
                )}
                {activeTab === 'medications' && (
                  <MedicationsEntry
                    selectedDate={selectedDate}
                    onSave={handleSaveMedications}
                    onCancel={handleCancel}
                    allRecords={allRecords}
                    medicationsMap={medicationsMap}
                    medicationsLoaded={medicationsLoaded}
                  />
                )}
                {activeTab === 'records' && (
                  <RecordsEntry 
                    selectedDate={selectedDate}
                    allRecords={allRecords}
                    recordsLoaded={recordsLoaded}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
