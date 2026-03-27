def calculate_sum(a, b):
    return a + b

def process_data(data):
    result = []
    for item in data:
        if item > 0:
            result.append(item * 2)
    return result

# Test pandas code
import pandas as pd
df = pd.read_csv('data.csv')
df = df.dropna()
print(df.head())
