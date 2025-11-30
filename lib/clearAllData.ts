/**
 * Clear All Data Utility
 * Clears all dummy/test data from localStorage and Supabase
 */

// No imports needed - using API route

/**
 * Clear all data from localStorage
 */
export function clearLocalStorageData(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem('bloodpg-records');
    localStorage.removeItem('bloodpg-medications');
    console.log('✅ Cleared all localStorage data');
  } catch (error) {
    console.error('❌ Error clearing localStorage:', error);
  }
}

/**
 * Clear all data from Supabase via API route (admin only)
 */
export async function clearSupabaseData(): Promise<void> {
  try {
    const response = await fetch('/api/admin/clear-data', {
      method: 'POST',
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Cleared Supabase:', result.message);
    } else {
      const errorText = await response.text();
      console.error('❌ Failed to clear Supabase:', response.status, errorText);
      throw new Error(`Failed to clear Supabase: ${errorText}`);
    }
  } catch (error) {
    console.error('❌ Error clearing Supabase data:', error);
    throw error;
  }
}

/**
 * Clear all data from both localStorage and Supabase
 */
export async function clearAllData(): Promise<void> {
  console.log('🧹 Clearing all data...');
  
  // Clear localStorage
  clearLocalStorageData();
  
  // Clear Supabase
  await clearSupabaseData();
  
  console.log('✅ All data cleared!');
  
  // Reload the page to reflect changes
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
}

// Make available in browser console
if (typeof window !== 'undefined') {
  (window as any).clearBloodPGData = clearAllData;
  (window as any).clearBloodPGLocalStorage = clearLocalStorageData;
  (window as any).clearBloodPGSupabase = clearSupabaseData;
}

