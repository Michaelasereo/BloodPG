'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import LogoIcon from '@/components/LogoIcon/LogoIcon';

interface SetDefaultMedicationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  medications: Array<{name: string, dosage: string, frequency: string}>;
  onSetAsDefault: () => void;
}

export default function SetDefaultMedicationsModal({
  isOpen,
  onClose,
  medications,
  onSetAsDefault,
}: SetDefaultMedicationsModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white border border-black border-solid rounded-[21px] w-full max-w-[484px] px-[59px] py-[46px] relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 size-[24px] hover:opacity-70 transition-opacity flex items-center justify-center"
            aria-label="Close"
          >
            <Image
              src="/ic_round-cancel.svg"
              alt="Close"
              width={24}
              height={24}
              className="object-contain"
            />
          </button>

          {/* Content */}
          <div className="flex flex-col gap-[21px] items-center justify-center w-full">
            {/* Logo */}
            <div className="flex gap-[5px] h-[32px] items-center">
              <LogoIcon />
            </div>

            {/* Medications List */}
            <div className="bg-white border-[#dadada] border-b border-l-0 border-r-0 border-solid border-t-0 box-border flex h-[64px] items-center justify-center px-[24px] py-[12px] relative shrink-0 w-[267px]">
              <div className="flex flex-col font-['Helvetica_Neue:Italic',sans-serif] gap-[7.091px] items-start leading-[normal] not-italic relative shrink-0 text-[13.296px] text-black tracking-[-0.6648px] w-[190.603px] whitespace-pre-wrap">
                {medications.map((med, index) => {
                  const formattedMed = med.name.startsWith('Tabs') 
                    ? `${med.name} ${med.dosage || ''} ${med.frequency || ''}`.trim()
                    : `Tabs ${med.name} ${med.dosage || ''} ${med.frequency || ''}`.trim();
                  return (
                    <div key={index} className="flex items-center gap-[4px] relative shrink-0 w-[202.992px]">
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
              </div>
            </div>

            {/* Title and Content */}
            <div className="flex flex-col gap-[25px] items-center relative shrink-0 w-full">
              <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[29.93px] text-black text-center tracking-[-0.8979px] whitespace-pre-wrap">
                Save as your default medication
              </p>
              
              <div className="flex flex-col gap-[9px] items-end relative shrink-0 w-[338px]">
                {/* Info Box */}
                <div className="border border-black border-solid box-border flex flex-col gap-[10px] h-[49px] items-start p-[9px] relative rounded-[10px] shrink-0 w-full">
                  <div className="flex gap-[3px] items-start relative shrink-0">
                    <div className="box-border flex gap-[10px] items-center overflow-clip px-[2px] py-[3px] relative shrink-0">
                      <div className="h-[15.835px] relative shrink-0 w-[8.938px]">
                        <Image
                          src="/mingcute_notification-fill.svg"
                          alt="Notification"
                          width={9}
                          height={16}
                          className="object-contain w-full h-full"
                        />
                      </div>
                    </div>
                    <div className="font-['Helvetica_Neue:Medium',sans-serif] leading-[15px] not-italic relative shrink-0 text-[12px] text-black tracking-[-0.36px] w-[303px] whitespace-pre-wrap">
                      <p className="mb-0">
                        <span>Prevents you from entering the same medications daily. </span>
                        <span className="text-[#818181]">When medication changes, edit in the medications tab </span>
                      </p>
                      <p>&nbsp;</p>
                    </div>
                  </div>
                </div>

                {/* Set as Default Button */}
                <div className="flex flex-col gap-[5px] items-center justify-center relative shrink-0 w-full">
                  <button
                    onClick={onSetAsDefault}
                    className="bg-[#2e2e2e] border border-black border-solid box-border flex flex-col gap-[10px] h-[45px] items-center justify-center px-[89px] py-[14px] relative rounded-[10px] shrink-0 w-full hover:opacity-90 transition-opacity"
                  >
                    <div className="flex gap-[9px] items-center relative shrink-0">
                      <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-white tracking-[-0.42px]">
                        Set as default
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

