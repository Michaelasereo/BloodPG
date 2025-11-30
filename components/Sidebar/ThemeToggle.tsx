'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <div className="box-border content-stretch flex flex-col gap-[12px] items-start px-0 py-[40px] relative shrink-0 w-[35px]">
      <button
        onClick={() => setTheme('light')}
        className={`box-border content-stretch flex gap-[10px] h-[34px] items-center justify-center px-px py-[3px] relative rounded-[17px] shrink-0 w-full ${
          theme === 'light' 
            ? 'bg-black' 
            : 'bg-[#eeeeee] border border-[#d8d8d8] border-solid'
        }`}
      >
        <div className="relative shrink-0 size-[24px]">
          <Image
            src="/logolightmode.png"
            alt="Light mode"
            width={24}
            height={24}
            className="object-contain"
          />
        </div>
      </button>
      <button
        onClick={() => setTheme('dark')}
        disabled
        className={`box-border content-stretch flex gap-[10px] h-[34px] items-center justify-center px-px py-[3px] relative rounded-[17px] shrink-0 w-full cursor-not-allowed opacity-75 hover:opacity-60 transition-opacity ${
          theme === 'dark' 
            ? 'bg-black' 
            : 'bg-[#eeeeee] border border-[#d8d8d8] border-solid'
        }`}
      >
        <div className="relative shrink-0 size-[24px]">
          <Image
            src="/logodarkmode.png"
            alt="Dark mode"
            width={24}
            height={24}
            className="object-contain"
          />
        </div>
      </button>
    </div>
  );
}
