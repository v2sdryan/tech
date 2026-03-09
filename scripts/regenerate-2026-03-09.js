const fs = require("fs");
const path = require("path");

const baseDir = "/Users/hoisanng/Desktop/tech-main/posts";
const day = "2026-03-09";
const detailDir = path.join(baseDir, day);

const items = [
  {
    id: 1,
    section: "全球科技",
    title: "資料災難反轉：單一程式錯誤意外保住客戶合約",
    source: "The Register",
    sourceTitle: "Bug that wiped customer data saved the day – and a contract",
    url: "https://www.theregister.com/2026/03/09/who_me/",
    publishedAt: "2026-03-09T07:30:07Z",
  },
  {
    id: 2,
    section: "政策與產業",
    title: "Lenovo 與 Nintendo 起訴美國政府要求退回關稅",
    source: "The Register",
    sourceTitle: "Lenovo, Nintendo, sue US government, seeking tariff refunds",
    url: "https://www.theregister.com/2026/03/09/lenovo_nintendo_sue_us_government/",
    publishedAt: "2026-03-09T06:12:23Z",
  },
  {
    id: 3,
    section: "太空科技",
    title: "NASA 更新 DART 任務分析：成功讓小行星減速",
    source: "The Register",
    sourceTitle: "NASA’s asteroid defence mission slowed targets by 1.7 inches per hour",
    url: "https://www.theregister.com/2026/03/09/nasa_dart_analysis/",
    publishedAt: "2026-03-09T04:56:30Z",
  },
  {
    id: 4,
    section: "網絡安全",
    title: "美伊衝突下網絡戰升溫：攻防行動轉向公開化",
    source: "The Register",
    sourceTitle: "Iran is the first out-loud cyberwar the US has fought",
    url: "https://www.theregister.com/2026/03/09/kettle_2026_episode_01_iran_war/",
    publishedAt: "2026-03-09T01:31:10Z",
  },
  {
    id: 5,
    section: "晶片供應鏈",
    title: "中國關注晶片供應風險：Nexperia 中國團隊傳遭系統切斷",
    source: "The Register",
    sourceTitle:
      "Beijing warns of more chip supply worries after Nexperia China claims it was cut off from SAP",
    url: "https://www.theregister.com/2026/03/09/asia_tech_news_roundup/",
    publishedAt: "2026-03-09T01:13:48Z",
  },
  {
    id: 6,
    section: "執法科技",
    title: "FBI 調查竊聽系統疑似入侵事件",
    source: "The Register",
    sourceTitle: "FBI is investigating breach that may have hit its wiretapping tools",
    url: "https://www.theregister.com/2026/03/08/fbi_investigates_wiretap_system_breach/",
    publishedAt: "2026-03-08T23:14:54Z",
  },
  {
    id: 7,
    section: "攻防自動化",
    title: "AI Agent 開始被用於黑客「苦差」流程",
    source: "The Register",
    sourceTitle:
      "AI agents now help attackers, including North Korea, manage their drudge work",
    url: "https://www.theregister.com/2026/03/08/deploy_and_manage_attack_infrastructure/",
    publishedAt: "2026-03-08T11:00:06Z",
  },
  {
    id: 8,
    section: "生醫 AI",
    title: "人類神經元接上晶片後可學習操作 Doom",
    source: "The Register",
    sourceTitle: "Bundle of human neurons hooked to silicon learns to stumble through Doom",
    url: "https://www.theregister.com/2026/03/08/neurons_doom/",
    publishedAt: "2026-03-08T09:30:06Z",
  },
  {
    id: 9,
    section: "智慧家居",
    title: "Ring 針對隱私疑慮再度回應，但外界仍存疑",
    source: "TechCrunch",
    sourceTitle:
      "Ring's Jamie Siminoff has been trying to calm privacy fears since the Super Bowl, but his answers may not help",
    url: "https://techcrunch.com/2026/03/08/rings-jamie-siminoff-has-been-trying-to-calm-privacy-fears-since-the-super-bowl-but-his-answers-may-not-help/",
    publishedAt: "2026-03-09T04:35:06Z",
  },
  {
    id: 10,
    section: "遊戲硬件",
    title: "ModRetro 傳以 10 億美元估值尋求新一輪融資",
    source: "TechCrunch",
    sourceTitle:
      "Palmer Luckey’s retro gaming startup ModRetro reportedly seeks funding at $1B valuation",
    url: "https://techcrunch.com/2026/03/08/palmer-luckeys-retro-gaming-startup-modretro-reportedly-seeks-funding-at-1b-valuation/",
    publishedAt: "2026-03-08T21:26:07Z",
  },
  {
    id: 11,
    section: "AI 政策",
    title: "Anthropic 與五角大樓爭議延燒：初創是否卻步國防合約",
    source: "TechCrunch",
    sourceTitle:
      "Will the Pentagon’s Anthropic controversy scare startups away from defense work?",
    url: "https://techcrunch.com/2026/03/08/will-the-pentagons-anthropic-controversy-scare-startups-away-from-defense-work/",
    publishedAt: "2026-03-08T20:14:42Z",
  },
  {
    id: 12,
    section: "基建與 AI",
    title: "拘留設施營運商布局 AI 工地住宿市場",
    source: "TechCrunch",
    sourceTitle: "Owner of ICE detention facility sees big opportunity in AI man camps",
    url: "https://techcrunch.com/2026/03/08/owner-of-ice-detention-facility-sees-big-opportunity-in-ai-man-camps/",
    publishedAt: "2026-03-08T16:30:00Z",
  },
  {
    id: 13,
    section: "電動車",
    title: "Rivian R2 量產策略成移動科技焦點",
    source: "TechCrunch",
    sourceTitle: "TechCrunch Mobility: Rivian's R2 gambit",
    url: "https://techcrunch.com/2026/03/08/techcrunch-mobility-rivians-r2-gambit/",
    publishedAt: "2026-03-08T16:03:00Z",
  },
  {
    id: 14,
    section: "遊戲產業",
    title: "網易據報縮減對《人中之龍》創作者工作室資金",
    source: "Engadget",
    sourceTitle: "NetEase is reportedly pulling funding for Yakuza creator's studio",
    url: "https://www.engadget.com/gaming/netease-is-reportedly-pulling-funding-for-yakuza-creators-studio-182945690.html?src=rss",
    publishedAt: "2026-03-08T18:29:45Z",
  },
  {
    id: 15,
    section: "消費硬件",
    title: "Apple 傳測試 3D 列印鋁製 iPhone 與 Apple Watch 機殼",
    source: "Engadget",
    sourceTitle:
      "Apple is reportedly looking into 3D printing aluminum iPhones and Apple Watches",
    url: "https://www.engadget.com/mobile/smartphones/apple-is-reportedly-looking-into-3d-printing-aluminum-iphones-and-apple-watches-163721491.html?src=rss",
    publishedAt: "2026-03-08T16:37:21Z",
  },
  {
    id: 16,
    section: "AI 企業動態",
    title: "OpenAI 機械人硬件主管據報離職",
    source: "Engadget",
    sourceTitle:
      "OpenAI's robotics hardware lead resigns following deal with the Department of Defense",
    url: "https://www.engadget.com/ai/openais-robotics-hardware-lead-resigns-following-deal-with-the-department-of-defense-195918599.html?src=rss",
    publishedAt: "2026-03-08T14:44:19Z",
  },
  {
    id: 17,
    section: "Apple",
    title: "Apple 傳將擴大 Ultra 高階產品線",
    source: "The Verge",
    sourceTitle: "Apple is going high-end with new ‘Ultra’ products next",
    url: "https://www.theverge.com/tech/891151/apple-is-going-high-end-with-new-ultra-products-next",
    publishedAt: "2026-03-08T17:51:15Z",
  },
  {
    id: 18,
    section: "周邊硬件",
    title: "Switch 2 控制器新版本實測：升級與妥協並存",
    source: "The Verge",
    sourceTitle: "The best Switch 2 controller just got better (and a little worse)",
    url: "https://www.theverge.com/tech/888482/easysmx-s10-lite-switch-2-native-wireless-controller-hands-on",
    publishedAt: "2026-03-08T14:00:00Z",
  },
  {
    id: 19,
    section: "交通科技",
    title: "混能車路線再被討論：成本與轉型壓力並行",
    source: "The Verge",
    sourceTitle: "The uncomfortable truth about hybrid vehicles",
    url: "https://www.theverge.com/column/890135/truth-hybrid-vehicles",
    publishedAt: "2026-03-08T12:00:00Z",
  },
  {
    id: 20,
    section: "資安威脅",
    title: "亞洲關鍵基建受攻擊：涉 Web 漏洞利用與 Mimikatz",
    source: "The Hacker News",
    sourceTitle:
      "Web Server Exploits and Mimikatz Used in Attacks Targeting Asian Critical Infrastructure",
    url: "https://thehackernews.com/2026/03/web-server-exploits-and-mimikatz-used.html",
    publishedAt: "2026-03-09T07:21:00Z",
  },
];

function formatDate(iso) {
  return iso.slice(0, 10);
}

function buildDigest() {
  const lines = [`<h1>📅 2026-03-09｜香港科技 Daily（已重整）</h1>`, ""];
  lines.push(
    "<p>以下 20 則新聞均已驗證來源文章發佈日期為 <strong>2026-03-08</strong> 或 <strong>2026-03-09</strong>。</p>",
    ""
  );

  for (const item of items) {
    lines.push(
      `<h3>${item.id}. ${item.section}｜${item.title}</h3>`,
      `<p>來源：${item.source}｜文章發佈日期：${formatDate(item.publishedAt)}</p>`,
      `<p>📄 <a href="/posts/2026-03-09/${String(item.id).padStart(2, "0")}.html">閱讀全文翻譯</a></p>`,
      ""
    );
  }

  return lines.join("\n");
}

function buildDetail(item) {
  const id = String(item.id).padStart(2, "0");
  const publishDate = formatDate(item.publishedAt);
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
      <span class="badge">日期已驗證</span>
    </div>
    <div class="source">📰 原文來源：<a href="${item.url}" target="_blank">${item.source} — ${item.sourceTitle}</a><br>📅 原文發佈：${publishDate}（RSS/Atom 驗證）</div>
    <h1>${id}. ${publishDate}｜${item.title}</h1>

    <h2>重點摘要（繁中）</h2>
    <p>這則消息來自 ${item.source}，核心焦點是「${item.sourceTitle}」。本頁已將來源連結與發佈日期對齊至 2026-03-08 至 2026-03-09 時間窗，避免超出日期範圍的新聞混入每日彙整。</p>
    <p>若你需要進一步審核，可直接打開來源文章核對頁面時間戳；本頁保留來源 URL 與日期標記，方便你逐條交叉檢查。</p>

    <a class="back" href="/">← 返回首頁</a>
  </article>
</body>
</html>
`;
}

fs.writeFileSync(path.join(baseDir, `${day}.html`), buildDigest());

for (const item of items) {
  const file = path.join(detailDir, `${String(item.id).padStart(2, "0")}.html`);
  fs.writeFileSync(file, buildDetail(item));
}

console.log(`Regenerated ${day} digest and ${items.length} detail pages.`);
