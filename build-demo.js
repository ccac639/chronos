#!/usr/bin/env node
/**
 * build-demo.js
 * 将原项目的所有数据打包到一个完整的 demo.html 文件中。
 *
 * 用法: node build-demo.js
 */

const fs = require('fs');
const path = require('path');

// ===== 路径配置 =====
const ROOT = __dirname;
const DEMO_HTML_SRC = path.join(ROOT, 'demo.html');
const DEMO_HTML_DST = path.join(ROOT, 'demo.html');
const CURRICULUM_JSON = path.join(ROOT, 'src', 'data', 'curriculum.json');
const SAMPLE_WORLDS_TS = path.join(ROOT, 'src', 'data', 'sample-worlds.ts');
const NARRATIVES_DIR = path.join(ROOT, 'public', 'data', 'narratives');

// ===== 叙事文件列表（只读主文件，不读角色变体） =====
const CHINESE_NARRATIVE_FILES = [
  // 小学
  { file: 'ancient-legends.json', stage: 'primary' },
  { file: 'three-kings.json', stage: 'primary' },
  { file: 'three-kings-primary.json', stage: 'primary' },
  { file: 'tang-stories.json', stage: 'primary' },
  { file: 'song-heroes.json', stage: 'primary' },
  { file: 'inventions.json', stage: 'primary' },
  { file: 'festivals.json', stage: 'primary' },
  // 初中
  { file: 'prehistory.json', stage: 'junior' },
  { file: 'shang-zhou.json', stage: 'junior' },
  { file: 'qin-han.json', stage: 'junior' },
  { file: 'sui-tang.json', stage: 'junior' },
  { file: 'song-yuan.json', stage: 'junior' },
  { file: 'ming-qing.json', stage: 'junior' },
  { file: 'modern-opium-war.json', stage: 'junior' },
  { file: 'modern-reform.json', stage: 'junior' },
  { file: 'modern-liberation.json', stage: 'junior' },
  { file: 'junior-prc.json', stage: 'junior' },
  // 高中
  { file: 'senior-ancient-world.json', stage: 'senior' },
  { file: 'senior-three-six-pilgrim.json', stage: 'senior', optional: true },
  { file: 'senior-qin-han.json', stage: 'senior' },
  { file: 'senior-sui-tang.json', stage: 'senior' },
  { file: 'senior-song-yuan.json', stage: 'senior' },
  { file: 'senior-ming-qing.json', stage: 'senior' },
  { file: 'senior-late-qing-peasant.json', stage: 'senior', optional: true },
  { file: 'senior-revolution.json', stage: 'senior' },
  { file: 'senior-modern-world.json', stage: 'senior' },
  { file: 'senior-prc.json', stage: 'senior' },
  // 大学
  { file: 'civilization-origin.json', stage: 'university', optional: true },
  { file: 'spring-autumn.json', stage: 'university', optional: true },
  { file: 'modern-struggle.json', stage: 'university', optional: true },
  { file: 'new-democratic.json', stage: 'university', optional: true },
  { file: 'three-kingdoms.json', stage: 'university', optional: true },
];

const WORLD_NARRATIVE_FILES = [
  { file: 'sw-ancient-civilizations.json' },
  { file: 'sw-ancient-greece-rome.json' },
  { file: 'sw-medieval-europe.json' },
  { file: 'sw-medieval-asia-africa.json' },
  { file: 'sw-exploration-reform.json' },
  { file: 'sw-enlightenment-revolution.json' },
  { file: 'sw-industrial-revolution.json' },
  { file: 'sw-world-wars.json' },
  { file: 'sw-cold-war.json' },
  { file: 'sw-contemporary.json' },
];

// ===== 工具函数 =====
let filesRead = 0;

function safeReadJSON(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    console.warn(`  [WARN] Failed to read JSON: ${filePath} - ${e.message}`);
    return null;
  }
}

function readNarrative(fileName, optional = false) {
  const filePath = path.join(NARRATIVES_DIR, fileName);
  const data = safeReadJSON(filePath);
  if (data) {
    filesRead++;
    return data;
  }
  if (!optional) {
    console.warn(`  [WARN] Missing narrative: ${fileName}`);
  }
  return null;
}

/**
 * Convert a TypeScript/JavaScript array literal to valid JSON.
 * Uses eval-based approach: extracts the array, evaluates it in a safe context,
 * then re-serializes as JSON. This handles all TS syntax (strings, comments, trailing commas, etc.)
 */
function tsValueToJSON(tsCode) {
  // Evaluate the TS array literal in a Function context to get the JS object
  try {
    // Create a function that returns the array
    const fn = new Function('return ' + tsCode + ';');
    const result = fn();
    return JSON.stringify(result, null, 2);
  } catch (e) {
    return null;
  }
}

/**
 * 从 TypeScript 文件中提取 sampleWorlds 数组数据
 */
function extractSampleWorlds(tsContent) {
  // Find the start of the array
  const match = tsContent.match(/export\s+const\s+sampleWorlds\s*:\s*ParallelWorld\[\]\s*=\s*\[/);
  if (!match) {
    console.warn('  [WARN] Could not find sampleWorlds export in sample-worlds.ts');
    return [];
  }

  // Start searching for '[' after the '=' sign to avoid matching type annotation brackets like 'ParallelWorld[]'
  const eqIdx = tsContent.indexOf('=', match.index);
  const startIdx = tsContent.indexOf('[', eqIdx + 1);
  // Use bracket counting to find the end of the array
  let depth = 0;
  let endIdx = startIdx;
  for (let i = startIdx; i < tsContent.length; i++) {
    if (tsContent[i] === '[') depth++;
    else if (tsContent[i] === ']') {
      depth--;
      if (depth === 0) { endIdx = i + 1; break; }
    }
    // Skip strings
    else if (tsContent[i] === "'" || tsContent[i] === '"') {
      const quote = tsContent[i];
      let j = i + 1;
      while (j < tsContent.length && tsContent[j] !== quote) {
        if (tsContent[j] === '\\') j++;
        j++;
      }
      i = j;
    }
  }

  const arrayStr = tsContent.slice(startIdx, endIdx);
  const jsonStr = tsValueToJSON(arrayStr);

  if (jsonStr === null) {
    console.warn('  [WARN] tsValueToJSON returned null');
    return [];
  }

  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.warn(`  [WARN] Failed to parse sampleWorlds: ${e.message}`);
    // Fallback: try regex replacement approach
    let fallback = arrayStr
      .replace(/,\s*]/g, ']').replace(/,\s*}/g, '}')
      .replace(/'/g, '\u0000')
      .replace(/"/g, '\\"')
      .replace(/\u0000/g, '"');
    try {
      return JSON.parse(fallback);
    } catch (e2) {
      console.warn(`  [WARN] Fallback also failed: ${e2.message}`);
      return [];
    }
  }
}

/**
 * 将课程数据转换为 demo.html 所需的格式
 */
function buildCurriculumData(curriculum) {
  const result = {
    chinese: {
      primary: [],
      junior: [],
      senior: [],
      university: [],
    },
    world: {
      grade9: [],
      senior: [],
      university: [],
    },
  };

  // Process Chinese history stages
  if (curriculum.stages) {
    for (const stage of curriculum.stages) {
      const stageKey = stage.id; // primary, junior, senior, university
      if (result.chinese[stageKey] && stage.eras) {
        for (const era of stage.eras) {
          result.chinese[stageKey].push({
            id: era.id,
            name: era.name,
            period: era.period,
            description: era.description,
            figures: era.figures || [],
          });
        }
      }
    }
  }

  // Process world history stages
  if (curriculum.worldHistory && curriculum.worldHistory.stages) {
    for (const stage of curriculum.worldHistory.stages) {
      const stageKey = stage.id; // grade9, senior-world, uni-world
      // Map to simplified keys
      let targetKey;
      if (stageKey === 'grade9') targetKey = 'grade9';
      else if (stageKey === 'senior-world') targetKey = 'senior';
      else if (stageKey === 'uni-world') targetKey = 'university';
      else targetKey = stageKey;

      if (result.world[targetKey] && stage.eras) {
        for (const era of stage.eras) {
          result.world[targetKey].push({
            id: era.id,
            name: era.name,
            period: era.period,
            description: era.description,
            figures: era.figures || [],
          });
        }
      }
    }
  }

  return result;
}

/**
 * 生成课程数据的 JavaScript 代码
 */
function generateCurriculumJS(data) {
  const lines = [];
  lines.push('// ===== DATA (auto-generated) =====');

  // Chinese stages data
  lines.push('const curriculumData = ' + JSON.stringify(data, null, 2) + ';');

  // Stage labels for Chinese history
  lines.push('const cnStages = [{id:\'primary\',name:\'小学\'},{id:\'junior\',name:\'初中\'},{id:\'senior\',name:\'高中\'},{id:\'university\',name:\'大学\'},{id:\'random\',name:\'随机\'}];');

  // Stage labels for world history
  lines.push('const worldStages = [{id:\'grade9\',name:\'九年级\'},{id:\'senior\',name:\'高中\'},{id:\'university\',name:\'大学\'},{id:\'random\',name:\'随机\'}];');

  return lines.join('\n');
}

/**
 * 生成叙事数据的 JavaScript 代码
 */
function generateNarrativeJS(narratives) {
  const lines = [];
  lines.push('');
  lines.push('// Narrative data (auto-generated)');
  lines.push('const narrativeData = ' + JSON.stringify(narratives, null, 2) + ';');
  return lines.join('\n');
}

/**
 * 生成平行世界数据的 JavaScript 代码
 */
function generateWorldsJS(worlds) {
  const lines = [];
  lines.push('');
  lines.push('// Sample worlds (auto-generated from sample-worlds.ts)');
  // Simplify world data for the demo (keep essential fields for cards)
  const simplified = worlds.map(w => ({
    id: w.id,
    name: w.name,
    tagline: w.tagline || '',
    era: w.era || '',
    chapters: (w.chapters || []).length,
    prologue: w.prologue || w.pointOfDivergence || '',
  }));
  lines.push('const sampleWorlds = ' + JSON.stringify(simplified, null, 2) + ';');
  return lines.join('\n');
}

/**
 * 修改 demo.html 中的 enterEra 函数，使其支持所有叙事
 */
function generateEnterEraPatch() {
  return `function enterEra(eraId) {
  // Strip stage prefix for narrative lookup
  let narrativeKey = eraId;
  // Map era IDs to their narrative file keys
  const narrativeKeyMap = {
    // Primary
    'primary-ancient-legends': 'ancient-legends',
    'primary-three-kings': 'three-kings-primary',
    'primary-tang-stories': 'tang-stories',
    'primary-song-heroes': 'song-heroes',
    'primary-inventions': 'inventions',
    'primary-festivals': 'festivals',
    // Junior
    'junior-prehistory': 'prehistory',
    'junior-xia-shang-zhou': 'shang-zhou',
    'junior-qin-han': 'qin-han',
    'junior-three-kingdoms-jin-nb': 'prehistory',
    'junior-sui-tang': 'sui-tang',
    'junior-song-yuan': 'song-yuan',
    'junior-ming-qing': 'ming-qing',
    'junior-modern-opium-war': 'modern-opium-war',
    'junior-modern-reform': 'modern-reform',
    'junior-modern-liberation': 'modern-liberation',
    'junior-prc': 'junior-prc',
    // Senior
    'senior-civilization-origin': 'civilization-origin',
    'senior-qin-han': 'senior-qin-han',
    'senior-three-six-dynasties-sui-tang': 'senior-sui-tang',
    'senior-song-yuan': 'senior-song-yuan',
    'senior-ming-qing-early': 'senior-ming-qing',
    'senior-late-qing': 'senior-revolution',
    'senior-revolution': 'senior-revolution',
    'senior-prc': 'senior-prc',
    'senior-ancient-world': 'senior-ancient-world',
    'senior-modern-world': 'senior-modern-world',
    // World
    'sw-ancient-civilizations': 'sw-ancient-civilizations',
    'sw-ancient-greece-rome': 'sw-ancient-greece-rome',
    'sw-medieval-europe': 'sw-medieval-europe',
    'sw-medieval-asia-africa': 'sw-medieval-asia-africa',
    'sw-exploration-reform': 'sw-exploration-reform',
    'sw-enlightenment-revolution': 'sw-enlightenment-revolution',
    'sw-industrial-revolution': 'sw-industrial-revolution',
    'sw-world-wars': 'sw-world-wars',
    'sw-cold-war': 'sw-cold-war',
    'sw-contemporary': 'sw-contemporary',
  };
  narrativeKey = narrativeKeyMap[eraId] || eraId;

  if (narrativeData[narrativeKey] && narrativeData[narrativeKey].acts && narrativeData[narrativeKey].acts.length > 0) {
    currentNarrative = narrativeData[narrativeKey];
    immersiveChoices = [];
    immersiveActIdx = 0;
    immersivePhase = 'playing';
    selectedDialogueIdx = -1;
    goPage('immersive');
  } else {
    showToast('该时代的叙事数据尚未收录');
  }
}`;
}

/**
 * 修改 renderImmersive 和相关函数以使用 currentNarrative
 */
function generateImmersivePatch() {
  return `
// Use currentNarrative for immersive page
let currentNarrative = null;

function startImmersive() {
  immersivePhase = 'playing';
  selectedDialogueIdx = -1;
  renderImmersive();
}

function renderImmersive() {
  const nd = currentNarrative || narrativeData;
  if (immersivePhase === 'score') { renderScore(); return; }
  const act = nd.acts[immersiveActIdx];
  if (!act) { exitImmersive(); return; }
  const total = nd.acts.length;
  const progress = (immersiveActIdx / total * 100);
  const npcColors = ['var(--azurite)', 'var(--malachite)'];
  const container = document.getElementById('immersive-content');
  container.innerHTML = \`
    <div style="min-height:100vh;display:flex;flex-direction:column;background:var(--ink-dark)">
      <div class="immersive-header">
        <div class="progress"><div class="progress-fill" style="width:\${progress}%"></div></div>
        <div class="bar-row">
          <button class="back-btn" onclick="exitImmersive()"><svg viewBox="0 0 24 24" fill="none" stroke="var(--ink-light)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg></button>
          <div class="title">\${nd.playerRole || '旅行者'} · \${act.title}\${act.isKeyAct ? ' <span style="margin-left:8px;font-size:.75rem;padding:2px 6px;border-radius:4px;background:rgba(223,115,87,.15);color:var(--vermillion-light);border:1px solid rgba(223,115,87,.3)">关键幕</span>' : ''}</div>
          <span class="act-count">第 \${immersiveActIdx+1}/\${total} 幕 <span style="margin-left:4px;font-size:8px;padding:0 4px;border-radius:2px;background:rgba(241,196,15,.1);color:var(--gamboge-deep)">AI</span></span>
        </div>
      </div>
      <div style="flex:1;overflow-y:auto;padding:20px 16px 160px">
        <div style="margin-bottom:16px">
          <h2 style="font-family:var(--font-serif);font-size:1.125rem;font-weight:700;color:var(--ink-faint);line-height:1.3">\${act.title}</h2>
          <p style="font-size:10px;margin-top:4px;font-style:italic;color:var(--ink-light);opacity:.7">本幕内容由 AI 生成，仅供娱乐参考，不构成真实历史记录</p>
        </div>
        <div style="margin-bottom:24px">
          <p id="scene-text" class="prologue-text" style="color:var(--ink-faint)"></p>
          <span id="cursor" style="display:inline-block;width:2px;height:16px;margin-left:2px;background:var(--azurite);vertical-align:middle;animation:cursorBlink 1s infinite"></span>
        </div>
        <div id="npc-list">
          \${(act.npcDialogues || []).map((npc, i) => \`
            <div class="npc-row" id="npc-\${i}" style="opacity:0;transform:translateY(12px);transition:all .4s ease">
              <div class="npc-avatar" style="background:\${npcColors[i%2]}22;border:1.5px solid \${npcColors[i%2]}66;color:\${npcColors[i%2]==='var(--azurite)'?'var(--azurite-light)':'var(--malachite-light)'}">\${npc.avatar || npc.speaker[0]}</div>
              <div style="flex:1;min-width:0">
                <span class="npc-name" style="color:\${npcColors[i%2]==='var(--azurite)'?'var(--azurite-light)':'var(--malachite-light)'}">\${npc.speaker}</span>
                <p class="npc-text">\${npc.text}</p>
              </div>
            </div>
          \`).join('')}
        </div>
        <div id="choices-area" style="opacity:0;transform:translateY(16px);transition:all .5s ease">
          <div style="display:flex;align-items:center;gap:8px;margin:24px 0 12px">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--vermillion-light)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            <h3 style="font-family:var(--font-serif);font-size:1rem;font-weight:700;color:var(--azurite-light)">抉择时刻</h3>
          </div>
          <div style="display:flex;flex-direction:column;gap:10px">
            \${(act.dialogues || []).map((d, i) => \`
              <button class="choice-card" id="choice-\${i}" onclick="selectChoice(\${i})">
                <span class="choice-letter">\${String.fromCharCode(65+i)}</span>
                <span class="choice-text">\${d.text}</span>
              </button>
            \`).join('')}
          </div>
        </div>
        <div id="feedback-area" style="opacity:0;transform:translateY(20px);transition:all .4s ease;margin-top:20px"></div>
      </div>
      <div id="imm-bottom" style="display:none"></div>
    </div>
  \`;
  // Start typewriter
  startTypewriter('scene-text', act.sceneDescription || '', 30, () => {
    document.getElementById('cursor').style.display = 'none';
    (act.npcDialogues || []).forEach((_, i) => {
      setTimeout(() => {
        const el = document.getElementById('npc-' + i);
        if (el) { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }
        if (i === (act.npcDialogues || []).length - 1) {
          setTimeout(() => {
            const ca = document.getElementById('choices-area');
            if (ca) { ca.style.opacity = '1'; ca.style.transform = 'translateY(0)'; }
          }, 400);
        }
      }, i * 400);
    });
  });
}

function selectChoice(idx) {
  if (selectedDialogueIdx >= 0) return;
  selectedDialogueIdx = idx;
  const nd = currentNarrative || narrativeData;
  const act = nd.acts[immersiveActIdx];
  const d = act.dialogues[idx];
  immersiveChoices.push({actId:act.id, score:d.score, triggeredEvent:d.triggeredEvent});
  act.dialogues.forEach((_, i) => {
    const el = document.getElementById('choice-' + i);
    if (i === idx) el.classList.add('selected');
    else el.classList.add('disabled');
  });
  setTimeout(() => {
    const scoreColor = d.score >= 85 ? 'var(--malachite)' : d.score >= 70 ? 'var(--gamboge)' : 'var(--vermillion)';
    document.getElementById('feedback-area').innerHTML = \`
      <div class="feedback-panel">
        <div class="feedback-header">
          <div class="feedback-label"><div style="width:8px;height:8px;border-radius:50%;background:var(--azurite)"></div><span style="color:var(--azurite-light)">事件触发</span><span style="margin-left:auto;font-size:.875rem;font-weight:700;color:\${scoreColor}">+\${d.score}</span></div>
          <p style="font-size:.875rem;font-family:var(--font-serif);line-height:1.625;color:var(--ink-faint)">\${d.triggeredEvent}</p>
        </div>
        <div class="feedback-note">
          <div class="feedback-label"><svg viewBox="0 0 24 24" fill="none" stroke="var(--gamboge)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg><span style="color:var(--gamboge)">历史注解</span></div>
          <p class="feedback-body">\${d.historicalNote}</p>
        </div>
      </div>
    \`;
    document.getElementById('feedback-area').style.opacity = '1';
    document.getElementById('feedback-area').style.transform = 'translateY(0)';
    const isLast = immersiveActIdx >= nd.acts.length - 1;
    document.getElementById('imm-bottom').style.display = 'block';
    document.getElementById('imm-bottom').innerHTML = \`<div class="sticky-bottom"><button onclick="\${isLast ? 'showImmersiveScore()' : 'nextAct()'}">\${isLast ? '查看最终评分' : '下一幕'}</button></div>\`;
    window.scrollTo({top:document.body.scrollHeight, behavior:'smooth'});
  }, 500);
}

function nextAct() {
  immersiveActIdx++;
  selectedDialogueIdx = -1;
  immersivePhase = 'playing';
  renderImmersive();
}

function showImmersiveScore() {
  immersivePhase = 'score';
  renderScore();
}

function renderScore() {
  const nd = currentNarrative || narrativeData;
  const scores = immersiveChoices.map(c => c.score);
  const total = scores.reduce((a, b) => a + b, 0);
  const max = scores.length * 100;
  const avg = scores.length > 0 ? Math.round(total / scores.length) : 0;
  let grade, rank;
  if (avg >= 95) { grade = 'S'; rank = '千古一帝'; }
  else if (avg >= 85) { grade = 'A'; rank = '明君圣主'; }
  else if (avg >= 75) { grade = 'B'; rank = '中兴之主'; }
  else if (avg >= 60) { grade = 'C'; rank = '守成之君'; }
  else { grade = 'D'; rank = '亡国之君'; }
  const gc = {S:'#FFD700',A:'var(--azurite)',B:'var(--malachite)',C:'var(--gamboge)',D:'var(--vermillion)'};
  const container = document.getElementById('immersive-content');
  container.innerHTML = \`
    <div style="min-height:100vh;display:flex;flex-direction:column;background:var(--ink-dark)">
      <div class="immersive-header"><div class="bar-row">
        <button class="back-btn" onclick="exitImmersive()"><svg viewBox="0 0 24 24" fill="none" stroke="var(--ink-light)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg></button>
        <div class="title">\${nd.eraName || '叙事'} - 叙事结束</div>
      </div></div>
      <main style="flex:1;display:flex;flex-direction:column;align-items:center;padding:32px 24px 160px">
        <div style="opacity:0;transform:scale(.5);transition:all .6s cubic-bezier(.34,1.56,.64,1)" id="grade-anim">
          <div class="grade-circle" style="background:radial-gradient(circle,\${gc[grade]}22,transparent);border:3px solid \${gc[grade]};box-shadow:0 0 30px \${gc[grade]}33">
            <span class="grade-letter" style="color:\${gc[grade]}">\${grade}</span>
          </div>
          <h2 style="font-family:var(--font-serif);font-size:1.5rem;font-weight:700;color:var(--ink-faint);text-align:center">\${rank}</h2>
        </div>
        <div class="score-summary" style="margin-top:32px;opacity:0;transform:translateY(20px);transition:all .5s ease .2s" id="score-anim">
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;text-align:center;margin-bottom:16px">
            <div><div style="font-size:1.5rem;font-weight:700;color:var(--azurite-light)">\${total}</div><div style="font-size:.75rem;margin-top:4px;color:var(--ink-light)">总得分</div></div>
            <div><div style="font-size:1.5rem;font-weight:700;color:var(--malachite-light)">\${max}</div><div style="font-size:.75rem;margin-top:4px;color:var(--ink-light)">满分</div></div>
            <div><div style="font-size:1.5rem;font-weight:700;color:var(--gamboge-light)">\${avg}</div><div style="font-size:.75rem;margin-top:4px;color:var(--ink-light)">平均分</div></div>
          </div>
          <div style="width:100%;height:8px;border-radius:9999px;overflow:hidden;background:rgba(48,54,61,.8)">
            <div style="height:100%;border-radius:9999px;width:\${Math.min(100,total/max*100)}%;background:\${gc[grade]};transition:width 1s ease .5s"></div>
          </div>
        </div>
        <div style="width:100%;margin-top:24px;opacity:0;transform:translateY(20px);transition:all .5s ease .4s" id="breakdown-anim">
          <h3 style="font-size:.875rem;font-weight:500;margin-bottom:12px;color:var(--ink-light)">各幕抉择回顾</h3>
          \${immersiveChoices.map((c, i) => {
            const act = nd.acts[i];
            const sc = c.score >= 85 ? 'var(--malachite)' : c.score >= 70 ? 'var(--gamboge)' : 'var(--vermillion)';
            return \`<div style="border-radius:.5rem;padding:12px 16px;margin-bottom:8px;background:rgba(48,54,61,.4);border-left:3px solid \${sc}">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
                <span style="font-size:.75rem;font-family:var(--font-serif);color:var(--ink-light)">第 \${i+1} 幕 · \${act ? act.title : ''} <span style="font-size:8px;margin-left:4px;padding:0 4px;border-radius:2px;background:rgba(241,196,15,.1);color:var(--gamboge-deep)">AI</span></span>
                <span style="font-size:.875rem;font-weight:700;color:\${sc}">+\${c.score}</span>
              </div>
              <p style="font-size:.75rem;color:var(--ink-light)">\${c.triggeredEvent}</p>
            </div>\`;
          }).join('')}
        </div>
      </main>
      <div class="sticky-bottom" style="display:flex;gap:12px">
        <button style="flex:1;background:var(--ink-medium);color:var(--ink-light);border:1px solid rgba(48,54,61,.6)" onclick="exitImmersive()">返回朝代</button>
        <button style="flex:1;background:var(--azurite);color:#fff;border:none" onclick="showToast('分享功能开发中')">分享成绩</button>
      </div>
    </div>
  \`;
  setTimeout(() => { const e = document.getElementById('grade-anim'); if (e) { e.style.opacity='1'; e.style.transform='scale(1)'; }}, 100);
  setTimeout(() => { const e = document.getElementById('score-anim'); if (e) { e.style.opacity='1'; e.style.transform='translateY(0)'; }}, 200);
  setTimeout(() => { const e = document.getElementById('breakdown-anim'); if (e) { e.style.opacity='1'; e.style.transform='translateY(0)'; }}, 400);
}

function exitImmersive() { goPage('era'); }`;
}

// ===== 修改 renderEraPage 以支持世界历史 =====
function generateEraPagePatch() {
  return `
function switchHistory(type) {
  historyType = type;
  document.getElementById('btn-cn').className = 'toggle-btn ' + (type==='cn'?'on':'off');
  document.getElementById('btn-world').className = 'toggle-btn ' + (type==='world'?'on':'off');
  activeStage = type === 'world' ? 'grade9' : 'primary';
  renderEraPage();
}

function renderEraPage() {
  const isWorld = historyType === 'world';
  const stages = isWorld ? worldStages : cnStages;
  const bar = document.getElementById('stage-bar');
  bar.innerHTML = stages.map(s => \`<button class="stage-chip \${activeStage===s.id?'on':''}" onclick="setStage('\${s.id}')">\${s.name}</button>\`).join('');

  let eras;
  if (isWorld) {
    eras = activeStage === 'random'
      ? [].concat(...Object.values(curriculumData.world)).filter(() => Math.random() > 0.9).slice(0, 1).map(() => {
          const all = [].concat(...Object.values(curriculumData.world));
          return all[Math.floor(Math.random()*all.length)];
        })
      : (curriculumData.world[activeStage] || []);
  } else {
    eras = activeStage === 'random'
      ? [].concat(...Object.values(curriculumData.chinese)).filter(() => Math.random() > 0.9).slice(0, 1).map(() => {
          const all = [].concat(...Object.values(curriculumData.chinese));
          return all[Math.floor(Math.random()*all.length)];
        })
      : (curriculumData.chinese[activeStage] || []);
  }

  const list = document.getElementById('era-list');
  if (eras.length === 0) {
    list.innerHTML = '<div style="text-align:center;padding:48px 0"><p style="font-size:1.25rem;opacity:.5">📜</p><p style="font-size:.875rem;color:var(--ink-light);margin-top:12px">暂无内容</p></div>';
    return;
  }
  list.innerHTML = eras.map((era, i) => \`
    <div class="era-card anim-slide-up" style="animation-delay:\${i*.08}s" onclick="enterEra('\${era.id}')">
      <div class="bar"></div>
      <div class="body">
        <h3>\${era.name}</h3>
        <p class="period">\${era.period}</p>
        <p class="desc">\${era.description}</p>
        <div class="tags">\${(era.figures||[]).map(f => \`<span class="tag">\${f}</span>\`).join('')}</div>
      </div>
    </div>
  \`).join('');
}

function setStage(id) { activeStage = id; renderEraPage(); }`;
}

// ===== 主流程 =====
function main() {
  console.log('=== Chronos Demo Builder ===\n');

  // 1. Read curriculum data
  console.log('[1/4] Reading curriculum data...');
  const curriculum = safeReadJSON(CURRICULUM_JSON);
  if (!curriculum) {
    console.error('ERROR: Failed to read curriculum.json');
    process.exit(1);
  }
  filesRead++;
  const curriculumData = buildCurriculumData(curriculum);
  const totalEras = Object.values(curriculumData.chinese).flat().length + Object.values(curriculumData.world).flat().length;
  console.log(`  Loaded ${totalEras} eras across ${(curriculum.stages||[]).length} Chinese stages + ${(curriculum.worldHistory?.stages||[]).length} world stages`);

  // 2. Read narrative data
  console.log('[2/4] Reading narrative data...');
  const narratives = {};
  for (const entry of CHINESE_NARRATIVE_FILES) {
    const data = readNarrative(entry.file, entry.optional);
    if (data) {
      // Use the filename (without .json) as the key
      const key = entry.file.replace('.json', '');
      narratives[key] = data;
    }
  }
  for (const entry of WORLD_NARRATIVE_FILES) {
    const data = readNarrative(entry.file, entry.optional);
    if (data) {
      const key = entry.file.replace('.json', '');
      narratives[key] = data;
    }
  }
  console.log(`  Loaded ${Object.keys(narratives).length} narratives`);

  // 3. Read sample worlds
  console.log('[3/4] Reading sample worlds...');
  let sampleWorlds = [];
  if (fs.existsSync(SAMPLE_WORLDS_TS)) {
    const tsContent = fs.readFileSync(SAMPLE_WORLDS_TS, 'utf-8');
    sampleWorlds = extractSampleWorlds(tsContent);
    filesRead++;
    console.log(`  Loaded ${sampleWorlds.length} worlds`);
  } else {
    console.warn('  [WARN] sample-worlds.ts not found');
  }

  // 4. Build demo.html
  console.log('[4/4] Building demo.html...');
  let html = fs.readFileSync(DEMO_HTML_SRC, 'utf-8');

  // Find the <script> tag and replace everything between <script> and </script>
  const scriptStart = html.indexOf('<script>');
  const scriptEnd = html.indexOf('</script>', scriptStart);
  if (scriptStart === -1 || scriptEnd === -1) {
    console.error('ERROR: Could not find <script> block in demo.html');
    process.exit(1);
  }

  // Generate all JS code
  const dataJS = generateCurriculumJS(curriculumData);
  const narrativeJS = generateNarrativeJS(narratives);
  const worldsJS = generateWorldsJS(sampleWorlds);

  // Build the new script block - keep the HTML structure, replace only JS
  const beforeScript = html.slice(0, scriptStart + '<script>'.length);
  const afterScript = html.slice(scriptEnd);

  const newScriptContent = `
${dataJS}
${narrativeJS}
${worldsJS}

// ===== STATE =====
let currentPage = 'home';
let historyType = 'cn';
let activeStage = 'primary';
let geoSelection = '大陆';
let civSelection = ['农耕'];
let immersiveActIdx = 0;
let immersiveChoices = [];
let immersiveTyping = null;
let immersivePhase = 'playing';
let selectedDialogueIdx = -1;
let adventurePhase = 'prologue';
let adventureChar = null;
let adventureActIdx = 0;
let adventureChoices = [];
let adventureTyping = null;
let adventureSelectedChoice = -1;

// ===== PAGE NAVIGATION =====
function goPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  currentPage = id;
  const bar = document.getElementById('bottom-bar');
  bar.style.display = (id === 'immersive' || id === 'adventure') ? 'none' : '';
  document.querySelectorAll('.bottom-bar .tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === id);
  });
  if (id === 'era') renderEraPage();
  if (id === 'world') renderWorldPage();
  if (id === 'immersive') startImmersive();
  if (id === 'adventure') startAdventure();
  window.scrollTo(0, 0);
}

// ===== TOAST =====
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}

${generateEraPagePatch()}

${generateEnterEraPatch()}

${generateImmersivePatch()}

// ===== WORLD PAGE =====
function renderWorldPage() {
  const geos = ['大陆','岛屿','半岛','星球','浮空'];
  document.getElementById('geo-bar').innerHTML = geos.map(g => \`<button class="geo-btn \${geoSelection===g?'on':'off'}" onclick="selectGeo('\${g}')">\${g}</button>\`).join('');
  const civs = ['农耕','游牧','商业','航海','仙侠玄幻','蒸汽朋克','洪荒神话'];
  document.getElementById('civ-bar').innerHTML = civs.map(c => {
    const isFantasy = ['仙侠玄幻','蒸汽朋克','洪荒神话'].includes(c);
    const isOn = civSelection.includes(c);
    return \`<button class="civ-btn \${isOn?'on':''} \${isOn && isFantasy?'fantasy':''}" onclick="toggleCiv('\${c}')">\${isFantasy?'* ':''}\${c}</button>\`;
  }).join('');
  document.getElementById('world-gallery').innerHTML = sampleWorlds.map((w, i) => \`
    <div class="world-card anim-slide-up" style="animation-delay:\${i*.1}s" onclick="viewWorld('\${w.id}')">
      <div style="height:96px;position:relative;background:linear-gradient(\${135+i*30}deg,var(--azurite-deep),var(--ink-dark),var(--indigo-ancient))">
        <div style="position:absolute;inset:0;opacity:.3;background-image:radial-gradient(ellipse at \${40+i*20}% \${30+i*15}%,rgba(46,134,193,.5),transparent 60%)"></div>
        <div style="position:absolute;bottom:8px;left:12px;display:flex;align-items:center;gap:6px">
          <span class="seal-stamp" style="font-size:9px;padding:0 6px">平行</span>
          <span style="font-size:9px;padding:2px 6px;border-radius:9999px;background:rgba(255,255,255,.15);color:rgba(255,255,255,.8)">\${w.era}</span>
        </div>
        <button style="position:absolute;top:8px;right:8px;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:none;cursor:pointer;background:rgba(0,0,0,.5);backdrop-filter:blur(4px)" onclick="event.stopPropagation();playWorld('\${w.id}')">
          <svg viewBox="0 0 24 24" fill="#fff" stroke="none" style="width:14px;height:14px"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </button>
      </div>
      <div style="padding:12px">
        <h4 style="font-family:var(--font-serif);font-size:.875rem;font-weight:700;color:var(--ink-dark);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">\${w.name}</h4>
        <p style="font-size:.75rem;margin-top:2px;color:var(--ink-medium);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">\${w.tagline}</p>
        <div style="display:flex;align-items:center;gap:4px;margin-top:8px">
          <span style="font-size:9px;padding:2px 6px;border-radius:9999px;background:var(--azurite-pale);color:var(--azurite-deep)">\${w.chapters} 章</span>
          <span style="font-size:9px;padding:2px 6px;border-radius:9999px;background:var(--gamboge-pale);color:var(--gamboge-deep)">进入冒险</span>
        </div>
      </div>
    </div>
  \`).join('');
  updateYearSlider();
}

function selectGeo(g) { geoSelection = g; renderWorldPage(); }
function toggleCiv(c) {
  const isFantasy = ['仙侠玄幻','蒸汽朋克','洪荒神话'].includes(c);
  if (civSelection.includes(c)) civSelection = civSelection.filter(x => x !== c);
  else { if (isFantasy) civSelection = civSelection.filter(x => !['仙侠玄幻','蒸汽朋克','洪荒神话'].includes(x)); civSelection.push(c); }
  renderWorldPage();
}
function updateYearSlider() {
  const v = parseInt(document.getElementById('year-slider').value);
  const pct = v / 60 * 100;
  document.getElementById('year-slider').style.background = \`linear-gradient(to right,var(--azurite) \${pct}%,var(--xuan-dark) \${pct}%)\`;
  let label;
  if (v === 0) label = '原始纪元';
  else { const bc = 3000 - v * 100; label = bc > 0 ? \`公元前\${bc}年\` : \`公元\${-bc === 0 ? '元年' : -bc + '年'}\`; }
  document.getElementById('year-label').textContent = label;
}
function updateYear(el) { updateYearSlider(); }
function viewWorld(id) { showToast('平行世界冒险功能开发中，敬请期待'); }
function playWorld(id) { viewWorld(id); }

// ===== ADVENTURE PAGE =====
const adventureWorld = sampleWorlds.length > 0 ? sampleWorlds[0] : {id:'demo',name:'演示世界',tagline:'演示用平行世界',era:'未知',chapters:0,prologue:'这是一个演示用的平行世界。'};
const adventureCharacters = [
  {id:'traveler',name:'旅行者',faction:'中立',color:'#2e86c1',desc:'来自另一个时空的旅行者',backstory:'你是一个偶然穿越时空裂缝的旅行者，来到了这个被历史改变的平行世界。在这里，一切似乎既熟悉又陌生。'}
];
const adventureChapters = adventureWorld.prologue ? [
  {id:'ch1',title:'序幕',scene:adventureWorld.prologue,npcDialogues:[],choices:[
    {text:'探索这个世界的不同',score:90,event:'你决定深入探索这个改变了的历史',note:'在平行世界中，每一个选择都可能带来意想不到的结果。'},
    {text:'寻找回到原来世界的方法',score:85,event:'你开始寻找时空裂缝的踪迹',note:'探索未知需要勇气，但寻找归途同样重要。'}
  ]}
] : [];

function startAdventure() { renderAdventure(); }

function renderAdventure() {
  const container = document.getElementById('adventure-content');
  if (adventurePhase === 'prologue') {
    container.innerHTML = \`
      <div style="min-height:100vh;display:flex;flex-direction:column;background:var(--ink-dark);padding:48px 24px 40px;justify-content:center;align-items:center;text-align:center">
        <div class="anim-fade-down">
          <span class="seal-stamp anim-seal" style="margin-bottom:24px;display:inline-block">平行世界</span>
          <h1 class="text-gradient" style="font-family:var(--font-serif);font-size:1.5rem;font-weight:700;line-height:1.3;margin-bottom:8px">\${adventureWorld.name}</h1>
          <p style="font-size:.875rem;font-family:var(--font-serif);font-style:italic;color:var(--ink-light);margin-bottom:32px;line-height:1.7">\${adventureWorld.tagline}</p>
        </div>
        <div class="act-intro anim-slide-up d2" style="text-align:left;max-width:360px">
          <div class="label">序章</div>
          <p id="prologue-text" class="prologue-text" style="color:var(--ink-faint)"></p>
        </div>
        <div id="prologue-cursor" style="width:2px;height:16px;background:var(--azurite);animation:cursorBlink 1s infinite;margin-top:4px"></div>
        <div id="prologue-btn" style="margin-top:40px;opacity:0;transform:translateY(16px);transition:all .5s ease">
          <button class="btn-primary" style="max-width:280px" onclick="adventurePhase='charSelect';renderAdventure()">选择角色，踏入历史</button>
        </div>
        <div style="margin-top:24px;opacity:.5"><p style="font-size:10px;font-family:var(--font-serif);color:var(--ink-light)">本世界所有数据均由 AI 生成</p></div>
      </div>
    \`;
    const prologueText = adventureWorld.prologue || adventureWorld.pointOfDivergence || '欢迎来到平行世界。';
    startTypewriter('prologue-text', prologueText, 35, () => {
      document.getElementById('prologue-cursor').style.display = 'none';
      const btn = document.getElementById('prologue-btn');
      if (btn) { btn.style.opacity = '1'; btn.style.transform = 'translateY(0)'; }
    });
  } else if (adventurePhase === 'charSelect') {
    container.innerHTML = \`
      <div style="min-height:100vh;display:flex;flex-direction:column;background:var(--ink-dark);padding:48px 20px 40px">
        <div class="anim-fade-down" style="text-align:center;margin-bottom:24px">
          <h2 style="font-family:var(--font-serif);font-size:1.25rem;font-weight:700;color:var(--ink-faint)">选择你的角色</h2>
          <p style="font-size:.75rem;color:var(--ink-light);margin-top:4px">不同角色将带来不同的故事体验</p>
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;flex:1;align-content:start">
          \${adventureCharacters.map((c, i) => \`
            <div class="char-card anim-slide-up \${adventureChar===c.id?'selected':''}" style="animation-delay:\${i*.08}s;\${adventureChar===c.id?'border-color:'+c.color:''}" onclick="selectAdventureChar('\${c.id}')">
              <div class="char-avatar" style="background:\${c.color}22;border:2px solid \${c.color}66;color:\${c.color}">\${c.name[0]}</div>
              <h4 style="font-family:var(--font-serif);font-size:.875rem;font-weight:700;color:var(--ink-dark)">\${c.name}</h4>
              <p style="font-size:.75rem;margin-top:2px;color:\${c.color}">\${c.faction}</p>
              <p style="font-size:.625rem;margin-top:4px;color:var(--ink-light);line-height:1.4">\${c.desc}</p>
            </div>
          \`).join('')}
        </div>
        <div id="char-desc" style="margin-top:24px;opacity:0;transform:translateY(16px);transition:all .4s ease">
          <div class="act-intro">
            <p id="char-desc-text" style="font-size:.875rem;font-family:var(--font-serif);color:var(--ink-faint);line-height:1.8"></p>
          </div>
        </div>
        <div id="char-confirm-btn" style="margin-top:20px;opacity:0;transform:translateY(16px);transition:all .5s ease;text-align:center">
          <button class="btn-primary" style="max-width:280px" onclick="adventurePhase='playing';adventureActIdx=0;adventureSelectedChoice=-1;renderAdventure()">开始冒险</button>
        </div>
      </div>
    \`;
    if (adventureChar) showCharDesc();
  } else if (adventurePhase === 'playing' || adventurePhase === 'feedback') {
    renderAdventureAct();
  } else if (adventurePhase === 'score') {
    renderAdventureScore();
  }
}

function selectAdventureChar(id) {
  adventureChar = id;
  document.querySelectorAll('.char-card').forEach((el, i) => {
    const c = adventureCharacters[i];
    if (c.id === id) { el.classList.add('selected'); el.style.borderColor = c.color; }
    else { el.classList.remove('selected'); el.style.borderColor = 'var(--xuan-dark)'; }
  });
  showCharDesc();
}

function showCharDesc() {
  const ch = adventureCharacters.find(c => c.id === adventureChar);
  if (!ch) return;
  const descEl = document.getElementById('char-desc');
  const btnEl = document.getElementById('char-confirm-btn');
  if (descEl) { descEl.style.opacity = '1'; descEl.style.transform = 'translateY(0)'; document.getElementById('char-desc-text').textContent = ch.backstory; }
  if (btnEl) { btnEl.style.opacity = '1'; btnEl.style.transform = 'translateY(0)'; }
}

function renderAdventureAct() {
  const ch = adventureCharacters.find(c => c.id === adventureChar);
  const chapter = adventureChapters[adventureActIdx];
  if (!chapter) { adventurePhase = 'score'; renderAdventureScore(); return; }
  const total = adventureChapters.length;
  const progress = (adventureActIdx / total * 100);
  const charName = ch ? ch.name : '旅行者';
  const container = document.getElementById('adventure-content');
  container.innerHTML = \`
    <div style="min-height:100vh;display:flex;flex-direction:column;background:var(--ink-dark)">
      <div class="immersive-header">
        <div class="progress"><div class="progress-fill" style="width:\${progress}%"></div></div>
        <div class="bar-row">
          <button class="back-btn" onclick="goPage('world')"><svg viewBox="0 0 24 24" fill="none" stroke="var(--ink-light)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg></button>
          <div class="title">\${charName} · \${chapter.title}</div>
          <span class="act-count">第 \${adventureActIdx+1}/\${total} 章</span>
        </div>
      </div>
      <div style="flex:1;overflow-y:auto;padding:20px 16px 160px">
        <div class="act-intro"><div class="label">第\${adventureActIdx+1}章</div><p class="prologue-text" id="adv-scene">\${chapter.scene}</p></div>
        <div id="adv-choices">
          \${(chapter.choices||[]).map((c, i) => \`
            <button class="choice-card" style="margin-bottom:10px" id="adv-ch-\${i}" onclick="selectAdventureChoice(\${i})">
              <span class="choice-letter">\${String.fromCharCode(65+i)}</span>
              <span class="choice-text">\${c.text}</span>
            </button>
          \`).join('')}
        </div>
        <div id="adv-feedback" style="margin-top:16px"></div>
      </div>
      <div id="adv-bottom" style="display:none"></div>
    </div>
  \`;
}

function selectAdventureChoice(idx) {
  if (adventureSelectedChoice >= 0) return;
  adventureSelectedChoice = idx;
  const chapter = adventureChapters[adventureActIdx];
  const choice = chapter.choices[idx];
  adventureChoices.push({chapterId:chapter.id, score:choice.score, event:choice.event});
  chapter.choices.forEach((_, i) => {
    const el = document.getElementById('adv-ch-' + i);
    if (el) { if (i === idx) el.classList.add('selected'); else el.classList.add('disabled'); }
  });
  setTimeout(() => {
    const sc = choice.score >= 85 ? 'var(--malachite)' : choice.score >= 70 ? 'var(--gamboge)' : 'var(--vermillion)';
    document.getElementById('adv-feedback').innerHTML = \`
      <div class="feedback-panel">
        <div class="feedback-header">
          <div class="feedback-label"><div style="width:8px;height:8px;border-radius:50%;background:var(--azurite)"></div><span style="color:var(--azurite-light)">事件</span><span style="margin-left:auto;font-size:.875rem;font-weight:700;color:\${sc}">+\${choice.score}</span></div>
          <p style="font-size:.875rem;font-family:var(--font-serif);line-height:1.625;color:var(--ink-faint)">\${choice.event}</p>
        </div>
        <div class="feedback-note">
          <div class="feedback-label"><svg viewBox="0 0 24 24" fill="none" stroke="var(--gamboge)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg><span style="color:var(--gamboge)">注解</span></div>
          <p class="feedback-body">\${choice.note || ''}</p>
        </div>
      </div>
    \`;
    const isLast = adventureActIdx >= adventureChapters.length - 1;
    document.getElementById('adv-bottom').style.display = 'block';
    document.getElementById('adv-bottom').innerHTML = \`<div class="sticky-bottom"><button onclick="\${isLast ? 'adventurePhase=\\'score\\';renderAdventure()' : 'adventureNextChapter()'}">\${isLast ? '查看结局' : '下一章'}</button></div>\`;
    window.scrollTo({top:document.body.scrollHeight, behavior:'smooth'});
  }, 500);
}

function adventureNextChapter() {
  adventureActIdx++;
  adventureSelectedChoice = -1;
  renderAdventureAct();
}

function renderAdventureScore() {
  const scores = adventureChoices.map(c => c.score);
  const total = scores.reduce((a, b) => a + b, 0);
  const max = scores.length * 100;
  const avg = scores.length > 0 ? Math.round(total / scores.length) : 0;
  let grade, rank;
  if (avg >= 95) { grade = 'S'; rank = '时空大师'; }
  else if (avg >= 85) { grade = 'A'; rank = '平行旅者'; }
  else if (avg >= 75) { grade = 'B'; rank = '历史见证者'; }
  else if (avg >= 60) { grade = 'C'; rank = '时空过客'; }
  else { grade = 'D'; rank = '迷失者'; }
  const gc = {S:'#FFD700',A:'var(--azurite)',B:'var(--malachite)',C:'var(--gamboge)',D:'var(--vermillion)'};
  const container = document.getElementById('adventure-content');
  container.innerHTML = \`
    <div style="min-height:100vh;display:flex;flex-direction:column;background:var(--ink-dark);padding:48px 24px 40px;align-items:center">
      <div class="anim-fade-down" style="text-align:center">
        <div class="grade-circle" style="background:radial-gradient(circle,\${gc[grade]}22,transparent);border:3px solid \${gc[grade]};box-shadow:0 0 30px \${gc[grade]}33;margin:0 auto 16px">
          <span class="grade-letter" style="color:\${gc[grade]}">\${grade}</span>
        </div>
        <h2 style="font-family:var(--font-serif);font-size:1.5rem;font-weight:700;color:var(--ink-faint)">\${rank}</h2>
        <div class="score-summary" style="margin-top:24px">
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;text-align:center">
            <div><div style="font-size:1.5rem;font-weight:700;color:var(--azurite-light)">\${total}</div><div style="font-size:.75rem;margin-top:4px;color:var(--ink-light)">总得分</div></div>
            <div><div style="font-size:1.5rem;font-weight:700;color:var(--malachite-light)">\${max}</div><div style="font-size:.75rem;margin-top:4px;color:var(--ink-light)">满分</div></div>
            <div><div style="font-size:1.5rem;font-weight:700;color:var(--gamboge-light)">\${avg}</div><div style="font-size:.75rem;margin-top:4px;color:var(--ink-light)">平均分</div></div>
          </div>
        </div>
      </div>
      <div class="sticky-bottom" style="display:flex;gap:12px;margin-top:32px">
        <button style="flex:1;background:var(--ink-medium);color:var(--ink-light);border:1px solid rgba(48,54,61,.6)" onclick="goPage('world')">返回世界</button>
        <button style="flex:1;background:var(--azurite);color:#fff;border:none" onclick="showToast('分享功能开发中')">分享成绩</button>
      </div>
    </div>
  \`;
}

// ===== TYPEWRITER =====
let twTimer = null;
function startTypewriter(elId, text, speed, onComplete) {
  const el = document.getElementById(elId);
  if (!el) { if (onComplete) onComplete(); return; }
  if (twTimer) { clearInterval(twTimer); twTimer = null; }
  if (!text) { el.textContent = ''; if (onComplete) onComplete(); return; }
  let idx = 0;
  twTimer = setInterval(() => {
    idx += 1;
    if (idx >= text.length) {
      el.textContent = text;
      clearInterval(twTimer);
      twTimer = null;
      if (onComplete) onComplete();
    } else {
      el.textContent = text.slice(0, idx);
    }
  }, speed);
}

// ===== INIT =====
renderEraPage();
renderWorldPage();
`;

  // Assemble the final HTML
  const newHtml = beforeScript + newScriptContent + afterScript;

  // Write output
  fs.writeFileSync(DEMO_HTML_DST, newHtml, 'utf-8');

  const fileSize = fs.statSync(DEMO_HTML_DST).size;
  const fileSizeMB = (fileSize / 1024 / 1024).toFixed(2);

  console.log('\n=== Build Complete ===');
  console.log(`Files read: ${filesRead}`);
  console.log(`Eras loaded: ${totalEras}`);
  console.log(`Narratives loaded: ${Object.keys(narratives).length}`);
  console.log(`Worlds loaded: ${sampleWorlds.length}`);
  console.log(`Output: ${DEMO_HTML_DST}`);
  console.log(`Size: ${fileSizeMB} MB (${fileSize.toLocaleString()} bytes)`);
}

main();
