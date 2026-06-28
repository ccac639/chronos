/* ── Parallel World Data Types ── */

export interface MapRegion {
  name: string;
  description: string;
  faction: string;
  terrain?: string;
  resources?: string;
}

export interface WorldChapter {
  id: string;
  chapterNumber: number;
  title: string;
  summary: string;
  year: string;
  keyEvents: string[];
  keyFigures: { name: string; role: string; description: string }[];
  atmosphere: string;
  /** Prose narrative passage (novel-style) */
  narrative?: string;
  /** What changed on the map this chapter */
  mapChanges?: string;
  /** Technology advancement in this chapter */
  techAdvance?: string;
}

export interface Faction {
  id: string;
  name: string;
  leader: string;
  ideology: string;
  description: string;
}

export interface FactionRelation {
  from: string;
  to: string;
  type: 'alliance' | 'war' | 'trade' | 'tension' | 'vassal';
  description: string;
}

export interface CharacterArc {
  name: string;
  title: string;
  faction: string;
  backstory: string;
  fate: string;
  chapters: { chapterId: string; development: string; pivotalMoment?: string }[];
}

export interface TechNode {
  name: string;
  era: string;
  description: string;
  impact: string;
}

export interface WorldLore {
  religion: string;
  art: string;
  philosophy: string;
  legend: string;
}

export interface ParallelWorld {
  id: string;
  name: string;
  tagline: string;
  pointOfDivergence: string;
  geography: string;
  geographyDescription: string;
  era: string;
  startYear: number;
  techLevel: string;
  techLevelDescription: string;
  civilizations: string[];
  civilizationsDescription: string;
  mapDescription: string;
  mapRegions: MapRegion[];
  chapters: WorldChapter[];
  keyDivergences: string[];
  createdAt: string;
  seed: string;

  /* ── Novel-style extensions (optional, backward-compatible) ── */
  prologue?: string;
  epilogue?: string;
  factions?: Faction[];
  factionRelations?: FactionRelation[];
  characterArcs?: CharacterArc[];
  techTimeline?: TechNode[];
  worldLore?: WorldLore;
  economy?: string;
}
