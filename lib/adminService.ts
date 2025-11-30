/**
 * Admin Service
 * Functions for admin dashboard operations
 */

import { getSupabaseClient } from './supabase';

export interface AdminUser {
  id: string;
  email: string | null;
  name: string | null;
  created_at: string;
  record_count: number;
}

export interface AdminStats {
  totalUsers: number;
  totalRecords: number;
  averageSystolic: number;
  averageDiastolic: number;
}

/**
 * Check if the current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  const supabase = getSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user || !user.email) {
    return false;
  }
  
  // Only allow asereopeyemimichael@gmail.com as admin
  return user.email.toLowerCase() === 'asereopeyemimichael@gmail.com';
}

/**
 * Get all users with their record counts
 */
export async function getAllUsers(): Promise<AdminUser[]> {
  const supabase = getSupabaseClient();
  
  // Get all users from auth.users (requires admin privileges)
  // Note: This requires using the service role key or a custom function
  // For now, we'll get users from blood_pressure_records table
  const { data: records, error } = await supabase
    .from('blood_pressure_records')
    .select('user_id, date')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching records for admin:', error);
    return [];
  }

  // Group records by user_id and count
  const userRecordCounts = new Map<string, number>();
  const userIds = new Set<string>();
  
  records?.forEach((record) => {
    if (record.user_id) {
      userIds.add(record.user_id);
      userRecordCounts.set(
        record.user_id,
        (userRecordCounts.get(record.user_id) || 0) + 1
      );
    }
  });

  // Fetch user details - try API route first, fallback to basic info
  const users: AdminUser[] = [];
  
  // Try to get user details from API route (uses service role)
  try {
    const response = await fetch('/api/admin/users');
    if (response.ok) {
      const apiUsers = await response.json();
      // Merge API user data with record counts
      const apiUserMap = new Map(apiUsers.map((u: any) => [u.id, u]));
      
      for (const userId of userIds) {
        const apiUser = apiUserMap.get(userId);
        if (apiUser) {
          users.push({
            id: userId,
            email: apiUser.email || null,
            name: apiUser.name || null,
            created_at: apiUser.created_at || '',
            record_count: userRecordCounts.get(userId) || 0,
          });
        } else {
          // User from records but not in API response
          users.push({
            id: userId,
            email: null,
            name: null,
            created_at: '',
            record_count: userRecordCounts.get(userId) || 0,
          });
        }
      }
    } else {
      throw new Error('API route failed');
    }
  } catch (error) {
    // Fallback: create users with basic info from records
    console.log('Could not fetch user details from API, using fallback:', error);
    for (const userId of userIds) {
      users.push({
        id: userId,
        email: null,
        name: null,
        created_at: '',
        record_count: userRecordCounts.get(userId) || 0,
      });
    }
  }

  return users.sort((a, b) => b.record_count - a.record_count);
}

/**
 * Get admin dashboard statistics
 */
export async function getAdminStats(): Promise<AdminStats> {
  const supabase = getSupabaseClient();
  
  // Get total records
  const { data: records, error: recordsError } = await supabase
    .from('blood_pressure_records')
    .select('am_systolic, am_diastolic, pm_systolic, pm_diastolic, user_id');

  if (recordsError) {
    console.error('Error fetching records for stats:', recordsError);
    return {
      totalUsers: 0,
      totalRecords: 0,
      averageSystolic: 0,
      averageDiastolic: 0,
    };
  }

  const totalRecords = records?.length || 0;
  
  // Count ALL authenticated users (not just those with records)
  // Try to get from API route which uses service role
  let totalUsers = 0;
  try {
    const response = await fetch('/api/admin/all-users');
    if (response.ok) {
      const allUsers = await response.json();
      totalUsers = allUsers.length;
      console.log('✅ Fetched all users from API:', totalUsers);
    } else {
      const errorText = await response.text();
      console.error('❌ API route failed:', response.status, errorText);
      // Fallback: count unique users from records if API fails
      const uniqueUsers = new Set<string>();
      records?.forEach((record) => {
        if (record.user_id) {
          uniqueUsers.add(record.user_id);
        }
      });
      totalUsers = uniqueUsers.size;
      console.log('⚠️ Using fallback - users with records:', totalUsers);
    }
  } catch (error) {
    // Fallback: count unique users from records if API fails
    console.error('❌ Could not fetch all users from API:', error);
    const uniqueUsers = new Set<string>();
    records?.forEach((record) => {
      if (record.user_id) {
        uniqueUsers.add(record.user_id);
      }
    });
    totalUsers = uniqueUsers.size;
    console.log('⚠️ Using fallback - users with records:', totalUsers);
  }

  // Calculate average blood pressure
  let totalSystolic = 0;
  let totalDiastolic = 0;
  let count = 0;

  records?.forEach((record) => {
    if (record.am_systolic && record.am_diastolic) {
      totalSystolic += record.am_systolic;
      totalDiastolic += record.am_diastolic;
      count++;
    }
    if (record.pm_systolic && record.pm_diastolic) {
      totalSystolic += record.pm_systolic;
      totalDiastolic += record.pm_diastolic;
      count++;
    }
  });

  const averageSystolic = count > 0 ? Math.round(totalSystolic / count) : 0;
  const averageDiastolic = count > 0 ? Math.round(totalDiastolic / count) : 0;

  return {
    totalUsers,
    totalRecords,
    averageSystolic,
    averageDiastolic,
  };
}

/**
 * Delete a user and all their records
 */
export async function deleteUserAndRecords(userId: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  
  try {
    // First, delete all records for this user
    const { error: recordsError } = await supabase
      .from('blood_pressure_records')
      .delete()
      .eq('user_id', userId);

    if (recordsError) {
      console.error('Error deleting records:', recordsError);
      return false;
    }

    // Delete medications for this user
    const { error: medsError } = await supabase
      .from('medications')
      .delete()
      .eq('user_id', userId);

    if (medsError) {
      console.error('Error deleting medications:', medsError);
      // Continue even if medications deletion fails
    }

    // Note: Deleting the auth user requires admin privileges
    // This would typically be done via a server-side function or service role
    // For now, we'll just delete their data
    
    return true;
  } catch (error) {
    console.error('Error deleting user and records:', error);
    return false;
  }
}
