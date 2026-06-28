import json

# 所有可能包含w9 act的文件
files = [
    'batch2.json', 'batch3.json', 'batch4.json', 
    'acts_part1.json', 'w9-world-wars-part2.json',
    'remaining_acts.json',
    'group1.json', 'group2.json', 'group3.json', 'group4.json',
    'group5.json', 'group6.json', 'group7.json', 'group8.json'
]

all_acts = {}

for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as fp:
            d = json.load(fp)
            acts_list = []
            if isinstance(d, list):
                acts_list = d
            elif isinstance(d, dict) and 'acts' in d:
                acts_list = d['acts']
            
            for act in acts_list:
                aid = act.get('id', 'unknown')
                title = act.get('title', '')
                
                # 检查是否是两次世界大战相关的
                w9_keywords = ['萨拉热窝', '大战', '堑壕', '凡尔登', '索姆河', '十月革命', 
                               '美国参战', '一战结束', '凡尔赛', '巴黎和会', '国际联盟', 
                               '经济大危机', '法西斯', '纳粹', '绥靖', '慕尼黑', 
                               '二战', '敦刻尔克', '不列颠', '苏德', '珍珠港', '斯大林格勒',
                               '诺曼底', '原子弹', '雅尔塔', '联合国', '铁幕', '柏林', 
                               '古巴导弹', '殖民', '冷战', '干涉苏俄', '静坐战争',
                               '法国陷落', '抗战到底', '太平洋战争', '绥靖苦果', '危机年代',
                               '和约余波', '非殖民化', '核战边缘', '战后秩序', '霸王行动']
                
                is_w9 = any(kw in title for kw in w9_keywords)
                has_9_dialogs = len(act.get('dialogues', [])) == 9
                
                if is_w9 and has_9_dialogs:
                    if aid not in all_acts:
                        all_acts[aid] = act
                        print('Added: ' + aid + ' - ' + title + ' from ' + f)
    except Exception as e:
        pass

print('\n=== 合并结果 ===')
print('Total unique W9 acts: ' + str(len(all_acts)))

# 分类
main_acts = []
branch_acts = []
for aid in sorted(all_acts.keys()):
    # 检查是否是主线act（act-N，N为数字）
    import re
    if re.match(r'^act-\d+$', aid):
        main_acts.append(aid)
    else:
        branch_acts.append(aid)

print('\n主线 act (' + str(len(main_acts)) + '):')
for aid in main_acts:
    act = all_acts[aid]
    key_str = ' [KEY]' if act.get('isKeyAct') else ''
    print('  ' + aid + ': ' + act.get('title', '') + key_str)

print('\n分支 act (' + str(len(branch_acts)) + '):')
for aid in branch_acts:
    act = all_acts[aid]
    print('  ' + aid + ': ' + act.get('title', ''))

# 检查缺失的主线act
print('\n缺失的主线 act (1-30):')
missing_main = []
for i in range(1, 31):
    aid = 'act-' + str(i)
    if aid not in all_acts:
        missing_main.append(aid)
        print('  ' + aid)

print('\n缺失主线数量: ' + str(len(missing_main)))

# 检查关键幕数量
key_count = sum(1 for a in all_acts.values() if a.get('isKeyAct'))
print('\n关键幕数量: ' + str(key_count))

# 保存合并后的acts
with open('merged_w9_acts.json', 'w', encoding='utf-8') as f:
    json.dump(all_acts, f, ensure_ascii=False, indent=2)

print('\n已保存到 merged_w9_acts.json')
