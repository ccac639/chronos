'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BottomTabBar from '@/components/BottomTabBar';
import { sampleWorlds } from '@/data/sample-worlds';

const GEOGRAPHY_OPTIONS = ['大陆', '岛屿', '半岛', '星球', '浮空'] as const;
const CIVILIZATION_TAGS = [
  '农耕', '游牧', '商业', '航海',
  '仙侠玄幻', '蒸汽朋克', '洪荒神话',
] as const;

export default function WorldPage() {
  const router = useRouter();
  const [geography, setGeography] = useState<string>('大陆');
  const [startYear, setStartYear] = useState<number>(0);
  const [civilizations, setCivilizations] = useState<string[]>(['农耕']);
  const [aiSeed, setAiSeed] = useState('');

  const REAL_TAGS = ['农耕', '游牧', '商业', '航海'] as const;
  const FANTASY_TAGS = ['仙侠玄幻', '蒸汽朋克', '洪荒神话'] as const;

  const toggleCivilization = (tag: string) => {
    const isFantasy = FANTASY_TAGS.includes(tag as any);
    setCivilizations((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      }
      // 奇幻类型只能选一个：选新的时先移除旧的
      if (isFantasy) {
        return [...prev.filter((t) => !FANTASY_TAGS.includes(t as any)), tag];
      }
      return [...prev, tag];
    });
  };

  /* yearLabel: 0 = 远古时代, each step = 100 years
     0 → "远古时代"
     1 → "100年"
     ...
     60 → "6000年"
  */
  const yearLabel = (val: number) => {
    if (val === 0) return '远古时代';
    return `${val * 100}年`;
  };

  const viewWorld = (id: string) => {
    router.push(`/world/${id}`);
  };

  const playWorld = (id: string) => {
    router.push(`/world/adventure?world=${id}`);
  };

  /* Total range: 60 steps × 100 years
     0 = 远古时代, 60 = 6000年 */
  const TOTAL_STEPS = 60;
  const sliderPercent = (startYear / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen bg-ink-wash pb-20" style={{ backgroundColor: 'var(--xuan)' }}>
      {/* ===== Page Title ===== */}
      <header className="w-full px-5 pt-6 pb-4">
        <h1 className="text-2xl font-serif font-bold leading-tight text-azurite-gradient">
          创造平行世界
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--ink-medium)' }}>
          配置你的历史假设，AI 将为你生成一个全新的平行世界
        </p>
      </header>

      {/* ===== Preview Card ===== */}
      <section className="px-4 pb-4 mx-auto">
        <div className="relative rounded-xl overflow-hidden h-40 flex items-center justify-center animate-fade-in"
          style={{
            background: 'linear-gradient(135deg, var(--azurite-deep) 0%, var(--ink-dark) 40%, var(--ink-medium) 70%, var(--indigo-ancient, #6c3483) 100%)',
          }}
        >
          {/* Ink-wash overlay */}
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(ellipse at 30% 50%, rgba(46,134,193,0.4), transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(241,196,15,0.2), transparent 50%)',
            }}
          />
          <div className="relative z-10 text-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 mx-auto mb-2 animate-float" style={{ color: 'rgba(93, 173, 226, 0.6)' }}>
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
            </svg>
            <p className="text-sm font-serif" style={{ color: 'rgba(93, 173, 226, 0.8)' }}>世界预览</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(139, 148, 158, 0.6)' }}>配置完成后生成</p>
          </div>
        </div>
      </section>

      {/* ===== Configuration Form ===== */}
      <section className="px-4 mx-auto">
        <div className="card-xuan p-5 space-y-5">
          {/* 地理环境 */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--ink-dark)' }}>
              地理环境
            </label>
            <div className="flex gap-2">
              {GEOGRAPHY_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setGeography(opt)}
                  className="flex-1 py-2 rounded-full text-sm font-medium tap-bounce"
                  style={{
                    background: geography === opt ? 'var(--ink-dark)' : 'var(--xuan-dark)',
                    color: geography === opt ? 'var(--azurite-light)' : 'var(--ink-medium)',
                    transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transform: geography === opt ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: geography === opt ? '0 2px 12px rgba(22, 27, 34, 0.2)' : 'none',
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* 起始年代 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium" style={{ color: 'var(--ink-dark)' }}>起始年代</label>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: 'var(--vermillion-pale)', color: 'var(--vermillion)' }}>
                {yearLabel(startYear)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={TOTAL_STEPS}
              value={startYear}
              onChange={(e) => setStartYear(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-azurite-600
                [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform
                [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:active:scale-110"
              style={{
                background: `linear-gradient(to right, var(--azurite) 0%, var(--azurite) ${sliderPercent}%, var(--xuan-dark) ${sliderPercent}%, var(--xuan-dark) 100%)`,
              }}
            />
            <div className="flex justify-between mt-1">
              <span className="text-[10px]" style={{ color: 'var(--vermillion)' }}>远古时代</span>
              <span className="text-[10px]" style={{ color: 'var(--ink-light)' }}>6000年</span>
            </div>
          </div>

          {/* 文明类型 */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--ink-dark)' }}>
              文明类型
            </label>
            <div className="flex gap-2 flex-wrap pb-1 scrollbar-hide">
              {CIVILIZATION_TAGS.map((tag) => {
                const isActive = civilizations.includes(tag);
                const isFantasy = ['仙侠玄幻', '蒸汽朋克', '洪荒神话'].includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleCivilization(tag)}
                    className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium tap-bounce"
                    style={{
                      border: isActive
                        ? `1px solid ${isFantasy ? 'var(--vermillion)' : 'var(--azurite)'}`
                        : '1px solid var(--xuan-dark)',
                      background: isActive
                        ? isFantasy ? 'var(--vermillion)' : 'var(--azurite)'
                        : 'var(--xuan)',
                      color: isActive ? '#fff' : 'var(--ink-medium)',
                      transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                      transform: isActive ? 'scale(1.05)' : 'scale(1)',
                      boxShadow: isActive
                        ? `0 2px 12px ${isFantasy ? 'rgba(231, 76, 60, 0.3)' : 'rgba(46, 134, 193, 0.3)'}`
                        : 'none',
                    }}
                  >
                    {isFantasy && <span className="mr-1">*</span>}
                    {tag}
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] mt-1.5" style={{ color: 'var(--ink-light)' }}>
              带 * 号为奇幻文明类型，可与现实类型自由组合
            </p>
          </div>

          {/* AI种子 */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--ink-dark)' }}>
              AI 种子
            </label>
            <textarea
              value={aiSeed}
              onChange={(e) => setAiSeed(e.target.value)}
              placeholder="描述你对这个世界的想象，例如：如果秦始皇没有统一六国... 或 在一个修仙与蒸汽机共存的世界..."
              className="w-full h-24 px-3 py-2.5 rounded-lg text-sm resize-none"
              style={{
                background: 'var(--xuan-dark)',
                border: '1px solid var(--xuan-dark)',
                color: 'var(--ink-dark)',
              }}
            />
            <p className="text-[10px] mt-1" style={{ color: 'var(--ink-light)' }}>
              越详细的描述，AI 生成的世界越丰富
            </p>
          </div>

          {/* CTA Button */}
          <button className="w-full py-3.5 rounded-lg font-serif font-bold text-base tap-bounce magnetic-hover" style={{
            background: 'linear-gradient(135deg, var(--azurite), var(--azurite-light))',
            color: '#fff',
            boxShadow: '0 4px 20px rgba(46, 134, 193, 0.35)',
          }}>
            <span className="flex items-center justify-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              生成世界
            </span>
          </button>
        </div>
      </section>

      {/* ===== My Worlds Gallery ===== */}
      <section className="px-4 pt-6 pb-4 mx-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium" style={{ color: 'var(--ink-dark)' }}>我的世界</h3>
          <button className="text-xs tap-bounce" style={{ color: 'var(--azurite)' }}>
            查看全部
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {sampleWorlds.map((world, index) => (
            <div
              key={world.id}
              className="flex-shrink-0 w-56 rounded-xl overflow-hidden card-xuan card-lift animate-slide-up cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => viewWorld(world.id)}
            >
              {/* Mini world preview */}
              <div className="h-24 relative"
                style={{
                  background: `linear-gradient(${135 + index * 30}deg, var(--azurite-deep), var(--ink-dark), var(--indigo-ancient, #6c3483))`,
                }}
              >
                <div className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: `radial-gradient(ellipse at ${40 + index * 20}% ${30 + index * 15}%, rgba(46,134,193,0.5), transparent 60%)`,
                  }}
                />
                <div className="absolute bottom-2 left-3 flex items-center gap-1.5">
                  <span className="seal-stamp text-[9px] py-0 px-1.5">
                    平行
                  </span>
                  <span className="text-[9px] px-1.5 py-0 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)' }}
                  >
                    {world.era}
                  </span>
                </div>
                {/* Play button overlay */}
                <button
                  className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center tap-bounce"
                  style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
                  onClick={(e) => { e.stopPropagation(); playWorld(world.id); }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5" style={{ color: '#fff' }}>
                    <polygon points="5 3 19 12 5 21 5 3" fill="#fff" stroke="none" />
                  </svg>
                </button>
              </div>

              <div className="p-3">
                <h4 className="text-sm font-serif font-bold truncate" style={{ color: 'var(--ink-dark)' }}>
                  {world.name}
                </h4>
                <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--ink-medium)' }}>
                  {world.tagline}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-[9px] px-1.5 py-0 rounded-full"
                    style={{ background: 'var(--azurite-pale)', color: 'var(--azurite-deep)' }}
                  >
                    {world.chapters.length} 章
                  </span>
                  <span className="text-[9px] px-1.5 py-0 rounded-full"
                    style={{ background: 'var(--gamboge-pale)', color: 'var(--gamboge-deep)' }}
                  >
                    进入冒险
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Bottom Tab Bar ===== */}
      <BottomTabBar active="world" />
    </div>
  );
}
