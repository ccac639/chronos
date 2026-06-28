'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  getStageOptions,
  getStageData,
  getRandomEra,
  getWorldStageData,
  getWorldCountryList,
  type Era,
} from '@/lib/data';
import BottomTabBar from '@/components/BottomTabBar';
import StageSelector from '@/components/StageSelector';
import { useLang } from '@/lib/lang-context';

// ─── Country flag emojis for university world history ───
const COUNTRY_FLAGS: Record<string, string> = {
  '美国': '🇺🇸', '德国': '🇩🇪', '俄罗斯': '🇷🇺', '英国': '🇬🇧', '法国': '🇫🇷',
  '日本': '🇯🇵', '意大利': '🇮🇹', '巴西': '🇧🇷', '埃及': '🇪🇬', '印度': '🇮🇳',
};

const COUNTRY_NAMES_EN: Record<string, string> = {
  '美国': 'USA', '德国': 'Germany', '俄罗斯': 'Russia', '英国': 'UK',
  '法国': 'France', '日本': 'Japan', '意大利': 'Italy', '巴西': 'Brazil',
  '埃及': 'Egypt', '印度': 'India',
};

// ─── World History Stage Options (with English names) ───
const WORLD_STAGE_OPTIONS = [
  { id: 'grade9', name: '九年级', nameEn: 'Grade 9' },
  { id: 'senior-world', name: '高中', nameEn: 'High School' },
  { id: 'uni-world', name: '大学', nameEn: 'University' },
];

// Chinese history stage English names
const CN_STAGE_NAMES_EN: Record<string, string> = {
  'primary': 'Primary',
  'junior': 'Junior High',
  'senior': 'High School',
  'university': 'University',
  'random': 'Random',
};

// ─── Stages that show language toggle (世界历史 only, 高中 and above) ───
const SENIOR_PLUS_WORLD_STAGES = new Set(['senior-world', 'uni-world']);

// ─── EraCard inline (to pass lang param) ───
function EraCard({ era, stageId, index = 0, lang }: {
  era: Era;
  stageId: string;
  index?: number;
  lang: 'zh' | 'en';
}) {
  const href = `/immersive?eraId=${era.id}&lang=${lang}`;
  return (
    <Link href={href} className="block animate-slide-in-up" style={{ animationDelay: `${index * 0.08}s` }}>
      <article
        className="relative rounded-lg overflow-hidden card-lift tap-bounce"
        style={{
          background: 'var(--xuan)',
          border: '1px solid var(--xuan-dark)',
          minHeight: '80px',
        }}
      >
        <div
          className="absolute left-0 top-0 bottom-0"
          style={{
            width: '4px',
            background: 'linear-gradient(to bottom, var(--azurite), var(--malachite))',
          }}
        />
        <div className="pl-4 pr-3 py-3">
          <h3
            className="font-serif text-base font-semibold leading-tight"
            style={{ color: 'var(--ink-dark)' }}
          >
            {lang === 'en' && era.nameEn ? era.nameEn : era.name}
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--ink-light)' }}>
            {lang === 'en' && era.periodEn ? era.periodEn : era.period}
          </p>
          <p
            className="text-sm mt-1.5 leading-relaxed line-clamp-2"
            style={{ color: 'var(--ink-medium)' }}
          >
            {lang === 'en' && era.descriptionEn ? era.descriptionEn : era.description}
          </p>
          {era.figures && era.figures.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {(lang === 'en' && era.figuresEn ? era.figuresEn : era.figures).map((figure, i) => (
                <span
                  key={`${figure}-${i}`}
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
  );
}

function EraPageContent() {
  const searchParams = useSearchParams();
  const stageParam = searchParams.get('stage');

  // Language from context
  const { lang: contextLang, toggleLang, t, setLang } = useLang();

  // Top-level: Chinese vs World history — detect from URL stage param
  const isWorldFromUrl = stageParam?.includes('world');
  const [historyType, setHistoryType] = useState<'chinese' | 'world'>(
    isWorldFromUrl ? 'world' : 'chinese'
  );

  // Chinese history always uses zh — force reset when returning from immersive
  const lang = historyType === 'chinese' ? 'zh' : contextLang;

  useEffect(() => {
    if (historyType === 'chinese' && contextLang !== 'zh') {
      setLang('zh');
    }
  }, [historyType, contextLang, setLang]);

  // Stage selector — for world history stages, the URL param IS the stage id (e.g. senior-world)
  const [activeStage, setActiveStage] = useState<string>(
    stageParam === 'random' ? 'random'
      : stageParam && isWorldFromUrl ? stageParam
      : 'junior'
  );

  // Remember last stage per history type
  const [cnLastStage, setCnLastStage] = useState<string>('primary');
  const [worldLastStage, setWorldLastStage] = useState<string>('grade9');

  // World history specific
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  // Eras to display
  const [eras, setEras] = useState<Era[]>([]);

  // Language toggle: ONLY for 世界历史 + 高中 and above
  const showLangToggle = historyType === 'world' && SENIOR_PLUS_WORLD_STAGES.has(activeStage);

  // Load eras based on historyType + activeStage + selectedCountry
  useEffect(() => {
    if (historyType === 'chinese') {
      if (activeStage === 'random') {
        const result = getRandomEra();
        setEras(result ? [result.era] : []);
      } else {
        const stageData = getStageData(activeStage);
        setEras(stageData?.eras ?? []);
      }
    } else {
      const stageData = getWorldStageData(activeStage, selectedCountry);
      setEras(stageData?.eras ?? []);
    }
  }, [historyType, activeStage, selectedCountry]);

  // Handle history type switch — restore last stage for that type, reset lang for Chinese
  const handleHistoryTypeChange = (type: 'chinese' | 'world') => {
    setHistoryType(type);
    setSelectedCountry(null);
    if (type === 'chinese') {
      setActiveStage(cnLastStage);
      setLang('zh');
    } else {
      setActiveStage(worldLastStage);
    }
  };

  // Handle stage change — remember it per history type
  const handleSelectStage = (stageId: string) => {
    setActiveStage(stageId);
    setSelectedCountry(null);
    if (historyType === 'chinese') {
      setCnLastStage(stageId);
    } else {
      setWorldLastStage(stageId);
    }
  };

  // Get current stage options with correct language names
  const stageOptions = historyType === 'chinese'
    ? getStageOptions().map((s) => ({
        id: s.id,
        name: lang === 'en' && CN_STAGE_NAMES_EN[s.id] ? CN_STAGE_NAMES_EN[s.id] : s.name,
      }))
    : WORLD_STAGE_OPTIONS.map((s) => ({
        id: s.id,
        name: lang === 'en' && s.nameEn ? s.nameEn : s.name,
      }));

  // Get country list for university world history
  const countryList = historyType === 'world' && activeStage === 'uni-world'
    ? getWorldCountryList()
    : [];

  return (
    <div className="min-h-screen bg-ink-wash" style={{ backgroundColor: 'var(--xuan)' }}>
      <div className="w-full px-5 pt-12 pb-28">
        {/* ===== 1. Header with back button + language toggle ===== */}
        <div className="mb-5 animate-fade-in-down">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center justify-center w-8 h-8 rounded-full tap-bounce"
                style={{ background: 'var(--xuan-dark)' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" style={{ color: 'var(--ink-700)' }}>
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </Link>
              <h1
                className="font-serif text-2xl font-bold tracking-wider text-azurite-gradient"
              >
                {t('title')}
              </h1>
            </div>

            {/* Language toggle - ONLY for 高中 and above */}
            {showLangToggle && (
              <button
                onClick={toggleLang}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm tap-bounce"
                style={{
                  background: 'var(--xuan-dark)',
                  border: '1.5px solid var(--xuan-dark)',
                  color: 'var(--ink-medium)',
                  transition: 'all 300ms ease',
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                {lang === 'zh' ? t('langEn') : t('langZh')}
              </button>
            )}
          </div>
        </div>

        {/* ===== 2. History Type Toggle: 中国历史 / 世界历史 ===== */}
        <div className="animate-slide-in-left mb-4">
          <div className="flex gap-2 p-1 rounded-xl" style={{ background: 'var(--xuan-dark)' }}>
            <button
              onClick={() => handleHistoryTypeChange('chinese')}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold tap-bounce"
              style={{
                background: historyType === 'chinese' ? 'var(--azurite)' : 'transparent',
                color: historyType === 'chinese' ? '#fff' : 'var(--ink-medium)',
                transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: historyType === 'chinese' ? 'scale(1.02)' : 'scale(1)',
                boxShadow: historyType === 'chinese' ? '0 2px 12px rgba(46, 134, 193, 0.3)' : 'none',
              }}
            >
              {t('chineseHistory')}
            </button>
            <button
              onClick={() => handleHistoryTypeChange('world')}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold tap-bounce"
              style={{
                background: historyType === 'world' ? 'var(--azurite)' : 'transparent',
                color: historyType === 'world' ? '#fff' : 'var(--ink-medium)',
                transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: historyType === 'world' ? 'scale(1.02)' : 'scale(1)',
                boxShadow: historyType === 'world' ? '0 2px 12px rgba(46, 134, 193, 0.3)' : 'none',
              }}
            >
              {t('worldHistory')}
            </button>
          </div>
        </div>

        {/* ===== 3. Stage Selector ===== */}
        <div className="animate-slide-in-left mb-2">
          <StageSelector
            stages={stageOptions}
            currentStage={activeStage}
            onSelect={handleSelectStage}
          />
        </div>

        {/* ===== 4. Country Filter (only for 大学 world history) ===== */}
        {historyType === 'world' && activeStage === 'uni-world' && countryList.length > 0 && (
          <div className="mb-4 animate-fade-in">
            <p
              className="text-xs mb-2 font-medium"
              style={{ color: 'var(--ink-light)' }}
            >
              {t('selectCountry')}
            </p>
            <div className="flex flex-wrap gap-2">
              {countryList.map((country) => (
                <button
                  key={country}
                  onClick={() => setSelectedCountry(selectedCountry === country ? null : country)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm tap-bounce"
                  style={{
                    background: selectedCountry === country ? 'var(--azurite)' : 'var(--xuan)',
                    color: selectedCountry === country ? '#fff' : 'var(--ink-medium)',
                    border: selectedCountry === country
                      ? '1.5px solid var(--azurite)'
                      : '1.5px solid var(--xuan-dark)',
                    transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transform: selectedCountry === country ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: selectedCountry === country ? '0 2px 8px rgba(46, 134, 193, 0.25)' : 'none',
                  }}
                >
                  <span className="text-base">{COUNTRY_FLAGS[country] ?? ''}</span>
                  {lang === 'en' && COUNTRY_NAMES_EN[country] ? COUNTRY_NAMES_EN[country] : country}
                </button>
              ))}
              <button
                onClick={() => setSelectedCountry(null)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm tap-bounce"
                style={{
                  background: selectedCountry === null ? 'var(--malachite)' : 'var(--xuan)',
                  color: selectedCountry === null ? '#fff' : 'var(--ink-medium)',
                  border: selectedCountry === null
                    ? '1.5px solid var(--malachite)'
                    : '1.5px solid var(--xuan-dark)',
                  transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transform: selectedCountry === null ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: selectedCountry === null ? '0 2px 8px rgba(39, 174, 96, 0.25)' : 'none',
                }}
              >
                {t('allCountries')}
              </button>
            </div>
          </div>
        )}

        {/* ===== 5. Era List (pass lang to immersive) ===== */}
        <div className="flex flex-col gap-3">
          {eras.map((era, index) => (
            <EraCard
              key={era.id}
              era={era}
              stageId={activeStage}
              index={index}
              lang={lang}
            />
          ))}
          {eras.length === 0 && (
            <div
              className="text-center py-12 animate-fade-in"
              style={{ color: 'var(--ink-light)' }}
            >
              <p className="text-4xl mb-3 opacity-50">📜</p>
              <p className="text-sm">{t('noContent')}</p>
            </div>
          )}
        </div>
      </div>

      {/* ===== 6. BottomTabBar ===== */}
      <BottomTabBar active="era" />
    </div>
  );
}

export default function EraPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ backgroundColor: 'var(--xuan)' }}
        >
          <div
            className="text-sm font-serif animate-breathe"
            style={{ color: 'var(--azurite)' }}
          >
            加载中...
          </div>
        </div>
      }
    >
      <EraPageContent />
    </Suspense>
  );
}
