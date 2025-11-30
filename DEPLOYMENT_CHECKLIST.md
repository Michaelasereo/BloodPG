# 🚀 Netlify Deployment Checklist

## ✅ Already Done
- [x] GitHub repository connected to Netlify
- [x] `netlify.toml` configured
- [x] Netlify Next.js plugin configured

## 📋 What's Left to Deploy

### 1. Push Latest Code to GitHub
You have uncommitted changes and 4 commits ahead of origin. Push them:

```bash
git add .
git commit -m "Prepare for Netlify deployment"
git push origin main
```

### 2. Add Environment Variables in Netlify Dashboard ⚠️ CRITICAL

1. Go to your Netlify site dashboard
2. Navigate to: **Site settings** → **Environment variables**
3. Click **"Add variable"** and add these:

**Required:**
- `NEXT_PUBLIC_SUPABASE_URL` = (your Supabase project URL)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (your Supabase anon key)

**Optional (for admin dashboard):**
- `SUPABASE_SERVICE_ROLE_KEY` = (your Supabase service role key)

**Where to get these:**
- Go to: https://supabase.com/dashboard
- Select your project → Settings → API
- Copy the values from there

### 3. Trigger Deployment

After adding environment variables:
- If auto-deploy is enabled: Push to `main` branch will trigger deployment
- Or manually: Go to **Deploys** tab → **Trigger deploy** → **Deploy site**

### 4. Update Google OAuth Redirect URIs (After First Deployment)

Once deployed, you'll get a Netlify URL (e.g., `bloodpg-12345.netlify.app`)

1. Go to: https://console.cloud.google.com/apis/credentials
2. Select your OAuth 2.0 Client ID
3. Add to **Authorized redirect URIs:**
   - `https://your-site-name.netlify.app/auth/callback`
4. Add to **Authorized JavaScript origins:**
   - `https://your-site-name.netlify.app`
5. Click **Save**

### 5. Test Your Deployment

After deployment completes:
- [ ] Visit your Netlify URL
- [ ] Test Google sign-in
- [ ] Test saving blood pressure records
- [ ] Test PDF download
- [ ] Verify admin dashboard works (if using service role key)

## 🔧 Troubleshooting

**Build fails?**
- Check Netlify build logs
- Verify environment variables are set correctly
- Ensure Node version is 18 (configured in `netlify.toml`)

**Environment variables not working?**
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)
- Ensure variables are set for "All scopes" or "Production"

**Authentication not working?**
- Verify Google OAuth redirect URIs include Netlify URL
- Check Supabase callback URL is correct
- Verify environment variables are set correctly

## 📝 Notes

- The `netlify.toml` is now configured correctly (publish directory handled by plugin)
- Continuous deployment is enabled - every push to `main` will auto-deploy
- Make sure to add environment variables BEFORE the first deployment, or redeploy after adding them

