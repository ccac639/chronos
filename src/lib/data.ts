import curriculumData from '@/data/curriculum.json';

export interface Chapter {
  id: string;
  title: string;
  summary: string;
}

export interface Era {
  id: string;
  name: string;
  nameEn?: string;
  period: string;
  periodEn?: string;
  description: string;
  descriptionEn?: string;
  figures: string[];
  figuresEn?: string[];
  chapters: Chapter[];
  country?: string;
}

export interface Stage {
  id: string;
  name: string;
  description: string;
  eras: Era[];
}

export interface StageDataResult {
  id: string;
  name: string;
  description: string;
  eras: Era[];
}

/** Get all stages with their eras (Chinese history) */
export function getStages(): Stage[] {
  return curriculumData.stages;
}

/** Get a single stage by id (Chinese history) */
export function getStage(stageId: string): Stage | undefined {
  return curriculumData.stages.find((s) => s.id === stageId);
}

/** Get the era data for a given stage id. Returns object with id/name/desc/eras */
export function getStageData(stageId: string): StageDataResult | null {
  if (stageId === 'random') {
    const allEras = curriculumData.stages.flatMap((s) => s.eras);
    const shuffled = [...allEras].sort(() => Math.random() - 0.5);
    return {
      id: 'random',
      name: '随机穿越',
      description: '从所有时代中随机选取',
      eras: shuffled.slice(0, 6),
    };
  }
  const stage = getStage(stageId);
  if (!stage) return null;
  return { id: stage.id, name: stage.name, description: stage.description, eras: stage.eras };
}

/** Get a specific era by its id, searching across all stages */
export function getEra(eraId: string): { era: Era; stageId: string } | null {
  for (const stage of curriculumData.stages) {
    const era = stage.eras.find((e) => e.id === eraId);
    if (era) return { era, stageId: stage.id };
  }
  const worldStages = curriculumData.worldHistory?.stages;
  if (worldStages) {
    for (const stage of worldStages) {
      const era = stage.eras.find((e) => e.id === eraId);
      if (era) return { era, stageId: stage.id };
    }
  }
  return null;
}

/** Find which stage an era belongs to */
export function getStageForEra(eraId: string): string | null {
  for (const stage of curriculumData.stages) {
    if (stage.eras.some((e) => e.id === eraId)) return stage.id;
  }
  const worldStages = curriculumData.worldHistory?.stages;
  if (worldStages) {
    for (const stage of worldStages) {
      if (stage.eras.some((e) => e.id === eraId)) return stage.id;
    }
  }
  return null;
}

/** Get all eras across all stages (Chinese only) */
export function getAllEras(): { era: Era; stageId: string }[] {
  return curriculumData.stages.flatMap((s) =>
    s.eras.map((e) => ({ era: e, stageId: s.id }))
  );
}

/** Get a random era across all stages */
export function getRandomEra(): { stageId: string; era: Era } | null {
  const all = getAllEras();
  if (all.length === 0) return null;
  const pick = all[Math.floor(Math.random() * all.length)];
  return { stageId: pick.stageId, era: pick.era };
}

/** Get all stages plus a virtual "random" stage entry */
export function getStageOptions(): { id: string; name: string }[] {
  const stages = getStages().map((s) => ({ id: s.id, name: s.name }));
  return [...stages, { id: 'random', name: '随机' }];
}

// ─── World History data access ────────────────────────────────────

interface WorldHistoryData {
  stages: Stage[];
}

/** Get all world history stages */
export function getWorldHistoryStages(): Stage[] {
  const worldData = (curriculumData as any).worldHistory as WorldHistoryData | undefined;
  return worldData?.stages ?? [];
}

/** Get world history stage data by stage id, optionally filtered by country */
export function getWorldStageData(
  stageId: string,
  country?: string | null
): StageDataResult | null {
  const stages = getWorldHistoryStages();
  const stage = stages.find((s) => s.id === stageId);
  if (!stage) return null;

  let eras = stage.eras;
  if (country && stageId === 'uni-world') {
    eras = eras.filter((e) => e.country === country);
  }

  return { id: stage.id, name: stage.name, description: stage.description, eras };
}

/** Get list of countries available in university world history */
export function getWorldCountryList(): string[] {
  const stages = getWorldHistoryStages();
  const uniStage = stages.find((s) => s.id === 'uni-world');
  if (!uniStage) return [];
  const countries = new Set<string>();
  for (const era of uniStage.eras) {
    if (era.country) countries.add(era.country);
  }
  return Array.from(countries);
}

// ─── Narrative types (updated for branching system) ──────────────────

export interface NpcDialogue {
  speaker: string;
  text: string;
  avatar: string;
}

export interface NarrativeDialogue {
  id: string;
  text: string;
  speaker: string;
  avatar: string;
  score: number;
  triggeredEvent: string;
  historicalNote: string;
  consequence: string;
  /** Branch target: if present, choosing this dialogue goes to this act instead of the next sequential one */
  nextActId?: string;
}

export interface NarrativeAct {
  id: string;
  title: string;
  isKeyAct: boolean;
  sceneDescription: string;
  /** Year/period label for timeline display (e.g., "前2560年", "1776年") */
  timeMarker?: string;
  npcDialogues: NpcDialogue[];
  dialogues: NarrativeDialogue[];
}

export interface NarrativeData {
  eraId: string;
  eraName: string;
  eraNameEn?: string;
  playerRole: string;
  playerRoleEn?: string;
  startYear?: string;
  endYear?: string;
  acts: NarrativeAct[];
}

export interface PlayerChoice {
  actId: string;
  actTitle: string;
  dialogueId: string;
  score: number;
  triggeredEvent: string;
  timeMarker?: string;
}

// ─── Narrative path tracking (branching) ──────────────────────────

/** A node in the player's journey through the branching narrative */
export interface JourneyNode {
  actId: string;
  actTitle: string;
  timeMarker?: string;
  choice?: PlayerChoice;
  /** Index into the parent act's dialogues, for "what if" display */
  skippedDialogues?: NarrativeDialogue[];
  /** Children are acts reachable from this node via other dialogue choices */
  alternateActIds: string[];
}

// ─── Narrative data access ──────────────────────────────────────────

const NARRATIVE_FILES: Record<string, string> = {
  // 小学 (6 eras)
  'primary-ancient-legends': 'ancient-legends',
  'primary-three-kings': 'three-kings-primary',
  'primary-tang-stories': 'tang-stories',
  'primary-song-heroes': 'song-heroes',
  'primary-inventions': 'inventions',
  'primary-festivals': 'festivals',
  // 初中 (11 eras)
  'junior-prehistory': 'prehistory',
  'junior-xia-shang-zhou': 'shang-zhou',
  'junior-qin-han': 'qin-han',
  'junior-three-kingdoms-jin-nb': 'three-kings',
  'junior-sui-tang': 'sui-tang',
  'junior-song-yuan': 'song-yuan',
  'junior-ming-qing': 'ming-qing',
  'junior-modern-opium-war': 'modern-opium-war',
  'junior-modern-reform': 'modern-reform',
  'junior-modern-liberation': 'modern-liberation',
  'junior-prc': 'junior-prc',
  // 高中 (10 eras)
  'senior-civilization-origin': 'civilization-origin',
  'senior-qin-han': 'senior-qin-han',
  'senior-three-six-dynasties-sui-tang': 'senior-sui-tang',
  'senior-song-yuan': 'senior-song-yuan',
  'senior-ming-qing-early': 'senior-ming-qing',
  'senior-late-qing': 'late-qing',
  'senior-revolution': 'senior-revolution',
  'senior-prc': 'senior-prc',
  'senior-ancient-world': 'senior-ancient-world',
  'senior-modern-world': 'senior-modern-world',
  // 世界历史 (will be added as data is generated)
  'w9-ancient-civilizations': 'w9-ancient-civilizations',
  'w9-ancient-europe': 'w9-ancient-europe',
  'w9-medieval': 'w9-medieval',
  'w9-renaissance-exploration': 'w9-renaissance-exploration',
  'w9-revolution': 'w9-revolution',
  'w9-industrial-revolution': 'w9-industrial-revolution',
  'w9-imperialism': 'w9-imperialism',
  'w9-world-wars': 'w9-world-wars',
  'w9-contemporary': 'w9-contemporary',
  'sw-ancient-civilizations': 'sw-ancient-civilizations',
  'sw-ancient-greece-rome': 'sw-ancient-greece-rome',
  'sw-medieval-europe': 'sw-medieval-europe',
  'sw-medieval-asia-africa': 'sw-medieval-asia-africa',
  'sw-exploration-reform': 'sw-exploration-reform',
  'sw-enlightenment-revolution': 'sw-enlightenment-revolution',
  'sw-industrial-revolution': 'sw-industrial-revolution',
  'sw-world-wars': 'sw-world-wars',
  'sw-cold-war': 'sw-cold-war',
  'sw-contemporary': 'sw-contemporary',
  'uw-usa': 'uw-usa',
  'uw-germany': 'uw-germany',
  'uw-russia': 'uw-russia',
  'uw-uk': 'uw-uk',
  'uw-france': 'uw-france',
  'uw-japan': 'uw-japan',
  'uw-italy': 'uw-italy',
  'uw-brazil': 'uw-brazil',
  'uw-egypt': 'uw-egypt',
  'uw-india': 'uw-india',
};

// Cached narrative data
let narrativeCache: Record<string, NarrativeData> = {};

export async function getNarrativeData(eraId: string, lang?: string): Promise<NarrativeData | null> {
  const cacheKey = lang ? `${eraId}-${lang}` : eraId;
  if (narrativeCache[cacheKey]) return narrativeCache[cacheKey];

  const filename = NARRATIVE_FILES[eraId];
  if (!filename) return null;

  const tryFilenames = lang === 'en'
    ? [`${filename}-en`, filename]
    : [filename];

  for (const fname of tryFilenames) {
    try {
      const response = await fetch(`/data/narratives/${fname}.json`);
      if (!response.ok) continue;
      const data = await response.json();
      narrativeCache[cacheKey] = data as NarrativeData;
      return narrativeCache[cacheKey];
    } catch {
      continue;
    }
  }

  return null;
}

/** Randomly select N dialogues from the available set */
export function getRandomDialogues(dialogues: NarrativeDialogue[], count: number = 3): NarrativeDialogue[] {
  const shuffled = [...dialogues].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/** Get an act by its ID (for branching navigation) */
export function getActById(narrative: NarrativeData, actId: string): NarrativeAct | null {
  return narrative.acts.find(a => a.id === actId) ?? null;
}

/** Get an act by sequential index (backward compat) */
export function getActByIndex(narrative: NarrativeData, index: number): NarrativeAct | null {
  return narrative.acts[index] ?? null;
}

/** Get dialogue by ID within an act */
export function getDialogueById(act: NarrativeAct, dialogueId: string): NarrativeDialogue | null {
  return act.dialogues.find(d => d.id === dialogueId) ?? null;
}

/** Resolve the next act ID after a dialogue choice.
 *  If the dialogue has nextActId, use it. Otherwise fall back to the next sequential act. */
export function resolveNextActId(
  narrative: NarrativeData,
  currentActId: string,
  dialogue: NarrativeDialogue
): string | null {
  if (dialogue.nextActId) return dialogue.nextActId;

  // Fallback: find next sequential act
  const idx = narrative.acts.findIndex(a => a.id === currentActId);
  if (idx >= 0 && idx + 1 < narrative.acts.length) {
    return narrative.acts[idx + 1].id;
  }
  return null; // end of narrative
}

/** Get all unique act IDs that branch from a given act (different nextActIds from its dialogues) */
export function getBranchTargets(act: NarrativeAct, nextSequentialId: string | null): string[] {
  const targets = new Set<string>();
  for (const d of act.dialogues) {
    if (d.nextActId && d.nextActId !== nextSequentialId) {
      targets.add(d.nextActId);
    }
  }
  return Array.from(targets);
}

/** Calculate main path length (acts on the primary sequential path) */
export function getMainPathLength(narrative: NarrativeData): number {
  return narrative.acts.length;
}

/** Check if narrative uses branching (has any nextActId) */
export function hasBranching(narrative: NarrativeData): boolean {
  return narrative.acts.some(act =>
    act.dialogues.some(d => !!d.nextActId)
  );
}

export function calculateFinalScore(choices: PlayerChoice[]): {
  totalScore: number;
  maxScore: number;
  averageScore: number;
  grade: string;
  rank: string;
} {
  const totalScore = choices.reduce((sum, c) => sum + c.score, 0);
  const maxScore = choices.length * 100;
  const averageScore = choices.length > 0 ? Math.round(totalScore / choices.length) : 0;

  let grade: string;
  if (averageScore >= 95) grade = 'S';
  else if (averageScore >= 85) grade = 'A';
  else if (averageScore >= 75) grade = 'B';
  else if (averageScore >= 60) grade = 'C';
  else grade = 'D';

  let rank: string;
  if (averageScore >= 95) rank = '千古一帝';
  else if (averageScore >= 85) rank = '明君圣主';
  else if (averageScore >= 75) rank = '中兴之主';
  else if (averageScore >= 60) rank = '守成之君';
  else rank = '亡国之君';

  return { totalScore, maxScore, averageScore, grade, rank };
}

// Re-export useLang for convenience
export { useLang } from './lang-context';
