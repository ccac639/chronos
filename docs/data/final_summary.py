import json, os

path = r"c:\Users\2121\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a3ed37f1ac00f6e4879b1bd\chronos-app\docs\data\sw-ancient-civilizations.json"
size = os.path.getsize(path)
print(f"文件大小: {size} 字节 ({size/1024:.1f} KB)")

with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"eraId: {data['eraId']}")
print(f"eraName: {data['eraName']}")
print(f"playerRole: {data['playerRole']}")
print(f"startYear: {data['startYear']}")
print(f"endYear: {data['endYear']}")
print(f"总 act 数: {len(data['acts'])}")
print()

print("关键幕列表:")
for a in data['acts']:
    if a['isKeyAct']:
        print(f"  - {a['id']}: {a['title']} ({a['timeMarker']})")

print()
main_count = sum(1 for a in data['acts'] if a['id'].startswith('act-') and a['id'][4:].isdigit())
branch_count = len(data['acts']) - main_count
print(f"主线幕: {main_count} 个")
print(f"分支幕: {branch_count} 个")
print(f"每幕对话数: {set(len(a['dialogues']) for a in data['acts'])}")
print()

print("前5个 act:")
for a in data['acts'][:5]:
    print(f"  {a['id']} - {a['title']}")

print()
print("最后5个 act:")
for a in data['acts'][-5:]:
    print(f"  {a['id']} - {a['title']}")
