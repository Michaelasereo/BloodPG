# Supabase Integration - Quick Start

## ✅ Setup Complete

Your Supabase project has been configured:

- **Project URL:** https://vwdcjxmolvxlrfgcwpyf.supabase.co
- **Client Library:** Installed (`@supabase/supabase-js`)
- **Environment Variables:** Configured in `.env.local`
- **Database Schema:** Ready in `supabase/schema.sql`
- **Service Functions:** Created in `lib/supabaseService.ts`

## 📋 Next Steps

### 1. Create Database Tables

Go to your Supabase SQL Editor and run `supabase/schema.sql` to create:
- `blood_pressure_records` table
- `medications` table  
- `record_medications` junction table
- Row Level Security policies

### 2. Test Connection

You can test the Supabase connection by importing the client:

```typescript
import { supabase } from '@/lib/supabase';

// Test query
const { data, error } = await supabase
  .from('blood_pressure_records')
  .select('*')
  .limit(5);
```

### 3. Switch from localStorage to Supabase (Optional)

The app currently uses localStorage. To use Supabase instead:

**Current (localStorage):**
```typescript
import { getBloodPressureRecords } from '@/lib/mockData';
const records = getBloodPressureRecords();
```

**New (Supabase):**
```typescript
import { getBloodPressureRecordsFromSupabase } from '@/lib/supabaseService';
const records = await getBloodPressureRecordsFromSupabase();
```

## 📁 Files Created

- `lib/supabase.ts` - Supabase client configuration
- `lib/supabaseService.ts` - Database service functions
- `supabase/schema.sql` - Database schema
- `.env.local` - Environment variables (not committed to git)
- `SUPABASE_SETUP.md` - Detailed setup guide

## 🔧 Available Functions

### Blood Pressure Records
- `getBloodPressureRecordsFromSupabase()` - Fetch all records
- `saveBloodPressureRecordToSupabase(record)` - Save a new record
- `updateBloodPressureRecordInSupabase(record)` - Update existing record
- `deleteBloodPressureRecordFromSupabase(id)` - Delete a record

### Medications
- `getMedicationsFromSupabase()` - Fetch all medications
- `addMedicationToSupabase(medication)` - Add a new medication

## 🔒 Security

Row Level Security (RLS) is enabled by default. The schema includes policies that:
- Allow users to read/write their own data
- Support anonymous access (user_id is nullable)
- Filter data automatically based on authentication

## 📚 Documentation

For more details, see `SUPABASE_SETUP.md`.

