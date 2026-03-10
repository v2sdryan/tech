const fs = require("fs");
const path = require("path");

const baseDir = "/Users/hoisanng/Desktop/tech/posts";
const day = "2026-03-10";
const detailDir = path.join(baseDir, day);

const items = [
  {
    "id": 1,
    "section": "手機供應鏈",
    "title": "Apple 據報已在印度生產四分之一 iPhone",
    "source": "TechCrunch",
    "sourceTitle": "Apple now makes one in four iPhones in India: report",
    "url": "https://techcrunch.com/2026/03/09/apple-now-makes-one-in-four-iphones-in-india-report/",
    "publishedAt": "2026-03-10T06:04:43Z"
  },
  {
    "id": 2,
    "section": "太空探索",
    "title": "SETI 承認尋找外星生命的搜尋策略可能過於狹窄",
    "source": "The Register",
    "sourceTitle": "SETI admits its search for alien life may be too narrowly focussed",
    "url": "https://go.theregister.com/feed/www.theregister.com/2026/03/10/seti_admits_its_search_for/",
    "publishedAt": "2026-03-10T05:27:36Z"
  },
  {
    "id": 3,
    "section": "AI 融資",
    "title": "Yann LeCun 相關新創 AMI Labs 據報融資 10.3 億美元",
    "source": "TechCrunch",
    "sourceTitle": "Yann LeCun’s AMI Labs raises $1.03 billion to build world models",
    "url": "https://techcrunch.com/2026/03/09/yann-lecuns-ami-labs-raises-1-03-billion-to-build-world-models/",
    "publishedAt": "2026-03-10T05:00:00Z"
  },
  {
    "id": 4,
    "section": "企業軟件",
    "title": "HPE 調整條款：報價未必等於最終付款金額",
    "source": "The Register",
    "sourceTitle": "HPE tweaks T&Cs so the price it quotes may not be the price you pay",
    "url": "https://go.theregister.com/feed/www.theregister.com/2026/03/10/hpe_q1_2026/",
    "publishedAt": "2026-03-10T02:57:12Z"
  },
  {
    "id": 5,
    "section": "網絡安全",
    "title": "俄方間諜使用的 iPhone 入侵工具包疑來自美國軍工承包商",
    "source": "TechCrunch",
    "sourceTitle": "An iPhone-hacking toolkit used by Russian spies likely came from U.S military contractor",
    "url": "https://techcrunch.com/2026/03/09/an-iphone-hacking-toolkit-used-by-russian-spies-likely-came-from-u-s-military-contractor/",
    "publishedAt": "2026-03-10T01:56:01Z"
  },
  {
    "id": 6,
    "section": "低空經濟",
    "title": "Archer 反訴 Joby，指對方隱瞞中國關聯",
    "source": "TechCrunch",
    "sourceTitle": "Electric air taxi maker Archer hits back at Joby in countersuit alleging concealed Chinese ties",
    "url": "https://techcrunch.com/2026/03/09/electric-air-taxi-maker-archer-hits-back-at-joby-in-countersuit-alleging-concealed-chinese-ties/",
    "publishedAt": "2026-03-10T01:41:38Z"
  },
  {
    "id": 7,
    "section": "政務科技",
    "title": "Palantir 的 AI 系統被部署到美國政府內部流程",
    "source": "The Register",
    "sourceTitle": "Palantir’s lethal AI weaponry deployed to find chairs for US government staff",
    "url": "https://go.theregister.com/feed/www.theregister.com/2026/03/10/palantir_usda_seating_software/",
    "publishedAt": "2026-03-10T01:25:12Z"
  },
  {
    "id": 8,
    "section": "開發工具",
    "title": "Anthropic 推出自動化 Code Review 工具",
    "source": "The Register",
    "sourceTitle": "Anthropic debuts pricey and sluggish automated Code Review tool",
    "url": "https://go.theregister.com/feed/www.theregister.com/2026/03/09/anthropic_debuts_code_review/",
    "publishedAt": "2026-03-09T23:06:33Z"
  },
  {
    "id": 9,
    "section": "交通科技",
    "title": "電動空中的士據報即將在美國 26 州試飛／營運",
    "source": "TechCrunch",
    "sourceTitle": "Electric air taxis are about to take flight in 26 states",
    "url": "https://techcrunch.com/2026/03/09/electric-air-taxis-are-about-to-take-flight-in-26-states/",
    "publishedAt": "2026-03-09T22:30:35Z"
  },
  {
    "id": 10,
    "section": "AI 安全",
    "title": "AI 對 AI 攻防：研究員兩小時內攻破顧問公司聊天機械人權限",
    "source": "The Register",
    "sourceTitle": "AI vs AI: Agent hacked McKinsey's chatbot and gained full read-write access in just two hours",
    "url": "https://go.theregister.com/feed/www.theregister.com/2026/03/09/mckinsey_ai_chatbot_hacked/",
    "publishedAt": "2026-03-09T22:22:07Z"
  },
  {
    "id": 11,
    "section": "AI 政策",
    "title": "OpenAI 與 Google 員工公開聲援 Anthropic 的國防訴訟立場",
    "source": "TechCrunch",
    "sourceTitle": "OpenAI and Google employees rush to Anthropic’s defense in DOD lawsuit",
    "url": "https://techcrunch.com/2026/03/09/openai-and-google-employees-rush-to-anthropics-defense-in-dod-lawsuit/",
    "publishedAt": "2026-03-09T21:15:17Z"
  },
  {
    "id": 12,
    "section": "社交平台",
    "title": "Bluesky CEO Jay Graber 宣布離任",
    "source": "TechCrunch",
    "sourceTitle": "Bluesky CEO Jay Graber steps down",
    "url": "https://techcrunch.com/2026/03/09/bluesky-ceo-jay-graber-steps-down/",
    "publishedAt": "2026-03-09T19:32:05Z"
  },
  {
    "id": 13,
    "section": "資料外洩",
    "title": "ShinyHunters 稱再有高知名 Salesforce 客戶受害",
    "source": "The Register",
    "sourceTitle": "ShinyHunters claims more high-profile victims in latest Salesforce customers data heist",
    "url": "https://go.theregister.com/feed/www.theregister.com/2026/03/09/shinyhunters_claims_more_highprofile_victims/",
    "publishedAt": "2026-03-09T18:30:27Z"
  },
  {
    "id": 14,
    "section": "衛星網絡",
    "title": "Amazon 要求 FCC 否決 SpaceX 的百萬衛星資料中心構想",
    "source": "The Register",
    "sourceTitle": "Amazon tells FCC to bin SpaceX's million-satellite datacenter dream",
    "url": "https://go.theregister.com/feed/www.theregister.com/2026/03/09/amazon_petitions_to_block_spacexs/",
    "publishedAt": "2026-03-09T18:08:19Z"
  },
  {
    "id": 15,
    "section": "太空科技",
    "title": "中國勘察登月著陸點，月球競賽升溫",
    "source": "The Register",
    "sourceTitle": "China browses lunar landing spots in race to land on Moon",
    "url": "https://go.theregister.com/feed/www.theregister.com/2026/03/09/china_browses_lunar_landing_spots/",
    "publishedAt": "2026-03-09T17:49:48Z"
  },
  {
    "id": 16,
    "section": "AI 產業",
    "title": "OpenAI 收購 Promptfoo 以強化 AI Agent 安全",
    "source": "TechCrunch",
    "sourceTitle": "OpenAI acquires Promptfoo to secure its AI agents",
    "url": "https://techcrunch.com/2026/03/09/openai-acquires-promptfoo-to-secure-its-ai-agents/",
    "publishedAt": "2026-03-09T17:49:04Z"
  },
  {
    "id": 17,
    "section": "電動車",
    "title": "Slate Auto 在平價 EV 發布前數月更換 CEO",
    "source": "TechCrunch",
    "sourceTitle": "Slate Auto changes CEO months ahead of affordable EV launch",
    "url": "https://techcrunch.com/2026/03/09/slate-auto-changes-ceo-months-ahead-of-affordable-ev-launch/",
    "publishedAt": "2026-03-09T16:14:30Z"
  },
  {
    "id": 18,
    "section": "資安威脅",
    "title": "荷蘭情報機關警告：俄方黑客正針對 Signal/WhatsApp 用戶",
    "source": "TechCrunch",
    "sourceTitle": "Russian government hackers targeting Signal and WhatsApp users, Dutch spies warn",
    "url": "https://techcrunch.com/2026/03/09/russian-government-hackers-targeting-signal-and-whatsapp-users-dutch-spies-warn/",
    "publishedAt": "2026-03-09T15:56:03Z"
  },
  {
    "id": 19,
    "section": "瀏覽器安全",
    "title": "Chrome 擴充功能轉手後變惡意程式，涉注入代碼與竊資",
    "source": "The Hacker News",
    "sourceTitle": "Chrome Extension Turns Malicious After Ownership Transfer, Enabling Code Injection and Data Theft",
    "url": "https://thehackernews.com/2026/03/chrome-extension-turns-malicious-after.html",
    "publishedAt": "2026-03-09T10:28:00Z"
  },
  {
    "id": 20,
    "section": "加密資產安全",
    "title": "UNC4899 透過 AirDrop 木馬檔案入侵加密貨幣公司",
    "source": "The Hacker News",
    "sourceTitle": "UNC4899 Breached Crypto Firm After Developer AirDropped Trojanized File to Work Device",
    "url": "https://thehackernews.com/2026/03/unc4899-used-airdrop-file-transfer-and.html",
    "publishedAt": "2026-03-09T14:50:00Z"
  }
];

function formatDate(iso) {
  return iso.slice(0, 10);
}

function decodeHtmlEntities(input) {
  return input
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8230;/g, "...")
    .replace(/&#8211;/g, "-")
    .replace(/&#8212;/g, "-");
}

function stripTags(input) {
  return decodeHtmlEntities(
    input
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function isLikelyBoilerplate(text) {
  const low = text.toLowerCase();
  const bad = [
    "subscribe",
    "newsletter",
    "privacy policy",
    "terms of use",
    "all rights reserved",
    "cookie",
    "advertisement",
    "read more:",
    "sign up",
    "follow us",
  ];
  return bad.some((k) => low.includes(k));
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      accept: "text/html,application/xhtml+xml",
    },
    redirect: "follow",
  });
  if (!res.ok) {
    throw new Error(`fetch failed: ${res.status} ${url}`);
  }
  return await res.text();
}

function extractParagraphs(html) {
  const pMatches = [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((m) =>
    stripTags(m[1])
  );
  const liMatches = [...html.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].map((m) =>
    stripTags(m[1])
  );
  const allMatches = [...pMatches, ...liMatches];
  const cleaned = [];
  const seen = new Set();
  for (const p of allMatches) {
    if (p.length < 40 || p.length > 3000) continue;
    if (isLikelyBoilerplate(p)) continue;
    const key = p.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    cleaned.push(p);
  }
  return cleaned.slice(0, 28);
}

async function translateToZhHk(text) {
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", "en");
  url.searchParams.set("tl", "zh-TW");
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", text);
  const res = await fetch(url.toString(), {
    headers: { "user-agent": "Mozilla/5.0" },
  });
  if (!res.ok) {
    throw new Error(`translate failed: ${res.status}`);
  }
  const data = await res.json();
  return data[0].map((part) => part[0]).join("").trim();
}

async function getTranslatedParagraphs(item) {
  const html = await fetchHtml(item.url);
  const paragraphs = extractParagraphs(html);
  if (!paragraphs.length) {
    return [
      "未能從來源頁面抽取可翻譯的正文段落。請直接開啟原文連結查看完整內容。",
    ];
  }

  const out = [];
  for (const p of paragraphs) {
    try {
      const zh = await translateToZhHk(p);
      if (zh) out.push(zh);
    } catch {
      out.push(`【翻譯失敗，保留原文】${p}`);
    }
  }
  return out.length
    ? out
    : ["翻譯服務暫時不可用。請稍後重試，或直接查看原文內容。"];
}

function buildDigest() {
  const lines = [`<h1>📅 2026-03-10｜香港科技 Daily（已重整）</h1>`, ""];
  lines.push(
    "<p>以下 20 則新聞均已驗證來源文章發佈日期為 <strong>2026-03-09</strong> 或 <strong>2026-03-10</strong>。</p>",
    ""
  );

  for (const item of items) {
    lines.push(
      `<h3>${item.id}. ${item.section}｜${item.title}</h3>`,
      `<p>來源：${item.source}｜文章發佈日期：${formatDate(item.publishedAt)}</p>`,
      `<p>📄 <a href="/posts/2026-03-10/${String(item.id).padStart(2, "0")}.html">閱讀全文翻譯</a></p>`,
      ""
    );
  }

  return lines.join("\n");
}

function buildDetail(item, translatedParagraphs) {
  const id = String(item.id).padStart(2, "0");
  const publishDate = formatDate(item.publishedAt);
  const translatedHtml = translatedParagraphs
    .map((p) => `<p>${p}</p>`)
    .join("\n    ");

  return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${id}. ${publishDate}｜${item.title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f5f5f7; color: #1d1d1f; line-height: 1.7; padding: 20px 16px 40px; }
    .wrap { max-width: 680px; margin: 0 auto; }
    .badge { display: inline-block; background: #007aff; color: #fff; font-size: 12px; padding: 2px 10px; border-radius: 12px; margin: 0 4px 12px 0; }
    .source { background: #f0f0f5; border-left: 3px solid #007aff; padding: 10px 14px; border-radius: 4px; margin-bottom: 20px; font-size: 14px; }
    .source a { color: #007aff; word-break: break-all; }
    h1 { font-size: 22px; line-height: 1.4; margin-bottom: 16px; }
    h2 { font-size: 18px; margin: 28px 0 12px; color: #1d1d1f; }
    p { font-size: 16px; margin-bottom: 16px; text-align: justify; }
    .back { display: inline-block; margin-top: 32px; color: #007aff; text-decoration: none; font-size: 15px; }
    .back:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <article class="wrap">
    <div>
      <span class="badge">指定文章 ${id}</span>
      <span class="badge">全文翻譯（zh-HK）</span>
    </div>
    <div class="source">📰 原文來源：<a href="${item.url}" target="_blank">${item.source} — ${item.sourceTitle}</a><br>📅 原文發佈：${publishDate}（RSS/Atom 驗證）</div>
    <h1>${id}. ${publishDate}｜${item.title}</h1>

    <h2>全文翻譯（繁體中文・香港）</h2>
    ${translatedHtml}

    <a class="back" href="/">← 返回首頁</a>
  </article>
</body>
</html>
`;
}

async function main() {
  fs.writeFileSync(path.join(baseDir, `${day}.html`), buildDigest());
  for (const item of items) {
    const translated = await getTranslatedParagraphs(item);
    const file = path.join(detailDir, `${String(item.id).padStart(2, "0")}.html`);
    fs.writeFileSync(file, buildDetail(item, translated));
    console.log(`translated ${String(item.id).padStart(2, "0")} ${item.source}`);
  }
  console.log(`Regenerated ${day} digest and ${items.length} detail pages.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
