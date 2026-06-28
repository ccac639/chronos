import json

path = r"c:\Users\2121\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a3ed37f1ac00f6e4879b1bd\chronos-app\docs\data\sw-ancient-civilizations.json"

with open(path, "r", encoding="utf-8") as f:
    data = json.load(f)

errors = []
warnings = []

def check_len(name, text, min_len, max_len, act_id, field_id=""):
    l = len(text)
    if l < min_len:
        errors.append(f"[{act_id}] {name}{('('+field_id+')') if field_id else ''} 长度 {l} 小于最小值 {min_len}: {text[:50]}...")
    elif l > max_len:
        errors.append(f"[{act_id}] {name}{('('+field_id+')') if field_id else ''} 长度 {l} 大于最大值 {max_len}: {text[:50]}...")

def check_score(score, act_id, dlg_id):
    if not isinstance(score, int):
        errors.append(f"[{act_id}] 对话 {dlg_id} 分数不是整数: {score}")
    elif score < 60 or score > 100:
        errors.append(f"[{act_id}] 对话 {dlg_id} 分数 {score} 不在 60-100 范围内")

# 检查顶层字段
print("=== 顶层字段检查 ===")
print(f"eraId: {data.get('eraId')}")
print(f"eraName: {data.get('eraName')}")
print(f"playerRole: {data.get('playerRole')}")
print(f"startYear: {data.get('startYear')}")
print(f"endYear: {data.get('endYear')}")
print(f"acts 数量: {len(data.get('acts', []))}")

# 检查每个 act
print("\n=== Act 详细检查 ===")
for act in data["acts"]:
    aid = act["id"]
    title = act["title"]
    is_key = act["isKeyAct"]
    time_marker = act["timeMarker"]
    scene = act["sceneDescription"]
    npcs = act["npcDialogues"]
    dialogues = act["dialogues"]
    
    # title: 2-8 个中文字符
    check_len("title", title, 2, 8, aid)
    
    # sceneDescription: 50-100 个中文字符
    check_len("sceneDescription", scene, 50, 100, aid)
    
    # npcDialogues: 2-3 个
    if len(npcs) < 2 or len(npcs) > 3:
        errors.append(f"[{aid}] npcDialogues 数量 {len(npcs)} 不在 2-3 范围内")
    
    for npc in npcs:
        npc_name = npc["speaker"]
        npc_text = npc["text"]
        npc_avatar = npc["avatar"]
        # npc text: 15-40 个中文字符
        check_len("npc text", npc_text, 15, 40, aid, npc_name)
        # avatar: 单个汉字
        if len(npc_avatar) != 1:
            errors.append(f"[{aid}] NPC {npc_name} 的 avatar 不是单个汉字: {npc_avatar}")
    
    # dialogues: 恰好 9 个
    if len(dialogues) != 9:
        errors.append(f"[{aid}] dialogues 数量 {len(dialogues)} 不等于 9")
    
    score_set = set()
    for dlg in dialogues:
        did = dlg["id"]
        dtext = dlg["text"]
        dspeaker = dlg["speaker"]
        davatar = dlg["avatar"]
        dscore = dlg["score"]
        devent = dlg["triggeredEvent"]
        dnote = dlg["historicalNote"]
        dconseq = dlg["consequence"]
        dnext = dlg["nextActId"]
        
        # dialogue text: 15-50 个中文字符
        check_len("dialogue text", dtext, 15, 50, aid, did)
        
        # speaker: 固定为 "我"
        if dspeaker != "我":
            errors.append(f"[{aid}] 对话 {did} 的 speaker 不是 '我': {dspeaker}")
        
        # avatar: 单个汉字
        if len(davatar) != 1:
            errors.append(f"[{aid}] 对话 {did} 的 avatar 不是单个汉字: {davatar}")
        
        # score: 60-100 整数
        check_score(dscore, aid, did)
        score_set.add(dscore)
        
        # triggeredEvent: 20-50 个中文字符
        check_len("triggeredEvent", devent, 20, 50, aid, did)
        
        # historicalNote: 50-150 个中文字符
        check_len("historicalNote", dnote, 50, 150, aid, did)
        
        # consequence: 10-30 个中文字符
        check_len("consequence", dconseq, 10, 30, aid, did)
        
        # nextActId: 必须存在（已在之前验证过）
    
    # 检查分数是否覆盖全部分数区间
    if len(score_set) < 5:
        warnings.append(f"[{aid}] 分数分布较少，只有 {len(score_set)} 个不同分数: {sorted(score_set)}")

# 统计关键幕
key_acts = [a for a in data["acts"] if a["isKeyAct"]]
print(f"\n关键幕数量: {len(key_acts)}")
for a in key_acts:
    print(f"  - {a['id']}: {a['title']}")

# 统计主线和分支
main_acts = [a for a in data["acts"] if a["id"].startswith("act-") and a["id"][4:].isdigit()]
branch_acts = [a for a in data["acts"] if a not in main_acts]
print(f"\n主线幕: {len(main_acts)} 个")
print(f"分支幕: {len(branch_acts)} 个")

# 检查所有 nextActId 是否指向有效的 act
valid_ids = {a["id"] for a in data["acts"]}
all_next_ids = set()
for a in data["acts"]:
    for dlg in a["dialogues"]:
        all_next_ids.add(dlg["nextActId"])
invalid_next = all_next_ids - valid_ids
if invalid_next:
    errors.append(f"存在无效的 nextActId: {invalid_next}")
else:
    print("\n所有 nextActId 都有效")

# 检查结局幕（act-30）的所有对话是否指向自身
final_act = None
for a in data["acts"]:
    if a["id"] == "act-30":
        final_act = a
        break

if final_act:
    all_point_to_self = all(dlg["nextActId"] == "act-30" for dlg in final_act["dialogues"])
    if all_point_to_self:
        print("结局幕 act-30 的所有对话都指向自身 ✓")
    else:
        errors.append("结局幕 act-30 的对话不都指向自身")

# 输出错误和警告
if errors:
    print(f"\n❌ 发现 {len(errors)} 个错误:")
    for e in errors[:20]:
        print(f"  - {e}")
    if len(errors) > 20:
        print(f"  ... 还有 {len(errors)-20} 个错误")
else:
    print("\n✅ 没有发现错误！")

if warnings:
    print(f"\n⚠️  {len(warnings)} 个警告:")
    for w in warnings[:10]:
        print(f"  - {w}")

# 总结
print(f"\n=== 总结 ===")
print(f"总 act 数: {len(data['acts'])} (要求 45-50) {'✓' if 45 <= len(data['acts']) <= 50 else '✗'}")
print(f"主线幕: {len(main_acts)} (要求约 30) {'✓' if 28 <= len(main_acts) <= 35 else '✗'}")
print(f"分支幕: {len(branch_acts)} (要求 15-20) {'✓' if 15 <= len(branch_acts) <= 20 else '✗'}")
print(f"关键幕: {len(key_acts)} (要求 3-5) {'✓' if 3 <= len(key_acts) <= 5 else '✗'}")
print(f"每幕对话数: {set(len(a['dialogues']) for a in data['acts'])} (要求 9) {'✓' if set(len(a['dialogues']) for a in data['acts']) == {9} else '✗'}")
