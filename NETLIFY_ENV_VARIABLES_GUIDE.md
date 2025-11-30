# 🔐 Adding Environment Variables to Netlify

## Step-by-Step Guide

### Step 1: Get Your Supabase Credentials

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Sign in to your account

2. **Select Your Project**
   - Click on your BloodPG project (or create one if you haven't)

3. **Navigate to API Settings**
   - In the left sidebar, click **Settings** (gear icon)
   - Click **API** in the settings menu

4. **Copy Your Credentials**
   You'll see three important values:
   
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
     - This goes into `NEXT_PUBLIC_SUPABASE_URL`
   
   - **anon public** key (a long string starting with `eyJ...`)
     - This goes into `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   
   - **service_role** key (a long string starting with `eyJ...`)
     - This goes into `SUPABASE_SERVICE_ROLE_KEY` (optional, but recommended for admin features)
     - ⚠️ **Keep this secret!** Never share it publicly.

### Step 2: Add Variables to Netlify

1. **Go to Your Netlify Site**
   - Visit: https://app.netlify.com
   - Click on your BloodPG site

2. **Navigate to Environment Variables**
   - Click **Site settings** (in the top navigation)
   - Scroll down and click **Environment variables** (under "Build & deploy")

3. **Add Each Variable**

   Click **"Add variable"** for each one:

   #### Variable 1: `NEXT_PUBLIC_SUPABASE_URL`
   - **Key:** `NEXT_PUBLIC_SUPABASE_URL`
   - **Value:** Your Supabase Project URL (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **Scopes:** Select **"All scopes"** (or at least "Production")
   - Click **"Add variable"**

   #### Variable 2: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value:** Your Supabase anon public key (the long string)
   - **Scopes:** Select **"All scopes"** (or at least "Production")
   - Click **"Add variable"**

   #### Variable 3: `SUPABASE_SERVICE_ROLE_KEY` (Optional but Recommended)
   - **Key:** `SUPABASE_SERVICE_ROLE_KEY`
   - **Value:** Your Supabase service_role key (the long string)
   - **Scopes:** Select **"All scopes"** (or at least "Production")
   - Click **"Add variable"**
   - ⚠️ This is needed for admin dashboard features to work properly

### Step 3: Verify Your Variables

After adding all variables, you should see them listed like this:

```
NEXT_PUBLIC_SUPABASE_URL          [All scopes]
NEXT_PUBLIC_SUPABASE_ANON_KEY     [All scopes]
SUPABASE_SERVICE_ROLE_KEY         [All scopes]
```

### Step 4: Important Notes

- ✅ **Variable names are case-sensitive** - Make sure they match exactly
- ✅ **Use "All scopes"** - This ensures variables work in all environments
- ✅ **No spaces** - Don't add spaces around the `=` sign in Netlify
- ✅ **Redeploy after adding** - If your site is already deployed, you need to trigger a new deployment for the variables to take effect

### Step 5: Trigger a New Deployment

After adding environment variables:

1. Go to **Deploys** tab
2. Click **"Trigger deploy"** → **"Deploy site"**
3. Or simply push a new commit to trigger auto-deploy

## 🔍 Quick Reference

| Variable Name | Where to Find | Required? |
|--------------|---------------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API → Project URL | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API → anon public | ✅ Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API → service_role | ⚠️ Optional (but recommended) |

## 🐛 Troubleshooting

**Variables not working?**
- Make sure variable names match exactly (case-sensitive)
- Check that you selected "All scopes" or at least "Production"
- Redeploy after adding variables
- Check Netlify build logs for any errors

**Can't find Supabase credentials?**
- Make sure you're logged into the correct Supabase account
- Verify you're in the correct project
- If you don't have a project, create one at https://supabase.com/dashboard

**Admin dashboard not working?**
- Make sure `SUPABASE_SERVICE_ROLE_KEY` is set
- This key is required for admin features to access user data

