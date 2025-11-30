# Admin Dashboard Setup

## Issue: Total Users Showing Zero

If the "Total Users" stat is showing 0 even though users have signed in, you need to set up a database function to count all authenticated users.

## Solution: Run Database Function

1. **Go to Supabase SQL Editor**
   - Navigate to: https://supabase.com/dashboard/project/vwdcjxmolvxlrfgcwpyf/sql/new

2. **Run the Admin Functions SQL**
   - Copy and paste the contents of `supabase/admin_functions.sql`
   - Click "Run" to execute

3. **Verify the Functions**
   - The functions `get_total_users_count()` and `get_all_user_ids()` will be created
   - These allow the admin dashboard to count all authenticated users

## Alternative: Use Service Role Key (Recommended)

For better performance and security, you can use the Supabase Service Role Key:

1. **Get Service Role Key**
   - Go to: https://supabase.com/dashboard/project/vwdcjxmolvxlrfgcwpyf/settings/api
   - Copy the "service_role" key (keep this secret!)

2. **Add to Environment Variables**
   - Add to `.env.local`:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

3. **Restart Dev Server**
   ```bash
   npm run dev
   ```

## Current Workaround

Until you set up the database function or service role key, the admin dashboard will:
- Count users who have saved records
- Include the current admin user if they're logged in
- Show 0 if no records exist and no service role is configured

## Testing

After setup, refresh the admin dashboard and check:
- ✅ Total Users should show the correct count
- ✅ Users Table should only show users with saved records
- ✅ Check browser console for any error messages

