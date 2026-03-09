const fs = require('fs');
const path = require('path');

const postsDir = '/Users/hoisanng/Desktop/tech-main/posts';

// Get all date directories
const items = fs.readdirSync(postsDir);
const dates = items.filter(i => /^\d{4}-\d{2}-\d{2}$/.test(i) && fs.statSync(path.join(postsDir, i)).isDirectory());

let articleFixed = 0;
let digestFixed = 0;

// 1. Fix all individual article pages - remove the entire meta div with 原文連結
for (const date of dates) {
  const dir = path.join(postsDir, date);
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  for (const file of files) {
    const fp = path.join(dir, file);
    let html = fs.readFileSync(fp, 'utf-8');
    const before = html;
    // Remove the entire <div class="meta">原文連結：...</div> line
    html = html.replace(/\s*<div class="meta">原文連結：.*?<\/div>\n?/g, '\n');
    if (html !== before) {
      fs.writeFileSync(fp, html);
      articleFixed++;
    }
  }
}

// 2. Fix all digest pages - remove ｜原文：<a ...>...</a> from each line
for (const date of dates) {
  const digestFile = path.join(postsDir, `${date}.html`);
  if (fs.existsSync(digestFile)) {
    let html = fs.readFileSync(digestFile, 'utf-8');
    const before = html;
    // Remove ｜原文：<a href="..." target="_blank">...</a>
    html = html.replace(/｜原文：<a href="[^"]*"[^>]*>[^<]*<\/a>/g, '');
    if (html !== before) {
      fs.writeFileSync(digestFile, html);
      digestFixed++;
    }
  }
}

console.log(`Fixed ${articleFixed} article pages`);
console.log(`Fixed ${digestFixed} digest pages`);
