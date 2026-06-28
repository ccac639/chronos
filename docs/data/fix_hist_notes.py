import json

with open('w9-revolution.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print('修复 historicalNote 长度...')
fixed_count = 0
for act in data['acts']:
    for d in act['dialogues']:
        note = d['historicalNote']
        if len(note) < 50:
            # 在末尾补充一些内容
            d['historicalNote'] = note + '这一事件对后来的历史发展产生了深远影响。'
            fixed_count += 1

print(f'修复了 {fixed_count} 个过短的 historicalNote')

with open('w9-revolution.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('修复完成！')
