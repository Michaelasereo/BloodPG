'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import LogoIcon from '@/components/LogoIcon/LogoIcon';
import Header from '@/components/Header/Header';
import Link from 'next/link';

export default function AboutPage() {
  useEffect(() => {
    document.body.style.overflow = 'auto';
  }, []);

  return (
    <div className="bg-[#f2f2f2] min-h-screen">
      <Header />
      <div className="flex items-center justify-center min-h-[calc(100vh-50px)] p-[30px]">
        <div className="relative bg-white max-w-[872px] w-full rounded-[21px] p-[75px]">
          <Link
            href="/"
            className="absolute right-[16px] top-[16px] size-[20px] hover:opacity-70 transition-opacity"
          >
            <Image
              src="/ic_round-cancel.svg"
              alt="Close"
              width={20}
              height={20}
              className="object-contain"
            />
          </Link>

          <div className="content-stretch flex flex-col gap-[20px] items-start w-full">
            <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
              <div className="content-stretch flex h-[113px] items-center justify-between relative shrink-0 w-full">
                <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[71px] text-black">
                  About US
                </p>
                <div className="relative shrink-0 size-[87px]">
                  <Image
                    src="/ix_about-filled.svg"
                    alt="About"
                    width={87}
                    height={87}
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="content-stretch flex gap-[9px] items-center relative shrink-0">
                <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-black tracking-[0.16px]">
                    From: Our Team
                  </p>
                </div>
              </div>
            </div>
            <div className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[16px] text-black tracking-[-0.64px] w-[min-content] whitespace-pre-wrap">
              <p className="mb-0">BloodPG is a health technology division of The Quiet Technologies, founded by Dr. Asere Opeyemi-Michael. This application transforms the essential practice of health data monitoring from a scattered task into a seamless ritual. We believe that managing your health should be an act of clarity, not confusion.</p>
              <p className="mb-0"> </p>
              <p>{`Here, every reading is securely preserved, every trend thoughtfully illuminated, and your journey met with the perfect harmony of medical precision and human understanding. This is more than tracking—it's a quieter, more confident path to lifelong wellness.. `}</p>
            </div>
            <div className="content-stretch flex gap-[5px] h-[32px] items-center relative shrink-0">
              <div className="h-[32px] relative shrink-0 w-[114px]">
                <LogoIcon className="text-black" width={114} height={32} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

