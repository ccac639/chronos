import re

file_path = r'c:\Users\2121\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a3ed37f1ac00f6e4879b1bd\chronos-app\docs\data\w9-imperialism.json'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

print('文件总长度:', len(content), '字符')

acts = re.findall(r'"id": "(act-[^"]+)"', content)
print('找到的 act 数量:', len(acts))
print('所有 act:')
for a in acts:
    print(f'  - {a}')

print()
print('=== 文件末尾 3000 字符 ===')
print(content[-3000:])
