import json

with open('w9-revolution.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print('=== 基本信息 ===')
print(f'eraId: {data.get("eraId")}')
print(f'eraName: {data.get("eraName")}')
print(f'playerRole: {data.get("playerRole")}')
print(f'startYear: {data.get("startYear")}')
print(f'endYear: {data.get("endYear")}')
print(f'act 总数: {len(data.get("acts", []))}')

print()
print('=== 关键幕检查 ===')
key_acts = [act for act in data['acts'] if act.get('isKeyAct') == True]
print(f'isKeyAct 为 true 的数量: {len(key_acts)}')
for act in key_acts:
    print(f'  - {act["id"]}: {act["title"]}')

print()
print('=== 对话选项数量检查 ===')
invalid_acts = []
for act in data['acts']:
    dialogues = act.get('dialogues', [])
    if len(dialogues) != 9:
        invalid_acts.append((act['id'], len(dialogues)))
if invalid_acts:
    print(f'对话选项数量不为9的 act: {invalid_acts}')
else:
    print('所有 act 都恰好有 9 个对话选项 ✓')

print()
print('=== 分数范围检查 ===')
invalid_scores = []
for act in data['acts']:
    for d in act.get('dialogues', []):
        score = d.get('score', 0)
        if score < 60 or score > 100:
            invalid_scores.append((act['id'], d['id'], score))
if invalid_scores:
    print(f'分数不在60-100之间的选项: {len(invalid_scores)} 个')
    for item in invalid_scores[:5]:
        print(f'  - {item}')
else:
    print('所有分数都在 60-100 之间 ✓')

print()
print('=== 主线/分支统计 ===')
main_acts = [a for a in data['acts'] if 'b' not in a['id']]
branch_acts = [a for a in data['acts'] if 'b' in a['id']]
print(f'主线幕数量: {len(main_acts)}')
print(f'分支幕数量: {len(branch_acts)}')

print()
print('=== 字段完整性检查 ===')
required_act_fields = ['id', 'title', 'isKeyAct', 'timeMarker', 'sceneDescription', 'npcDialogues', 'dialogues']
required_dialogue_fields = ['id', 'text', 'speaker', 'avatar', 'score', 'triggeredEvent', 'historicalNote', 'consequence', 'nextActId']
all_good = True
for act in data['acts']:
    for field in required_act_fields:
        if field not in act:
            print(f'ACT {act["id"]} 缺少字段: {field}')
            all_good = False
    for d in act.get('dialogues', []):
        for field in required_dialogue_fields:
            if field not in d:
                print(f'ACT {act["id"]} 对话 {d["id"]} 缺少字段: {field}')
                all_good = False
if all_good:
    print('所有必需字段都存在 ✓')

print()
print('=== 场景描述长度检查 ===')
short_scenes = []
for act in data['acts']:
    desc = act.get('sceneDescription', '')
    if len(desc) < 50 or len(desc) > 150:
        short_scenes.append((act['id'], len(desc)))
if short_scenes:
    print(f'场景描述长度不在50-150字之间的 act 数: {len(short_scenes)}')
    for item in short_scenes[:5]:
        print(f'  - {item[0]}: {item[1]} 字')
else:
    print('所有场景描述长度都在合理范围内 ✓')

print()
print('=== NPC 对话检查 ===')
no_npc_acts = []
for act in data['acts']:
    npcs = act.get('npcDialogues', [])
    if len(npcs) < 2:
        no_npc_acts.append(act['id'])
if no_npc_acts:
    print(f'NPC 对话少于2个的 act: {no_npc_acts}')
else:
    print('所有 act 都有至少 2 个 NPC 对话 ✓')

print()
print('验证完成！')
