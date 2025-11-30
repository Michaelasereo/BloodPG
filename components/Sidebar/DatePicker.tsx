'use client';

import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';

interface DatePickerProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onClose: () => void;
}

export default function DatePicker({ selectedDate, onDateSelect, onClose }: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  // Update current month when selectedDate changes
  useEffect(() => {
    setCurrentMonth(selectedDate);
  }, [selectedDate]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateClick = (day: Date) => {
    onDateSelect(day);
    onClose();
  };

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className="absolute z-50 bg-white border border-[#e0e0e0] rounded-[8px] shadow-lg p-4 mt-2 min-w-[280px]">
      {/* Month/Year Header with Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-1.5 hover:bg-[#f5f5f5] rounded transition-colors"
          aria-label="Previous month"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h3 className="font-medium text-[14px] text-black">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <button
          onClick={handleNextMonth}
          className="p-1.5 hover:bg-[#f5f5f5] rounded transition-colors"
          aria-label="Next month"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      
      {/* Week Days Header */}
      <div className="grid grid-cols-7 gap-0 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-[11px] font-medium text-[#757575] py-1.5">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0">
        {days.map((day, idx) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());
          
          return (
            <button
              key={idx}
              onClick={() => handleDateClick(day)}
              className={`
                h-9 w-9 rounded-full text-[13px] font-normal transition-all
                flex items-center justify-center
                ${!isCurrentMonth ? 'text-[#d1d1d1]' : 'text-black'}
                ${isSelected ? 'bg-[#212121] text-white' : ''}
                ${isToday && !isSelected ? 'bg-[#f5f5f5]' : ''}
                ${!isSelected && isCurrentMonth ? 'hover:bg-[#f5f5f5]' : ''}
              `}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
}

