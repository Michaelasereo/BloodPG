import { getSupabaseClient } from './supabase';
import { parseISO, format } from 'date-fns';
import type { BloodPressureRecord, Medication } from '@/types';

// Database table names
const TABLES = {
  BLOOD_PRESSURE_RECORDS: 'blood_pressure_records',
  MEDICATIONS: 'medications',
} as const;

// Database types (matching Supabase schema)
export interface BloodPressureRecordRow {
  id: number;
  date: string; // ISO date string
  user_id?: string;
  am_systolic: number;
  am_diastolic: number;
  am_pre_medication: boolean;
  am_post_medication: boolean;
  pm_systolic: number;
  pm_diastolic: number;
  pm_pre_medication: boolean;
  pm_post_medication: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface MedicationRow {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RecordMedicationRow {
  record_id: number;
  medication_id: number;
}

// Convert database row to app type
function rowToBloodPressureRecord(row: BloodPressureRecordRow, medications: string[]): BloodPressureRecord {
  return {
    id: row.id,
    date: parseISO(row.date),
    am: {
      systolic: row.am_systolic,
      diastolic: row.am_diastolic,
      preMedication: row.am_pre_medication,
      postMedication: row.am_post_medication,
    },
    pm: {
      systolic: row.pm_systolic,
      diastolic: row.pm_diastolic,
      preMedication: row.pm_pre_medication,
      postMedication: row.pm_post_medication,
    },
    medications,
  };
}

// Convert app type to database row
function bloodPressureRecordToRow(record: Omit<BloodPressureRecord, 'id'>): Omit<BloodPressureRecordRow, 'id' | 'created_at' | 'updated_at'> {
  return {
    date: format(record.date, 'yyyy-MM-dd'),
    am_systolic: record.am.systolic,
    am_diastolic: record.am.diastolic,
    am_pre_medication: record.am.preMedication,
    am_post_medication: record.am.postMedication,
    pm_systolic: record.pm.systolic,
    pm_diastolic: record.pm.diastolic,
    pm_pre_medication: record.pm.preMedication,
    pm_post_medication: record.pm.postMedication,
  };
}

// Fetch all blood pressure records
export async function getBloodPressureRecordsFromSupabase(): Promise<BloodPressureRecord[]> {
  try {
    const supabase = getSupabaseClient();
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    // Query records - RLS will automatically filter by user_id if authenticated
    const { data, error } = await supabase
      .from(TABLES.BLOOD_PRESSURE_RECORDS)
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      // Log more details about the error
      console.error('Error fetching blood pressure records:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        user: user ? 'authenticated' : 'not authenticated'
      });
      
      // If it's a permission error and user is not authenticated, that's expected
      if (error.code === 'PGRST301' || error.message?.includes('permission') || error.message?.includes('policy')) {
        console.log('ℹ️ Permission denied - user may not be authenticated or RLS policies may need adjustment');
      }
      
      return [];
    }

    if (!data || data.length === 0) {
      console.log('ℹ️ No records found in Supabase');
      return [];
    }

    // Filter records by user_id if authenticated (additional safety check)
    const userRecords = user 
      ? data.filter((row: BloodPressureRecordRow) => row.user_id === user.id || row.user_id === null)
      : data.filter((row: BloodPressureRecordRow) => row.user_id === null);

    if (userRecords.length === 0) {
      console.log('ℹ️ No records found for current user');
      return [];
    }

    // Fetch medications for each record (optional - only if table exists)
    const medicationsMap = new Map<number, string[]>();
    if (userRecords.length > 0) {
      try {
        const recordIds = userRecords.map((r: BloodPressureRecordRow) => r.id);
        const { data: recordMedications, error: medError } = await supabase
          .from('record_medications')
          .select('record_id, medication_id, medications(name, dosage, frequency)')
          .in('record_id', recordIds);

        if (medError) {
          // Table might not exist or no medications linked yet - this is okay
          console.log('Note: Medications not available yet:', medError.message);
        } else if (recordMedications) {
          recordMedications.forEach((rm: any) => {
            if (!medicationsMap.has(rm.record_id)) {
              medicationsMap.set(rm.record_id, []);
            }
            const med = rm.medications;
            if (med && med.name) {
              medicationsMap.get(rm.record_id)!.push(
                `${med.name} ${med.dosage || ''} ${med.frequency || ''}`.trim()
              );
            }
          });
        }
      } catch (error) {
        // Medications table might not be set up yet - continue without them
        console.log('Medications feature not available yet:', error);
      }
    }

    // Convert rows to records
    return userRecords.map((row: BloodPressureRecordRow) => {
      const medications = medicationsMap.get(row.id) || [];
      return rowToBloodPressureRecord(row, medications);
    });
  } catch (error) {
    console.error('Error in getBloodPressureRecordsFromSupabase:', error);
    return [];
  }
}

// Save a blood pressure record
export async function saveBloodPressureRecordToSupabase(
  record: Omit<BloodPressureRecord, 'id'>
): Promise<BloodPressureRecord | null> {
  try {
    const supabase = getSupabaseClient();
    
    // Get the current authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Error getting authenticated user:', userError);
      throw new Error('User must be authenticated to save records');
    }
    
    const recordRow = bloodPressureRecordToRow(record);
    
    // Add user_id (required for authenticated users)
    const recordWithUser = { ...recordRow, user_id: user.id };

    // Check if record exists for this user and date
    const dateStr = format(record.date, 'yyyy-MM-dd');
    const { data: existing, error: checkError } = await supabase
      .from(TABLES.BLOOD_PRESSURE_RECORDS)
      .select('id')
      .eq('user_id', user.id)
      .eq('date', dateStr)
      .maybeSingle(); // Use maybeSingle() to avoid error if not found

    let data, error;
    let savedRecordId: number | undefined;
    
    if (existing && !checkError) {
      // Update existing record
      ({ data, error } = await supabase
        .from(TABLES.BLOOD_PRESSURE_RECORDS)
        .update({
          ...recordRow,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single());
      savedRecordId = existing.id;
    } else {
      // Insert new record
      ({ data, error } = await supabase
        .from(TABLES.BLOOD_PRESSURE_RECORDS)
        .insert([recordWithUser])
        .select()
        .single());
      if (data) {
        savedRecordId = (data as BloodPressureRecordRow).id;
      }
    }

    if (error) {
      console.error('Error saving blood pressure record:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return null;
    }

    // Ensure we have the record ID
    if (!savedRecordId && data) {
      savedRecordId = (data as BloodPressureRecordRow).id;
    }

    if (!savedRecordId) {
      console.error('❌ No record ID available after save');
      return null;
    }

    // Automatically link default medications to this record if they exist
    // Only link for NEW records (not updates), or if no medications exist for this record
    try {
      const defaultMeds = await getDefaultMedications();
      if (defaultMeds.length > 0 && savedRecordId) {
        // Check if medications already exist for this record
        const existingMedsForRecord = await getMedicationsForRecord(savedRecordId);
        
        // Only auto-link if no medications exist for this record (new record or record without meds)
        if (existingMedsForRecord.length === 0) {
          console.log('🔗 Auto-linking', defaultMeds.length, 'default medications to NEW record:', savedRecordId);
          
          // Link each default medication to the record
          for (const med of defaultMeds) {
            // Check if medication already exists for this user
            const { data: existingMed } = await supabase
              .from('medications')
              .select('id')
              .eq('user_id', user.id)
              .eq('name', med.name)
              .eq('dosage', med.dosage || '')
              .eq('frequency', med.frequency || '')
            .maybeSingle();

            let medicationId: number;
            
            if (existingMed) {
              medicationId = existingMed.id;
            } else {
              // Create new medication
              const { data: newMed, error: medError } = await supabase
                .from('medications')
                .insert([{
                  user_id: user.id,
                  name: med.name,
                  dosage: med.dosage || '',
                  frequency: med.frequency || ''
                }])
                .select('id')
                .single();

              if (medError || !newMed) {
                console.error('Error creating medication:', medError);
                continue;
              }
              medicationId = newMed.id;
            }

            // Link medication to record
            const { error: linkError } = await supabase
              .from('record_medications')
              .upsert({
                record_id: savedRecordId,
                medication_id: medicationId
              }, {
                onConflict: 'record_id,medication_id'
              });

            if (linkError) {
              console.error('Error linking default medication to record:', linkError);
            } else {
              console.log('✅ Linked default medication:', med.name);
            }
          }
          console.log('✅ Successfully auto-linked', defaultMeds.length, 'default medications to record:', savedRecordId);
      } else {
        console.log('ℹ️ Record already has', existingMedsForRecord.length, 'medications, skipping auto-link');
      }
    } else {
      if (!defaultMeds.length) {
        console.log('ℹ️ No default medications set');
      }
    }
    } catch (medError) {
      // Don't fail the record save if medication linking fails
      console.error('❌ Error auto-linking default medications:', medError);
    }

    // Fetch medications for the record to return them
    const medications: string[] = [];
    try {
      const linkedMeds = await getMedicationsForRecord(savedRecordId);
      medications.push(...linkedMeds.map(m => 
        `Tabs ${m.name} ${m.dosage || ''} ${m.frequency || ''}`.trim()
      ));
    } catch (error) {
      // If fetching fails, use the medications from the record parameter
      console.log('Using medications from record parameter');
    }

    return rowToBloodPressureRecord(data as BloodPressureRecordRow, medications.length > 0 ? medications : record.medications);
  } catch (error) {
    console.error('Error in saveBloodPressureRecordToSupabase:', error);
    return null;
  }
}

// Update a blood pressure record
export async function updateBloodPressureRecordInSupabase(
  record: BloodPressureRecord
): Promise<BloodPressureRecord | null> {
  try {
    const supabase = getSupabaseClient();
    const recordRow = bloodPressureRecordToRow(record);

    const { data, error } = await supabase
      .from(TABLES.BLOOD_PRESSURE_RECORDS)
      .update({
        ...recordRow,
        updated_at: new Date().toISOString(),
      })
      .eq('id', record.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating blood pressure record:', error);
      return null;
    }

    return rowToBloodPressureRecord(data as BloodPressureRecordRow, record.medications);
  } catch (error) {
    console.error('Error in updateBloodPressureRecordInSupabase:', error);
    return null;
  }
}

// Delete a blood pressure record
export async function deleteBloodPressureRecordFromSupabase(id: number): Promise<boolean> {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from(TABLES.BLOOD_PRESSURE_RECORDS)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting blood pressure record:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteBloodPressureRecordFromSupabase:', error);
    return false;
  }
}

// Fetch medications
export async function getMedicationsFromSupabase(): Promise<Medication[]> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from(TABLES.MEDICATIONS)
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching medications:', error);
      return [];
    }

    if (!data) {
      return [];
    }

    return data.map((row: MedicationRow) => ({
      id: row.id,
      name: row.name,
      dosage: row.dosage,
      frequency: row.frequency,
    }));
  } catch (error) {
    console.error('Error in getMedicationsFromSupabase:', error);
    return [];
  }
}

// Add a medication
export async function addMedicationToSupabase(
  medication: Omit<Medication, 'id'>
): Promise<Medication | null> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from(TABLES.MEDICATIONS)
      .insert([medication])
      .select()
      .single();

    if (error) {
      console.error('Error adding medication:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      dosage: data.dosage,
      frequency: data.frequency,
    };
  } catch (error) {
    console.error('Error in addMedicationToSupabase:', error);
    return null;
  }
}

// Get medications for a specific record
export async function getMedicationsForRecord(recordId: number): Promise<Medication[]> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('record_medications')
      .select('medications(id, name, dosage, frequency)')
      .eq('record_id', recordId);

    if (error) {
      console.error('Error fetching medications for record:', error);
      return [];
    }

    return data.map((item: any) => ({
      id: item.medications.id,
      name: item.medications.name,
      dosage: item.medications.dosage,
      frequency: item.medications.frequency,
    }));
  } catch (error) {
    console.error('Error in getMedicationsForRecord:', error);
    return [];
  }
}

// Preload all medications for all records (for caching)
export async function getAllMedicationsForRecords(recordIds: number[]): Promise<Map<number, Medication[]>> {
  const medicationsMap = new Map<number, Medication[]>();
  
  if (recordIds.length === 0) {
    return medicationsMap;
  }

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('record_medications')
      .select('record_id, medications(id, name, dosage, frequency)')
      .in('record_id', recordIds);

    if (error) {
      console.error('Error preloading medications:', error);
      return medicationsMap;
    }

    if (data) {
      data.forEach((item: any) => {
        const recordId = item.record_id;
        const medication = {
          id: item.medications.id,
          name: item.medications.name,
          dosage: item.medications.dosage,
          frequency: item.medications.frequency,
        };

        if (!medicationsMap.has(recordId)) {
          medicationsMap.set(recordId, []);
        }
        medicationsMap.get(recordId)!.push(medication);
      });
    }

    console.log('✅ Pre-loaded medications for', medicationsMap.size, 'records');
    return medicationsMap;
  } catch (error) {
    console.error('Error in getAllMedicationsForRecords:', error);
    return medicationsMap;
  }
}

// Save default medications for a user
export async function saveDefaultMedications(
  medications: Array<{name: string, dosage: string, frequency: string}>
): Promise<boolean> {
  try {
    const supabase = getSupabaseClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Error getting authenticated user:', userError);
      throw new Error('User must be authenticated to save default medications');
    }

    // First, remove existing default medications for this user
    // We'll mark them by storing in user metadata or a separate table
    // For now, we'll use a simple approach: store in user metadata
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        default_medications: medications
      }
    });

    if (updateError) {
      console.error('Error saving default medications:', updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in saveDefaultMedications:', error);
    return false;
  }
}

// Get default medications for a user
export async function getDefaultMedications(): Promise<Array<{name: string, dosage: string, frequency: string}>> {
  try {
    const supabase = getSupabaseClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Error getting authenticated user:', userError);
      return [];
    }

    const defaultMeds = user.user_metadata?.default_medications;
    if (defaultMeds && Array.isArray(defaultMeds)) {
      return defaultMeds;
    }

    return [];
  } catch (error) {
    console.error('Error in getDefaultMedications:', error);
    return [];
  }
}

