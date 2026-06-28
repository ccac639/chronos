'use client';

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

// ─── i18n labels ───
const I18N: Record<string, Record<string, string>> = {
  zh: {
    title: '选择时代',
    back: '返回',
    chineseHistory: '中国历史',
    worldHistory: '世界历史',
    langZh: '中文',
    langEn: 'EN',
    noContent: '暂无该阶段的时代内容',
    currentFilter: '当前',
    selectExplore: '选择你想探索的篇章',
    randomRecommend: '为你随机推荐一个时代',
    allCountries: '更多',
    selectCountry: '选择国家',
    // Immersive page
    startNarrative: '开始叙事',
    nextAct: '下一幕',
    keyAct: '关键幕',
    finalScore: '最终评分',
    historicalNote: '历史注记',
    triggeredEvent: '触发事件',
    consequence: '结果',
    actTitle: '第 {n} 幕',
    loading: '加载中...',
  },
  en: {
    title: 'Select Era',
    back: 'Back',
    chineseHistory: 'Chinese History',
    worldHistory: 'World History',
    langZh: '中文',
    langEn: 'EN',
    noContent: 'No eras available for this stage',
    currentFilter: 'Current',
    selectExplore: 'Select a chapter to explore',
    randomRecommend: 'A random era for you',
    allCountries: 'More',
    selectCountry: 'Select Country',
    // Immersive page
    startNarrative: 'Begin',
    nextAct: 'Next Act',
    keyAct: 'Key Act',
    finalScore: 'Final Score',
    historicalNote: 'Historical Note',
    triggeredEvent: 'Triggered Event',
    consequence: 'Consequence',
    actTitle: 'Act {n}',
    loading: 'Loading...',
  },
};

interface LangContextType {
  lang: 'zh' | 'en';
  setLang: (lang: 'zh' | 'en') => void;
  toggleLang: () => void;
  t: (key: string) => string;
}

const LangContext = createContext<LangContextType>({
  lang: 'zh',
  setLang: () => {},
  toggleLang: () => {},
  t: (key: string) => I18N.zh[key] ?? key,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<'zh' | 'en'>('zh');

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'zh' ? 'en' : 'zh'));
  }, []);

  const t = useCallback(
    (key: string) => I18N[lang]?.[key] ?? I18N.zh[key] ?? key,
    [lang]
  );

  return (
    <LangContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

export { I18N };
