/**
 * Unified Data Service
 * This service uses Supabase when available, with localStorage as fallback
 */

import { getBloodPressureRecordsFromSupabase, saveBloodPressureRecordToSupabase, updateBloodPressureRecordInSupabase } from './supabaseService';
import { getBloodPressureRecords, saveBloodPressureRecord } from './mockData';
import type { BloodPressureRecord } from '@/types';

// Flag to enable/disable Supabase (useful for development)
const USE_SUPABASE = true;

/**
 * Get all blood pressure records
 * Uses Supabase if enabled, otherwise falls back to localStorage
 */
export async function getAllBloodPressureRecords(): Promise<BloodPressureRecord[]> {
  if (USE_SUPABASE && typeof window !== 'undefined') {
    try {
      const records = await getBloodPressureRecordsFromSupabase();
      if (records.length > 0) {
        console.log('✅ Loaded', records.length, 'records from Supabase');
        return records;
      }
      // If Supabase returns empty, fall back to localStorage for initial migration
      console.log('📊 Supabase empty, checking localStorage...');
    } catch (error) {
      console.error('❌ Error loading from Supabase, falling back to localStorage:', error);
    }
  }

  // Fallback to localStorage
  const records = getBloodPressureRecords();
  console.log('📦 Loaded', records.length, 'records from localStorage');
  return records;
}

/**
 * Save a blood pressure record
 * Saves to both Supabase (if enabled) and localStorage (as backup)
 */
export async function saveBloodPressureRecordUnified(
  record: Omit<BloodPressureRecord, 'id'>
): Promise<BloodPressureRecord | null> {
  let savedRecord: BloodPressureRecord | null = null;

  // Save to Supabase if enabled
  if (USE_SUPABASE && typeof window !== 'undefined') {
    try {
      // Use upsert (handled in saveBloodPressureRecordToSupabase)
      // This will automatically insert or update based on unique constraint
      savedRecord = await saveBloodPressureRecordToSupabase(record);
      
      if (savedRecord) {
        console.log('✅ Saved/Updated record in Supabase:', savedRecord.id);
      }

      if (!savedRecord) {
        throw new Error('Failed to save to Supabase');
      }
    } catch (error) {
      console.error('❌ Error saving to Supabase:', error);
      // Continue to save to localStorage as backup
    }
  }

  // Also save to localStorage as backup/migration aid
  try {
    const records = saveBloodPressureRecord(record);
    if (!savedRecord && records.length > 0) {
      savedRecord = records[records.length - 1];
    }
    console.log('💾 Saved to localStorage as backup');
  } catch (error) {
    console.error('❌ Error saving to localStorage:', error);
  }

  return savedRecord;
}

/**
 * Load records on component mount
 * This is a helper that can be used in useEffect
 */
export async function loadBloodPressureRecords(
  setRecords: (records: BloodPressureRecord[]) => void,
  setLoading?: (loading: boolean) => void,
  setError?: (error: string | null) => void
): Promise<void> {
  if (setLoading) setLoading(true);
  if (setError) setError(null);

  try {
    const records = await getAllBloodPressureRecords();
    setRecords(records);
  } catch (error) {
    console.error('Error loading records:', error);
    if (setError) setError('Failed to load records');
  } finally {
    if (setLoading) setLoading(false);
  }
}

