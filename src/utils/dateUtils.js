import { format, parseISO, addDays, subDays, isToday, isSameDay } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy');
};

export const formatDateShort = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd');
};

export const formatDateFull = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy');
};

export const formatDateOrdinal = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const day = format(dateObj, 'd');
  const suffix = getOrdinalSuffix(parseInt(day));
  return format(dateObj, `MMM d'${suffix}', yyyy`);
};

const getOrdinalSuffix = (day) => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

export const navigateDate = (date, direction) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return direction === 'next' ? addDays(dateObj, 1) : subDays(dateObj, 1);
};

export const isDateToday = (date) => {
  if (!date) return false;
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isToday(dateObj);
};

export const areDatesSame = (date1, date2) => {
  if (!date1 || !date2) return false;
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  return isSameDay(d1, d2);
};

