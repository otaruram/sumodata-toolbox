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
No explanations.`
};

export type ToolType = keyof typeof SYSTEM_PROMPTS;
