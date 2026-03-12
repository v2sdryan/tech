const fs = require('fs');
const path = require('path');

const baseDir = '/Users/hoisanng/Desktop/tech/posts';
const targetDay = process.argv[2] || hkToday();
const detailDir = path.join(baseDir, targetDay);
const indexPath = path.join(baseDir, 'index.json');
const dataDir = path.join(baseDir, '_data');
const snapshotPath = path.join(dataDir, `${targetDay}.json`);
const MAX_ITEMS = 20;
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || '4', 10);
const START_INDEX = parseInt(process.env.START_INDEX || '0', 10);
const WINDOW_DAYS = 2;

const FEEDS = [
  {
    source: 'TechCrunch',
    url: 'https://techcrunch.com/feed/',
    type: 'rss',
    section: (title) => classify(title, 'tc'),
  },
  {
    source: 'The Register',
    url: 'https://www.theregister.com/headlines.atom',
    type: 'atom',
    section: (title) => classify(title, 'reg'),
  },
  {
    source: 'The Verge',
    url: 'https://www.theverge.com/rss/index.xml',
    type: 'atom',
    section: (title) => classify(title, 'verge'),
  },
];

function hkToday() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Hong_Kong',
    year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date());
  const map = Object.fromEntries(parts.filter(p => p.type !== 'literal').map(p => [p.type, p.value]));
  return `${map.year}-${map.month}-${map.day}`;
}

function decodeHtmlEntities(input) {
  return String(input || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8230;/g, '...')
    .replace(/&#8211;/g, '-')
    .replace(/&#8212;/g, '-');
}

function stripTags(input) {
  return decodeHtmlEntities(String(input || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim());
}

function escapeHtml(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function isLikelyBoilerplate(text) {
  const low = text.toLowerCase();
  return ['subscribe','newsletter','privacy policy','terms of use','all rights reserved','cookie','advertisement','sign up','follow us']
    .some(k => low.includes(k));
}

function classify(title, source) {
  const t = String(title).toLowerCase();
  if (/ai|openai|anthropic|gemini|llm|agent|chatgpt|model/.test(t)) return 'AI';
  if (/hack|security|breach|malware|phishing|vulnerab|cyber|data theft/.test(t)) return '網絡安全';
  if (/apple|iphone|ipad|mac/.test(t)) return 'Apple';
  if (/google|meta|microsoft|amazon|tesla|nvidia/.test(t)) return '科技巨頭';
  if (/car|ev|robotaxi|uber|air taxi|drone/.test(t)) return '交通科技';
  if (/chip|semiconductor|gpu|cpu/.test(t)) return '晶片';
  if (/space|satellite|moon|nasa|spacex/.test(t)) return '太空科技';
  if (/developer|code|github|software|cloud|server/.test(t)) return '開發與基建';
  return source === 'verge' ? '消費科技' : '全球科技';
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0',
      'accept': 'text/html,application/xhtml+xml,application/xml,text/xml'
    },
    redirect: 'follow'
  });
  if (!res.ok) throw new Error(`fetch failed ${res.status} ${url}`);
  return await res.text();
}

function parseRss(xml, source, sectionFn) {
  const items = [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)].map(m => m[0]);
  return items.map(item => ({
    title: stripTags((item.match(/<title>([\s\S]*?)<\/title>/i) || [,''])[1]),
    url: stripTags((item.match(/<link>([\s\S]*?)<\/link>/i) || [,''])[1]),
    publishedAt: stripTags((item.match(/<pubDate>([\s\S]*?)<\/pubDate>/i) || [,''])[1]),
    source,
    section: sectionFn(stripTags((item.match(/<title>([\s\S]*?)<\/title>/i) || [,''])[1])),
    sourceTitle: stripTags((item.match(/<title>([\s\S]*?)<\/title>/i) || [,''])[1]),
  }));
}

function parseAtom(xml, source, sectionFn) {
  const entries = [...xml.matchAll(/<entry\b[\s\S]*?<\/entry>/gi)].map(m => m[0]);
  return entries.map(entry => {
    const linkMatch = entry.match(/<link[^>]+href="([^"]+)"/i) || entry.match(/<id>([\s\S]*?)<\/id>/i);
    const title = stripTags((entry.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [,''])[1]);
    return {
      title,
      url: stripTags((linkMatch || [,''])[1]),
      publishedAt: stripTags((entry.match(/<updated>([\s\S]*?)<\/updated>/i) || entry.match(/<published>([\s\S]*?)<\/published>/i) || [,''])[1]),
      source,
      section: sectionFn(title),
      sourceTitle: title,
    };
  });
}

function inWindow(publishedAt) {
  const d = new Date(publishedAt);
  if (Number.isNaN(d.getTime())) return false;
  const end = new Date(`${targetDay}T23:59:59+08:00`).getTime();
  const start = end - WINDOW_DAYS * 24 * 3600 * 1000;
  const ts = d.getTime();
  return ts >= start && ts <= end;
}

async function collectItems(forceRefresh = false) {
  fs.mkdirSync(dataDir, { recursive: true });
  if (!forceRefresh && fs.existsSync(snapshotPath)) {
    return JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
  }
  let out = [];
  for (const feed of FEEDS) {
    try {
      const xml = await fetchText(feed.url);
      const parsed = feed.type === 'rss' ? parseRss(xml, feed.source, feed.section) : parseAtom(xml, feed.source, feed.section);
      out.push(...parsed.filter(x => x.url && x.title && inWindow(x.publishedAt)));
    } catch (e) {
      console.error(`feed failed ${feed.source}:`, e.message);
    }
  }
  const seen = new Set();
  out = out.filter(item => {
    const key = item.url;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).sort((a,b) => new Date(b.publishedAt) - new Date(a.publishedAt)).slice(0, MAX_ITEMS);

  const localized = [];
  for (const [i, item] of out.entries()) {
    let zhTitle = item.title;
    try {
      zhTitle = await translateToZhHk(item.title);
    } catch {}
    localized.push({ ...item, id: i + 1, title: zhTitle || item.title });
  }
  fs.writeFileSync(snapshotPath, JSON.stringify(localized, null, 2));
  return localized;
}

function extractParagraphs(html) {
  const pMatches = [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => stripTags(m[1]));
  const liMatches = [...html.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].map((m) => stripTags(m[1]));
  const all = [...pMatches, ...liMatches];
  const cleaned = [];
  const seen = new Set();
  for (const p of all) {
    if (p.length < 40 || p.length > 3000) continue;
    if (isLikelyBoilerplate(p)) continue;
    const key = p.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    cleaned.push(p);
  }
  return cleaned.slice(0, 16);
}

async function translateToZhHk(text) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx');
  url.searchParams.set('sl', 'en');
  url.searchParams.set('tl', 'zh-TW');
  url.searchParams.set('dt', 't');
  url.searchParams.set('q', text);
  const res = await fetch(url.toString(), { headers: { 'user-agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error(`translate failed: ${res.status}`);
  const data = await res.json();
  return data[0].map((part) => part[0]).join('').trim();
}

async function getTranslatedParagraphs(item) {
  try {
    const html = await fetchText(item.url);
    const paragraphs = extractParagraphs(html);
    if (!paragraphs.length) return ['未能從來源頁面抽取可翻譯的正文段落。請直接開啟原文連結查看完整內容。'];
    const out = [];
    for (const p of paragraphs) {
      try {
        out.push(await translateToZhHk(p));
      } catch {
        out.push(`【翻譯失敗，保留原文】${p}`);
      }
    }
    return out;
  } catch (e) {
    return [`未能抓取原文內容：${e.message}`];
  }
}

function buildDigest(items, visibleItems = items) {
  const lines = [`<h1>📅 ${targetDay}｜香港科技 Daily</h1>`, '', `<p>以下為 ${targetDay} 自動整理的 ${visibleItems.length} 則科技新聞。</p>`, ''];
  for (const item of visibleItems) {
    lines.push(
      `<h3>${item.id}. ${item.section}｜${escapeHtml(item.title)}</h3>`,
      `<p>來源：${item.source}｜文章發佈日期：${String(item.publishedAt).slice(0,10)}</p>`,
      `<p>📄 <a href="/posts/${targetDay}/${String(item.id).padStart(2, '0')}.html">閱讀全文翻譯</a></p>`,
      ''
    );
  }
  return lines.join('\n');
}

function buildDetail(item, translatedParagraphs) {
  const id = String(item.id).padStart(2, '0');
  const publishDate = String(item.publishedAt).slice(0, 10);
  const translatedHtml = translatedParagraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('\n    ');
  return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${id}. ${publishDate}｜${escapeHtml(item.title)}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f5f5f7;color:#1d1d1f;line-height:1.7;padding:20px 16px 40px}.wrap{max-width:680px;margin:0 auto}.badge{display:inline-block;background:#007aff;color:#fff;font-size:12px;padding:2px 10px;border-radius:12px;margin:0 4px 12px 0}.source{background:#f0f0f5;border-left:3px solid #007aff;padding:10px 14px;border-radius:4px;margin-bottom:20px;font-size:14px}.source a{color:#007aff;word-break:break-all}h1{font-size:22px;line-height:1.4;margin-bottom:16px}h2{font-size:18px;margin:28px 0 12px;color:#1d1d1f}p{font-size:16px;margin-bottom:16px;text-align:justify}.back{display:inline-block;margin-top:32px;color:#007aff;text-decoration:none;font-size:15px}
  </style>
</head>
<body>
  <article class="wrap">
    <div><span class="badge">指定文章 ${id}</span><span class="badge">全文翻譯（zh-HK）</span></div>
    <div class="source">📰 原文來源：<a href="${escapeHtml(item.url)}" target="_blank">${escapeHtml(item.source)} — ${escapeHtml(item.sourceTitle)}</a><br>📅 原文發佈：${publishDate}</div>
    <h1>${id}. ${publishDate}｜${escapeHtml(item.title)}</h1>
    <h2>全文翻譯（繁體中文・香港）</h2>
    ${translatedHtml}
    <a class="back" href="/">← 返回首頁</a>
  </article>
</body>
</html>`;
}

function updateIndex(day) {
  let index = {};
  if (fs.existsSync(indexPath)) index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  index[day] = true;
  fs.writeFileSync(indexPath, JSON.stringify(index));
}

async function main() {
  fs.mkdirSync(detailDir, { recursive: true });
  const items = await collectItems(process.env.FORCE_REFRESH === '1');
  if (!items.length) throw new Error(`No items found for ${targetDay}`);
  const visibleItems = items.slice(0, Math.min(items.length, START_INDEX + BATCH_SIZE));
  const batchItems = items.slice(START_INDEX, START_INDEX + BATCH_SIZE);
  if (!batchItems.length) throw new Error(`No batch items left for ${targetDay} from index ${START_INDEX}`);
  fs.writeFileSync(path.join(baseDir, `${targetDay}.html`), buildDigest(items, visibleItems));
  for (const item of batchItems) {
    const translated = await getTranslatedParagraphs(item);
    const file = path.join(detailDir, `${String(item.id).padStart(2, '0')}.html`);
    fs.writeFileSync(file, buildDetail(item, translated));
    console.log(`translated ${String(item.id).padStart(2, '0')} ${item.source}`);
  }
  updateIndex(targetDay);
  console.log(`Generated ${targetDay} digest with ${visibleItems.length} visible items; batch ${START_INDEX + 1}-${START_INDEX + batchItems.length}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
