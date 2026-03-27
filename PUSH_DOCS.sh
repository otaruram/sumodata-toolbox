#!/bin/bash

# Navigate to docs directory
cd docs

# Initialize git if not already initialized
if [ ! -d .git ]; then
    git init
    git branch -M main
fi

# Add remote if not exists
if ! git remote | grep -q origin; then
    git remote add origin https://github.com/otaruram/sumodata-toolbox-docs.git
fi

# Add all files
git add .

# Commit
git commit -m "Deploy documentation site with VitePress"

# Push to GitHub
git push -u origin main --force

echo "✅ Documentation pushed to https://github.com/otaruram/sumodata-toolbox-docs"
echo "🌐 Site will be live at: https://otaruram.github.io/sumodata-toolbox-docs/"
echo ""
echo "⚠️  Make sure GitHub Pages is configured:"
echo "   1. Go to repo Settings > Pages"
echo "   2. Source: GitHub Actions"
echo "   3. Wait for workflow to complete"
