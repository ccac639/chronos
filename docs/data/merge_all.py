import json

# 读取所有组的数据
all_acts = []
seen_ids = set()

# 读取 group1 - group8
for i in range(1, 9):
    filename = f"group{i}.json"
    with open(filename, "r", encoding="utf-8") as f:
        group_acts = json.load(f)
        
        # 去重
        new_acts = []
        for act in group_acts:
            if act["id"] not in seen_ids:
                new_acts.append(act)
                seen_ids.add(act["id"])
            else:
                print(f"  跳过重复: {act['id']}")
        
        all_acts.extend(new_acts)
        print(f"{filename}: {len(new_acts)} 幕 (新增)")

print(f"\n总计: {len(all_acts)} 幕")

# 统计关键幕
key_acts = [act for act in all_acts if act["isKeyAct"]]
print(f"关键幕: {len(key_acts)} 个")
for act in key_acts:
    print(f"  - {act['id']}: {act['title']}")

# 检查每个幕的对话选项数量
dialogue_errors = []
for act in all_acts:
    if len(act["dialogues"]) != 9:
        dialogue_errors.append((act["id"], len(act["dialogues"])))

if dialogue_errors:
    print(f"\n警告: 以下幕的对话选项数量不是 9 个:")
    for act_id, count in dialogue_errors:
        print(f"  - {act_id}: {count} 个")
else:
    print("\n所有幕都有 9 个对话选项 ✓")

# 检查分数范围
score_errors = []
for act in all_acts:
    for d in act["dialogues"]:
        if d["score"] < 60 or d["score"] > 100:
            score_errors.append((act["id"], d["id"], d["score"]))

if score_errors:
    print(f"\n警告: 以下对话选项分数不在 60-100 范围内:")
    for act_id, d_id, score in score_errors:
        print(f"  - {act_id}/{d_id}: {score}")
else:
    print("所有对话选项分数都在 60-100 范围内 ✓")

# 检查 nextActId 引用
act_ids = {act["id"] for act in all_acts}
next_act_errors = []
for act in all_acts:
    for d in act["dialogues"]:
        if d["nextActId"] not in act_ids:
            next_act_errors.append((act["id"], d["id"], d["nextActId"]))

if next_act_errors:
    print(f"\n警告: 以下 nextActId 引用无效:")
    for act_id, d_id, next_id in next_act_errors:
        print(f"  - {act_id}/{d_id} -> {next_id}")
else:
    print("所有 nextActId 引用都有效 ✓")

# 构建最终数据
final_data = {
    "eraId": "w9-industrial-revolution",
    "eraName": "工业革命与马克思主义",
    "playerRole": "英国曼彻斯特的工厂主",
    "startYear": "1760年代",
    "endYear": "1871年",
    "acts": all_acts
}

# 保存最终文件
output_path = "w9-industrial-revolution.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(final_data, f, ensure_ascii=False, indent=2)

print(f"\n最终文件已保存到: {output_path}")
print(f"总幕数: {len(all_acts)}")
