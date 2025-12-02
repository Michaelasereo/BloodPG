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
  const [originalFormData, setOriginalFormData] = useState<BloodPressureFormData | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);

  // Load existing data when date changes or when records are loaded
  useEffect(() => {
    // Don't reload if user is currently editing
    if (isEditing) {
      return;
    }

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
      const loadedData = {
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
      };
      setFormData(loadedData);
      setOriginalFormData(loadedData);
      setIsSaved(true);
      setIsEditing(false);
    } else {
      console.log('ℹ️ No record found for date:', selectedDateStr);
      // Reset to empty form (this will run when records are loaded and no match is found)
      const emptyData = {
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
      };
      setFormData(emptyData);
      setOriginalFormData(emptyData);
      setIsSaved(false);
      setIsEditing(false);
    }
  }, [selectedDate, allRecords, isEditing]);

  // Validate blood pressure input
  const validateBPInput = (value: string, isSystolic: boolean, otherValue: string): string => {
    // Remove any non-digit characters
    let cleaned = value.replace(/[^\d]/g, '');
    
    // Limit to 3 digits
    if (cleaned.length > 3) {
      cleaned = cleaned.slice(0, 3);
    }
    
    return cleaned;
  };

  // Validate that systolic > diastolic
  const validateBPValues = (systolic: string, diastolic: string): boolean => {
    const sys = parseInt(systolic);
    const dia = parseInt(diastolic);
    
    if (isNaN(sys) || isNaN(dia)) return true; // Allow empty values during input
    if (sys <= dia) {
      alert('Systolic must be greater than Diastolic');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate AM readings
    if (formData.am.systolic && formData.am.diastolic) {
      if (!validateBPValues(formData.am.systolic, formData.am.diastolic)) {
        return;
      }
    }
    
    // Validate PM readings
    if (formData.pm.systolic && formData.pm.diastolic) {
      if (!validateBPValues(formData.pm.systolic, formData.pm.diastolic)) {
        return;
      }
    }
    
    const success = await onSave(formData);
    // Only mark as saved if save was successful
    if (success) {
      setIsSaved(true);
      setIsEditing(false);
      setShowSuccessScreen(true);
      // Auto-hide success screen after 5 seconds
      setTimeout(() => {
        setShowSuccessScreen(false);
      }, 5000);
    }
    // If save failed (e.g., user not authenticated), keep form editable
  };

  // Listen for save success event (after sign-in auto-save)
  useEffect(() => {
    const handleSaveSuccess = () => {
      setIsSaved(true);
      setIsEditing(false);
      setShowSuccessScreen(true);
      // Auto-hide success screen after 5 seconds
      setTimeout(() => {
        setShowSuccessScreen(false);
      }, 5000);
    };

    window.addEventListener('bloodpg:save-success', handleSaveSuccess);
    return () => {
      window.removeEventListener('bloodpg:save-success', handleSaveSuccess);
    };
  }, []);

  const handleEdit = () => {
    // Store current values as original before editing
    setOriginalFormData({ ...formData });
    setIsEditing(true);
    setIsSaved(false);
  };

  const handleCancel = () => {
    // Restore original values
    if (originalFormData) {
      setFormData({ ...originalFormData });
    }
    setIsEditing(false);
    setIsSaved(true);
    onCancel();
  };

  // Listen for record updates to refresh form if current date's record was updated
  useEffect(() => {
    // Don't reload if user is currently editing
    if (isEditing) {
      return;
    }

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
        const loadedData = {
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
        };
        setFormData(loadedData);
        setOriginalFormData(loadedData);
        setIsSaved(true);
        setIsEditing(false);
      }
    };

    window.addEventListener('bloodpg:record-saved', handleRecordSaved);
    return () => {
      window.removeEventListener('bloodpg:record-saved', handleRecordSaved);
    };
  }, [selectedDate, allRecords, isEditing]);

  return (
    <div className="relative w-full">
      {/* Success Screen Overlay - positioned at bottom of sidebar content area */}
      {showSuccessScreen && (
        <div className="absolute left-[-14.5px] top-[417px] z-50 bg-[#1f1f1f] rounded-tl-[18.18px] rounded-tr-[18.18px] flex flex-col items-center justify-center px-[51.076px] py-[39.822px] w-[419px] h-[315px]">
          {/* Close Button */}
          <button
            onClick={() => setShowSuccessScreen(false)}
            className="absolute top-[19px] right-[19px] size-[21.973px] hover:opacity-80 transition-opacity"
            aria-label="Close"
          >
            <Image
              src="/ic_round-cancel.svg"
              alt="Close"
              width={22}
              height={22}
              className="object-contain"
            />
          </button>

          {/* Logo */}
          <div className="flex gap-[4.329px] items-center mb-[19.045px]">
            <div className="h-[14.867px] w-[66.173px] relative">
              <Image
                src="/official-logo.svg"
                alt="BloodPG Logo"
                width={66}
                height={15}
                className="object-contain brightness-0 invert"
              />
            </div>
            <div className="h-[12.986px] w-[27.702px] relative">
              <Image
                src="/beta.svg"
                alt="Beta"
                width={28}
                height={13}
                className="object-contain brightness-0 invert"
              />
            </div>
          </div>

          {/* Check Badge Icon */}
          <div className="relative size-[62px] mb-[21.643px]">
            <Image
              src="/streamline-ultimate_check-badge-bold.svg"
              alt="Success"
              width={62}
              height={62}
              className="object-contain"
            />
          </div>

          {/* Success Message */}
          <p className="font-medium text-[25.91px] text-white text-center mb-[21.643px] tracking-[-0.7773px]">
            Blood Pressure Saved!🎉
          </p>

          {/* Notification Box */}
          <div className="flex flex-col gap-[7.791px] items-center w-[292.607px]">
            <div className="border border-white border-solid rounded-[8.657px] p-[7.791px] w-full">
              <div className="flex gap-[2.597px] items-start">
                <div className="relative size-[16px] mt-[2px] shrink-0">
                  <Image
                    src="/mingcute_notification-fill.svg"
                    alt="Notification"
                    width={16}
                    height={16}
                    className="object-contain"
                  />
                </div>
                <p className="font-medium text-[10.388px] text-white leading-[12.986px] tracking-[-0.3117px] flex-1">
                  Your reading has been successfully recorded securely!
                </p>
              </div>
            </div>
            <p className="font-medium text-[#727272] text-[8.657px] tracking-[-0.4329px] text-center">
              Keep tracking—every entry helps you stay informed.
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-[19px] items-end justify-center w-[352px] relative">
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
                      type="text"
                      inputMode="numeric"
                      value={formData.am.systolic}
                      onChange={(e) => {
                        const validated = validateBPInput(e.target.value, true, formData.am.diastolic);
                        setFormData({
                          ...formData,
                          am: { ...formData.am, systolic: validated },
                        });
                      }}
                      disabled={isSaved && !isEditing}
                      maxLength={3}
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
                      type="text"
                      inputMode="numeric"
                      value={formData.am.diastolic}
                      onChange={(e) => {
                        const validated = validateBPInput(e.target.value, false, formData.am.systolic);
                        setFormData({
                          ...formData,
                          am: { ...formData.am, diastolic: validated },
                        });
                      }}
                      disabled={isSaved && !isEditing}
                      maxLength={3}
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
                      type="text"
                      inputMode="numeric"
                      value={formData.pm.systolic}
                      onChange={(e) => {
                        const validated = validateBPInput(e.target.value, true, formData.pm.diastolic);
                        setFormData({
                          ...formData,
                          pm: { ...formData.pm, systolic: validated },
                        });
                      }}
                      disabled={isSaved && !isEditing}
                      maxLength={3}
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
                      type="text"
                      inputMode="numeric"
                      value={formData.pm.diastolic}
                      onChange={(e) => {
                        const validated = validateBPInput(e.target.value, false, formData.pm.systolic);
                        setFormData({
                          ...formData,
                          pm: { ...formData.pm, diastolic: validated },
                        });
                      }}
                      disabled={isSaved && !isEditing}
                      maxLength={3}
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
        {isSaved && !isEditing ? (
          <button
            type="button"
            onClick={handleEdit}
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
              onClick={handleCancel}
              className="border border-black border-solid box-border content-stretch flex gap-[10px] h-[35px] items-center justify-center px-[13px] py-[10px] relative rounded-[20px] shrink-0 w-[92px]"
            >
              <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1d1d1d] text-[12px] tracking-[-0.12px]">
                Cancel
              </p>
            </button>
            <button
              type="submit"
              className="bg-[#212121] box-border content-stretch flex gap-[10px] h-[35px] items-center justify-center px-[11px] py-[6px] relative rounded-[20px] shrink-0 w-[148px]"
            >
              <div className="content-stretch flex gap-[3px] items-center relative shrink-0">
                <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-white tracking-[-0.12px]">
                  Save
                </p>
              </div>
            </button>
          </>
        )}
      </div>
    </form>
    </div>
  );
}

