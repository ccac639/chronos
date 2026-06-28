import json
import sys

errors = []
warnings = []

try:
    with open('sw-medieval-asia-africa.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    print("✅ JSON 格式合法")
except Exception as e:
    print(f"❌ JSON 格式错误: {e}")
    sys.exit(1)

# 检查顶层字段
required_top = ["eraId", "eraName", "playerRole", "startYear", "endYear", "description", "backgroundStory", "acts"]
for field in required_top:
    if field not in data:
        errors.append(f"缺失顶层字段: {field}")
    else:
        print(f"✅ 顶层字段: {field}")

print(f"\n总幕数: {len(data['acts'])}")
if 45 <= len(data['acts']) <= 50:
    print(f"✅ 幕数符合要求 (45-50): {len(data['acts'])}")
else:
    errors.append(f"幕数不符合要求 (45-50): {len(data['acts'])}")

key_acts = [a for a in data['acts'] if a['isKeyAct']]
print(f"关键幕数: {len(key_acts)}")
if len(key_acts) == 4:
    print(f"✅ 关键幕数符合要求 (4)")
else:
    errors.append(f"关键幕数不符合要求 (4): {len(key_acts)}")
print("关键幕:", [(a['id'], a['title']) for a in key_acts])

# 检查每个 act
for act in data['acts']:
    act_id = act['id']
    
    # 必需字段
    required_act = ["id", "title", "isKeyAct", "timeMarker", "sceneDescription", "npcDialogues", "dialogues"]
    for field in required_act:
        if field not in act:
            errors.append(f"{act_id} 缺失字段: {field}")
    
    # sceneDescription 长度 (50-100字)
    scene_len = len(act.get('sceneDescription', ''))
    if scene_len < 50:
        warnings.append(f"{act_id} sceneDescription 太短: {scene_len}字 (要求50-100)")
    elif scene_len > 150:
        warnings.append(f"{act_id} sceneDescription 太长: {scene_len}字 (要求50-100)")
    
    # dialogues 数量 (恰好9个)
    dialogues = act.get('dialogues', [])
    if len(dialogues) != 9:
        errors.append(f"{act_id} 对话选项数量不是9个: {len(dialogues)}")
    
    # 检查每个对话
    for i, dlg in enumerate(dialogues):
        dlg_id = f"{act_id}.{dlg.get('id', '?')}"
        
        # 必需字段
        required_dlg = ["id", "text", "speaker", "avatar", "score", "triggeredEvent", "historicalNote", "consequence", "nextActId"]
        for field in required_dlg:
            if field not in dlg:
                errors.append(f"{dlg_id} 缺失字段: {field}")
        
        # text 长度 (15-50字)
        text_len = len(dlg.get('text', ''))
        if text_len < 10:
            warnings.append(f"{dlg_id} text 太短: {text_len}字 (建议15-50)")
        elif text_len > 60:
            warnings.append(f"{dlg_id} text 太长: {text_len}字 (建议15-50)")
        
        # score 区间 (60-100)
        score = dlg.get('score', 0)
        if not isinstance(score, int) or score < 60 or score > 100:
            errors.append(f"{dlg_id} score 不在60-100之间: {score}")
        
        # triggeredEvent 长度 (20-50字)
        event_len = len(dlg.get('triggeredEvent', ''))
        if event_len < 15:
            warnings.append(f"{dlg_id} triggeredEvent 太短: {event_len}字 (建议20-50)")
        
        # historicalNote 长度 (50-150字)
        note_len = len(dlg.get('historicalNote', ''))
        if note_len < 40:
            warnings.append(f"{dlg_id} historicalNote 太短: {note_len}字 (建议50-150)")
        elif note_len > 200:
            warnings.append(f"{dlg_id} historicalNote 太长: {note_len}字 (建议50-150)")
        
        # consequence 长度 (10-30字)
        cons_len = len(dlg.get('consequence', ''))
        if cons_len < 5:
            warnings.append(f"{dlg_id} consequence 太短: {cons_len}字 (建议10-30)")
        elif cons_len > 40:
            warnings.append(f"{dlg_id} consequence 太长: {cons_len}字 (建议10-30)")
        
        # nextActId 存在性
        next_id = dlg.get('nextActId', '')
        if next_id:
            if next_id not in [a['id'] for a in data['acts']]:
                # 最后一幕可以指向结束
                if act_id in ['act-30', 'act-30b']:
                    pass
                else:
                    errors.append(f"{dlg_id} nextActId 不存在: {next_id}")

# 分支逻辑检查
print("\n=== 分支逻辑检查 ===")
main_acts = [a for a in data['acts'] if 'b' not in a['id']]
branch_acts = [a for a in data['acts'] if 'b' in a['id']]
print(f"主线幕: {len(main_acts)}")
print(f"分支幕: {len(branch_acts)}")

# 检查分支是否在5幕内汇合
for branch in branch_acts:
    branch_id = branch['id']
    # 找出指向这个分支的对话
    sources = []
    for act in data['acts']:
        for dlg in act['dialogues']:
            if dlg.get('nextActId') == branch_id:
                sources.append(act['id'])
    # 找出分支的出口
    exits = set()
    for dlg in branch['dialogues']:
        exits.add(dlg.get('nextActId', ''))
    print(f"  {branch_id}: 入口={sources}, 出口={list(exits)}")

print(f"\n=== 统计 ===")
print(f"错误数: {len(errors)}")
print(f"警告数: {len(warnings)}")

if errors:
    print("\n❌ 错误列表:")
    for e in errors:
        print(f"  - {e}")
else:
    print("\n✅ 没有错误！")

if warnings:
    print("\n⚠️ 警告列表:")
    for w in warnings[:20]:
        print(f"  - {w}")
    if len(warnings) > 20:
        print(f"  ... 还有 {len(warnings)-20} 条警告")

print("\n验证完成！")
