import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Delete all records for this user
    const { error: recordsError } = await supabase
      .from('blood_pressure_records')
      .delete()
      .eq('user_id', userId);

    if (recordsError) {
      throw recordsError;
    }

    // Delete user's medications
    const { error: medicationsError } = await supabase
      .from('medications')
      .delete()
      .eq('user_id', userId);

    // Note: Deleting the auth user requires service role
    // For now, we just delete their data

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}

