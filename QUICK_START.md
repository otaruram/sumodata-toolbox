# ⚡ Quick Start Guide

Get SumoData Toolbox running in 5 minutes!

## 🎯 Step 1: Install (2 minutes)

### Option A: From VS Code Marketplace (Recommended)
1. Open VS Code
2. Press `Ctrl+Shift+X` (Extensions)
3. Search "SumoData Toolbox"
4. Click Install

### Option B: From GitHub
1. Download latest `.vsix` from [Releases](https://github.com/otaruram/sumodata-toolbox/releases)
2. Open VS Code
3. Press `Ctrl+Shift+P` → "Install from VSIX"
4. Select downloaded file

---

## 🔑 Step 2: Get API Key (1 minute)

1. Go to [sumopod.com](https://sumopod.com)
2. Sign up or log in
3. Navigate to API settings
4. Copy your API key (starts with `sk-`)

---

## ⚙️ Step 3: Configure (1 minute)

1. Click **SumoData icon** in VS Code sidebar (left side)
2. Click **"⚙️ Configure API Key"**
3. Paste your API key
4. Press Enter

✅ You should see: **"🟢 Connected to ai.sumopod.com"**

---

## 🚀 Step 4: Try Your First Tool (1 minute)

### Example 1: SQL Optimizer

1. Create new file: `test.sql`
2. Paste this code:
   ```sql
   SELECT * FROM users WHERE name LIKE '%john%'
   ```
3. Select all code (`Ctrl+A`)
4. Right-click → **"🛡 SumoData"** → **"SQL Optimizer"**
5. Wait 3-5 seconds
6. See optimized SQL in new tab!

### Example 2: Generate Docstring

1. Create new file: `test.py`
2. Paste this code:
   ```python
   def calculate_sum(a, b):
       return a + b
   ```
3. Select the function
4. Right-click → **"🛡 SumoData"** → **"Auto-generate Google-style Docstrings"**
5. See documented function!

---

## 🎨 Step 5: Explore All Tools

Open sidebar and try:

### 📂 Sumo Pipes (Data Engineering)
- SQL Optimizer
- JSON to DDL Schema
- Cron Expression Generator

### 📊 Sumo Lens (Data Analysis)
- Explain Complex Regex
- Pandas Cleaning Logic Suggester
- SQL Logic Explainer

### 🤖 Sumo Core (DS/ML)
- Auto-generate Google-style Docstrings
- Type Hinting for Python
- PyTorch/Scikit-learn Training Loop

---

## 💡 Pro Tips

### Change AI Model
1. Open sidebar
2. Use **"AI Model"** dropdown
3. Select:
   - ⚡ Lightning (fast)
   - 🔥 Titan Pro (powerful)
   - 💨 Flash (ultra-fast)

### Keyboard Shortcuts
Create custom shortcuts:
1. `Ctrl+K Ctrl+S` → Keyboard Shortcuts
2. Search "SumoData"
3. Assign shortcuts to favorite tools

### Use Entire Document
If no code selected:
- Extension will prompt: "Use entire document?"
- Click "Yes" for small files

---

## 🐛 Troubleshooting

### "No active editor"
→ Open a file first

### "Invalid API Key"
→ Re-enter key via "⚙️ Configure API Key"

### "Cannot connect"
→ Check internet connection

### Tools not in context menu
→ Only works for `.py` and `.sql` files

---

## 📚 Learn More

- [Full Documentation](https://otaruram.github.io/sumodata-toolbox-docs/)
- [All Features](https://otaruram.github.io/sumodata-toolbox-docs/features/overview)
- [Configuration Guide](https://otaruram.github.io/sumodata-toolbox-docs/guide/configuration)
- [Troubleshooting](https://otaruram.github.io/sumodata-toolbox-docs/guide/troubleshooting)

---

## 🎉 You're Ready!

Start using SumoData Toolbox to:
- Optimize SQL queries
- Clean pandas code
- Generate ML boilerplate
- Document Python functions
- And much more!

**Happy coding!** 🚀
