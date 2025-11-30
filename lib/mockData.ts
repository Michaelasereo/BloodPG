import { format, parseISO } from 'date-fns';
import type { BloodPressureRecord, Medication } from '@/types';

const generateMockRecords = (): BloodPressureRecord[] => {
  const records: BloodPressureRecord[] = [];

  // Dummy data matching Figma design - 5 records all for Nov 22nd, 2025
  const sampleData = [
    {
      date: parseISO('2025-11-22'),
      am: { systolic: 128, diastolic: 67, postMedication: true },
      pm: { systolic: 150, diastolic: 100, postMedication: false },
      medications: ['Tabs Lisinopril 100mg 12hrly', 'Tabs Lisinopril 100mg 12hrly']
    },
    {
      date: parseISO('2025-11-22'),
      am: { systolic: 128, diastolic: 67, postMedication: false },
      pm: { systolic: 150, diastolic: 100, postMedication: false },
      medications: ['Tabs Lisinopril 100mg 12hrly', 'Tabs Lisinopril 100mg 12hrly']
    },
    {
      date: parseISO('2025-11-22'),
      am: { systolic: 128, diastolic: 67, postMedication: true },
      pm: { systolic: 150, diastolic: 100, postMedication: false },
      medications: ['Tabs Lisinopril 100mg 12hrly', 'Tabs Lisinopril 100mg 12hrly']
    },
    {
      date: parseISO('2025-11-22'),
      am: { systolic: 128, diastolic: 67, postMedication: false },
      pm: { systolic: 150, diastolic: 100, postMedication: false },
      medications: ['Tabs Lisinopril 100mg 12hrly', 'Tabs Lisinopril 100mg 12hrly']
    },
    {
      date: parseISO('2025-11-22'),
      am: { systolic: 128, diastolic: 67, postMedication: false },
      pm: { systolic: 150, diastolic: 100, postMedication: false },
      medications: ['Tabs Lisinopril 100mg 12hrly', 'Tabs Lisinopril 100mg 12hrly']
    }
  ];

  sampleData.forEach((data, index) => {
    records.push({
      id: index + 1,
      date: data.date,
      am: {
        systolic: data.am.systolic,
        diastolic: data.am.diastolic,
        preMedication: !data.am.postMedication,
        postMedication: data.am.postMedication || false
      },
      pm: {
        systolic: data.pm.systolic,
        diastolic: data.pm.diastolic,
        preMedication: !data.pm.postMedication,
        postMedication: data.pm.postMedication || false
      },
      medications: data.medications
    });
  });

  return records;
};

let mockRecords: BloodPressureRecord[] = generateMockRecords();
let mockMedications: Medication[] = [
  { id: 1, name: 'Lisinopril', dosage: '100mg', frequency: '12hrly' }
];

export const getBloodPressureRecords = (): BloodPressureRecord[] => {
  if (typeof window !== 'undefined') {
    try {
      const savedRecords = localStorage.getItem('bloodpg-records');
      if (savedRecords) {
        const parsed = JSON.parse(savedRecords);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const records = parsed.map((r: any) => ({
            ...r,
            date: parseISO(r.date)
          }));
          const sorted = records.sort((a: BloodPressureRecord, b: BloodPressureRecord) => 
            b.date.getTime() - a.date.getTime()
          );
          console.log('✅ Loaded', sorted.length, 'records from localStorage');
          return sorted;
        }
      }
      // DISABLED: Auto-initialize dummy data - return empty array for testing
      console.log('ℹ️ No records found in localStorage (dummy data disabled)');
      return [];
    } catch (error) {
      console.error('❌ Failed to load from localStorage:', error);
      // Return empty array instead of mock data
      return [];
    }
  }
  return [];
};

export const getBloodPressureRecordByDate = (date: Date): BloodPressureRecord | undefined => {
  return mockRecords.find(record => {
    const recordDate = format(record.date, 'yyyy-MM-dd');
    const searchDate = format(date, 'yyyy-MM-dd');
    return recordDate === searchDate;
  });
};

export const saveBloodPressureRecord = (record: Partial<BloodPressureRecord> & { date: Date }): BloodPressureRecord[] => {
  const existingIndex = mockRecords.findIndex(r => {
    const rDate = format(r.date, 'yyyy-MM-dd');
    const newDate = format(record.date, 'yyyy-MM-dd');
    return rDate === newDate;
  });

  if (existingIndex >= 0) {
    mockRecords[existingIndex] = { ...mockRecords[existingIndex], ...record } as BloodPressureRecord;
  } else {
    const newRecord: BloodPressureRecord = {
      id: mockRecords.length + 1,
      date: record.date,
      am: record.am || { systolic: 0, diastolic: 0, preMedication: false, postMedication: false },
      pm: record.pm || { systolic: 0, diastolic: 0, preMedication: false, postMedication: false },
      medications: record.medications || [],
    };
    mockRecords.push(newRecord);
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('bloodpg-records', JSON.stringify(mockRecords.map(r => ({
        ...r,
        date: format(r.date, 'yyyy-MM-dd')
      }))));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  return mockRecords;
};

export const getMedications = (): Medication[] => {
  if (typeof window !== 'undefined') {
    try {
      const savedMeds = localStorage.getItem('bloodpg-medications');
      if (savedMeds) {
        return JSON.parse(savedMeds);
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
  }
  return [...mockMedications];
};

export const addMedication = (medication: Omit<Medication, 'id'>): Medication[] => {
  const newMedication: Medication = {
    id: mockMedications.length + 1,
    ...medication
  };
  mockMedications.push(newMedication);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('bloodpg-medications', JSON.stringify(mockMedications));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  return mockMedications;
};

export const removeMedication = (id: number): Medication[] => {
  mockMedications = mockMedications.filter(m => m.id !== id);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('bloodpg-medications', JSON.stringify(mockMedications));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  return mockMedications;
};

// Utility function to reset records to dummy data
export const resetToDummyData = (): void => {
  mockRecords = generateMockRecords();
  if (typeof window !== 'undefined') {
    try {
      const recordsToSave = mockRecords.map(r => ({
        ...r,
        date: format(r.date, 'yyyy-MM-dd')
      }));
      localStorage.setItem('bloodpg-records', JSON.stringify(recordsToSave));
      console.log('✅ Dummy data initialized! 5 records loaded.');
    } catch (error) {
      console.error('Failed to reset dummy data:', error);
    }
  }
};

// Utility function to clear and reset to dummy data
export const clearAndResetData = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('bloodpg-records');
    resetToDummyData();
  }
};

// Make reset function available globally for browser console
if (typeof window !== 'undefined') {
  (window as any).resetBloodPGData = clearAndResetData;
}

