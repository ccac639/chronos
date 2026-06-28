import json
import os

file_path = r'c:\Users\2121\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a3ed37f1ac00f6e4879b1bd\chronos-app\docs\data\sw-world-wars.json'

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"=== 文件基本信息 ===")
    print(f"eraId: {data.get('eraId')}")
    print(f"eraName: {data.get('eraName')}")
    print(f"playerRole: {data.get('playerRole')}")
    print(f"startYear: {data.get('startYear')}")
    print(f"endYear: {data.get('endYear')}")
    
    acts = data.get('acts', [])
    print(f"\n=== 幕信息 ===")
    print(f"幕总数: {len(acts)}")
    
    key_acts = [a for a in acts if a.get('isKeyAct')]
    print(f"关键幕数量: {len(key_acts)}")
    print(f"关键幕列表: {[a['id'] + ' - ' + a['title'] for a in key_acts]}")
    
    print(f"\n=== 幕 ID 列表 ===")
    act_ids = [a['id'] for a in acts]
    print(act_ids)
    
    print(f"\n=== 各幕对话数检查 ===")
    dialogue_issues = []
    for a in acts:
        d_count = len(a.get('dialogues', []))
        if d_count != 9:
            dialogue_issues.append(f"{a['id']}: {d_count}个对话")
    if dialogue_issues:
        print(f"对话数异常的幕: {len(dialogue_issues)}")
        for i in dialogue_issues:
            print(f"  {i}")
    else:
        print("所有幕都有 9 个对话 ✓")
    
    print(f"\n=== NPC 对话数检查 ===")
    npc_issues = []
    for a in acts:
        n_count = len(a.get('npcDialogues', []))
        if n_count < 2 or n_count > 3:
            npc_issues.append(f"{a['id']}: {n_count}个NPC对话")
    if npc_issues:
        print(f"NPC对话数异常的幕: {len(npc_issues)}")
        for i in npc_issues:
            print(f"  {i}")
    else:
        print("所有幕都有 2-3 个NPC对话 ✓")
    
    print(f"\n=== nextActId 引用检查 ===")
    act_id_set = set(act_ids)
    ref_issues = []
    for a in acts:
        for d in a.get('dialogues', []):
            nid = d.get('nextActId', '')
            if nid not in act_id_set:
                ref_issues.append(f"{a['id']} -> {d['id']}: nextActId={nid} 不存在")
    if ref_issues:
        print(f"悬空引用: {len(ref_issues)}")
        for i in ref_issues[:20]:
            print(f"  {i}")
    else:
        print("所有 nextActId 引用都有效 ✓")
    
    print(f"\n=== 分数区间检查 ===")
    score_issues = []
    for a in acts:
        scores = [d.get('score', 0) for d in a.get('dialogues', [])]
        if not scores:
            continue
        has_high = any(s >= 90 for s in scores)
        has_low = any(60 <= s <= 69 for s in scores)
        if not has_high or not has_low:
            score_issues.append(f"{a['id']}: 最高={max(scores)}, 最低={min(scores)}")
    if score_issues:
        print(f"分数区间不完整的幕: {len(score_issues)}")
        for i in score_issues[:10]:
            print(f"  {i}")
    else:
        print("所有幕的分数都覆盖了高低区间 ✓")
    
    print(f"\n=== 第一个幕 ===")
    first = acts[0] if acts else None
    if first:
        print(f"ID: {first['id']}")
        print(f"标题: {first['title']}")
        print(f"场景描述长度: {len(first['sceneDescription'])}字")
    
    print(f"\n=== 最后一个幕 ===")
    last = acts[-1] if acts else None
    if last:
        print(f"ID: {last['id']}")
        print(f"标题: {last['title']}")
        print(f"场景描述长度: {len(last['sceneDescription'])}字")
        
except json.JSONDecodeError as e:
    print(f"JSON 解析错误: {e}")
    print(f"文件大小: {os.path.getsize(file_path)} 字节")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    print(f"文件最后 500 字符:")
    print(content[-500:])
except Exception as e:
    print(f"错误: {e}")
    import traceback
    traceback.print_exc()
