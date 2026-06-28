import json

path = r"c:\Users\2121\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a3ed37f1ac00f6e4879b1bd\chronos-app\docs\data\sw-exploration-reform.json"

with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for a in data["acts"]:
    if a["id"] == "act-3":
        for d in a["dialogues"]:
            if d["nextActId"] == "act-3b":
                d["nextActId"] = "act-4"
        print(f"已修复 act-3 的分支指向")
        break

ids = set()
for a in data["acts"]:
    ids.add(a["id"])

key_count = 0
errors = 0
for a in data["acts"]:
    if a["isKeyAct"]:
        key_count += 1
        print(f"关键幕: {a['id']} - {a['title']}")
    for d in a["dialogues"]:
        if d["nextActId"] not in ids:
            print(f"错误: {a['id']} -> {d['nextActId']} 不存在")
            errors += 1

print(f"\n总幕数: {len(data['acts'])}")
print(f"关键幕数: {key_count}")
print(f"错误数: {errors}")

dialog_errors = 0
for a in data["acts"]:
    if len(a["dialogues"]) != 9:
        print(f"警告: {a['id']} 有 {len(a['dialogues'])} 个对话")
        dialog_errors += 1

print(f"对话数错误: {dialog_errors}")

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"\n文件已保存！")
