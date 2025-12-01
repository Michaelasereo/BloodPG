'use client';

import { useState } from 'react';
import LogoIcon from '@/components/LogoIcon/LogoIcon';
import Image from 'next/image';
import AboutUsModal from '@/components/AboutUsModal/AboutUsModal';
import PrivacyPolicyModal from '@/components/PrivacyPolicyModal/PrivacyPolicyModal';
import TermsAndConditionsModal from '@/components/TermsAndConditionsModal/TermsAndConditionsModal';
import SupportModal from '@/components/SupportModal/SupportModal';
import GoProModal from '@/components/GoProModal/GoProModal';

export default function Header() {
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showGoProModal, setShowGoProModal] = useState(false);

  return (
    <>
      <AboutUsModal isOpen={showAboutModal} onClose={() => setShowAboutModal(false)} />
      <PrivacyPolicyModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
      <TermsAndConditionsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
      <SupportModal isOpen={showSupportModal} onClose={() => setShowSupportModal(false)} />
      <GoProModal isOpen={showGoProModal} onClose={() => setShowGoProModal(false)} />
      <header className="bg-white relative size-full h-[50px]" data-name="navbar">
        {/* Logo Section - Left */}
        <div className="absolute content-stretch flex gap-[5px] h-[32px] items-center left-[35px] top-[9px]" data-name="Logoicon">
          <div className="h-[32px] relative shrink-0 w-[114px]" data-name="official-logo" data-node-id="I15:961;7:548">
            <LogoIcon className="text-black" width={114} height={32} />
          </div>
      </div>

        {/* Nav Menu - Right */}
        <div className="absolute content-stretch flex gap-[20px] items-center right-[35px] top-[17px]" data-name="nav_menu">
          <button
            onClick={() => setShowAboutModal(true)}
            className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[10px] text-black hover:opacity-70 transition-opacity cursor-pointer"
          >
          ABOUT US
          </button>
          <button
            onClick={() => setShowPrivacyModal(true)}
            className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[10px] text-black hover:opacity-70 transition-opacity cursor-pointer"
          >
          PRIVACY POLICY
          </button>
          <button
            onClick={() => setShowTermsModal(true)}
            className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[10px] text-black hover:opacity-70 transition-opacity cursor-pointer"
          >
          TERMS AND CONDITIONS
          </button>
        <div className="content-stretch flex gap-[15px] items-center relative shrink-0" data-name="menu_icons">
          <button
            onClick={() => setShowSupportModal(true)}
            className="relative shrink-0 size-[16px] hover:opacity-70 transition-opacity cursor-pointer"
            data-name="logosupport"
          >
            <Image
              src="/logosupport.svg"
              alt="Support"
              width={16}
              height={16}
              className="object-contain"
            />
          </button>
          <button
            onClick={() => setShowGoProModal(true)}
            className="relative shrink-0 size-[16px] hover:opacity-70 transition-opacity cursor-pointer"
            data-name="logodiamond"
          >
            <Image
              src="/logodiamond.svg"
              alt="Diamond"
              width={16}
              height={16}
              className="object-contain"
            />
          </button>
        </div>
      </div>
    </header>
    </>
  );
}
