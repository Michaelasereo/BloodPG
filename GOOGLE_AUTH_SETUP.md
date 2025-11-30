# Google Sign-In Setup Guide for BloodPG

This guide will help you configure Google OAuth with Supabase for your BloodPG application.

## ✅ Prerequisites

You need to set up your Google OAuth credentials in Google Cloud Console:
- **Client ID:** Your Google OAuth Client ID
- **Client Secret:** Your Google OAuth Client Secret (keep this secure!)
- **Project ID:** Your Google Cloud Project ID

## Step 1: Configure Google OAuth in Supabase Dashboard

1. **Go to your Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your project
   - Go to Authentication → Providers

2. **Enable Google Provider**
   - Scroll down to find **Google** in the providers list
   - Toggle the **Enable Google provider** switch to ON

3. **Add Google OAuth Credentials**
   - **Client ID (for OAuth):** Your Google OAuth Client ID from Google Cloud Console
   - **Client Secret (for OAuth):** Your Google OAuth Client Secret (keep this secure!)
   - **Authorized redirect URIs:** These are already configured in Google Console:
     - `http://localhost:3000/auth/callback` (for local development)
     - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback` (for Supabase OAuth)

4. **Save the Configuration**
   - Click **Save** at the bottom of the Google provider settings
   - You should see a success message

## Step 2: Verify Google Cloud Console Settings

Your Google OAuth credentials should have these redirect URIs configured:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Select your OAuth 2.0 Client ID
3. Verify these **Authorized redirect URIs** are present:
   - `http://localhost:3000/auth/callback`
   - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
   - `https://Bloodpg.com/auth/callback` (for production)

4. Verify these **Authorized JavaScript origins**:
   - `http://localhost:3000`
   - `https://Bloodpg.com`
   - `https://YOUR_PROJECT_REF.supabase.co`

## Step 3: Test the Authentication

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the app:**
   - Go to: `http://localhost:3000`
   - The page will open normally (no redirect)
   - You'll see a "Sign in with Google" button in the top-right corner where the user profile would be

3. **Click "Sign in with Google"**
   - You'll be redirected to Google's OAuth consent screen
   - Select your Google account
   - Authorize the application

4. **Verify Authentication:**
   - After authorization, you'll be redirected back to the app
   - The sign-in button will be replaced with your name/email and menu button in the top-right corner
   - The main content (Records, table, etc.) will appear below
   - Your name will be pulled from your Google account

## Files Created/Modified

### New Files:
1. **`lib/auth.ts`** - Authentication service functions
2. **`lib/authContext.tsx`** - React context for auth state management
3. **`components/AuthGuard/AuthGuard.tsx`** - Component to protect routes
4. **`app/login/page.tsx`** - Login page with Google sign-in button
5. **`app/auth/callback/route.ts`** - OAuth callback handler (API route)
6. **`GOOGLE_AUTH_SETUP.md`** - This setup guide

### Modified Files:
1. **`app/layout.tsx`** - Added AuthProvider wrapper
2. **`app/page.tsx`** - Added AuthGuard to protect routes
3. **`components/MainContent/MainContent.tsx`** - Updated user profile to show authenticated user and sign out
4. **`lib/supabaseService.ts`** - Updated to associate records with authenticated user

## How It Works

1. **User visits the app** → Redirected to `/login` if not authenticated
2. **User clicks "Continue with Google"** → Redirected to Google OAuth
3. **User authorizes** → Google redirects to Supabase callback URL
4. **Supabase processes OAuth** → Creates/updates user session
5. **Supabase redirects to app** → User is now authenticated
6. **App loads** → User can access all features

## Authentication Flow

```
User → /login → Google OAuth → Supabase Callback → /auth/callback → App (authenticated)
```

## Important Notes

- **All routes are protected** - Users must sign in to access the app
- **User data is isolated** - Each user only sees their own records (via RLS)
- **Records are associated with user** - When saving, records are linked to the authenticated user's ID
- **Sessions persist** - Users stay logged in across browser sessions

## Troubleshooting

### "Provider not enabled" error
- ✅ Verify Google provider is enabled in Supabase dashboard
- ✅ Check that client ID and secret are correctly entered
- ✅ Ensure there are no extra spaces in the credentials

### Redirect URI mismatch error
- ✅ Verify redirect URIs match exactly between Google Console and Supabase
- ✅ Check that `http://localhost:3000/auth/callback` is configured
- ✅ Verify Supabase callback URL is correct: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`

### Authentication not persisting
- ✅ Check browser console for errors
- ✅ Verify cookies/localStorage is enabled in browser
- ✅ Check Supabase dashboard → Authentication → Users to see if user was created

### Records not saving
- ✅ Check browser console for error messages
- ✅ Verify user is authenticated (check top-right corner)
- ✅ Check Supabase dashboard → Logs for database errors
- ✅ Verify RLS policies allow authenticated users to insert records

### User can't see records
- ✅ Verify records are associated with the correct user_id
- ✅ Check RLS policies allow users to view their own records
- ✅ Check Supabase dashboard → Table Editor to verify user_id is set

## Next Steps

1. ✅ Configure Google OAuth in Supabase dashboard
2. ✅ Test sign-in flow
3. ⏳ Test saving records (they'll be automatically associated with your user)
4. ⏳ Test sign-out functionality
5. ⏳ Verify user data isolation (test with multiple accounts if possible)

## Security Notes

- Row Level Security (RLS) is enabled - users can only access their own data
- User authentication is handled by Supabase Auth
- OAuth tokens are securely managed by Supabase
- Client credentials are stored in environment variables (not in code)

---

**Your Google Sign-In is now set up! 🎉**

Once you configure the credentials in the Supabase dashboard (Step 1), you'll be ready to test authentication.
