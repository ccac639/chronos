'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import BottomTabBar from '@/components/BottomTabBar'
import { useLang } from '@/lib/lang-context'
import {
  getAllCharacterRoles,
  getRandomCharacterForEra,
  type Character,
  type CharacterRole,
} from '@/data/characters'

// ─── 学段分组 ───
const STAGE_GROUPS = [
  { id: 'primary', name: '小学' },
  { id: 'junior', name: '初中' },
  { id: 'senior', name: '高中' },
] as const

// ─── 难度配色 ───
const DIFFICULTY_CONFIG = {
  easy: { color: '#22c55e', label: '简单', labelEn: 'Easy' },
  medium: { color: '#eab308', label: '中等', labelEn: 'Medium' },
  hard: { color: '#ef4444', label: '困难', labelEn: 'Hard' },
} as const

export default function RoleplayPage() {
  const { lang } = useLang()
  const router = useRouter()
  const allRoles = useMemo(() => getAllCharacterRoles(), [])

  const [activeStage, setActiveStage] = useState<string>('primary')
  const [expandedEras, setExpandedEras] = useState<Set<string>>(new Set())

  // 按学段过滤时代
  const filteredRoles = useMemo(() => {
    return allRoles.filter((r) => r.eraId.startsWith(activeStage))
  }, [allRoles, activeStage])

  // 统计总角色数
  const totalCharacters = useMemo(() => {
    return filteredRoles.reduce((sum, r) => sum + r.characters.length, 0)
  }, [filteredRoles])

  // 切换时代展开/收起
  const toggleEra = (eraId: string) => {
    setExpandedEras((prev) => {
      const next = new Set(prev)
      if (next.has(eraId)) {
        next.delete(eraId)
      } else {
        next.add(eraId)
      }
      return next
    })
  }

  // 随机角色
  const handleRandomCharacter = () => {
    const randomEra = filteredRoles[Math.floor(Math.random() * filteredRoles.length)]
    if (!randomEra) return
    const randomChar = getRandomCharacterForEra(randomEra.eraId)
    if (!randomChar) return
    router.push(
      `/immersive?eraId=${randomEra.eraId}&charId=${randomChar.id}&lang=${lang}`
    )
  }

  const isEn = lang === 'en'

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--xuan)' }}
    >
      <div className="w-full px-5 pt-12 pb-28">
        {/* ===== Header ===== */}
        <div className="flex items-center justify-between mb-6 animate-fade-in-down">
          <Link
            href="/"
            className="w-9 h-9 rounded-full flex items-center justify-center tap-bounce card-xuan"
            style={{ color: 'var(--ink-medium)' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Link>
          <h1
            className="font-serif text-xl font-semibold tracking-wider"
            style={{ color: 'var(--ink-dark)' }}
          >
            {isEn ? 'Role Play' : '角色扮演'}
          </h1>
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center tap-bounce card-xuan"
            style={{ color: 'var(--ink-medium)' }}
            aria-label={isEn ? 'Filter' : '筛选'}
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
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </button>
        </div>

        {/* ===== Intro Banner ===== */}
        <div className="animate-slide-in-up rounded-xl p-4 mb-6 card-xuan">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                background: 'var(--vermillion-pale)',
                color: 'var(--vermillion)',
                border: '1px solid rgba(231, 76, 60, 0.2)',
              }}
            >
              🎭
            </span>
            <span className="text-sm font-serif" style={{ color: 'var(--ink-dark)' }}>
              {isEn ? 'Choose a character to start your journey' : '选择角色，开启沉浸之旅'}
            </span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-light)' }}>
            {isEn
              ? `${totalCharacters} characters across ${filteredRoles.length} eras waiting for you`
              : `${totalCharacters} 个角色横跨 ${filteredRoles.length} 个时代，等你来扮演`}
          </p>
        </div>

        {/* ===== Stage Tabs ===== */}
        <div className="flex gap-2 mb-5 animate-slide-in-up stagger-1">
          {STAGE_GROUPS.map((stage) => {
            const isActive = activeStage === stage.id
            const count = allRoles.filter((r) => r.eraId.startsWith(stage.id)).length
            return (
              <button
                key={stage.id}
                onClick={() => {
                  setActiveStage(stage.id)
                  setExpandedEras(new Set())
                }}
                className="flex-1 py-2.5 rounded-lg text-sm font-serif font-medium tap-bounce transition-all duration-200"
                style={{
                  backgroundColor: isActive ? 'var(--azurite)' : 'var(--xuan-dark)',
                  color: isActive ? '#fff' : 'var(--ink-light)',
                  border: `1px solid ${isActive ? 'var(--azurite)' : 'var(--xuan-dark)'}`,
                  boxShadow: isActive ? '0 2px 12px rgba(46, 134, 193, 0.3)' : 'none',
                }}
              >
                {stage.name}
                <span className="block text-[10px] mt-0.5 opacity-70">
                  {count} {isEn ? 'eras' : '个时代'}
                </span>
              </button>
            )
          })}
        </div>

        {/* ===== Random Character Button ===== */}
        <div className="mb-5 animate-slide-in-up stagger-2">
          <button
            onClick={handleRandomCharacter}
            className="w-full py-3 rounded-xl text-center text-sm font-serif font-medium tracking-wider tap-bounce"
            style={{
              background: 'linear-gradient(135deg, var(--vermillion-pale), rgba(231, 76, 60, 0.08))',
              color: 'var(--vermillion)',
              border: '1px solid rgba(231, 76, 60, 0.2)',
            }}
          >
            🎲 {isEn ? 'Random Character' : '随机角色'} — {isEn ? 'Let fate decide' : '让命运选择'}
          </button>
        </div>

        {/* ===== Era List ===== */}
        <div className="space-y-3">
          {filteredRoles.map((era, index) => (
            <EraCard
              key={era.eraId}
              era={era}
              isExpanded={expandedEras.has(era.eraId)}
              onToggle={() => toggleEra(era.eraId)}
              lang={lang}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* ===== Bottom Tab Bar ===== */}
      <BottomTabBar active="era" />
    </div>
  )
}

// ─── Era Card Component ───

function EraCard({
  era,
  isExpanded,
  onToggle,
  lang,
  index,
}: {
  era: CharacterRole
  isExpanded: boolean
  onToggle: () => void
  lang: 'zh' | 'en'
  index: number
}) {
  const isEn = lang === 'en'
  const charCount = era.characters.length

  return (
    <div className={`animate-slide-in-up stagger-${Math.min(index + 2, 6)}`}>
      {/* Era Header */}
      <button
        onClick={onToggle}
        className="w-full rounded-lg p-4 card-xuan tap-bounce text-left transition-all duration-200"
        style={{
          border: `1px solid ${isExpanded ? 'var(--azurite)' : 'var(--xuan-dark)'}`,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3
                className="font-serif text-base font-semibold"
                style={{ color: 'var(--ink-dark)' }}
              >
                {isEn && era.eraNameEn ? era.eraNameEn : era.eraName}
              </h3>
              <span
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium"
                style={{
                  background: 'var(--azurite-pale)',
                  color: 'var(--azurite)',
                }}
              >
                {charCount} {isEn ? 'chars' : '个角色'}
              </span>
            </div>
          </div>
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
            className="flex-shrink-0 ml-2 transition-transform duration-200"
            style={{
              color: 'var(--ink-light)',
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {/* Character List (accordion) */}
      {isExpanded && (
        <div className="mt-2 space-y-2 pl-2 animate-slide-in-up">
          {era.characters.map((char, charIdx) => (
            <CharacterCard
              key={char.id}
              character={char}
              eraId={era.eraId}
              lang={lang}
              index={charIdx}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Character Card Component ───

function CharacterCard({
  character,
  eraId,
  lang,
  index,
}: {
  character: Character
  eraId: string
  lang: 'zh' | 'en'
  index: number
}) {
  const isEn = lang === 'en'
  const diff = DIFFICULTY_CONFIG[character.difficulty]

  return (
    <Link
      href={`/immersive?eraId=${eraId}&charId=${character.id}&lang=${lang}`}
      className={`block rounded-lg p-3 card-xuan tap-bounce card-lift transition-all duration-150 animate-slide-in-up stagger-${Math.min(index + 1, 4)}`}
      style={{
        border: '1px solid var(--xuan-dark)',
      }}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-xl"
          style={{
            background: 'var(--xuan-dark)',
          }}
        >
          {character.avatar}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="font-serif text-sm font-semibold truncate"
              style={{ color: 'var(--ink-dark)' }}
            >
              {isEn && character.nameEn ? character.nameEn : character.name}
            </span>
            {/* Role Type Tag */}
            <span
              className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium flex-shrink-0"
              style={{
                background: 'rgba(46, 134, 193, 0.1)',
                color: 'var(--azurite)',
              }}
            >
              {isEn && character.roleTypeEn ? character.roleTypeEn : character.roleType}
            </span>
            {/* Difficulty Dot */}
            <span
              className="inline-block w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: diff.color }}
              title={isEn ? diff.labelEn : diff.label}
            />
          </div>
          <p
            className="text-xs leading-relaxed line-clamp-2"
            style={{ color: 'var(--ink-light)' }}
          >
            {isEn && character.descriptionEn
              ? character.descriptionEn
              : character.description}
          </p>
        </div>

        {/* Arrow */}
        <div className="flex-shrink-0 flex items-center self-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: 'var(--ink-light)' }}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
    </Link>
  )
}
