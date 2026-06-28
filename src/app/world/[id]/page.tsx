'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { sampleWorlds } from '@/data/sample-worlds';
import { ParallelWorld, MapRegion, WorldChapter, FactionRelation, CharacterArc, TechNode } from '@/data/world-data';
import BottomTabBar from '@/components/BottomTabBar';

/* ── Faction color helper ── */
function getFactionColor(faction: string): { bg: string; text: string; border: string } {
  if (faction.includes('赵') || faction.includes('汉流亡')) {
    return { bg: 'rgba(231, 76, 60, 0.08)', text: '#a93226', border: 'rgba(231, 76, 60, 0.3)' };
  }
  if (faction.includes('楚') || faction.includes('降封')) {
    return { bg: 'rgba(241, 196, 15, 0.08)', text: '#d4ac0d', border: 'rgba(241, 196, 15, 0.3)' };
  }
  if (faction.includes('燕') || faction.includes('齐')) {
    return { bg: 'rgba(39, 174, 96, 0.08)', text: '#1e8449', border: 'rgba(39, 174, 96, 0.3)' };
  }
  if (faction.includes('蜀') || faction.includes('汉')) {
    return { bg: 'rgba(142, 68, 173, 0.08)', text: '#7d3c98', border: 'rgba(142, 68, 173, 0.3)' };
  }
  if (faction.includes('魏') && !faction.includes('曹')) {
    return { bg: 'rgba(230, 126, 34, 0.08)', text: '#ca6f1e', border: 'rgba(230, 126, 34, 0.3)' };
  }
  // default: Wei blue / generic
  return { bg: 'rgba(46, 134, 193, 0.08)', text: '#1a5276', border: 'rgba(46, 134, 193, 0.3)' };
}

/* ── Section Header ── */
function SectionHeader({ icon, title, badge }: { icon: React.ReactNode; title: string; badge?: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-serif font-bold" style={{ color: 'var(--ink-dark)' }}>{title}</h3>
      </div>
      {badge && (
        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
          style={{ background: 'var(--azurite-pale)', color: 'var(--azurite-deep)' }}>{badge}</span>
      )}
    </div>
  );
}

/* ── Region Card ── */
function RegionCard({ region, onClick }: { region: MapRegion; onClick: () => void }) {
  const colors = getFactionColor(region.faction);
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-3 rounded-lg tap-bounce text-center transition-all"
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        minHeight: '80px',
      }}
    >
      <span className="text-xs font-medium font-serif" style={{ color: colors.text }}>
        {region.name}
      </span>
      <span className="text-[10px] mt-1" style={{ color: colors.text, opacity: 0.7 }}>
        {region.faction}
      </span>
    </button>
  );
}

/* ── Chapter Card ── */
function ChapterCard({ chapter, index }: { chapter: WorldChapter; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="relative pl-8 pb-6 animate-slide-in-up"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Timeline line */}
      <div className="absolute left-[11px] top-6 bottom-0 w-0.5"
        style={{ background: 'linear-gradient(to bottom, var(--vermillion), var(--gamboge), var(--azurite))' }}
      />

      {/* Timeline dot */}
      <div className="absolute left-2 top-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
        style={{
          background: 'var(--vermillion)',
          color: '#fff',
          boxShadow: 'var(--shadow-glow-vermillion)',
          border: '2px solid var(--xuan)',
        }}
      >
        {chapter.chapterNumber}
      </div>

      {/* Chapter card */}
      <div
        className="card-xuan overflow-hidden cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Header */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ background: 'var(--azurite-pale)', color: 'var(--azurite-deep)' }}>
                {chapter.year}
              </span>
              <span className="text-[10px]" style={{ color: 'var(--ink-light)' }}>
                {chapter.atmosphere.slice(0, 8)}...
              </span>
            </div>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 transition-transform"
              style={{
                color: 'var(--ink-light)',
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 300ms ease',
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          <h4 className="text-base font-serif font-bold" style={{ color: 'var(--ink-dark)' }}>
            {chapter.title}
          </h4>

          {/* Summary (always visible) */}
          <p className="text-xs mt-2 leading-relaxed line-clamp-3" style={{ color: 'var(--ink-medium)' }}>
            {chapter.summary}
          </p>
        </div>

        {/* Expanded content */}
        <div
          className="overflow-hidden transition-all"
          style={{
            maxHeight: expanded ? '2000px' : '0px',
            opacity: expanded ? 1 : 0,
            transition: 'max-height 500ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms ease',
          }}
        >
          {/* Novel-style narrative */}
          {chapter.narrative && (
            <div className="mx-4 mb-3 p-4 rounded-lg"
              style={{
                background: 'linear-gradient(135deg, rgba(22,27,34,0.95), rgba(10,14,20,0.9))',
                border: '1px solid rgba(46,134,193,0.15)',
              }}
            >
              <p className="text-[10px] font-medium mb-2" style={{ color: 'var(--gamboge)' }}>
                卷宗摘录
              </p>
              <p className="text-xs italic leading-loose" style={{ color: 'rgba(201, 209, 217, 0.85)', lineHeight: '2' }}>
                {chapter.narrative}
              </p>
            </div>
          )}

          {/* Full summary */}
          <div className="px-4 pb-3">
            <p className="text-xs leading-relaxed font-serif" style={{ color: 'var(--ink-medium)', lineHeight: '1.9' }}>
              {chapter.summary}
            </p>
          </div>

          {/* Map changes */}
          {chapter.mapChanges && (
            <div className="px-4 pb-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-[10px] font-medium" style={{ color: 'var(--azurite)' }}>版图变迁</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-medium)' }}>
                {chapter.mapChanges}
              </p>
            </div>
          )}

          {/* Tech advance */}
          {chapter.techAdvance && (
            <div className="px-4 pb-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-[10px] font-medium" style={{ color: 'var(--gamboge)' }}>技术进步</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-medium)' }}>
                {chapter.techAdvance}
              </p>
            </div>
          )}

          {/* Atmosphere */}
          <div className="mx-4 mb-3 px-3 py-2 rounded-lg"
            style={{
              background: 'linear-gradient(135deg, var(--ink-dark), var(--azurite-deep))',
              color: 'var(--ink-faint)',
            }}
          >
            <p className="text-[10px] font-medium mb-1" style={{ color: 'var(--azurite-light)' }}>
              氛围
            </p>
            <p className="text-xs italic" style={{ color: 'rgba(201, 209, 217, 0.8)', lineHeight: '1.8' }}>
              {chapter.atmosphere}
            </p>
          </div>

          {/* Key Events */}
          <div className="px-4 pb-3">
            <h5 className="text-xs font-medium mb-2" style={{ color: 'var(--vermillion)' }}>
              关键事件
            </h5>
            <ul className="space-y-1.5">
              {chapter.keyEvents.map((event, i) => (
                <li key={i} className="flex gap-2 text-xs" style={{ color: 'var(--ink-medium)' }}>
                  <span className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5 text-[9px] font-bold"
                    style={{ background: 'var(--vermillion-pale)', color: 'var(--vermillion-deep)' }}>
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{event}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Figures */}
          <div className="px-4 pb-4">
            <h5 className="text-xs font-medium mb-2" style={{ color: 'var(--azurite)' }}>
              关键人物
            </h5>
            <div className="space-y-2">
              {chapter.keyFigures.map((figure) => (
                <div key={figure.name} className="flex gap-3 items-start p-2.5 rounded-lg"
                  style={{ background: 'var(--xuan-dark)' }}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: 'var(--azurite)', color: '#fff' }}
                  >
                    {figure.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-serif" style={{ color: 'var(--ink-dark)' }}>
                        {figure.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0 rounded"
                        style={{ background: 'var(--azurite-pale)', color: 'var(--azurite-deep)' }}>
                        {figure.role}
                      </span>
                    </div>
                    <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: 'var(--ink-medium)' }}>
                      {figure.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Relation Type Labels ── */
function getRelationStyle(type: FactionRelation['type']) {
  switch (type) {
    case 'alliance': return { label: '同盟', color: '#27ae60', bg: 'rgba(39,174,96,0.1)' };
    case 'war': return { label: '交战', color: '#e74c3c', bg: 'rgba(231,76,60,0.1)' };
    case 'trade': return { label: '贸易', color: '#f39c12', bg: 'rgba(243,156,18,0.1)' };
    case 'tension': return { label: '对峙', color: '#e67e22', bg: 'rgba(230,126,34,0.1)' };
    case 'vassal': return { label: '朝贡', color: '#8e44ad', bg: 'rgba(142,68,173,0.1)' };
  }
}

/* ── Main Page ── */
export default function WorldDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const world = sampleWorlds.find((w) => w.id === id);

  const [selectedRegion, setSelectedRegion] = useState<MapRegion | null>(null);
  const [activeTab, setActiveTab] = useState<'story' | 'factions' | 'chars' | 'tech' | 'lore'>('story');

  if (!world) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pb-20"
        style={{ backgroundColor: 'var(--xuan)' }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-16 h-16 mb-4 animate-breathe"
          style={{ color: 'var(--gamboge)' }}
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
        <p className="text-sm font-serif font-bold mb-2" style={{ color: 'var(--ink-dark)' }}>数据待更新</p>
        <p className="text-xs font-serif mb-4" style={{ color: 'var(--ink-medium)' }}>这个平行世界尚未生成，敬请期待</p>
        <Link href="/world" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium tap-bounce"
          style={{ background: 'var(--azurite)', color: '#fff', boxShadow: '0 2px 12px rgba(46,134,193,0.3)' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          返回世界列表
        </Link>
      </div>
    );
  }

  const hasNovelExtensions = !!(world.prologue || world.factions || world.characterArcs || world.techTimeline || world.worldLore);
  const tabs = hasNovelExtensions
    ? [
        { key: 'story' as const, label: '编年史' },
        { key: 'factions' as const, label: '阵营' },
        { key: 'chars' as const, label: '人物' },
        { key: 'tech' as const, label: '科技' },
        { key: 'lore' as const, label: '传说' },
      ]
    : [{ key: 'story' as const, label: '编年史' }];

  return (
    <div className="min-h-screen pb-20 relative" style={{ backgroundColor: 'var(--xuan)' }}>
      {/* ===== Hero Section ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0"
          style={{
            background: 'linear-gradient(160deg, var(--azurite-deep) 0%, var(--ink-dark) 35%, var(--ink-medium) 60%, var(--indigo-ancient, #6c3483) 100%)',
            minHeight: '280px',
          }}
        />
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(ellipse at 25% 40%, rgba(46,134,193,0.5), transparent 55%), radial-gradient(ellipse at 75% 60%, rgba(108,52,131,0.4), transparent 50%), radial-gradient(ellipse at 50% 20%, rgba(241,196,15,0.2), transparent 40%)',
          }}
        />
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(160,64,0,0.08) 80px, rgba(160,64,0,0.08) 81px)',
          }}
        />

        {/* Back button */}
        <div className="relative z-10 px-4 pt-4">
          <Link href="/world" className="inline-flex items-center gap-1 text-xs tap-bounce px-2 py-1 rounded-full"
            style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            返回
          </Link>
        </div>

        {/* Hero content */}
        <div className="relative z-10 px-5 pt-6 pb-10">
          <div className="flex gap-2 mb-4 flex-wrap">
            <span className="seal-stamp text-[10px] py-0 px-1.5 animate-seal-stamp">
              平行世界
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)' }}>
              {world.era}
            </span>
          </div>

          <h1 className="text-2xl font-serif font-bold leading-tight animate-fade-in-down"
            style={{ color: 'rgba(255,255,255,0.95)', textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}
          >
            {world.name}
          </h1>

          <p className="text-sm mt-2 font-serif italic animate-fade-in-down stagger-1"
            style={{ color: 'rgba(201,209,217,0.8)', textShadow: '0 1px 8px rgba(0,0,0,0.3)' }}
          >
            {world.tagline}
          </p>

          {/* Tags */}
          <div className="flex gap-2 mt-4 flex-wrap animate-fade-in-down stagger-2">
            <span className="text-[10px] px-2.5 py-1 rounded-full font-medium"
              style={{ background: 'rgba(46,134,193,0.25)', color: 'var(--azurite-light)', border: '1px solid rgba(46,134,193,0.4)' }}>
              {world.techLevel}
            </span>
            {world.civilizations.map((civ) => (
              <span key={civ} className="text-[10px] px-2.5 py-1 rounded-full font-medium"
                style={{ background: 'rgba(241,196,15,0.2)', color: 'var(--gamboge-light)', border: '1px solid rgba(241,196,15,0.35)' }}>
                {civ}
              </span>
            ))}
            <span className="text-[10px] px-2.5 py-1 rounded-full font-medium"
              style={{ background: 'rgba(39,174,96,0.2)', color: 'var(--malachite-light)', border: '1px solid rgba(39,174,96,0.35)' }}>
              {world.geography}
            </span>
            {world.factions && (
              <span className="text-[10px] px-2.5 py-1 rounded-full font-medium"
                style={{ background: 'rgba(142,68,173,0.2)', color: 'rgba(183,138,214,0.9)', border: '1px solid rgba(142,68,173,0.35)' }}>
                {world.factions.length} 阵营
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ===== Prologue ===== */}
      {world.prologue && (
        <section className="px-4 -mt-4 relative z-10 mb-4">
          <div className="card-xuan p-5 animate-slide-in-up"
            style={{ borderLeft: '3px solid var(--gamboge)' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"
                style={{ color: 'var(--gamboge)' }}
              >
                <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
              </svg>
              <h3 className="text-sm font-serif font-bold" style={{ color: 'var(--gamboge)' }}>
                序章
              </h3>
            </div>
            <p className="text-xs leading-loose font-serif" style={{ color: 'var(--ink-medium)', lineHeight: '2', textIndent: '2em' }}>
              {world.prologue}
            </p>
          </div>
        </section>
      )}

      {/* ===== Point of Divergence ===== */}
      {!world.prologue && (
        <section className="px-4 -mt-4 relative z-10">
          <div className="card-xuan p-5 animate-slide-in-up"
            style={{ borderLeft: '3px solid var(--vermillion)' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"
                style={{ color: 'var(--vermillion)' }}
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              <h3 className="text-sm font-serif font-bold" style={{ color: 'var(--vermillion)' }}>
                历史分叉点
              </h3>
            </div>
            <p className="text-xs leading-relaxed font-serif" style={{ color: 'var(--ink-medium)', lineHeight: '1.9' }}>
              {world.pointOfDivergence}
            </p>
          </div>
        </section>
      )}

      {/* ===== Tab Navigation ===== */}
      {hasNovelExtensions && (
        <div className="px-4 mt-6">
          <div className="flex gap-1 p-1 rounded-lg overflow-x-auto scrollbar-hide"
            style={{ background: 'var(--xuan-dark)' }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="flex-shrink-0 flex-1 min-w-[56px] py-2 px-3 rounded-md text-xs font-medium tap-bounce transition-all"
                style={{
                  background: activeTab === tab.key ? 'var(--xuan)' : 'transparent',
                  color: activeTab === tab.key ? 'var(--ink-dark)' : 'var(--ink-light)',
                  boxShadow: activeTab === tab.key ? 'var(--shadow-sm)' : 'none',
                  transform: activeTab === tab.key ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ===== Tab Content ===== */}

      {/* ── Story Tab (default) ── */}
      {activeTab === 'story' && (
        <>
          {/* Map Section */}
          <section className="px-4 mt-6">
            <SectionHeader
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" style={{ color: 'var(--azurite)' }}><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>}
              title="势力版图"
            />

            <div className="card-xuan p-4">
              <p className="text-xs mb-3" style={{ color: 'var(--ink-medium)' }}>
                {world.mapDescription}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {world.mapRegions.map((region) => (
                  <RegionCard
                    key={region.name}
                    region={region}
                    onClick={() => setSelectedRegion(selectedRegion?.name === region.name ? null : region)}
                  />
                ))}
              </div>
              {selectedRegion && (
                <div className="mt-3 p-3 rounded-lg animate-fade-in"
                  style={{ background: 'var(--xuan-dark)' }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold font-serif" style={{ color: 'var(--ink-dark)' }}>
                      {selectedRegion.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0 rounded-full"
                      style={{
                        background: getFactionColor(selectedRegion.faction).bg,
                        color: getFactionColor(selectedRegion.faction).text,
                      }}
                    >
                      {selectedRegion.faction}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-medium)' }}>
                    {selectedRegion.description}
                  </p>
                  {selectedRegion.terrain && (
                    <p className="text-[10px] mt-1" style={{ color: 'var(--ink-light)' }}>
                      地形：{selectedRegion.terrain} {selectedRegion.resources && `| 产：${selectedRegion.resources}`}
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Key Divergences */}
          <section className="mt-6">
            <SectionHeader
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" style={{ color: 'var(--gamboge)' }}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>}
              title="与真实历史的不同"
            />

            <div className="flex gap-3 overflow-x-auto px-4 pb-2 -mx-4 scrollbar-hide">
              {world.keyDivergences.map((divergence, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-52 p-3.5 rounded-xl animate-slide-in-right"
                  style={{
                    background: i % 2 === 0 ? 'var(--xuan)' : 'var(--xuan-dark)',
                    border: `1px solid ${i % 2 === 0 ? 'var(--xuan-dark)' : 'var(--xuan)'}`,
                    boxShadow: 'var(--shadow-sm)',
                    animationDelay: `${i * 0.08}s`,
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
                      style={{ background: i % 2 === 0 ? 'var(--gamboge)' : 'var(--vermillion)', color: '#fff' }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-[10px] font-medium" style={{ color: 'var(--ink-light)' }}>
                      分叉 #{i + 1}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-medium)' }}>
                    {divergence}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Chapters Timeline */}
          <section className="px-4 mt-8 mb-4">
            <SectionHeader
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" style={{ color: 'var(--azurite)' }}><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></svg>}
              title="世界纪年"
              badge={`共 ${world.chapters.length} 章`}
            />

            <div className="relative">
              {world.chapters.map((chapter, index) => (
                <ChapterCard key={chapter.id} chapter={chapter} index={index} />
              ))}
            </div>

            {/* Economy footer */}
            {world.economy && (
              <div className="mt-4 p-4 rounded-xl"
                style={{ background: 'var(--xuan-dark)' }}
              >
                <p className="text-[10px] font-medium mb-1.5" style={{ color: 'var(--gamboge)' }}>经济体系</p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-medium)' }}>
                  {world.economy}
                </p>
              </div>
            )}

            {/* Epilogue */}
            {world.epilogue && (
              <div className="mt-4 p-5 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, var(--ink-dark), var(--azurite-deep))',
                }}
              >
                <p className="text-[10px] font-medium mb-2" style={{ color: 'var(--gamboge)' }}>终章</p>
                <p className="text-xs italic leading-loose font-serif" style={{ color: 'rgba(201, 209, 217, 0.85)', lineHeight: '2', textIndent: '2em' }}>
                  {world.epilogue}
                </p>
              </div>
            )}

            {/* World description footer */}
            <div className="mt-4 p-4 rounded-xl text-center"
              style={{
                background: 'linear-gradient(135deg, var(--ink-dark), var(--azurite-deep))',
              }}
            >
              <p className="text-xs font-serif italic" style={{ color: 'rgba(201,209,217,0.7)', lineHeight: '1.9' }}>
                {world.geographyDescription}
              </p>
              <div className="flex items-center justify-center gap-3 mt-3">
                <span className="text-[10px]" style={{ color: 'var(--azurite-light)', opacity: 0.7 }}>
                  {world.techLevel}
                </span>
                <span style={{ color: 'var(--ink-light)' }}>|</span>
                <span className="text-[10px]" style={{ color: 'var(--azurite-light)', opacity: 0.7 }}>
                  {world.civilizations.join(' / ')}
                </span>
              </div>
            </div>
          </section>
        </>
      )}

      {/* ── Factions Tab ── */}
      {activeTab === 'factions' && world.factions && (
        <section className="px-4 mt-4 mb-4">
          {/* Faction Cards */}
          <div className="space-y-3">
            {world.factions.map((faction, i) => {
              const colors = getFactionColor(faction.name);
              return (
                <div key={faction.id} className="card-xuan p-4 animate-slide-in-up" style={{ animationDelay: `${i * 0.08}s`, borderLeft: `3px solid ${colors.text}` }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-serif"
                        style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}>
                        {faction.name[0]}
                      </div>
                      <div>
                        <h4 className="text-sm font-serif font-bold" style={{ color: 'var(--ink-dark)' }}>{faction.name}</h4>
                        <span className="text-[10px]" style={{ color: 'var(--ink-light)' }}>{faction.leader}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] px-2 py-1 rounded inline-block mb-2" style={{ background: colors.bg, color: colors.text }}>
                    {faction.ideology}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-medium)' }}>
                    {faction.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Faction Relations */}
          {world.factionRelations && world.factionRelations.length > 0 && (
            <div className="mt-6">
              <SectionHeader
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" style={{ color: 'var(--vermillion)' }}><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>}
                title="阵营关系"
                badge={`${world.factionRelations.length} 条`}
              />

              <div className="space-y-2">
                {world.factionRelations.map((rel, i) => {
                  const rs = getRelationStyle(rel.type);
                  return (
                    <div key={i} className="card-xuan p-3 flex items-center gap-3 animate-slide-in-up" style={{ animationDelay: `${i * 0.06}s` }}>
                      <span className="text-xs font-bold font-serif" style={{ color: 'var(--ink-dark)' }}>{rel.from}</span>
                      <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-[9px] font-medium"
                        style={{ background: rs.bg, color: rs.color, border: `1px solid ${rs.color}40` }}>
                        {rs.label}
                      </span>
                      <span className="text-xs font-bold font-serif" style={{ color: 'var(--ink-dark)' }}>{rel.to}</span>
                      <span className="text-[10px] flex-1 text-right" style={{ color: 'var(--ink-light)' }}>
                        {rel.description.length > 20 ? rel.description.slice(0, 20) + '...' : rel.description}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── Characters Tab ── */}
      {activeTab === 'chars' && world.characterArcs && (
        <section className="px-4 mt-4 mb-4">
          <div className="space-y-4">
            {world.characterArcs.map((arc, i) => {
              const colors = getFactionColor(arc.faction);
              return (
                <div key={arc.name} className="card-xuan overflow-hidden animate-slide-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  {/* Character header */}
                  <div className="p-4" style={{ borderBottom: `1px solid var(--xuan-dark)` }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold font-serif"
                        style={{ background: colors.bg, color: colors.text, border: `2px solid ${colors.border}` }}>
                        {arc.name[0]}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-serif font-bold" style={{ color: 'var(--ink-dark)' }}>{arc.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] px-1.5 py-0 rounded" style={{ background: colors.bg, color: colors.text }}>
                            {arc.title}
                          </span>
                          <span className="text-[10px]" style={{ color: 'var(--ink-light)' }}>{arc.faction}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--ink-medium)' }}>
                      {arc.backstory}
                    </p>
                    <p className="text-[10px] mt-1.5 italic" style={{ color: 'var(--ink-light)' }}>
                      命运：{arc.fate}
                    </p>
                  </div>

                  {/* Character arc chapters */}
                  <div className="px-4 py-3">
                    <p className="text-[10px] font-medium mb-2" style={{ color: 'var(--vermillion)' }}>人物弧线</p>
                    <div className="space-y-2">
                      {arc.chapters.map((ch, ci) => (
                        <div key={ci} className="flex gap-2">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold mt-0.5"
                            style={{ background: 'var(--vermillion-pale)', color: 'var(--vermillion-deep)' }}>
                            {ci + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-medium)' }}>
                              {ch.development}
                            </p>
                            {ch.pivotalMoment && (
                              <p className="text-[10px] mt-1 italic" style={{ color: 'var(--gamboge)' }}>
                                转折：{ch.pivotalMoment}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Tech Tab ── */}
      {activeTab === 'tech' && world.techTimeline && (
        <section className="px-4 mt-4 mb-4">
          <div className="relative">
            {/* Timeline */}
            {world.techTimeline.map((tech, i) => (
              <div key={tech.name} className="relative pl-8 pb-5 animate-slide-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                {/* Line */}
                <div className="absolute left-[11px] top-5 bottom-0 w-0.5"
                  style={{ background: 'linear-gradient(to bottom, var(--azurite), var(--gamboge))' }}
                />
                {/* Dot */}
                <div className="absolute left-2 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
                  style={{ background: 'var(--azurite)', color: '#fff', border: '2px solid var(--xuan)' }}
                >
                  {i + 1}
                </div>
                {/* Card */}
                <div className="card-xuan p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h4 className="text-sm font-serif font-bold" style={{ color: 'var(--ink-dark)' }}>{tech.name}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--azurite-pale)', color: 'var(--azurite-deep)' }}>
                      {tech.era}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-medium)' }}>
                    {tech.description}
                  </p>
                  <p className="text-[10px] mt-2 italic" style={{ color: 'var(--gamboge)' }}>
                    影响：{tech.impact}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Tech level description */}
          {world.techLevelDescription && (
            <div className="mt-2 p-4 rounded-xl"
              style={{ background: 'var(--xuan-dark)' }}
            >
              <p className="text-[10px] font-medium mb-1" style={{ color: 'var(--azurite)' }}>总体技术水平</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-medium)' }}>
                {world.techLevelDescription}
              </p>
            </div>
          )}
        </section>
      )}

      {/* ── Lore Tab ── */}
      {activeTab === 'lore' && world.worldLore && (
        <section className="px-4 mt-4 mb-4 space-y-3">
          {/* Religion */}
          <div className="card-xuan p-4 animate-slide-in-up">
            <div className="flex items-center gap-2 mb-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" style={{ color: 'var(--indigo-ancient, #8e44ad)' }}>
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="M12 6v6l4 2" />
              </svg>
              <h4 className="text-sm font-serif font-bold" style={{ color: 'var(--ink-dark)' }}>信仰与宗教</h4>
            </div>
            <p className="text-xs leading-loose" style={{ color: 'var(--ink-medium)', lineHeight: '1.9' }}>
              {world.worldLore.religion}
            </p>
          </div>

          {/* Art */}
          <div className="card-xuan p-4 animate-slide-in-up" style={{ animationDelay: '0.08s' }}>
            <div className="flex items-center gap-2 mb-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" style={{ color: 'var(--vermillion)' }}>
                <path d="M12 19l7-7 3 3-7 7-3-3z" />
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
              </svg>
              <h4 className="text-sm font-serif font-bold" style={{ color: 'var(--ink-dark)' }}>艺术与文化</h4>
            </div>
            <p className="text-xs leading-loose" style={{ color: 'var(--ink-medium)', lineHeight: '1.9' }}>
              {world.worldLore.art}
            </p>
          </div>

          {/* Philosophy */}
          <div className="card-xuan p-4 animate-slide-in-up" style={{ animationDelay: '0.16s' }}>
            <div className="flex items-center gap-2 mb-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" style={{ color: 'var(--azurite)' }}>
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <h4 className="text-sm font-serif font-bold" style={{ color: 'var(--ink-dark)' }}>思想与哲学</h4>
            </div>
            <p className="text-xs leading-loose" style={{ color: 'var(--ink-medium)', lineHeight: '1.9' }}>
              {world.worldLore.philosophy}
            </p>
          </div>

          {/* Legend */}
          <div className="card-xuan p-4 animate-slide-in-up" style={{ animationDelay: '0.24s', borderLeft: '3px solid var(--gamboge)' }}>
            <div className="flex items-center gap-2 mb-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" style={{ color: 'var(--gamboge)' }}>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <h4 className="text-sm font-serif font-bold" style={{ color: 'var(--gamboge)' }}>传说与神话</h4>
            </div>
            <p className="text-xs leading-loose font-serif italic" style={{ color: 'var(--ink-medium)', lineHeight: '2' }}>
              {world.worldLore.legend}
            </p>
          </div>
        </section>
      )}

      {/* ===== AI Disclaimer ===== */}
      <div className="px-4 py-3">
        <p className="text-center text-[10px] font-serif" style={{ color: 'var(--ink-light)', opacity: 0.5 }}>
          本世界所有数据（剧情、人物、地图、阵营等）均由 AI 生成，仅供娱乐参考，不构成真实历史记录
        </p>
      </div>

      {/* ===== Bottom Tab Bar ===== */}
      <BottomTabBar active="world" />
    </div>
  );
}
