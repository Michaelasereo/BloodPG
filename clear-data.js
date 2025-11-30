// Quick script to clear all data
// Run in browser console: 
//   localStorage.clear(); fetch('/api/admin/clear-data', {method: 'POST'}).then(() => location.reload());

console.log('🧹 Clearing all data...');

// Clear localStorage
localStorage.removeItem('bloodpg-records');
localStorage.removeItem('bloodpg-medications');
console.log('✅ Cleared localStorage');

// Clear Supabase
fetch('/api/admin/clear-data', { method: 'POST' })
  .then(res => res.json())
  .then(data => {
    console.log('✅ Cleared Supabase:', data.message);
    console.log('🔄 Reloading page...');
    setTimeout(() => location.reload(), 1000);
  })
  .catch(err => {
    console.error('❌ Error:', err);
  });
