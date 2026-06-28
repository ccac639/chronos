'use client'

import Link from 'next/link'
import React from 'react'

interface HeaderBarProps {
  /** Optional back button href; if provided, shows a back arrow on the left */
  backHref?: string
  /** Optional title override; defaults to 风尘录 */
  title?: string
}

export default function HeaderBar({ backHref, title }: HeaderBarProps) {
  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-center px-4"
      style={{
        height: '52px',
        background: 'var(--parchment)',
        borderBottom: '1px solid var(--ink-100)',
      }}
    >
      {backHref ? (
        <div className="flex items-center w-full gap-3">
          <Link
            href={backHref}
            className="flex items-center justify-center"
            style={{ width: 32, height: 32 }}
            aria-label="返回"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-ink-600"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Link>
          <h1 className="font-serif text-lg font-semibold text-ink-800 truncate">
            {title || '风尘录'}
          </h1>
        </div>
      ) : (
        <h1
          className="font-serif text-lg font-semibold"
          style={{ color: 'var(--gold-primary)' }}
        >
          {title || '风尘录'}
        </h1>
      )}
    </header>
  )
}
