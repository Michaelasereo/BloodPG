'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import LogoIcon from '@/components/LogoIcon/LogoIcon';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SupportModal({ isOpen, onClose }: SupportModalProps) {
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
      data-node-id="98:2950"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.65)]" data-node-id="98:2950" />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className="relative bg-white h-[732px] rounded-[21px] w-[872px]"
        data-node-id="98:2951"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-[16px] top-[16px] size-[20px] hover:opacity-70 transition-opacity"
          data-name="Vector"
          data-node-id="98:2952"
        >
          <Image
            src="/ic_round-cancel.svg"
            alt="Close"
            width={20}
            height={20}
            className="object-contain"
          />
        </button>

        <div className="absolute content-stretch flex flex-col gap-[20px] items-start left-[75px] top-[105px] w-[722px]" data-node-id="98:2953">
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-node-id="98:2954">
            <div className="content-stretch flex h-[113px] items-center justify-between relative shrink-0 w-full" data-node-id="98:2955">
              <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[71px] text-black" data-node-id="98:2956">
                Support
              </p>
              <div className="relative shrink-0 size-[87px]" data-name="logosupport" data-node-id="98:3007">
                <Image
                  src="/logosupport.svg"
                  alt="Support"
                  width={87}
                  height={87}
                  className="object-contain"
                />
              </div>
            </div>
            <div className="content-stretch flex gap-[9px] items-center relative shrink-0" data-node-id="98:2959">
              <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-node-id="98:2960">
                <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-black tracking-[0.16px]" data-node-id="98:2961">
                  Chat with US
                </p>
              </div>
            </div>
          </div>
          <div className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[16px] text-black tracking-[-0.64px] w-[min-content] whitespace-pre-wrap" data-node-id="98:2962">
            <p className="mb-0 leading-[normal]">Have ideas about app features? Need help with the app? Or just want to share your feedback?</p>
            <p className="mb-0 leading-[normal]">Our friendly support team is here for you.</p>
            <p className="mb-0 leading-[normal]">&nbsp;</p>
            <ul className="list-disc mb-0">
              <li className="mb-0 ms-[24px]">
                <span className="leading-[normal]">General Support: Get technical help and app guidance</span>
              </li>
              <li className="mb-0 ms-[24px]">
                <span className="leading-[normal]">Health Questions: Understand your data and trends (Note: For medical advice, please consult your doctor)</span>
              </li>
              <li className="ms-[24px]">
                <span className="leading-[normal]">Feedback & Suggestions: We love hearing from you</span>
              </li>
            </ul>
            <p className="mb-0 leading-[normal]">&nbsp;</p>
            <p className="mb-0 leading-[normal]">We typically reply within a few hours. Your health journey is important to us.</p>
            <p className="leading-[normal]">Email us: themichaelsjournal@gmail.com</p>
          </div>
          <div className="content-stretch flex gap-[5px] h-[32px] items-center relative shrink-0" data-name="Logoicon" data-node-id="98:2963">
            <div className="h-[32px] relative shrink-0 w-[114px]" data-name="official-logo" data-node-id="I98:2963;7:548">
              <LogoIcon className="text-black" width={114} height={32} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
