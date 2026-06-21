import json
import os

log_path = "/Users/avijaybabu/.gemini/antigravity-ide/brain/94be2d3e-d944-4ac3-b86b-842bfd1e7f6c/.system_generated/logs/transcript.jsonl"

print("Scanning log path:", log_path)
if not os.path.exists(log_path):
    print("Log path does not exist!")
    exit(1)

longest_code = [""]

with open(log_path, 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        try:
            data = json.loads(line)
            # Recursively find any string that looks like a tsx/ts file of ProblemsPage
            def search(obj):
                if isinstance(obj, str):
                    if "export const ProblemsPage" in obj or "export default ProblemsPage" in obj:
                        if len(obj) > len(longest_code[0]):
                            longest_code[0] = obj
                elif isinstance(obj, dict):
                    for val in obj.values():
                        search(val)
                elif isinstance(obj, list):
                    for item in obj:
                        search(item)
            
            search(data)
        except Exception as e:
            pass

print(f"Scan complete. Longest code found: {len(longest_code[0])} bytes.")
if longest_code[0]:
    output_path = "/Users/avijaybabu/Desktop/CodeForge-1/scratch/ProblemsPage_recovered_real.tsx"
    with open(output_path, 'w', encoding='utf-8') as out:
        out.write(longest_code[0])
    print("Saved to:", output_path)
else:
    print("No code matching the pattern found in logs.")
