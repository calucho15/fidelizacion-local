import re
import json

with open(r'C:\Users\Carlo\.gemini\antigravity\brain\5848b734-237f-4562-b75b-fb8b0a0d247e\.system_generated\steps\145\content.md', 'r', encoding='utf-8') as f:
    text = f.read()

scripts = re.findall(r'<script[^>]*>(.*?)</script>', text, re.DOTALL)
s8 = scripts[8]

# Find all JSON arrays or decode the stream
# Let's extract all string literals in s8:
# Find strings with length > 20
strings = re.findall(r'"([^"\\]*(?:\\.[^"\\]*)*)"', s8)
print(f"Total string literals in Script 8: {len(strings)}")

interesting = []
for st in strings:
    # unescape
    try:
        decoded = bytes(st, "utf-8").decode("unicode_escape")
    except:
        decoded = st
    if len(decoded) > 30 and not decoded.startswith("http") and not decoded.startswith("/") and not decoded.startswith("_"):
        interesting.append(decoded)

print(f"Found {len(interesting)} interesting strings")

with open('chat_text_extracted.txt', 'w', encoding='utf-8') as out:
    for s in interesting:
        out.write(s + "\n---\n")

print("\n".join(interesting[:15]))
