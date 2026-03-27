# 🛡️ SumoData Toolbox - AI Tools for Data Engineers, ML Engineers & Data Scientists

[![VS Code Marketplace](https://img.shields.io/badge/VS%20Code-Marketplace-blue)](https://marketplace.visualstudio.com/items?itemName=community.sumodata-toolbox)
[![Version](https://img.shields.io/badge/version-0.1.0-green)](https://github.com/otaruram/sumodata-toolbox)
[![License](https://img.shields.io/badge/license-MIT-orange)](LICENSE)
[![Made for](https://img.shields.io/badge/made%20for-data%20professionals-purple)](https://github.com/otaruram/sumodata-toolbox)
[![Documentation](https://img.shields.io/badge/docs-live-success)](https://otaruram.github.io/sumodata-toolbox-docs/)

**AI-Powered VS Code Extension for Data Engineering, Machine Learning, and Data Science**

Supercharge your data workflow with 10 specialized AI tools powered by Sumopod API. Built for Data Engineers, ML Engineers, Data Analysts, and Data Scientists who want instant code optimization, generation, and quality auditing.

**Perfect for:** Data Engineering | Machine Learning | Data Science | SQL Optimization | Python Development | ML Model Training | Data Analysis | ETL Pipelines | Database Design | Code Quality Auditing

**Keywords:** data engineering tools, machine learning tools, ML engineer, data science, AI code assistant, SQL optimizer, pandas helper, PyTorch tools, scikit-learn, data analyst tools, sumopod extension, AI developer tools, VS Code data tools, database optimization, ETL tools, data pipeline, jupyter notebook, python AI tools, code quality, data quality auditor, multi-file analysis

---

## 🔥 NEW: Data Quality Auditor (Killer Feature)

**Automatically scan multiple files for data quality issues, performance problems, and anti-patterns!**

✨ **What makes it special:**
- 📁 **Multi-File Analysis** - Select and analyze multiple Python/SQL files at once
- 🎯 **Comprehensive Auditing** - Detects critical issues, performance warnings, and best practice violations
- 📊 **Actionable Reports** - Get specific fixes with line numbers and impact assessment
- ⚡ **Saves Hours** - Automated code review that would take 30+ minutes manually

**Example Output:**
```markdown
## 🔍 Data Quality Audit Report

### ⚠️ Critical Issues (3 found)
- Reading CSV without error handling - Line 13
  - Impact: correctness/reliability (will crash on missing file)
  - Fix: wrap pd.read_csv in try/except, validate file existence

### ⚡ Performance Warnings (3 found)
- Inefficient Python loop (can be vectorized) - Lines 4-9
  - Impact: medium for large lists
  - Fix: use list comprehension or numpy vectorization

### 💡 Best Practice Suggestions (6 found)
- Add type hints and docstrings - Lines 1-2
  - Recommendation: annotate parameters/returns

### ✅ Summary
- Total issues: 12 (3 Critical, 3 Performance, 6 Best Practice)
- Estimated performance impact: Medium-High
- Recommended priority: High
```

**Use Cases:**
- 🔍 Pre-commit code review automation
- 🧹 Legacy codebase cleanup and refactoring
- 📚 Onboarding new team members with quality standards
- ⚡ Performance bottleneck identification
- ✅ Best practices enforcement across teams

[Learn more about Data Quality Auditor →](https://otaruram.github.io/sumodata-toolbox-docs/features/overview#data-quality-auditor)

---

## 📚 Documentation

**👉 [Read Full Documentation](https://otaruram.github.io/sumodata-toolbox-docs/) 👈**

- [Getting Started Guide](https://otaruram.github.io/sumodata-toolbox-docs/guide/getting-started)
- [Features Overview](https://otaruram.github.io/sumodata-toolbox-docs/features/overview)
- [Configuration](https://otaruram.github.io/sumodata-toolbox-docs/guide/configuration)
- [Troubleshooting](https://otaruram.github.io/sumodata-toolbox-docs/guide/troubleshooting)

## ⚠️ Disclaimer

This is an **unofficial, community-powered** extension. Not affiliated with or endorsed by Sumopod.

---

## 🎯 Why SumoData Toolbox?

Unlike generic AI assistants, SumoData Toolbox is **specifically built for data professionals**:

- 🔥 **Data Quality Auditor** - Multi-file code analysis with actionable insights (NEW!)
- ⚡ **One-Click Tools** - No chatty conversations, just instant results
- 💰 **Token Efficient** - Minimalist prompts save your API quota
- 🎯 **Specialized** - 10 tools designed for data engineering, ML, and analytics
- 🔒 **BYOK** - Bring Your Own Key, you control costs
- 🚀 **Fast** - Results in 2-10 seconds
- 🛠️ **Context-Aware** - Tools appear based on file type (.py, .sql)
- 📁 **Multi-File Mode** - Analyze multiple files simultaneously

**Use Cases:**
- Audit code quality across entire data pipelines
- Optimize slow SQL queries for PostgreSQL, MySQL, SQL Server
- Clean messy pandas DataFrames
- Generate ML training loops for PyTorch and scikit-learn
- Add Google-style docstrings to Python functions
- Convert JSON to database schemas
- Understand complex regex patterns
- Generate cron expressions for data pipelines
- Detect performance bottlenecks and anti-patterns

---

## 🚀 Quick Start

1. **Install** the extension from VS Code Marketplace
2. **Get API Key** from [sumopod.com](https://sumopod.com)
3. **Configure** by clicking "⚙️ Configure API Key" in the sidebar
4. **Enable Multi-File Mode** (optional) - Check the "📁 Multi-File Mode" box for analyzing multiple files
5. **Select code** and use tools from sidebar or right-click menu

**Pro Tip:** Try the Data Quality Auditor with multi-file mode to scan your entire codebase for issues!

---

## ✨ Features (10 Tools)

### 🔥 Data Quality Auditor (NEW - Killer Feature)

**Comprehensive code quality analysis for data professionals**

Automatically scan Python and SQL files for:
- ❌ **Critical Issues**: Error handling gaps, type safety problems, data validation missing
- ⚡ **Performance Warnings**: Inefficient loops, memory issues, slow operations
- 💡 **Best Practices**: Code style, documentation, maintainability improvements

**Key Benefits:**
- **Multi-File Support**: Analyze entire modules or projects at once
- **Actionable Insights**: Specific fixes with line numbers and code examples
- **Impact Assessment**: Understand severity and priority of each issue
- **Time Saver**: Automated review that replaces hours of manual work

**Perfect for:**
- Code review automation before commits
- Legacy code refactoring and cleanup
- Team onboarding and standards enforcement
- Performance optimization identification
- Production readiness checks

--- 📂 Sumo Pipes (Data Engineering)

#### 1. SQL Optimizer
Automatically optimize slow SQL queries with indexing suggestions.

**Example:**
```sql
-- Before (slow)
SELECT * FROM users WHERE name LIKE '%john%'

-- After (optimized)
SELECT id, name, email FROM users 
WHERE name LIKE 'john%'
-- Suggested index: CREATE INDEX idx_name ON users(name)
```

#### 2. JSON to DDL Schema
Convert JSON structure to database table schema instantly.

**Example:**
```json
// Input
{"name": "John", "age": 30, "email": "john@mail.com"}

// Output
CREATE TABLE users (
  name VARCHAR(255),
  age INT,
  email VARCHAR(255)
);
```

#### 3. Cron Expression Generator
Generate cron schedules from plain English.

**Example:**
```
Input: "Run every day at 3 AM"
Output: 0 3 * * * # Every day at 3 AM
```

---

### 📊 Sumo Lens (Data Analysis)

#### 4. Explain Complex Regex
Understand regex patterns in simple terms.

**Example:**
```regex
Input: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$
Output: "Email validation pattern that checks for:
- Username with letters, numbers, and special chars
- @ symbol
- Domain name
- Extension with minimum 2 characters"
```

#### 5. Pandas Cleaning Logic Suggester
Get better data cleaning code for pandas DataFrames.

**Example:**
```python
# Before
df = df.dropna()

# After (improved)
df = df.copy()
df = df.drop_duplicates()
df = df.dropna(subset=['important_column'])
df['age'] = df['age'].astype('int32')  # Memory optimization
```

#### 6. SQL Logic Explainer
Understand complex SQL queries in plain English.

---

### 🤖 Sumo Core (Data Science/ML)

#### 7. Auto-generate Google-style Docstrings
Add professional documentation to Python functions.

**Example:**
```python
# Before
def calculate_sum(a, b):
    return a + b

# After
def calculate_sum(a, b):
    """Calculate the sum of two numbers.
    
    Args:
        a: First number
        b: Second number
        
    Returns:
        Sum of a and b
    """
    return a + b
```

#### 8. Type Hinting for Python
Add type annotations for better code safety.

**Example:**
```python
# Before
def process_data(data):
    return [x * 2 for x in data]

# After
def process_data(data: list[int]) -> list[int]:
    return [x * 2 for x in data]
```

#### 9. PyTorch/Scikit-learn Training Loop
Generate ML training boilerplate code.

**Output includes:**
- Data loading setup
- Training loop with validation
- Loss tracking and logging
- Best practices implementation

---

## 🎯 How to Use

### Multi-File Mode (For Data Quality Auditor)
1. Open the SumoData sidebar
2. Check the "📁 Multi-File Mode" checkbox
3. Click "🔍 Run Quality Audit"
4. Select multiple files from your workspace
5. Get comprehensive audit report

### Method 1: Sidebar (Recommended)
1. Open a Python or SQL file
2. Select the code you want to process
3. Click the SumoData icon in the sidebar
4. Choose a tool from the accordion menu

### Method 2: Context Menu
1. Select code in your editor
2. Right-click → "🛡 SumoData"
3. Choose the tool you need

### Method 3: Command Palette
1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
2. Type "SumoData"
3. Select the tool

---

## ⚙️ Configuration

Access settings via `File > Preferences > Settings` and search for "SumoData".

| Setting | Default | Description |
|---------|---------|-------------|
| `sumodata.baseUrl` | `https://ai.sumopod.com` | API endpoint |
| `sumodata.timeout` | `30` | Request timeout (seconds) |
| `sumodata.model` | `claude-haiku-4-5` | AI model to use |
| `sumodata.enableContextMenu` | `true` | Show right-click menu |
| `sumodata.maxCodeLength` | `10000` | Max code length (chars) |

### Available AI Models

| Display Name | Model ID | Best For |
|--------------|----------|----------|
| ⚡ Sumo Lightning | `claude-haiku-4-5` | Fast responses |
| ⚡ Sumo Thunder | `kimi-k2` | Powerful reasoning |
| 🔥 Sumo Titan Pro | `gemini/gemini-2.5-pro` | Maximum capability |
| 💨 Sumo Flash | `gemini/gemini-2.0-flash` | Ultra-fast |
| ✨ Sumo Spark | `gpt-4o-mini` | Balanced |
| 🌟 Sumo Nova | `gpt-5-mini` | Next generation |

---

## 🔒 Security & Privacy

- API keys are stored securely using VS Code's SecretStorage
- No code is stored or logged by the extension
- All requests go directly to ai.sumopod.com
- You control what code is sent to the API

---

## 🐛 Troubleshooting

### "No active editor" error
- Make sure you have a file open in the editor
- Select some code before using a tool

### "Invalid API Key" error
- Verify your API key from sumopod.com
- Re-enter the key via "⚙️ Configure API Key"

### "Cannot connect to ai.sumopod.com"
- Check your internet connection
- Verify the base URL in settings
- Check if sumopod.com is accessible

### Tools not showing in context menu
- Only works for `.py` and `.sql` files
- Make sure `sumodata.enableContextMenu` is enabled

---

## 📝 Requirements

- **VS Code**: Version 1.80.0 or higher
- **API Key**: Active sumopod.com account
- **Internet**: Required for API calls

---

## 🤝 Contributing

This is a community project! Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

- Built for the sumopod.com community
- Inspired by the need for efficient data tooling
- Thanks to all contributors and users

---

## 📞 Support

- **Issues**: Report bugs on GitHub
- **Questions**: Open a discussion on GitHub
- **API Issues**: Contact sumopod.com support

---

**Made with ❤️ by the community, for the community**

---

## 🏷️ Tags & Topics

**Data Engineering:** SQL optimization, database design, ETL pipelines, data warehousing, Apache Airflow, DBT, data modeling, schema generation

**Machine Learning:** PyTorch, TensorFlow, scikit-learn, model training, ML pipelines, feature engineering, model deployment, MLOps, experiment tracking

**Data Science:** pandas, numpy, data cleaning, data analysis, statistical analysis, data visualization, Jupyter notebooks, exploratory data analysis

**Python Development:** type hints, docstrings, code documentation, code quality, linting, formatting, best practices

**Database:** PostgreSQL, MySQL, SQL Server, MongoDB, query optimization, indexing, performance tuning

**AI Tools:** code generation, code optimization, AI assistant, developer productivity, automation, sumopod, Claude, GPT, Gemini

**Developer Tools:** VS Code extensions, IDE tools, productivity tools, code helpers, development workflow

---

## 📊 For Data Professionals

### Data Engineers
- **Audit data pipelines** for quality and performance issues
- Optimize SQL queries for data pipelines
- Generate database schemas from JSON
- Create cron expressions for scheduled jobs
- Improve ETL code quality with automated reviews

### Data Analysts
- **Scan analysis scripts** for best practices
- Clean pandas DataFrames efficiently
- Understand complex SQL queries
- Decode regex patterns
- Analyze data faster with quality checks

### ML Engineers
- **Review ML code** for performance bottlenecks
- Generate PyTorch/scikit-learn training loops
- Add type hints to ML code
- Document models with docstrings
- Accelerate model development with quality audits

### Data Scientists
- **Audit notebook code** before production
- Improve code quality across projects
- Document analysis workflows
- Optimize data processing
- Share reproducible, high-quality code

---

## 🔍 Search Keywords

data engineering, machine learning, ML, data science, AI, artificial intelligence, sumopod, SQL optimizer, SQL optimization, database optimization, query optimization, pandas, pandas helper, data cleaning, PyTorch, TensorFlow, scikit-learn, ML training, model training, data analyst, ML engineer, data engineer, data scientist, AI assistant, AI code helper, code generator, code optimization, docstring generator, type hints, type annotations, database schema, DDL generator, cron expression, regex explainer, SQL explainer, ETL tools, data pipeline, data warehouse, jupyter notebook, python tools, SQL tools, database tools, developer tools, productivity tools, VS Code extension, IDE extension, code quality, code review, automated code review, data quality, quality auditor, multi-file analysis, code analysis, static analysis, best practices, automation, workflow, sumopod extension, sumopod tools, AI developer tools, machine learning tools, data science tools, performance optimization, anti-pattern detection, code refactoring, legacy code, technical debt

