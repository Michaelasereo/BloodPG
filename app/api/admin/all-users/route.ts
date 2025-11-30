import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Get all authenticated users (for total user count)
 * This endpoint returns all users who have signed up, regardless of whether they have records
 */
export async function GET(request: NextRequest) {
  try {
    // Check if service role key is available
    const hasServiceRole = !!supabaseServiceRoleKey && supabaseServiceRoleKey !== process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    const supabase = createClient(
      supabaseUrl, 
      hasServiceRole ? supabaseServiceRoleKey : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Try to get all users from auth.users using service role
    if (hasServiceRole) {
      try {
        // List all users from auth (requires service role)
        const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
        
        if (usersError) {
          console.error('Error listing users with service role:', usersError);
          throw usersError;
        }

        console.log('✅ Fetched', users?.length || 0, 'users from auth.users');
        // Return all users
        return NextResponse.json(users || []);
      } catch (authError) {
        console.error('Could not access auth.users with service role:', authError);
        // Fall through to fallback
      }
    } else {
      console.log('⚠️ No service role key available, using fallback method');
    }

    // Fallback: Query auth.users table via database function
    try {
      // Try to get user count from database function
      const { data: userCount, error: countError } = await supabase
        .rpc('get_total_users_count');
      
      if (!countError && userCount !== null) {
        console.log('✅ Got user count from database function:', userCount);
        // Return array with that many items for counting
        return NextResponse.json(Array.from({ length: userCount }, (_, i) => ({ id: `user_${i}` })));
      }

      // Try to get all user IDs from database function
      const { data: userIds, error: idsError } = await supabase
        .rpc('get_all_user_ids');
      
      if (!idsError && userIds) {
        console.log('✅ Got user IDs from database function:', userIds.length);
        return NextResponse.json(userIds.map((u: any) => ({ id: u.user_id })));
      }
    } catch (rpcError) {
      console.log('Database function not available:', rpcError);
    }

    // Final fallback: Try to get current user and count from records
    // This is a workaround until database function is set up
    console.log('⚠️ Using records fallback - will only count users with saved records');
    
    // Try to get current session to at least count 1 if admin is logged in
    const { data: { session } } = await supabase.auth.getSession();
    const currentUserId = session?.user?.id;
    
    const { data: records, error: recordsError } = await supabase
      .from('blood_pressure_records')
      .select('user_id');

    if (recordsError) {
      console.error('Error fetching records:', recordsError);
      // If we can't get records but have a current user, return at least 1
      if (currentUserId) {
        console.log('⚠️ Returning 1 user (current admin) as fallback');
        return NextResponse.json([{ id: currentUserId }]);
      }
      throw recordsError;
    }

    // Get unique user IDs from records
    const uniqueUserIds = new Set<string>();
    records?.forEach(record => {
      if (record.user_id) {
        uniqueUserIds.add(record.user_id);
      }
    });
    
    // If current user is not in records but is logged in, add them
    if (currentUserId && !uniqueUserIds.has(currentUserId)) {
      uniqueUserIds.add(currentUserId);
      console.log('➕ Added current admin user to count');
    }

    console.log('⚠️ Fallback: Found', uniqueUserIds.size, 'users (including current user if logged in)');
    // Return array of user IDs (for counting)
    return NextResponse.json(Array.from(uniqueUserIds).map(id => ({ id })));
  } catch (error) {
    console.error('❌ Error fetching all users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

