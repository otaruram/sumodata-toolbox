# Manual Testing Guide for SumoData Toolbox

## Setup
1. Press F5 to open Extension Development Host
2. In the NEW window, configure API Key:
   - Click SumoData icon in sidebar
   - Click "⚙️ Configure API Key"
   - Enter: `sk-EHhzGdATSQS5iR7CG-Avwg`

## Test Cases

### Test 1: SQL Optimizer (Sumo Pipes)
1. Open `test-files/test.sql`
2. Select all code (Ctrl+A)
3. Right-click → "🛡 SumoData" → "SQL Optimizer"
4. Expected: Optimized SQL with index suggestions

### Test 2: Pandas Cleaner (Sumo Lens)
1. Open `test-files/test.py`
2. Select the pandas code section (lines 11-14)
3. Right-click → "🛡 SumoData" → "Pandas Cleaning Logic Suggester"
4. Expected: Improved pandas code with better cleaning logic

### Test 3: Generate Docstring (Sumo Core)
1. Open `test-files/test.py`
2. Select `calculate_sum` function (lines 1-2)
3. Right-click → "🛡 SumoData" → "Auto-generate Google-style Docstrings"
4. Expected: Google-style docstring

### Test 4: Add Type Hints (Sumo Core)
1. Open `test-files/test.py`
2. Select `process_data` function (lines 4-9)
3. Right-click → "🛡 SumoData" → "Type Hinting for Python"
4. Expected: Function with type annotations

### Test 5: Model Selection
1. In sidebar, change model dropdown to "🔥 Sumo Titan Pro"
2. Run any tool
3. Expected: Uses gemini/gemini-2.5-pro model

### Test 6: Entire Document (No Selection)
1. Open `test-files/test.py`
2. Don't select anything
3. Click sidebar button "Auto-generate Google-style Docstrings"
4. Expected: Prompt to use entire document

### Test 7: Context Menu Visibility
1. Open `test-files/test.py` → Right-click should show "🛡 SumoData"
2. Open `test-files/test.sql` → Right-click should show "🛡 SumoData"
3. Open `README.md` → Right-click should NOT show "🛡 SumoData"

## Expected Behaviors
- ✅ Connection status shows "🟢 Connected to ai.sumopod.com"
- ✅ Results open in new editor beside current file
- ✅ "Copy to Clipboard" and "Insert at Cursor" buttons work
- ✅ Model selection persists across sessions
- ✅ Error messages are clear and actionable

## API Key for Testing
```
sk-EHhzGdATSQS5iR7CG-Avwg
```
