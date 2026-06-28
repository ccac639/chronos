import json

with open("greece_rome_p9.json", "r", encoding="utf-8") as f:
    data = json.load(f)

print("=" * 50)
print(f"eraId: {data['eraId']}")
print(f"eraName: {data['eraName']}")
print(f"playerRole: {data['playerRole']}")
print(f"startYear: {data['startYear']}")
print(f"endYear: {data['endYear']}")
print(f"总幕数: {len(data['acts'])}")
print("=" * 50)

key_acts = [act for act in data["acts"] if act["isKeyAct"]]
print(f"关键幕数量: {len(key_acts)}")
for act in key_acts:
    print(f"  - {act['id']}: {act['title']}")

print("=" * 50)

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

print("=" * 50)

score_errors = []
for act in data["acts"]:
    for dlg in act["dialogues"]:
        if dlg["score"] < 60 or dlg["score"] > 100:
            score_errors.append(f"{act['id']} - {dlg['id']}: score={dlg['score']}")

if score_errors:
    print("分数不在 60-100 之间的选项:")
    for e in score_errors:
        print(f"  - {e}")
else:
    print("所有对话选项的分数均在 60-100 之间，正确！")

print("=" * 50)

print("\n所有幕的列表:")
for i, act in enumerate(data["acts"], 1):
    key_mark = " [KEY]" if act["isKeyAct"] else ""
    print(f"{i:2d}. {act['id']}: {act['title']} ({act['timeMarker']}){key_mark}")
