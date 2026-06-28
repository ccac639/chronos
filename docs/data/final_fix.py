import json

path = r"c:\Users\2121\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a3ed37f1ac00f6e4879b1bd\chronos-app\docs\data\sw-ancient-civilizations.json"

with open(path, "r", encoding="utf-8") as f:
    data = json.load(f)

# 修复 act-6 中国王卢加尔的对话
for act in data["acts"]:
    if act["id"] == "act-6":
        for npc in act["npcDialogues"]:
            if npc["speaker"] == "国王卢加尔":
                npc["text"] = "长老，乌鲁克是苏美尔最强大的城邦，我们应该征服周边城邦！"
                print(f"修复 act-6 国王卢加尔: {len(npc['text'])} 字")
            if npc["speaker"] == "祭司伊南娜":
                if len(npc["text"]) > 40:
                    npc["text"] = "不可轻举妄动！战争会带来灾难，应和平共处、互通贸易。"
                    print(f"修复 act-6 祭司伊南娜: {len(npc['text'])} 字")
    if act["id"] == "act-13":
        for npc in act["npcDialogues"]:
            if npc["speaker"] == "建筑师海米昂":
                npc["text"] = "这座金字塔高146米，用230万块巨石，每块都经过精确打磨。"
                print(f"修复 act-13 建筑师海米昂: {len(npc['text'])} 字")

# 保存
with open(path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("\n修复完成！")

# 最终验证
with open(path, "r", encoding="utf-8") as f:
    valid = json.load(f)

print(f"\n=== 最终验证 ===")
print(f"总 act 数: {len(valid['acts'])}")

key_acts = [a for a in valid["acts"] if a["isKeyAct"]]
print(f"关键幕数: {len(key_acts)}")

main_acts = [a for a in valid["acts"] if a["id"].startswith("act-") and a["id"][4:].isdigit()]
branch_acts = [a for a in valid["acts"] if a not in main_acts]
print(f"主线幕: {len(main_acts)}")
print(f"分支幕: {len(branch_acts)}")

# 检查所有字段长度
all_ok = True
for a in valid["acts"]:
    aid = a["id"]
    
    if len(a["title"]) < 2 or len(a["title"]) > 8:
        print(f"❌ {aid}: title 长度 {len(a['title'])}")
        all_ok = False
    
    if len(a["sceneDescription"]) < 50 or len(a["sceneDescription"]) > 100:
        print(f"❌ {aid}: sceneDescription 长度 {len(a['sceneDescription'])}")
        all_ok = False
    
    if len(a["npcDialogues"]) < 2 or len(a["npcDialogues"]) > 3:
        print(f"❌ {aid}: npcDialogues 数量 {len(a['npcDialogues'])}")
        all_ok = False
    
    for npc in a["npcDialogues"]:
        if len(npc["text"]) < 15 or len(npc["text"]) > 40:
            print(f"❌ {aid}/{npc['speaker']}: npc text 长度 {len(npc['text'])} - {npc['text']}")
            all_ok = False
        if len(npc["avatar"]) != 1:
            print(f"❌ {aid}/{npc['speaker']}: avatar 不是单字")
            all_ok = False
    
    if len(a["dialogues"]) != 9:
        print(f"❌ {aid}: dialogues 数量 {len(a['dialogues'])}")
        all_ok = False
    
    for dlg in a["dialogues"]:
        if len(dlg["text"]) < 15 or len(dlg["text"]) > 50:
            print(f"❌ {aid}/{dlg['id']}: text 长度 {len(dlg['text'])}")
            all_ok = False
        if dlg["speaker"] != "我":
            print(f"❌ {aid}/{dlg['id']}: speaker 不是 '我'")
            all_ok = False
        if len(dlg["avatar"]) != 1:
            print(f"❌ {aid}/{dlg['id']}: avatar 不是单字")
            all_ok = False
        if not isinstance(dlg["score"], int) or dlg["score"] < 60 or dlg["score"] > 100:
            print(f"❌ {aid}/{dlg['id']}: score {dlg['score']} 不在 60-100")
            all_ok = False
        if len(dlg["triggeredEvent"]) < 20 or len(dlg["triggeredEvent"]) > 50:
            print(f"❌ {aid}/{dlg['id']}: triggeredEvent 长度 {len(dlg['triggeredEvent'])}")
            all_ok = False
        if len(dlg["historicalNote"]) < 50 or len(dlg["historicalNote"]) > 150:
            print(f"❌ {aid}/{dlg['id']}: historicalNote 长度 {len(dlg['historicalNote'])}")
            all_ok = False
        if len(dlg["consequence"]) < 10 or len(dlg["consequence"]) > 30:
            print(f"❌ {aid}/{dlg['id']}: consequence 长度 {len(dlg['consequence'])}")
            all_ok = False

# 检查 nextActId
valid_ids = {a["id"] for a in valid["acts"]}
for a in valid["acts"]:
    for dlg in a["dialogues"]:
        if dlg["nextActId"] not in valid_ids:
            print(f"❌ {a['id']}/{dlg['id']}: nextActId {dlg['nextActId']} 无效")
            all_ok = False

if all_ok:
    print("\n✅ 所有规范检查通过！")
else:
    print("\n❌ 存在规范问题，请检查")

# 检查结局幕
final_act = [a for a in valid["acts"] if a["id"] == "act-30"][0]
all_self = all(dlg["nextActId"] == "act-30" for dlg in final_act["dialogues"])
print(f"结局幕 act-30 所有对话指向自身: {'✓' if all_self else '✗'}")

# 分数分布
scores = sorted(set(dlg["score"] for a in valid["acts"] for dlg in a["dialogues"]))
print(f"分数分布: {scores}")
