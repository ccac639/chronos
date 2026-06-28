'use client';

import BottomTabBar from '@/components/BottomTabBar';

const achievements = [
  { name: '初入江湖', unlocked: true, rotation: -3 },
  { name: '博览群书', unlocked: true, rotation: 2 },
  { name: '决策大师', unlocked: true, rotation: -1 },
  { name: '时间旅行者', unlocked: true, rotation: 3 },
  { name: '文明创造者', unlocked: false, rotation: -2 },
  { name: '连战七日', unlocked: false, rotation: 1 },
];

const footprints = [
  { era: '先秦', pct: 80 },
  { era: '秦汉', pct: 95 },
  { era: '隋唐', pct: 60 },
  { era: '宋元', pct: 30 },
  { era: '明清', pct: 10 },
];

const settings = [
  { label: '学习偏好', icon: '📚' },
  { label: '通知设置', icon: '🔔' },
  { label: '账号安全', icon: '🔒' },
  { label: '退出登录', icon: '🚪', danger: true },
];

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-ink-wash" style={{ backgroundColor: 'var(--xuan)' }}>
      <div className="w-full px-5 pt-10 pb-24">
      <main className="-mx-5 px-5 space-y-6">
        {/* ── user header ── */}
        <section className="flex flex-col items-center pt-10 pb-6">
          {/* avatar */}
          <div
            className="w-[60px] h-[60px] rounded-full flex items-center justify-center text-xl font-serif font-bold mb-3 animate-scale-in-bounce"
            style={{
              background: 'var(--ink-dark)',
              color: 'var(--azurite-light)',
              border: '3px solid var(--azurite)',
              boxShadow: '0 2px 12px rgba(46, 134, 193, 0.25)',
            }}
          >
            历
          </div>
          {/* username */}
          <h1 className="font-serif text-lg font-bold" style={{ color: 'var(--ink-dark)' }}>
            历史探索者
          </h1>
          {/* level badge */}
          <span
            className="mt-1 px-3 py-0.5 rounded-full text-xs font-semibold animate-seal-stamp"
            style={{
              color: 'var(--azurite)',
              background: 'rgba(46, 134, 193, 0.1)',
              border: '1px solid rgba(46, 134, 193, 0.25)',
            }}
          >
            翰林学士
          </span>
          {/* join date */}
          <p className="mt-1.5 text-xs" style={{ color: 'var(--ink-light)' }}>
            加入于 2026年3月
          </p>
        </section>

        {/* ── achievement badges ── */}
        <section>
          <h2 className="font-serif text-lg font-semibold mb-3" style={{ color: 'var(--ink-dark)' }}>
            成就徽章
          </h2>
          <div className="-mx-5">
            <div className="flex gap-3 overflow-x-auto px-5 py-1" style={{ scrollbarWidth: 'none' }}>
              {achievements.map((a, i) => (
                <div
                  key={a.name}
                  className={`flex-shrink-0 flex flex-col items-center gap-1.5 animate-rotate-in stagger-${Math.min(i + 1, 6)}`}
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center tap-bounce"
                    style={{
                      background: a.unlocked ? 'var(--vermillion-deep)' : 'var(--ink-faint)',
                      opacity: a.unlocked ? 1 : 0.5,
                      transform: `rotate(${a.rotation}deg)`,
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 600,
                      lineHeight: '1.2',
                      textAlign: 'center',
                      padding: '4px',
                    }}
                  >
                    {a.name.slice(0, 2)}
                    <br />
                    {a.name.slice(2)}
                  </div>
                  <span
                    className="text-[10px] whitespace-nowrap"
                    style={{ color: a.unlocked ? 'var(--ink-dark)' : 'var(--ink-light)' }}
                  >
                    {a.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 历史足迹 ── */}
        <section>
          <h2 className="font-serif text-lg font-semibold mb-3" style={{ color: 'var(--ink-dark)' }}>
            历史足迹
          </h2>
          <div className="rounded-xl p-4 space-y-4" style={{ background: 'var(--xuan-dark)', border: '1px solid var(--xuan-dark)' }}>
            {footprints.map((fp) => (
              <div key={fp.era}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium" style={{ color: 'var(--ink-dark)' }}>
                    {fp.era}
                  </span>
                  <span className="text-xs font-semibold" style={{ color: 'var(--azurite)' }}>
                    {fp.pct}%
                  </span>
                </div>
                <div className="progress-ink">
                  <div
                    className="progress-ink-fill"
                    style={{ width: `${fp.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── settings list ── */}
        <section>
          <h2 className="font-serif text-lg font-semibold mb-3" style={{ color: 'var(--ink-dark)' }}>
            设置
          </h2>
          <div className="rounded-xl overflow-hidden" style={{ background: 'var(--xuan-dark)', border: '1px solid var(--xuan-dark)' }}>
            {settings.map((item, i) => (
              <div
                key={item.label}
                className="flex items-center justify-between px-4 py-3.5 cursor-pointer tap-bounce"
                style={{
                  borderBottom: i < settings.length - 1 ? '1px solid var(--xuan-dark)' : 'none',
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{item.icon}</span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: (item as { danger?: boolean }).danger ? 'var(--vermillion)' : 'var(--ink-dark)' }}
                  >
                    {item.label}
                  </span>
                </div>
                {/* chevron */}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--ink-light)' }}>
                  <polyline points="6,3 11,8 6,13" />
                </svg>
              </div>
            ))}
          </div>
        </section>
      </main>
      </div>

      {/* ── bottom tab bar ── */}
      <BottomTabBar active="profile" />
    </div>
  );
}
