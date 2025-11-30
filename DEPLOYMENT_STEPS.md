# 🚀 Quick Netlify Deployment Steps

## 1. Push Latest Changes (if not already pushed)
```bash
git push
```

## 2. Go to Netlify
Visit: https://app.netlify.com

## 3. Import Your Repository
1. Click **"Add new site"** → **"Import an existing project"**
2. Choose **"Deploy with GitHub"**
3. Authorize Netlify to access GitHub
4. Select **`Michaelasereo/BloodPG`** repository
5. Click **"Import"**

## 4. Configure Build Settings
Netlify should auto-detect:
- **Build command:** `npm run build`
- **Publish directory:** `.next`

If not, set manually:
- Build command: `npm run build`
- Publish directory: `.next`
- Base directory: (leave empty)

## 5. ⚠️ Add Environment Variables (CRITICAL!)

Before deploying, go to **"Show advanced"** → **"New variable"** and add:

```
NEXT_PUBLIC_SUPABASE_URL = your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_anon_key_here
```

**Get these from:** Supabase Dashboard → Settings → API

**Optional (for admin dashboard):**
```
SUPABASE_SERVICE_ROLE_KEY = your_service_role_key_here
```

## 6. Deploy!
Click **"Deploy site"** and wait 2-3 minutes.

## 7. Update Google OAuth (After Deployment)

After deployment, you'll get a URL like `bloodpg-12345.netlify.app`

1. Go to: https://console.cloud.google.com/apis/credentials
2. Select your OAuth 2.0 Client ID
3. Add to **Authorized redirect URIs:**
   - `https://your-site-name.netlify.app/auth/callback`
4. Add to **Authorized JavaScript origins:**
   - `https://your-site-name.netlify.app`
5. Click **Save**

## 8. Test Your Deployment
- Visit your Netlify URL
- Test Google sign-in
- Test saving records
- Test PDF download

## ✅ That's It!

Your app is now live! 🎉

