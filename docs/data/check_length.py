import json

with open('w9-revolution.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print('=== sceneDescription 长度检查 ===')
too_long = []
too_short = []
for act in data['acts']:
    desc = act['sceneDescription']
    length = len(desc)
    if length > 100:
        too_long.append((act['id'], length))
    if length < 50:
        too_short.append((act['id'], length))

print(f'超过100字的 act 数: {len(too_long)}')
for item in too_long:
    print(f'  {item[0]}: {item[1]} 字')

print()
print(f'少于50字的 act 数: {len(too_short)}')
for item in too_short:
    print(f'  {item[0]}: {item[1]} 字')

print()
print('=== dialogue text 长度检查 ===')
too_long_dialogue = []
too_short_dialogue = []
for act in data['acts']:
    for d in act['dialogues']:
        text = d['text']
        length = len(text)
        if length > 50:
            too_long_dialogue.append((act['id'], d['id'], length))
        if length < 15:
            too_short_dialogue.append((act['id'], d['id'], length))

print(f'超过50字的对话数: {len(too_long_dialogue)}')
for item in too_long_dialogue[:10]:
    print(f'  {item[0]}/{item[1]}: {item[2]} 字')

print()
print(f'少于15字的对话数: {len(too_short_dialogue)}')
for item in too_short_dialogue[:10]:
    print(f'  {item[0]}/{item[1]}: {item[2]} 字')
