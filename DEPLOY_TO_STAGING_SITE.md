# 🚀 Deploy to Separate Staging Site on Netlify

Since you've created a separate Netlify site for staging, you need to link to that specific site and deploy to it.

## Option 1: Link to Staging Site and Deploy

1. **Unlink current site (if needed)**
   ```bash
   npx netlify-cli unlink
   ```

2. **Link to your staging site**
   ```bash
   npx netlify-cli link
   ```
   - When prompted, select your **staging site** (not the production site)
   - Or use the site ID directly:
   ```bash
   npx netlify-cli link --id YOUR_STAGING_SITE_ID
   ```

3. **Deploy to staging site**
   ```bash
   npx netlify-cli deploy --prod
   ```

## Option 2: Deploy Using Site ID Directly

If you know your staging site ID:

```bash
npx netlify-cli deploy --prod --site=YOUR_STAGING_SITE_ID
```

## Option 3: Use Different Directory/Config

You can also create a separate directory or use a different netlify.toml for staging:

1. Create a staging-specific config or use environment variables
2. Deploy with:
   ```bash
   npx netlify-cli deploy --prod --site=YOUR_STAGING_SITE_ID
   ```

## Find Your Staging Site ID

1. Go to https://app.netlify.com
2. Click on your staging site
3. Go to **Site settings** → **General**
4. Copy the **Site ID** (looks like: `abc123-def456-...`)

## Recommended Setup

For separate staging site:
- **Production site:** Deploys from `main` branch
- **Staging site:** Deploys from `develop` branch
- Each site has its own environment variables
- Each site can use the same or different Supabase projects

