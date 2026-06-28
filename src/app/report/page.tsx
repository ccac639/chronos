'use client';

import BottomTabBar from '@/components/BottomTabBar';

const stats = [
  { label: '已完成体验', value: '12', unit: '次', accent: 'var(--azurite)' },
  { label: '知识掌握率', value: '78', unit: '%', accent: 'var(--malachite)' },
  { label: '连续学习', value: '7', unit: '天', accent: 'var(--vermillion)' },
  { label: '历史足迹', value: '5', unit: '朝代', accent: 'var(--ochre-light)' },
];

const knowledgeAreas = [
  { name: '唐朝政治', pct: 85 },
  { name: '安史之乱', pct: 72 },
  { name: '科举制度', pct: 90 },
  { name: '丝绸之路', pct: 60 },
];

const recentExperiences = [
  { era: '唐朝 · 开元盛世', date: '今天', summary: '体验了开元年间长安城繁华景象' },
  { era: '秦朝 · 统一六国', date: '昨天', summary: '参与秦始皇统一天下的战略决策' },
  { era: '宋朝 · 汴京生活', date: '3天前', summary: '漫步北宋汴京感受市民文化' },
];

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-ink-wash" style={{ backgroundColor: 'var(--xuan)' }}>
      <div className="w-full px-5 pt-6 pb-24">
      {/* ── page header ── */}
      <header className="sticky top-0 z-40 -mx-5 px-5 pt-6 pb-3" style={{ background: 'rgba(248, 245, 239, 0.92)', backdropFilter: 'blur(10px)' }}>
        <h1 className="font-serif text-2xl font-bold text-azurite-gradient">
          学习报告
        </h1>
      </header>

      <main className="-mx-5 px-5 space-y-6">
        {/* ── stats row ── */}
        <section className="-mx-5">
          <div className="flex gap-3 overflow-x-auto px-5 py-1 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex-shrink-0 rounded-xl px-4 py-3 w-[120px] card-lift tap-bounce cursor-default"
                style={{
                  background: 'var(--xuan-dark)',
                  border: '1px solid var(--xuan-dark)',
                }}
              >
                <p className="text-xs mb-1" style={{ color: 'var(--ink-light)' }}>
                  {s.label}
                </p>
                <p className="flex items-baseline gap-0.5">
                  <span className="text-2xl font-bold font-serif" style={{ color: s.accent }}>
                    {s.value}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--ink-medium)' }}>
                    {s.unit}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 知识掌握 ── */}
        <section>
          <h2 className="font-serif text-lg font-semibold mb-3" style={{ color: 'var(--ink-dark)' }}>
            知识掌握
          </h2>

          <div className="rounded-xl p-4 space-y-4" style={{ background: 'var(--xuan-dark)', border: '1px solid var(--xuan-dark)' }}>
            {knowledgeAreas.map((area) => (
              <div key={area.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium" style={{ color: 'var(--ink-dark)' }}>
                    {area.name}
                  </span>
                  <span className="text-xs font-semibold" style={{ color: 'var(--azurite)' }}>
                    {area.pct}%
                  </span>
                </div>
                <div className="progress-ink">
                  <div
                    className="progress-ink-fill"
                    style={{ width: `${area.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 最近体验 ── */}
        <section>
          <h2 className="font-serif text-lg font-semibold mb-3" style={{ color: 'var(--ink-dark)' }}>
            最近体验
          </h2>

          <div className="relative ml-3 pl-5 space-y-5" style={{ borderLeft: '2px solid var(--xuan-dark)' }}>
            {recentExperiences.map((exp, i) => (
              <div key={i} className="relative">
                {/* dot */}
                <span
                  className="absolute -left-[25px] top-0.5 w-3 h-3 rounded-full"
                  style={{
                    background: i === 0 ? 'var(--vermillion)' : 'var(--azurite)',
                    boxShadow: i === 0 ? '0 0 8px rgba(231,76,60,0.3)' : '0 0 8px rgba(46,134,193,0.2)',
                    border: '2px solid var(--xuan)',
                  }}
                />
                <div className="rounded-lg p-3 card-lift" style={{ background: 'var(--xuan-dark)', border: '1px solid var(--xuan-dark)' }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold font-serif" style={{ color: 'var(--ink-dark)' }}>
                      {exp.era}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--ink-light)' }}>
                      {exp.date}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-medium)' }}>
                    {exp.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      </div>

      {/* ── bottom tab bar ── */}
      <BottomTabBar active="report" />
    </div>
  );
}
