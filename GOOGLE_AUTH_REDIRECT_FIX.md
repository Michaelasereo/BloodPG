# 🔧 Fix: Google Auth Redirecting to Localhost

## Problem
Google OAuth is redirecting to localhost after sign in, even in production.

## Solution
Added environment variable `NEXT_PUBLIC_SITE_URL` to ensure correct redirect URLs.

## Steps to Fix

### 1. Add Environment Variable to Netlify

Go to your Netlify dashboard:
1. **Production Site:** https://app.netlify.com/projects/bloodpg/configuration/env
2. **Staging Site:** https://app.netlify.com/projects/bloodpg-staging/configuration/env

Add this environment variable:
- **Key:** `NEXT_PUBLIC_SITE_URL`
- **Value:** 
  - Production: `https://bloodpg.com`
  - Staging: `https://bloodpg-staging.netlify.app`
- **Scope:** Production (for production site) or All scopes

### 2. Update Google OAuth Redirect URIs

Make sure your Google Cloud Console has the correct redirect URIs:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Select your OAuth 2.0 Client ID
3. **Authorized redirect URIs** should include:
   - `https://bloodpg.com/auth/callback`
   - `https://bloodpg-staging.netlify.app/auth/callback`
   - `https://YOUR_SUPABASE_PROJECT.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for local dev)

4. **Authorized JavaScript origins:**
   - `https://bloodpg.com`
   - `https://bloodpg-staging.netlify.app`
   - `https://YOUR_SUPABASE_PROJECT.supabase.co`
   - `http://localhost:3000` (for local dev)

### 3. Update Supabase Redirect URL

In Supabase Dashboard:
1. Go to Authentication → URL Configuration
2. **Site URL:** Should be `https://bloodpg.com` (for production)
3. **Redirect URLs:** Should include:
   - `https://bloodpg.com/auth/callback`
   - `https://bloodpg-staging.netlify.app/auth/callback`
   - `http://localhost:3000/auth/callback` (for local dev)

### 4. Redeploy

After adding the environment variable:
1. Go to Netlify dashboard
2. Trigger a new deployment
3. Or push a new commit to trigger auto-deploy

## What Was Fixed

1. **`lib/auth.ts`** - Now uses `NEXT_PUBLIC_SITE_URL` if available, falls back to `window.location.origin`
2. **`app/auth/callback/route.ts`** - Now uses `NEXT_PUBLIC_SITE_URL` for redirects, prevents localhost redirects in production

## Testing

After deployment:
1. Visit your production site
2. Click "Sign in with Google"
3. Complete OAuth flow
4. Should redirect back to production site (not localhost)

## Troubleshooting

**Still redirecting to localhost?**
- Check that `NEXT_PUBLIC_SITE_URL` is set in Netlify environment variables
- Verify the value is correct (no trailing slash)
- Clear browser cache and cookies
- Check browser console for errors
- Verify Google OAuth redirect URIs include production URL

**Getting redirect_uri_mismatch error?**
- Verify Google Console redirect URIs match exactly (including https://)
- Check Supabase redirect URLs configuration
- Ensure no typos in URLs

