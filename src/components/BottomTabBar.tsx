'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

interface TabItem {
  key: string
  label: string
  href: string
  icon: React.ReactNode
}

const tabs: TabItem[] = [
  {
    key: 'home',
    label: '首页',
    href: '/',
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    key: 'era',
    label: '时代',
    href: '/era',
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    ),
  },
  {
    key: 'world',
    label: '世界',
    href: '/world',
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    key: 'report',
    label: '报告',
    href: '/report',
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    key: 'profile',
    label: '我的',
    href: '/profile',
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
]

function resolveActiveTab(pathname: string): string {
  if (pathname === '/' || pathname === '') return 'home'
  for (const tab of tabs) {
    if (tab.key === 'home') continue
    if (pathname.startsWith(tab.href)) return tab.key
  }
  return 'home'
}

interface BottomTabBarProps {
  active?: string
}

export default function BottomTabBar({ active }: BottomTabBarProps) {
  const pathname = usePathname()
  const activeKey = active ?? resolveActiveTab(pathname)

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center"
      style={{
        height: '56px',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        background: 'var(--xuan)',
        borderTop: '1px solid var(--xuan-dark)',
      }}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = activeKey === tab.key
        return (
          <Link
            key={tab.key}
            href={tab.href}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 tap-bounce"
            style={{
              minWidth: '48px',
              height: '100%',
              color: isActive
                ? 'var(--azurite)'
                : 'var(--ink-light)',
              fontWeight: isActive ? 600 : 400,
              transition: 'all 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: isActive ? 'scale(1.08)' : 'scale(1)',
            }}
            role="tab"
            aria-selected={isActive}
            aria-label={tab.label}
          >
            {tab.icon}
            <span className="text-xs leading-none mt-0.5">{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
