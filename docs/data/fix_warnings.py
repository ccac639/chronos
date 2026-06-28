import json

path = r"c:\Users\2121\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a3ed37f1ac00f6e4879b1bd\chronos-app\docs\data\sw-exploration-reform.json"

with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

avatar = "学"

def fix_act3():
    for a in data["acts"]:
        if a["id"] == "act-3":
            for d in a["dialogues"]:
                if d["id"] == "d1":
                    d["consequence"] = "发现好望角，名垂青史"
                elif d["id"] == "d2":
                    d["consequence"] = "中途返航，错失良机"
                elif d["id"] == "d3":
                    d["consequence"] = "靠岸补给，休整队伍"
                elif d["id"] == "d4":
                    d["consequence"] = "天文导航，重燃希望"
                elif d["id"] == "d5":
                    d["consequence"] = "祈祷求安，进展甚微"
                    d["historicalNote"] = "在科学不发达的时代，人们往往将自然现象归因于神的意志。这种观念在一定程度上阻碍了探险事业的发展和进步。"
                elif d["id"] == "d6":
                    d["consequence"] = "顺势而为，顺利前行"
                elif d["id"] == "d7":
                    d["consequence"] = "科学记录，积累知识"
                elif d["id"] == "d8":
                    d["consequence"] = "立碑为证，胜利返航"
                elif d["id"] == "d9":
                    d["consequence"] = "鼓舞士气，共度难关"
            print("已修复 act-3")
            break

def fix_act15():
    for a in data["acts"]:
        if a["id"] == "act-15":
            for d in a["dialogues"]:
                if len(d["consequence"]) < 10:
                    pass
            print("已检查 act-15")
            break

def fix_score_distribution():
    for a in data["acts"]:
        if a["id"] == "act-18":
            scores = sorted([d["score"] for d in a["dialogues"]])
            min_score = min(scores)
            if min_score > 69:
                min_dlg = min(a["dialogues"], key=lambda x: x["score"])
                min_dlg["score"] = 65
                min_dlg["text"] = "女王应该加强专制统治，镇压那些清教徒反对派。"
                min_dlg["triggeredEvent"] = "你建议加强专制，镇压清教徒。伊丽莎白女王虽然采纳了部分建议，但也埋下了宗教矛盾的种子。"
                min_dlg["historicalNote"] = "伊丽莎白一世时期，英国的宗教矛盾依然存在。清教徒要求进一步改革国教会，清除天主教残余。这一矛盾后来引发了英国资产阶级革命。"
                min_dlg["consequence"] = "加强专制，矛盾加深"
                print(f"已修复 act-18 分数分布，最低分改为 65")
        
        if a["id"] == "act-30":
            scores = sorted([d["score"] for d in a["dialogues"]])
            min_score = min(scores)
            if min_score > 69:
                min_dlg = min(a["dialogues"], key=lambda x: x["score"])
                min_dlg["score"] = 62
                min_dlg["text"] = "这个时代太动荡了。还是过去的中世纪更稳定、更美好。"
                min_dlg["triggeredEvent"] = "你怀念中世纪的稳定，对新时代的变革感到不安。但历史的车轮滚滚向前，谁也无法阻挡。"
                min_dlg["historicalNote"] = "近代初期是一个剧烈变革的时代。很多人对旧时代怀有留恋，对新时代感到迷茫和恐惧。但历史的进步是不可阻挡的。"
                min_dlg["consequence"] = "怀念过去，抗拒变革"
                print(f"已修复 act-30 分数分布，最低分改为 62")

fix_act3()
fix_score_distribution()

errors = 0
warnings = 0
for a in data["acts"]:
    for d in a["dialogues"]:
        if d["score"] < 60 or d["score"] > 100:
            errors += 1
        if len(d["consequence"]) < 10 or len(d["consequence"]) > 30:
            warnings += 1
        if len(d["historicalNote"]) < 50 or len(d["historicalNote"]) > 150:
            warnings += 1

print(f"\n错误数: {errors}")
print(f"警告数(剩余): {warnings}")

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("\n文件已保存！")
