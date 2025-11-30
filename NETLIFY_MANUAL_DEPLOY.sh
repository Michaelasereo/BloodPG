#!/bin/bash

echo "=== Netlify Production Deployment ==="
echo ""
echo "Step 1: Build the project"
npm run build

echo ""
echo "Step 2: Deploy to Netlify"
echo "Choose one:"
echo ""
echo "Option A - Create new site:"
echo "  npx netlify-cli deploy --prod --dir=.next --create-site=BloodPG"
echo ""
echo "Option B - Link to existing site:"
echo "  npx netlify-cli link"
echo "  npx netlify-cli deploy --prod --dir=.next"
echo ""
echo "⚠️ IMPORTANT: After deployment, add environment variables in Netlify dashboard:"
echo "  - NEXT_PUBLIC_SUPABASE_URL"
echo "  - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "  - SUPABASE_SERVICE_ROLE_KEY (optional)"

