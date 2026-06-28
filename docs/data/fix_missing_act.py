import json

path = r"c:\Users\2121\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a3ed37f1ac00f6e4879b1bd\chronos-app\docs\data\sw-exploration-reform.json"

avatar = "学"

def npc(speaker, text, av):
    return {"speaker": speaker, "text": text, "avatar": av}

def dlg(id, text, score, triggeredEvent, historicalNote, consequence, nextActId):
    return {
        "id": id,
        "text": text,
        "speaker": "我",
        "avatar": avatar,
        "score": score,
        "triggeredEvent": triggeredEvent,
        "historicalNote": historicalNote,
        "consequence": consequence,
        "nextActId": nextActId
    }

with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

act_3b = {
    "id": "act-3b",
    "title": "中途折返",
    "isKeyAct": False,
    "timeMarker": "1488年",
    "sceneDescription": "船队决定掉头返回，但在返航途中，你和迪亚士船长都心有不甘。难道这次航行就这样结束了吗？站在甲板上，望着广阔的大西洋，你陷入了沉思。",
    "npcDialogues": [
        npc("船长迪亚士", "就这样回去，我不甘心。我们已经走了这么远，也许再坚持一下就能成功。", "迪"),
        npc("大副", "可是船员们都吓坏了。再逼他们，恐怕会发生哗变。", "副")
    ],
    "dialogues": [
        dlg("d1", "船长，让我去和船员们谈谈。我相信他们会理解的。", 88,
            "你自告奋勇去说服船员。经过你的耐心解释和鼓舞，船员们终于同意继续前进。船队再次调转航向。",
            "历史上，迪亚士确实遭遇了船员的反对。但他通过说服和坚持，最终继续前进，发现了好望角。领导者的坚持和沟通能力至关重要。",
            "说服船员，重新出发", "act-4"),
        dlg("d2", "是啊，太危险了。还是安全第一，回去再说吧。", 62,
            "你也认为应该回去，迪亚士船长叹了口气，不再坚持。船队加速返回里斯本，这次航行以失败告终。",
            "如果迪亚士当时选择返航，好望角的发现可能会推迟很多年。历史往往就在一念之间。",
            "安全返航，错失机遇", "act-4"),
        dlg("d3", "我们可以先回去，准备更充分之后再来。", 70,
            "你建议做好准备再来，迪亚士觉得有道理。他们带着收集到的情报返回里斯本，为下次航行做准备。",
            "大航海时代的探险往往需要多次尝试。迪亚士的航行为后来达·伽马成功到达印度奠定了基础。",
            "暂避锋芒，以待来日", "act-4"),
        dlg("d4", "让我分析一下我们的航线和发现，也许回去也能有重大成果。", 78,
            "你整理了航行中收集的各种资料，绘制了详细的海图。虽然没有到达印度，但这些资料同样宝贵。",
            "每一次航海探险，无论是否达到最终目标，都能带来新的知识和发现。海图的改进、航海技术的提高，都是重要成果。",
            "整理资料，成果丰硕", "act-4"),
        dlg("d5", "我们可以沿着非洲海岸慢慢往回走，顺便考察一下沿途的情况。", 82,
            "你建议沿途考察，迪亚士同意了。船队沿着非洲海岸缓慢返航，收集了大量关于沿岸地理和民族的信息。",
            "葡萄牙航海家们在探险过程中，非常重视对沿途地理、民族、物产的考察。这些知识为后来的殖民和贸易奠定了基础。",
            "沿途考察，收获颇丰", "act-4"),
        dlg("d6", "要不我们偷偷继续前进？不要让船员们知道。", 65,
            "你建议瞒着船员继续前进，迪亚士有些动心。但这个计划太冒险了，最终还是没有实施。",
            "在大航海时代，哗变是经常发生的事情。船长必须在推进目标和维持船员秩序之间找到平衡。",
            "冒险计划，终未实施", "act-4"),
        dlg("d7", "回去之后，我要写一本书，记录我们的航行经历。", 75,
            "你决定写一本航行记，迪亚士非常支持。这本书后来激励了更多的人投身航海事业。",
            "大航海时代产生了许多著名的航行记，如马可·波罗行纪、哥伦布航行记等。这些作品激发了欧洲人对东方的向往。",
            "著书立说，激励后人", "act-4"),
        dlg("d8", "让我算一下，如果我们继续前进，还需要多少补给。", 80,
            "你仔细计算了补给情况，结论是如果节省一点，还能继续航行一段时间。迪亚士船长重新燃起了希望。",
            "精确的补给计算是远航成功的关键。航海家们需要根据航行距离、船员数量，精确计算所需的食物、淡水等物资。",
            "精确计算，重燃希望", "act-4"),
        dlg("d9", "这次失败不算什么。哥伦布那边不也一直在找赞助吗？我们总有一天会成功的。", 72,
            "你用哥伦布的故事激励迪亚士，迪亚士深受鼓舞。两人约定，下次一定要准备得更充分。",
            "克里斯托弗·哥伦布是意大利航海家，他相信地圆说，认为向西航行也能到达印度。他四处寻求赞助，最终得到了西班牙王室的支持。",
            "互相激励，来日方长", "act-4")
    ]
}

new_acts = []
inserted = False

for a in data["acts"]:
    new_acts.append(a)
    if a["id"] == "act-3" and not inserted:
        new_acts.append(act_3b)
        inserted = True

data["acts"] = new_acts

ids = set()
for a in data["acts"]:
    ids.add(a["id"])

key_count = 0
errors = 0
for a in data["acts"]:
    if a["isKeyAct"]:
        key_count += 1
        print(f"关键幕: {a['id']} - {a['title']}")
    for d in a["dialogues"]:
        if d["nextActId"] not in ids:
            print(f"错误: {a['id']} -> {d['nextActId']} 不存在")
            errors += 1

print(f"\n总幕数: {len(data['acts'])}")
print(f"关键幕数: {key_count}")
print(f"错误数: {errors}")

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"\n文件已保存！")
