import json

with open('w9-contemporary.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print('=== 基本信息 ===')
print(f'eraId:', data['eraId'])
print('eraName:', data['eraName'])
print('playerRole:', data['playerRole'])
print('startYear:', data['startYear'])
print('endYear:', data['endYear'])
print('acts数量:', len(data['acts']))

act_ids = [a['id'] for a in data['acts']]
print('\n=== Act IDs ===')
print(act_ids)

key_acts = [a['id'] for a in data['acts'] if a['isKeyAct']]
print('\n=== 关键幕 ===')
print('关键幕数量:', len(key_acts))
print('关键幕ids:', key_acts)

print('\n=== 每幕对话数检查 ===')
dialog_counts = [len(a['dialogues']) for a in data['acts']]
print('最少对话数:', min(dialog_counts))
print('最多对话数:', max(dialog_counts))
if min(dialog_counts) == 9 and max(dialog_counts) == 9:
    print('所有幕均有恰好9个对话选项 ✓')
else:
    print('警告：存在对话数不为9的幕')
    for a in data['acts']:
        if len(a['dialogues']) != 9:
            print(f'  {a["id"]}: {len(a["dialogues"])}个')

print('\n=== 分数区间检查 ===')
all_scores = []
for a in data['acts']:
    for d in a['dialogues']:
        all_scores.append(d['score'])
print('最低分:', min(all_scores))
print('最高分:', max(all_scores))
print('分数都在60-100之间:', all(60 <= s <= 100 for s in all_scores))

print('\n=== nextActId 引用检查 ===')
act_id_set = set(act_ids)
invalid_refs = []
for a in data['acts']:
    for d in a['dialogues']:
        if d['nextActId'] not in act_id_set:
            invalid_refs.append((a['id'], d['id'], d['nextActId']))
if invalid_refs:
    print('发现无效的nextActId引用:')
    for ref in invalid_refs:
        print(f'  {ref[0]} -> {ref[1]} -> {ref[2]}')
else:
    print('所有nextActId引用有效 ✓')

print('\n=== 字段长度检查 (抽样前3个act) ===')
for a in data['acts'][:3]:
    print(f'\n{a["id"]} - {a["title"]}')
    print(f'  title长度: {len(a["title"])} (要求2-8)')
    print(f'  sceneDescription长度: {len(a["sceneDescription"])} (要求50-100)')
    for d in a['dialogues'][:2]:
        print(f'  {d["id"]}:')
        print(f'    text长度: {len(d["text"])} (要求15-50)')
        print(f'    triggeredEvent长度: {len(d["triggeredEvent"])} (要求20-50)')
        print(f'    historicalNote长度: {len(d["historicalNote"])} (要求50-150)')
        print(f'    consequence长度: {len(d["consequence"])} (要求10-30)')
