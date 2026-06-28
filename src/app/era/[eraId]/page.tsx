'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getEra, getStageForEra, getStage } from '@/lib/data';
import BottomTabBar from '@/components/BottomTabBar';

export default function EraDetailPage() {
  const params = useParams();
  const eraId = params.eraId as string;
  const eraResult = getEra(eraId);
  const stageId = getStageForEra(eraId);
  const stageObj = stageId ? getStage(stageId) : undefined;

  if (!eraResult) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: 'var(--xuan)' }}>
        <p className="text-ink-500 font-sans">未找到该朝代</p>
        <Link href="/era" className="mt-4 text-azurite-600 underline text-sm">
          返回朝代列表
        </Link>
        <BottomTabBar active="era" />
      </div>
    );
  }

  const era = eraResult.era;

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: 'var(--xuan)' }}>
      {/* ===== Header ===== */}
      <header className="sticky top-0 z-40 backdrop-blur-md" style={{ background: 'rgba(248, 245, 239, 0.92)', borderBottom: '1px solid var(--xuan-dark)' }}>
        <div className="flex items-center gap-3 px-4 h-14">
          <Link
            href="/era"
            className="flex items-center justify-center w-8 h-8 rounded-full tap-bounce"
            style={{ background: 'var(--xuan-dark)' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-ink-700">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Link>
          <h1 className="text-base font-medium truncate font-serif" style={{ color: 'var(--ink-dark)' }}>
            {era.name}
          </h1>
        </div>
      </header>

      {/* ===== Era Info Card ===== */}
      <section className="px-4 pt-5 pb-3 animate-fade-in">
        <div className="card-xuan p-5 relative overflow-hidden">
          {/* Decorative top border */}
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, var(--azurite), var(--malachite), var(--azurite))' }} />

          <div className="flex items-center gap-2 mb-2">
            {stageObj && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: 'var(--azurite-pale)', color: 'var(--azurite)' }}>
                {stageObj.name}
              </span>
            )}
            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: 'var(--xuan-dark)', color: 'var(--ink-medium)' }}>
              {era.period}
            </span>
          </div>

          <h2 className="text-2xl font-serif font-bold leading-tight" style={{ color: 'var(--ink-dark)' }}>
            {era.name}
          </h2>

          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--ink-medium)' }}>
            {era.description}
          </p>

          {/* Figures */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs" style={{ color: 'var(--ink-light)' }}>代表人物：</span>
            {era.figures.map((figure) => (
              <span
                key={figure}
                className="text-xs px-2 py-0.5 rounded tap-bounce"
                style={{ background: 'var(--xuan-dark)', color: 'var(--ink-medium)', border: '1px solid var(--xuan-dark)' }}
              >
                {figure}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Chapter List ===== */}
      <section className="px-4 pt-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium font-sans" style={{ color: 'var(--ink-dark)' }}>
            共 {era.chapters.length} 章
          </h3>
          <div className="progress-ink w-24">
            <div className="progress-ink-fill" style={{ width: '0%' }} />
          </div>
        </div>

        <div className="space-y-3">
          {era.chapters.map((chapter, index) => (
            <div
              key={chapter.id}
              className="card-xuan p-4 animate-slide-up"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              {/* Chapter number indicator */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-serif font-bold" style={{ background: 'var(--azurite)', color: '#fff' }}>
                  {index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-serif font-semibold leading-snug" style={{ color: 'var(--ink-dark)' }}>
                    {chapter.title}
                  </h4>
                  <p className="text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--ink-medium)' }}>
                    {chapter.summary}
                  </p>
                </div>
              </div>

              {/* Start experience button */}
              <div className="mt-3 ml-11">
                <Link
                  href={`/immersive?eraId=${eraId}&chapterId=${chapter.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium tap-bounce magnetic-hover"
                  style={{
                    background: 'linear-gradient(135deg, var(--azurite), var(--azurite-light))',
                    color: '#fff',
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  开始体验
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Bottom Tab Bar ===== */}
      <BottomTabBar active="era" />
    </div>
  );
}
