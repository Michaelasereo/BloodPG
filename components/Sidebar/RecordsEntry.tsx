'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { formatDateOrdinal, getDateRangeForFilter, type DateFilter } from '@/lib/dateUtils';
import type { BloodPressureRecord } from '@/types';

interface RecordsEntryProps {
  selectedDate: Date;
  allRecords: BloodPressureRecord[];
  recordsLoaded: boolean;
}

export default function RecordsEntry({ selectedDate, allRecords, recordsLoaded }: RecordsEntryProps) {
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');

  // Listen for filter changes from RecordsDateFilter
  useEffect(() => {
    const handleFilterChanged = (event: CustomEvent) => {
      setDateFilter(event.detail);
    };
    
    window.addEventListener('bloodpg:filter-changed', handleFilterChanged as EventListener);
    
    return () => {
      window.removeEventListener('bloodpg:filter-changed', handleFilterChanged as EventListener);
    };
  }, []);

  // INSTANT filtering - no loading time! All client-side
  const filteredRecords = useMemo(() => {
    if (!recordsLoaded || !allRecords.length) return [];
    
    const { start, end } = getDateRangeForFilter(dateFilter);
    
    return allRecords.filter(record => {
      const recordDate = new Date(record.date);
      recordDate.setHours(0, 0, 0, 0);
      return recordDate >= start && recordDate <= end;
    });
  }, [allRecords, dateFilter, recordsLoaded]);

  const handleDownloadRecord = useCallback((record: BloodPressureRecord) => {
    console.log('Download record:', record.id);
    // TODO: Implement download functionality
    alert(`Downloading record for ${formatDateOrdinal(record.date)}`);
  }, []);

  const handleDownloadAll = useCallback(() => {
    console.log('Download all records');
    // TODO: Implement download all functionality
    alert('Downloading all records...');
  }, []);

  // Show loading only on initial app load, not when clicking the tab
  if (!recordsLoaded) {
    return (
      <div className="flex items-center justify-center h-[400px] w-full">
        <p className="text-gray-500">Loading records...</p>
      </div>
    );
  }

  return (
    <div className="content-stretch flex flex-col gap-[17px] items-end relative shrink-0 w-[375px]">
      <div className="content-stretch flex flex-col gap-[26px] items-start relative shrink-0 w-full">
        {/* Header */}
        <div className="content-stretch flex flex-col gap-[2px] items-start not-italic relative shrink-0 w-[276px] whitespace-pre-wrap">
          <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] relative shrink-0 text-[17px] text-black tracking-[-0.17px] w-full">
            Blood Pressure Records
          </p>
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[20px] relative shrink-0 text-[14px] text-neutral-400 tracking-[-0.42px] w-full">
            Review your past entries and trends.
          </p>
        </div>

        {/* Records List - Scrollable */}
        <div className="content-stretch flex flex-col gap-[26px] items-start relative shrink-0 w-full overflow-y-auto max-h-[400px]">
          {filteredRecords.length === 0 ? (
            <div className="text-center text-gray-500 w-full py-8">
              No records found for the selected period. Start by entering your blood pressure data.
            </div>
          ) : (
            filteredRecords.map((record, index) => (
              <div
                key={record.id}
                className="bg-[#f3f3f3] border border-[#f9f9f9] border-solid box-border content-stretch flex flex-col gap-[18px] items-start px-[16px] py-[9px] relative rounded-[10px] shrink-0 w-full"
              >
                {/* Date */}
                <div className="content-stretch flex items-center relative shrink-0 w-full">
                  <div className="content-stretch flex gap-[7px] items-center relative shrink-0">
                    <div className="bg-[#212121] box-border content-stretch flex flex-col gap-[10px] items-center justify-center px-[5px] py-px relative rounded-[9.5px] shrink-0 size-[19px]">
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-white tracking-[0.14px]">
                        {index + 1}
                      </p>
                    </div>
                    <p className="font-['Helvetica_Neue:Medium_Italic',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-black tracking-[0.28px]">
                      {formatDateOrdinal(record.date)}
                    </p>
                  </div>
                </div>

                {/* AM/PM Readings */}
                <div className="content-stretch flex gap-[33px] items-end relative shrink-0 w-[319px]">
                  {/* AM Reading */}
                  <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-[126px]">
                    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-black tracking-[0.12px]">
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
                    <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[20px] text-black tracking-[-0.2px] w-[126px] whitespace-pre-wrap">
                      {record.am.systolic}/{record.am.diastolic}mmHg
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="h-[21px] relative shrink-0 w-0">
                    <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0">
                      <Image
                        src="/Vector 16.svg"
                        alt="Divider"
                        width={1}
                        height={21}
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* PM Reading */}
                  <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-[97px]">
                    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-black tracking-[0.12px]">
                        PM
                      </p>
                      <div className="relative shrink-0 size-[14px]">
                        <Image
                          src="/fluent-mdl2_clear-night.svg"
                          alt="PM"
                          width={14}
                          height={14}
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[20px] text-black tracking-[-0.2px] w-[122px] whitespace-pre-wrap">
                      {record.pm.systolic}/{record.pm.diastolic}mmHg
                    </p>
                  </div>
                </div>

                {/* Current Medications - Always show, even if empty */}
                <div className="bg-[#f7f7f7] content-stretch flex flex-col items-start relative rounded-bl-[8px] rounded-br-[8px] shrink-0 w-full">
                  <div className="bg-[#5f5f5f] box-border content-stretch flex gap-[10px] items-center p-[10px] relative rounded-tl-[8px] rounded-tr-[8px] shrink-0 w-full">
                    <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-white tracking-[-0.36px]">
                      Current Medications
                    </p>
                  </div>
                  <div className="box-border content-stretch flex gap-[13px] items-center px-[12px] py-[6px] relative rounded-bl-[8px] rounded-br-[8px] shrink-0 w-full">
                    {record.medications && record.medications.length > 0 ? (
                      record.medications.map((medication, medIndex) => {
                        // Format medication string if needed (ensure "Tabs" prefix)
                        const formattedMed = medication.startsWith('Tabs') ? medication : `Tabs ${medication}`;
                        return (
                          <div key={medIndex} className="flex items-center gap-[13px]">
                            {medIndex > 0 && (
                              <div className="h-[25px] relative shrink-0 w-0">
                                <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0">
                                  <Image
                                    src="/Vector 22.svg"
                                    alt="Divider"
                                    width={1}
                                    height={25}
                                    className="object-contain"
                                  />
                                </div>
                              </div>
                            )}
                            <div className="flex items-center gap-[4px]">
                              <div className="relative shrink-0 size-[12px]">
                                <Image
                                  src="/mdi_drugs.svg"
                                  alt="Medication"
                                  width={12}
                                  height={12}
                                  className="object-contain"
                                />
                              </div>
                              <p className="font-['Helvetica_Neue:Italic',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-black tracking-[-0.36px]">
                                {formattedMed}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="font-['Helvetica_Neue:Italic',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-neutral-400 tracking-[-0.36px]">
                        No medications recorded
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="h-0 relative shrink-0 w-[351px]">
        <div className="absolute bottom-[-0.5px] left-0 right-0 top-[-0.5px] border-t border-[#d1d1d1]"></div>
      </div>

      {/* Download All Button */}
      <button
        onClick={handleDownloadAll}
        className="bg-[#212121] box-border content-stretch flex gap-[10px] h-[35px] items-center justify-center px-[11px] py-[6px] relative rounded-[20px] shrink-0 w-[148px] hover:opacity-90 transition-opacity"
      >
        <div className="relative shrink-0 size-[24px]">
          <Image
            src="/material-symbols_download-rounded.svg"
            alt="Download"
            width={24}
            height={24}
            className="object-contain"
          />
        </div>
        <div className="content-stretch flex gap-[3px] items-center relative shrink-0">
          <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-white tracking-[-0.12px]">
            Download All
          </p>
        </div>
      </button>
    </div>
  );
}

