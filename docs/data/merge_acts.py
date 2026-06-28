import json

# 读取原始文件
with open('sw-medieval-asia-africa.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Original acts: {len(data['acts'])}")
print("Original act IDs:", [a['id'] for a in data['acts']])

# 读取新生成的 act 批次
new_acts = []

batch_files = [
    'acts_12_14.json',
    'acts_14b_20.json',
    'acts_21_25.json',
    'acts_26_30.json'
]

for f in batch_files:
    try:
        with open(f, 'r', encoding='utf-8') as fp:
            batch = json.load(fp)
            print(f"Loaded {len(batch)} acts from {f}")
            new_acts.extend(batch)
    except Exception as e:
        print(f"Error loading {f}: {e}")

print(f"\nTotal new acts: {len(new_acts)}")
print("New act IDs:", [a['id'] for a in new_acts])

# 合并所有 act，去重（以 id 为准）
existing_ids = {a['id'] for a in data['acts']}
added_count = 0

for act in new_acts:
    if act['id'] not in existing_ids:
        data['acts'].append(act)
        existing_ids.add(act['id'])
        added_count += 1
    else:
        print(f"Duplicate act skipped: {act['id']}")

print(f"\nAdded {added_count} new acts")
print(f"Total acts now: {len(data['acts'])}")

# 按照 id 排序（先按数字，再按字母）
def sort_key(act_id):
    parts = act_id.replace('act-', '').split('b')
    main = int(parts[0])
    branch = 0 if len(parts) == 1 else ord(parts[1])
    return (main, branch)

data['acts'].sort(key=lambda a: sort_key(a['id']))

print("\nAll act IDs:")
for i, act in enumerate(data['acts']):
    key_act = " [KEY]" if act['isKeyAct'] else ""
    print(f"  {i+1}. {act['id']} - {act['title']}{key_act}")

key_acts = [a for a in data['acts'] if a['isKeyAct']]
print(f"\nTotal key acts: {len(key_acts)}")
print("Key acts:", [(a['id'], a['title']) for a in key_acts])

# 保存
with open('sw-medieval-asia-africa.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("\nSaved to sw-medieval-asia-africa.json")
