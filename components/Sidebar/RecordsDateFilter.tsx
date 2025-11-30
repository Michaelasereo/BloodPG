'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { type DateFilter } from '@/lib/dateUtils';

interface RecordsDateFilterProps {
  onFilterChange: (filter: DateFilter) => void;
}

export default function RecordsDateFilter({ onFilterChange }: RecordsDateFilterProps) {
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const filterRef = useRef<HTMLSelectElement>(null);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilter = e.target.value as DateFilter;
    setDateFilter(newFilter);
    onFilterChange(newFilter);
  };


  return (
    <div className="absolute content-stretch flex items-center left-[225px] top-[119px]">
      <button
        onClick={() => {
          // Navigate to previous period
          const filters: DateFilter[] = ['all', 'this-week', 'last-week', 'this-month', 'last-month'];
          const currentIndex = filters.indexOf(dateFilter);
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : filters.length - 1;
          const newFilter = filters[prevIndex];
          setDateFilter(newFilter);
          onFilterChange(newFilter);
        }}
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
      <div className="bg-[#ededed] box-border content-stretch flex items-center justify-between px-[9px] py-[3px] relative rounded-[3.068px] shrink-0">
        <select
          ref={filterRef}
          value={dateFilter}
          onChange={handleFilterChange}
          className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-black text-[16px] tracking-[-0.64px] bg-transparent border-none outline-none appearance-none cursor-pointer flex-1"
        >
          <option value="all">All records</option>
          <option value="this-week">This week</option>
          <option value="last-week">Last week</option>
          <option value="this-month">This month</option>
          <option value="last-month">Last month</option>
        </select>
      </div>
      <button
        onClick={() => {
          // Navigate to next period
          const filters: DateFilter[] = ['all', 'this-week', 'last-week', 'this-month', 'last-month'];
          const currentIndex = filters.indexOf(dateFilter);
          const nextIndex = currentIndex < filters.length - 1 ? currentIndex + 1 : 0;
          const newFilter = filters[nextIndex];
          setDateFilter(newFilter);
          onFilterChange(newFilter);
        }}
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
  );
}

