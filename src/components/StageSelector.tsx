'use client'

import React, { useRef } from 'react'

interface Stage {
  id: string
  name: string
}

interface StageSelectorProps {
  stages: Stage[]
  currentStage: string
  onSelect: (stageId: string) => void
}

export default function StageSelector({
  stages,
  currentStage,
  onSelect,
}: StageSelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto py-1 px-4 scrollbar-hide"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {stages.map((stage) => {
        const isActive = currentStage === stage.id
        return (
          <button
            key={stage.id}
            onClick={() => onSelect(stage.id)}
            className="flex-shrink-0 rounded-full text-sm tap-bounce"
            style={{
              minWidth: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 16px',
              border: isActive
                ? '1.5px solid var(--azurite)'
                : '1.5px solid var(--xuan-dark)',
              background: isActive
                ? 'var(--azurite)'
                : 'transparent',
              color: isActive
                ? '#fff'
                : 'var(--ink-medium)',
              fontWeight: isActive ? 600 : 400,
              whiteSpace: 'nowrap',
              transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: isActive ? 'scale(1.05)' : 'scale(1)',
              boxShadow: isActive ? '0 2px 12px rgba(46, 134, 193, 0.3)' : 'none',
            }}
            aria-pressed={isActive}
            aria-label={stage.name}
          >
            {stage.name}
          </button>
        )
      })}
    </div>
  )
}
