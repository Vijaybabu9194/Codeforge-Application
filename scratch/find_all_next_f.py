from bs4 import BeautifulSoup
import json
import re

with open("scratch/gfg_profile.html", "r", encoding="utf-8") as f:
    html = f.read()

soup = BeautifulSoup(html, "html.parser")

with open("scratch/all_scripts.txt", "w", encoding="utf-8") as out:
    for i, script in enumerate(soup.find_all("script")):
        if script.string:
            if "next_f" in script.string or "INITIAL_STATE" in script.string or "problems" in script.string:
                clean_str = script.string.replace('\\"', '"').replace('\\\\', '\\')
                out.write(f"=== Script {i} ===\n")
                out.write(clean_str)
                out.write("\n\n")

print("Dumped relevant scripts to scratch/all_scripts.txt")
