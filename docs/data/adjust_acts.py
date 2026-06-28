import json

input_path = r"c:\Users\2121\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a3ed37f1ac00f6e4879b1bd\chronos-app\docs\data\sw-ancient-civilizations.json"
output_path = input_path

# 要保留的分支幕（17个）
keep_branches = {
    "act-1b", "act-2b", "act-3b", "act-4b",
    "act-6b", "act-7b", "act-8b",
    "act-10b", "act-10c",
    "act-12b", "act-14b", "act-16b",
    "act-18b", "act-18c",
    "act-20b", "act-24b", "act-26b"
}

with open(input_path, "r", encoding="utf-8") as f:
    data = json.load(f)

# 筛选要保留的 act
new_acts = []
for a in data["acts"]:
    aid = a["id"]
    # 主线幕（act-N，N 是数字）都保留
    # 分支幕只保留在 keep_branches 中的
    is_main = False
    if aid.startswith("act-"):
        rest = aid[4:]
        if rest.isdigit():
            is_main = True
    if is_main or aid in keep_branches:
        new_acts.append(a)

# 更新 nextActId 指向，确保所有引用都有效
valid_ids = {a["id"] for a in new_acts}

# 对于被删除的分支，将指向它们的 nextActId 改为主线的下一幕
# 建立一个映射：被删除的分支 -> 对应的主线幕
# 简化处理：如果 nextActId 不在 valid_ids 中，就指向下一个主线幕

def get_next_main_act(current_id):
    """获取下一个主线幕的 id"""
    if current_id.startswith("act-"):
        rest = current_id[4:]
        # 提取数字部分
        num_str = ""
        for c in rest:
            if c.isdigit():
                num_str += c
            else:
                break
        if num_str:
            num = int(num_str)
            next_num = num + 1
            next_id = f"act-{next_num}"
            if next_id in valid_ids:
                return next_id
    return "act-30"  # 默认指向结局

for a in new_acts:
    for dlg in a["dialogues"]:
        if dlg["nextActId"] not in valid_ids:
            # 找到一个有效的 nextActId
            dlg["nextActId"] = get_next_main_act(a["id"])

data["acts"] = new_acts

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

# 验证
main_count = 0
branch_count = 0
for a in data["acts"]:
    aid = a["id"]
    if aid.startswith("act-") and aid[4:].isdigit():
        main_count += 1
    else:
        branch_count += 1

print(f"总 act 数: {len(data['acts'])}")
print(f"主线幕数: {main_count}")
print(f"分支幕数: {branch_count}")
print(f"关键幕数: {sum(1 for a in data['acts'] if a['isKeyAct'])}")
print(f"每个 act 的对话数: {set(len(a['dialogues']) for a in data['acts'])}")

# 检查所有 nextActId 是否有效
all_next_ids = set()
for a in data["acts"]:
    for dlg in a["dialogues"]:
        all_next_ids.add(dlg["nextActId"])

invalid_next = all_next_ids - valid_ids
if invalid_next:
    print(f"无效的 nextActId: {invalid_next}")
else:
    print("所有 nextActId 都有效")

# 验证 JSON 格式
with open(output_path, "r", encoding="utf-8") as f:
    json.load(f)
print("JSON 格式验证通过！")
