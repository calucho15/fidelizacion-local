import re
import json

with open(r'C:\Users\Carlo\.gemini\antigravity\brain\5848b734-237f-4562-b75b-fb8b0a0d247e\.system_generated\steps\145\content.md', 'r', encoding='utf-8') as f:
    text = f.read()

scripts = re.findall(r'<script[^>]*>(.*?)</script>', text, re.DOTALL)

for idx in [3, 8]:
    s = scripts[idx]
    # Check if there is remixContext or similar
    # print first 500 chars
    print(f"--- SCRIPT {idx} (len {len(s)}) ---")
    print(s[:300])
    # Search for user queries or chat texts
    # Look for "text" or "parts"
    matches = re.findall(r'\\?"parts\\?":\s*(\[[^\]]+\])', s)
    print(f"Matches for parts in {idx}: {len(matches)}")
    if matches:
        for m in matches[:5]:
            print("SAMPLE:", m[:150])

    # Check for window.__remixContext
    if '__remixContext' in s:
        # extract json
        m = re.search(r'__remixContext\s*=\s*(\{.*?\});\s*(?:window|\n|$)', s, re.DOTALL)
        if m:
            print("Found __remixContext match!")
            with open('remixContext.json', 'w', encoding='utf-8') as out:
                out.write(m.group(1))
