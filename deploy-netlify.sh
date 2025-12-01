#!/bin/bash

echo "🚀 Netlify Production Deployment"
echo ""

# Step 1: Build the project
echo "Step 1: Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors and try again."
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Step 2: Deploy to Netlify
echo "Step 2: Deploying to Netlify..."
echo ""
echo "If this is your first time, you'll need to:"
echo "1. Login to Netlify (will open browser)"
echo "2. Link to your existing site (select BloodPG)"
echo "3. Deploy"
echo ""

# For Next.js with Netlify plugin, we deploy the root directory
# The plugin handles the .next directory automatically
npx netlify-cli deploy --prod

echo ""
echo "✅ Deployment complete!"

