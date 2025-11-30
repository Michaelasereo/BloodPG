# Netlify Deployment Guide for BloodPG

## Prerequisites

- Netlify account (sign up at https://app.netlify.com)
- GitHub repository pushed (already done ✅)
- Supabase project set up

## Step 1: Connect Repository to Netlify

1. **Go to Netlify Dashboard**
   - Visit: https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Authorize Netlify to access your GitHub account

2. **Select Your Repository**
   - Find and select `Michaelasereo/BloodPG`
   - Click "Import"

3. **Configure Build Settings**
   - **Build command:** `npm run build` (should auto-detect)
   - **Publish directory:** `.next` (should auto-detect)
   - **Base directory:** (leave empty)

## Step 2: Configure Environment Variables

⚠️ **CRITICAL:** Add these environment variables in Netlify:

1. Go to **Site settings** → **Environment variables**
2. Add the following:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here (optional, for admin features)
```

**How to get these values:**
- Go to your Supabase project dashboard
- Navigate to Settings → API
- Copy the "Project URL" → `NEXT_PUBLIC_SUPABASE_URL`
- Copy the "anon public" key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy the "service_role" key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

## Step 3: Update Google OAuth Redirect URIs

After deployment, you'll get a Netlify URL (e.g., `bloodpg.netlify.app`)

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/apis/credentials
   - Select your OAuth 2.0 Client ID
   - Add these **Authorized redirect URIs:**
     - `https://your-site-name.netlify.app/auth/callback`
     - `https://your-supabase-project.supabase.co/auth/v1/callback`

2. **Update Authorized JavaScript origins:**
   - `https://your-site-name.netlify.app`

## Step 4: Deploy

1. Click **"Deploy site"**
2. Wait for the build to complete (usually 2-3 minutes)
3. Your site will be live at `https://your-site-name.netlify.app`

## Step 5: Custom Domain (Optional)

1. Go to **Domain settings**
2. Click **"Add custom domain"**
3. Follow the instructions to configure your domain

## Post-Deployment Checklist

- [ ] Environment variables configured in Netlify
- [ ] Google OAuth redirect URIs updated
- [ ] Test sign-in functionality
- [ ] Test saving blood pressure records
- [ ] Test PDF download
- [ ] Verify admin dashboard works (if using service role key)

## Troubleshooting

### Build fails
- Check Netlify build logs
- Ensure `node_modules` is in `.gitignore` (it is ✅)
- Verify build command: `npm run build`

### Environment variables not working
- Redeploy after adding environment variables
- Check variable names match exactly (case-sensitive)
- Ensure variables are set for "All scopes" or "Production"

### Authentication not working
- Verify Google OAuth redirect URIs include Netlify URL
- Check Supabase callback URL is correct
- Verify environment variables are set correctly

## Continuous Deployment

Once connected, every push to `main` branch will automatically trigger a new deployment! 🚀

