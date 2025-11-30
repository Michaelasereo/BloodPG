import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Clear all data from Supabase (admin only)
 * This endpoint clears all records, medications, and junction table data
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Delete all record_medications first (foreign key constraints)
    const { error: junctionError } = await supabase
      .from('record_medications')
      .delete()
      .neq('record_id', 0);

    if (junctionError) {
      console.error('Error deleting record_medications:', junctionError);
    }

    // Delete all blood_pressure_records
    const { error: recordsError } = await supabase
      .from('blood_pressure_records')
      .delete()
      .neq('id', 0);

    if (recordsError) {
      console.error('Error deleting records:', recordsError);
    }

    // Delete all medications
    const { error: medsError } = await supabase
      .from('medications')
      .delete()
      .neq('id', 0);

    if (medsError) {
      console.error('Error deleting medications:', medsError);
    }

    return NextResponse.json({ 
      success: true,
      message: 'All data cleared from Supabase'
    });
  } catch (error) {
    console.error('Error clearing data:', error);
    return NextResponse.json(
      { error: 'Failed to clear data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

