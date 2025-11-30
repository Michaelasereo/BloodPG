// Dummy data initialization is now disabled for testing
// To re-enable, uncomment the code below:
// import { resetToDummyData } from './mockData';

// Auto-initialize dummy data on client side - DISABLED FOR TESTING
if (typeof window !== 'undefined') {
  // DISABLED: Initialize dummy data if localStorage is empty or has no records
  // const savedRecords = localStorage.getItem('bloodpg-records');
  // if (!savedRecords || savedRecords === '[]') {
  //   console.log('🚀 Initializing BloodPG dummy data...');
  //   resetToDummyData();
  // }
  console.log('ℹ️ Dummy data auto-initialization is disabled');
}

