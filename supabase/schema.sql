-- BloodPG Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create blood_pressure_records table
CREATE TABLE IF NOT EXISTS blood_pressure_records (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  am_systolic INTEGER NOT NULL,
  am_diastolic INTEGER NOT NULL,
  am_pre_medication BOOLEAN DEFAULT false,
  am_post_medication BOOLEAN DEFAULT false,
  pm_systolic INTEGER NOT NULL,
  pm_diastolic INTEGER NOT NULL,
  pm_pre_medication BOOLEAN DEFAULT false,
  pm_post_medication BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_date UNIQUE (user_id, date)
);

-- Create medications table
CREATE TABLE IF NOT EXISTS medications (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT,
  frequency TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create record_medications junction table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS record_medications (
  record_id BIGINT REFERENCES blood_pressure_records(id) ON DELETE CASCADE,
  medication_id BIGINT REFERENCES medications(id) ON DELETE CASCADE,
  PRIMARY KEY (record_id, medication_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_blood_pressure_records_user_id ON blood_pressure_records(user_id);
CREATE INDEX IF NOT EXISTS idx_blood_pressure_records_date ON blood_pressure_records(date DESC);
CREATE INDEX IF NOT EXISTS idx_medications_user_id ON medications(user_id);
CREATE INDEX IF NOT EXISTS idx_record_medications_record_id ON record_medications(record_id);
CREATE INDEX IF NOT EXISTS idx_record_medications_medication_id ON record_medications(medication_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_blood_pressure_records_updated_at
  BEFORE UPDATE ON blood_pressure_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medications_updated_at
  BEFORE UPDATE ON medications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE blood_pressure_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE record_medications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for blood_pressure_records
-- Allow users to read their own records
CREATE POLICY "Users can view their own blood pressure records"
  ON blood_pressure_records
  FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Allow users to insert their own records
CREATE POLICY "Users can insert their own blood pressure records"
  ON blood_pressure_records
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Allow users to update their own records
CREATE POLICY "Users can update their own blood pressure records"
  ON blood_pressure_records
  FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Allow users to delete their own records
CREATE POLICY "Users can delete their own blood pressure records"
  ON blood_pressure_records
  FOR DELETE
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Create RLS policies for medications
-- Allow users to read their own medications
CREATE POLICY "Users can view their own medications"
  ON medications
  FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Allow users to insert their own medications
CREATE POLICY "Users can insert their own medications"
  ON medications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Allow users to update their own medications
CREATE POLICY "Users can update their own medications"
  ON medications
  FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Allow users to delete their own medications
CREATE POLICY "Users can delete their own medications"
  ON medications
  FOR DELETE
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Create RLS policies for record_medications
-- Allow users to view record_medications for their records
CREATE POLICY "Users can view record_medications for their records"
  ON record_medications
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM blood_pressure_records
      WHERE blood_pressure_records.id = record_medications.record_id
      AND (blood_pressure_records.user_id = auth.uid() OR blood_pressure_records.user_id IS NULL)
    )
  );

-- Allow users to insert record_medications for their records
CREATE POLICY "Users can insert record_medications for their records"
  ON record_medications
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM blood_pressure_records
      WHERE blood_pressure_records.id = record_medications.record_id
      AND (blood_pressure_records.user_id = auth.uid() OR blood_pressure_records.user_id IS NULL)
    )
  );

-- Allow users to delete record_medications for their records
CREATE POLICY "Users can delete record_medications for their records"
  ON record_medications
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM blood_pressure_records
      WHERE blood_pressure_records.id = record_medications.record_id
      AND (blood_pressure_records.user_id = auth.uid() OR blood_pressure_records.user_id IS NULL)
    )
  );

