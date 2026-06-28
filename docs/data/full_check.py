import json

with open('w9-contemporary.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

issues = []

for a in data['acts']:
    aid = a['id']
    
    if len(a['title']) < 2 or len(a['title']) > 8:
        issues.append(f"{aid}: title长度={len(a['title'])} (要求2-8)")
    
    if len(a['sceneDescription']) < 50 or len(a['sceneDescription']) > 100:
        issues.append(f"{aid}: sceneDescription长度={len(a['sceneDescription'])} (要求50-100)")
    
    if len(a['npcDialogues']) < 2 or len(a['npcDialogues']) > 3:
        issues.append(f"{aid}: npcDialogues数量={len(a['npcDialogues'])} (要求2-3)")
    
    for npc in a['npcDialogues']:
        if len(npc['text']) < 15 or len(npc['text']) > 40:
            issues.append(f"{aid}: NPC[{npc['speaker']}] text长度={len(npc['text'])} (要求15-40)")
        if len(npc['avatar']) != 1:
            issues.append(f"{aid}: NPC[{npc['speaker']}] avatar长度={len(npc['avatar'])} (要求1个汉字)")
    
    for d in a['dialogues']:
        did = d['id']
        if len(d['text']) < 15 or len(d['text']) > 50:
            issues.append(f"{aid}/{did}: text长度={len(d['text'])} (要求15-50)")
        if d['score'] < 60 or d['score'] > 100:
            issues.append(f"{aid}/{did}: score={d['score']} (要求60-100)")
        if len(d['triggeredEvent']) < 20 or len(d['triggeredEvent']) > 50:
            issues.append(f"{aid}/{did}: triggeredEvent长度={len(d['triggeredEvent'])} (要求20-50)")
        if len(d['historicalNote']) < 50 or len(d['historicalNote']) > 150:
            issues.append(f"{aid}/{did}: historicalNote长度={len(d['historicalNote'])} (要求50-150)")
        if len(d['consequence']) < 10 or len(d['consequence']) > 30:
            issues.append(f"{aid}/{did}: consequence长度={len(d['consequence'])} (要求10-30)")

print(f"共发现 {len(issues)} 个问题:")
for issue in issues:
    print(f"  - {issue}")
