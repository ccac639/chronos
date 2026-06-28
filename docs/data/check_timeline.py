import re
import json

file_path = r'c:\Users\2121\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a3ed37f1ac00f6e4879b1bd\chronos-app\docs\data\w9-imperialism.json'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 找到所有完整的 act（以 id 开头，下一个 id 之前或文件结束）
# 用更简单的方法：提取每个 act 的 id, title, isKeyAct, timeMarker
pattern = r'"id": "(act-[^"]+)".*?"title": "([^"]+)".*?"isKeyAct": (true|false).*?"timeMarker": "([^"]+)"'
matches = re.findall(pattern, content, re.DOTALL)

print("=== 已有的 Act 时间线 ===")
for i, (act_id, title, is_key, time_marker) in enumerate(matches):
    key = "★关键幕" if is_key == "true" else "       "
    print(f"{i+1:2d}. {act_id:8s} {key} {time_marker:15s} - {title}")

print(f"\n总计: {len(matches)} 个 act")
print(f"关键幕: {sum(1 for m in matches if m[2] == 'true')} 个")
