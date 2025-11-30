'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import LogoIcon from '@/components/LogoIcon/LogoIcon';

interface AboutUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutUsModal({ isOpen, onClose }: AboutUsModalProps) {
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
      data-node-id="98:2584"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.65)]" data-node-id="98:2584" />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className="relative bg-white h-[732px] rounded-[21px] w-[872px]"
        data-node-id="98:2655"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-[16px] top-[16px] size-[20px] hover:opacity-70 transition-opacity"
          data-name="Vector"
          data-node-id="98:2678"
        >
          <Image
            src="/ic_round-cancel.svg"
            alt="Close"
            width={20}
            height={20}
            className="object-contain"
          />
        </button>

        <div className="absolute content-stretch flex flex-col gap-[20px] items-start left-[75px] top-[105px] w-[722px]" data-node-id="98:2656">
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-node-id="98:2657">
            <div className="content-stretch flex h-[113px] items-center justify-between relative shrink-0 w-full" data-node-id="98:2658">
              <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[71px] text-black" data-node-id="98:2659">
                About US
              </p>
              <div className="relative shrink-0 size-[87px]" data-name="ix:about-filled" data-node-id="98:2682">
                <Image
                  src="/ix_about-filled.svg"
                  alt="About"
                  width={87}
                  height={87}
                  className="object-contain"
                />
              </div>
            </div>
            <div className="content-stretch flex gap-[9px] items-center relative shrink-0" data-node-id="98:2663">
              <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-node-id="98:2664">
                <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-black tracking-[0.16px]" data-node-id="98:2665">
                  From: Our Team
                </p>
              </div>
            </div>
          </div>
          <div className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[16px] text-black tracking-[-0.64px] w-[min-content] whitespace-pre-wrap" data-node-id="98:2666">
            <p className="mb-0">BloodPG is a health technology division of The Quiet Technologies, founded by Dr. Asere Opeyemi-Michael. This application transforms the essential practice of health data monitoring from a scattered task into a seamless ritual. We believe that managing your health should be an act of clarity, not confusion.</p>
            <p className="mb-0"> </p>
            <p>{`Here, every reading is securely preserved, every trend thoughtfully illuminated, and your journey met with the perfect harmony of medical precision and human understanding. This is more than tracking—it's a quieter, more confident path to lifelong wellness.. `}</p>
          </div>
          <div className="content-stretch flex gap-[5px] h-[32px] items-center relative shrink-0" data-name="Logoicon" data-node-id="98:2667">
            <div className="h-[32px] relative shrink-0 w-[114px]" data-name="official-logo" data-node-id="I98:2667;7:548">
              <LogoIcon className="text-black" width={114} height={32} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
