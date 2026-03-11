const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const repoDir = '/Users/hoisanng/Desktop/tech';
const statePath = path.join(repoDir, 'scripts', 'daily-batch-state.json');
const day = hkToday();
const batchSize = 4;
const maxItems = 20;

function hkToday() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Hong_Kong', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date());
  const map = Object.fromEntries(parts.filter(p => p.type !== 'literal').map(p => [p.type, p.value]));
  return `${map.year}-${map.month}-${map.day}`;
}

function loadState() {
  if (!fs.existsSync(statePath)) return {};
  try { return JSON.parse(fs.readFileSync(statePath, 'utf8')); } catch { return {}; }
}

function saveState(state) {
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
}

function main() {
  const state = loadState();
  const dayState = state[day] || { nextStartIndex: 0, completedRanges: [] };
  const startIndex = Number(dayState.nextStartIndex || 0);

  if (startIndex >= maxItems) {
    console.log(JSON.stringify({ ok: true, day, done: true, message: `${day} 今日 20 篇已全部完成，無需更新。` }));
    return;
  }

  const env = { ...process.env, START_INDEX: String(startIndex), BATCH_SIZE: String(batchSize) };
  execSync(`node scripts/generate-daily.js ${day}`, { cwd: repoDir, stdio: 'inherit', env });

  const startNo = startIndex + 1;
  const endNo = Math.min(startIndex + batchSize, maxItems);
  const range = `${String(startNo).padStart(2, '0')}-${String(endNo).padStart(2, '0')}`;

  const files = [
    'posts/index.json',
    `posts/${day}.html`,
    ...Array.from({ length: endNo - startNo + 1 }, (_, i) => `posts/${day}/${String(startNo + i).padStart(2, '0')}.html`),
    'scripts/generate-daily.js',
    'scripts/run-next-batch.js',
    'scripts/daily-batch-state.json',
  ].filter(f => fs.existsSync(path.join(repoDir, f)));

  dayState.nextStartIndex = endNo;
  dayState.completedRanges = [...new Set([...(dayState.completedRanges || []), range])];
  state[day] = dayState;
  saveState(state);

  execSync(`git add ${files.map(f => `'${f}'`).join(' ')}`, { cwd: repoDir, stdio: 'inherit' });
  execSync(`git commit -m "feat: generate ${day} news batch ${Math.floor(startIndex / batchSize) + 1} (${range})"`, { cwd: repoDir, stdio: 'inherit' });
  execSync('git push origin main', { cwd: repoDir, stdio: 'inherit' });

  const hash = execSync('git rev-parse --short HEAD', { cwd: repoDir }).toString().trim();
  console.log(JSON.stringify({ ok: true, day, range, commit: hash, summary: `已新增 ${day} 第 ${Math.floor(startIndex / batchSize) + 1} 批（${range}），內容已用繁體中文標題及摘要。` }));
}

main();
