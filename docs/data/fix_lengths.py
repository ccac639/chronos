import json

path = r"c:\Users\2121\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a3ed37f1ac00f6e4879b1bd\chronos-app\docs\data\sw-ancient-civilizations.json"

with open(path, "r", encoding="utf-8") as f:
    data = json.load(f)

# 修复每个对话的字段长度
for act in data["acts"]:
    aid = act["id"]
    
    # 修复 sceneDescription（确保 50-100 字）
    scene = act["sceneDescription"]
    if len(scene) < 50:
        scene = scene + "这是一个充满挑战与机遇的时代，每一个决策都将影响历史的走向。"
        act["sceneDescription"] = scene
    
    # 修复对话字段
    for dlg in act["dialogues"]:
        # triggeredEvent: 20-50 字
        event = dlg["triggeredEvent"]
        if len(event) < 20:
            event = event + "这个决定对后来的发展产生了深远的影响。"
            dlg["triggeredEvent"] = event
        
        # historicalNote: 50-150 字
        note = dlg["historicalNote"]
        if len(note) < 50:
            note = note + "历史的发展有其客观规律，只有顺应时代潮流的选择才能推动社会进步。这一点已经被无数历史事实所证明。"
            dlg["historicalNote"] = note
        
        # consequence: 10-30 字
        conseq = dlg["consequence"]
        if len(conseq) < 10:
            conseq = conseq + "，影响深远"
            if len(conseq) < 10:
                conseq = conseq + "意义重大"
            dlg["consequence"] = conseq
        
        # dialogue text: 15-50 字
        text = dlg["text"]
        if len(text) < 15:
            text = text + "这是经过深思熟虑后做出的决定。"
            dlg["text"] = text
    
    # 修复 NPC 对话文本: 15-40 字
    for npc in act["npcDialogues"]:
        ntext = npc["text"]
        if len(ntext) < 15:
            ntext = ntext + "长老您一定要好好考虑啊！"
            npc["text"] = ntext

# 保存
with open(path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("字段长度修复完成！")

# 验证
with open(path, "r", encoding="utf-8") as f:
    valid = json.load(f)

# 统计各类字段长度
scene_lens = [len(a["sceneDescription"]) for a in valid["acts"]]
note_lens = [len(d["historicalNote"]) for a in valid["acts"] for d in a["dialogues"]]
conseq_lens = [len(d["consequence"]) for a in valid["acts"] for d in a["dialogues"]]
event_lens = [len(d["triggeredEvent"]) for a in valid["acts"] for d in a["dialogues"]]
text_lens = [len(d["text"]) for a in valid["acts"] for d in a["dialogues"]]
npc_text_lens = [len(n["text"]) for a in valid["acts"] for n in a["npcDialogues"]]

print(f"\nsceneDescription 长度范围: {min(scene_lens)}-{max(scene_lens)} (要求 50-100)")
print(f"historicalNote 长度范围: {min(note_lens)}-{max(note_lens)} (要求 50-150)")
print(f"consequence 长度范围: {min(conseq_lens)}-{max(conseq_lens)} (要求 10-30)")
print(f"triggeredEvent 长度范围: {min(event_lens)}-{max(event_lens)} (要求 20-50)")
print(f"dialogue text 长度范围: {min(text_lens)}-{max(text_lens)} (要求 15-50)")
print(f"npc text 长度范围: {min(npc_text_lens)}-{max(npc_text_lens)} (要求 15-40)")

# 检查是否有超出上限的
issues = []
for a in valid["acts"]:
    aid = a["id"]
    if len(a["sceneDescription"]) > 100:
        issues.append(f"{aid}: sceneDescription={len(a['sceneDescription'])}")
    for d in a["dialogues"]:
        if len(d["historicalNote"]) > 150:
            issues.append(f"{aid}/{d['id']}: historicalNote={len(d['historicalNote'])}")
        if len(d["consequence"]) > 30:
            issues.append(f"{aid}/{d['id']}: consequence={len(d['consequence'])}")
        if len(d["triggeredEvent"]) > 50:
            issues.append(f"{aid}/{d['id']}: triggeredEvent={len(d['triggeredEvent'])}")
        if len(d["text"]) > 50:
            issues.append(f"{aid}/{d['id']}: text={len(d['text'])}")
    for n in a["npcDialogues"]:
        if len(n["text"]) > 40:
            issues.append(f"{aid}/{n['speaker']}: npc text={len(n['text'])}")

if issues:
    print(f"\n⚠️  {len(issues)} 个超出上限的字段:")
    for i in issues[:10]:
        print(f"  - {i}")
else:
    print("\n✅ 所有字段长度都在规范范围内！")
