import json

with open('sw-medieval-asia-africa.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 添加缺失的顶层字段
data['description'] = "从阿拉伯帝国的兴起到奥斯曼帝国的崛起，从日本大化改新到幕府时代，从马里帝国的黄金贸易到美洲三大文明的辉煌。你将扮演一位阿拉伯帝国的商队领袖，穿越中古时期的亚非大地，见证各大文明的兴衰与交流。"
data['backgroundStory'] = "你出生在麦加的一个商人世家，从小就跟随商队行走在阿拉伯半岛的沙漠中。伊斯兰教的兴起改变了你的命运，你见证了阿拉伯帝国从一个部落联盟发展成为横跨三大洲的庞大帝国。作为商队领袖，你的足迹遍布从大西洋到太平洋的广大区域，你是文明交流的使者，也是历史的见证者。"

print("已添加 description 和 backgroundStory")

# 修复一些分支指向问题
# 让 act-13 有一个选项指向 act-13b（蒙古西征）
for act in data['acts']:
    if act['id'] == 'act-13':
        # 找到一个低分对话，把它的 nextActId 改为 act-13b
        for dlg in act['dialogues']:
            if dlg['id'] == 'd5':
                dlg['nextActId'] = 'act-13b'
                print(f"已修改 {act['id']}.{dlg['id']} 的 nextActId 为 act-13b")
                break
    
    # 让 act-20 有一个选项指向 act-20b（奥斯曼兴起）
    if act['id'] == 'act-20':
        for dlg in act['dialogues']:
            if dlg['id'] == 'd5':
                dlg['nextActId'] = 'act-20b'
                print(f"已修改 {act['id']}.{dlg['id']} 的 nextActId 为 act-20b")
                break
    
    # 让 act-25 有一个选项指向 act-25b（东非城邦）
    if act['id'] == 'act-25':
        for dlg in act['dialogues']:
            if dlg['id'] == 'd5':
                dlg['nextActId'] = 'act-25b'
                print(f"已修改 {act['id']}.{dlg['id']} 的 nextActId 为 act-25b")
                break
    
    # 修复 act-24b 的出口，让它指向 act-25 而不是自己
    if act['id'] == 'act-24b':
        for dlg in act['dialogues']:
            if dlg['nextActId'] == 'act-24':
                dlg['nextActId'] = 'act-25'
        print(f"已修复 {act['id']} 的出口指向 act-25")
    
    # 修复 act-29b 的出口，让它指向 act-30 而不是自己
    if act['id'] == 'act-29b':
        for dlg in act['dialogues']:
            if dlg['nextActId'] == 'act-29':
                dlg['nextActId'] = 'act-30'
        print(f"已修复 {act['id']} 的出口指向 act-30")
    
    # 修复 act-30b 的出口，让它指向结束而不是自己
    if act['id'] == 'act-30b':
        for dlg in act['dialogues']:
            if dlg['nextActId'] == 'act-30':
                dlg['nextActId'] = ''
        print(f"已修复 {act['id']} 的出口指向结束")

# 保存
with open('sw-medieval-asia-africa.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("\n修复完成，已保存文件。")
