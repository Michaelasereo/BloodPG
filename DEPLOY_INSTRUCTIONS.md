# 🚀 Deploy to Netlify Production via CLI

## Quick Deploy (Recommended)

Since your site is already connected via GitHub, the easiest way is:

### Option 1: Use Netlify Dashboard (Easiest)
1. Go to https://app.netlify.com
2. Select your BloodPG site
3. Click **"Deploys"** tab
4. Click **"Trigger deploy"** → **"Deploy site"**

### Option 2: Complete CLI Linking (One-time setup)

Run these commands:

```bash
# 1. Link to your site (interactive - select first option)
npx netlify-cli link

# When prompted, select:
# "Use current git remote origin (https://github.com/Michaelasereo/BloodPG)"

# 2. Deploy to production
npx netlify-cli deploy --prod
```

### Option 3: Deploy with Site ID (If you know your site ID)

```bash
# Link using site ID (get from Netlify dashboard → Site settings → General)
npx netlify-cli link --id YOUR_SITE_ID

# Then deploy
npx netlify-cli deploy --prod
```

## What Happens During Deploy

1. Netlify will use your `netlify.toml` configuration
2. Run `npm run build` (with Turbopack disabled)
3. The Next.js plugin handles the deployment
4. Your site will be live at your Netlify URL

## Important Notes

- Make sure environment variables are set in Netlify dashboard
- The build should now work (we fixed the Tailwind/Turbopack issue)
- Deployment takes 2-3 minutes

