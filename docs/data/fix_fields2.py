import json

file_path = r'c:\Users\2121\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a3ed37f1ac00f6e4879b1bd\chronos-app\docs\data\w9-imperialism.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

def force_truncate(text, max_len):
    """强制截断到max_len字符以内"""
    if len(text) <= max_len:
        return text
    # 直接截断，去掉最后1-2个字加省略号
    result = text[:max_len-1] + '…'
    return result

def force_pad(text, min_len, suffix=''):
    """确保文本至少min_len字符"""
    if len(text) >= min_len:
        return text
    return text + suffix * ((min_len - len(text) + len(suffix) - 1) // len(suffix))

# 修复 sceneDescription (50-100字)
print("修复 sceneDescription...")
fixed = 0
for a in data['acts']:
    text = a['sceneDescription']
    if len(text) > 100:
        a['sceneDescription'] = force_truncate(text, 100)
        fixed += 1
print(f"  修复了 {fixed} 个")

# 修复 triggeredEvent (20-50字)
print("修复 triggeredEvent...")
fixed = 0
for a in data['acts']:
    for d in a['dialogues']:
        text = d['triggeredEvent']
        if len(text) > 50:
            d['triggeredEvent'] = force_truncate(text, 50)
            fixed += 1
print(f"  修复了 {fixed} 个")

# 保存文件
with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("\n再次检查...")

# 检查
def check_len(name, values, min_len, max_len):
    issues = [(i, v, len(v)) for i, v in enumerate(values) if len(v) < min_len or len(v) > max_len]
    print(f"{name}: {len(issues)} 个不符合 (要求{min_len}-{max_len})")
    if issues:
        for i, v, l in issues[:5]:
            print(f"  [{i}] {l}字 - {v}")
    return len(issues)

scene_values = [a['sceneDescription'] for a in data['acts']]
text_values = [d['text'] for a in data['acts'] for d in a['dialogues']]
triggered_values = [d['triggeredEvent'] for a in data['acts'] for d in a['dialogues']]
conseq_values = [d['consequence'] for a in data['acts'] for d in a['dialogues']]
note_values = [d['historicalNote'] for a in data['acts'] for d in a['dialogues']]
title_values = [a['title'] for a in data['acts']]

total = 0
total += check_len("title", title_values, 2, 8)
total += check_len("sceneDescription", scene_values, 50, 100)
total += check_len("dialogue text", text_values, 15, 50)
total += check_len("triggeredEvent", triggered_values, 20, 50)
total += check_len("consequence", conseq_values, 10, 30)
total += check_len("historicalNote", note_values, 50, 150)

print(f"\n剩余不符合项: {total}")
print(f"总 act 数: {len(data['acts'])}")
print(f"关键幕数: {sum(1 for a in data['acts'] if a['isKeyAct'])}")
print(f"每幕对话数: {set(len(a['dialogues']) for a in data['acts'])}")
