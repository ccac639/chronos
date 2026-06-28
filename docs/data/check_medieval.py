import json

with open('w9-medieval.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print('=== w9-medieval sceneDescription 长度检查 ===')
lengths = []
for act in data['acts']:
    desc = act['sceneDescription']
    length = len(desc)
    lengths.append(length)
    print(f'{act["id"]}: {length} 字')

print()
print(f'平均长度: {sum(lengths)/len(lengths):.0f} 字')
print(f'最长: {max(lengths)} 字')
print(f'最短: {min(lengths)} 字')
print(f'超过100字的数量: {sum(1 for l in lengths if l > 100)}')
