'use client';

import Image from 'next/image';
import { generateBloodPressurePDF } from '@/lib/pdfGeneratorHtml';
import { useAuth } from '@/lib/authContext';
import type { BloodPressureRecord } from '@/types';

interface TrendsChartProps {
  records: BloodPressureRecord[];
  fromDate: Date;
  toDate: Date;
  onShowSignInModal?: () => void;
}

export default function TrendsChart({ records, fromDate, toDate, onShowSignInModal }: TrendsChartProps) {
  const { user } = useAuth();
  const isSignedIn = !!user;

  const handleDownload = async () => {
    if (!isSignedIn) {
      onShowSignInModal?.();
      return;
    }

    if (records.length === 0) {
      alert('No records available to download.');
      return;
    }

    await generateBloodPressurePDF({
      records,
      fromDate,
      toDate,
      userName: user?.name || undefined, // Pull from Google sign-in
      userEmail: user?.email || undefined, // Pull from Google sign-in
    });
  };

  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="37:4001">
        <div className="content-stretch flex gap-[4px] items-end justify-center relative shrink-0" data-node-id="37:4002">
          <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[20px] text-black tracking-[0.2px]" data-node-id="37:4003">
            Blood Pressure Trends
          </p>
          <div className="overflow-clip relative shrink-0 size-[17px]" data-name="uil:calender" data-node-id="37:4004">
            <div className="absolute inset-[-20.59%]" data-name="gridicons:line-graph" data-node-id="37:4005">
              <Image
                src="/gridicons_line-graph.svg"
                alt="Trends"
                width={17}
                height={17}
                className="object-contain"
                />
            </div>
          </div>
        </div>
        <button
          onClick={handleDownload}
          className="bg-[#212121] box-border content-stretch flex gap-[10px] h-[35px] items-center justify-center px-[11px] py-[6px] relative rounded-[20px] shrink-0 w-[179px] cursor-pointer hover:opacity-90 transition-opacity"
          data-node-id="37:4007"
        >
          <div className="relative shrink-0 size-[24px]" data-name="material-symbols:download-rounded" data-node-id="37:4008">
            <Image
              src="/material-symbols_download-rounded.svg"
              alt="Download"
              width={24}
              height={24}
              className="object-contain"
              />
          </div>
          <div className="content-stretch flex gap-[3px] items-center relative shrink-0" data-node-id="37:4010">
            <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-white tracking-[-0.12px]" data-node-id="37:4011">
            Download Full report
          </p>
          </div>
        </button>
    </div>
  );
}
