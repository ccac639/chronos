import json

path = r"c:\Users\2121\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a3ed37f1ac00f6e4879b1bd\chronos-app\docs\data\sw-exploration-reform.json"

with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

print("=" * 60)
print("顶层结构验证")
print("=" * 60)
print(f"eraId: {data['eraId']}")
print(f"eraName: {data['eraName']}")
print(f"playerRole: {data['playerRole']}")
print(f"startYear: {data['startYear']}")
print(f"endYear: {data['endYear']}")
print(f"acts数量: {len(data['acts'])}")

print("\n" + "=" * 60)
print("关键幕列表")
print("=" * 60)
key_acts = [a for a in data["acts"] if a["isKeyAct"]]
for a in key_acts:
    print(f"  {a['id']}: {a['title']} ({a['timeMarker']})")

print("\n" + "=" * 60)
print("字段长度验证")
print("=" * 60)

errors = []
warnings = []

for a in data["acts"]:
    if len(a["title"]) < 2 or len(a["title"]) > 8:
        errors.append(f"{a['id']} 标题长度 {len(a['title'])} (要求2-8)")
    
    if len(a["sceneDescription"]) < 50 or len(a["sceneDescription"]) > 100:
        warnings.append(f"{a['id']} 场景描述长度 {len(a['sceneDescription'])} (要求50-100)")
    
    if len(a["npcDialogues"]) < 2 or len(a["npcDialogues"]) > 3:
        errors.append(f"{a['id']} NPC对话数 {len(a['npcDialogues'])} (要求2-3)")
    
    if len(a["dialogues"]) != 9:
        errors.append(f"{a['id']} 对话选项数 {len(a['dialogues'])} (要求9)")
    
    for npc in a["npcDialogues"]:
        if len(npc["text"]) < 15 or len(npc["text"]) > 40:
            warnings.append(f"{a['id']} NPC[{npc['speaker']}] 文本长度 {len(npc['text'])} (要求15-40)")
        if len(npc["avatar"]) != 1:
            errors.append(f"{a['id']} NPC[{npc['speaker']}] avatar长度 {len(npc['avatar'])} (要求1个汉字)")
    
    scores = []
    for d in a["dialogues"]:
        scores.append(d["score"])
        if len(d["text"]) < 15 or len(d["text"]) > 50:
            warnings.append(f"{a['id']} {d['id']} 选项文本长度 {len(d['text'])} (要求15-50)")
        if d["score"] < 60 or d["score"] > 100:
            errors.append(f"{a['id']} {d['id']} 分数 {d['score']} (要求60-100)")
        if len(d["triggeredEvent"]) < 20 or len(d["triggeredEvent"]) > 50:
            warnings.append(f"{a['id']} {d['id']} 事件描述长度 {len(d['triggeredEvent'])} (要求20-50)")
        if len(d["historicalNote"]) < 50 or len(d["historicalNote"]) > 150:
            warnings.append(f"{a['id']} {d['id']} 历史注解长度 {len(d['historicalNote'])} (要求50-150)")
        if len(d["consequence"]) < 10 or len(d["consequence"]) > 30:
            warnings.append(f"{a['id']} {d['id']} 后果长度 {len(d['consequence'])} (要求10-30)")
        if d["speaker"] != "我":
            errors.append(f"{a['id']} {d['id']} speaker不是'我'")
        if len(d["avatar"]) != 1:
            errors.append(f"{a['id']} {d['id']} avatar长度 {len(d['avatar'])} (要求1个汉字)")
    
    if min(scores) < 60:
        errors.append(f"{a['id']} 最低分 {min(scores)} < 60")

print(f"错误数: {len(errors)}")
for e in errors[:10]:
    print(f"  错误: {e}")

print(f"\n警告数: {len(warnings)}")
for w in warnings[:10]:
    print(f"  警告: {w}")

print("\n" + "=" * 60)
print("分数分布验证（每幕应覆盖60-100全区间）")
print("=" * 60)
for a in data["acts"]:
    scores = sorted([d["score"] for d in a["dialogues"]])
    has_low = any(s <= 69 for s in scores)
    has_mid = any(70 <= s <= 84 for s in scores)
    has_high = any(s >= 85 for s in scores)
    status = "✓" if (has_low and has_mid and has_high) else "✗"
    if status == "✗":
        print(f"  {status} {a['id']}: {scores}")

print("\n" + "=" * 60)
print("所有act ID列表")
print("=" * 60)
for i, a in enumerate(data["acts"]):
    key_marker = " [KEY]" if a["isKeyAct"] else ""
    print(f"  {i+1:2d}. {a['id']:10s} - {a['title']}{key_marker}")

print("\n" + "=" * 60)
print("总结")
print("=" * 60)
print(f"总幕数: {len(data['acts'])} (要求45-50)")
print(f"关键幕数: {len(key_acts)} (要求约3-5个，本项目4个)")
print(f"错误数: {len(errors)}")
print(f"警告数: {len(warnings)}")
print(f"JSON格式: 合法")

main_acts = [a for a in data["acts"] if not a['id'].endswith('b') and not a['id'].endswith('c')]
branch_acts = [a for a in data["acts"] if a['id'].endswith('b') or a['id'].endswith('c')]
print(f"主线幕数: {len(main_acts)}")
print(f"分支幕数: {len(branch_acts)}")
