import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// For MVP, we'll use a workaround since we may not have service role key
// This endpoint gets user info from records table

export async function GET(request: NextRequest) {
  try {
    // Check if admin (you can add auth check here)
    // For now, we'll fetch users from records

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

    // Get all records to find unique users
    const { data: records, error: recordsError } = await supabase
      .from('blood_pressure_records')
      .select('user_id, created_at');

    if (recordsError) {
      throw recordsError;
    }

    // Group by user_id and count records
    const userMap = new Map<string, { count: number; created_at: string }>();

    records?.forEach(record => {
      if (record.user_id) {
        const existing = userMap.get(record.user_id);
        if (existing) {
          existing.count++;
          if (new Date(record.created_at) < new Date(existing.created_at)) {
            existing.created_at = record.created_at;
          }
        } else {
          userMap.set(record.user_id, {
            count: 1,
            created_at: record.created_at || new Date().toISOString(),
          });
        }
      }
    });

    // Try to get user emails from auth (requires service role)
    const users: Array<{ id: string; email: string; name?: string; created_at: string; record_count: number }> = [];

    for (const [userId, data] of userMap.entries()) {
      try {
        // Try to get user from auth (if service role available)
        const { data: authUser, error: authError } = await supabase.auth.admin?.getUserById(userId);
        
        users.push({
          id: userId,
          email: authUser?.user?.email || `user_${userId.slice(0, 8)}@example.com`,
          name: authUser?.user?.user_metadata?.full_name || authUser?.user?.user_metadata?.name,
          created_at: data.created_at,
          record_count: data.count,
        });
      } catch (error) {
        // Fallback if can't access auth
        users.push({
          id: userId,
          email: `user_${userId.slice(0, 8)}@example.com`,
          created_at: data.created_at,
          record_count: data.count,
        });
      }
    }

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

