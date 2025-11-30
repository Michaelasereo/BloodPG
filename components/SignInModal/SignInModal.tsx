'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import LogoIcon from '@/components/LogoIcon/LogoIcon';
import { useAuth } from '@/lib/authContext';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const { signIn, user } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when user signs in
  useEffect(() => {
    if (user && isOpen) {
      onClose();
    }
  }, [user, isOpen, onClose]);

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

  const handleGoogleSignIn = async () => {
    await signIn();
    // Modal will close automatically when user signs in (auth state change)
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleOverlayClick}
      data-node-id="81:1505"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.65)]" data-node-id="81:1505" />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className="relative bg-white border border-black border-solid box-border flex flex-col gap-[10px] h-[410px] items-center justify-center px-[59px] py-[46px] rounded-[21px] w-[484px]"
        data-node-id="81:1507"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-[16px] top-[16px] size-[24px] hover:opacity-70 transition-opacity"
          data-name="ic:round-cancel"
          data-node-id="81:1531"
        >
          <Image
            src="/ic_round-cancel.svg"
            alt="Close"
            width={24}
            height={24}
            className="object-contain"
          />
        </button>

        <div className="content-stretch flex flex-col gap-[21px] items-center justify-center relative shrink-0 w-[360px]" data-node-id="81:1508">
          {/* Logo */}
          <div className="content-stretch flex gap-[5px] h-[32px] items-center relative shrink-0" data-name="Logoicon" data-node-id="81:1509">
            <div className="h-[32px] relative shrink-0 w-[114px]" data-name="official-logo" data-node-id="I81:1509;7:548">
              <LogoIcon className="text-black" width={114} height={32} />
            </div>
          </div>

          <div className="content-stretch flex flex-col gap-[25px] items-center relative shrink-0 w-full" data-node-id="81:1510">
            {/* Title */}
            <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[29.93px] text-black text-center tracking-[-0.8979px] w-[min-content] whitespace-pre-wrap" data-node-id="81:1511">
              Save your records securely. Sign in to get started.
            </p>

            <div className="content-stretch flex flex-col gap-[9px] items-end relative shrink-0 w-[338px]" data-node-id="81:1512">
              {/* Notification Box */}
              <div className="border border-black border-solid box-border content-stretch flex flex-col gap-[10px] h-[49px] items-start p-[9px] relative rounded-[10px] shrink-0 w-full" data-node-id="81:1513">
                <div className="content-stretch flex gap-[3px] items-start relative shrink-0" data-node-id="81:1514">
                  <div className="box-border content-stretch flex gap-[10px] items-center overflow-clip px-[2px] py-[3px] relative shrink-0" data-name="mingcute:notification-fill" data-node-id="81:1515">
                    <div className="h-[15.835px] relative shrink-0 w-[8.938px]" data-name="Group" data-node-id="81:1516">
                      <Image
                        src="/mingcute_notification-fill.svg"
                        alt="Notification"
                        width={9}
                        height={16}
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div className="font-['Helvetica_Neue:Medium',sans-serif] h-[29px] leading-[15px] not-italic relative shrink-0 text-[12px] text-black tracking-[-0.36px] w-[288px]" data-node-id="81:1519">
                    <p className="mb-0">
                      <span>{`Keep your data safe and synced. `}</span>
                      <span className="text-[#7c7c7c]">Sign in with Google to save your progress.</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Sign In Button */}
              <div className="content-stretch flex flex-col gap-[5px] items-start relative shrink-0 w-full" data-node-id="81:1520">
                <button
                  onClick={handleGoogleSignIn}
                  className="bg-[#2e2e2e] border border-black border-solid box-border content-stretch flex flex-col gap-[10px] h-[45px] items-center justify-center px-[89px] py-[14px] relative rounded-[10px] shrink-0 w-full hover:bg-[#212121] transition-colors"
                  data-node-id="81:1521"
                >
                  <div className="content-stretch flex gap-[9px] items-center relative shrink-0" data-node-id="81:1522">
                    <div className="relative shrink-0 size-[14px]" data-name="devicon:google" data-node-id="81:1523">
                      <svg width="14" height="14" viewBox="0 0 24 24" className="w-full h-full">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                    </div>
                    <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-white tracking-[-0.42px]" data-node-id="81:1529">
                      Continue with Google
                    </p>
                  </div>
                </button>

                {/* Terms Text */}
                <div className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#727272] text-[10px] tracking-[-0.5px] whitespace-nowrap" data-node-id="81:1530">
                  <p className="mb-0">By clicking &quot; Continue with Google&quot;, you acknowledge that you have read and</p>
                  <p>{`understood, and agree to BloodPG's Terms & Conditions and Privacy Policy.`}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

