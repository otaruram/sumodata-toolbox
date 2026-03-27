# 🚀 Deployment Guide

Complete guide untuk publish extension dan deploy documentation.

## 📦 Part 1: Publish Extension ke VS Code Marketplace

### Prerequisites

1. **Install vsce** (VS Code Extension Manager)
   ```bash
   npm install -g @vscode/vsce
   ```

2. **Create Publisher Account**
   - Go to: https://marketplace.visualstudio.com/manage
   - Sign in with Microsoft account
   - Create publisher (e.g., "yourname" or "sumodata")

3. **Get Personal Access Token**
   - Go to: https://dev.azure.com/
   - User Settings → Personal Access Tokens
   - Create new token with "Marketplace (Manage)" scope
   - Save token securely!

### Steps to Publish

1. **Update package.json publisher**
   ```json
   {
     "publisher": "yourpublishername"
   }
   ```

2. **Create icon.png** (128x128 or 256x256)
   ```bash
   # Convert SVG to PNG
   # Use online tool or ImageMagick
   convert resources/icon.svg -resize 128x128 resources/icon.png
   ```

3. **Login to vsce**
   ```bash
   vsce login yourpublishername
   # Enter your Personal Access Token
   ```

4. **Package extension**
   ```bash
   npm run compile
   vsce package
   # Creates: sumodata-toolbox-0.1.0.vsix
   ```

5. **Publish extension**
   ```bash
   vsce publish
   # Or publish specific version
   vsce publish 0.1.0
   ```

6. **Verify**
   - Check: https://marketplace.visualstudio.com/items?itemName=yourpublisher.sumodata-toolbox
   - Wait 5-10 minutes for indexing

---

## 🌐 Part 2: Deploy Documentation to GitHub Pages

### Setup GitHub Repository

1. **Create GitHub repo**
   ```bash
   # On GitHub.com, create new repository: sumodata-toolbox
   ```

2. **Initialize git** (if not already)
   ```bash
   git init
   git add .
   git commit -m "Initial commit: SumoData Toolbox v0.1.0"
   ```

3. **Add remote and push**
   ```bash
   git remote add origin https://github.com/yourusername/sumodata-toolbox.git
   git branch -M main
   git push -u origin main
   ```

### Enable GitHub Pages

1. **Go to repo Settings**
   - Settings → Pages
   - Source: GitHub Actions
   - Save

2. **Move workflow file**
   ```bash
   # Move from docs/.github to root
   mkdir -p .github/workflows
   mv docs/.github/workflows/deploy.yml .github/workflows/deploy-docs.yml
   ```

3. **Update workflow file**
   Edit `.github/workflows/deploy-docs.yml`:
   ```yaml
   name: Deploy Documentation

   on:
     push:
       branches:
         - main
       paths:
         - 'docs/**'
         - '.github/workflows/deploy-docs.yml'

   permissions:
     contents: read
     pages: write
     id-token: write

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v4

         - name: Setup Node
           uses: actions/setup-node@v4
           with:
             node-version: 20

         - name: Install dependencies
           working-directory: docs
           run: npm ci

         - name: Build documentation
           working-directory: docs
           run: npm run docs:build

         - name: Upload artifact
           uses: actions/upload-pages-artifact@v3
           with:
             path: docs/.vitepress/dist

     deploy:
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       needs: build
       runs-on: ubuntu-latest
       steps:
         - name: Deploy to GitHub Pages
           id: deployment
           uses: actions/deploy-pages@v4
   ```

4. **Update VitePress config**
   Edit `docs/.vitepress/config.ts`:
   ```typescript
   export default defineConfig({
     title: 'SumoData Toolbox',
     description: '...',
     base: '/sumodata-toolbox/', // Change to your repo name
     // ... rest of config
   })
   ```

5. **Commit and push**
   ```bash
   git add .
   git commit -m "Setup GitHub Pages deployment"
   git push
   ```

6. **Wait for deployment**
   - Go to Actions tab
   - Wait for workflow to complete
   - Docs will be at: `https://yourusername.github.io/sumodata-toolbox/`

---

## 📁 What to Push to GitHub

### ✅ PUSH These:

```
sumodata-toolbox/
├── .github/
│   └── workflows/
│       └── deploy-docs.yml
├── docs/                    # All documentation
├── resources/              # Icons and assets
├── src/                    # Source code
├── test-files/            # Example files
├── .gitignore
├── .vscodeignore
├── CHANGELOG.md
├── LICENSE
├── README.md
├── DEPLOY.md
├── package.json
├── tsconfig.json
└── .vscode/
    ├── launch.json
    └── tasks.json
```

### ❌ DON'T PUSH These:

```
node_modules/              # Dependencies
out/                       # Compiled code
*.vsix                     # Extension package
.vscode-test/             # Test files
docs/node_modules/        # Docs dependencies
docs/.vitepress/dist/     # Built docs
docs/.vitepress/cache/    # Cache
.env                      # Environment variables
.kiro/                    # Spec files (optional)
```

---

## 🔄 Update Workflow

### When you make changes:

1. **Update version** in `package.json`
   ```json
   {
     "version": "0.1.1"
   }
   ```

2. **Update CHANGELOG.md**
   ```markdown
   ## [0.1.1] - 2026-03-28
   ### Fixed
   - Bug fixes
   ```

3. **Commit and push**
   ```bash
   git add .
   git commit -m "v0.1.1: Bug fixes"
   git push
   ```

4. **Publish new version**
   ```bash
   npm run compile
   vsce publish
   ```

5. **Create GitHub release**
   - Go to Releases → Create new release
   - Tag: v0.1.1
   - Title: "v0.1.1 - Bug Fixes"
   - Description: Copy from CHANGELOG
   - Attach .vsix file

---

## 🎯 Quick Commands

```bash
# Build extension
npm run compile

# Package extension
vsce package

# Publish extension
vsce publish

# Build docs locally
cd docs && npm run docs:dev

# Build docs for production
cd docs && npm run docs:build

# Preview production docs
cd docs && npm run docs:preview
```

---

## 🐛 Troubleshooting

### Extension not showing in marketplace
- Wait 10-15 minutes for indexing
- Check publisher name matches
- Verify token permissions

### GitHub Pages not deploying
- Check Actions tab for errors
- Verify `base` in VitePress config
- Ensure Pages is enabled in Settings

### Docs showing 404
- Check `base` path in config
- Verify workflow completed successfully
- Clear browser cache

---

## 📞 Need Help?

- VS Code Publishing: https://code.visualstudio.com/api/working-with-extensions/publishing-extension
- GitHub Pages: https://docs.github.com/en/pages
- VitePress: https://vitepress.dev/guide/deploy

---

**Ready to deploy? Follow the steps above and your extension will be live!** 🚀
