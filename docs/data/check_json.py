import json

file_path = r'c:\Users\2121\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a3ed37f1ac00f6e4879b1bd\chronos-app\docs\data\w9-imperialism.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

print('=== 基本信息 ===')
print('eraId:', data['eraId'])
print('eraName:', data['eraName'])
print('playerRole:', data['playerRole'])
print('startYear:', data['startYear'])
print('endYear:', data['endYear'])
print('acts数量:', len(data['acts']))

print('\n=== Act IDs ===')
act_ids = [a['id'] for a in data['acts']]
print(act_ids)

print('\n=== 关键幕 ===')
key_acts = [a for a in data['acts'] if a['isKeyAct']]
print('关键幕数量:', len(key_acts))
print('关键幕ids:', [a['id'] for a in key_acts])

print('\n=== 每幕对话数检查 ===')
dialogue_counts = []
for act in data['acts']:
    cnt = len(act['dialogues'])
    dialogue_counts.append((act['id'], cnt))
    if cnt != 9:
        print(f'警告: {act["id"]} 有 {cnt} 个对话选项')

print('\n=== 分数区间检查 ===')
for act in data['acts']:
    scores = [d['score'] for d in act['dialogues']]
    min_s = min(scores)
    max_s = max(scores)
    if min_s < 60 or max_s > 100:
        print(f'警告: {act["id"]} 分数超出范围 [{min_s}, {max_s}]')

print('\n=== nextActId 引用检查 ===')
valid_ids = set(act_ids)
invalid_refs = []
for act in data['acts']:
    for d in act['dialogues']:
        if d['nextActId'] not in valid_ids:
            invalid_refs.append(f'{act["id"]} -> {d["nextActId"]}')
if invalid_refs:
    print('发现无效引用:')
    for ref in invalid_refs:
        print('  ', ref)
else:
    print('所有nextActId引用有效')

print('\n=== 字段长度检查 (抽样前3个act) ===')
for act in data['acts'][:3]:
    print(f'\n{act["id"]} - {act["title"]}')
    print(f'  title长度: {len(act["title"])} (要求2-8)')
    print(f'  sceneDescription长度: {len(act["sceneDescription"])} (要求50-100)')
    for i, d in enumerate(act['dialogues'][:2]):
        print(f'  d{i+1}:')
        print(f'    text长度: {len(d["text"])} (要求15-50)')
        print(f'    triggeredEvent长度: {len(d["triggeredEvent"])} (要求20-50)')
        print(f'    historicalNote长度: {len(d["historicalNote"])} (要求50-150)')
        print(f'    consequence长度: {len(d["consequence"])} (要求10-30)')
