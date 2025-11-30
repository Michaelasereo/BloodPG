'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { BloodPressureFormData, BloodPressureRecord } from '@/types';

interface BloodPressureEntryProps {
  selectedDate: Date;
  allRecords: BloodPressureRecord[];
  onSave: (data: BloodPressureFormData) => Promise<boolean>;
  onCancel: () => void;
}

export default function BloodPressureEntry({
  selectedDate,
  allRecords,
  onSave,
  onCancel,
}: BloodPressureEntryProps) {
  const [formData, setFormData] = useState<BloodPressureFormData>({
    am: {
      systolic: '',
      diastolic: '',
      preMedication: true,
      postMedication: false,
    },
    pm: {
      systolic: '',
      diastolic: '',
      preMedication: true,
      postMedication: false,
    },
  });
  const [isSaved, setIsSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Load existing data when date changes or when records are loaded
  useEffect(() => {
    // Normalize dates to YYYY-MM-DD format for comparison (ignore time/timezone)
    const normalizeDate = (date: Date): string => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d.toISOString().split('T')[0];
    };

    const selectedDateStr = normalizeDate(selectedDate);
    
    // Find existing record for the selected date
    const existingRecord = allRecords.find(record => {
      const recordDate = new Date(record.date);
      const recordDateStr = normalizeDate(recordDate);
      return recordDateStr === selectedDateStr;
    });

    console.log('🔍 Looking for record for date:', selectedDateStr);
    console.log('📊 Available records:', allRecords.length, 'records');
    if (allRecords.length > 0) {
      console.log('📋 Record dates:', allRecords.map(r => ({
        date: normalizeDate(new Date(r.date)),
        id: r.id
      })));
    }

    if (existingRecord) {
      console.log('✅ Found existing record:', existingRecord.id);
      // Load existing data and set to saved state
      setFormData({
        am: {
          systolic: existingRecord.am.systolic.toString(),
          diastolic: existingRecord.am.diastolic.toString(),
          preMedication: existingRecord.am.preMedication,
          postMedication: existingRecord.am.postMedication,
        },
        pm: {
          systolic: existingRecord.pm.systolic.toString(),
          diastolic: existingRecord.pm.diastolic.toString(),
          preMedication: existingRecord.pm.preMedication,
          postMedication: existingRecord.pm.postMedication,
        },
      });
      setIsSaved(true);
      setIsEditing(false);
    } else {
      console.log('ℹ️ No record found for date:', selectedDateStr);
      // Reset to empty form (this will run when records are loaded and no match is found)
      setFormData({
        am: {
          systolic: '',
          diastolic: '',
          preMedication: true,
          postMedication: false,
        },
        pm: {
          systolic: '',
          diastolic: '',
          preMedication: true,
          postMedication: false,
        },
      });
      setIsSaved(false);
      setIsEditing(false);
    }
  }, [selectedDate, allRecords]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSave(formData);
    // Only mark as saved if save was successful
    if (success) {
      setIsSaved(true);
      setIsEditing(false);
    }
    // If save failed (e.g., user not authenticated), keep form editable
  };

  // Listen for save success event (after sign-in auto-save)
  useEffect(() => {
    const handleSaveSuccess = () => {
      setIsSaved(true);
      setIsEditing(false);
    };

    window.addEventListener('bloodpg:save-success', handleSaveSuccess);
    return () => {
      window.removeEventListener('bloodpg:save-success', handleSaveSuccess);
    };
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setIsSaved(false);
  };

  // Listen for record updates to refresh form if current date's record was updated
  useEffect(() => {
    const handleRecordSaved = () => {
      // Normalize dates for comparison
      const normalizeDate = (date: Date): string => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d.toISOString().split('T')[0];
      };

      const selectedDateStr = normalizeDate(selectedDate);
      const existingRecord = allRecords.find(record => {
        const recordDate = new Date(record.date);
        const recordDateStr = normalizeDate(recordDate);
        return recordDateStr === selectedDateStr;
      });

      if (existingRecord) {
        setFormData({
          am: {
            systolic: existingRecord.am.systolic.toString(),
            diastolic: existingRecord.am.diastolic.toString(),
            preMedication: existingRecord.am.preMedication,
            postMedication: existingRecord.am.postMedication,
          },
          pm: {
            systolic: existingRecord.pm.systolic.toString(),
            diastolic: existingRecord.pm.diastolic.toString(),
            preMedication: existingRecord.pm.preMedication,
            postMedication: existingRecord.pm.postMedication,
          },
        });
        setIsSaved(true);
        setIsEditing(false);
      }
    };

    window.addEventListener('bloodpg:record-saved', handleRecordSaved);
    return () => {
      window.removeEventListener('bloodpg:record-saved', handleRecordSaved);
    };
  }, [selectedDate, allRecords]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[19px] items-end justify-center w-[352px]">
      <div className="flex flex-col gap-[42px] items-end w-full">
        <div className="flex flex-col gap-[28px] items-start w-full">
          <div className="flex flex-col gap-[8px] items-start w-[276px]">
            <p className="font-medium text-[17px] text-black tracking-[-0.17px] w-full">
              Blood Pressure Parameters
            </p>
            <p className="font-medium leading-[20px] text-[14px] text-neutral-400 tracking-[-0.42px] w-full">
              Track your readings over time to understand your heart health.
            </p>
          </div>

          <div className="flex flex-col gap-[39px] items-start w-full">
            {/* AM Section */}
            <div className="flex flex-col gap-[26px] items-start w-[263px]">
              <div className="flex flex-col gap-[13px] items-start w-full">
                <div className="flex gap-[4px] items-center">
                  <p className="font-normal text-[12px] text-black tracking-[0.12px] whitespace-nowrap">
                    AM
                  </p>
                  <div className="relative shrink-0 size-[14px]">
                    <Image
                      src="/entypo_light-up.svg"
                      alt="AM"
                      width={14}
                      height={14}
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid justify-items-start leading-[0] relative shrink-0">
                  <div className="box-border col-[1] content-stretch flex flex-col gap-[5px] items-start ml-0 mt-0 relative row-[1] w-[113px]">
                    <input
                      type="number"
                      value={formData.am.systolic}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          am: { ...formData.am, systolic: e.target.value },
                        })
                      }
                      disabled={isSaved && !isEditing}
                      className={`border border-[#d1d1d1] border-solid h-[40px] rounded-[10px] shrink-0 w-full px-3 ${
                        isSaved && !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
                      }`}
                    />
                    <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#7e7e7e] text-[12px] tracking-[-0.12px] w-full whitespace-pre-wrap">
                      Systolic (mm/Hg)
                    </p>
                  </div>
                  <div className="box-border col-[1] content-stretch flex flex-col gap-[5px] items-start ml-[150px] mt-0 relative row-[1]">
                    <input
                      type="number"
                      value={formData.am.diastolic}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          am: { ...formData.am, diastolic: e.target.value },
                        })
                      }
                      disabled={isSaved && !isEditing}
                      className={`border border-[#d1d1d1] border-solid h-[40px] rounded-[10px] shrink-0 w-full px-3 ${
                        isSaved && !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
                      }`}
                    />
                    <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#7e7e7e] text-[12px] tracking-[-0.12px] w-full whitespace-pre-wrap">
                      Diastolic (mm/Hg)
                    </p>
                  </div>
                  <div className="col-[1] h-[21px] ml-[126px] mt-[11px] relative row-[1] w-[11px]">
                    <div className="absolute inset-[-2.38%_-4.55%]">
                      <Image
                        src="/Vector 14.svg"
                        alt="Slash"
                        width={11}
                        height={21}
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-[12px] items-start w-[257px]">
                  <div className="flex gap-[5px] items-center w-[96px]">
                    <input
                      type="radio"
                      id="am-pre"
                      name="am-medication"
                      checked={formData.am.preMedication}
                      onChange={() =>
                        setFormData({
                          ...formData,
                          am: {
                            ...formData.am,
                            preMedication: true,
                            postMedication: false,
                          },
                        })
                      }
                      disabled={isSaved && !isEditing}
                      className="size-[15px]"
                    />
                    <label
                      htmlFor="am-pre"
                      className="font-normal text-[11px] text-black tracking-[0.11px] whitespace-nowrap"
                    >
                      Pre Medication
                    </label>
                  </div>
                  <div className="flex gap-[5px] items-center w-[118px]">
                    <input
                      type="radio"
                      id="am-post"
                      name="am-medication"
                      checked={formData.am.postMedication}
                      onChange={() =>
                        setFormData({
                          ...formData,
                          am: {
                            ...formData.am,
                            preMedication: false,
                            postMedication: true,
                          },
                        })
                      }
                      disabled={isSaved && !isEditing}
                      className="size-[15px]"
                    />
                    <label
                      htmlFor="am-post"
                      className="font-normal text-[11px] text-[#757575] tracking-[0.44px] whitespace-nowrap"
                    >
                      Post Medication
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-0 w-[351px] relative">
              <div className="absolute inset-0 border-t border-[#d1d1d1]"></div>
            </div>

            {/* PM Section */}
            <div className="flex flex-col gap-[26px] items-start w-[263px]">
              <div className="flex flex-col gap-[13px] items-start w-full">
                <div className="flex gap-[4px] items-center">
                  <p className="font-normal text-[12px] text-black tracking-[0.12px] whitespace-nowrap">
                    PM
                  </p>
                  <div className="relative shrink-0 size-[12px]">
                    <Image
                      src="/fluent-mdl2_clear-night.svg"
                      alt="PM"
                      width={12}
                      height={12}
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid justify-items-start leading-[0] relative shrink-0">
                  <div className="box-border col-[1] content-stretch flex flex-col gap-[5px] items-start ml-0 mt-0 relative row-[1] w-[113px]">
                    <input
                      type="number"
                      value={formData.pm.systolic}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pm: { ...formData.pm, systolic: e.target.value },
                        })
                      }
                      disabled={isSaved && !isEditing}
                      className={`border border-[#d1d1d1] border-solid h-[40px] rounded-[10px] shrink-0 w-full px-3 ${
                        isSaved && !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
                      }`}
                    />
                    <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#7e7e7e] text-[12px] tracking-[-0.12px] w-full whitespace-pre-wrap">
                      Systolic (mm/Hg)
                    </p>
                  </div>
                  <div className="box-border col-[1] content-stretch flex flex-col gap-[5px] items-start ml-[150px] mt-0 relative row-[1]">
                    <input
                      type="number"
                      value={formData.pm.diastolic}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pm: { ...formData.pm, diastolic: e.target.value },
                        })
                      }
                      disabled={isSaved && !isEditing}
                      className={`border border-[#d1d1d1] border-solid h-[40px] rounded-[10px] shrink-0 w-full px-3 ${
                        isSaved && !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
                      }`}
                    />
                    <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#7e7e7e] text-[12px] tracking-[-0.12px] w-full whitespace-pre-wrap">
                      Diastolic (mm/Hg)
                    </p>
                  </div>
                  <div className="col-[1] h-[21px] ml-[126px] mt-[11px] relative row-[1] w-[11px]">
                    <div className="absolute inset-[-2.38%_-4.55%]">
                      <Image
                        src="/Vector 14.svg"
                        alt="Slash"
                        width={11}
                        height={21}
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-[12px] items-start w-[257px]">
                  <div className="flex gap-[5px] items-center w-[96px]">
                    <input
                      type="radio"
                      id="pm-pre"
                      name="pm-medication"
                      checked={formData.pm.preMedication}
                      onChange={() =>
                        setFormData({
                          ...formData,
                          pm: {
                            ...formData.pm,
                            preMedication: true,
                            postMedication: false,
                          },
                        })
                      }
                      disabled={isSaved && !isEditing}
                      className="size-[15px]"
                    />
                    <label
                      htmlFor="pm-pre"
                      className="font-normal text-[11px] text-black tracking-[0.11px] whitespace-nowrap"
                    >
                      Pre Medication
                    </label>
                  </div>
                  <div className="flex gap-[5px] items-center w-[118px]">
                    <input
                      type="radio"
                      id="pm-post"
                      name="pm-medication"
                      checked={formData.pm.postMedication}
                      onChange={() =>
                        setFormData({
                          ...formData,
                          pm: {
                            ...formData.pm,
                            preMedication: false,
                            postMedication: true,
                          },
                        })
                      }
                      disabled={isSaved && !isEditing}
                      className="size-[15px]"
                    />
                    <label
                      htmlFor="pm-post"
                      className="font-normal text-[11px] text-[#757575] tracking-[0.44px] whitespace-nowrap"
                    >
                      Post Medication
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-0 w-[351px] relative">
          <div className="absolute inset-0 border-t border-[#d1d1d1]"></div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-[16px] items-center">
        {!isSaved && (
          <button
            type="button"
            onClick={onCancel}
            className="border border-black border-solid box-border content-stretch flex gap-[10px] h-[35px] items-center justify-center px-[13px] py-[10px] relative rounded-[20px] shrink-0 w-[92px]"
          >
            <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1d1d1d] text-[12px] tracking-[-0.12px]">
              Cancel
            </p>
          </button>
        )}
        {!isSaved ? (
          <button
            type="submit"
            className="bg-[#212121] box-border flex gap-[10px] h-[35px] items-center justify-center px-[11px] py-[6px] rounded-[20px] w-[148px]"
          >
            <p className="font-normal text-white text-[12px] tracking-[-0.12px] whitespace-nowrap">
              Save
            </p>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleEdit}
            className="bg-[#212121] box-border flex gap-[10px] h-[35px] items-center justify-center px-[11px] py-[6px] rounded-[20px] w-[148px]"
          >
            <p className="font-normal text-white text-[12px] tracking-[-0.12px] whitespace-nowrap">
              Edit
            </p>
          </button>
        )}
      </div>
    </form>
  );
}

