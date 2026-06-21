import json

with open('/Users/avijaybabu/Desktop/CodeForge-1/scratch/problems_page_recovered_base.tsx', 'r') as f:
    raw_data = f.read().strip()

# Since the file contains a JSON-string, we can parse it using json.loads
try:
    # If the file itself is a valid JSON string expression
    clean_code = json.loads(raw_data)
except Exception as e:
    # If it is formatted as a JSON string but with raw escapes, let's try wrapping or json.loads
    try:
        # Maybe it needs surrounding brackets or quotes
        clean_code = json.loads(f"[{raw_data}]")[0]
    except Exception as e2:
        print(f"JSON decode failed, attempting eval: {e2}")
        clean_code = eval(raw_data)

with open('/Users/avijaybabu/Desktop/CodeForge-1/scratch/ProblemsPage_recovered_real.tsx', 'w') as out:
    out.write(clean_code)

print("Successfully unescaped and saved ProblemsPage_recovered_real.tsx")
