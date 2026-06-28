import json

with open('w9-revolution.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print('=== NPC 文本长度检查 ===')
issues = []
for act in data['acts']:
    for npc in act['npcDialogues']:
        text = npc['text']
        length = len(text)
        if length < 15 or length > 40:
            issues.append((act['id'], npc['speaker'], length, text))

print(f'有问题的 NPC 对话数: {len(issues)}')
for item in issues:
    print(f'  {item[0]}/{item[1]}: {item[2]} 字 - {item[3]}')
