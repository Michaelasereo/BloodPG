#!/bin/bash

# GitHub Personal Access Token Push Script
# Usage: ./push-to-github.sh YOUR_TOKEN_HERE

if [ -z "$1" ]; then
    echo "Usage: ./push-to-github.sh YOUR_GITHUB_TOKEN"
    echo ""
    echo "To get a token:"
    echo "1. Go to: https://github.com/settings/tokens"
    echo "2. Click 'Generate new token (classic)'"
    echo "3. Name: BloodPG-Repo"
    echo "4. Select scope: 'repo'"
    echo "5. Generate and copy the token"
    exit 1
fi

TOKEN=$1
USERNAME="Michaelasereo"
REPO="BloodPG"

echo "Setting up remote with token..."
git remote set-url origin https://${TOKEN}@github.com/${USERNAME}/${REPO}.git

echo "Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Done! You can now remove the token from the remote URL:"
echo "git remote set-url origin https://github.com/${USERNAME}/${REPO}.git"

