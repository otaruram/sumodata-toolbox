export const SYSTEM_PROMPTS = {
  sqlOptimizer: `Analyze the SQL query and return ONLY optimized SQL code with:
- Removed duplicate operations
- Added appropriate indexes (as comments)
- Improved query structure
Return code only, no explanations.`,

  jsonToDDL: `Convert the JSON structure to DDL schema. Return ONLY the CREATE TABLE statements with appropriate data types and constraints. No explanations.`,

  cronGenerator: `Generate a cron expression based on the description. Return ONLY the cron expression with a brief comment explaining the schedule. Format: cron_expression # explanation`,

  explainRegex: `Explain the regex pattern in simple terms. Return ONLY a concise explanation of what the pattern matches and its components.`,

  pandasCleaner: `Analyze the pandas code and return ONLY improved data cleaning code with:
- Null handling
- Data type optimization
- Duplicate removal
- Outlier detection
Return code only, no explanations.`,

  sqlExplainer: `Explain the SQL query logic in simple terms. Return ONLY a concise explanation of what the query does, step by step.`,

  generateDocstring: `Generate Google-style docstring for the Python function/class. Return ONLY the docstring in triple quotes, no other code.`,

  addTypeHints: `Add type hints to the Python code. Return ONLY the code with type annotations added, no explanations.`,

  mlBoilerplate: `Generate PyTorch or Scikit-learn training loop boilerplate based on the context. Return ONLY the code with:
- Data loading
- Model training loop
- Validation
- Basic logging
No explanations.`,

  dataQualityAuditor: `Analyze the provided code/query for data quality issues, performance problems, and best practice violations. 

For SQL files, check:
- Missing indexes on JOIN/WHERE columns
- SELECT * usage
- Missing NULL handling
- Inefficient subqueries
- Missing table aliases
- Cartesian products

For Python/Pandas files, check:
- Inefficient loops (use vectorization)
- Missing null checks
- Deprecated pandas methods
- Memory-inefficient operations
- Missing data validation
- Type inconsistencies

Return a structured report in markdown format:
## 🔍 Data Quality Audit Report

### ⚠️ Critical Issues (X found)
- [Issue description] - Line X
  - Impact: [performance/correctness/maintainability]
  - Fix: [specific suggestion]

### ⚡ Performance Warnings (X found)
- [Issue description] - Line X
  - Impact: [estimated impact]
  - Fix: [specific suggestion]

### 💡 Best Practice Suggestions (X found)
- [Issue description] - Line X
  - Recommendation: [specific suggestion]

### ✅ Summary
- Total issues: X
- Estimated performance impact: [High/Medium/Low]
- Recommended priority: [Critical/High/Medium/Low]

Keep it concise and actionable.`
};

export type ToolType = keyof typeof SYSTEM_PROMPTS;
