# Testing Supabase Integration

## Quick Test Guide

Your Supabase integration is now set up! Here's how to test it:

### 1. Check Connection

Open your browser console (F12) and you should see:
- `✅ Loaded X records from Supabase` or
- `📦 Loaded X records from localStorage` (if Supabase is empty)

### 2. Save a Record

1. Fill out the blood pressure form in the left sidebar
2. Click "Save"
3. Check the console for:
   - `✅ Saved new record to Supabase: [id]`
   - `💾 Saved to localStorage as backup`

### 3. Verify in Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/vwdcjxmolvxlrfgcwpyf/editor
2. Click on `blood_pressure_records` table
3. You should see your saved record!

### 4. Check Auto-Refresh

After saving a record:
- The table in MainContent should automatically refresh
- Look for `🔄 Refreshing records after save...` in console

## Troubleshooting

### No records showing?
- Check browser console for errors
- Verify `.env.local` has correct credentials
- Check Supabase dashboard to see if tables exist
- Try disabling RLS temporarily: `ALTER TABLE blood_pressure_records DISABLE ROW LEVEL SECURITY;`

### Save not working?
- Check browser console for error messages
- Verify the table exists in Supabase
- Check RLS policies allow inserts

### Connection errors?
- Make sure `.env.local` file exists in project root
- Verify the Supabase URL and anon key are correct
- Check network tab in browser DevTools

## Expected Behavior

1. **On Load**: App loads records from Supabase (or localStorage if empty)
2. **On Save**: Record saves to both Supabase AND localStorage
3. **Auto-Refresh**: MainContent automatically updates when a record is saved
4. **Fallback**: If Supabase fails, localStorage is used as backup

## Next Steps

- [ ] Test saving records
- [ ] Verify records appear in Supabase dashboard
- [ ] Test loading records on page refresh
- [ ] Test error handling (disable Supabase temporarily)

