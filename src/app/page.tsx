'use client';

import Image from 'next/image';
import Link from 'next/link';
import BottomTabBar from '@/components/BottomTabBar';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-ink-wash" style={{ backgroundColor: 'var(--xuan)' }}>
      <div className="w-full px-5 pt-12 pb-24">
        {/* ===== 1. Logo Area ===== */}
        <div className="flex flex-col items-center text-center mb-8 animate-fade-in-down">
          <div
            className="relative w-20 h-20 mb-4 rounded-full flex items-center justify-center animate-scale-in-bounce stagger-1"
            style={{
              background: 'linear-gradient(135deg, var(--azurite-pale), rgba(46, 134, 193, 0.08))',
              border: '2px solid rgba(46, 134, 193, 0.25)',
              boxShadow: 'var(--shadow-glow-azurite)',
            }}
          >
            <Image
              src="/logo.png"
              alt="风尘录"
              width={56}
              height={56}
              className="rounded-full"
              style={{ objectFit: 'contain' }}
            />
            <span className="sr-only">风尘录</span>
          </div>
          <h1
            className="text-azurite-gradient font-serif text-3xl font-bold tracking-wider mb-2"
          >
            风尘录
          </h1>
          <p
            className="text-sm font-serif"
            style={{ color: 'var(--ink-light)' }}
          >
            穿越千年 · 触摸历史
          </p>
        </div>

        {/* ===== 2. Intro Banner ===== */}
        <div
          className="animate-slide-in-left stagger-2 rounded-xl p-4 mb-6 card-xuan"
        >
          <div className="flex items-center gap-2 mb-2">
            <span
              className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                background: 'var(--azurite-pale)',
                color: 'var(--azurite)',
                border: '1px solid rgba(46, 134, 193, 0.2)',
              }}
            >
              介绍
            </span>
            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                background: 'var(--gamboge-pale)',
                color: 'var(--ochre)',
              }}
            >
              AI 沉浸式
            </span>
          </div>
          <p
            className="text-sm leading-relaxed font-serif"
            style={{ color: 'var(--ink-medium)' }}
          >
            以沉浸式交互体验中国历史。从远古传说到现代文明，每一个时代都是一个全新的世界。
            选择你熟悉的历史篇章，或踏入未知的领域探索新知。
          </p>
        </div>

        {/* ===== 3. Two-Column Selection ===== */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Known History */}
          <Link href="/era?stage=random" className="animate-slide-in-up block stagger-3 magnetic-hover">
            <div
              className="relative overflow-hidden rounded-xl h-36 flex flex-col justify-end p-4 card-lift tap-bounce"
              style={{
                background: 'linear-gradient(160deg, var(--azurite-pale) 0%, var(--xuan) 40%, var(--malachite-pale) 100%)',
                border: '1px solid rgba(46, 134, 193, 0.15)',
              }}
            >
              {/* Decorative circle */}
              <div className="absolute top-3 right-3 w-10 h-10 rounded-full opacity-20"
                style={{ background: 'var(--azurite)' }}
              />
              <div className="absolute top-6 right-6 w-5 h-5 rounded-full opacity-15"
                style={{ background: 'var(--malachite)' }}
              />
              <h3
                className="font-serif text-base font-semibold mb-0.5 relative z-10"
                style={{ color: 'var(--azurite-deep)' }}
              >
                已知历史
              </h3>
              <p
                className="text-xs relative z-10"
                style={{ color: 'var(--ink-light)' }}
              >
                按时代探索所学知识
              </p>
            </div>
          </Link>

          {/* Unknown World */}
          <Link href="/world" className="animate-slide-in-up block stagger-4 magnetic-hover">
            <div
              className="relative overflow-hidden rounded-xl h-36 flex flex-col justify-end p-4 card-lift tap-bounce"
              style={{
                background: 'linear-gradient(160deg, var(--vermillion-pale) 0%, var(--xuan) 40%, var(--gamboge-pale) 100%)',
                border: '1px solid rgba(231, 76, 60, 0.15)',
              }}
            >
              {/* Decorative elements */}
              <div className="absolute top-3 right-3 w-10 h-10 rounded-full opacity-20"
                style={{ background: 'var(--vermillion)' }}
              />
              <div className="absolute top-6 right-6 w-5 h-5 rounded-full opacity-15"
                style={{ background: 'var(--gamboge)' }}
              />
              <h3
                className="font-serif text-base font-semibold mb-0.5 relative z-10"
                style={{ color: 'var(--vermillion-deep)' }}
              >
                未知世界
              </h3>
              <p
                className="text-xs relative z-10"
                style={{ color: 'var(--ink-light)' }}
              >
                探索全新的历史篇章
              </p>
            </div>
          </Link>
        </div>

        {/* ===== 4. Feature Highlights ===== */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {[
            { icon: '📜', label: '真实课程', desc: '同步教材', href: '/era' },
            { icon: '🎭', label: '角色扮演', desc: '沉浸体验', href: '/roleplay' },
            { icon: '🌍', label: '平行世界', desc: 'AI 创造', href: '/world' },
          ].map((feature, i) => (
            <Link
              key={feature.label}
              href={feature.href}
              className={`animate-scale-in-bounce stagger-${i + 2} card-xuan p-3 text-center tap-bounce block`}
            >
              <span className="text-2xl block mb-1">{feature.icon}</span>
              <span className="block text-xs font-semibold font-serif" style={{ color: 'var(--ink-dark)' }}>
                {feature.label}
              </span>
              <span className="block text-[10px] mt-0.5" style={{ color: 'var(--ink-light)' }}>
                {feature.desc}
              </span>
            </Link>
          ))}
        </div>

        {/* ===== 5. Primary CTA ===== */}
        <div className="animate-slide-in-up stagger-5 mb-3">
          <Link
            href="/era"
            className="block w-full py-3.5 rounded-xl text-center font-serif text-lg font-semibold tracking-wider magnetic-hover tap-bounce"
            style={{
              background: 'linear-gradient(135deg, var(--azurite), var(--azurite-light))',
              color: '#fff',
              boxShadow: '0 4px 20px rgba(46, 134, 193, 0.35)',
            }}
          >
            开始穿越
          </Link>
        </div>

        {/* ===== 6. Secondary CTA ===== */}
        <div className="animate-slide-in-up stagger-6 mb-8">
          <button
            className="block w-full py-3 rounded-xl text-center text-sm tracking-wider tap-bounce card-xuan"
            style={{
              color: 'var(--ink-medium)',
            }}
          >
            继续上次
          </button>
        </div>

        {/* ===== 7. Settings Icon ===== */}
        <div className="animate-slide-in-right flex justify-end stagger-6">
          <Link
            href="/profile"
            className="w-10 h-10 rounded-full flex items-center justify-center tap-bounce card-xuan"
            style={{
              color: 'var(--ink-medium)',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.21 15.32A8.5 8.5 0 0 1 8.68 3.79" />
              <path d="M3.79 8.68A8.5 8.5 0 0 1 15.32 20.21" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </Link>
        </div>
      </div>

      {/* ===== 8. BottomTabBar ===== */}
      <BottomTabBar active="home" />
    </div>
  );
}
