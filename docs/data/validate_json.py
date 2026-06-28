import json
import sys

with open("w9-ancient-europe.json", "r", encoding="utf-8") as f:
    data = json.load(f)

errors = []
warnings = []

# 1. 检查顶层字段
print("=" * 60)
print("顶层结构检查")
print("=" * 60)
required_top = ["eraId", "eraName", "playerRole", "startYear", "endYear", "acts"]
for field in required_top:
    if field not in data:
        errors.append(f"缺少顶层字段: {field}")
    else:
        print(f"  ✓ {field}: {data[field]}")

# 2. 检查acts数量
acts = data["acts"]
act_count = len(acts)
print(f"\n幕总数: {act_count}")
if act_count < 45 or act_count > 50:
    errors.append(f"幕数量 {act_count} 不在 45-50 范围内")
else:
    print(f"  ✓ 幕数量在 45-50 范围内")

# 3. 检查每个act的结构
print("\n" + "=" * 60)
print("每幕结构检查")
print("=" * 60)

act_ids = set()
key_act_count = 0

for act in acts:
    aid = act.get("id", "未知")
    if aid in act_ids:
        errors.append(f"重复的act id: {aid}")
    act_ids.add(aid)
    
    # 检查必要字段
    required_act = ["id", "title", "isKeyAct", "timeMarker", "sceneDescription", "npcDialogues", "dialogues"]
    for field in required_act:
        if field not in act:
            errors.append(f"幕 {aid} 缺少字段: {field}")
    
    # 检查isKeyAct
    if act.get("isKeyAct"):
        key_act_count += 1
    
    # 检查对话选项数量
    dialogues = act.get("dialogues", [])
    if len(dialogues) != 9:
        errors.append(f"幕 {aid} 对话选项数量为 {len(dialogues)}，应为 9")
    
    # 检查每个对话的结构
    for d in dialogues:
        did = d.get("id", "?")
        required_dlg = ["id", "text", "speaker", "avatar", "score", "triggeredEvent", "historicalNote", "consequence", "nextActId"]
        for field in required_dlg:
            if field not in d:
                errors.append(f"幕 {aid} 对话 {did} 缺少字段: {field}")
        
        # 检查分数范围
        score = d.get("score", 0)
        if score < 60 or score > 100:
            errors.append(f"幕 {aid} 对话 {did} 分数 {score} 不在 60-100 范围内")

# 4. 检查关键幕数量
print(f"\n关键幕数量: {key_act_count}")
if key_act_count != 4:
    errors.append(f"关键幕数量为 {key_act_count}，应为 4")
else:
    print(f"  ✓ 关键幕数量为 4")

# 列出关键幕
key_acts = [act for act in acts if act["isKeyAct"]]
print("\n关键幕列表:")
for ka in key_acts:
    print(f"  - {ka['id']}: {ka['title']} ({ka['timeMarker']})")

# 5. 检查nextActId引用有效性
print("\n" + "=" * 60)
print("nextActId 引用检查")
print("=" * 60)

all_next_ids = set()
for act in acts:
    for d in act.get("dialogues", []):
        nid = d.get("nextActId")
        if nid:
            all_next_ids.add(nid)

invalid_refs = all_next_ids - act_ids
if invalid_refs:
    errors.append(f"无效的 nextActId 引用: {invalid_refs}")
else:
    print(f"  ✓ 所有 nextActId 引用有效")

# 6. 统计主线和分支
print("\n" + "=" * 60)
print("主线/分支统计")
print("=" * 60)

main_acts = [a for a in acts if not "b" in a["id"]]
branch_acts = [a for a in acts if "b" in a["id"]]
print(f"主线幕数: {len(main_acts)}")
print(f"分支幕数: {len(branch_acts)}")

if len(main_acts) != 30:
    warnings.append(f"主线幕数为 {len(main_acts)}，期望约30")
if len(branch_acts) < 15 or len(branch_acts) > 20:
    warnings.append(f"分支幕数为 {len(branch_acts)}，期望15-20")

# 7. 列出所有幕
print("\n" + "=" * 60)
print("所有幕列表")
print("=" * 60)
for act in acts:
    key_mark = " ★" if act["isKeyAct"] else ""
    branch_mark = " (分支)" if "b" in act["id"] else " (主线)"
    print(f"  {act['id']}: {act['title']} [{act['timeMarker']}]{key_mark}{branch_mark}")

# 8. 分数分布统计
print("\n" + "=" * 60)
print("分数分布统计")
print("=" * 60)
all_scores = []
for act in acts:
    for d in act.get("dialogues", []):
        all_scores.append(d.get("score", 0))

if all_scores:
    print(f"  最高分: {max(all_scores)}")
    print(f"  最低分: {min(all_scores)}")
    print(f"  平均分: {sum(all_scores)/len(all_scores):.1f}")
    
    # 按区间统计
    ranges = [(90, 100, "90-100"), (80, 89, "80-89"), (70, 79, "70-79"), (60, 69, "60-69")]
    for low, high, label in ranges:
        count = sum(1 for s in all_scores if low <= s <= high)
        print(f"  {label}分: {count}个 ({count/len(all_scores)*100:.1f}%)")

# 总结
print("\n" + "=" * 60)
print("验证总结")
print("=" * 60)
if errors:
    print(f"❌ 发现 {len(errors)} 个错误:")
    for e in errors:
        print(f"  - {e}")
else:
    print("✅ 未发现错误")

if warnings:
    print(f"\n⚠️  {len(warnings)} 个警告:")
    for w in warnings:
        print(f"  - {w}")

if not errors and not warnings:
    print("\n🎉 所有检查通过！")

sys.exit(0 if not errors else 1)
