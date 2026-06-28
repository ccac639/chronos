import json

data = {
    "eraId": "w9-world-wars",
    "eraName": "两次世界大战与冷战",
    "playerRole": "英国战时内阁的参谋官",
    "startYear": "1914年",
    "endYear": "1991年",
    "acts": []
}

avatar = "参"

# === 第 1 幕：萨拉热窝的枪声 ===
act1 = {
    "id": "act-1",
    "title": "萨拉热窝枪声",
    "isKeyAct": False,
    "timeMarker": "1914年6月",
    "sceneDescription": "1914年6月28日，波斯尼亚萨拉热窝传来惊人消息——奥匈帝国皇储斐迪南大公夫妇被塞尔维亚青年普林西普刺杀。作为英国战时内阁的参谋官，你意识到欧洲的火药桶可能被点燃。",
    "npcDialogues": [
        {
            "speaker": "外交大臣格雷",
            "text": "奥匈帝国必定会借此向塞尔维亚施压，俄国恐怕不会坐视不管。",
            "avatar": "格"
        },
        {
            "speaker": "陆军大臣霍尔丹",
            "text": "如果德国支持奥匈，法国支持俄国，整个欧洲都将卷入战争。",
            "avatar": "霍"
        }
    ],
    "dialogues": [
        {
            "id": "d1",
            "text": "立即展开外交斡旋，联合各国阻止奥匈对塞尔维亚动武。",
            "speaker": "我",
            "avatar": avatar,
            "score": 90,
            "triggeredEvent": "你积极推动外交斡旋，英国提出召开国际会议调解争端。然而奥匈帝国在德国支持下拒绝调停，战争阴云愈发浓重。",
            "historicalNote": "1914年6月28日萨拉热窝事件成为一战导火索。英国外交大臣格雷曾提议召开国际会议调解，但遭到德奥拒绝。7月28日奥匈帝国向塞尔维亚宣战，随后各国相继卷入。",
            "consequence": "外交努力失败",
            "nextActId": "act-2"
        },
        {
            "id": "d2",
            "text": "加强与法国的军事协调，做好应对德国进攻的准备。",
            "speaker": "我",
            "avatar": avatar,
            "score": 85,
            "triggeredEvent": "你建议加强英法军事协调，总参谋部开始制定远征军赴欧作战计划。英国的战争机器开始悄然启动。",
            "historicalNote": "一战前英国与法国已有军事合作协议，英国承诺战时派遣远征军支援法国。1914年8月英国参战后，迅速派遣了约12万人的远征军赴法作战。",
            "consequence": "军事准备启动",
            "nextActId": "act-2"
        },
        {
            "id": "d3",
            "text": "保持中立观望，先看看局势如何发展再做决定。",
            "speaker": "我",
            "avatar": avatar,
            "score": 72,
            "triggeredEvent": "你建议英国暂时保持中立，观察局势发展。然而随着德国入侵比利时，英国的中立立场越来越难以维持。",
            "historicalNote": "一战初期英国国内对是否参战存在争议。德国入侵比利时（英国保障其中立）成为英国参战的直接导火索。1914年8月4日英国向德国宣战。",
            "consequence": "中立难以为继",
            "nextActId": "act-2"
        },
        {
            "id": "d4",
            "text": "向德国发出明确警告，若其支持奥匈动武将面临英国干涉。",
            "speaker": "我",
            "avatar": avatar,
            "score": 78,
            "triggeredEvent": "你建议向德国发出强硬警告。德国皇帝威廉二世一度有所犹豫，但军方和强硬派最终说服他继续支持奥匈帝国。",
            "historicalNote": "英国曾多次警告德国不要发动战争，但德皇威廉二世和总参谋部低估了英国参战的决心。德国坚信英国会保持中立，这一误判加速了战争爆发。",
            "consequence": "警告未被重视",
            "nextActId": "act-2"
        },
        {
            "id": "d5",
            "text": "借此机会扩充军备，趁机提升英国的军事力量。",
            "speaker": "我",
            "avatar": avatar,
            "score": 68,
            "triggeredEvent": "你建议趁机扩充军备。虽然军事实力有所增强，但扩充军备的消息被德国获知，反而加剧了双方的紧张关系。",
            "historicalNote": "一战前欧洲列强已进行多年军备竞赛。英德海军竞赛尤为激烈，双方竞相建造无畏舰。到1914年，英国拥有29艘无畏舰，德国拥有17艘。",
            "consequence": "军备竞赛加剧",
            "nextActId": "act-1b"
        },
        {
            "id": "d6",
            "text": "派特使前往俄国，劝说其不要为塞尔维亚而卷入大战。",
            "speaker": "我",
            "avatar": avatar,
            "score": 82,
            "triggeredEvent": "你派特使前往俄国进行劝说。俄国沙皇尼古拉二世一度犹豫，但在国内民族主义压力和塞尔维亚的请求下，最终还是下令了总动员。",
            "historicalNote": "俄国与塞尔维亚同为斯拉夫民族，且有同盟关系。1914年7月30日俄国下令总动员，德国以此为借口于8月1日向俄国宣战，8月3日向法国宣战。",
            "consequence": "俄国仍总动员",
            "nextActId": "act-2"
        },
        {
            "id": "d7",
            "text": "加强对德经济封锁准备，用经济手段制约德国。",
            "speaker": "我",
            "avatar": avatar,
            "score": 75,
            "triggeredEvent": "你建议加强经济封锁准备。英国海军开始制定海上封锁计划，准备切断德国的海上贸易线。",
            "historicalNote": "英国凭借强大的海军在一战中对德国实施了严密的海上封锁，导致德国物资严重短缺。1915年起德国开始实行无限制潜艇战作为反制。",
            "consequence": "封锁计划制定",
            "nextActId": "act-2"
        },
        {
            "id": "d8",
            "text": "这是欧陆国家的事，英国应独善其身，专注于殖民地事务。",
            "speaker": "我",
            "avatar": avatar,
            "score": 62,
            "triggeredEvent": "你主张英国置身事外，专注殖民地事务。然而德国入侵比利时破坏了欧洲均势，英国朝野要求参战的呼声越来越高。",
            "historicalNote": "英国长期奉行"光荣孤立"政策，不与欧洲大国结盟。但20世纪初德国崛起威胁到英国霸权，英国逐渐放弃孤立政策，与法俄结盟。",
            "consequence": "孤立政策难以为继",
            "nextActId": "act-1b"
        },
        {
            "id": "d9",
            "text": "立即启动战时内阁机制，进入全面战争准备状态。",
            "speaker": "我",
            "avatar": avatar,
            "score": 88,
            "triggeredEvent": "你建议立即启动战时内阁，全面备战。内阁开始协调各部门，军队进入戒备状态，为可能到来的战争做好了充分准备。",
            "historicalNote": "1914年8月英国参战后，成立了战时内阁负责统筹战争事务。一战中英国内阁制度进一步完善，为后来二战中的战时内阁积累了经验。",
            "consequence": "战时机制启动",
            "nextActId": "act-2"
        }
    ]
}
data["acts"].append(act1)

# === 第 1b 幕：军备竞赛升级 ===
act1b = {
    "id": "act-1b",
    "title": "战争阴云密布",
    "isKeyAct": False,
    "timeMarker": "1914年7月",
    "sceneDescription": "欧洲局势急剧恶化，奥匈帝国向塞尔维亚发出最后通牒，各国开始总动员。英国因此前的决策在外交上有些被动，但战争的脚步已经无法阻挡。你在内阁紧急会议上面临新的抉择。",
    "npcDialogues": [
        {
            "speaker": "首相阿斯奎斯",
            "text": "德国已经向俄国和法国宣战，比利时也面临入侵。我们不能再犹豫不决了。",
            "avatar": "阿"
        },
        {
            "speaker": "海军大臣丘吉尔",
            "text": "皇家海军已经进入全面战备状态，随时可以封锁德国海岸。",
            "avatar": "丘"
        }
    ],
    "dialogues": [
        {
            "id": "d1",
            "text": "立即向德国宣战，履行对比利时中立的保障义务。",
            "speaker": "我",
            "avatar": avatar,
            "score": 92,
            "triggeredEvent": "你力主立即宣战。1914年8月4日，英国正式向德国宣战。大英帝国及其自治领和殖民地全部加入战争。",
            "historicalNote": "1914年8月4日，英国以德国入侵比利时、破坏其中立为由向德国宣战。英国的参战使战争真正成为世界大战，帝国各自治领和殖民地也相继参战。",
            "consequence": "英国正式参战",
            "nextActId": "act-2"
        },
        {
            "id": "d2",
            "text": "先派出远征军支援法国，宣战可以稍缓一步。",
            "speaker": "我",
            "avatar": avatar,
            "score": 75,
            "triggeredEvent": "你建议先派兵再宣战。然而国际舆论和国内压力都要求英国正式表态，政府最终还是选择了正式宣战。",
            "historicalNote": "一战爆发后，英国迅速派出由弗伦奇指挥的远征军赴法作战。这支职业军队虽然人数不多，但训练有素，在马恩河战役中发挥了重要作用。",
            "consequence": "远征军先行出发",
            "nextActId": "act-2"
        },
        {
            "id": "d3",
            "text": "动员帝国力量，让自治领和殖民地也参与进来。",
            "speaker": "我",
            "avatar": avatar,
            "score": 85,
            "triggeredEvent": "你建议动员全帝国的力量。加拿大、澳大利亚、新西兰、南非等自治领纷纷表示支持，印度也提供了大量人力物力。",
            "historicalNote": "一战中大英帝国各自治领和殖民地提供了约250万军队。其中澳新军团（ANZAC）在加里波利战役中声名远扬，加拿大军队在西线作战中表现出色。",
            "consequence": "帝国全面动员",
            "nextActId": "act-2"
        },
        {
            "id": "d4",
            "text": "加强海上封锁，用经济手段削弱德国，减少陆地投入。",
            "speaker": "我",
            "avatar": avatar,
            "score": 78,
            "triggeredEvent": "你主张以海制陆，加强封锁。皇家海军开始对德国实施严密的海上封锁，德国的海外贸易几乎被切断。",
            "historicalNote": "英国海军在一战中的主要战略是远距离封锁德国北海沿岸。封锁导致德国国内物资匮乏，粮食短缺，是德国最终战败的重要原因之一。",
            "consequence": "海上封锁加强",
            "nextActId": "act-2"
        },
        {
            "id": "d5",
            "text": "争取美国支持，让美国尽早加入协约国一方。",
            "speaker": "我",
            "avatar": avatar,
            "score": 80,
            "triggeredEvent": "你建议争取美国支持。英国开始通过外交和宣传手段争取美国同情，但美国此时仍坚持中立。",
            "historicalNote": "一战初期美国保持中立，向交战双方出售武器物资。1917年德国无限制潜艇战和齐默曼电报事件促使美国参战，成为协约国获胜的关键因素。",
            "consequence": "对美外交启动",
            "nextActId": "act-2"
        },
        {
            "id": "d6",
            "text": "在东线策动俄国，让俄军尽早东进攻打德国。",
            "speaker": "我",
            "avatar": avatar,
            "score": 70,
            "triggeredEvent": "你建议推动俄军尽早进攻。俄国在法国催促下仓促动员，两个集团军向东普鲁士发起进攻，但遭遇惨败。",
            "historicalNote": "1914年8月俄军仓促进攻东普鲁士，但在坦能堡战役中被兴登堡和鲁登道夫指挥的德军击溃，损失约25万人。不过俄军的进攻也打乱了德国的施里芬计划。",
            "consequence": "俄军仓促进攻失败",
            "nextActId": "act-2"
        },
        {
            "id": "d7",
            "text": "趁德国忙于欧陆，夺取其海外殖民地。",
            "speaker": "我",
            "avatar": avatar,
            "score": 65,
            "triggeredEvent": "你建议趁机夺取德国殖民地。英军和澳新军队很快攻占了德属多哥、喀麦隆、西南非洲和太平洋上的德属岛屿。",
            "historicalNote": "一战爆发后，协约国迅速攻占了德国的海外殖民地。日本也对德宣战，占领了中国山东的德租界和太平洋上的德属岛屿。",
            "consequence": "德属殖民地被占领",
            "nextActId": "act-2"
        },
        {
            "id": "d8",
            "text": "推行义务兵役制，组建庞大的陆军投入西线。",
            "speaker": "我",
            "avatar": avatar,
            "score": 82,
            "triggeredEvent": "你建议推行义务兵役制。在基奇纳勋爵的推动下，英国开始大规模招募志愿兵，组建了"基奇纳军"。",
            "historicalNote": "一战前英国实行志愿兵役制，陆军规模较小。1914年战争大臣基奇纳号召志愿参军，短短数月就招募了约100万人，史称"基奇纳军"。1916年英国开始实行义务兵役制。",
            "consequence": "大规模募兵开始",
            "nextActId": "act-2"
        },
        {
            "id": "d9",
            "text": "与土耳其接触，争取其中立甚至倒向协约国。",
            "speaker": "我",
            "avatar": avatar,
            "score": 72,
            "triggeredEvent": "你建议争取土耳其。英国一度试图拉拢土耳其，但随着德国战舰"戈本"号抵达君士坦丁堡，土耳其最终倒向同盟国。",
            "historicalNote": "一战初期土耳其原本倾向中立，但德国将"戈本"号战列巡洋舰赠予土耳其，加上亲德派恩维尔帕夏的推动，土耳其于1914年11月加入同盟国对协约国作战。",
            "consequence": "土耳其加入同盟国",
            "nextActId": "act-2"
        }
    ]
}
data["acts"].append(act1b)

# === 第 2 幕：大战爆发 ===
act2 = {
    "id": "act-2",
    "title": "大战爆发",
    "isKeyAct": False,
    "timeMarker": "1914年8月",
    "sceneDescription": "1914年8月，第一次世界大战全面爆发。德国按照施里芬计划，取道比利时进攻法国，势如破竹。英国远征军已抵达法国前线。作为参谋官，你面临着如何配合法军阻挡德军推进的决策。",
    "npcDialogues": [
        {
            "speaker": "远征军司令弗伦奇",
            "text": "德军进展太快，法军在撤退。我们的兵力太少，是否也要后撤？",
            "avatar": "弗"
        },
        {
            "speaker": "法军总司令霞飞",
            "text": "请求英军务必守住防线，否则巴黎危在旦夕！",
            "avatar": "霞"
        }
    ],
    "dialogues": [
        {
            "id": "d1",
            "text": "全力配合法军组织反攻，在马恩河一线挡住德军。",
            "speaker": "我",
            "avatar": avatar,
            "score": 92,
            "triggeredEvent": "你力主配合法军反攻。1914年9月，马恩河战役爆发，英法联军成功挡住德军进攻，德国速战速决的计划破产。",
            "historicalNote": "1914年9月5-12日的马恩河战役是一战的转折点。英法联军在马恩河一线击退德军，德军被迫后撤，施里芬计划破产。此后西线进入阵地战阶段。",
            "consequence": "马恩河奇迹",
            "nextActId": "act-3"
        },
        {
            "id": "d2",
            "text": "英军应保存实力，有序撤退到塞纳河以南再图反攻。",
            "speaker": "我",
            "avatar": avatar,
            "score": 68,
            "triggeredEvent": "你建议英军后撤保存实力。弗伦奇一度下令撤退，但在法国政府强烈抗议和英国政府压力下，英军最终还是参加了马恩河反攻。",
            "historicalNote": "一战初期英军司令弗伦奇爵士曾因伤亡惨重而计划将英军撤至塞纳河以南，甚至撤回英国。但在法国政府和英国内阁的压力下，英军最终参加了马恩河战役。",
            "consequence": "撤退后被迫反攻",
            "nextActId": "act-3"
        },
        {
            "id": "d3",
            "text": "急调国内预备队增援，同时组织铁路运输保障补给。",
            "speaker": "我",
            "avatar": avatar,
            "score": 85,
            "triggeredEvent": "你建议加紧增援和补给。英国通过英吉利海峡快速运送援军和物资，远征军实力不断增强。",
            "historicalNote": "一战中英吉利海峡航线是英国远征军的生命线。英国海军掌握制海权，确保了人员和物资的安全运输。整个战争期间约有数百万人通过海峡前往欧洲大陆。",
            "consequence": "补给线畅通",
            "nextActId": "act-3"
        },
        {
            "id": "d4",
            "text": "在侧翼发动进攻，威胁德军补给线，减轻正面压力。",
            "speaker": "我",
            "avatar": avatar,
            "score": 88,
            "triggeredEvent": "你建议侧翼出击威胁德军补给线。这一思路后来发展为"奔向大海"行动，双方试图包抄对方侧翼，最终战线延伸到了北海沿岸。",
            "historicalNote": "1914年9-10月，双方沿埃纳河向西北方向延伸战线，试图包抄对方侧翼，史称"奔向大海"。最终战线从瑞士边境一直延伸到北海，形成了长达700公里的堑壕线。",
            "consequence": "奔向大海",
            "nextActId": "act-3"
        },
        {
            "id": "d5",
            "text": "用海军炮击德军沿海阵地，从海上支援陆上作战。",
            "speaker": "我",
            "avatar": avatar,
            "score": 75,
            "triggeredEvent": "你建议从海上支援。皇家海军对比利时沿海的德军阵地进行了炮击，一定程度上支援了陆军作战。",
            "historicalNote": "一战中英国海军曾多次炮击比利时和法国沿海的德军阵地。在安特卫普保卫战和佛兰德战役中，海军舰炮火力都提供了支援。",
            "consequence": "海上火力支援",
            "nextActId": "act-3"
        },
        {
            "id": "d6",
            "text": "立即在达达尼尔海峡开辟新战场，迫使土耳其投降。",
            "speaker": "我",
            "avatar": avatar,
            "score": 70,
            "triggeredEvent": "你建议开辟新战场。这一想法后来发展为加里波利战役，但此时英国的注意力仍集中在西线。",
            "historicalNote": "1915年英法联军发动加里波利战役，试图打通达达尼尔海峡、攻占君士坦丁堡。但战役最终失败，协约国伤亡约25万人。",
            "consequence": "新战场计划酝酿",
            "nextActId": "act-3"
        },
        {
            "id": "d7",
            "text": "加强对德宣传战，瓦解德军士气，策动国内反战运动。",
            "speaker": "我",
            "avatar": avatar,
            "score": 65,
            "triggeredEvent": "你建议加强宣传战。英国开始通过传单和广播对德军进行宣传，但短期内效果有限。",
            "historicalNote": "一战中双方都开展了大规模宣传战。英国在 propaganda（宣传）方面尤其擅长，通过媒体塑造德国的"野蛮人"形象，争取国内外舆论支持。",
            "consequence": "宣传战启动",
            "nextActId": "act-3"
        },
        {
            "id": "d8",
            "text": "向德国发出和平倡议，趁战争还未扩大化尽快结束。",
            "speaker": "我",
            "avatar": avatar,
            "score": 60,
            "triggeredEvent": "你建议尽快议和。然而此时双方都认为自己能获胜，和平倡议无人理睬，战争反而不断升级。",
            "historicalNote": "一战初期双方都坚信自己能速胜。德国计划6周内击败法国，英国也认为战争会在圣诞节前结束。没有人预料到战争会持续四年多。",
            "consequence": "和平倡议遭拒",
            "nextActId": "act-2b"
        },
        {
            "id": "d9",
            "text": "推动意大利倒向协约国，从南线牵制奥匈帝国。",
            "speaker": "我",
            "avatar": avatar,
            "score": 80,
            "triggeredEvent": "你建议争取意大利。英国开始与意大利秘密谈判，承诺战后分给其奥匈帝国的领土。1915年意大利终于倒向协约国。",
            "historicalNote": "意大利原本是同盟国成员，但战争爆发后宣布中立。1915年4月，意大利与协约国签订《伦敦条约》，以获得奥匈领土为条件加入协约国作战。",
            "consequence": "意大利谈判启动",
            "nextActId": "act-3"
        }
    ]
}
data["acts"].append(act2)

# === 第 2b 幕：和平尝试失败 ===
act2b = {
    "id": "act-2b",
    "title": "和平希望破灭",
    "isKeyAct": False,
    "timeMarker": "1914年10月",
    "sceneDescription": "和平倡议遭到双方拒绝，战争正在向长期化发展。西线已经形成堑壕对峙的局面，双方都在为接下来的大战做准备。英国必须调整策略，应对这场持久战。",
    "npcDialogues": [
        {
            "speaker": "战争大臣基奇纳",
            "text": "这场战争不会很快结束，我们需要一支百万人的大军，做好打三年的准备。",
            "avatar": "基"
        },
        {
            "speaker": "财政大臣劳合·乔治",
            "text": "战争开销惊人，我们必须确保经济和财政能支撑下去。",
            "avatar": "劳"
        }
    ],
    "dialogues": [
        {
            "id": "d1",
            "text": "全力支持基奇纳的扩军计划，组建百万大军准备持久战。",
            "speaker": "我",
            "avatar": avatar,
            "score": 90,
            "triggeredEvent": "你全力支持扩军计划。基奇纳的募兵运动取得巨大成功，短短数月就有上百万志愿者参军。",
            "historicalNote": "1914年8月，战争大臣基奇纳伯爵发起大规模志愿募兵运动，号召组建一支百万大军。到1915年底，已有约250万人志愿参军。1916年英国开始实行征兵制。",
            "consequence": "百万大军组建",
            "nextActId": "act-3"
        },
        {
            "id": "d2",
            "text": "转为战时经济体制，将工业全面转入军工生产。",
            "speaker": "我",
            "avatar": avatar,
            "score": 88,
            "triggeredEvent": "你建议转入战时经济。英国开始建立军需部，工业生产转向战争轨道，炮弹、枪支、飞机的产量大幅提升。",
            "historicalNote": "一战中英国逐步建立起战时经济体制。1915年成立军需部，由劳合·乔治任大臣，统一管理军工生产。到战争后期，英国军工产能远超德国。",
            "consequence": "战时经济建立",
            "nextActId": "act-3"
        },
        {
            "id": "d3",
            "text": "继续坚持以海制陆战略，主要靠封锁和海军取胜。",
            "speaker": "我",
            "avatar": avatar,
            "score": 72,
            "triggeredEvent": "你坚持以海制陆。皇家海军继续加强封锁，但陆军方面的投入不足导致西线进展缓慢。",
            "historicalNote": "英国传统军事战略是依靠海军优势，陆军保持小规模。但一战的堑壕战需要大量陆军，英国不得不转变战略，大规模扩充陆军。",
            "consequence": "战略重心偏海",
            "nextActId": "act-3"
        },
        {
            "id": "d4",
            "text": "在东线、南线开辟新战场，避免在西线消耗。",
            "speaker": "我",
            "avatar": avatar,
            "score": 70,
            "triggeredEvent": "你建议开辟新战场。这一思路导致了后来的加里波利战役和美索不达米亚战役，但效果并不理想。",
            "historicalNote": "一战中英国确实尝试了多条战线：西线、加里波利、美索不达米亚、巴勒斯坦、东非等。但西线始终是主战场，其他战线未能改变整体战局。",
            "consequence": "多线作战酝酿",
            "nextActId": "act-3"
        },
        {
            "id": "d5",
            "text": "加强与法国的协调，建立统一的联军指挥机制。",
            "speaker": "我",
            "avatar": avatar,
            "score": 85,
            "triggeredEvent": "你建议建立统一指挥。虽然初期双方协调不畅，但后来逐步建立了更好的合作机制，为战争后期的统一指挥奠定了基础。",
            "historicalNote": "一战初期协约国缺乏统一指挥，各自为战。直到1917年法国的尼韦勒攻势失败后，才逐步建立起以福煦为统帅的统一指挥体系。",
            "consequence": "协调机制改善",
            "nextActId": "act-3"
        },
        {
            "id": "d6",
            "text": "用潜艇和水雷反击德国的潜艇战，保护海上交通线。",
            "speaker": "我",
            "avatar": avatar,
            "score": 78,
            "triggeredEvent": "你建议加强反潜作战。英国海军开始发展护航制度和反潜技术，逐步扭转了潜艇战的不利局面。",
            "historicalNote": "一战中德国潜艇对英国海上运输线构成严重威胁。1917年德国宣布无限制潜艇战后，英国一度濒临断粮。后来护航制度的推行大大降低了损失。",
            "consequence": "反潜战加强",
            "nextActId": "act-3"
        },
        {
            "id": "d7",
            "text": "动用印度、加拿大等殖民地的人力资源。",
            "speaker": "我",
            "avatar": avatar,
            "score": 82,
            "triggeredEvent": "你建议动用殖民地资源。印度军队被派往西线和美索不达米亚，加澳新军队也加入战斗，大大增强了协约国的力量。",
            "historicalNote": "一战中英帝国各殖民地和自治领提供了约250万兵力。印度军队在西线、美索不达米亚等地作战，伤亡约7万人。加澳新军队更是成为精锐力量。",
            "consequence": "殖民地兵力参战",
            "nextActId": "act-3"
        },
        {
            "id": "d8",
            "text": "向美国巨额借款，用美国的钱来打这场战争。",
            "speaker": "我",
            "avatar": avatar,
            "score": 75,
            "triggeredEvent": "你建议向美国借款。英国开始从美国大量借款购买物资，这虽然维持了战争，但也让英国战后债台高筑。",
            "historicalNote": "一战期间英国从美国借了大量贷款用于购买军需物资。到战争结束时，英国欠美国约40亿美元债务。这也导致了战后世界金融霸权从伦敦转移到纽约。",
            "consequence": "巨额美债缠身",
            "nextActId": "act-3"
        },
        {
            "id": "d9",
            "text": "策动阿拉伯人起义，从内部瓦解奥斯曼土耳其帝国。",
            "speaker": "我",
            "avatar": avatar,
            "score": 80,
            "triggeredEvent": "你建议策动阿拉伯起义。英国派劳伦斯（阿拉伯的劳伦斯）协助哈希姆家族发动起义，有力地牵制了土耳其的兵力。",
            "historicalNote": "1916年麦加的侯赛因·伊本·阿里领导阿拉伯人发动起义，英国军官T.E.劳伦斯（"阿拉伯的劳伦斯"）参与其中。起义牵制了大量土军，加速了奥斯曼帝国的崩溃。",
            "consequence": "阿拉伯起义策动",
            "nextActId": "act-3"
        }
    ]
}
data["acts"].append(act2b)

# === 第 3 幕：堑壕绞肉机 ===
act3 = {
    "id": "act-3",
    "title": "堑壕绞肉机",
    "isKeyAct": False,
    "timeMarker": "1916年7月",
    "sceneDescription": "1916年7月，索姆河战役打响。在德军坚固的堑壕防线和机枪火力面前，英军发起大规模进攻，首日伤亡就达六万。你在内阁中承受着巨大的压力，必须决定下一步的战略。",
    "npcDialogues": [
        {
            "speaker": "陆军大臣劳合·乔治",
            "text": "索姆河的伤亡太惨重了，我们是不是应该重新评估西线战略？",
            "avatar": "劳"
        },
        {
            "speaker": "英军总司令黑格",
            "text": "突破即将到来！只要再加把劲，就能突破德军防线赢得战争。",
            "avatar": "黑"
        }
    ],
    "dialogues": [
        {
            "id": "d1",
            "text": "继续在索姆河保持压力，但改进战术，避免无谓牺牲。",
            "speaker": "我",
            "avatar": avatar,
            "score": 85,
            "triggeredEvent": "你建议继续施压但改进战术。英军逐步采用更灵活的战术，如 creeping barrage（徐进弹幕）和小分队渗透，伤亡有所下降。",
            "historicalNote": "索姆河战役中英军从最初的密集冲锋逐步改进战术，采用徐进弹幕、小分队渗透等更灵活的战法。虽然损失惨重，但也积累了宝贵的作战经验。",
            "consequence": "战术逐步改进",
            "nextActId": "act-4"
        },
        {
            "id": "d2",
            "text": "大量投入坦克，用这种新式武器打破堑壕僵局。",
            "speaker": "我",
            "avatar": avatar,
            "score": 90,
            "triggeredEvent": "你建议投入坦克。1916年9月15日，坦克首次在索姆河战役中投入使用，虽然数量少且故障多，但给德军造成了巨大震撼。",
            "historicalNote": "1916年9月15日，英军在索姆河战役中首次使用坦克（Mark I型），共投入49辆，但实际投入战斗的只有18辆。坦克的出现打破了堑壕战的僵局，预示着战争形态的变革。",
            "consequence": "坦克首次登场",
            "nextActId": "act-4"
        },
        {
            "id": "d3",
            "text": "暂停索姆河攻势，将兵力转向其他战场。",
            "speaker": "我",
            "avatar": avatar,
            "score": 68,
            "triggeredEvent": "你建议暂停攻势转往他处。但黑格坚持认为突破在即，在他的坚持下，索姆河战役继续进行。",
            "historicalNote": "索姆河战役从1916年7月持续到11月，英法联军伤亡约62万人，德军伤亡约45万人。这场战役虽然没有实现战略突破，但极大地消耗了德军的实力。",
            "consequence": "攻势仍在继续",
            "nextActId": "act-4"
        },
        {
            "id": "d4",
            "text": "发展空中力量，用轰炸机轰炸德军后方补给线。",
            "speaker": "我",
            "avatar": avatar,
            "score": 82,
            "triggeredEvent": "你建议发展空军。英国皇家飞行队开始更多地执行轰炸和侦察任务，制空权的争夺越来越激烈。",
            "historicalNote": "一战中空军从无到有迅速发展。英国皇家飞行队（RFC）在战争中不断壮大，从最初的侦察发展到轰炸和空战。1918年英国成立了世界上第一支独立空军——皇家空军（RAF）。",
            "consequence": "空军发展加速",
            "nextActId": "act-4"
        },
        {
            "id": "d5",
            "text": "加大对德国的封锁力度，让德国人为饥饿付出代价。",
            "speaker": "我",
            "avatar": avatar,
            "score": 78,
            "triggeredEvent": "你建议加强封锁。英国海军进一步收紧对德国的封锁，德国国内的食品和物资短缺日益严重。",
            "historicalNote": "英国的海上封锁对德国造成了严重影响。到1918年，德国国内粮食短缺，民众只能靠萝卜充饥，被称为"萝卜冬天"。封锁是德国战败的重要原因之一。",
            "consequence": "封锁成效显现",
            "nextActId": "act-4"
        },
        {
            "id": "d6",
            "text": "让法军承担更多正面作战，英军负责更多侧翼战线。",
            "speaker": "我",
            "avatar": avatar,
            "score": 70,
            "triggeredEvent": "你建议英法分工。双方确实在不同战线上配合，但统一指挥的问题直到战争后期才得到解决。",
            "historicalNote": "一战中英法联军长期存在指挥协调问题。直到1918年德国春季攻势、法军节节败退时，才最终任命福煦为协约国联军总司令，实现统一指挥。",
            "consequence": "分工仍不协调",
            "nextActId": "act-4"
        },
        {
            "id": "d7",
            "text": "动用化学武器，以牙还牙报复德国人的毒气战。",
            "speaker": "我",
            "avatar": avatar,
            "score": 65,
            "triggeredEvent": "你建议使用化学武器报复。英国开始生产和使用芥子气等化学武器，双方在西线大量使用毒气，造成巨大伤亡。",
            "historicalNote": "一战中双方都大量使用化学武器。1915年4月德国在伊普尔首次使用氯气开了毒气战的先例。到战争结束时，双方共使用了约12.4万吨化学战剂，造成约130万人伤亡。",
            "consequence": "化学战升级",
            "nextActId": "act-3b"
        },
        {
            "id": "d8",
            "text": "在巴勒斯坦和中东发动攻势，从南面打击土耳其。",
            "speaker": "我",
            "avatar": avatar,
            "score": 75,
            "triggeredEvent": "你建议在中东发动攻势。英军在艾伦比将军指挥下，在巴勒斯坦取得一系列胜利，1917年底攻占了耶路撒冷。",
            "historicalNote": "一战中东战场上，英军在艾伦比将军指挥下取得了一系列胜利。1917年12月英军攻占耶路撒冷，1918年9月的米吉多战役更是彻底击溃了土军主力。",
            "consequence": "中东战场推进",
            "nextActId": "act-4"
        },
        {
            "id": "d9",
            "text": "努力争取美国参战，只要美国加入就稳操胜券。",
            "speaker": "我",
            "avatar": avatar,
            "score": 88,
            "triggeredEvent": "你建议争取美国参战。英国通过外交和宣传持续向美国施压，而德国的无限制潜艇战最终将美国推向了协约国一方。",
            "historicalNote": "1917年4月6日，美国以德国无限制潜艇战和齐默曼电报为由向德国宣战。美国的参战为协约国带来了源源不断的人力物力，是协约国最终获胜的关键因素。",
            "consequence": "美国参战在望",
            "nextActId": "act-4"
        }
    ]
}
data["acts"].append(act3)

# === 第 3b 幕：毒气战升级 ===
act3b = {
    "id": "act-3b",
    "title": "毒雾弥漫",
    "isKeyAct": False,
    "timeMarker": "1917年春",
    "sceneDescription": "化学战在西线愈演愈烈，芥子气等新型毒气造成的惨状令人发指。国际舆论对化学战的批评声浪高涨，但双方都不愿率先停止。你必须在道义和军事需要之间做出权衡。",
    "npcDialogues": [
        {
            "speaker": "陆军医疗总监",
            "text": "芥子气造成的烧伤和肺部损伤太可怕了，士兵们的士气受到严重打击。",
            "avatar": "医"
        },
        {
            "speaker": "军方高层",
            "text": "德国人先用的毒气，我们必须以牙还牙，否则就是自缚手脚。",
            "avatar": "军"
        }
    ],
    "dialogues": [
        {
            "id": "d1",
            "text": "呼吁国际社会制定禁止化学武器的公约，率先做出姿态。",
            "speaker": "我",
            "avatar": avatar,
            "score": 72,
            "triggeredEvent": "你呼吁禁止化学武器。但战时环境下，国际社会难以达成有效协议，化学战仍在继续。",
            "historicalNote": "早在1899年和1907年的海牙和会上就有禁止化学武器的公约，但一战中双方都违反了。直到1925年《日内瓦议定书》才正式禁止在战争中使用化学武器。",
            "consequence": "呼吁效果有限",
            "nextActId": "act-4"
        },
        {
            "id": "d2",
            "text": "加强防化装备的研发和配备，保护士兵安全。",
            "speaker": "我",
            "avatar": avatar,
            "score": 88,
            "triggeredEvent": "你建议加强防护。英国加速研发防毒面具和防护服，为前线士兵配备更完善的防化装备，伤亡率逐渐下降。",
            "historicalNote": "一战中双方都在快速发展防护装备。从最早的湿布蒙面到后来的防毒面具，防护技术不断进步。到战争后期，大部分士兵都配备了有效的防毒面具。",
            "consequence": "防护能力提升",
            "nextActId": "act-4"
        },
        {
            "id": "d3",
            "text": "大规模使用毒气报复，用更强的化学武器打击德军。",
            "speaker": "我",
            "avatar": avatar,
            "score": 62,
            "triggeredEvent": "你主张大规模使用毒气报复。英军的毒气战力度加大，但德军也加强了防护，双方陷入了新的军备竞赛。",
            "historicalNote": "一战中英军使用的化学武器数量仅次于德国。双方都发展了多种毒剂，包括氯气、光气、芥子气等。化学战造成了巨大伤亡，但并未改变战争进程。",
            "consequence": "化学战恶性循环",
            "nextActId": "act-4"
        },
        {
            "id": "d4",
            "text": "将毒气战重点转向对方后方城市，打击其国民士气。",
            "speaker": "我",
            "avatar": avatar,
            "score": 60,
            "triggeredEvent": "你建议将毒气用于打击城市。但这一建议被内阁否决，因为担心德国用同样的方式报复英国城市。",
            "historicalNote": "一战中化学武器主要用于战场，双方都没有大规模对城市使用毒气。但双方都用飞机和飞艇轰炸过对方城市，造成了平民伤亡。",
            "consequence": "建议被否决",
            "nextActId": "act-4"
        },
        {
            "id": "d5",
            "text": "把毒气战的真相公之于众，用舆论谴责德国的战争罪行。",
            "speaker": "我",
            "avatar": avatar,
            "score": 78,
            "triggeredEvent": "你建议进行宣传战。英国媒体大量报道德军使用毒气的暴行，争取了国际舆论的同情，尤其是在美国影响很大。",
            "historicalNote": "一战中双方都利用化学战进行宣传。英国媒体将德国描绘成使用毒气的"野蛮人"，这一宣传在美国民众中产生了深远影响，为美国参战创造了舆论条件。",
            "consequence": "舆论战取得效果",
            "nextActId": "act-4"
        },
        {
            "id": "d6",
            "text": "研发更有效的毒气投放方式，比如用飞机和炮弹投射。",
            "speaker": "我",
            "avatar": avatar,
            "score": 70,
            "triggeredEvent": "你建议改进投放方式。英军开始更多地使用毒气弹和空投毒气，化学战的规模和方式都在升级。",
            "historicalNote": "一战中化学武器的投放方式不断发展。从最初的钢瓶放毒发展到炮弹和炸弹投射，使化学战更加灵活和难以防范。",
            "consequence": "投毒方式升级",
            "nextActId": "act-4"
        },
        {
            "id": "d7",
            "text": "把毒气战资源转向研发坦克和飞机，用科技优势取胜。",
            "speaker": "我",
            "avatar": avatar,
            "score": 85,
            "triggeredEvent": "你建议将资源转向其他新式武器。英国的坦克和飞机研发加速，这些武器在战争后期发挥了更大作用。",
            "historicalNote": "一战中坦克、飞机、潜艇等新式武器的发展对战争形态产生了深远影响。相比之下，化学武器虽然恐怖，但实际军事效能有限，且受到国际社会的强烈谴责。",
            "consequence": "科技研发加速",
            "nextActId": "act-4"
        },
        {
            "id": "d8",
            "text": "成立专门的化学战研究机构，系统研究攻防技术。",
            "speaker": "我",
            "avatar": avatar,
            "score": 75,
            "triggeredEvent": "你建议成立专门研究机构。英国建立了化学战研究部门，系统研究各种毒剂和防护技术。",
            "historicalNote": "一战中英德等国都建立了专门的化学战研究机构。英国的波顿庄园（Porton Down）就是一战期间建立的化学战研究中心，至今仍在进行相关研究。",
            "consequence": "化学战研究体系化",
            "nextActId": "act-4"
        },
        {
            "id": "d9",
            "text": "在战场上有限使用毒气，重点用于关键战役的突破。",
            "speaker": "我",
            "avatar": avatar,
            "score": 68,
            "triggeredEvent": "你建议有限度地使用毒气。英军在关键战役中使用毒气配合进攻，取得了一定战术效果，但也付出了相应代价。",
            "historicalNote": "一战中化学武器主要用于战术层面，配合进攻或防御。虽然造成了大量伤亡，但从未决定过一场战役的胜负，更不用说整个战争的结局。",
            "consequence": "有限使用毒气",
            "nextActId": "act-4"
        }
    ]
}
data["acts"].append(act3b)

# === 第 4 幕：战争转折 ===
act4 = {
    "id": "act-4",
    "title": "战争转折",
    "isKeyAct": False,
    "timeMarker": "1917年",
    "sceneDescription": "1917年是战争的转折之年。俄国爆发革命，临时政府继续战争但士气低落；美国对德宣战，源源不断的美军开始抵达欧洲。协约国的优势在积累，但德军仍在顽抗。你必须规划赢得战争的路径。",
    "npcDialogues": [
        {
            "speaker": "首相劳合·乔治",
            "text": "美国人参战了，但他们的军队还需要时间准备。我们必须撑到美军大部队到来。",
            "avatar": "劳"
        },
        {
            "speaker": "帝国总参谋长威廉·罗伯逊",
            "text": "西线仍是关键。只有在西线击败德军，才能赢得战争。",
            "avatar": "罗"
        }
    ],
    "dialogues": [
        {
            "id": "d1",
            "text": "采取战略防御，保存实力等待美军大规模到来再反攻。",
            "speaker": "我",
            "avatar": avatar,
            "score": 85,
            "triggeredEvent": "你建议战略防御等待美军。英军在西线转入防御，积蓄力量。但德军在1918年发动了春季攻势，几乎打到巴黎。",
            "historicalNote": "1917年英军在帕斯尚尔战役中损失惨重后，劳合·乔治首相倾向于战略防御，等待美军到来。但1918年德军的春季攻势一度造成了严重危机。",
            "consequence": "战略防御待援",
            "nextActId": "act-5"
        },
        {
            "id": "d2",
            "text": "推动建立协约国统一指挥，协调各国军队作战。",
            "speaker": "我",
            "avatar": avatar,
            "score": 90,
            "triggeredEvent": "你力主建立统一指挥。1918年4月，福煦被任命为协约国联军总司令，统一指挥西线所有协约国军队。",
            "historicalNote": "1918年4月，面对德军春季攻势的危机，协约国终于任命法国元帅福煦为联军总司令，统一指挥西线所有部队。统一指挥大大提高了协约国军队的协同作战能力。",
            "consequence": "统一指挥建立",
            "nextActId": "act-5"
        },
        {
            "id": "d3",
            "text": "在潜艇战上加大投入，突破德国的无限制潜艇战。",
            "speaker": "我",
            "avatar": avatar,
            "score": 82,
            "triggeredEvent": "你建议加强反潜作战。英国推行护航制度，加上美国海军的参与，德国潜艇的威胁逐渐被遏制。",
            "historicalNote": "1917年5月英国开始实行护航制度，大大降低了商船损失。加上美国海军的参战和反潜技术的进步，德国的无限制潜艇战最终失败。",
            "consequence": "潜艇战告捷",
            "nextActId": "act-5"
        },
        {
            "id": "d4",
            "text": "支持俄国的反革命势力，让俄国重新参战牵制德国。",
            "speaker": "我",
            "avatar": avatar,
            "score": 65,
            "triggeredEvent": "你建议干涉俄国内政。英国参与了对苏俄的武装干涉，但干涉行动最终失败，俄国还是退出了战争。",
            "historicalNote": "十月革命后，协约国对苏俄进行了武装干涉，支持白卫军。英国在北俄、西伯利亚等地都派了军队。但干涉行动最终失败，苏俄与德国签订《布列斯特和约》退出了战争。",
            "consequence": "武装干涉失败",
            "nextActId": "act-4b"
        },
        {
            "id": "d5",
            "text": "大力发展坦克部队，组建装甲师准备实施突破。",
            "speaker": "我",
            "avatar": avatar,
            "score": 88,
            "triggeredEvent": "你建议大力发展坦克。英国组建了坦克军，在1917年的康布雷战役中大规模使用坦克，取得了惊人的战术突破。",
            "historicalNote": "1917年11月的康布雷战役中，英军集中使用了约470辆坦克，在步兵和炮兵配合下突破了德军防线，深入约10公里。这是战争史上第一次大规模使用坦克的战役。",
            "consequence": "坦克部队壮大",
            "nextActId": "act-5"
        },
        {
            "id": "d6",
            "text": "加强对德国的经济封锁和宣传战，从内部瓦解德国。",
            "speaker": "我",
            "avatar": avatar,
            "score": 80,
            "triggeredEvent": "你建议加强封锁和宣传。德国国内的危机日益严重，反战运动此起彼伏，基尔港水兵起义敲响了德意志帝国的丧钟。",
            "historicalNote": "英国的封锁和宣传对德国国内崩溃起了重要作用。1918年11月德国基尔港水兵起义，随后革命席卷全国，德皇威廉二世退位，德国宣布投降。",
            "consequence": "德国内部动摇",
            "nextActId": "act-5"
        },
        {
            "id": "d7",
            "text": "从殖民地和自治领调更多军队，充实西线兵力。",
            "speaker": "我",
            "avatar": avatar,
            "score": 78,
            "triggeredEvent": "你建议调动更多殖民地军队。加澳新和印度的部队源源不断地被调往西线，英军的实力不断增强。",
            "historicalNote": "一战中英帝国的自治领和殖民地提供了大量兵力。加拿大派出了约60万人，澳大利亚约42万人，新西兰约13万人，南非约14万人，印度约130万人。",
            "consequence": "帝国兵力增强",
            "nextActId": "act-5"
        },
        {
            "id": "d8",
            "text": "在意大利战线和巴尔干战线增加投入，从侧翼突破。",
            "speaker": "我",
            "avatar": avatar,
            "score": 70,
            "triggeredEvent": "你建议加强侧翼战线。英国在意大利和巴尔干投入了更多兵力，但西线仍然是决定胜负的主战场。",
            "historicalNote": "一战中英法在意大利和巴尔干战场也投入了相当兵力。1918年9月协约国在马其顿战线发动反攻，保加利亚首先投降，拉开了同盟国崩溃的序幕。",
            "consequence": "侧翼战线推进",
            "nextActId": "act-5"
        },
        {
            "id": "d9",
            "text": "与美国协调战略，让美军作为独立力量参战。",
            "speaker": "我",
            "avatar": avatar,
            "score": 85,
            "triggeredEvent": "你建议与美国协调战略。美军总司令潘兴坚持美军作为独立力量作战，美军在1918年的反攻中发挥了关键作用。",
            "historicalNote": "美国远征军总司令潘兴坚持美军作为独立部队作战，而不是分散编入英法军队。1918年美军在圣米耶尔战役和默兹-阿尔贡攻势中表现出色。",
            "consequence": "美军独立参战",
            "nextActId": "act-5"
        }
    ]
}
data["acts"].append(act4)

# === 第 4b 幕：干涉俄国内战 ===
act4b = {
    "id": "act-4b",
    "title": "干涉俄国革命",
    "isKeyAct": False,
    "timeMarker": "1918年",
    "sceneDescription": "十月革命后，苏俄与德国媾和退出战争。协约国决定武装干涉俄国内战，支持白卫军推翻布尔什维克政权。英国派出了远征军，但干涉的前景并不明朗。",
    "npcDialogues": [
        {
            "speaker": "陆军大臣丘吉尔",
            "text": "布尔什维主义是欧洲的瘟疫，我们必须把它掐死在摇篮里。",
            "avatar": "丘"
        },
        {
            "speaker": "驻俄军事代表",
            "text": "白卫军内部混乱不堪，缺乏统一指挥，恐怕难以成事。",
            "avatar": "使"
        }
    ],
    "dialogues": [
        {
            "id": "d1",
            "text": "减少干涉投入，把兵力撤回西线用于对付德国。",
            "speaker": "我",
            "avatar": avatar,
            "score": 88,
            "triggeredEvent": "你建议减少干涉，集中力量对付德国。英国逐渐从俄国撤出更多兵力，干涉力度不断减弱。",
            "historicalNote": "协约国对苏俄的武装干涉始于1918年，但随着德国战败，干涉的动力逐渐减弱。1920年协约国军队相继撤出俄国，白卫军最终失败。",
            "consequence": "干涉力度减弱",
            "nextActId": "act-5"
        },
        {
            "id": "d2",
            "text": "加大对白卫军的物资援助，用英国人的武器让俄国人打俄国人。",
            "speaker": "我",
            "avatar": avatar,
            "score": 75,
            "triggeredEvent": "你建议用代理人方式干涉。英国向白卫军提供了大量武器装备，但白卫军的战斗力仍然令人失望。",
            "historicalNote": "协约国向白卫军提供了大量军事援助，包括武器、弹药、教官等。但白卫军内部派系林立、指挥混乱，最终还是被红军击败。",
            "consequence": "代理人战争效果差",
            "nextActId": "act-5"
        },
        {
            "id": "d3",
            "text": "直接派遣英军大规模参战，一举推翻布尔什维克。",
            "speaker": "我",
            "avatar": avatar,
            "score": 60,
            "triggeredEvent": "你主张大规模出兵。但英国民众已经厌倦了战争，军队士气低落，大规模出兵的建议遭到了广泛反对。",
            "historicalNote": "一战结束后英国民众普遍要求和平，继续战争干涉俄国内政不得人心。1919年英国军队中甚至出现了反战兵变。最终英国政府只能选择逐步撤出。",
            "consequence": "大规模出兵不可行",
            "nextActId": "act-5"
        },
        {
            "id": "d4",
            "text": "支持波兰对抗苏俄，利用波兰作为反共的桥头堡。",
            "speaker": "我",
            "avatar": avatar,
            "score": 78,
            "triggeredEvent": "你建议支持波兰。英国向波兰提供了军事援助，1920年波苏战争爆发，波兰在华沙战役中击败了红军。",
            "historicalNote": "1919-1921年波苏战争期间，协约国支持波兰。1920年红军兵临华沙城下，但波兰军队在维斯瓦河畔奇迹般地击败了红军，守住了独立。",
            "consequence": "波兰成为防波堤",
            "nextActId": "act-5"
        },
        {
            "id": "d5",
            "text": "对苏俄进行经济封锁，用经济手段压垮布尔什维克。",
            "speaker": "我",
            "avatar": avatar,
            "score": 72,
            "triggeredEvent": "你建议经济封锁。英国参与了对苏俄的经济封锁，苏俄经济面临严重困难，但布尔什维克政权并未因此垮台。",
            "historicalNote": "内战期间协约国对苏俄实施了经济封锁，给苏俄经济造成了严重困难。但苏俄通过战时共产主义政策和新经济政策逐步恢复了经济，封锁最终被打破。",
            "consequence": "经济封锁实施",
            "nextActId": "act-5"
        },
        {
            "id": "d6",
            "text": "承认苏俄，与其建交发展贸易，避免长期对抗。",
            "speaker": "我",
            "avatar": avatar,
            "score": 82,
            "triggeredEvent": "你建议承认苏俄。虽然当时没有立即实现，但1924年英国成为第一个承认苏联的西方大国。",
            "historicalNote": "1924年1月，英国工党政府承认苏联并与其建交，成为第一个承认苏联的西方大国。两国关系有所缓和，但意识形态的对立仍然根深蒂固。",
            "consequence": "承认苏俄提上日程",
            "nextActId": "act-5"
        },
        {
            "id": "d7",
            "text": "在波罗的海和黑海支持当地反共势力。",
            "speaker": "我",
            "avatar": avatar,
            "score": 68,
            "triggeredEvent": "你建议支持周边反共势力。波罗的海三国和芬兰成功独立，建立了反共政权，成为苏联与西方之间的缓冲国。",
            "historicalNote": "俄国内战期间，波罗的海三国（爱沙尼亚、拉脱维亚、立陶宛）和芬兰相继独立。这些国家在两次世界大战期间成为苏联与西方之间的缓冲地带。",
            "consequence": "缓冲国建立",
            "nextActId": "act-5"
        },
        {
            "id": "d8",
            "text": "从战略上围堵苏俄，建立封锁线遏制其向外扩张。",
            "speaker": "我",
            "avatar": avatar,
            "score": 70,
            "triggeredEvent": "你建议战略围堵。西方开始建立对苏俄的遏制体系，但两次世界大战之间的英国更关注经济恢复，遏制并不坚决。",
            "historicalNote": "十月革命后，西方资本主义国家对苏联采取了敌视和遏制政策。但两次世界大战之间，由于经济危机和法西斯崛起，这种遏制政策时紧时松。",
            "consequence": "遏制体系雏形",
            "nextActId": "act-5"
        },
        {
            "id": "d9",
            "text": "利用苏俄内部矛盾，支持反对派进行和平演变。",
            "speaker": "我",
            "avatar": avatar,
            "score": 65,
            "triggeredEvent": "你建议和平演变。英国情报机构开始与苏俄反对派接触，但苏俄的秘密警察力量强大，渗透效果有限。",
            "historicalNote": "西方国家从苏俄建立初期就试图通过各种手段颠覆其政权，包括支持反对派、进行宣传渗透等。但苏联的国家安全机构有效地抵御了这些渗透。",
            "consequence": "渗透效果有限",
            "nextActId": "act-5"
        }
    ]
}
data["acts"].append(act4b)

print(f"已生成前 {len(data['acts'])} 幕。继续生成中...")

# 保存第一部分
with open("w9-world-wars-partial.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("第一部分已保存到 w9-world-wars-partial.json")
