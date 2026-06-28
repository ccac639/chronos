'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  NarrativeData,
  NarrativeDialogue,
  PlayerChoice,
  JourneyNode,
  getNarrativeData,
  getRandomDialogues,
  calculateFinalScore,
  getActById,
  resolveNextActId,
  getBranchTargets,
  getMainPathLength,
  hasBranching,
  useLang,
} from '@/lib/data';
import { getCharactersForEra } from '@/data/characters';

/** Safe go-back: return to previous page if history exists, otherwise go to home */
function goBack() {
  if (typeof window !== 'undefined' && window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = '/';
  }
}

/* ═══════════════════════════════════════════════════════════════════════
   Typewriter Hook
   ═══════════════════════════════════════════════════════════════════════ */
function useTypewriter(text: string, speed: number = 30, triggerKey: number) {
  const [displayed, setDisplayed] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setIsComplete(false);
    if (!text) {
      setIsComplete(true);
      return;
    }

    let index = 0;
    const timer = setInterval(() => {
      index++;
      if (index >= text.length) {
        setDisplayed(text);
        setIsComplete(true);
        clearInterval(timer);
      } else {
        setDisplayed(text.slice(0, index));
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, triggerKey]);

  return { displayed, isComplete };
}

/* ═══════════════════════════════════════════════════════════════════════
   Loading / Error States
   ═══════════════════════════════════════════════════════════════════════ */
function LoadingScreen() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-3"
      style={{ backgroundColor: 'var(--ink-dark)' }}
    >
      <div
        className="w-8 h-8 rounded-full animate-spin"
        style={{
          border: '2px solid rgba(46, 134, 193, 0.3)',
          borderTopColor: 'var(--azurite)',
        }}
      />
      <p className="text-sm" style={{ color: 'var(--ink-light)' }}>
        正在载入叙事数据...
      </p>
    </div>
  );
}

function ErrorScreen({ message }: { message: string }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: 'var(--ink-dark)' }}
    >
      <p className="text-ink-300 font-sans text-center mb-4">{message}</p>
      <button
        onClick={() => goBack()}
        className="text-sm underline"
        style={{ color: 'var(--azurite-400, #85c1e9)' }}
      >
        返回朝代列表
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Score Screen (journey-based breakdown)
   ═══════════════════════════════════════════════════════════════════════ */
function ScoreScreen({
  eraName,
  choices,
  journey,
  narrative,
}: {
  eraName: string;
  choices: PlayerChoice[];
  journey: JourneyNode[];
  narrative: NarrativeData;
}) {
  const result = useMemo(() => calculateFinalScore(choices), [choices]);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  const gradeColors: Record<string, string> = {
    S: '#FFD700',
    A: 'var(--azurite)',
    B: 'var(--malachite)',
    C: 'var(--amber)',
    D: 'var(--vermillion)',
  };

  return (
    <div
      className="min-h-screen text-ink-50 flex flex-col"
      style={{ backgroundColor: 'var(--ink-dark)' }}
    >
      {/* Top bar */}
      <header
        className="sticky top-0 z-40 backdrop-blur-md"
        style={{
          background: 'rgba(22, 27, 34, 0.95)',
          borderBottom: '1px solid rgba(48, 54, 61, 0.5)',
        }}
      >
        <div className="flex items-center gap-3 px-4 h-12">
          <button
            onClick={() => goBack()}
            className="flex items-center justify-center w-8 h-8 rounded-full"
            style={{ background: 'var(--ink-medium)' }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
              style={{ color: 'var(--ink-300, #8b949e)' }}
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <h1
            className="text-sm font-medium truncate font-serif flex-1"
            style={{ color: 'var(--ink-faint)' }}
          >
            {eraName} - 叙事结束
          </h1>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-8 pb-24 w-full">
        {/* Grade circle */}
        <div
          style={{
            opacity: animated ? 1 : 0,
            transform: animated ? 'scale(1)' : 'scale(0.5)',
            transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
          className="flex flex-col items-center mb-8"
        >
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center mb-3"
            style={{
              background: `radial-gradient(circle, ${gradeColors[result.grade]}22, transparent)`,
              border: `3px solid ${gradeColors[result.grade]}`,
              boxShadow: `0 0 30px ${gradeColors[result.grade]}33`,
            }}
          >
            <span
              className="text-5xl font-bold font-serif"
              style={{ color: gradeColors[result.grade] }}
            >
              {result.grade}
            </span>
          </div>
          <h2
            className="text-2xl font-serif font-bold"
            style={{ color: 'var(--ink-faint)' }}
          >
            {result.rank}
          </h2>
        </div>

        {/* Score summary */}
        <div
          className="w-full rounded-xl p-5 mb-4"
          style={{
            opacity: animated ? 1 : 0,
            transform: animated ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.5s ease 0.2s',
            background: 'var(--ink-medium)',
            border: '1px solid rgba(48, 54, 61, 0.6)',
          }}
        >
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div>
              <div className="text-2xl font-bold" style={{ color: 'var(--azurite-light)' }}>
                {result.totalScore}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--ink-400, #7d8590)' }}>
                总得分
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: 'var(--malachite-light)' }}>
                {result.maxScore}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--ink-400, #7d8590)' }}>
                满分
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: 'var(--amber-light)' }}>
                {result.averageScore}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--ink-400, #7d8590)' }}>
                平均分
              </div>
            </div>
          </div>

          {/* Score bar */}
          <div
            className="w-full h-2 rounded-full overflow-hidden"
            style={{ background: 'rgba(48, 54, 61, 0.8)' }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min(100, (result.totalScore / result.maxScore) * 100)}%`,
                background: gradeColors[result.grade],
                transition: 'width 1s ease 0.5s',
              }}
            />
          </div>
        </div>

        {/* Per-act breakdown using journey nodes */}
        <div
          className="w-full space-y-2"
          style={{
            opacity: animated ? 1 : 0,
            transform: animated ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.5s ease 0.4s',
          }}
        >
          <h3
            className="text-sm font-medium mb-3"
            style={{ color: 'var(--ink-light)' }}
          >
            各幕抉择回顾
          </h3>
          {journey.map((node, idx) => {
            const act = getActById(narrative, node.actId);
            const choice = node.choice;
            const score = choice?.score ?? 0;
            const color = score >= 85 ? 'var(--malachite)' : score >= 70 ? 'var(--amber)' : 'var(--vermillion)';
            return (
              <div
                key={`${node.actId}-${idx}`}
                className="rounded-lg px-4 py-3"
                style={{
                  background: 'rgba(48, 54, 61, 0.4)',
                  borderLeft: `3px solid ${color}`,
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-serif flex items-center gap-1" style={{ color: 'var(--ink-light)' }}>
                    第 {idx + 1} 幕{act?.title ? ` · ${act.title}` : ''}
                    <span className="text-[9px] px-1 py-0 rounded" style={{ background: 'rgba(241,196,15,0.1)', color: 'var(--gamboge-deep)', fontSize: '8px' }}>AI</span>
                  </span>
                  <span className="text-sm font-bold" style={{ color }}>
                    +{score}
                  </span>
                </div>
                <p className="text-xs" style={{ color: 'var(--ink-400, #7d8590)' }}>
                  {choice?.triggeredEvent ?? ''}
                </p>
                {/* Alternate paths indicator */}
                {node.alternateActIds && node.alternateActIds.length > 0 && (
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: 'var(--ink-400, #7d8590)' }}
                    />
                    <span className="text-[10px]" style={{ color: 'var(--ink-400, #7d8590)' }}>
                      存在 {node.alternateActIds.length} 条分歧路径
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Bottom actions */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-lg"
        style={{
          background: 'rgba(48, 54, 61, 0.95)',
          borderTop: '1px solid rgba(46, 134, 193, 0.25)',
        }}
      >
        <div
          className="px-4 pt-4 pb-6 flex gap-3"
          style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
        >
          <button
            onClick={() => goBack()}
            className="flex-1 text-center py-3 rounded-lg text-sm font-medium"
            style={{
              background: 'var(--ink-medium)',
              color: 'var(--ink-light)',
              border: '1px solid rgba(48, 54, 61, 0.6)',
            }}
          >
            返回朝代
          </button>
          <button
            className="flex-1 py-3 rounded-lg text-sm font-medium"
            style={{
              background: 'var(--azurite)',
              color: '#fff',
            }}
          >
            分享成绩
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Timeline Drawer
   ═══════════════════════════════════════════════════════════════════════ */
function TimelineDrawer({
  journey,
  currentActId,
  narrative,
  onClose,
  onRewindTo,
}: {
  journey: JourneyNode[];
  currentActId: string;
  narrative: NarrativeData;
  onClose: () => void;
  onRewindTo: (index: number) => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const scoreColor = (score?: number) => {
    if (score === undefined) return 'var(--ink-400, #7d8590)';
    if (score >= 85) return 'var(--malachite)';
    if (score >= 70) return 'var(--amber)';
    return 'var(--vermillion)';
  };

  return (
    <div
      className="fixed inset-0 z-50"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
    >
      {/* Sidebar panel */}
      <div
        ref={overlayRef}
        className="absolute left-0 top-0 bottom-0 flex flex-col"
        style={{
          width: '280px',
          maxWidth: '80vw',
          background: 'rgba(22, 27, 34, 0.98)',
          borderRight: '1px solid rgba(48, 54, 61, 0.5)',
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.4)',
          animation: 'slideInLeft 0.3s ease-out',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 h-12 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(48, 54, 61, 0.5)' }}
        >
          <div className="flex items-center gap-2">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
              style={{ color: 'var(--azurite-light)' }}
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="text-sm font-serif font-medium" style={{ color: 'var(--ink-faint)' }}>
              时间线
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full tap-bounce"
            style={{ background: 'var(--ink-medium)' }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
              style={{ color: 'var(--ink-300, #8b949e)' }}
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Timeline content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {journey.length === 0 ? (
            <p className="text-xs text-center py-8" style={{ color: 'var(--ink-400, #7d8590)' }}>
              尚未开始旅程
            </p>
          ) : (
            <div className="relative">
              {/* Vertical line */}
              <div
                className="absolute left-[7px] top-2 bottom-2"
                style={{
                  width: '2px',
                  background: 'linear-gradient(to bottom, var(--azurite), rgba(46, 134, 193, 0.3))',
                }}
              />

              {journey.map((node, idx) => {
                const isCurrent = idx === journey.length - 1 && node.actId === currentActId;
                const isCompleted = idx < journey.length - 1;
                const dotColor = isCurrent
                  ? 'var(--azurite)'
                  : scoreColor(node.choice?.score);

                return (
                  <div
                    key={`${node.actId}-${idx}`}
                    className="relative flex items-start gap-3 mb-5 last:mb-0"
                  >
                    {/* Dot */}
                    <div className="relative flex-shrink-0 mt-0.5">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{
                          background: dotColor,
                          border: isCurrent ? '2px solid #fff' : 'none',
                          boxShadow: isCurrent
                            ? '0 0 8px var(--azurite), 0 0 16px rgba(46, 134, 193, 0.3)'
                            : `0 0 4px ${dotColor}33`,
                          animation: isCurrent ? 'pulse 2s ease-in-out infinite' : 'none',
                        }}
                      />
                      {/* Branch indicators */}
                      {node.alternateActIds && node.alternateActIds.length > 0 && (
                        <div className="absolute -top-1 -right-1 flex gap-0.5">
                          {node.alternateActIds.slice(0, 3).map((_, bi) => (
                            <div
                              key={bi}
                              className="w-2 h-2 rounded-full"
                              style={{
                                background: 'rgba(125, 133, 144, 0.6)',
                                border: '1px solid rgba(125, 133, 144, 0.4)',
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Node content */}
                    <div
                      className="flex-1 min-w-0"
                      onClick={() => isCompleted && onRewindTo(idx)}
                      style={{
                        cursor: isCompleted ? 'pointer' : 'default',
                        opacity: isCompleted ? 0.85 : 1,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className="text-[10px] font-serif flex items-center gap-1"
                          style={{ color: 'var(--ink-400, #7d8590)' }}
                        >
                          第 {idx + 1} 幕 <span className="text-[9px] px-1 py-0 rounded" style={{ background: 'rgba(241,196,15,0.1)', color: 'var(--gamboge-deep)', fontSize: '8px' }}>AI</span>
                        </span>
                        {node.timeMarker && (
                          <span
                            className="text-[10px]"
                            style={{ color: 'var(--azurite-light)', opacity: 0.7 }}
                          >
                            {node.timeMarker}
                          </span>
                        )}
                      </div>
                      <p
                        className="text-xs font-serif leading-tight truncate"
                        style={{ color: 'var(--ink-faint)' }}
                      >
                        {node.actTitle}
                      </p>
                      {node.choice && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <span
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                            style={{
                              background: `${dotColor}22`,
                              color: dotColor,
                            }}
                          >
                            +{node.choice.score}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Current position (ahead of journey) */}
              {currentActId && (!journey.length || journey[journey.length - 1]?.actId !== currentActId) && (
                <div className="relative flex items-start gap-3 mt-1">
                  <div className="flex-shrink-0 mt-0.5">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{
                        background: 'var(--azurite)',
                        border: '2px solid #fff',
                        boxShadow: '0 0 8px var(--azurite), 0 0 16px rgba(46, 134, 193, 0.3)',
                        animation: 'pulse 2s ease-in-out infinite',
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span
                      className="text-[10px]"
                      style={{ color: 'var(--azurite-light)' }}
                    >
                      当前位置
                    </span>
                    <p
                      className="text-xs font-serif truncate"
                      style={{ color: 'var(--ink-faint)' }}
                    >
                      {getActById(narrative, currentActId)?.title ?? ''}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer stats */}
        <div
          className="px-4 py-3 flex-shrink-0"
          style={{ borderTop: '1px solid rgba(48, 54, 61, 0.5)' }}
        >
          <div className="flex items-center justify-between text-[10px]">
            <span style={{ color: 'var(--ink-400, #7d8590)' }}>
              已完成 {journey.length}/{getMainPathLength(narrative)} 幕
            </span>
            {hasBranching(narrative) && (
              <span style={{ color: 'var(--azurite-light)', opacity: 0.7 }}>
                分支叙事
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close */}
      <div
        className="absolute inset-0"
        style={{ left: '280px' }}
        onClick={onClose}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Act View (single act gameplay — branching-aware)
   ═══════════════════════════════════════════════════════════════════════ */
function ActView({
  narrative,
  currentActId,
  journeyLength,
  onChoice,
  onNextAct,
  onOpenTimeline,
  canRewind,
  onRewind,
  characterName,
}: {
  narrative: NarrativeData;
  currentActId: string;
  journeyLength: number;
  onChoice: (choice: PlayerChoice, skippedDialogues: NarrativeDialogue[], alternateActIds: string[]) => void;
  onNextAct: (selectedDialogue: NarrativeDialogue) => void;
  onOpenTimeline: () => void;
  canRewind: boolean;
  onRewind: () => void;
  characterName?: string;
}) {
  const { t } = useLang();
  const act = getActById(narrative, currentActId);
  const scrollRef = useRef<HTMLDivElement>(null);

  const totalMainPathActs = useMemo(() => getMainPathLength(narrative), [narrative]);
  const actNumber = journeyLength + 1;

  // Typewriter for scene description — use actNumber as trigger so it resets on act change
  const { displayed: sceneText, isComplete: sceneComplete } = useTypewriter(
    act?.sceneDescription || '',
    30,
    actNumber
  );

  // Show NPC dialogues after scene completes
  const [npcVisible, setNpcVisible] = useState(false);
  useEffect(() => {
    if (sceneComplete && act) {
      const t = setTimeout(() => setNpcVisible(true), 400);
      return () => clearTimeout(t);
    }
  }, [sceneComplete, act]);

  // Individual NPC dialogue visibility (staggered fade-in)
  const [npcVisibility, setNpcVisibility] = useState<boolean[]>([]);
  useEffect(() => {
    if (npcVisible && act) {
      setNpcVisibility(new Array(act.npcDialogues.length).fill(false));
      act.npcDialogues.forEach((_, i) => {
        setTimeout(() => {
          setNpcVisibility((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }, i * 400);
      });
    }
  }, [npcVisible, act]);

  // Show player choices ONLY after typewriter done + ALL NPC dialogues fully visible
  const [choicesVisible, setChoicesVisible] = useState(false);
  useEffect(() => {
    if (sceneComplete && npcVisible && act
        && npcVisibility.length > 0 && npcVisibility.every((v) => v)) {
      const t = setTimeout(() => setChoicesVisible(true), 500);
      return () => clearTimeout(t);
    }
  }, [sceneComplete, npcVisible, act, npcVisibility]);

  // Randomly select 3 dialogues from all available
  // Include journeyLength to force re-randomize when rewinding to same act
  const selectedDialogues = useMemo(() => {
    if (!act) return [];
    return getRandomDialogues(act.dialogues, 3);
  }, [act, journeyLength]);

  // Compute skipped dialogues (the ones not shown to the user)
  const skippedDialogues = useMemo(() => {
    if (!act) return [];
    const selectedIds = new Set(selectedDialogues.map(d => d.id));
    return act.dialogues.filter(d => !selectedIds.has(d.id));
  }, [act, selectedDialogues]);

  // Compute branch targets for the current act
  const branchActIds = useMemo(() => {
    if (!act) return [];
    const currentIdx = narrative.acts.findIndex(a => a.id === currentActId);
    const nextSeqId = currentIdx >= 0 && currentIdx + 1 < narrative.acts.length
      ? narrative.acts[currentIdx + 1].id
      : null;
    return getBranchTargets(act, nextSeqId);
  }, [act, narrative, currentActId]);

  // Selected dialogue state — reset when act changes
  const [selectedDialogue, setSelectedDialogue] = useState<NarrativeDialogue | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);

  useEffect(() => {
    setSelectedDialogue(null);
    setShowFeedback(false);
    setHasRecorded(false);
    setNpcVisible(false);
    setChoicesVisible(false);
    setNpcVisibility([]);
  }, [currentActId]);

  const handleSelectDialogue = useCallback(
    (dialogue: NarrativeDialogue) => {
      if (selectedDialogue) return;
      setSelectedDialogue(dialogue);
      setShowFeedback(false);
      setHasRecorded(false);

      // Auto-scroll to bottom
      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      }, 100);

      // Show feedback panel after brief highlight
      setTimeout(() => {
        setShowFeedback(true);
        if (!hasRecorded && act) {
          const choice: PlayerChoice = {
            actId: act.id,
            actTitle: act.title,
            dialogueId: dialogue.id,
            score: dialogue.score,
            triggeredEvent: dialogue.triggeredEvent,
            timeMarker: act.timeMarker,
          };
          onChoice(choice, skippedDialogues, branchActIds);
          setHasRecorded(true);
        }
      }, 500);

      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      }, 600);
    },
    [selectedDialogue, hasRecorded, act, onChoice, skippedDialogues, branchActIds]
  );

  if (!act) return null;

  const npcColors = ['var(--azurite)', 'var(--malachite)'];

  return (
    <div
      className="h-screen flex flex-col text-ink-50"
      style={{ backgroundColor: 'var(--ink-dark)' }}
    >
      {/* Top bar */}
      <header
        className="sticky top-0 z-40 backdrop-blur-md flex-shrink-0"
        style={{
          background: 'rgba(22, 27, 34, 0.95)',
          borderBottom: '1px solid rgba(48, 54, 61, 0.5)',
        }}
      >
        {/* Progress bar */}
        <div
          className="w-full h-0.5"
          style={{ background: 'rgba(48, 54, 61, 0.5)' }}
        >
          <div
            className="h-full transition-all duration-700 ease-out"
            style={{
              width: `${Math.min(100, (journeyLength / totalMainPathActs) * 100)}%`,
              background: 'var(--azurite)',
            }}
          />
        </div>
        <div className="flex items-center gap-3 px-4 h-12">
          <button
            onClick={() => goBack()}
            className="flex items-center justify-center w-8 h-8 rounded-full tap-bounce"
            style={{ background: 'var(--ink-medium)' }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
              style={{ color: 'var(--ink-300, #8b949e)' }}
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <h1
            className="text-sm font-medium truncate font-serif flex-1"
            style={{ color: 'var(--ink-faint)' }}
          >
            {characterName ? `${characterName} · ${act.title}` : (narrative.playerRole ? `${narrative.playerRole} · ${act.title}` : narrative.eraName)}
            {act.timeMarker && (
              <span
                className="ml-2 text-xs font-sans"
                style={{ color: 'var(--azurite-light)', opacity: 0.8 }}
              >
                {act.timeMarker}
              </span>
            )}
            {act.isKeyAct && (
              <span
                className="ml-2 text-xs px-1.5 py-0.5 rounded"
                style={{
                  background: 'rgba(223, 115, 87, 0.15)',
                  color: 'var(--vermillion-light, #e87461)',
                  border: '1px solid rgba(223, 115, 87, 0.3)',
                }}
              >
                关键幕
              </span>
            )}
          </h1>

          {/* Rewind button */}
          {canRewind && (
            <button
              onClick={onRewind}
              className="flex items-center justify-center w-8 h-8 rounded-full tap-bounce flex-shrink-0"
              style={{ background: 'var(--ink-medium)' }}
              title="回溯"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
                style={{ color: 'var(--amber-400, #d4a843)' }}
              >
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
            </button>
          )}

          {/* Timeline button */}
          <button
            onClick={onOpenTimeline}
            className="flex items-center justify-center w-8 h-8 rounded-full tap-bounce flex-shrink-0"
            style={{ background: 'var(--ink-medium)' }}
            title="时间线"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
              style={{ color: 'var(--ink-300, #8b949e)' }}
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </button>

          <span className="text-xs flex-shrink-0 flex items-center gap-1" style={{ color: 'var(--ink-light)' }}>
            第 {actNumber}/{totalMainPathActs} 幕 <span className="text-[9px] px-1 py-0 rounded" style={{ background: 'rgba(241,196,15,0.1)', color: 'var(--gamboge-deep)', fontSize: '8px' }}>AI</span>
          </span>
        </div>
      </header>

      {/* Scrollable content */}
      <main
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 pt-5 pb-64 w-full"
      >
        {/* Act title */}
        <div className="mb-4">
          <h2
            className="text-lg font-serif font-bold leading-tight"
            style={{ color: 'var(--ink-faint)' }}
          >
            {act.title}
          </h2>
          <p className="text-[10px] mt-1 italic" style={{ color: 'var(--ink-400, #7d8590)', opacity: 0.7 }}>
            本幕内容由 AI 生成，仅供娱乐参考，不构成真实历史记录
          </p>
        </div>

        {/* Scene description - typewriter effect */}
        <div className="mb-6">
          <p
            className="font-serif leading-loose text-[15px] whitespace-pre-wrap"
            style={{ color: 'var(--ink-faint)' }}
          >
            {sceneText}
            {!sceneComplete && (
              <span
                className="inline-block w-0.5 h-4 ml-0.5 animate-pulse"
                style={{ background: 'var(--azurite)', verticalAlign: 'middle' }}
              />
            )}
          </p>
        </div>

        {/* NPC Dialogues - fade in one by one */}
        {act.npcDialogues.map((npc, idx) => (
          <div
            key={idx}
            style={{
              opacity: npcVisibility[idx] ? 1 : 0,
              transform: npcVisibility[idx] ? 'translateY(0)' : 'translateY(12px)',
              transition: 'all 0.4s ease',
              marginBottom: 16,
            }}
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{
                  background: `${npcColors[idx % npcColors.length]}22`,
                  border: `1.5px solid ${npcColors[idx % npcColors.length]}66`,
                  color: npcColors[idx % npcColors.length] === 'var(--azurite)'
                    ? 'var(--azurite-light)'
                    : 'var(--malachite-light)',
                }}
              >
                {npc.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <span
                  className="text-xs font-medium font-serif"
                  style={{
                    color: npcColors[idx % npcColors.length] === 'var(--azurite)'
                      ? 'var(--azurite-light)'
                      : 'var(--malachite-light)',
                  }}
                >
                  {npc.speaker}
                </span>
                <p
                  className="text-sm leading-relaxed font-serif mt-1"
                  style={{ color: 'var(--ink-faint)' }}
                >
                  {npc.text}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Player Dialogue Choices */}
        <div
          style={{
            opacity: choicesVisible ? 1 : 0,
            transform: choicesVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.5s ease',
          }}
        >
          <div className="flex items-center gap-2 mb-3 mt-6">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
              style={{ color: 'var(--vermillion-400, #e87461)' }}
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <h3
              className="text-base font-serif font-bold"
              style={{ color: 'var(--azurite-light)' }}
            >
              抉择时刻
            </h3>
          </div>

          <div className="space-y-2.5">
            {selectedDialogues.map((dialogue, idx) => {
              const isSelected = selectedDialogue?.id === dialogue.id;
              const isDisabled = selectedDialogue !== null;
              return (
                <button
                  key={dialogue.id}
                  disabled={isDisabled && !isSelected}
                  className="w-full text-left px-4 py-3 rounded-lg transition-all duration-300 tap-bounce"
                  style={{
                    background: isSelected
                      ? 'rgba(46, 134, 193, 0.15)'
                      : 'rgba(22, 27, 34, 0.6)',
                    border: isSelected
                      ? '2px solid var(--azurite)'
                      : '1px solid rgba(48, 54, 61, 0.6)',
                    boxShadow: isSelected
                      ? '0 0 16px rgba(46, 134, 193, 0.25), inset 0 0 8px rgba(46, 134, 193, 0.08)'
                      : 'none',
                    transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                    opacity: isDisabled && !isSelected ? 0.4 : 1,
                    cursor: isDisabled && !isSelected ? 'default' : 'pointer',
                  }}
                  onClick={() => handleSelectDialogue(dialogue)}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
                      style={{
                        background: isSelected
                          ? 'var(--azurite)'
                          : 'rgba(46, 134, 193, 0.2)',
                        color: isSelected ? '#fff' : 'var(--azurite-light)',
                      }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <p
                      className="text-sm font-medium leading-relaxed"
                      style={{
                        color: isSelected
                          ? 'var(--azurite-light)'
                          : 'var(--ink-100, #e6edf3)',
                      }}
                    >
                      {dialogue.text}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback panel - slides up after selection */}
        <div
          style={{
            opacity: showFeedback && selectedDialogue ? 1 : 0,
            transform: showFeedback && selectedDialogue ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.4s ease',
            marginTop: 20,
          }}
        >
          {selectedDialogue && (
            <div
              className="rounded-xl overflow-hidden"
              style={{
                background: 'var(--ink-medium)',
                border: '1px solid rgba(46, 134, 193, 0.3)',
              }}
            >
              {/* Triggered event header */}
              <div
                className="px-4 py-3"
                style={{
                  background: 'rgba(46, 134, 193, 0.08)',
                  borderBottom: '1px solid rgba(46, 134, 193, 0.15)',
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: 'var(--azurite)' }}
                  />
                  <span
                    className="text-xs font-medium"
                    style={{ color: 'var(--azurite-light)' }}
                  >
                    事件触发
                  </span>
                  <span
                    className="ml-auto text-sm font-bold"
                    style={{
                      color: selectedDialogue.score >= 85
                        ? 'var(--malachite)'
                        : selectedDialogue.score >= 70
                        ? 'var(--amber)'
                        : 'var(--vermillion)',
                    }}
                  >
                    +{selectedDialogue.score}
                  </span>
                </div>
                <p
                  className="text-sm font-serif leading-relaxed"
                  style={{ color: 'var(--ink-faint)' }}
                >
                  {selectedDialogue.triggeredEvent}
                </p>
              </div>
              {/* Consequence (branching hint) */}
              {selectedDialogue.nextActId && (
                <div
                  className="px-4 py-2.5"
                  style={{
                    background: 'rgba(212, 168, 67, 0.06)',
                    borderBottom: '1px solid rgba(212, 168, 67, 0.12)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-3.5 h-3.5"
                      style={{ color: 'var(--amber-400, #d4a843)' }}
                    >
                      <polyline points="16 3 21 3 21 8" />
                      <line x1="4" y1="20" x2="21" y2="3" />
                      <polyline points="21 16 21 21 16 21" />
                      <line x1="15" y1="15" x2="21" y2="21" />
                    </svg>
                    <span
                      className="text-xs font-serif"
                      style={{ color: 'var(--amber-400, #d4a843)' }}
                    >
                      路径分歧
                    </span>
                  </div>
                </div>
              )}
              {/* Historical note body */}
              <div className="px-4 py-3">
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3.5 h-3.5"
                    style={{ color: 'var(--amber-400, #d4a843)' }}
                  >
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span
                    className="text-xs font-medium"
                    style={{ color: 'var(--amber-400, #d4a843)' }}
                  >
                    历史注解
                  </span>
                </div>
                <p
                  className="text-xs leading-relaxed font-serif"
                  style={{ color: 'var(--ink-light)' }}
                >
                  {selectedDialogue.historicalNote}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Sticky bottom - Next button */}
      {showFeedback && selectedDialogue && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-lg"
          style={{
            background: 'rgba(48, 54, 61, 0.95)',
            borderTop: '1px solid rgba(46, 134, 193, 0.25)',
            opacity: showFeedback ? 1 : 0,
            transform: showFeedback ? 'translateY(0)' : 'translateY(100%)',
            transition: 'all 0.4s ease',
          }}
        >
          <div
            className="px-4 pt-4 pb-6"
            style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
          >
            <button
              className="w-full py-3.5 rounded-lg text-sm font-bold font-serif transition-all duration-200 tap-bounce"
              style={{
                background: 'var(--azurite)',
                color: '#fff',
                boxShadow: '0 4px 16px rgba(46, 134, 193, 0.3)',
              }}
              onClick={() => onNextAct(selectedDialogue)}
            >
              {resolveNextActId(narrative, currentActId, selectedDialogue)
                ? t('nextAct')
                : t('finalScore')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Main Immersive Content
   ═══════════════════════════════════════════════════════════════════════ */
function ImmersiveContent() {
  const searchParams = useSearchParams();
  const eraId = searchParams.get('eraId') || '';
  const charId = searchParams.get('charId') || '';
  const langParam = searchParams.get('lang') || 'zh';
  const { t } = useLang();

  // Look up character name from charId
  const characterName = useMemo(() => {
    if (!charId) return '';
    const chars = getCharactersForEra(eraId);
    const found = chars.find(c => c.id === charId || c.narrativeId === charId);
    return found ? (langParam === 'en' && found.nameEn ? found.nameEn : found.name) : '';
  }, [charId, eraId, langParam]);

  const [narrative, setNarrative] = useState<NarrativeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentActId, setCurrentActId] = useState<string>('');
  const [isComplete, setIsComplete] = useState(false);
  const [choices, setChoices] = useState<PlayerChoice[]>([]);
  const [journey, setJourney] = useState<JourneyNode[]>([]);
  const [showTimeline, setShowTimeline] = useState(false);

  // Load narrative → set currentActId to first act's id
  useEffect(() => {
    if (!eraId) {
      setError('缺少 eraId 参数');
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    // First try character-specific narrative, then fall back to era narrative
    const tryCharNarrative = async () => {
      if (charId) {
        const chars = getCharactersForEra(eraId);
        const char = chars.find(c => c.id === charId || c.narrativeId === charId);
        if (char?.narrativeId) {
          try {
            const res = await fetch(`/data/narratives/${char.narrativeId}.json`);
            if (res.ok) {
              const data = await res.json();
              return data;
            }
          } catch {}
        }
      }
      // Fall back to era-level narrative
      return getNarrativeData(eraId, langParam);
    };

    tryCharNarrative()
      .then((data) => {
        if (cancelled) return;
        if (!data) {
          setError(`未找到时代 "${eraId}" 的叙事数据`);
        } else {
          setNarrative(data);
          if (data.acts.length > 0) {
            setCurrentActId(data.acts[0].id);
          }
        }
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError('加载叙事数据失败');
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [eraId, langParam, charId]);

  // Handle choice — record journey node
  const handleChoice = useCallback(
    (choice: PlayerChoice, skippedDialogues: NarrativeDialogue[], alternateActIds: string[]) => {
      const act = getActById(narrative!, currentActId);
      if (!act) return;

      const node: JourneyNode = {
        actId: act.id,
        actTitle: act.title,
        timeMarker: act.timeMarker,
        choice,
        skippedDialogues,
        alternateActIds,
      };

      setChoices((prev) => [...prev, choice]);
      setJourney((prev) => [...prev, node]);
    },
    [narrative, currentActId]
  );

  // Handle next act — resolve branching
  const handleNextAct = useCallback(
    (selectedDialogue: NarrativeDialogue) => {
      const nextId = resolveNextActId(narrative!, currentActId, selectedDialogue);
      if (!nextId) {
        setIsComplete(true);
      } else {
        setCurrentActId(nextId);
      }
    },
    [narrative, currentActId]
  );

  // Handle rewind — go back to a specific journey node
  const handleRewind = useCallback(
    (targetIndex?: number) => {
      const idx = targetIndex !== undefined ? targetIndex : journey.length - 1;
      if (idx < 0) return;

      setJourney((prev) => prev.slice(0, idx));
      setChoices((prev) => prev.slice(0, idx));

      if (idx === 0) {
        setCurrentActId(narrative!.acts[0].id);
      } else {
        // Go to the act of the node BEFORE the target index so the player
        // can replay that act's choice
        const targetNode = journey[idx - 1];
        setCurrentActId(targetNode.actId);
      }
    },
    [journey, narrative]
  );

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;

  // Score screen after all acts complete
  if (isComplete && narrative) {
    return (
      <ScoreScreen
        eraName={narrative.eraName}
        choices={choices}
        journey={journey}
        narrative={narrative}
      />
    );
  }

  // Act gameplay
  if (narrative && currentActId) {
    return (
      <>
        <ActView
          narrative={narrative}
          currentActId={currentActId}
          journeyLength={journey.length}
          onChoice={handleChoice}
          onNextAct={handleNextAct}
          onOpenTimeline={() => setShowTimeline(true)}
          canRewind={journey.length > 0}
          onRewind={() => handleRewind()}
          characterName={characterName}
        />
        {showTimeline && (
          <TimelineDrawer
            journey={journey}
            currentActId={currentActId}
            narrative={narrative}
            onClose={() => setShowTimeline(false)}
            onRewindTo={handleRewind}
          />
        )}
      </>
    );
  }

  return <ErrorScreen message="未知错误" />;
}

/* ═══════════════════════════════════════════════════════════════════════
   Export with Suspense
   ═══════════════════════════════════════════════════════════════════════ */
export default function ImmersivePage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ backgroundColor: 'var(--ink-dark)' }}
        >
          <div
            className="w-8 h-8 rounded-full animate-spin"
            style={{
              border: '2px solid rgba(46, 134, 193, 0.3)',
              borderTopColor: 'var(--azurite)',
            }}
          />
        </div>
      }
    >
      <ImmersiveContent />
    </Suspense>
  );
}
