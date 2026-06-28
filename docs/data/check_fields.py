import json

file_path = r'c:\Users\2121\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a3ed37f1ac00f6e4879b1bd\chronos-app\docs\data\w9-imperialism.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

print("=== 检查不符合规范的字段 ===\n")

# 检查 sceneDescription (要求50-100)
scene_issues = []
for a in data['acts']:
    l = len(a['sceneDescription'])
    if l < 50 or l > 100:
        scene_issues.append((a['id'], l, a['sceneDescription']))

print(f"1. sceneDescription (要求50-100): {len(scene_issues)} 个不符合")
for aid, l, text in scene_issues[:5]:
    print(f"   {aid}: {l}字 - {text[:50]}...")

# 检查 dialogue text (要求15-50)
text_issues = []
for a in data['acts']:
    for d in a['dialogues']:
        l = len(d['text'])
        if l < 15 or l > 50:
            text_issues.append((a['id'], d['id'], l, d['text']))

print(f"\n2. dialogue text (要求15-50): {len(text_issues)} 个不符合")
for aid, did, l, text in text_issues[:10]:
    print(f"   {aid}/{did}: {l}字 - {text}")

# 检查 triggeredEvent (要求20-50)
triggered_issues = []
for a in data['acts']:
    for d in a['dialogues']:
        l = len(d['triggeredEvent'])
        if l < 20 or l > 50:
            triggered_issues.append((a['id'], d['id'], l, d['triggeredEvent']))

print(f"\n3. triggeredEvent (要求20-50): {len(triggered_issues)} 个不符合")
for aid, did, l, text in triggered_issues[:10]:
    print(f"   {aid}/{did}: {l}字 - {text[:40]}...")

# 检查 consequence (要求10-30)
conseq_issues = []
for a in data['acts']:
    for d in a['dialogues']:
        l = len(d['consequence'])
        if l < 10 or l > 30:
            conseq_issues.append((a['id'], d['id'], l, d['consequence']))

print(f"\n4. consequence (要求10-30): {len(conseq_issues)} 个不符合")
for aid, did, l, text in conseq_issues[:15]:
    print(f"   {aid}/{did}: {l}字 - {text}")

# 检查 historicalNote (要求50-150)
note_issues = []
for a in data['acts']:
    for d in a['dialogues']:
        l = len(d['historicalNote'])
        if l < 50 or l > 150:
            note_issues.append((a['id'], d['id'], l, d['historicalNote'][:50]))

print(f"\n5. historicalNote (要求50-150): {len(note_issues)} 个不符合")
for aid, did, l, text in note_issues[:5]:
    print(f"   {aid}/{did}: {l}字 - {text}...")

print(f"\n总计不符合项: {len(scene_issues) + len(text_issues) + len(triggered_issues) + len(conseq_issues) + len(note_issues)}")
