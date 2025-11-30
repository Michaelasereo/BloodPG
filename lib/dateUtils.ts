import { format, parseISO, addDays, subDays, isToday, isSameDay } from 'date-fns';

export const formatDate = (date: Date | string): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy');
};

export const formatDateShort = (date: Date | string): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd');
};

export const formatDateFull = (date: Date | string): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy');
};

export const formatDateOrdinal = (date: Date | string): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const day = format(dateObj, 'd');
  const suffix = getOrdinalSuffix(parseInt(day));
  return format(dateObj, `MMM d'${suffix}', yyyy`);
};

const getOrdinalSuffix = (day: number): string => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

export const navigateDate = (date: Date | string, direction: 'next' | 'prev'): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return direction === 'next' ? addDays(dateObj, 1) : subDays(dateObj, 1);
};

export const isDateToday = (date: Date | string): boolean => {
  if (!date) return false;
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isToday(dateObj);
};

export const areDatesSame = (date1: Date | string, date2: Date | string): boolean => {
  if (!date1 || !date2) return false;
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  return isSameDay(d1, d2);
};

export type DateFilter = 'all' | 'this-week' | 'last-week' | 'this-month' | 'last-month';

export const getDateRangeForFilter = (filter: DateFilter): { start: Date; end: Date } => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let start: Date;
  let end: Date = new Date(today);
  end.setHours(23, 59, 59, 999);

  switch (filter) {
    case 'all': {
      // Return a very wide range to include all records
      start = new Date(0); // Beginning of time
      end = new Date('2099-12-31'); // Far future
      break;
    }
    case 'this-week': {
      // Start of this week (Sunday)
      const dayOfWeek = today.getDay();
      start = new Date(today);
      start.setDate(today.getDate() - dayOfWeek);
      start.setHours(0, 0, 0, 0);
      break;
    }
    case 'last-week': {
      // Start of last week (Sunday)
      const dayOfWeek = today.getDay();
      start = new Date(today);
      start.setDate(today.getDate() - dayOfWeek - 7);
      start.setHours(0, 0, 0, 0);
      // End of last week (Saturday)
      end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;
    }
    case 'this-month': {
      // Start of this month
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      start.setHours(0, 0, 0, 0);
      break;
    }
    case 'last-month': {
      // Start of last month
      start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      start.setHours(0, 0, 0, 0);
      // End of last month
      end = new Date(today.getFullYear(), today.getMonth(), 0);
      end.setHours(23, 59, 59, 999);
      break;
    }
    default:
      start = new Date(0);
      end = new Date();
  }

  return { start, end };
};

