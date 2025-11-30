/**
 * Clear All Data Script
 * Run this in browser console or via Node.js to clear all dummy/test data
 * 
 * Usage in browser console:
 *   import('/scripts/clear-all-data.js').then(m => m.clearAllData())
 * 
 * Or use the global function:
 *   clearBloodPGData()
 */

// Clear localStorage
function clearLocalStorage() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('bloodpg-records');
    localStorage.removeItem('bloodpg-medications');
    console.log('✅ Cleared localStorage');
  }
}

// Clear Supabase data via API
async function clearSupabase() {
  try {
    const response = await fetch('/api/admin/clear-data', {
      method: 'POST',
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Cleared Supabase:', result.message);
    } else {
      console.error('❌ Failed to clear Supabase:', await response.text());
    }
  } catch (error) {
    console.error('❌ Error clearing Supabase:', error);
  }
}

// Clear all data
export async function clearAllData() {
  console.log('🧹 Clearing all data...');
  
  // Clear localStorage
  clearLocalStorage();
  
  // Clear Supabase
  await clearSupabase();
  
  console.log('✅ All data cleared! Reloading page...');
  
  // Reload page
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
}

// Make available globally
if (typeof window !== 'undefined') {
  (window as any).clearBloodPGData = clearAllData;
}

