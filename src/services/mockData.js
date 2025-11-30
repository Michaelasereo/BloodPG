import { format, parseISO } from 'date-fns';

const generateMockRecords = () => {
  const records = [];

  // Generate records for Nov 22-25, 2025 (as shown in design)
  
  const sampleData = [
    {
      date: parseISO('2025-11-22'),
      am: { systolic: 128, diastolic: 67 },
      pm: { systolic: 150, diastolic: 100 },
      medications: ['Tabs Lisinopril 100mg 12hrly', 'Tabs Lisinopril 100mg 12hrly']
    },
    {
      date: parseISO('2025-11-23'),
      am: { systolic: 138, diastolic: 85 },
      pm: { systolic: 160, diastolic: 110 },
      medications: ['Tabs Lisinopril 100mg 12hrly', 'Tabs Lisinopril 100mg 12hrly']
    },
    {
      date: parseISO('2025-11-24'),
      am: { systolic: 140, diastolic: 89 },
      pm: { systolic: 145, diastolic: 90 },
      medications: ['Tabs Lisinopril 100mg 12hrly', 'Tabs Lisinopril 100mg 12hrly']
    },
    {
      date: parseISO('2025-11-25'),
      am: { systolic: 170, diastolic: 100 },
      pm: { systolic: 108, diastolic: 86 },
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
        preMedication: true,
        postMedication: false
      },
      pm: {
        systolic: data.pm.systolic,
        diastolic: data.pm.diastolic,
        preMedication: true,
        postMedication: false
      },
      medications: data.medications
    });
  });

  return records;
};

let mockRecords = generateMockRecords();
let mockMedications = [
  { id: 1, name: 'Lisinopril', dosage: '100mg', frequency: '12hrly' }
];

export const getBloodPressureRecords = () => {
  return [...mockRecords].sort((a, b) => b.date - a.date);
};

export const getBloodPressureRecordByDate = (date) => {
  return mockRecords.find(record => {
    const recordDate = format(record.date, 'yyyy-MM-dd');
    const searchDate = format(date, 'yyyy-MM-dd');
    return recordDate === searchDate;
  });
};

export const saveBloodPressureRecord = (record) => {
  const existingIndex = mockRecords.findIndex(r => {
    const rDate = format(r.date, 'yyyy-MM-dd');
    const newDate = format(record.date, 'yyyy-MM-dd');
    return rDate === newDate;
  });

  if (existingIndex >= 0) {
    mockRecords[existingIndex] = { ...mockRecords[existingIndex], ...record };
  } else {
    const newRecord = {
      id: mockRecords.length + 1,
      ...record
    };
    mockRecords.push(newRecord);
  }

  // Persist to localStorage
  try {
    localStorage.setItem('bloodpg-records', JSON.stringify(mockRecords.map(r => ({
      ...r,
      date: format(r.date, 'yyyy-MM-dd')
    }))));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }

  return mockRecords;
};

export const getMedications = () => {
  return [...mockMedications];
};

export const addMedication = (medication) => {
  const newMedication = {
    id: mockMedications.length + 1,
    ...medication
  };
  mockMedications.push(newMedication);

  // Persist to localStorage
  try {
    localStorage.setItem('bloodpg-medications', JSON.stringify(mockMedications));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }

  return mockMedications;
};

export const removeMedication = (id) => {
  mockMedications = mockMedications.filter(m => m.id !== id);

  // Persist to localStorage
  try {
    localStorage.setItem('bloodpg-medications', JSON.stringify(mockMedications));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }

  return mockMedications;
};

// Load from localStorage on initialization
try {
  const savedRecords = localStorage.getItem('bloodpg-records');
  if (savedRecords) {
    const parsed = JSON.parse(savedRecords);
    mockRecords = parsed.map(r => ({
      ...r,
      date: parseISO(r.date)
    }));
  }

  const savedMeds = localStorage.getItem('bloodpg-medications');
  if (savedMeds) {
    mockMedications = JSON.parse(savedMeds);
  }
} catch (error) {
  console.error('Failed to load from localStorage:', error);
}

