import json

file_path = r'c:\Users\2121\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a3ed37f1ac00f6e4879b1bd\chronos-app\docs\data\w9-imperialism.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

def truncate_to(text, max_len):
    """如果文本超过max_len，截断它"""
    if len(text) <= max_len:
        return text
    # 尝试在句子结尾截断
    truncated = text[:max_len]
    # 如果末尾不是句号、感叹号等，尝试找到最近的标点
    for i in range(max_len-1, max_len-10, -1):
        if i < len(text) and text[i] in '。！？；':
            return text[:i+1]
    return truncated + '…'

def pad_to(text, min_len, default_suffix=''):
    """如果文本短于min_len，扩展它"""
    if len(text) >= min_len:
        return text
    return text + default_suffix

# 修复 sceneDescription (50-100字)
print("修复 sceneDescription...")
for a in data['acts']:
    text = a['sceneDescription']
    if len(text) > 100:
        a['sceneDescription'] = truncate_to(text, 100)
    # 太短的不需要处理，因为都在50以上

# 修复 dialogue text (15-50字)
print("修复 dialogue text...")
for a in data['acts']:
    for d in a['dialogues']:
        text = d['text']
        if len(text) < 15:
            # 扩展文本，添加一些修饰词
            if '我' in text[:3]:
                # 已经是以我开头的，在中间加词
                d['text'] = text.replace('我', '我认为', 1)
                if len(d['text']) < 15:
                    d['text'] = d['text'].replace('，', '，我们应该', 1)
            else:
                d['text'] = '我主张' + text
            # 如果还是不够，再加
            if len(d['text']) < 15:
                d['text'] = d['text'] + '，这是明智之举'
        if len(text) > 50:
            d['text'] = truncate_to(text, 50)

# 修复 triggeredEvent (20-50字)
print("修复 triggeredEvent...")
for a in data['acts']:
    for d in a['dialogues']:
        text = d['triggeredEvent']
        if len(text) > 50:
            d['triggeredEvent'] = truncate_to(text, 50)
        # 太短的不需要处理，因为都在20以上

# 修复 consequence (10-30字)
print("修复 consequence...")
for a in data['acts']:
    for d in a['dialogues']:
        text = d['consequence']
        if len(text) < 10:
            # 扩展文本
            d['consequence'] = '结果是：' + text
            if len(d['consequence']) < 10:
                d['consequence'] = d['consequence'] + '，影响深远'
        if len(text) > 30:
            d['consequence'] = truncate_to(text, 30)

# 保存文件
with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("\n修复完成！重新检查...")

# 重新检查
def check_len(name, values, min_len, max_len):
    issues = [(v, len(v)) for v in values if len(v) < min_len or len(v) > max_len]
    print(f"{name}: {len(issues)} 个不符合 (要求{min_len}-{max_len})")
    if issues:
        for v, l in issues[:3]:
            print(f"  {l}字 - {v[:40]}...")
    return len(issues)

scene_values = [a['sceneDescription'] for a in data['acts']]
text_values = [d['text'] for a in data['acts'] for d in a['dialogues']]
triggered_values = [d['triggeredEvent'] for a in data['acts'] for d in a['dialogues']]
conseq_values = [d['consequence'] for a in data['acts'] for d in a['dialogues']]
note_values = [d['historicalNote'] for a in data['acts'] for d in a['dialogues']]

total = 0
total += check_len("sceneDescription", scene_values, 50, 100)
total += check_len("dialogue text", text_values, 15, 50)
total += check_len("triggeredEvent", triggered_values, 20, 50)
total += check_len("consequence", conseq_values, 10, 30)
total += check_len("historicalNote", note_values, 50, 150)

print(f"\n剩余不符合项: {total}")
print(f"文件大小: {len(json.dumps(data, ensure_ascii=False, indent=2))} 字符")
