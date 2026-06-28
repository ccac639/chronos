import json

with open("w9-world-wars.json", "r", encoding="utf-8") as f:
    data = json.load(f)

new_acts = [
    {
      "id": "act-2",
      "title": "大战爆发",
      "isKeyAct": false,
      "timeMarker": "1914年8月",
      "sceneDescription": "1914年8月，第一次世界大战全面爆发。德国按照施里芬计划，取道比利时进攻法国，势如破竹。英国远征军已抵达法国前线。作为参谋官，你面临着如何配合法军阻挡德军推进的决策。",
      "npcDialogues": [
        {"speaker": "远征军司令弗伦奇", "text": "德军进展太快，法军在撤退。我们的兵力太少，是否也要后撤？", "avatar": "弗"},
        {"speaker": "法军总司令霞飞", "text": "请求英军务必守住防线，否则巴黎危在旦夕！", "avatar": "霞"}
      ],
      "dialogues": [
        {"id": "d1", "text": "全力配合法军组织反攻，在马恩河一线挡住德军。", "speaker": "我", "avatar": "参", "score": 92, "triggeredEvent": "你力主配合法军反攻。1914年9月，马恩河战役爆发，英法联军成功挡住德军进攻，德国速战速决的计划破产。", "historicalNote": "1914年9月5-12日的马恩河战役是一战的转折点。英法联军在马恩河一线击退德军，德军被迫后撤，施里芬计划破产。此后西线进入阵地战阶段。", "consequence": "马恩河奇迹", "nextActId": "act-3"},
        {"id": "d2", "text": "英军应保存实力，有序撤退到塞纳河以南再图反攻。", "speaker": "我", "avatar": "参", "score": 68, "triggeredEvent": "你建议英军后撤保存实力。弗伦奇一度下令撤退，但在法国政府强烈抗议和英国政府压力下，英军最终还是参加了马恩河反攻。", "historicalNote": "一战初期英军司令弗伦奇爵士曾因伤亡惨重而计划将英军撤至塞纳河以南，甚至撤回英国。但在法国政府和英国内阁的压力下，英军最终参加了马恩河战役。", "consequence": "撤退后被迫反攻", "nextActId": "act-3"},
        {"id": "d3", "text": "急调国内预备队增援，同时组织铁路运输保障补给。", "speaker": "我", "avatar": "参", "score": 85, "triggeredEvent": "你建议加紧增援和补给。英国通过英吉利海峡快速运送援军和物资，远征军实力不断增强。", "historicalNote": "一战中英吉利海峡航线是英国远征军的生命线。英国海军掌握制海权，确保了人员和物资的安全运输。整个战争期间约有数百万人通过海峡前往欧洲大陆。", "consequence": "补给线畅通", "nextActId": "act-3"},
        {"id": "d4", "text": "在侧翼发动进攻，威胁德军补给线，减轻正面压力。", "speaker": "我", "avatar": "参", "score": 88, "triggeredEvent": "你建议侧翼出击威胁德军补给线。这一思路后来发展为奔向大海行动，双方试图包抄对方侧翼，最终战线延伸到了北海沿岸。", "historicalNote": "1914年9-10月，双方沿埃纳河向西北方向延伸战线，试图包抄对方侧翼，史称奔向大海。最终战线从瑞士边境一直延伸到北海，形成了长达700公里的堑壕线。", "consequence": "奔向大海", "nextActId": "act-3"},
        {"id": "d5", "text": "用海军炮击德军沿海阵地，从海上支援陆上作战。", "speaker": "我", "avatar": "参", "score": 75, "triggeredEvent": "你建议从海上支援。皇家海军对比利时沿海的德军阵地进行了炮击，一定程度上支援了陆军作战。", "historicalNote": "一战中英国海军曾多次炮击比利时和法国沿海的德军阵地。在安特卫普保卫战和佛兰德战役中，海军舰炮火力都提供了支援。", "consequence": "海上火力支援", "nextActId": "act-3"},
        {"id": "d6", "text": "立即在达达尼尔海峡开辟新战场，迫使土耳其投降。", "speaker": "我", "avatar": "参", "score": 70, "triggeredEvent": "你建议开辟新战场。这一想法后来发展为加里波利战役，但此时英国的注意力仍集中在西线。", "historicalNote": "1915年英法联军发动加里波利战役，试图打通达达尼尔海峡、攻占君士坦丁堡。但战役最终失败，协约国伤亡约25万人。", "consequence": "新战场计划酝酿", "nextActId": "act-3"},
        {"id": "d7", "text": "加强对德宣传战，瓦解德军士气，策动国内反战运动。", "speaker": "我", "avatar": "参", "score": 65, "triggeredEvent": "你建议加强宣传战。英国开始通过传单和广播对德军进行宣传，但短期内效果有限。", "historicalNote": "一战中双方都开展了大规模宣传战。英国在宣传方面尤其擅长，通过媒体塑造德国的野蛮人形象，争取国内外舆论支持。", "consequence": "宣传战启动", "nextActId": "act-3"},
        {"id": "d8", "text": "向德国发出和平倡议，趁战争还未扩大化尽快结束。", "speaker": "我", "avatar": "参", "score": 60, "triggeredEvent": "你建议尽快议和。然而此时双方都认为自己能获胜，和平倡议无人理睬，战争反而不断升级。", "historicalNote": "一战初期双方都坚信自己能速胜。德国计划6周内击败法国，英国也认为战争会在圣诞节前结束。没有人预料到战争会持续四年多。", "consequence": "和平倡议遭拒", "nextActId": "act-2b"},
        {"id": "d9", "text": "推动意大利倒向协约国，从南线牵制奥匈帝国。", "speaker": "我", "avatar": "参", "score": 80, "triggeredEvent": "你建议争取意大利。英国开始与意大利秘密谈判，承诺战后分给其奥匈帝国的领土。1915年意大利终于倒向协约国。", "historicalNote": "意大利原本是同盟国成员，但战争爆发后宣布中立。1915年4月，意大利与协约国签订《伦敦条约》，以获得奥匈领土为条件加入协约国作战。", "consequence": "意大利谈判启动", "nextActId": "act-3"}
      ]
    },
    {
      "id": "act-2b",
      "title": "和平希望破灭",
      "isKeyAct": false,
      "timeMarker": "1914年10月",
      "sceneDescription": "和平倡议遭到双方拒绝，战争正在向长期化发展。西线已经形成堑壕对峙的局面，双方都在为接下来的大战做准备。英国必须调整策略，应对这场持久战。",
      "npcDialogues": [
        {"speaker": "战争大臣基奇纳", "text": "这场战争不会很快结束，我们需要一支百万人的大军，做好打三年的准备。", "avatar": "基"},
        {"speaker": "财政大臣劳合·乔治", "text": "战争开销惊人，我们必须确保经济和财政能支撑下去。", "avatar": "劳"}
      ],
      "dialogues": [
        {"id": "d1", "text": "全力支持基奇纳的扩军计划，组建百万大军准备持久战。", "speaker": "我", "avatar": "参", "score": 90, "triggeredEvent": "你全力支持扩军计划。基奇纳的募兵运动取得巨大成功，短短数月就有上百万志愿者参军。", "historicalNote": "1914年8月，战争大臣基奇纳伯爵发起大规模志愿募兵运动，号召组建一支百万大军。到1915年底，已有约250万人志愿参军。1916年英国开始实行征兵制。", "consequence": "百万大军组建", "nextActId": "act-3"},
        {"id": "d2", "text": "转为战时经济体制，将工业全面转入军工生产。", "speaker": "我", "avatar": "参", "score": 88, "triggeredEvent": "你建议转入战时经济。英国开始建立军需部，工业生产转向战争轨道，炮弹、枪支、飞机的产量大幅提升。", "historicalNote": "一战中英国逐步建立起战时经济体制。1915年成立军需部，由劳合·乔治任大臣，统一管理军工生产。到战争后期，英国军工产能远超德国。", "consequence": "战时经济建立", "nextActId": "act-3"},
        {"id": "d3", "text": "继续坚持以海制陆战略，主要靠封锁和海军取胜。", "speaker": "我", "avatar": "参", "score": 72, "triggeredEvent": "你坚持以海制陆。皇家海军继续加强封锁，但陆军方面的投入不足导致西线进展缓慢。", "historicalNote": "英国传统军事战略是依靠海军优势，陆军保持小规模。但一战的堑壕战需要大量陆军，英国不得不转变战略，大规模扩充陆军。", "consequence": "战略重心偏海", "nextActId": "act-3"},
        {"id": "d4", "text": "在东线、南线开辟新战场，避免在西线消耗。", "speaker": "我", "avatar": "参", "score": 70, "triggeredEvent": "你建议开辟新战场。这一思路导致了后来的加里波利战役和美索不达米亚战役，但效果并不理想。", "historicalNote": "一战中英国确实尝试了多条战线：西线、加里波利、美索不达米亚、巴勒斯坦、东非等。但西线始终是主战场，其他战线未能改变整体战局。", "consequence": "多线作战酝酿", "nextActId": "act-3"},
        {"id": "d5", "text": "加强与法国的协调，建立统一的联军指挥机制。", "speaker": "我", "avatar": "参", "score": 85, "triggeredEvent": "你建议建立统一指挥。虽然初期双方协调不畅，但后来逐步建立了更好的合作机制，为战争后期的统一指挥奠定了基础。", "historicalNote": "一战初期协约国缺乏统一指挥，各自为战。直到1917年法国的尼韦勒攻势失败后，才逐步建立起以福煦为统帅的统一指挥体系。", "consequence": "协调机制改善", "nextActId": "act-3"},
        {"id": "d6", "text": "用潜艇和水雷反击德国的潜艇战，保护海上交通线。", "speaker": "我", "avatar": "参", "score": 78, "triggeredEvent": "你建议加强反潜作战。英国海军开始发展护航制度和反潜技术，逐步扭转了潜艇战的不利局面。", "historicalNote": "一战中德国潜艇对英国海上运输线构成严重威胁。1917年德国宣布无限制潜艇战后，英国一度濒临断粮。后来护航制度的推行大大降低了损失。", "consequence": "反潜战加强", "nextActId": "act-3"},
        {"id": "d7", "text": "动用印度、加拿大等殖民地的人力资源。", "speaker": "我", "avatar": "参", "score": 82, "triggeredEvent": "你建议动用殖民地资源。印度军队被派往西线和美索不达米亚，加澳新军队也加入战斗，大大增强了协约国的力量。", "historicalNote": "一战中英帝国各殖民地和自治领提供了约250万兵力。印度军队在西线、美索不达米亚等地作战，伤亡约7万人。加澳新军队更是成为精锐力量。", "consequence": "殖民地兵力参战", "nextActId": "act-3"},
        {"id": "d8", "text": "向美国巨额借款，用美国的钱来打这场战争。", "speaker": "我", "avatar": "参", "score": 75, "triggeredEvent": "你建议向美国借款。英国开始从美国大量借款购买物资，这虽然维持了战争，但也让英国战后债台高筑。", "historicalNote": "一战期间英国从美国借了大量贷款用于购买军需物资。到战争结束时，英国欠美国约40亿美元债务。这也导致了战后世界金融霸权从伦敦转移到纽约。", "consequence": "巨额美债缠身", "nextActId": "act-3"},
        {"id": "d9", "text": "策动阿拉伯人起义，从内部瓦解奥斯曼土耳其帝国。", "speaker": "我", "avatar": "参", "score": 80, "triggeredEvent": "你建议策动阿拉伯起义。英国派劳伦斯协助哈希姆家族发动起义，有力地牵制了土耳其的兵力。", "historicalNote": "1916年麦加的侯赛因·伊本·阿里领导阿拉伯人发动起义，英国军官T.E.劳伦斯参与其中。起义牵制了大量土军，加速了奥斯曼帝国的崩溃。", "consequence": "阿拉伯起义策动", "nextActId": "act-3"}
      ]
    }
]

data["acts"].extend(new_acts)

with open("w9-world-wars.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Total acts now: {len(data['acts'])}")
