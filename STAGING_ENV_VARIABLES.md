# 🔐 Adding Environment Variables to Staging Environment

## Option 1: Add to Branch Deploys (Recommended for develop branch)

If you want your `develop` branch to use staging environment variables:

1. **Go to Netlify Dashboard**
   - Visit: https://app.netlify.com
   - Click on your BloodPG site

2. **Navigate to Environment Variables**
   - Click **Site settings** (in the top navigation)
   - Scroll down and click **Environment variables** (under "Build & deploy")

3. **Add Variables with "Branch Deploys" Scope**

   For each variable, when adding:
   - **Key:** (variable name)
   - **Value:** (your value)
   - **Scopes:** Select **"Branch Deploys"** (this applies to all branches except production)
   - Click **"Add variable"**

   #### Required Variables for Staging:
   
   - `NEXT_PUBLIC_SUPABASE_URL`
     - Value: Your Supabase Project URL
     - Scope: **Branch Deploys**
   
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - Value: Your Supabase anon public key
     - Scope: **Branch Deploys**
   
   - `SUPABASE_SERVICE_ROLE_KEY` (Optional but Recommended)
     - Value: Your Supabase service_role key
     - Scope: **Branch Deploys**

## Option 2: Create Separate Staging Site

If you want a completely separate staging site:

1. **Create New Site in Netlify**
   - Go to https://app.netlify.com
   - Click **"Add new site"** → **"Import an existing project"**
   - Choose **"Deploy with GitHub"**
   - Select `Michaelasereo/BloodPG` repository
   - **Important:** In build settings, set:
     - **Branch to deploy:** `develop` (instead of `main`)
     - **Build command:** `npm run build`
     - **Publish directory:** `.next` (handled by plugin)

2. **Add Environment Variables to Staging Site**
   - Go to the new staging site's **Site settings** → **Environment variables**
   - Add the same variables as production:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY` (optional)

## Option 3: Use Different Supabase Project for Staging

If you want to use a separate Supabase project for staging:

1. **Create a New Supabase Project** (optional)
   - Go to https://supabase.com/dashboard
   - Create a new project for staging/testing

2. **Add Staging Environment Variables**
   - Use the staging Supabase credentials instead of production ones
   - This keeps your staging data separate from production

## Current Setup Recommendation

Since you have a `develop` branch, I recommend **Option 1** (Branch Deploys scope):

### Steps:

1. Go to: https://app.netlify.com/projects/bloodpg/configuration/env
2. For each existing variable, click **Edit** and add **"Branch Deploys"** to the scopes
3. Or add new variables with **"Branch Deploys"** scope

### Variable Scopes Explained:

- **Production:** Only used when deploying from `main` branch
- **Branch Deploys:** Used for all branch deployments (including `develop`)
- **Deploy Previews:** Used for pull request previews
- **All scopes:** Used everywhere

## Quick Setup

If you want the same variables for both production and staging:

1. Edit each existing variable
2. Add **"Branch Deploys"** to the scopes (in addition to Production)
3. Save

This way:
- `main` branch → Uses Production scope variables
- `develop` branch → Uses Branch Deploys scope variables
- Both can use the same Supabase project or different ones

## Verify Staging Environment

After setting up:

1. Push to `develop` branch
2. Netlify will auto-deploy (if branch deploys are enabled)
3. Check the deploy logs to verify environment variables are loaded
4. Test your staging site

## Enable Branch Deploys (if not already enabled)

1. Go to **Site settings** → **Build & deploy** → **Continuous Deployment**
2. Under **Branch deploys**, make sure it's enabled
3. You can set which branches to deploy (e.g., `develop`)

