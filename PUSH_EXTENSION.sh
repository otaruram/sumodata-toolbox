#!/bin/bash

# Check if git is initialized
if [ ! -d .git ]; then
    git init
    git branch -M main
fi

# Add remote if not exists
if ! git remote | grep -q origin; then
    git remote add origin https://github.com/otaruram/sumodata-toolbox.git
fi

# Add all files (docs folder is already in .gitignore)
git add .

# Commit
git commit -m "SumoData Toolbox Extension - Ready for marketplace"

# Push to GitHub
git push -u origin main --force

echo "✅ Extension pushed to https://github.com/otaruram/sumodata-toolbox"
echo ""
echo "📦 Next steps to publish to VS Code Marketplace:"
echo "   1. Update 'publisher' field in package.json with your publisher name"
echo "   2. Convert resources/icon.svg to resources/icon.png (128x128 or 256x256)"
echo "   3. Install vsce: npm install -g @vscode/vsce"
echo "   4. Create publisher account at: https://marketplace.visualstudio.com/manage"
echo "   5. Run: npm run compile && vsce publish"
