/**
 * Clear All Data Script - Run this in browser console
 * This will clear both localStorage and Supabase data
 */

(async function clearAllDataNow() {
  console.log('🧹 Starting to clear all data...');
  
  // Clear localStorage
  try {
    localStorage.removeItem('bloodpg-records');
    localStorage.removeItem('bloodpg-medications');
    console.log('✅ Cleared localStorage');
  } catch (error) {
    console.error('❌ Error clearing localStorage:', error);
  }
  
  // Clear Supabase
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
    }
  } catch (error) {
    console.error('❌ Error clearing Supabase:', error);
  }
  
  console.log('✅ All data cleared! Reloading page...');
  setTimeout(() => {
    window.location.reload();
  }, 1000);
})();

