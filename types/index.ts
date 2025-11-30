export interface BloodPressureReading {
  systolic: number;
  diastolic: number;
  preMedication: boolean;
  postMedication: boolean;
}

export interface BloodPressureRecord {
  id: number;
  date: Date;
  am: BloodPressureReading;
  pm: BloodPressureReading;
  medications: string[];
}

export interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
}

export interface User {
  name: string;
  email?: string;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface BloodPressureFormData {
  am: {
    systolic: string;
    diastolic: string;
    preMedication: boolean;
    postMedication: boolean;
  };
  pm: {
    systolic: string;
    diastolic: string;
    preMedication: boolean;
    postMedication: boolean;
  };
}

export type MainTab = 'blood-pressure' | 'glucose';
export type SidebarTab = 'enter' | 'medications' | 'records';
export type Theme = 'light' | 'dark';

