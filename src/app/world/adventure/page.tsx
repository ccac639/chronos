'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { sampleWorlds } from '@/data/sample-worlds';
import type { ParallelWorld, WorldChapter } from '@/data/world-data';

/* ── 游戏内部数据类型 ── */
interface GameDialogue {
  speaker: string;
  text: string;
  isNarrator?: boolean;
  camp?: string; // 阵营，用于对话气泡颜色
}

interface GameChoice {
  id: string;
  text: string;
  score: number;
  feedback: string;
  unlockInfo?: string;
}

interface GameAct {
  id: string;
  title: string;
  year: string;
  atmosphere: string;
  sceneDescription: string;
  dialogues: GameDialogue[];
  choices: GameChoice[];
}

type GamePhase = 'LOADING' | 'PROLOGUE' | 'CHARACTER_SELECT' | 'ACT_INTRO' | 'PLAYING' | 'ACT_END' | 'FINISHED' | 'SCORE_SCREEN';

/* ── 阵营颜色映射 ── */
const CAMP_COLORS: Record<string, string> = {
  '秦': 'var(--vermillion)',
  '赵': 'var(--azurite)',
  '楚': 'var(--malachite)',
  '齐': 'var(--gamboge)',
  '燕': 'var(--indigo-ancient)',
  '魏': 'var(--ochre)',
  '韩': 'var(--ink-light)',
  '匈奴': '#8B0000',
  '墨家': '#4a5568',
  '中立': 'var(--ink-medium)',
  '降封': '#6b7280',
  '残秦': 'var(--vermillion)',
  '汉流亡': 'var(--azurite)',
};

function getCampColor(speaker: string, world: ParallelWorld): string {
  if (speaker === '旁白') return 'transparent';
  for (const f of world.factions || []) {
    if (world.characterArcs?.some(c => c.name === speaker && c.faction === f.id)) {
      return CAMP_COLORS[f.id] || 'var(--ink-medium)';
    }
    if (f.name.includes(speaker)) return CAMP_COLORS[f.id] || 'var(--ink-medium)';
  }
  for (const ch of world.chapters) {
    for (const fig of ch.keyFigures) {
      if (fig.name === speaker) {
        const roleHint = fig.role;
        for (const key of Object.keys(CAMP_COLORS)) {
          if (roleHint.includes(key)) return CAMP_COLORS[key];
        }
      }
    }
  }
  return 'var(--ink-medium)';
}

/* ── 角色与阵营关系映射（用于确定对话视角的阵营色） ── */
const CHARACTER_FACTION: Record<string, string> = {
  '荆轲': '燕',
  '王翦': '残秦',
  '李斯': '残秦',
  '屈伯庸': '楚',
  '赵嘉': '赵',
};

/* ── 根据世界数据动态生成各幕对话和选项 ── */
function generateActs(world: ParallelWorld, playerChar: string): GameAct[] {
  return world.chapters.map((chapter: WorldChapter, idx: number) => {
    const dialogues: GameDialogue[] = [];

    // 场景描述（旁白叙述）
    if (chapter.narrative) {
      dialogues.push({
        speaker: '旁白',
        text: chapter.narrative,
        isNarrator: true,
      });
    }

    // 关键事件通过旁白补充
    if (chapter.keyEvents?.length) {
      const eventText = chapter.keyEvents.map((e, i) => `${i + 1}. ${e}`).join('\n');
      dialogues.push({
        speaker: '旁白',
        text: `【大事记】\n${eventText}`,
        isNarrator: true,
      });
    }

    // 关键人物对话（基于角色模板+章节数据程序化生成）
    const npcDialogues = generateNpcDialogues(chapter, playerChar, world, idx);
    dialogues.push(...npcDialogues);

    // 生成选择
    const choices = generateChoices(chapter, playerChar, world, idx);

    return {
      id: chapter.id,
      title: chapter.title,
      year: chapter.year,
      atmosphere: chapter.atmosphere,
      sceneDescription: chapter.narrative || chapter.summary,
      dialogues,
      choices,
    };
  });
}

/* ── NPC 对话生成逻辑：基于角色和事件，组合预设文学性台词 ── */
function generateNpcDialogues(
  chapter: WorldChapter,
  playerChar: string,
  world: ParallelWorld,
  chapterIndex: number,
): GameDialogue[] {
  const dialogues: GameDialogue[] = [];
  const figures = chapter.keyFigures || [];

  // 玩家角色自身相关台词（若玩家扮演的角色在本章出现）
  const playerFigure = figures.find(f => f.name === playerChar);
  if (playerFigure) {
    dialogues.push({
      speaker: playerFigure.name,
      text: generatePlayerSelfDialogue(playerFigure, chapter, chapterIndex),
      camp: CHARACTER_FACTION[playerFigure.name] || '',
    });
  }

  // 其他关键人物各说一句符合情境的话
  for (const figure of figures) {
    if (figure.name === playerChar) continue;
    dialogues.push({
      speaker: figure.name,
      text: generateFigureDialogue(figure, chapter, playerChar, chapterIndex),
      camp: CHARACTER_FACTION[figure.name] || '',
    });
  }

  return dialogues;
}

/* ── 预设文学性台词模板（战国风格） ── */
const DIALOGUE_TEMPLATES: Record<string, Record<number, string[]>> = {
  default: {
    0: [
      '此间风起云涌，吾辈当以此为始，纵使前路漫漫，亦不可退避半步。',
      '天命所归，岂在朝夕？今日之事，不过是百年棋局中落下的第一子。',
      '诸位，请随我来。这一步踏出去，便再无回头路可言。',
    ],
    1: [
      '宫中暗潮汹涌，前朝余烬未熄，我等不可不防。',
      '变局之中，唯有审时度势者方能存身。陛下初登大位，内外皆需安抚。',
      '这咸阳宫的每一块砖，都浸透了血。今日我坐在这龙椅之上，方知其沉重。',
    ],
    2: [
      '合纵之策，非为一时之利，乃为百年之计。诸君且听我一言。',
      '函谷关外，旌旗蔽日，六国精锐已集结于此。此战，将决定天下归属。',
      '燕虽偏远，然侠义之名已传遍列国。今日在此竖旗，便是向天下宣告——暴秦，将亡！',
    ],
    3: [
      '胡服骑射，乃武灵王遗志。今日我重拾此策，必令赵国铁骑踏遍天下。',
      '骑兵之利，在于快、准、狠。一息之间，可决生死。诸将务必牢记。',
      '北方的风已经变向了，秦人的噩梦，才刚刚开始。',
    ],
    4: [
      '楚辞之美，不在辞藻华丽，而在其承载了千百年来楚人的魂魄。',
      '祖父曾言："路漫漫其修远兮，吾将上下而求索。"今日吾方知此言之重。',
      '诗歌比刀剑更锋利，因为它刺入的是人心，而非血肉。',
    ],
    5: [
      '天下之理，非一家之言可尽。儒法墨道，各有所长，合而用之方为大道。',
      '兼爱非攻，非软弱之说，乃是大智。战争解决不了的问题，智慧或许可以。',
      '稷下学宫三百年，见过了太多兴衰。唯有思想，可以超越朝代的更迭。',
    ],
    6: [
      '炉中铁水翻涌，如巨龙翻身。此火不息，赵国便永不衰亡。',
      '冶铁之道，在于控火。人生亦是如此——火候不到，铁不成器。',
      '这新法炼出的铁，比从前好了三成不止。有了此铁，赵军便可横行天下。',
    ],
    7: [
      '商道如水，顺势而流。强行堵截，终有大溃之日。',
      '临淄城中，七万户人家的炊烟相望。一城之繁华，可敌一国。',
      '钱币虽小，却能调动千军万马。这便是商人的力量。',
    ],
    8: [
      '百年纷争，天下疲敝。今日七国会盟于此，非为一国之私，乃为万世之太平。',
      '联邦之议，虽各方争议，但方向已定。分权共治，方是华夏之福。',
      '洛阳旧宫重开，百年礼乐再起。这不仅是政治的转折，更是文明的延续。',
    ],
    9: [
      '匈奴铁骑，来势汹汹。雁门关一旦失守，中原门户洞开。',
      '传令全军，三排弩手轮射。此战不打退匈奴，我赵国便无退路！',
      '北方的风带着血腥味。联邦的援军若再不到，这雁门关便只能靠我们自己了。',
    ],
  },
};

function getTemplateDialogue(role: string, chapterIndex: number): string {
  const templates = DIALOGUE_TEMPLATES.default;
  const idx = Math.min(chapterIndex, Object.keys(templates).length - 1);
  const options = templates[idx] || templates[0];
  return options[Math.abs(hashCode(role)) % options.length];
}

function hashCode(s: string): number {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    const char = s.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash;
}

function generatePlayerSelfDialogue(
  figure: { name: string; role: string; description: string },
  chapter: WorldChapter,
  _chapterIndex: number,
): string {
  const name = figure.name;
  // 基于角色的个性化台词
  const selfDialogues: Record<string, string[]> = {
    '荆轲': [
      '风萧萧兮易水寒，壮士一去兮不复还。今日之事，成则天下变色，败则以身殉国。',
      '此匕首淬毒七日，锋利无匹。只要刺中嬴政一寸，天下便再无秦帝之梦。',
    ],
    '王翦': [
      '老夫一生为秦征战，灭了赵、燕、楚三国。如今嬴政已去，这统一之梦……怕是碎了。',
      '三十万大军在手，然而老夫的心却比这北方草原还要空旷。',
    ],
    '李斯': [
      '书同文、车同轨——这些不是暴政，是文明的基石。可惜，无人能理解。',
      '从丞相沦为丧家之犬，这世道的变化，比法典上的条文还要荒谬。',
    ],
    '屈伯庸': [
      '祖父的《离骚》，字字泣血。如今我站在郢都城头，方知他当年的痛楚。',
      '楚辞不只是文字，它是楚国的血脉。只要楚辞还在，楚国便不会亡。',
    ],
    '赵嘉': [
      '三年前我还是亡国太子，苟延残喘于代地。如今，我已站在函谷关外，身后是六国的旌旗。',
      '赵武灵王的遗志，在我手中延续。胡服骑射，不只是军制变革，更是一种精神的复兴。',
    ],
  };
  const options = selfDialogues[name] || [
    '局势如此，吾自有定夺。',
    '时也，命也。既然天命给了我这个位置，我便要把它坐稳。',
  ];
  return options[Math.abs(hashCode(chapter.id + name)) % options.length];
}

function generateFigureDialogue(
  figure: { name: string; role: string; description: string },
  chapter: WorldChapter,
  _playerChar: string,
  chapterIndex: number,
): string {
  // 特定角色的文学性台词
  const figureDialogues: Record<string, string[]> = {
    '嬴政': [
      '朕要将六国尽收版图，书同文、车同轨，使天下再无征战之苦。',
      '这荆轲不过蝼蚁，岂能撼动大秦根基？展图，让朕看看督亢的山川。',
    ],
    '扶苏': [
      '父亲血迹未干，我便坐上了这把龙椅。这份重量，比千斤还沉。',
      '赵高已除，但真正的威胁在函谷关外。六国一旦反扑，秦将如何自处？',
    ],
    '秦舞阳': [
      '我……我并非怯懦！只是这咸阳宫的气势太过……荆轲大哥，请让我与你同去！',
      '十二岁杀人时我不怕，但今日这殿上的杀气，比刀剑更让人胆寒。',
    ],
    '赵高': [
      '陛下，朝中人心浮动，须以雷霆手段定乱。此人——不可留。',
      '呵呵呵……权力这东西，就像案上的朱砂，握得越紧，越容易碎。',
    ],
    '燕太子丹': [
      '荆卿一去不复还，此恩此义，燕国永世不忘。',
      '侠义不是匹夫之勇，而是知其不可而为之的决绝。荆轲做到了，我们也要做到。',
    ],
    '李牧': [
      '匈奴之所以屡犯边境，非其兵力强盛，乃我守御之策尚有疏漏。',
      '兵法云：以逸待劳。赵军骑兵之利，在于机动与精准。非蛮力可胜。',
    ],
    '宋玉': [
      '屈伯庸之才，不输其祖。今日这《刺秦行》，当为千古绝唱。',
      '辞赋之美，在于言有尽而意无穷。好诗，不在于华丽，而在于它让读者落泪。',
    ],
    '田氏商贾': [
      '临淄海盐，天下无双。这批货若能走通朝鲜航线，利润至少翻三倍。',
      '商道之大，可敌军道。一船盐换万匹马，这便是财富的力量。',
    ],
    '大梁钱庄主': [
      '各国货币杂乱，汇率一日三变。若能统一度量衡，天下商道将畅通无阻。',
      '钱非万能，然无钱万万不能。联邦之议，说到底也是一笔账。',
    ],
    '赵国北将': [
      '雁门关不破，赵国便不亡。守！给老子死守！',
      '匈奴铁骑虽猛，然我赵军弩阵更利。三排轮射，百步之内，寸草不生。',
    ],
    '匈奴单于': [
      '中原人以为我们只知劫掠，殊不知，我们也在学习。冶铁、骑射、阵法——这些我都要。',
      '草原虽辽阔，然水草有限。向南，是我们唯一的出路。',
    ],
    '墨家巨子': [
      '兼爱非攻，非空谈也。墨者守城百战百胜，靠的不是刀剑，而是机关与智慧。',
      '技以利天下，此乃墨家之道。铁器革命若能惠及百姓，方为正途。',
    ],
    '荀子后学': [
      '隆礼重法，礼以养心，法以齐民。两者缺一，天下必乱。',
      '人性本恶，然可化也。教化与法度并行，方是治国之大道。',
    ],
  };

  // 如果有特定台词就用，否则从模板中取
  if (figureDialogues[figure.name]) {
    const options = figureDialogues[figure.name];
    return options[Math.abs(hashCode(chapter.id + figure.name)) % options.length];
  }

  return getTemplateDialogue(figure.name, chapterIndex);
}

/* ── 玩家选择生成 ── */
function generateChoices(
  chapter: WorldChapter,
  _playerChar: string,
  _world: ParallelWorld,
  _chapterIndex: number,
): GameChoice[] {
  // 预设每个章节的选项（基于章节主题和玩家角色）
  const chapterChoices: Record<string, GameChoice[]> = {
    'jk-ch-1': [
      {
        id: 'jk-1-a',
        text: '沉着应对，按照计划行动——匕首刺出，不留余地',
        score: 10,
        feedback: '你屏息凝神，手指在丝帛上滑过的最后一刻，寒光乍现。匕首稳稳刺入嬴政胸膛。这一刻，易水之畔的誓言得以兑现。你获得了「一击必杀」历史碎片。',
        unlockInfo: '解锁：荆轲刺秦的完整细节——徐夫人匕首的淬毒配方与督亢地图中暗藏的机关',
      },
      {
        id: 'jk-1-b',
        text: '犹豫片刻，试图先制服嬴政而非直接刺杀',
        score: 6,
        feedback: '你的一丝犹豫让嬴政有了挣脱的间隙。虽然最终仍刺中了目标，但过程远比计划中艰难。你获得了「险中求胜」历史碎片。',
        unlockInfo: '解锁：嬴政的近身护卫配置——秦宫侍卫的换防时间与暗哨位置',
      },
      {
        id: 'jk-1-c',
        text: '放弃任务，向秦王坦白一切',
        score: 2,
        feedback: '你放下了匕首，跪地请罪。嬴政冷笑着看着你，然后挥了挥手。你的命运在那一刻已经注定——但历史也因此走向了完全不同的方向。你获得了「另辟蹊径」历史碎片。',
        unlockInfo: '解锁：如果荆轲放弃刺杀，燕国可能的命运——太子丹的后续计划',
      },
    ],
    'jk-ch-2': [
      {
        id: 'jk-2-a',
        text: '迅速稳固朝堂，安抚群臣，先稳内再图外',
        score: 10,
        feedback: '你以雷霆手段平定内乱，诛杀赵高余党，同时厚赏拥戴之臣。朝堂渐归安宁，但函谷关外的威胁如同乌云压顶。你获得了「拨乱反正」历史碎片。',
        unlockInfo: '解锁：扶苏执政理念——仁政与法家的折中方案',
      },
      {
        id: 'jk-2-b',
        text: '召回王翦，以重兵威慑关东六国',
        score: 7,
        feedback: '你连发三道诏书召王翦回咸阳，但老将军始终按兵不动。你意识到，真正能掌控的只有眼前的朝堂。你获得了「遥控大军」历史碎片。',
        unlockInfo: '解锁：王翦拥兵自重的深层原因——他对嬴政之死的真实态度',
      },
      {
        id: 'jk-2-c',
        text: '主动示弱，与六国展开和谈',
        score: 4,
        feedback: '你遣使向关东示好，然而六国并不领情。他们嗅到了秦国的虚弱，开始酝酿更大的攻势。你获得了「以退为进」历史碎片。',
      },
    ],
    'jk-ch-3': [
      {
        id: 'jk-3-a',
        text: '高举合纵大旗，号召六国联军共击函谷关',
        score: 10,
        feedback: '你的声音在旷野中回荡，六国将士闻之振奋。函谷关虽坚，但六国联军的气势更盛。合纵联盟正式成型，一个新的时代开始了。你获得了「合纵盟主」历史碎片。',
        unlockInfo: '解锁：合纵联盟的军事部署——六国兵力的配比与协同作战方案',
      },
      {
        id: 'jk-3-b',
        text: '稳扎稳打，先巩固后方再图关中',
        score: 7,
        feedback: '你没有急于进攻，而是先巩固各国联盟。虽然进展缓慢，但联盟更加稳固，内部的分歧也在协商中逐渐弥合。你获得了「步步为营」历史碎片。',
        unlockInfo: '解锁：六国内部的分歧与妥协——各国利益分配的博弈',
      },
      {
        id: 'jk-3-c',
        text: '分化瓦解，逐个拉拢秦国周边的守将',
        score: 5,
        feedback: '你派人秘密接触函谷关守将，试图以利诱之。但秦军的忠诚度超乎想象，你的计策只取得了有限的效果。你获得了「渗透瓦解」历史碎片。',
      },
    ],
    'jk-ch-4': [
      {
        id: 'jk-4-a',
        text: '全力推行胡服骑射改革，以铁血手腕扫除阻力',
        score: 10,
        feedback: '你以雷霆之势推行改革，削弱贵族特权，提拔军功将领。赵国骑兵在你的淬炼下成为天下最强战力。铁骑奔腾之声，震动天下。你获得了「铁血改革」历史碎片。',
        unlockInfo: '解锁：赵武灵王改革的全貌——从服饰到军制的系统性变革',
      },
      {
        id: 'jk-4-b',
        text: '亲率骑兵突袭秦国河西，以战代练',
        score: 8,
        feedback: '你亲率骑兵突袭河西，秦军措手不及。这场胜利不仅缴获了大量物资，更极大地提振了赵军士气。你获得了「河西大捷」历史碎片。',
      },
      {
        id: 'jk-4-c',
        text: '注重内政发展，先富国再强兵',
        score: 5,
        feedback: '你将重心放在农业和马政建设上，虽然军事进展较慢，但赵国的根基更加稳固。你获得了「藏富于民」历史碎片。',
      },
    ],
    'jk-ch-5': [
      {
        id: 'jk-5-a',
        text: '创立新楚辞学派，以诗歌征服列国人心',
        score: 10,
        feedback: '你在郢都创立"新楚辞"学派，将屈原的浪漫主义与时代变革完美融合。首届天下诗会上，你的《刺秦行》轰动列国，楚辞成为时代最强音。你获得了「辞赋圣手」历史碎片。',
        unlockInfo: '解锁：《刺秦行》全文——屈伯庸以荆轲刺秦为题材创作的长篇史诗',
      },
      {
        id: 'jk-5-b',
        text: '以外交手段推广楚文化，派遣学者游历各国',
        score: 7,
        feedback: '你派出大批学者游历列国，传播楚文化与楚辞。虽然影响力不及一次诗会来得猛烈，但这种润物细无声的方式，让楚国在列国间积累了深厚的文化好感。你获得了「文化使节」历史碎片。',
      },
      {
        id: 'jk-5-c',
        text: '专注创作，不理会政治与外交',
        score: 4,
        feedback: '你隐居云梦泽畔，专注于楚辞创作。虽然个人文学成就达到了新的高度，但楚国的文化影响力扩张速度放缓。你获得了「隐士诗人」历史碎片。',
      },
    ],
    'jk-ch-6': [
      {
        id: 'jk-6-a',
        text: '推动儒法合流，以兼容并蓄的理念引领思想界',
        score: 10,
        feedback: '你的兼容并蓄之论在稷下学宫引起了巨大反响。儒法合流学派正式成立，百年争鸣迎来了新的篇章。思想的力量，终将改变天下的格局。你获得了「百家宗师」历史碎片。',
        unlockInfo: '解锁：儒法合流的核心论点——《礼法论》的要点摘要',
      },
      {
        id: 'jk-6-b',
        text: '支持墨家复兴，以兼爱非攻化解列国纷争',
        score: 7,
        feedback: '你大力支持墨家的社会实验，在各国推行兼爱理念。虽然未能完全化解纷争，但墨家的机关术为各国带来了实用的技术进步。你获得了「兼爱使者」历史碎片。',
      },
      {
        id: 'jk-6-c',
        text: '保持观望，让各家自由争鸣',
        score: 4,
        feedback: '你选择不干涉学术争鸣，让各家自由发展。虽然思想界因此更加多元，但缺乏引领者，百家争鸣始终未能形成合力。你获得了「旁观者」历史碎片。',
      },
    ],
    'jk-ch-7': [
      {
        id: 'jk-7-a',
        text: '大力投资冶铁技术，建立官营铁坊体系',
        score: 10,
        feedback: '你亲自督办高炉建设，焦炭冶炼法取得突破。铁产量翻两番，赵国的兵器质量冠绝天下。铁器革命的浪潮，从赵国席卷整个华夏。你获得了「铁器革命」历史碎片。',
        unlockInfo: '解锁：焦炭冶炼法的完整工艺——从选矿到成铁的七十二道工序',
      },
      {
        id: 'jk-7-b',
        text: '与墨家合作，将冶铁与机关术结合',
        score: 8,
        feedback: '你与墨家匠师联手，将新式铁材应用于机关术。半自动弩机由此诞生，攻防格局为之一变。你获得了「铁墨联盟」历史碎片。',
      },
      {
        id: 'jk-7-c',
        text: '保守铁器秘密，不与其他国共享',
        score: 3,
        feedback: '你下令封锁冶铁技术，严禁外传。短期内赵国的军事优势得以保持，但长远来看，技术封锁也限制了赵国获取他国先进技术的机会。你获得了「闭关锁技」历史碎片。',
      },
    ],
    'jk-ch-8': [
      {
        id: 'jk-8-a',
        text: '推动跨国贸易协定，建立统一商业体系',
        score: 10,
        feedback: '你力主各国签署通商协定，统一部分度量衡标准。跨国钱庄遍地开花，商业网络覆盖整个华夏。一个前所未有的商业文明正在崛起。你获得了「商道通衢」历史碎片。',
        unlockInfo: '解锁：跨国钱庄的运作模式——汇率制度与信用体系的雏形',
      },
      {
        id: 'jk-8-b',
        text: '发展海上贸易，开辟朝鲜半岛和日本航线',
        score: 7,
        feedback: '你资助航海探险，开辟了通往朝鲜半岛和日本列岛的新航线。海上贸易为齐国带来了巨额财富，也促进了文化交流。你获得了「海上丝路」历史碎片。',
      },
      {
        id: 'jk-8-c',
        text: '加强商业管制，以国家力量主导贸易',
        score: 5,
        feedback: '你加强了对商业的管控，国家垄断了重要物资的贸易。虽然国库充盈，但民间的商业活力受到了压制。你获得了「官商垄断」历史碎片。',
      },
    ],
    'jk-ch-9': [
      {
        id: 'jk-9-a',
        text: '全力推动联邦方案，主动让渡部分权力',
        score: 10,
        feedback: '你在洛阳会盟上以大局为重，主动让渡部分权力换取联邦的建立。各国深受感动，联邦框架初步成型。这是华夏文明的转折点——分裂中孕育着新的统一。你获得了「联邦缔造者」历史碎片。',
        unlockInfo: '解锁：联邦宪法草案的核心条款——分权共治的制度设计',
      },
      {
        id: 'jk-9-b',
        text: '坚持本国利益最大化，在谈判中寸步不让',
        score: 6,
        feedback: '你在谈判中据理力争，为本国争取了最大利益。联邦虽然建立，但内部的分歧始终存在，各方的信任还需要时间来建立。你获得了「铁腕谈判」历史碎片。',
      },
      {
        id: 'jk-9-c',
        text: '提出折中方案，试图平衡各方诉求',
        score: 8,
        feedback: '你的折中方案虽然各方都不完全满意，但都勉强接受。联邦在妥协中诞生，这或许才是政治的真实面貌。你获得了「和事佬」历史碎片。',
      },
    ],
    'jk-ch-10': [
      {
        id: 'jk-10-a',
        text: '亲赴前线指挥作战，以血肉之躯守卫雁门关',
        score: 10,
        feedback: '你跨上战马，亲赴雁门关前线。在你的指挥下，赵军与联邦援军联手，击退了匈奴的第一波攻势。风沙之中，你的旗帜依然飘扬。你获得了「雁门守将」历史碎片。',
        unlockInfo: '解锁：雁门关之战的完整经过——三排弩阵与骑兵营的协同战术',
      },
      {
        id: 'jk-10-b',
        text: '向联邦求援，推动联合作战方案',
        score: 8,
        feedback: '你紧急呼吁联邦各城邦出兵增援。虽然援军姗姗来迟，但在联合作战方案下，匈奴的攻势终于被遏制。联邦的凝聚力在战火中经受了考验。你获得了「联邦统帅」历史碎片。',
      },
      {
        id: 'jk-10-c',
        text: '以和谈拖延时间，争取备战窗口',
        score: 5,
        feedback: '你派出使者与匈奴和谈，争取了宝贵的备战时间。然而匈奴单于识破了你的计策，和谈破裂后匈奴的进攻更加猛烈。你获得了「缓兵之计」历史碎片。',
      },
    ],
  };

  return chapterChoices[chapter.id] || [
    {
      id: `${chapter.id}-a`,
      text: '审时度势，做出最有利的选择',
      score: 10,
      feedback: '你的判断精准而果断，在这场历史的变局中做出了正确的抉择。',
    },
    {
      id: `${chapter.id}-b`,
      text: '谨慎行事，等待更好的时机',
      score: 6,
      feedback: '你的谨慎虽然错失了一些机会，但也避免了不必要的风险。',
    },
    {
      id: `${chapter.id}-c`,
      text: '放手一搏，不留后路',
      score: 4,
      feedback: '你的冒险之举虽然惊心动魄，但结果并不如预期。',
    },
  ];
}

/* ── 评级计算 ── */
function calculateGrade(totalScore: number, maxScore: number, chaptersCompleted: number, totalChapters: number): string {
  const scoreRatio = totalScore / maxScore;
  const completionRatio = chaptersCompleted / totalChapters;
  const overall = scoreRatio * 0.7 + completionRatio * 0.3;

  if (overall >= 0.9) return 'S';
  if (overall >= 0.75) return 'A';
  if (overall >= 0.6) return 'B';
  if (overall >= 0.4) return 'C';
  return 'D';
}

/* ── 打字机效果 Hook ── */
function useTypewriter(text: string, speed: number = 30) {
  const [displayed, setDisplayed] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed('');
    setIsComplete(false);
    indexRef.current = 0;

    if (!text) {
      setIsComplete(true);
      return;
    }

    const timer = setInterval(() => {
      indexRef.current += 1;
      setDisplayed(text.slice(0, indexRef.current));
      if (indexRef.current >= text.length) {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  const skip = useCallback(() => {
    setDisplayed(text);
    setIsComplete(true);
    indexRef.current = text.length;
  }, [text]);

  return { displayed, isComplete, skip };
}

/* ── 数字滚动动画 Hook ── */
function useCountUp(target: number, duration: number = 1500) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === 0) { setValue(0); return; }
    const startTime = Date.now();
    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return value;
}

/* ══════════════════════════════════════════════════════════
   主页面组件
   ══════════════════════════════════════════════════════════ */
export default function AdventurePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const worldId = searchParams.get('world') || '';

  const [phase, setPhase] = useState<GamePhase>('LOADING');
  const [world, setWorld] = useState<ParallelWorld | null>(null);
  const [playerChar, setPlayerChar] = useState('');
  const [acts, setActs] = useState<GameAct[]>([]);
  const [currentActIdx, setCurrentActIdx] = useState(0);
  const [currentDialogueIdx, setCurrentDialogueIdx] = useState(0);
  const [showChoices, setShowChoices] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [fragments, setFragments] = useState<string[]>([]);
  const [dialogueLog, setDialogueLog] = useState<Array<{ speaker: string; text: string; isNarrator?: boolean; camp?: string }>>([]);
  const [choiceFeedback, setChoiceFeedback] = useState<string | null>(null);
  const [choiceUnlock, setChoiceUnlock] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const { displayed: prologueDisplayed, isComplete: prologueComplete, skip: skipPrologue } = useTypewriter(world?.prologue || '', 28);
  const { displayed: dialogueDisplayed, isComplete: dialogueComplete, skip: skipDialogue } = useTypewriter(
    (phase === 'PLAYING' && acts[currentActIdx]?.dialogues[currentDialogueIdx]?.text) || '',
    30,
  );

  // 加载世界数据
  useEffect(() => {
    if (!worldId) return;
    const found = sampleWorlds.find(w => w.id === worldId);
    if (found) {
      setWorld(found);
      setPhase('PROLOGUE');
    }
  }, [worldId]);

  // 滚动到底部
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dialogueLog.length, dialogueDisplayed]);

  // 对话完成后自动推进
  useEffect(() => {
    if (phase !== 'PLAYING' || !dialogueComplete) return;
    const act = acts[currentActIdx];
    if (!act) return;
    const isLastDialogue = currentDialogueIdx >= act.dialogues.length - 1;
    if (isLastDialogue) {
      setTimeout(() => setShowChoices(true), 600);
    }
  }, [dialogueComplete, phase, currentDialogueIdx, acts, currentActIdx]);

  // 可选角色列表
  const selectableCharacters = useMemo(() => {
    if (!world) return [];
    const charSet = new Set<string>();
    world.characterArcs?.forEach(arc => charSet.add(arc.name));
    world.chapters.forEach(ch => ch.keyFigures.forEach(f => charSet.add(f.name)));
    return Array.from(charSet);
  }, [world]);

  // 最大分数
  const maxScore = useMemo(() => {
    return acts.reduce((sum, act) => {
      const maxChoice = Math.max(...act.choices.map(c => c.score), 0);
      return sum + maxChoice;
    }, 0);
  }, [acts]);

  // 开始游戏
  const startGame = useCallback((charName: string) => {
    if (!world) return;
    setPlayerChar(charName);
    const generatedActs = generateActs(world, charName);
    setActs(generatedActs);
    setCurrentActIdx(0);
    setCurrentDialogueIdx(0);
    setTotalScore(0);
    setFragments([]);
    setDialogueLog([]);
    setChoiceFeedback(null);
    setChoiceUnlock(null);
    setShowChoices(false);
    setPhase('ACT_INTRO');
  }, [world]);

  // 进入章节游戏
  const enterAct = useCallback(() => {
    setCurrentDialogueIdx(0);
    setShowChoices(false);
    setDialogueLog([]);
    setChoiceFeedback(null);
    setChoiceUnlock(null);
    setPhase('PLAYING');
  }, []);

  // 推进对话
  const advanceDialogue = useCallback(() => {
    const act = acts[currentActIdx];
    if (!act) return;

    if (!dialogueComplete) {
      skipDialogue();
      return;
    }

    const dialogue = act.dialogues[currentDialogueIdx];
    if (dialogue) {
      setDialogueLog(prev => [...prev, dialogue]);
    }

    if (currentDialogueIdx < act.dialogues.length - 1) {
      setCurrentDialogueIdx(prev => prev + 1);
    } else {
      // 对话结束，显示选项
      setShowChoices(true);
    }
  }, [acts, currentActIdx, currentDialogueIdx, dialogueComplete, skipDialogue]);

  // 做出选择
  const makeChoice = useCallback((choice: GameChoice) => {
    setTotalScore(prev => prev + choice.score);
    setFragments(prev => [...prev, `【${acts[currentActIdx]?.title}】${choice.feedback.split('。')[0]}`]);
    setChoiceFeedback(choice.feedback);
    setChoiceUnlock(choice.unlockInfo || null);

    // 延迟后进入下一章或结束
    setTimeout(() => {
      if (currentActIdx < acts.length - 1) {
        setPhase('ACT_END');
      } else {
        setPhase('FINISHED');
      }
    }, 3000);
  }, [acts, currentActIdx]);

  // 进入下一章
  const nextAct = useCallback(() => {
    setCurrentActIdx(prev => prev + 1);
    setChoiceFeedback(null);
    setChoiceUnlock(null);
    setPhase('ACT_INTRO');
  }, []);

  // 重新开始
  const restart = useCallback(() => {
    setPhase('CHARACTER_SELECT');
    setCurrentActIdx(0);
    setTotalScore(0);
    setFragments([]);
  }, []);

  // 返回世界列表
  const goBack = useCallback(() => {
    router.push('/world');
  }, [router]);

  // 评分数据
  const grade = useMemo(() => {
    if (phase !== 'SCORE_SCREEN' && phase !== 'FINISHED') return 'D';
    return calculateGrade(totalScore, maxScore, acts.length, acts.length);
  }, [phase, totalScore, maxScore, acts.length]);

  const animatedScore = useCountUp(phase === 'SCORE_SCREEN' ? totalScore : 0);
  const animatedFragments = useCountUp(phase === 'SCORE_SCREEN' ? fragments.length : 0);

  /* ── 加载中 ── */
  if (phase === 'LOADING' || !world) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center"
        style={{ background: 'var(--ink-deepest)', color: 'var(--xuan)' }}>
        <div className="seal-stamp mb-6" style={{ fontSize: '1.25rem' }}>CHRONOS</div>
        <div className="animate-breathe" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', opacity: 0.8 }}>
          正在加载平行世界...
        </div>
        <div className="progress-ink mt-6" style={{ width: '12rem' }}>
          <div className="progress-ink-fill" style={{ width: '60%', animation: 'shimmer 1.5s linear infinite' }} />
        </div>
      </div>
    );
  }

  /* ── 序章 ── */
  if (phase === 'PROLOGUE') {
    return (
      <div className="fixed inset-0 flex flex-col" style={{ background: 'var(--ink-deepest)', color: 'var(--xuan)' }}>
        {/* 装饰性水墨纹理 */}
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(ellipse at 30% 20%, rgba(46,134,193,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(231,76,60,0.1) 0%, transparent 50%)',
          }}
        />

        <div className="relative z-10 flex flex-col h-full">
          {/* 顶部标题 */}
          <div className="pt-12 pb-6 px-6 text-center">
            <div className="seal-stamp mb-4" style={{ borderColor: 'var(--vermillion)', color: 'var(--vermillion)' }}>
              平行世界
            </div>
            <h1 className="text-gold-shimmer" style={{ fontFamily: 'var(--font-brush)', fontSize: '1.75rem' }}>
              {world.name}
            </h1>
            <p className="mt-2 text-sm opacity-60" style={{ fontFamily: 'var(--font-serif)' }}>
              {world.tagline}
            </p>
          </div>

          {/* 序章文字 */}
          <div className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-hide">
            <div className="animate-fade-in-down" style={{ animationDelay: '0.3s' }}>
              <h2 className="mb-4 text-sm font-semibold opacity-50" style={{ fontFamily: 'var(--font-sans)' }}>
                ── 序章 ──
              </h2>
              <div
                className="prose-chronos text-base leading-relaxed"
                style={{ color: 'var(--gamboge-light)', textIndent: '2em' }}
                onClick={() => { if (!prologueComplete) skipPrologue(); }}
              >
                {prologueDisplayed}
                {!prologueComplete && <span className="inline-block w-0.5 h-4 ml-1 align-middle" style={{ background: 'var(--gamboge)', animation: 'breathe 1s infinite' }} />}
              </div>
            </div>
          </div>

          {/* 继续按钮 */}
          {prologueComplete && (
            <div className="p-6 animate-slide-in-up">
              <button
                className="w-full py-3 rounded-lg tap-bounce font-semibold text-base"
                style={{
                  background: 'linear-gradient(135deg, var(--vermillion), var(--vermillion-deep))',
                  color: 'var(--xuan)',
                  fontFamily: 'var(--font-serif)',
                  boxShadow: 'var(--shadow-glow-vermillion)',
                }}
                onClick={() => setPhase('CHARACTER_SELECT')}
              >
                选择角色，踏入历史
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ── 角色选择 ── */
  if (phase === 'CHARACTER_SELECT') {
    return (
      <div className="fixed inset-0 flex flex-col" style={{ background: 'var(--ink-deepest)', color: 'var(--xuan)' }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(ellipse at 50% 30%, rgba(241,196,15,0.12) 0%, transparent 60%)',
          }}
        />

        <div className="relative z-10 flex flex-col h-full">
          <div className="pt-10 pb-4 px-6 text-center">
            <h2 className="mb-2" style={{ fontFamily: 'var(--font-brush)', fontSize: '1.5rem', color: 'var(--gamboge-light)' }}>
              选择你的角色
            </h2>
            <p className="text-sm opacity-50" style={{ fontFamily: 'var(--font-serif)' }}>
              你将以这个角色的视角经历这段历史
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-6 scrollbar-hide">
            <div className="grid gap-3 max-w-md mx-auto">
              {selectableCharacters.map((charName, idx) => {
                const arc = world!.characterArcs?.find(a => a.name === charName);
                const faction = CHARACTER_FACTION[charName] || '';
                const borderColor = CAMP_COLORS[faction] || 'var(--ink-medium)';

                return (
                  <button
                    key={charName}
                    className="card-xuan tap-bounce animate-slide-in-up text-left p-4 rounded-xl"
                    style={{
                      animationDelay: `${idx * 0.08}s`,
                      borderColor: borderColor,
                      borderWidth: '1px',
                      background: 'linear-gradient(135deg, var(--ink-dark), rgba(30,35,44,0.95))',
                    }}
                    onClick={() => startGame(charName)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
                        style={{
                          background: borderColor,
                          color: 'var(--xuan)',
                          fontFamily: 'var(--font-brush)',
                          boxShadow: `0 0 12px ${borderColor}40`,
                        }}
                      >
                        {charName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--xuan)', fontSize: '1.05rem' }}>
                            {charName}
                          </span>
                          {arc && (
                            <span className="text-xs px-2 py-0.5 rounded"
                              style={{ background: `${borderColor}20`, color: borderColor, border: `1px solid ${borderColor}40` }}
                            >
                              {faction}
                            </span>
                          )}
                        </div>
                        {arc && (
                          <p className="text-xs mt-1 opacity-50" style={{ fontFamily: 'var(--font-serif)' }}>
                            {arc.title}
                          </p>
                        )}
                      </div>
                    </div>
                    {arc && (
                      <p className="mt-2 text-xs leading-relaxed opacity-40" style={{ fontFamily: 'var(--font-serif)', textIndent: '2em' }}>
                        {arc.backstory.slice(0, 60)}...
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── 章节开场 ── */
  if (phase === 'ACT_INTRO') {
    const act = acts[currentActIdx];
    if (!act) return null;
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center"
        style={{ background: 'var(--ink-deepest)', color: 'var(--xuan)' }}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(ellipse at 50% 50%, rgba(46,134,193,0.15) 0%, transparent 60%)',
          }}
        />

        <div className="relative z-10 text-center px-6 animate-mountain-fade">
          <div className="text-xs opacity-40 mb-2" style={{ fontFamily: 'var(--font-sans)' }}>
            第 {currentActIdx + 1} 幕 / 共 {acts.length} 幕
          </div>
          <h2 className="text-gold-shimmer mb-3" style={{ fontFamily: 'var(--font-brush)', fontSize: '2rem' }}>
            {act.title}
          </h2>
          <div className="text-sm opacity-50 mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
            {act.year}
          </div>
          <div className="max-w-xs mx-auto text-xs leading-relaxed opacity-30 italic"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {act.atmosphere}
          </div>

          {/* 进度指示 */}
          <div className="mt-8 flex justify-center gap-1.5">
            {acts.map((_, i) => (
              <div key={i} className="rounded-full transition-all duration-500"
                style={{
                  width: i === currentActIdx ? '2rem' : '0.5rem',
                  height: '0.375rem',
                  background: i <= currentActIdx ? 'var(--gamboge)' : 'var(--ink-medium)',
                  opacity: i === currentActIdx ? 1 : 0.4,
                }}
              />
            ))}
          </div>
        </div>

        <button
          className="absolute bottom-12 px-8 py-3 rounded-lg tap-bounce animate-slide-in-up"
          style={{
            background: 'linear-gradient(135deg, var(--azurite), var(--azurite-deep))',
            color: 'var(--xuan)',
            fontFamily: 'var(--font-serif)',
            boxShadow: 'var(--shadow-glow-azurite)',
          }}
          onClick={enterAct}
        >
          开启此幕
        </button>
      </div>
    );
  }

  /* ── 游戏进行中 ── */
  if (phase === 'PLAYING') {
    const act = acts[currentActIdx];
    if (!act) return null;
    const currentDialogue = act.dialogues[currentDialogueIdx];

    return (
      <div className="fixed inset-0 flex flex-col" style={{ background: 'var(--ink-deepest)', color: 'var(--xuan)' }}>
        {/* 顶部信息栏 */}
        <div className="flex-shrink-0 px-4 py-3 flex items-center justify-between"
          style={{ background: 'linear-gradient(180deg, var(--ink-deeest, var(--ink-deepest)), transparent)', borderBottom: '1px solid var(--ink-medium)' }}
        >
          <div className="flex items-center gap-2">
            <div className="text-xs opacity-40" style={{ fontFamily: 'var(--font-sans)' }}>
              {act.year}
            </div>
            <div className="text-xs font-semibold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--gamboge-light)' }}>
              {act.title}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs opacity-50 flex items-center gap-1">
              <span style={{ color: 'var(--gamboge)' }}>&#9670;</span>
              {totalScore}
            </div>
            <div className="text-xs opacity-40">
              {currentActIdx + 1}/{acts.length}
            </div>
          </div>
        </div>

        {/* 对话区域 */}
        <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide">
          {/* 已显示的对话历史 */}
          {dialogueLog.map((log, idx) => (
            <div key={idx} className="mb-4 animate-slide-in-up" style={{ animationDelay: `${idx * 0.05}s` }}>
              {log.isNarrator ? (
                <div className="p-4 rounded-lg mb-2" style={{
                  background: 'linear-gradient(135deg, rgba(22,27,34,0.9), rgba(13,15,20,0.95))',
                  borderLeft: '3px solid var(--gamboge)',
                }}>
                  <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-serif)', color: 'var(--gamboge-light)', textIndent: '2em' }}>
                    {log.text}
                  </p>
                </div>
              ) : (
                <div className="mb-2">
                  <div className="text-xs font-semibold mb-1 flex items-center gap-2" style={{ fontFamily: 'var(--font-serif)', color: log.camp || 'var(--ink-light)' }}>
                    <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: log.camp || 'var(--ink-light)' }} />
                    {log.speaker}
                  </div>
                  <div className="relative p-3 rounded-xl max-w-[85%] ml-6" style={{
                    background: 'linear-gradient(135deg, rgba(48,54,61,0.6), rgba(22,27,34,0.8))',
                    border: `1px solid ${log.camp || 'var(--ink-medium)'}30`,
                    boxShadow: `0 2px 8px ${log.camp || 'var(--ink-medium)'}15`,
                  }}>
                    {/* 对话气泡三角 */}
                    <div className="absolute -left-1 top-4 w-2 h-2 rotate-45"
                      style={{ background: 'rgba(48,54,61,0.6)', borderLeft: `1px solid ${log.camp || 'var(--ink-medium)'}30`, borderBottom: `1px solid ${log.camp || 'var(--ink-medium)'}30` }}
                    />
                    <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink-faint)' }}>
                      {log.text}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* 当前正在显示的对话 */}
          {currentDialogue && !showChoices && (
            <div className="mb-4 animate-fade-in-down">
              {currentDialogue.isNarrator ? (
                <div className="p-4 rounded-lg" style={{
                  background: 'linear-gradient(135deg, rgba(22,27,34,0.9), rgba(13,15,20,0.95))',
                  borderLeft: '3px solid var(--gamboge)',
                }}>
                  <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-serif)', color: 'var(--gamboge-light)', textIndent: '2em' }}
                    onClick={() => { if (!dialogueComplete) skipDialogue(); else advanceDialogue(); }}
                  >
                    {dialogueDisplayed}
                    {!dialogueComplete && <span className="inline-block w-0.5 h-4 ml-1 align-middle" style={{ background: 'var(--gamboge)', animation: 'breathe 1s infinite' }} />}
                  </p>
                  {dialogueComplete && (
                    <p className="text-xs text-right mt-2 opacity-30">点击继续</p>
                  )}
                </div>
              ) : (
                <div>
                  <div className="text-xs font-semibold mb-1 flex items-center gap-2" style={{ fontFamily: 'var(--font-serif)', color: currentDialogue.camp || 'var(--ink-light)' }}>
                    <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: currentDialogue.camp || 'var(--ink-light)' }} />
                    {currentDialogue.speaker}
                  </div>
                  <div className="relative p-3 rounded-xl max-w-[85%] ml-6" style={{
                    background: 'linear-gradient(135deg, rgba(48,54,61,0.6), rgba(22,27,34,0.8))',
                    border: `1px solid ${currentDialogue.camp || 'var(--ink-medium)'}30`,
                    boxShadow: `0 2px 8px ${currentDialogue.camp || 'var(--ink-medium)'}15`,
                  }}
                    onClick={() => { if (!dialogueComplete) skipDialogue(); else advanceDialogue(); }}
                  >
                    <div className="absolute -left-1 top-4 w-2 h-2 rotate-45"
                      style={{ background: 'rgba(48,54,61,0.6)', borderLeft: `1px solid ${currentDialogue.camp || 'var(--ink-medium)'}30`, borderBottom: `1px solid ${currentDialogue.camp || 'var(--ink-medium)'}30` }}
                    />
                    <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink-faint)' }}>
                      {dialogueDisplayed}
                      {!dialogueComplete && <span className="inline-block w-0.5 h-4 ml-1 align-middle" style={{ background: currentDialogue.camp || 'var(--ink-light)', animation: 'breathe 1s infinite' }} />}
                    </p>
                    {dialogueComplete && (
                      <p className="text-xs text-right mt-2 opacity-30">点击继续</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 选项反馈 */}
          {choiceFeedback && (
            <div className="mb-4 animate-slide-in-up p-4 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(46,134,193,0.1), rgba(22,27,34,0.9))',
                border: '1px solid var(--azurite)',
                borderLeft: '3px solid var(--azurite)',
              }}
            >
              <p className="text-xs font-semibold mb-2 opacity-50">你的选择</p>
              <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-serif)', color: 'var(--azurite-light)' }}>
                {choiceFeedback}
              </p>
              {choiceUnlock && (
                <div className="mt-3 p-3 rounded-lg" style={{
                  background: 'rgba(241,196,15,0.08)',
                  border: '1px solid rgba(241,196,15,0.2)',
                }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: 'var(--gamboge)' }}>
                    &#9670; 解锁历史碎片
                  </p>
                  <p className="text-xs leading-relaxed" style={{ fontFamily: 'var(--font-serif)', color: 'var(--gamboge-light)', opacity: 0.8 }}>
                    {choiceUnlock}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 玩家选项 */}
          {showChoices && !choiceFeedback && (
            <div className="space-y-2 mb-4">
              <div className="text-xs font-semibold text-center mb-3 opacity-40" style={{ fontFamily: 'var(--font-serif)' }}>
                ── 做出你的抉择 ──
              </div>
              {act.choices.map((choice, idx) => (
                <button
                  key={choice.id}
                  className="w-full text-left p-4 rounded-xl tap-bounce animate-slide-in-up card-lift"
                  style={{
                    animationDelay: `${idx * 0.1}s`,
                    background: 'linear-gradient(135deg, rgba(48,54,61,0.5), rgba(22,27,34,0.7))',
                    border: '1px solid var(--ink-medium)',
                  }}
                  onClick={() => makeChoice(choice)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--azurite)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-glow-azurite)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--ink-medium)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-serif)', color: 'var(--xuan)' }}>
                    {choice.text}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-xs opacity-30">难度</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3].map(level => (
                        <div key={level} className="w-1.5 h-1.5 rounded-full"
                          style={{
                            background: level <= (choice.score >= 8 ? 3 : choice.score >= 5 ? 2 : 1)
                              ? 'var(--gamboge)'
                              : 'var(--ink-medium)',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>
    );
  }

  /* ── 章节结束 ── */
  if (phase === 'ACT_END') {
    const act = acts[currentActIdx];
    const upcomingAct = acts[currentActIdx + 1];
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center"
        style={{ background: 'var(--ink-deepest)', color: 'var(--xuan)' }}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(ellipse at 50% 50%, rgba(231,76,60,0.12) 0%, transparent 60%)',
          }}
        />

        <div className="relative z-10 text-center px-6 animate-mountain-fade">
          <div className="text-xs opacity-40 mb-2" style={{ fontFamily: 'var(--font-sans)' }}>
            第 {currentActIdx + 1} 幕终
          </div>
          <h2 className="mb-4" style={{ fontFamily: 'var(--font-brush)', fontSize: '1.75rem', color: 'var(--vermillion-light)' }}>
            {act?.title}
          </h2>
          <div className="max-w-xs mx-auto">
            <p className="text-xs leading-relaxed opacity-40" style={{ fontFamily: 'var(--font-serif)', textIndent: '2em' }}>
              {act?.atmosphere}
            </p>
          </div>

          {/* 进度 */}
          <div className="mt-6 flex justify-center gap-1.5">
            {acts.map((_, i) => (
              <div key={i} className="rounded-full transition-all duration-500"
                style={{
                  width: i === currentActIdx ? '2rem' : '0.5rem',
                  height: '0.375rem',
                  background: i <= currentActIdx ? 'var(--gamboge)' : 'var(--ink-medium)',
                  opacity: i <= currentActIdx ? 1 : 0.4,
                }}
              />
            ))}
          </div>

          {upcomingAct && (
            <div className="mt-6">
              <div className="text-xs opacity-30 mb-1">下一幕</div>
              <div className="text-sm font-semibold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--azurite-light)' }}>
                {upcomingAct.title} · {upcomingAct.year}
              </div>
            </div>
          )}
        </div>

        <button
          className="absolute bottom-12 px-8 py-3 rounded-lg tap-bounce animate-slide-in-up"
          style={{
            background: 'linear-gradient(135deg, var(--azurite), var(--azurite-deep))',
            color: 'var(--xuan)',
            fontFamily: 'var(--font-serif)',
            boxShadow: 'var(--shadow-glow-azurite)',
          }}
          onClick={() => { setChoiceFeedback(null); setChoiceUnlock(null); nextAct(); }}
        >
          继续前行
        </button>
      </div>
    );
  }

  /* ── 最终完成 ── */
  if (phase === 'FINISHED') {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center"
        style={{ background: 'var(--ink-deepest)', color: 'var(--xuan)' }}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(ellipse at 50% 30%, rgba(241,196,15,0.2) 0%, transparent 50%)',
          }}
        />

        <div className="relative z-10 text-center px-6 animate-mountain-fade">
          <div className="seal-stamp mb-6" style={{ borderColor: 'var(--gamboge)', color: 'var(--gamboge)' }}>
            历史落幕
          </div>
          <h2 className="text-gold-shimmer mb-2" style={{ fontFamily: 'var(--font-brush)', fontSize: '1.5rem' }}>
            {world.epilogue ? '尾声' : '旅途终章'}
          </h2>

          {/* 评级预览 */}
          <div className="mt-6 mb-8">
            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
              style={{
                border: `3px solid ${grade === 'S' ? 'var(--gamboge)' : grade === 'A' ? 'var(--vermillion)' : grade === 'B' ? 'var(--azurite)' : 'var(--ink-medium)'}`,
                background: `${grade === 'S' ? 'var(--gamboge)' : grade === 'A' ? 'var(--vermillion)' : grade === 'B' ? 'var(--azurite)' : 'var(--ink-medium)'}15`,
                boxShadow: `0 0 30px ${grade === 'S' ? 'var(--gamboge)' : grade === 'A' ? 'var(--vermillion)' : grade === 'B' ? 'var(--azurite)' : 'var(--ink-medium)'}30`,
              }}
            >
              <span className="text-3xl font-bold" style={{
                fontFamily: 'var(--font-brush)',
                color: grade === 'S' ? 'var(--gamboge)' : grade === 'A' ? 'var(--vermillion)' : grade === 'B' ? 'var(--azurite)' : 'var(--ink-light)',
              }}>
                {grade}
              </span>
            </div>
          </div>

          <button
            className="px-8 py-3 rounded-lg tap-bounce animate-slide-in-up"
            style={{
              background: 'linear-gradient(135deg, var(--gamboge), var(--gamboge-deep))',
              color: 'var(--ink-deepest)',
              fontFamily: 'var(--font-serif)',
              boxShadow: 'var(--shadow-glow-gamboge)',
            }}
            onClick={() => setPhase('SCORE_SCREEN')}
          >
            查看完整结算
          </button>
        </div>
      </div>
    );
  }

  /* ── 评分结算 ── */
  if (phase === 'SCORE_SCREEN') {
    return (
      <div className="fixed inset-0 flex flex-col" style={{ background: 'var(--ink-deepest)', color: 'var(--xuan)' }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(ellipse at 50% 20%, rgba(241,196,15,0.15) 0%, transparent 50%), radial-gradient(ellipse at 30% 80%, rgba(46,134,193,0.1) 0%, transparent 50%)',
          }}
        />

        <div className="relative z-10 flex flex-col h-full">
          {/* 标题 */}
          <div className="pt-10 pb-4 px-6 text-center animate-fade-in-down">
            <div className="seal-stamp mb-4" style={{ borderColor: 'var(--gamboge)', color: 'var(--gamboge)' }}>
              探索结算
            </div>
            <h2 className="text-gold-shimmer" style={{ fontFamily: 'var(--font-brush)', fontSize: '1.5rem' }}>
              {world.name}
            </h2>
            <p className="mt-1 text-xs opacity-40" style={{ fontFamily: 'var(--font-serif)' }}>
              角色：{playerChar}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-hide">
            {/* 评级 */}
            <div className="flex justify-center mb-8 animate-scale-in-bounce" style={{ animationDelay: '0.2s' }}>
              <div className="text-center">
                <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-3"
                  style={{
                    border: `3px solid ${grade === 'S' ? 'var(--gamboge)' : grade === 'A' ? 'var(--vermillion)' : grade === 'B' ? 'var(--azurite)' : 'var(--ink-medium)'}`,
                    background: `${grade === 'S' ? 'var(--gamboge)' : grade === 'A' ? 'var(--vermillion)' : grade === 'B' ? 'var(--azurite)' : 'var(--ink-medium)'}15`,
                    boxShadow: `0 0 40px ${grade === 'S' ? 'var(--gamboge)' : grade === 'A' ? 'var(--vermillion)' : grade === 'B' ? 'var(--azurite)' : 'var(--ink-medium)'}25`,
                  }}
                >
                  <span style={{
                    fontFamily: 'var(--font-brush)',
                    fontSize: '2.5rem',
                    color: grade === 'S' ? 'var(--gamboge)' : grade === 'A' ? 'var(--vermillion)' : grade === 'B' ? 'var(--azurite)' : 'var(--ink-light)',
                  }}>
                    {grade}
                  </span>
                </div>
                <div className="text-xs opacity-40" style={{ fontFamily: 'var(--font-serif)' }}>
                  {grade === 'S' ? '历史见证者' : grade === 'A' ? '关键决策者' : grade === 'B' ? '时代参与者' : grade === 'C' ? '旁观过客' : '迷失旅人'}
                </div>
              </div>
            </div>

            {/* 统计数据 */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-4 rounded-xl text-center animate-slide-in-left" style={{
                animationDelay: '0.3s',
                background: 'linear-gradient(135deg, rgba(48,54,61,0.5), rgba(22,27,34,0.7))',
                border: '1px solid var(--ink-medium)',
              }}>
                <div className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-brush)', color: 'var(--gamboge)' }}>
                  {animatedScore}
                </div>
                <div className="text-xs opacity-40" style={{ fontFamily: 'var(--font-serif)' }}>
                  历史碎片总分
                </div>
                <div className="text-xs opacity-25 mt-1">
                  满分 {maxScore}
                </div>
              </div>

              <div className="p-4 rounded-xl text-center animate-slide-in-right" style={{
                animationDelay: '0.4s',
                background: 'linear-gradient(135deg, rgba(48,54,61,0.5), rgba(22,27,34,0.7))',
                border: '1px solid var(--ink-medium)',
              }}>
                <div className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-brush)', color: 'var(--azurite-light)' }}>
                  {animatedFragments}
                </div>
                <div className="text-xs opacity-40" style={{ fontFamily: 'var(--font-serif)' }}>
                  收集碎片
                </div>
                <div className="text-xs opacity-25 mt-1">
                  共 {acts.length} 幕
                </div>
              </div>
            </div>

            {/* 探索内容 */}
            <div className="mb-6 animate-slide-in-up" style={{ animationDelay: '0.5s' }}>
              <h3 className="text-xs font-semibold mb-3 opacity-40" style={{ fontFamily: 'var(--font-sans)' }}>
                你获得的历史碎片
              </h3>
              <div className="space-y-2">
                {fragments.map((fragment, idx) => (
                  <div key={idx} className="p-3 rounded-lg animate-slide-in-up" style={{
                    animationDelay: `${0.6 + idx * 0.05}s`,
                    background: 'rgba(241,196,15,0.05)',
                    border: '1px solid rgba(241,196,15,0.15)',
                  }}>
                    <p className="text-xs leading-relaxed" style={{ fontFamily: 'var(--font-serif)', color: 'var(--gamboge-light)', opacity: 0.8 }}>
                      {fragment}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 章节完成度 */}
            <div className="mb-6 animate-slide-in-up" style={{ animationDelay: '0.8s' }}>
              <h3 className="text-xs font-semibold mb-3 opacity-40" style={{ fontFamily: 'var(--font-sans)' }}>
                章节历程
              </h3>
              <div className="space-y-2">
                {acts.map((act, idx) => (
                  <div key={act.id} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'rgba(48,54,61,0.3)' }}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'var(--gamboge)', color: 'var(--ink-deepest)', fontSize: '0.65rem', fontWeight: 700 }}
                    >
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold truncate" style={{ fontFamily: 'var(--font-serif)' }}>
                        {act.title}
                      </div>
                      <div className="text-xs opacity-30">{act.year}</div>
                    </div>
                    <div className="text-xs opacity-50 flex-shrink-0" style={{ color: 'var(--malachite-light)' }}>
                      &#10003;
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 尾声 */}
            {world.epilogue && (
              <div className="mb-6 animate-fade-in-down" style={{ animationDelay: '1s' }}>
                <h3 className="text-xs font-semibold mb-3 opacity-40" style={{ fontFamily: 'var(--font-sans)' }}>
                  ── 尾声 ──
                </h3>
                <div className="p-4 rounded-xl" style={{
                  background: 'linear-gradient(135deg, rgba(22,27,34,0.9), rgba(13,15,20,0.95))',
                  borderLeft: '3px solid var(--vermillion)',
                }}>
                  <p className="text-xs leading-relaxed" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink-faint)', textIndent: '2em' }}>
                    {world.epilogue}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 底部按钮 */}
          <div className="flex-shrink-0 p-4 space-y-2" style={{ borderTop: '1px solid var(--ink-medium)' }}>
            <button
              className="w-full py-3 rounded-lg tap-bounce font-semibold text-sm"
              style={{
                background: 'linear-gradient(135deg, var(--vermillion), var(--vermillion-deep))',
                color: 'var(--xuan)',
                fontFamily: 'var(--font-serif)',
                boxShadow: 'var(--shadow-glow-vermillion)',
              }}
              onClick={restart}
            >
              重新开始（选择不同角色）
            </button>
            <button
              className="w-full py-3 rounded-lg tap-bounce font-semibold text-sm"
              style={{
                background: 'rgba(48,54,61,0.5)',
                color: 'var(--ink-faint)',
                fontFamily: 'var(--font-serif)',
                border: '1px solid var(--ink-medium)',
              }}
              onClick={goBack}
            >
              返回世界列表
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
