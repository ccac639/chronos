import json

with open('w9-revolution.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print('=== 最终验证报告 ===')
print()

# 基本信息
print('1. 基本信息:')
print(f'   - eraId: {data["eraId"]}')
print(f'   - eraName: {data["eraName"]}')
print(f'   - playerRole: {data["playerRole"]}')
print(f'   - startYear: {data["startYear"]}')
print(f'   - endYear: {data["endYear"]}')
print(f'   - act 总数: {len(data["acts"])} (要求 45-50)')
print()

# 关键幕
key_acts = [a for a in data['acts'] if a['isKeyAct']]
print(f'2. 关键幕: {len(key_acts)} 个 (要求约 4 个)')
for a in key_acts:
    print(f'   - {a["id"]}: {a["title"]}')
print()

# 主线/分支
main_acts = [a for a in data['acts'] if 'b' not in a['id']]
branch_acts = [a for a in data['acts'] if 'b' in a['id']]
print(f'3. 主线/分支:')
print(f'   - 主线幕: {len(main_acts)} 个 (要求 30)')
print(f'   - 分支幕: {len(branch_acts)} 个 (要求 15-20)')
print()

# 对话选项数量
dialogue_ok = all(len(a['dialogues']) == 9 for a in data['acts'])
print(f'4. 对话选项数量: {"✓ 所有 act 都有 9 个选项" if dialogue_ok else "✗ 有问题"}')
print()

# 分数范围
score_ok = all(60 <= d['score'] <= 100 for a in data['acts'] for d in a['dialogues'])
print(f'5. 分数范围: {"✓ 都在 60-100 之间" if score_ok else "✗ 有问题"}')
print()

# 分数分布
score_dist_ok = True
for act in data['acts']:
    scores = [d['score'] for d in act['dialogues']]
    if not (any(s >= 90 for s in scores) and any(60 <= s <= 69 for s in scores)):
        score_dist_ok = False
        break
print(f'6. 分数分布: {"✓ 都覆盖 90+ 和 60-69 区间" if score_dist_ok else "✗ 有问题"}')
print()

# 场景描述长度
scene_len_ok = all(50 <= len(a['sceneDescription']) <= 100 for a in data['acts'])
print(f'7. 场景描述长度: {"✓ 都在 50-100 字之间" if scene_len_ok else "✗ 有问题"}')
print()

# 字段完整性
required_act_fields = ['id', 'title', 'isKeyAct', 'timeMarker', 'sceneDescription', 'npcDialogues', 'dialogues']
required_dialogue_fields = ['id', 'text', 'speaker', 'avatar', 'score', 'triggeredEvent', 'historicalNote', 'consequence', 'nextActId']
fields_ok = True
for act in data['acts']:
    for field in required_act_fields:
        if field not in act:
            fields_ok = False
    for d in act['dialogues']:
        for field in required_dialogue_fields:
            if field not in d:
                fields_ok = False
print(f'8. 字段完整性: {"✓ 所有必需字段都存在" if fields_ok else "✗ 有问题"}')
print()

# NPC 对话
npc_ok = all(2 <= len(a['npcDialogues']) <= 3 for a in data['acts'])
print(f'9. NPC 对话数量: {"✓ 都在 2-3 个之间" if npc_ok else "✗ 有问题"}')
print()

# triggeredEvent 长度
event_len_ok = all(20 <= len(d['triggeredEvent']) <= 50 for a in data['acts'] for d in a['dialogues'])
print(f'10. triggeredEvent 长度: {"✓ 都在 20-50 字之间" if event_len_ok else "✗ 有问题"}')
print()

# consequence 长度
cons_len_ok = all(10 <= len(d['consequence']) <= 30 for a in data['acts'] for d in a['dialogues'])
print(f'11. consequence 长度: {"✓ 都在 10-30 字之间" if cons_len_ok else "✗ 有问题"}')
print()

# historicalNote 长度
note_len_ok = all(50 <= len(d['historicalNote']) <= 150 for a in data['acts'] for d in a['dialogues'])
print(f'12. historicalNote 长度: {"✓ 都在 50-150 字之间" if note_len_ok else "✗ 有问题"}')
print()

# nextActId 连通性
all_ids = set(a['id'] for a in data['acts'])
all_next_ids = set(d['nextActId'] for a in data['acts'] for d in a['dialogues'])
next_ok = all_next_ids.issubset(all_ids)
print(f'13. nextActId 连通性: {"✓ 所有引用都存在" if next_ok else "✗ 有问题"}')
print()

# 对话文本长度
text_len_ok = all(15 <= len(d['text']) <= 50 for a in data['acts'] for d in a['dialogues'])
print(f'14. 对话文本长度: {"✓ 都在 15-50 字之间" if text_len_ok else "✗ 有问题"}')
print()

# NPC 文本长度
npc_text_ok = all(15 <= len(npc['text']) <= 40 for a in data['acts'] for npc in a['npcDialogues'])
print(f'15. NPC 文本长度: {"✓ 都在 15-40 字之间" if npc_text_ok else "✗ 有问题"}')
print()

print('=== 验证总结 ===')
checks = [
    ('act 总数 45-50', 45 <= len(data['acts']) <= 50),
    ('关键幕约 4 个', len(key_acts) == 4),
    ('主线幕 30 个', len(main_acts) == 30),
    ('分支幕 15-20 个', 15 <= len(branch_acts) <= 20),
    ('每幕 9 个对话选项', dialogue_ok),
    ('分数 60-100', score_ok),
    ('分数覆盖全区间', score_dist_ok),
    ('场景描述 50-100 字', scene_len_ok),
    ('字段完整性', fields_ok),
    ('NPC 对话 2-3 个', npc_ok),
    ('triggeredEvent 20-50 字', event_len_ok),
    ('consequence 10-30 字', cons_len_ok),
    ('historicalNote 50-150 字', note_len_ok),
    ('nextActId 连通性', next_ok),
    ('对话文本 15-50 字', text_len_ok),
    ('NPC 文本 15-40 字', npc_text_ok),
]

passed = sum(1 for _, ok in checks if ok)
total = len(checks)
print(f'通过: {passed}/{total}')
print()

all_passed = all(ok for _, ok in checks)
if all_passed:
    print('🎉 所有检查都通过了！')
else:
    print('⚠️ 部分检查未通过，请查看上面的详细信息')
