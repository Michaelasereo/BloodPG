// Dummy data reset is now disabled for testing
// import { resetToDummyData } from './mockData';

// Export a function that can be called from browser console - DISABLED FOR TESTING
if (typeof window !== 'undefined') {
  // DISABLED: Reset function
  // (window as any).resetBloodPGData = () => {
  //   resetToDummyData();
  //   window.location.reload();
  // };
  
  // DISABLED: Auto-initialize dummy data on first load if localStorage is empty
  // if (!localStorage.getItem('bloodpg-records')) {
  //   resetToDummyData();
  // }
  
  console.log('ℹ️ Dummy data auto-initialization is disabled');
}

