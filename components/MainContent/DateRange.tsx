'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import DatePicker from '@/components/Sidebar/DatePicker';
import { formatDateOrdinal, isDateToday, navigateDate } from '@/lib/dateUtils';

interface DateRangeProps {
  fromDate: Date;
  toDate: Date;
  onFromDateChange: (date: Date) => void;
  onToDateChange: (date: Date) => void;
}

export default function DateRange({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
}: DateRangeProps) {
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const fromDatePickerRef = useRef<HTMLDivElement>(null);
  const toDatePickerRef = useRef<HTMLDivElement>(null);

  // Close date pickers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fromDatePickerRef.current && !fromDatePickerRef.current.contains(event.target as Node)) {
        setShowFromDatePicker(false);
      }
      if (toDatePickerRef.current && !toDatePickerRef.current.contains(event.target as Node)) {
        setShowToDatePicker(false);
      }
    };

    if (showFromDatePicker || showToDatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFromDatePicker, showToDatePicker]);

  const handleFromNavigation = (direction: 'next' | 'prev') => {
    onFromDateChange(navigateDate(fromDate, direction));
  };

  const handleToNavigation = (direction: 'next' | 'prev') => {
    onToDateChange(navigateDate(toDate, direction));
  };

  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0">
      <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-black tracking-[0.16px]">
          From:
        </p>
      </div>
      <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid justify-items-start leading-[0] relative shrink-0">
        <div className="col-[1] grid-cols-[max-content] grid-rows-[max-content] inline-grid justify-items-start ml-0 mt-0 relative row-[1]">
          <div className="box-border col-[1] content-stretch flex items-center ml-0 mt-0 relative row-[1]" ref={fromDatePickerRef}>
            <button
              onClick={() => handleFromNavigation('prev')}
              className="flex items-center justify-center relative shrink-0"
            >
              <div className="flex-none">
                <div className="relative size-[20.455px]">
                  <Image
                    src="/back_icon.svg"
                    alt="Previous"
                    width={20.455}
                    height={20.455}
                    className="object-contain"
                  />
                </div>
              </div>
            </button>
            <button
              onClick={() => setShowFromDatePicker(!showFromDatePicker)}
              className="bg-[#ededed] box-border content-stretch flex gap-[10.227px] items-center justify-center px-[9px] py-[3px] relative rounded-[3.068px] shrink-0 cursor-pointer"
            >
              <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-black tracking-[-0.64px]">
                {isDateToday(fromDate) ? 'Today' : formatDateOrdinal(fromDate)}
              </p>
            </button>
            {showFromDatePicker && (
              <DatePicker
                selectedDate={fromDate}
                onDateSelect={(date) => {
                  onFromDateChange(date);
                  setShowFromDatePicker(false);
                }}
                onClose={() => setShowFromDatePicker(false)}
              />
            )}
            <button
              onClick={() => handleFromNavigation('next')}
              className="flex items-center justify-center relative shrink-0"
            >
              <div className="flex-none">
                <div className="relative size-[20.455px]">
                  <Image
                    src="/next_icon.svg"
                    alt="Next"
                    width={20.455}
                    height={20.455}
                    className="object-contain"
                  />
                </div>
              </div>
            </button>
          </div>
        </div>
        <div className="col-[1] h-0 ml-[108.5px] mt-[12px] relative row-[1] w-[37px]">
          <div className="absolute inset-[-0.5px_0%] left-[18.5px] right-[18.5px]">
            <Image
              src="/Vector 15.svg"
              alt="Divider"
              width={37}
              height={1}
              className="object-contain"
            />
          </div>
        </div>
      </div>
      <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
        <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-black tracking-[0.16px]">
          To:
        </p>
      </div>
      <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid justify-items-start leading-[0] relative shrink-0">
        <div className="col-[1] grid-cols-[max-content] grid-rows-[max-content] inline-grid justify-items-start ml-0 mt-0 relative row-[1]">
          <div className="box-border col-[1] content-stretch flex items-center ml-0 mt-0 relative row-[1]" ref={toDatePickerRef}>
            <button
              onClick={() => handleToNavigation('prev')}
              className="flex items-center justify-center relative shrink-0"
            >
              <div className="flex-none">
                <div className="relative size-[20.455px]">
                  <Image
                    src="/back_icon.svg"
                    alt="Previous"
                    width={20.455}
                    height={20.455}
                    className="object-contain"
                  />
                </div>
              </div>
            </button>
            <button
              onClick={() => setShowToDatePicker(!showToDatePicker)}
              className="bg-[#ededed] box-border content-stretch flex gap-[10.227px] items-center justify-center px-[9px] py-[3px] relative rounded-[3.068px] shrink-0 cursor-pointer"
            >
              <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-black tracking-[-0.64px]">
                {formatDateOrdinal(toDate)}
              </p>
            </button>
            {showToDatePicker && (
              <DatePicker
                selectedDate={toDate}
                onDateSelect={(date) => {
                  onToDateChange(date);
                  setShowToDatePicker(false);
                }}
                onClose={() => setShowToDatePicker(false)}
              />
            )}
            <button
              onClick={() => handleToNavigation('next')}
              className="flex items-center justify-center relative shrink-0"
            >
              <div className="flex-none">
                <div className="relative size-[20.455px]">
                  <Image
                    src="/next_icon.svg"
                    alt="Next"
                    width={20.455}
                    height={20.455}
                    className="object-contain"
                  />
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
