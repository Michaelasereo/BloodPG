# 🔧 Troubleshooting 404 Errors on Netlify

## Understanding the Error

If you're seeing:
```
GET https://bloodpg.com/ 404 (Not Found)
GET https://bloodpg.com/favicon.ico 404 (Not Found)
```

This means your site is either:
1. **Not deployed yet** - The build hasn't completed or failed
2. **Build failed** - Check Netlify build logs
3. **Custom domain not configured** - Domain DNS not pointing to Netlify
4. **Deployment issue** - Site deployed but files not in correct location

## Step-by-Step Troubleshooting

### Step 1: Check Netlify Build Status

1. Go to your Netlify dashboard: https://app.netlify.com
2. Click on your site
3. Go to **Deploys** tab
4. Check the latest deployment:
   - ✅ **Published** = Deployment successful
   - ❌ **Failed** = Build error (click to see logs)
   - ⏳ **Building** = Still deploying

**If build failed:**
- Click on the failed deployment
- Check the build logs for errors
- Common issues:
  - Missing environment variables
  - Build command errors
  - Dependency installation failures

### Step 2: Verify Environment Variables

1. Go to **Site settings** → **Environment variables**
2. Verify these are set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (optional)

**If missing:**
- Add them (see `NETLIFY_ENV_VARIABLES_GUIDE.md`)
- **Redeploy** after adding variables

### Step 3: Check Custom Domain Configuration

If you're using `bloodpg.com` (custom domain):

1. Go to **Domain settings**
2. Verify domain is added and configured
3. Check DNS settings:
   - Should point to Netlify's nameservers or
   - Should have CNAME/A records pointing to your Netlify site

**To check DNS:**
```bash
# Check if domain points to Netlify
dig bloodpg.com
# or
nslookup bloodpg.com
```

**If domain not configured:**
- Use the default Netlify URL first: `your-site-name.netlify.app`
- Then configure custom domain after deployment works

### Step 4: Verify Build Configuration

Check that `netlify.toml` is correct:

```toml
[build]
  command = "npm run build"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "18"
```

**Important:** The plugin handles the publish directory automatically.

### Step 5: Check Build Logs

In Netlify dashboard → Deploys → Click on deployment → View logs

Look for:
- ✅ "Build successful"
- ✅ "Next.js plugin detected"
- ✅ "Deploying to production"
- ❌ Any error messages

**Common build errors:**
- `Missing environment variable` → Add env vars
- `Module not found` → Check dependencies
- `Build command failed` → Check `package.json` scripts

### Step 6: Test Default Netlify URL

Before testing custom domain, try the default Netlify URL:
- `https://your-site-name.netlify.app`

If this works but custom domain doesn't:
- Issue is with DNS/domain configuration
- Not with the deployment itself

### Step 7: Trigger a New Deployment

If everything looks correct but still 404:

1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**
3. Wait for build to complete
4. Test again

Or push a new commit to trigger auto-deploy:
```bash
git commit --allow-empty -m "Trigger Netlify rebuild"
git push
```

## Quick Fixes

### Fix 1: Rebuild from Scratch

1. In Netlify: **Site settings** → **Build & deploy**
2. Click **Clear cache and deploy site**
3. Wait for rebuild

### Fix 2: Verify Plugin is Installed

Check `package.json` has:
```json
"devDependencies": {
  "@netlify/plugin-nextjs": "^5.15.1"
}
```

If missing:
```bash
npm install --save-dev @netlify/plugin-nextjs
git add package.json package-lock.json
git commit -m "Add Netlify Next.js plugin"
git push
```

### Fix 3: Check Next.js Version Compatibility

Your Next.js version: `^16.0.5`
Netlify plugin version: `^5.15.1`

These should be compatible. If issues persist, check:
- Netlify plugin compatibility: https://github.com/netlify/netlify-plugin-nextjs

## Still Not Working?

1. **Check Netlify Status**: https://www.netlifystatus.com
2. **Review Build Logs**: Look for specific error messages
3. **Test Locally**: Run `npm run build` locally to catch build errors
4. **Contact Support**: Netlify support if deployment keeps failing

## Expected Behavior After Fix

Once fixed, you should see:
- ✅ Homepage loads at `https://bloodpg.com/`
- ✅ No 404 errors in console
- ✅ Favicon loads correctly
- ✅ All routes work (`/admin`, `/login`, etc.)

