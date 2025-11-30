'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import type { MainTab } from '@/types';

interface MainTabsProps {
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
}

export default function MainTabs({ activeTab, onTabChange }: MainTabsProps) {
  const [showProModal, setShowProModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleProClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent tab switch
    setShowProModal(true);
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showProModal) {
        setShowProModal(false);
      }
    };

    if (showProModal) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showProModal]);

  return (
    <>
      <div className="content-stretch flex gap-[3px] items-center relative shrink-0">
        <button
          onClick={() => onTabChange('blood-pressure')}
          className={`box-border content-stretch flex gap-[4px] h-[23px] items-center justify-center px-[9px] py-[5px] relative rounded-[14px] shrink-0 cursor-pointer transition-colors ${
            activeTab === 'blood-pressure'
              ? 'bg-black'
              : 'bg-transparent hover:bg-gray-100'
          }`}
        >
          {activeTab === 'blood-pressure' && (
            <div className="relative shrink-0 size-[12px]">
              <Image
                src="/logoblackblood.svg"
                alt="Blood pressure"
                width={12}
                height={12}
                className="object-contain"
              />
            </div>
          )}
          <p className={`font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[10px] whitespace-nowrap ${
            activeTab === 'blood-pressure'
              ? 'text-white'
              : 'text-[#757575]'
          }`}>
            BLOOD PRESSURE
          </p>
        </button>
        <div 
          className="box-border content-stretch flex gap-[4px] h-[23px] items-center justify-center px-[10px] py-[5px] relative rounded-[14px] shrink-0 cursor-not-allowed opacity-75 hover:opacity-60 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#757575] text-[10px] whitespace-nowrap">
            GLUCOSE LEVEL
          </p>
          <button
            onClick={handleProClick}
            className="border border-[#acacac] border-solid box-border content-stretch flex items-center justify-center px-[8px] py-[3px] relative rounded-[7px] shrink-0 cursor-pointer opacity-75 hover:opacity-60 transition-opacity"
          >
            <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#757575] text-[10px]">
              PRO
            </p>
            <div className="relative shrink-0 size-[11px]">
              <Image
                src="/prologo.svg"
                alt="Pro"
                width={11}
                height={11}
                className="object-contain"
              />
            </div>
          </button>
        </div>
      </div>

      {/* Pro Modal - Disabled for now */}
      {showProModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setShowProModal(false)}
        >
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.65)]" />
          <div
            ref={modalRef}
            className="relative bg-white border border-black border-solid box-border flex flex-col gap-[10px] items-center justify-center px-[59px] py-[46px] rounded-[21px] w-[484px]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowProModal(false)}
              className="absolute right-[16px] top-[16px] size-[24px] hover:opacity-70 transition-opacity"
            >
              <Image
                src="/ic_round-cancel.svg"
                alt="Close"
                width={24}
                height={24}
                className="object-contain"
              />
            </button>
            <div className="flex flex-col gap-[20px] items-center">
              <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[24px] text-black text-center">
                Coming Soon
              </p>
              <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[16px] text-[#757575] text-center">
                The Blood Glucose Level feature is coming soon!
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
