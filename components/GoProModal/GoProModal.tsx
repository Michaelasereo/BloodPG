'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import LogoIcon from '@/components/LogoIcon/LogoIcon';

interface GoProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GoProModal({ isOpen, onClose }: GoProModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Close modal when clicking outside
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleOverlayClick}
      data-node-id="98:3275"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.65)]" data-node-id="98:3275" />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className="relative bg-white h-[732px] rounded-[21px] w-[872px]"
        data-node-id="98:3276"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-[16px] top-[16px] size-[20px] hover:opacity-70 transition-opacity"
          data-name="Vector"
          data-node-id="98:3277"
        >
          <Image
            src="/ic_round-cancel.svg"
            alt="Close"
            width={20}
            height={20}
            className="object-contain"
          />
        </button>

        <div className="absolute content-stretch flex flex-col gap-[20px] items-start left-[75px] top-[105px] w-[722px]" data-node-id="98:3278">
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-node-id="98:3279">
            <div className="content-stretch flex h-[113px] items-center justify-between relative shrink-0 w-full" data-node-id="98:3280">
              <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-[456.5px]" data-node-id="98:3382">
                <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[71px] text-black" data-node-id="98:3281">
                  Go Pro
                </p>
                <div className="border border-[#acacac] border-solid box-border content-stretch flex items-center justify-center px-[8px] py-[3px] relative rounded-[7px] shrink-0" data-node-id="98:3377">
                  <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#757575] text-[10px]" data-node-id="98:3378">
                    COMING SOON
                  </p>
                </div>
              </div>
              <div className="relative shrink-0 size-[87px]" data-name="logodiamond" data-node-id="98:3359">
                <Image
                  src="/logodiamond.svg"
                  alt="Diamond"
                  width={87}
                  height={87}
                  className="object-contain"
                />
              </div>
            </div>
            <div className="content-stretch flex gap-[9px] items-center relative shrink-0" data-node-id="98:3284">
              <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-node-id="98:3285">
                <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-black tracking-[-0.64px]" data-node-id="98:3286">
                  Go Pro - Elevate Your Health Journey
                </p>
              </div>
            </div>
          </div>
          <div className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[16px] text-black tracking-[-0.64px] w-[min-content] whitespace-pre-wrap" data-node-id="98:3287">
            <p className="mb-0">Unlock advanced analytics, smart reminders, professional reports, and ad-free experience. Get deeper insights and take full control of your heart health.</p>
            <p className="mb-0">&nbsp;</p>
            <p className="mb-0">✨ Premium Features · 🔒 Enhanced Security · 📊 Advanced Analytics</p>
            <p className="mb-0">&nbsp;</p>
            <p>*Comes with a 7-day free trial*</p>
          </div>
          <div className="content-stretch flex gap-[5px] h-[32px] items-center relative shrink-0" data-name="Logoicon" data-node-id="98:3288">
            <div className="h-[32px] relative shrink-0 w-[114px]" data-name="official-logo" data-node-id="I98:3288;7:548">
              <LogoIcon className="text-black" width={114} height={32} />
            </div>
          </div>
        </div>

        {/* Coming Soon Button Section - Centered at bottom */}
        <div className="absolute content-stretch flex flex-col gap-[5px] items-center left-1/2 bottom-[105px] translate-x-[-50%] w-[338px]" data-node-id="98:3362">
          <button 
            disabled
            className="bg-[#2e2e2e] border border-black border-solid box-border content-stretch flex flex-col gap-[10px] h-[45px] items-center justify-center px-[89px] py-[14px] relative rounded-[10px] shrink-0 w-full cursor-not-allowed opacity-75 hover:opacity-60 transition-opacity" 
            data-node-id="98:3363"
            onClick={() => {/* Coming soon - no action yet */}}
          >
            <div className="content-stretch flex gap-[9px] items-center relative shrink-0" data-node-id="98:3364">
              <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-white tracking-[-0.42px]" data-node-id="98:3371">Coming Soon!</p>
            </div>
          </button>
          <div className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#727272] text-[10px] tracking-[-0.5px] whitespace-nowrap text-center" data-node-id="98:3372">
            <p className="mb-0">By clicking &quot; Continue with Google&quot;, you acknowledge that you have read and</p>
            <p>{`understood, and agree to BloodPG's Terms & Conditions and Privacy Policy.`}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
