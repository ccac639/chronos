import json

with open('w9-revolution.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print('=== 分数分布检查 ===')
score_issues = []
for act in data['acts']:
    scores = [d['score'] for d in act['dialogues']]
    has_90_plus = any(s >= 90 for s in scores)
    has_60_69 = any(60 <= s <= 69 for s in scores)
    if not has_90_plus or not has_60_69:
        score_issues.append((act['id'], has_90_plus, has_60_69, sorted(scores, reverse=True)))

if score_issues:
    print(f'分数分布有问题的 act: {len(score_issues)} 个')
    for item in score_issues:
        print(f'  {item[0]}: 90+={item[1]}, 60-69={item[2]}, 分数={item[3]}')
else:
    print('所有 act 都有至少一个 90+ 和至少一个 60-69 分的选项 ✓')

print()
print('=== historicalNote 检查 ===')
note_issues = []
for act in data['acts']:
    for d in act['dialogues']:
        note = d.get('historicalNote', '')
        length = len(note)
        if length < 50 or length > 150:
            note_issues.append((act['id'], d['id'], length))
        has_year = any(char.isdigit() for char in note)
        if not has_year:
            note_issues.append((act['id'], d['id'], '无年份'))

if note_issues:
    print(f'historicalNote 有问题的选项数: {len(note_issues)}')
    for item in note_issues[:10]:
        print(f'  {item[0]}/{item[1]}: {item[2]}')
else:
    print('所有 historicalNote 长度都在 50-150 字之间，且包含年份信息 ✓')

print()
print('=== nextActId 连通性检查 ===')
all_act_ids = set(act['id'] for act in data['acts'])
referenced_next = set()
for act in data['acts']:
    for d in act['dialogues']:
        referenced_next.add(d['nextActId'])

missing = referenced_next - all_act_ids
if missing:
    print(f'引用但不存在的 act: {missing}')
else:
    print('所有 nextActId 引用的 act 都存在 ✓')

print()
print('=== triggeredEvent 长度检查 ===')
event_issues = []
for act in data['acts']:
    for d in act['dialogues']:
        event = d.get('triggeredEvent', '')
        length = len(event)
        if length < 20 or length > 50:
            event_issues.append((act['id'], d['id'], length))

if event_issues:
    print(f'triggeredEvent 长度有问题的选项数: {len(event_issues)}')
    for item in event_issues[:10]:
        print(f'  {item[0]}/{item[1]}: {item[2]} 字')
else:
    print('所有 triggeredEvent 长度都在 20-50 字之间 ✓')

print()
print('=== consequence 长度检查 ===')
cons_issues = []
for act in data['acts']:
    for d in act['dialogues']:
        cons = d.get('consequence', '')
        length = len(cons)
        if length < 10 or length > 40:
            cons_issues.append((act['id'], d['id'], length))

if cons_issues:
    print(f'consequence 长度有问题的选项数: {len(cons_issues)}')
    for item in cons_issues[:10]:
        print(f'  {item[0]}/{item[1]}: {item[2]} 字')
else:
    print('所有 consequence 长度都在合理范围内 ✓')

print()
print('检查完成！')
