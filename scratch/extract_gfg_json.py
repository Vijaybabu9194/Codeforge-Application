from bs4 import BeautifulSoup
import re
import json

with open("scratch/gfg_profile.html", "r", encoding="utf-8") as f:
    html = f.read()

soup = BeautifulSoup(html, "html.parser")

for script in soup.find_all("script"):
    if script.string and "total_problems_solved" in script.string:
        # Find the json inside the script
        # The script has something like: self.__next_f.push([1, "...\"])
        # Let's extract all strings in the script
        content = script.string
        print("Script length:", len(content))
        # Let's clean the JS escaping and print it
        # Let's search for some keys
        keys = [
            "total_problems_solved",
            "easy", "medium", "hard",
            "coding_score", "rank", "global_rank",
            "monthly_solved_count", "avatar", "profile_picture", "username", "rating", "contest"
        ]
        
        # We can extract words and numbers around total_problems_solved
        # Let's replace \" with " and \\/ with /
        clean_content = content.replace('\\"', '"').replace('\\\\', '\\')
        
        for k in keys:
            pattern = r'"?' + k + r'"?\s*:\s*([^,}]+)'
            matches = re.findall(pattern, clean_content, re.IGNORECASE)
            if matches:
                print(f"Key: {k} -> Matches: {matches}")
            else:
                # Try finding it with quotes
                pattern = r'"' + k + r'"\s*:\s*([^,}]+)'
                matches = re.findall(pattern, clean_content, re.IGNORECASE)
                if matches:
                    print(f"Key: {k} -> Matches: {matches}")
        
        # Let's save the clean script to a file to examine
        with open("scratch/clean_script.js", "w") as out:
            out.write(clean_content)
        print("Saved clean script to scratch/clean_script.js")
