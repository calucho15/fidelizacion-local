import re
import json

with open(r'C:\Users\Carlo\.gemini\antigravity\brain\5848b734-237f-4562-b75b-fb8b0a0d247e\.system_generated\steps\145\content.md', 'r', encoding='utf-8') as f:
    text = f.read()

scripts = re.findall(r'<script[^>]*>(.*?)</script>', text, re.DOTALL)
s8 = scripts[8]

# Look for enqueue("...")
m = re.search(r'enqueue\("(.*?)"\);', s8, re.DOTALL)
if m:
    inner_str = m.group(1)
    # unescape json string
    unescaped = json.loads(f'"{inner_str}"')
    # now unescaped is a json array string!
    payload = json.loads(unescaped)
    print("Payload is list of length:", len(payload))
    
    # In react-router / turbo-stream, payload is an array of tokens and objects
    # Let's find all text blocks in payload
    texts = []
    for item in payload:
        if isinstance(item, str) and len(item) > 40:
            if not item.startswith("http") and not item.startswith("ua-") and not item.startswith("sess-"):
                texts.append(item)

    with open('extracted_conversation.txt', 'w', encoding='utf-8') as out:
        for t in texts:
            out.write(t + "\n" + ("="*60) + "\n\n")

    print(f"Extracted {len(texts)} substantial text chunks!")
else:
    print("Could not find enqueue call")
