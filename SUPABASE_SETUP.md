# Supabase Setup Guide

This guide will help you set up Supabase for the BloodPG application.

## Step 1: Create Environment Variables

Create a `.env.local` file in the root of your project with the following content:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Important:** The `.env.local` file is already in `.gitignore`, so it won't be committed to version control.

## Step 2: Set Up Database Schema

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to the **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `supabase/schema.sql` into the editor
5. Click **Run** to execute the SQL script

This will create:
- `blood_pressure_records` table for storing blood pressure readings
- `medications` table for storing medication information
- `record_medications` junction table for linking records to medications
- Row Level Security (RLS) policies to ensure data privacy
- Indexes for better query performance

## Step 3: Verify Installation

After running the SQL script, verify the tables were created:

1. Go to **Table Editor** in the Supabase dashboard
2. You should see three tables:
   - `blood_pressure_records`
   - `medications`
   - `record_medications`

## Step 4: (Optional) Disable RLS for Testing

If you want to test without authentication first, you can temporarily disable RLS:

```sql
ALTER TABLE blood_pressure_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE medications DISABLE ROW LEVEL SECURITY;
ALTER TABLE record_medications DISABLE ROW LEVEL SECURITY;
```

**Note:** Only do this for development/testing. Re-enable RLS before deploying to production.

## Project Structure

The Supabase integration includes:

- `lib/supabase.ts` - Supabase client configuration
- `lib/supabaseService.ts` - Service functions for database operations
- `supabase/schema.sql` - Database schema and migrations

## Usage

The application currently uses localStorage for data persistence. To switch to Supabase:

1. Import the Supabase service functions in your components
2. Replace `getBloodPressureRecords()` with `getBloodPressureRecordsFromSupabase()`
3. Replace `saveBloodPressureRecord()` with `saveBloodPressureRecordToSupabase()`

Example:

```typescript
import { getBloodPressureRecordsFromSupabase } from '@/lib/supabaseService';

// Instead of:
const records = getBloodPressureRecords();

// Use:
const records = await getBloodPressureRecordsFromSupabase();
```

## Authentication (Future)

The schema is set up to support user authentication. When you're ready to add authentication:

1. Enable Supabase Auth in your project dashboard
2. Implement authentication in your Next.js app
3. The RLS policies will automatically filter data by user

## Troubleshooting

- **Connection errors**: Make sure your `.env.local` file has the correct values
- **Permission errors**: Check that RLS policies are set up correctly or temporarily disable RLS for testing
- **Table not found**: Make sure you ran the `schema.sql` script in the SQL Editor

## Next Steps

1. ✅ Install Supabase client library
2. ✅ Create environment variables
3. ✅ Set up database schema
4. ⏳ Migrate from localStorage to Supabase (optional)
5. ⏳ Add authentication (optional)
6. ⏳ Test database operations

