#!/usr/bin/env node
// /audit-usage — aggregates Claude Code token usage per project
// over a time window. Reads local jsonl logs via ccusage CLI; maps
// session UUIDs to projects by scanning ~/.claude/projects/<dir>/.
// Output: markdown to stdout. No file writes (curated dashboard
// is anti-pattern per ADR-0003 principle #3).
//
// Usage: node .claude/scripts/audit-usage.js [YYYY-MM-DD]
//   default since: 7 days ago

const cp = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const sinceArg = process.argv[2] || (() => {
  const d = new Date(Date.now() - 7 * 86400 * 1000);
  return d.toISOString().slice(0, 10);
})();
const sinceCompact = sinceArg.replace(/-/g, '');

const knownProjects = [
  'MatricaRMZ', 'Gonba', 'setka', 'karman', 'brain-matrica',
  'mikrokredit', 'postopus',
];
const aliases = {
  'Gonba': 'GONBA',
  'karman': 'KARMAN',
  'brain-matrica': 'brain_matrica',
};
const archived = new Set(['mikrokredit', 'postopus']);
const normalize = (name) => aliases[name] || name;

function dirToProject(dir) {
  const base = dir.split('--claude-worktrees-')[0];
  for (const p of knownProjects) {
    if (base.toLowerCase().includes('-' + p.toLowerCase())) {
      return { name: normalize(p), archived: archived.has(p) };
    }
  }
  return null;
}

const projectsRoot = path.join(os.homedir(), '.claude', 'projects');
const uuidToProject = {};
const uuidToWorktree = {};
const uuidToArchived = {};
for (const dir of fs.readdirSync(projectsRoot)) {
  const full = path.join(projectsRoot, dir);
  if (!fs.statSync(full).isDirectory()) continue;
  const meta = dirToProject(dir);
  if (!meta) continue;
  const isWorktree = dir.includes('--claude-worktrees-');
  for (const f of fs.readdirSync(full)) {
    if (!f.endsWith('.jsonl')) continue;
    const uuid = f.replace('.jsonl', '');
    uuidToProject[uuid] = meta.name;
    if (isWorktree) uuidToWorktree[uuid] = true;
    if (meta.archived) uuidToArchived[uuid] = true;
  }
}

const runCcusage = (cmd) => {
  const raw = cp.execSync(
    `npx -y ccusage@latest ${cmd} --json --since ${sinceCompact}`,
    { encoding: 'utf8', maxBuffer: 100 * 1024 * 1024 }
  );
  return JSON.parse(raw);
};

const sessionData = runCcusage('session');
const sessions = (sessionData.session || []).filter(s => s.agent === 'claude');

const perProject = {};
let unknownCost = 0, unknownTokens = 0, unknownSessions = 0;
for (const s of sessions) {
  const uuid = s.period;
  const proj = uuidToProject[uuid];
  if (!proj) {
    unknownCost += s.totalCost;
    unknownTokens += s.totalTokens;
    unknownSessions++;
    continue;
  }
  if (!perProject[proj]) {
    perProject[proj] = {
      cost: 0, tokens: 0, sessions: 0, worktreeSessions: 0,
      archived: false, lastActivity: '',
    };
  }
  const p = perProject[proj];
  p.cost += s.totalCost;
  p.tokens += s.totalTokens;
  p.sessions++;
  if (uuidToWorktree[uuid]) p.worktreeSessions++;
  if (uuidToArchived[uuid]) p.archived = true;
  const la = s.metadata?.lastActivity || '';
  if (la > p.lastActivity) p.lastActivity = la;
}

const dailyData = runCcusage('claude');
const dailyArr = dailyData.daily || dailyData;

const fmtUSD = n => '$' + n.toFixed(2);
const fmtTokens = n => {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(0) + 'k';
  return String(n);
};

const totalCost = sessions.reduce((a, s) => a + s.totalCost, 0);
const totalTokens = sessions.reduce((a, s) => a + s.totalTokens, 0);
const cacheRead = sessions.reduce((a, s) => a + (s.cacheReadTokens || 0), 0);
const cacheRate = totalTokens > 0 ? (cacheRead / totalTokens * 100).toFixed(0) : 0;

console.log(`## /audit-usage — Claude Code, since ${sinceArg}\n`);
console.log(`**Total:** ${fmtUSD(totalCost)} · ${fmtTokens(totalTokens)} токенов · ${sessions.length} сессий · cache read ${cacheRate}%\n`);

console.log(`### По проектам\n`);
console.log(`| Проект | Cost | Tokens | Sessions | Worktree | Last activity |`);
console.log(`|---|---|---|---|---|---|`);
const sorted = Object.entries(perProject).sort((a, b) => b[1].cost - a[1].cost);
for (const [proj, p] of sorted) {
  const wt = p.worktreeSessions > 0 ? `${p.worktreeSessions}/${p.sessions}` : '—';
  const tag = p.archived ? ' (archived)' : '';
  const pct = totalCost > 0 ? ` (${(p.cost / totalCost * 100).toFixed(0)}%)` : '';
  console.log(`| ${proj}${tag} | ${fmtUSD(p.cost)}${pct} | ${fmtTokens(p.tokens)} | ${p.sessions} | ${wt} | ${(p.lastActivity || '').slice(0, 10)} |`);
}
if (unknownSessions > 0) {
  console.log(`| (unknown) | ${fmtUSD(unknownCost)} | ${fmtTokens(unknownTokens)} | ${unknownSessions} | — | — |`);
}

console.log(`\n### По дням\n`);
if (Array.isArray(dailyArr) && dailyArr.length > 0) {
  console.log(`| Дата | Cost | Tokens | Модели |`);
  console.log(`|---|---|---|---|`);
  for (const d of dailyArr) {
    const models = (d.modelsUsed || []).map(m => m.replace(/^claude-/, '').replace(/-\d{8}$/, '')).join(', ');
    console.log(`| ${d.date} | ${fmtUSD(d.totalCost)} | ${fmtTokens(d.totalTokens)} | ${models} |`);
  }
} else {
  console.log('_(no daily data)_');
}

console.log(`\n### Top-5 сессий по cost\n`);
const top5 = [...sessions].sort((a, b) => b.totalCost - a.totalCost).slice(0, 5);
console.log(`| UUID | Project | Cost | Tokens | Date | Models |`);
console.log(`|---|---|---|---|---|---|`);
for (const s of top5) {
  const proj = uuidToProject[s.period] || '(unknown)';
  const models = (s.modelsUsed || []).map(m => m.replace(/^claude-/, '').replace(/-\d{8}$/, '')).join(', ');
  console.log(`| \`${s.period.slice(0, 8)}\` | ${proj} | ${fmtUSD(s.totalCost)} | ${fmtTokens(s.totalTokens)} | ${(s.metadata?.lastActivity || '').slice(0, 10)} | ${models} |`);
}
