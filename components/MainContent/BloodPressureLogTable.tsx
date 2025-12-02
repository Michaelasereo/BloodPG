'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { formatDateOrdinal } from '@/lib/dateUtils';
import { formatMedicationWithDosage } from '@/lib/medicationUtils';
import type { BloodPressureRecord } from '@/types';

interface BloodPressureLogTableProps {
  records: BloodPressureRecord[];
}

type SortDirection = 'asc' | 'desc';

export default function BloodPressureLogTable({
  records,
}: BloodPressureLogTableProps) {
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Sort records by date
  const sortedRecords = useMemo(() => {
    const sorted = [...records];
    sorted.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });
    return sorted;
  }, [records, sortDirection]);

  const handleSort = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Show empty state if no records
  if (records.length === 0) {
    return (
      <div className="bg-neutral-50 border border-[#eaeaea] border-solid relative rounded-[12px] shrink-0 w-full">
        <div className="content-stretch flex items-center justify-center h-[200px] relative rounded-[inherit] w-full">
          <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[16px] text-[#757575]">
            No records found. Start by entering your blood pressure data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 border border-[#eaeaea] border-solid relative rounded-[12px] shrink-0 w-full">
      <div className="content-stretch flex items-start overflow-clip relative rounded-[inherit] w-full">
        {/* S/N Column */}
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-[73px]">
          <div className="bg-[#ededed] border-[#bcbcbc] border-b border-l-0 border-r border-solid border-t-0 box-border content-stretch flex h-[60px] items-center justify-center px-[24px] py-[12px] relative shrink-0 w-full">
            <p className="flex-[1_0_0] font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[12.41px] text-black whitespace-pre-wrap">
                  S/N
                </p>
          </div>
          {sortedRecords.map((record, index) => (
            <div
              key={`sn-${record.id}`}
              className="bg-white border-[#dadada] border-b border-l-0 border-r border-solid border-t-0 box-border content-stretch flex h-[64px] items-center justify-center px-[24px] py-[12px] relative shrink-0 w-full"
            >
              <p className="flex-[1_0_0] font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black whitespace-pre-wrap">
                {index + 1}
              </p>
            </div>
          ))}
        </div>

        {/* Date Column */}
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-[129px]">
          <div className="bg-[#ededed] border-[#bcbcbc] border-b border-l-0 border-r border-solid border-t-0 box-border content-stretch flex h-[60px] items-center px-[24px] py-[12px] relative shrink-0 w-full">
            <p className="flex-[1_0_0] font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[12.41px] text-black whitespace-pre-wrap">
                    Date
                  </p>
            <button
              onClick={handleSort}
              className="box-border content-stretch flex flex-col items-center justify-center pb-[2.659px] pt-0 px-0 relative shrink-0 w-[10.637px] cursor-pointer hover:opacity-70 transition-opacity"
              aria-label={`Sort by date ${sortDirection === 'asc' ? 'descending' : 'ascending'}`}
            >
              <div className="flex items-center justify-center mb-[-2.659px] relative shrink-0 w-full">
                <div className={`flex-none w-full transition-transform ${sortDirection === 'asc' ? 'rotate-0' : 'rotate-180'}`}>
                  <div className="aspect-[24/24] overflow-clip relative size-full">
                    <div className="absolute contents inset-0">
                      <Image
                        src="/mingcute_down-line.svg"
                        alt="Sort up"
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="aspect-[24/24] mb-[-2.659px] overflow-clip relative shrink-0 w-full">
                <div className="absolute contents inset-0">
                  <Image
                    src="/mingcute_down-line.svg"
                    alt="Sort down"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
              </div>
            </button>
          </div>
          {sortedRecords.map((record) => (
            <div
              key={`date-${record.id}`}
              className="bg-white border-[#dadada] border-b border-l-0 border-r border-solid border-t-0 box-border content-stretch flex h-[64px] items-center justify-center px-[24px] py-[12px] relative shrink-0 w-full"
            >
              <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14.183px] text-black tracking-[0.1418px] w-[105px] whitespace-pre-wrap">
                {formatDateOrdinal(record.date)}
            </p>
            </div>
          ))}
          </div>

        {/* BP (AM) Column */}
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-[117px]">
          <div className="bg-[#ededed] border-[#bcbcbc] border-b border-l-0 border-r border-solid border-t-0 box-border content-stretch flex h-[60px] items-center px-[24px] py-[12px] relative shrink-0 w-full">
            <div className="content-stretch flex flex-col items-start leading-[normal] not-italic relative shrink-0 text-[12.41px] text-black w-[46.981px]">
              <p className="font-['Helvetica_Neue:Medium',sans-serif] relative shrink-0">
                BP (AM)
                      </p>
              <p className="font-['Helvetica_Neue:Regular',sans-serif] relative shrink-0 tracking-[0.1241px]">
                mmHG
                      </p>
                    </div>
          </div>
          {sortedRecords.map((record) => (
            <div
              key={`am-${record.id}`}
              className="bg-white border-[#dadada] border-b border-l-0 border-r border-solid border-t-0 box-border content-stretch flex h-[64px] items-center justify-center gap-[8px] px-[24px] py-[12px] relative shrink-0 w-[117px]"
            >
              <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[17.729px] text-black tracking-[0.1773px] whitespace-nowrap">
                        {record.am.systolic}/{record.am.diastolic}
                      </p>
              {record.am.postMedication && (
                <div className="relative shrink-0 size-[12px]">
                  <Image
                    src="/mdi_drugs.svg"
                    alt="Medication"
                    width={12}
                    height={12}
                    className="object-contain"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* BP (PM) Column */}
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-[136px]">
          <div className="bg-[#ededed] border-[#bcbcbc] border-b border-l-0 border-r border-solid border-t-0 box-border content-stretch flex h-[60px] items-center px-[24px] py-[12px] relative shrink-0 w-full">
            <div className="content-stretch flex flex-col items-start leading-[normal] not-italic relative shrink-0 text-[12.41px] text-black w-[51.413px]">
              <p className="font-['Helvetica_Neue:Medium',sans-serif] relative shrink-0">
                BP (PM)
              </p>
              <p className="font-['Helvetica_Neue:Regular',sans-serif] relative shrink-0 tracking-[0.1241px]">
                mmHG
              </p>
            </div>
          </div>
          {sortedRecords.map((record) => (
            <div
              key={`pm-${record.id}`}
              className="bg-white border-[#dadada] border-b border-l-0 border-r border-solid border-t-0 box-border content-stretch flex h-[64px] items-center justify-center gap-[8px] px-[24px] py-[12px] relative shrink-0 w-full"
            >
              <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[17.729px] text-black tracking-[0.1773px] whitespace-nowrap">
                        {record.pm.systolic}/{record.pm.diastolic}
                      </p>
              {record.pm.postMedication && (
                <div className="relative shrink-0 size-[12px]">
                  <Image
                    src="/mdi_drugs.svg"
                    alt="Medication"
                    width={12}
                    height={12}
                    className="object-contain"
                  />
                </div>
              )}
                    </div>
                    ))}
                  </div>

        {/* Current Medications Column */}
        <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative shrink-0">
          <div className="bg-[#ededed] border-[#bcbcbc] border-b border-l-0 border-r-0 border-solid border-t-0 box-border content-stretch flex h-[60px] items-center px-[24px] py-[12px] relative shrink-0 w-full">
            <p className="flex-[1_0_0] font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[12.41px] text-black whitespace-pre-wrap">
              Current Medications
            </p>
                </div>
          {sortedRecords.map((record) => (
            <div
              key={`meds-${record.id}`}
              className="bg-white border-[#dadada] border-b border-l-0 border-r-0 border-solid border-t-0 box-border content-stretch flex min-h-[64px] items-center px-[24px] py-[12px] relative shrink-0 w-full"
              style={{ height: record.medications.length > 2 ? 'auto' : '64px' }}
            >
              <div className="content-stretch flex flex-col font-['Helvetica_Neue:Italic',sans-serif] gap-[7.091px] items-start leading-[normal] not-italic relative shrink-0 text-[13.296px] text-black tracking-[-0.6648px] w-full max-w-[250px] whitespace-pre-wrap">
                {record.medications.map((med, medIndex) => {
                  // Format medication: ensure "Tabs" prefix and "mg" in dosage
                  let formattedMed = formatMedicationWithDosage(med);
                  formattedMed = formattedMed.startsWith('Tabs') ? formattedMed : `Tabs ${formattedMed}`;
                  return (
                    <div key={medIndex} className="flex items-center gap-[4px] relative shrink-0 w-[202.992px]">
                      <div className="relative shrink-0 size-[12px]">
                        <Image
                          src="/mdi_drugs.svg"
                          alt="Medication"
                          width={12}
                          height={12}
                          className="object-contain"
                        />
                      </div>
                      <p className="relative shrink-0">
                        -{formattedMed}
                      </p>
                    </div>
                  );
                })}
                {record.medications.length === 0 && (
                  <p className="relative shrink-0 w-[202.992px] text-[#757575]">
                    -
                  </p>
                )}
              </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
