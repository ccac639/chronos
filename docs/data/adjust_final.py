import json

with open("sw-ancient-greece-rome.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# 删除 act-10b，使总数为 50 幕
data["acts"] = [a for a in data["acts"] if a["id"] != "act-10b"]

print(f"调整后总幕数: {len(data['acts'])}")

key_acts = [a for a in data["acts"] if a["isKeyAct"]]
print(f"关键幕数量: {len(key_acts)}")
for a in key_acts:
    print(f"  - {a['id']}: {a['title']}")

dialogue_errors = []
for act in data["acts"]:
    if len(act["dialogues"]) != 9:
        dialogue_errors.append(f"{act['id']} ({act['title']}): {len(act['dialogues'])} 个选项")

if dialogue_errors:
    print("对话选项数量错误的幕:")
    for e in dialogue_errors:
        print(f"  - {e}")
else:
    print("所有幕的对话选项数量均为 9 个，正确！")

with open("sw-ancient-greece-rome.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
print("\n已保存到 sw-ancient-greece-rome.json")
