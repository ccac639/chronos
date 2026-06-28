import json

path = r"c:\Users\2121\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a3ed37f1ac00f6e4879b1bd\chronos-app\docs\data\sw-exploration-reform.json"

with open(path, 'r', encoding='utf-8') as f:
    d = json.load(f)

for a in d['acts']:
    key_mark = " [KEY]" if a['isKeyAct'] else ""
    print(f"{a['id']:10s} {a['title']:20s}{key_mark}")

print(f"\n总幕数: {len(d['acts'])}")
print(f"关键幕数: {sum(1 for a in d['acts'] if a['isKeyAct'])}")
