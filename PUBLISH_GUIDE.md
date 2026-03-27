# 📦 Publishing Guide - SumoData Toolbox

Complete guide to publish your extension to VS Code Marketplace and OpenVSX.

---

## ✅ Pre-Publish Checklist

- [x] Extension compiled successfully
- [x] Icon.png exists (128x128 or 256x256)
- [x] README.md is SEO-optimized
- [x] CHANGELOG.md is updated
- [x] Documentation website is live
- [x] All features tested
- [ ] Publisher name updated in package.json
- [ ] Publisher account created

---

## 🚀 Step 1: Create Publisher Account

### For VS Code Marketplace:

1. **Go to**: https://marketplace.visualstudio.com/manage
2. **Sign in** with Microsoft account (or create one)
3. **Create Publisher**:
   - Click "Create publisher"
   - Publisher ID: `your-name` (lowercase, no spaces)
   - Display Name: `Your Name` or `Company Name`
   - Description: Brief description
4. **Get Personal Access Token (PAT)**:
   - Go to: https://dev.azure.com/
   - Click User Settings (top right) → Personal Access Tokens
   - Click "New Token"
   - Name: `vsce-publish`
   - Organization: All accessible organizations
   - Scopes: **Marketplace** → **Manage** (check this!)
   - Click "Create"
   - **COPY THE TOKEN** (you won't see it again!)

### For OpenVSX:

1. **Go to**: https://open-vsx.org/
2. **Sign in** with GitHub
3. **Get Access Token**:
   - Click your profile → "Access Tokens"
   - Click "Generate New Token"
   - Name: `publish-token`
   - **COPY THE TOKEN**

---

## 📝 Step 2: Update package.json

Open `package.json` and update the publisher field:

```json
{
  "publisher": "your-publisher-id"  // Change from "community"
}
```

**Example:**
```json
{
  "publisher": "otaruram"
}
```

Save the file and commit:
```bash
git add package.json
git commit -m "Update publisher name for marketplace"
git push
```

---

## 🔧 Step 3: Install Publishing Tools

```bash
# Install vsce (VS Code Extension Manager)
npm install -g @vscode/vsce

# Install ovsx (OpenVSX CLI)
npm install -g ovsx
```

Verify installation:
```bash
vsce --version
ovsx --version
```

---

## 📦 Step 4: Package Extension

```bash
# Make sure you're in the extension root directory
cd C:\Users\asus\Pictures\sumodata

# Compile TypeScript
npm run compile

# Package extension (creates .vsix file)
vsce package
```

This will create: `sumodata-toolbox-0.1.0.vsix`

**Troubleshooting:**
- If you get "publisher is required", make sure you updated package.json
- If you get icon errors, verify `resources/icon.png` exists
- If you get README warnings, they're usually safe to ignore

---

## 🌐 Step 5: Publish to VS Code Marketplace

### Option A: Using CLI (Recommended)

```bash
# Login (first time only)
vsce login your-publisher-id

# Enter your Personal Access Token when prompted

# Publish
vsce publish
```

### Option B: Manual Upload

1. Go to: https://marketplace.visualstudio.com/manage/publishers/your-publisher-id
2. Click "New extension" → "Visual Studio Code"
3. Drag and drop `sumodata-toolbox-0.1.0.vsix`
4. Click "Upload"

---

## 🔓 Step 6: Publish to OpenVSX (Open Source Alternative)

```bash
# Publish to OpenVSX
ovsx publish sumodata-toolbox-0.1.0.vsix -p YOUR_OPENVSX_TOKEN
```

Or manually:
1. Go to: https://open-vsx.org/user-settings/namespaces
2. Create namespace (if needed)
3. Upload `sumodata-toolbox-0.1.0.vsix`

---

## ✅ Step 7: Verify Publication

### VS Code Marketplace:
1. Go to: https://marketplace.visualstudio.com/items?itemName=your-publisher-id.sumodata-toolbox
2. Check that all information is correct
3. Test installation: Open VS Code → Extensions → Search "SumoData Toolbox"

### OpenVSX:
1. Go to: https://open-vsx.org/extension/your-publisher-id/sumodata-toolbox
2. Verify listing

---

## 🎉 Step 8: Post-Launch

### Update Links:
1. Update README.md with marketplace link
2. Update documentation with installation instructions
3. Share on social media

### Monitor:
- Check for user reviews
- Monitor GitHub issues
- Track download stats

---

## 🔄 Publishing Updates

When you make changes:

1. Update version in `package.json`:
   ```json
   "version": "0.1.1"  // Increment version
   ```

2. Update `CHANGELOG.md` with changes

3. Compile and publish:
   ```bash
   npm run compile
   vsce publish
   ovsx publish -p YOUR_TOKEN
   ```

**Version Guidelines:**
- **Patch** (0.1.0 → 0.1.1): Bug fixes
- **Minor** (0.1.0 → 0.2.0): New features
- **Major** (0.1.0 → 1.0.0): Breaking changes

---

## 🐛 Common Issues

### "Publisher is required"
- Update `package.json` with your publisher ID

### "Icon not found"
- Verify `resources/icon.png` exists
- Check path in `package.json`: `"icon": "resources/icon.png"`

### "README too long"
- Marketplace has no strict limit, but keep it reasonable
- Consider moving detailed docs to website

### "Authentication failed"
- Regenerate Personal Access Token
- Make sure token has "Marketplace: Manage" scope

### "Extension already exists"
- You can't publish if name is taken
- Change `name` in package.json to something unique

---

## 📊 Success Metrics

Track these after launch:
- **Downloads**: Check marketplace dashboard
- **Ratings**: Monitor user reviews
- **Issues**: GitHub issues and feedback
- **Usage**: Consider adding telemetry (optional)

---

## 🎯 Marketing Tips

1. **Social Media**:
   - Share on LinkedIn, Twitter, Reddit (r/vscode, r/datascience)
   - Use hashtags: #vscode #dataengineering #machinelearning

2. **Blog Post**:
   - Write about why you built it
   - Show killer feature (Data Quality Auditor)
   - Include screenshots and examples

3. **Community**:
   - Post in VS Code Discord
   - Share in data engineering communities
   - Reach out to Sumopod team

4. **SEO**:
   - Your README is already optimized
   - Documentation website helps with discoverability

---

## 📞 Support

If you encounter issues:
- VS Code Marketplace: https://github.com/microsoft/vscode-vsce/issues
- OpenVSX: https://github.com/eclipse/openvsx/issues
- Extension issues: https://github.com/otaruram/sumodata-toolbox/issues

---

## 🎉 You're Ready!

Your extension is production-ready with:
- ✅ 10 powerful tools
- ✅ Killer feature (Data Quality Auditor)
- ✅ Multi-file support
- ✅ Comprehensive documentation
- ✅ SEO optimization
- ✅ Professional README

**Good luck with your launch! 🚀**

---

**Quick Command Reference:**

```bash
# Package
vsce package

# Publish to VS Code Marketplace
vsce publish

# Publish to OpenVSX
ovsx publish sumodata-toolbox-0.1.0.vsix -p YOUR_TOKEN

# Update version and publish
vsce publish patch  # 0.1.0 → 0.1.1
vsce publish minor  # 0.1.0 → 0.2.0
vsce publish major  # 0.1.0 → 1.0.0
```
