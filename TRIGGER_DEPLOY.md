# 🚀 How to Manually Trigger Netlify Deployment

## Option 1: Netlify Dashboard (Easiest)

1. **Go to Netlify Dashboard**
   - Visit: https://app.netlify.com
   - Sign in to your account

2. **Select Your Site**
   - Click on your BloodPG site

3. **Trigger Deployment**
   - Go to the **"Deploys"** tab
   - Click **"Trigger deploy"** button (top right)
   - Select **"Deploy site"**
   - Wait for build to complete (2-3 minutes)

## Option 2: Empty Commit (Triggers Auto-Deploy)

If auto-deploy is enabled, make an empty commit:

```bash
git commit --allow-empty -m "Trigger Netlify rebuild"
git push origin main
```

## Option 3: Netlify CLI

If you want to use CLI:

```bash
# Install Netlify CLI globally (one-time)
npm install -g netlify-cli

# Login to Netlify
netlify login

# Link to your site (if not already linked)
netlify link

# Trigger deploy
netlify deploy --prod
```

## What to Check After Deployment

1. **Build Logs**: Check for any errors
2. **Environment Variables**: Verify they're set correctly
3. **Site URL**: Test your site at the Netlify URL
4. **404 Errors**: Should be resolved now with the build fix

