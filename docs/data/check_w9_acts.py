import json

# 正确的两次世界大战与冷战的act文件
files_with_w9 = ['batch2.json', 'batch3.json', 'batch4.json', 'remaining_acts.json', 'acts_part1.json', 'w9-world-wars-part2.json']

all_acts = {}

for f in files_with_w9:
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
                
                # 检查是否是两次世界大战与冷战相关的act
                w9_keywords = ['萨拉热窝', '大战', '堑壕', '凡尔登', '索姆河', '十月革命', '美国参战', 
                               '一战结束', '凡尔赛', '巴黎和会', '国际联盟', '经济大危机', 
                               '法西斯', '纳粹', '绥靖', '慕尼黑', '二战', '敦刻尔克', 
                               '不列颠', '苏德', '珍珠港', '斯大林格勒', '诺曼底', '原子弹',
                               '雅尔塔', '联合国', '铁幕', '柏林', '古巴导弹', '殖民',
                               '冷战']
                
                is_w9 = any(kw in title for kw in w9_keywords)
                
                # 或者检查ID是否在合理范围内（act-1到act-30的主线和分支）
                if aid not in all_acts and is_w9:
                    all_acts[aid] = act
                    print('Added: ' + aid + ' - ' + title + ' from ' + f)
    except Exception as e:
        print(f + ': error - ' + str(e))

print('\nTotal W9 acts: ' + str(len(all_acts)))

print('\nAll W9 act IDs sorted:')
main_acts = []
branch_acts = []
for aid in sorted(all_acts.keys()):
    if 'b' in aid or 'c' in aid:
        branch_acts.append(aid)
    else:
        main_acts.append(aid)

print('\nMain acts (' + str(len(main_acts)) + '):')
for aid in main_acts:
    act = all_acts[aid]
    key_str = ' [KEY]' if act.get('isKeyAct') else ''
    print('  ' + aid + ': ' + act.get('title', '') + key_str)

print('\nBranch acts (' + str(len(branch_acts)) + '):')
for aid in branch_acts:
    act = all_acts[aid]
    print('  ' + aid + ': ' + act.get('title', ''))

# 检查哪些主线act缺失
print('\nMissing main acts (1-30):')
for i in range(1, 31):
    aid = 'act-' + str(i)
    if aid not in all_acts:
        print('  ' + aid)

# 检查每个act的对话数量
print('\nDialogue count check:')
for aid in sorted(all_acts.keys()):
    act = all_acts[aid]
    d_count = len(act.get('dialogues', []))
    if d_count != 9:
        print('  ' + aid + ': ' + str(d_count) + ' dialogues (WRONG)')
