'use client';

import Image from 'next/image';

interface AdminSidebarProps {
  onClearData?: () => void;
}

export default function AdminSidebar({ onClearData }: AdminSidebarProps) {
  return (
    <div className="h-[774px] relative shrink-0 w-[420px]">
      <div className="absolute bg-white box-border content-stretch flex gap-[10px] items-center justify-center left-0 px-[15px] py-[22px] rounded-[12px] top-[42px] w-[420px]">
        <div className="h-[688px] relative shrink-0 w-[387px]">
          <div className="absolute box-border content-stretch flex flex-col gap-[18px] items-center left-[-14.5px] p-[18px] top-[-21px] w-[417px]">
            <div className="h-[690px] relative shrink-0 w-[379px]">
              <div className="absolute bg-[#e4e4e4] box-border content-stretch flex gap-[5px] h-[64px] items-center left-0 px-[15px] py-0 rounded-[10px] top-0 w-[343px]">
                <div className="relative shrink-0 size-[24px]">
                  <Image
                    src="/logobloodpressure.svg"
                    alt="Blood Pressure"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
                <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-black tracking-[-0.24px]">
                  Admin Dashboard
                </p>
              </div>
              
              {/* Clear Data Button */}
              {onClearData && (
                <div className="absolute left-0 top-[80px]">
                  <button
                    onClick={onClearData}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-[8px] text-[12px] font-medium transition-colors"
                  >
                    Clear All Data
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
