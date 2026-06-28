import Link from 'next/link'
import React from 'react'

interface EraCardProps {
  era: {
    id: string
    name: string
    period: string
    description: string
    figures: string[]
    chapters: { id: string; title: string; summary: string }[]
  }
  stageId?: string
  index?: number
}

export default function EraCard({ era, stageId, index = 0 }: EraCardProps) {
  const href = `/immersive?eraId=${era.id}`
  return (
    <Link href={href} className={`block animate-slide-in-up`} style={{ animationDelay: `${index * 0.08}s` }}>
      <article
        className="relative rounded-lg overflow-hidden card-lift tap-bounce"
        style={{
          background: 'var(--xuan)',
          border: '1px solid var(--xuan-dark)',
          minHeight: '80px',
        }}
      >
        {/* Azurite left border accent */}
        <div
          className="absolute left-0 top-0 bottom-0"
          style={{
            width: '4px',
            background: 'linear-gradient(to bottom, var(--azurite), var(--malachite))',
          }}
        />

        <div className="pl-4 pr-3 py-3">
          {/* Era name in serif font */}
          <h3
            className="font-serif text-base font-semibold leading-tight"
            style={{ color: 'var(--ink-dark)' }}
          >
            {era.name}
          </h3>

          {/* Period in small text */}
          <p
            className="text-xs mt-0.5"
            style={{ color: 'var(--ink-light)' }}
          >
            {era.period}
          </p>

          {/* Description */}
          <p
            className="text-sm mt-1.5 leading-relaxed line-clamp-2"
            style={{ color: 'var(--ink-medium)' }}
          >
            {era.description}
          </p>

          {/* Figure tags */}
          {era.figures && era.figures.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {era.figures.map((figure) => (
                <span
                  key={figure}
                  className="inline-block px-2 py-0.5 text-xs rounded tap-bounce"
                  style={{
                    background: 'var(--xuan-dark)',
                    color: 'var(--ink-medium)',
                    border: '1px solid var(--xuan-dark)',
                  }}
                >
                  {figure}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
