'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { getMedicationsForRecord, getDefaultMedications } from '@/lib/supabaseService';
import SetDefaultMedicationsModal from '@/components/SetDefaultMedicationsModal/SetDefaultMedicationsModal';
import type { BloodPressureRecord, Medication } from '@/types';

interface MedicationsEntryProps {
  selectedDate: Date;
  onSave: (medications: Array<{name: string, dosage: string, frequency: string}>) => Promise<boolean>;
  onCancel: () => void;
  allRecords: BloodPressureRecord[];
  medicationsMap: Map<number, Medication[]>;
  medicationsLoaded: boolean;
}

interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
}

const DRUG_OPTIONS = ['Lisinopril', 'Amlodipine', 'Valsartan', 'Nifedipine', 'Labetalol'];
const FREQUENCY_OPTIONS = ['6hrly', '8hrly', '12hrly', 'daily'];

export default function MedicationsEntry({ selectedDate, onSave, onCancel, allRecords, medicationsMap, medicationsLoaded }: MedicationsEntryProps) {
  const [medications, setMedications] = useState<MedicationItem[]>([
    { id: '1', name: '', dosage: '', frequency: '' }
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDefaultModal, setShowDefaultModal] = useState(false);
  const [savedMedications, setSavedMedications] = useState<Array<{name: string, dosage: string, frequency: string}>>([]);

  const drugSelectRefs = useRef<{ [key: string]: HTMLSelectElement | null }>({});
  const frequencySelectRefs = useRef<{ [key: string]: HTMLSelectElement | null }>({});

  // Load existing medications when date changes or records are loaded
  useEffect(() => {
    const loadExistingMedications = async () => {
      // Normalize dates for comparison
      const normalizeDate = (date: Date): string => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d.toISOString().split('T')[0];
      };

      const selectedDateStr = normalizeDate(selectedDate);
      
      // Find the record for the selected date
      const record = allRecords.find(r => {
        const recordDate = new Date(r.date);
        const recordDateStr = normalizeDate(recordDate);
        return recordDateStr === selectedDateStr;
      });

      if (record && record.id) {
        // Use cached medications if available
        if (medicationsLoaded && medicationsMap.has(record.id)) {
          const cachedMeds = medicationsMap.get(record.id)!;
          if (cachedMeds.length > 0) {
            console.log('✅ Using cached medications for record:', record.id);
            setMedications(cachedMeds.map((m, index) => ({
              id: (index + 1).toString(),
              name: m.name,
              dosage: m.dosage || '',
              frequency: m.frequency || ''
            })));
            setIsSaved(true);
            setIsEditing(false);
            return; // Exit early, no need to fetch
          }
        }

        // If not in cache or cache is empty, try loading defaults
        console.log('ℹ️ No cached medications, checking defaults...');
        try {
          const defaultMeds = await getDefaultMedications();
          if (defaultMeds.length > 0) {
            console.log('✅ Found default medications:', defaultMeds);
            setMedications(defaultMeds.map((m, index) => ({
              id: (index + 1).toString(),
              name: m.name,
              dosage: m.dosage || '',
              frequency: m.frequency || ''
            })));
            setIsSaved(true); // Mark as saved since defaults are loaded
            setIsEditing(false);
          } else {
            setMedications([{ id: '1', name: '', dosage: '', frequency: '' }]);
            setIsSaved(false);
            setIsEditing(false);
          }
        } catch (error) {
          console.error('Error loading default medications:', error);
          setMedications([{ id: '1', name: '', dosage: '', frequency: '' }]);
          setIsSaved(false);
          setIsEditing(false);
        }
      } else {
        console.log('ℹ️ No record found for date:', selectedDateStr);
        // Try loading default medications even if no record exists
        try {
          const defaultMeds = await getDefaultMedications();
          if (defaultMeds.length > 0) {
            console.log('✅ Found default medications:', defaultMeds);
            setMedications(defaultMeds.map((m, index) => ({
              id: (index + 1).toString(),
              name: m.name,
              dosage: m.dosage || '',
              frequency: m.frequency || ''
            })));
            setIsSaved(true);
          } else {
            setMedications([{ id: '1', name: '', dosage: '', frequency: '' }]);
            setIsSaved(false);
          }
        } catch (error) {
          console.error('Error loading default medications:', error);
          setMedications([{ id: '1', name: '', dosage: '', frequency: '' }]);
          setIsSaved(false);
        }
      }
    };

    loadExistingMedications();
  }, [selectedDate, allRecords, medicationsMap, medicationsLoaded]);

  // Listen for record updates to refresh medications
  useEffect(() => {
    const handleRecordSaved = async () => {
      // Normalize dates for comparison
      const normalizeDate = (date: Date): string => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d.toISOString().split('T')[0];
      };

      const selectedDateStr = normalizeDate(selectedDate);
      
      // Find the record for the selected date
      const record = allRecords.find(r => {
        const recordDate = new Date(r.date);
        const recordDateStr = normalizeDate(recordDate);
        return recordDateStr === selectedDateStr;
      });

      if (record && record.id) {
        // Use cached medications if available
        if (medicationsLoaded && medicationsMap.has(record.id)) {
          const cachedMeds = medicationsMap.get(record.id)!;
          if (cachedMeds.length > 0) {
            setMedications(cachedMeds.map((m, index) => ({
              id: (index + 1).toString(),
              name: m.name,
              dosage: m.dosage || '',
              frequency: m.frequency || ''
            })));
            setIsSaved(true);
            setIsEditing(false);
            return; // Exit early, no need to fetch
          }
        }

        // If not in cache, try loading defaults
        try {
          const defaultMeds = await getDefaultMedications();
          if (defaultMeds.length > 0) {
            console.log('✅ Found default medications after record save:', defaultMeds);
            setMedications(defaultMeds.map((m, index) => ({
              id: (index + 1).toString(),
              name: m.name,
              dosage: m.dosage || '',
              frequency: m.frequency || ''
            })));
            setIsSaved(true);
            setIsEditing(false);
          } else {
            setMedications([{ id: '1', name: '', dosage: '', frequency: '' }]);
            setIsSaved(false);
            setIsEditing(false);
          }
        } catch (defaultError) {
          console.error('Error loading default medications:', defaultError);
          setMedications([{ id: '1', name: '', dosage: '', frequency: '' }]);
          setIsSaved(false);
          setIsEditing(false);
        }
      }
    };

    window.addEventListener('bloodpg:record-saved', handleRecordSaved);
    return () => {
      window.removeEventListener('bloodpg:record-saved', handleRecordSaved);
    };
  }, [selectedDate, allRecords, medicationsMap, medicationsLoaded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty medications
    const validMedications = medications
      .filter(m => m.name && m.name.trim() !== '')
      .map(m => ({
        name: m.name,
        dosage: m.dosage || '',
        frequency: m.frequency || ''
      }));

    if (validMedications.length === 0) {
      alert('Please add at least one medication.');
      return;
    }

    setIsSaving(true);
    try {
      const success = await onSave(validMedications);
      if (success) {
        setIsSaved(true);
        setIsEditing(false);
        // Show modal to ask if user wants to set as default
        setSavedMedications(validMedications);
        setShowDefaultModal(true);
      }
    } catch (error) {
      console.error('Error saving medications:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSetAsDefault = async () => {
    try {
      const { saveDefaultMedications } = await import('@/lib/supabaseService');
      const success = await saveDefaultMedications(savedMedications);
      if (success) {
        console.log('✅ Default medications saved');
      }
    } catch (error) {
      console.error('Error saving default medications:', error);
    }
    setShowDefaultModal(false);
  };

  const handleAddMedication = () => {
    if (medications.length >= 4) {
      alert('Maximum of 4 medications allowed');
      return;
    }
    setMedications([
      ...medications,
      { id: Date.now().toString(), name: '', dosage: '', frequency: '' }
    ]);
  };

  const handleUpdateMedication = (id: string, field: 'name' | 'dosage' | 'frequency', value: string) => {
    if (field === 'dosage') {
      // Validate dosage: max 4 digits, no decimals
      let cleaned = value.replace(/[^\d]/g, '');
      if (cleaned.length > 4) {
        cleaned = cleaned.slice(0, 4);
      }
      setMedications(medications.map(med =>
        med.id === id ? { ...med, [field]: cleaned } : med
      ));
    } else {
      setMedications(medications.map(med =>
        med.id === id ? { ...med, [field]: value } : med
      ));
    }
  };

  const handleRemoveMedication = (id: string) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  return (
    <>
      <SetDefaultMedicationsModal
        isOpen={showDefaultModal}
        onClose={() => setShowDefaultModal(false)}
        medications={savedMedications}
        onSetAsDefault={handleSetAsDefault}
      />
      <form onSubmit={handleSubmit} className="flex flex-col gap-[19px] items-end justify-center w-[352px]">
      <div className="content-stretch flex flex-col gap-[92px] items-start relative shrink-0 w-full">
        <div className="box-border content-stretch flex flex-col items-start pb-[4px] pt-0 px-0 relative shrink-0 w-full">
          <div className="box-border content-stretch flex flex-col gap-[27px] items-start mb-[-4px] relative shrink-0 w-full">
            <div className="content-stretch flex flex-col gap-[28px] items-start relative shrink-0 w-[377px]">
              {/* Current Medications Header */}
              <div className="content-stretch flex flex-col font-['Helvetica_Neue:Medium',sans-serif] gap-[8px] items-start not-italic relative shrink-0 w-full whitespace-pre-wrap">
                <p className="leading-[normal] relative shrink-0 text-[17px] text-black tracking-[-0.17px] w-full">
                  Current Medications
                </p>
                <p className="leading-[20px] relative shrink-0 text-[14px] text-neutral-400 tracking-[-0.42px] w-full">
                  Tracking your medications helps you see the full picture of your health management.
                </p>
              </div>

              {/* Medications List */}
              <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-[377px]">
                <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[15px] text-black tracking-[0.15px] w-[min-content] whitespace-pre-wrap">
                  Tabs
                </p>
                <div className="content-stretch flex flex-col gap-[33px] items-start relative shrink-0 w-full">
                  {medications.map((medication, index) => (
                    <div key={medication.id} className="relative content-stretch flex gap-[8px] items-center shrink-0 w-[377px]">
                    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
                      {/* Drug Name Dropdown */}
                      <div className="content-stretch flex flex-col gap-[5px] items-start relative shrink-0 w-[145px]">
                      <div className="border border-[#ebebeb] border-solid box-border content-stretch flex items-center justify-between h-[40px] px-[13px] py-[7px] relative rounded-[10px] shrink-0 w-full focus-within:border-black">
                        <select
                          ref={(el) => { drugSelectRefs.current[medication.id] = el; }}
                          value={medication.name}
                          onChange={(e) => handleUpdateMedication(medication.id, 'name', e.target.value)}
                          disabled={isSaved && !isEditing}
                          className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#7e7e7e] text-[14px] tracking-[-0.14px] bg-transparent border-none outline-none flex-1 appearance-none cursor-pointer focus:text-black pr-[28px] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">Select drug</option>
                          {DRUG_OPTIONS.map((drug) => (
                            <option key={drug} value={drug}>
                              {drug}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-[13px] top-1/2 -translate-y-1/2 overflow-clip relative shrink-0 size-[20px] pointer-events-none z-10">
                          <Image
                            src="/mingcute_down-line.svg"
                            alt="Dropdown"
                            width={20}
                            height={20}
                            className="object-contain rotate-180"
                          />
                        </div>
                      </div>
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#7e7e7e] text-[12px] tracking-[-0.12px] w-full whitespace-pre-wrap">
                        Drug name e.g Lisonopril
                      </p>
                    </div>

                    {/* Dosage Input */}
                    <div className="content-stretch flex flex-col gap-[5px] items-start relative shrink-0 w-[113px]">
                      <div className="border border-[#ebebeb] border-solid box-border content-stretch flex gap-[10px] h-[40px] items-center px-[16px] py-[11px] relative rounded-[10px] shrink-0 w-full focus-within:border-black">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={medication.dosage}
                          onChange={(e) => handleUpdateMedication(medication.id, 'dosage', e.target.value)}
                          placeholder="100mg"
                          disabled={isSaved && !isEditing}
                          maxLength={4}
                          className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#7e7e7e] text-[14px] tracking-[-0.14px] bg-transparent border-none outline-none w-full placeholder:text-[#7e7e7e] disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#7e7e7e] text-[12px] tracking-[-0.12px] w-full whitespace-pre-wrap">
                        Dosage e.g 10mg
                      </p>
                    </div>

                    {/* Frequency Dropdown */}
                    <div className="content-stretch flex flex-col gap-[5px] items-start relative shrink-0 w-[103px]">
                      <div className="border border-[#ebebeb] border-solid box-border content-stretch flex items-center justify-between h-[40px] px-[8px] py-[10px] relative rounded-[10px] shrink-0 w-full focus-within:border-black">
                        <select
                          ref={(el) => { frequencySelectRefs.current[medication.id] = el; }}
                          value={medication.frequency || ''}
                          onChange={(e) => handleUpdateMedication(medication.id, 'frequency', e.target.value)}
                          disabled={isSaved && !isEditing}
                          className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#7e7e7e] text-[14px] tracking-[-0.14px] bg-transparent border-none outline-none flex-1 appearance-none cursor-pointer focus:text-black pr-[28px] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="" disabled style={{ display: 'none' }}></option>
                          {FREQUENCY_OPTIONS.map((freq) => (
                            <option key={freq} value={freq}>
                              {freq}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-[8px] top-1/2 -translate-y-1/2 overflow-clip relative shrink-0 size-[20px] pointer-events-none z-10">
                          <Image
                            src="/mingcute_down-line.svg"
                            alt="Dropdown"
                            width={20}
                            height={20}
                            className="object-contain rotate-180"
                          />
                        </div>
                      </div>
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#7e7e7e] text-[12px] tracking-[-0.12px] w-full whitespace-pre-wrap">
                        Frequency
                      </p>
                    </div>
                    </div>
                      {/* Delete Icon - Only show on second and subsequent medications (never on first) */}
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMedication(medication.id)}
                          className="absolute left-[362px] top-[-19px] size-[16px] cursor-pointer hover:opacity-70 transition-opacity flex items-center justify-center"
                          aria-label="Delete medication"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-full h-full"
                          >
                            <path
                              d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6H4V4H9V3H15V4H20V6H19V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM7 19H17V6H7V19ZM9 17H11V8H9V17ZM13 17H15V8H13V17Z"
                              fill="currentColor"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Add Medication Button */}
            <div className="box-border content-stretch flex gap-[8px] items-center relative shrink-0">
              <button
                type="button"
                onClick={handleAddMedication}
                disabled={(isSaved && !isEditing) || medications.length >= 4}
                className="flex gap-[8px] items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="relative shrink-0 size-[16px]">
                  <Image
                    src="/formkit_add.svg"
                    alt="Add"
                    width={16}
                    height={16}
                    className="object-contain"
                  />
                </div>
                <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[13px] text-black tracking-[-0.13px]">
                  Add medication
                </p>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Divider */}
      <div className="h-0 w-[351px] relative">
        <div className="absolute inset-0 border-t border-[#d1d1d1]"></div>
      </div>

      {/* Buttons */}
      <div className="flex gap-[16px] items-center">
        {isSaved && !isEditing ? (
          <button
            type="button"
            onClick={() => {
              setIsSaved(false);
              setIsEditing(true);
            }}
            className="bg-[#212121] box-border content-stretch flex gap-[10px] h-[35px] items-center justify-center px-[11px] py-[6px] relative rounded-[20px] shrink-0 w-[148px]"
          >
            <div className="content-stretch flex gap-[3px] items-center relative shrink-0">
              <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-white tracking-[-0.12px]">
                Edit
              </p>
            </div>
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={onCancel}
              className="border border-black border-solid box-border content-stretch flex gap-[10px] h-[35px] items-center justify-center px-[13px] py-[10px] relative rounded-[20px] shrink-0 w-[92px]"
            >
              <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1d1d1d] text-[12px] tracking-[-0.12px]">
                Cancel
              </p>
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-[#212121] box-border content-stretch flex gap-[10px] h-[35px] items-center justify-center px-[11px] py-[6px] relative rounded-[20px] shrink-0 w-[148px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="content-stretch flex gap-[3px] items-center relative shrink-0">
                <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-white tracking-[-0.12px]">
                  {isSaving ? 'Saving...' : 'Save'}
                </p>
              </div>
            </button>
          </>
        )}
      </div>
    </form>
    </>
  );
}

