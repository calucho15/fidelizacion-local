import re
import json

file_path = r'C:\Users\Carlo\.gemini\antigravity\brain\5848b734-237f-4562-b75b-fb8b0a0d247e\.system_generated\steps\145\content.md'
with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

print("File size:", len(text))

# Search for window.__remixContext or script contents
scripts = re.findall(r'<script[^>]*>(.*?)</script>', text, re.DOTALL)
print(f"Found {len(scripts)} scripts")

found_conv = False
for i, s in enumerate(scripts):
    if 'serverResponse' in s or 'linear_conversation' in s or 'mapping' in s or 'title' in s:
        print(f"Script {i} contains keywords, length: {len(s)}")
        # Check if it has json
        m = re.search(r'=\s*(\{.*?\});?$', s.strip(), re.DOTALL)
        if m:
            try:
                data = json.loads(m.group(1))
                with open('chatgpt_extracted.json', 'w', encoding='utf-8') as out:
                    json.dump(data, out, ensure_ascii=False, indent=2)
                print("Saved JSON from script", i)
                found_conv = True
                break
            except Exception as err:
                pass

if not found_conv:
    # search directly for message text patterns
    # In ChatGPT shared links, messages are often in "author": {"role": "user"|"assistant"} and "parts": ["..."]
    # or "content": {"parts": [...]}
    # Let's search with regex
    messages = []
    # Find all "author":{"role":"user"|"assistant"|...}... "parts":["..."]
    for m in re.finditer(r'\{"id":"[^"]+","author":\{"role":"(user|assistant)"[^}]*\}[^}]+?"parts":(\[[^\]]+\])', text):
        role = m.group(1)
        raw_parts = m.group(2)
        try:
            parts = json.loads(raw_parts)
            messages.append({"role": role, "content": " ".join(str(p) for p in parts if isinstance(p, str))})
        except:
            pass
    print(f"Found {len(messages)} messages by regex")
    with open('chatgpt_messages.json', 'w', encoding='utf-8') as out:
        json.dump(messages, out, ensure_ascii=False, indent=2)
