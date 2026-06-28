import json
import os

avatar = "参"

def d(did, text, score, triggered, note, conseq, next_id):
    return {
        "id": did, "text": text, "speaker": "我", "avatar": avatar,
        "score": score, "triggeredEvent": triggered,
        "historicalNote": note, "consequence": conseq, "nextActId": next_id
    }

# 读取已有的act
existing_acts = {}
for f in ['batch2.json', 'batch3.json', 'batch4.json', 'acts_part1.json', 'w9-world-wars-part2.json']:
    try:
        with open(f, 'r', encoding='utf-8') as fp:
            data = json.load(fp)
            acts_list = data if isinstance(data, list) else data.get('acts', [])
            for act in acts_list:
                if len(act.get('dialogues', [])) == 9:
                    title = act.get('title', '')
                    if any(kw in title for kw in ['萨拉热窝','大战','堑壕','凡尔登','索姆河','十月革命','美国参战','一战结束','凡尔赛','巴黎和会','国际联盟','经济大危机','法西斯','纳粹','绥靖','慕尼黑','二战','敦刻尔克','不列颠','苏德','珍珠港','斯大林格勒','诺曼底','原子弹','雅尔塔','联合国','铁幕','柏林','古巴导弹','殖民','冷战','干涉苏俄','静坐战争','法国陷落','抗战到底','太平洋战争','绥靖苦果','危机年代','和约余波']):
                        existing_acts[title] = act
    except:
        pass

print(f"Loaded {len(existing_acts)} existing acts by title")

# 定义完整的48幕结构（30主线 + 18分支）
act_structure = [
    # 一战部分（10主线 + 5分支）
    ("act-1", "萨拉热窝枪声", False, "1914年6月"),
    ("act-1b", "战争阴云密布", False, "1914年7月"),
    ("act-2", "大战爆发", False, "1914年8月"),
    ("act-2b", "和平希望破灭", False, "1914年10月"),
    ("act-3", "堑壕对峙", False, "1915年"),
    ("act-3b", "加里波利之败", False, "1915年"),
    ("act-4", "凡尔登战役", False, "1916年"),
    ("act-5", "索姆河战役", False, "1916年"),
    ("act-6", "美国参战", False, "1917年4月"),
    ("act-7", "十月革命", False, "1917年11月"),
    ("act-7b", "干涉苏俄", False, "1918年"),
    ("act-8", "一战结束", False, "1918年"),
    ("act-9", "巴黎和会", False, "1919年"),
    ("act-10", "凡尔赛和约", True, "1919年6月"),
    ("act-10b", "和约余波", False, "1920年"),
    
    # 战间期（6主线 + 4分支）
    ("act-11", "国际联盟", False, "1920年"),
    ("act-12", "经济大危机", False, "1929年"),
    ("act-12b", "危机年代", False, "1932年"),
    ("act-13", "法西斯崛起", False, "1933年"),
    ("act-13b", "纳粹上台", False, "1933年"),
    ("act-14", "绥靖政策", False, "1938年"),
    ("act-15", "慕尼黑协定", True, "1938年9月"),
    ("act-15b", "绥靖苦果", False, "1939年"),
    
    # 二战部分（9主线 + 5分支）
    ("act-16", "二战爆发", False, "1939年9月"),
    ("act-16b", "静坐战争", False, "1939年冬"),
    ("act-17", "敦刻尔克", False, "1940年5月"),
    ("act-17b", "法国陷落", False, "1940年"),
    ("act-18", "不列颠之战", False, "1940年"),
    ("act-18b", "抗战到底", False, "1940年"),
    ("act-19", "苏德战争", False, "1941年6月"),
    ("act-20", "珍珠港", False, "1941年12月"),
    ("act-20b", "太平洋战争", False, "1941年"),
    ("act-21", "斯大林格勒", False, "1942-1943年"),
    ("act-22", "诺曼底决策", True, "1944年6月"),
    ("act-23", "雅尔塔会议", False, "1945年2月"),
    ("act-24", "原子弹与终战", True, "1945年"),
    
    # 冷战部分（5主线 + 4分支）
    ("act-25", "联合国成立", False, "1945年10月"),
    ("act-25b", "战后秩序", False, "1945年"),
    ("act-26", "铁幕演说", False, "1946年"),
    ("act-26b", "冷战开始", False, "1947年"),
    ("act-27", "柏林危机", False, "1948年"),
    ("act-27b", "柏林墙", False, "1961年"),
    ("act-28", "古巴导弹危机", True, "1962年"),
    ("act-28b", "核战边缘", False, "1962年"),
    ("act-29", "殖民体系瓦解", False, "1960年代"),
    ("act-29b", "非殖民化", False, "1960年代"),
    ("act-30", "冷战终结", False, "1991年"),
]

print(f"Total planned acts: {len(act_structure)}")

# 检查哪些已有
existing_titles = set(existing_acts.keys())
planned_titles = set(title for _, title, _, _ in act_structure)
print(f"Existing: {len(existing_titles & planned_titles)} / {len(planned_titles)}")
print(f"Missing: {planned_titles - existing_titles}")

# 构建最终的acts列表
final_acts = []

for act_id, title, is_key, time_marker in act_structure:
    if title in existing_acts:
        # 使用已有的act，更新id和isKeyAct
        act = json.loads(json.dumps(existing_acts[title]))  # 深拷贝
        act['id'] = act_id
        act['isKeyAct'] = is_key
        act['timeMarker'] = time_marker
        final_acts.append(act)
        print(f"  Using existing: {act_id} - {title}")
    else:
        print(f"  NEED TO CREATE: {act_id} - {title}")

print(f"\nFinal acts so far: {len(final_acts)}")
print(f"Need to create: {len(act_structure) - len(final_acts)}")
