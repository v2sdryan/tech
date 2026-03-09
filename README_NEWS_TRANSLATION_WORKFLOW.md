# News Translation Workflow (For LLM Agents)

This repo includes a reproducible flow to regenerate daily news pages with:
- verified source dates
- full translated article pages in zh-HK style

Current generator script:
- `scripts/regenerate-2026-03-09.js`

## Goal

Regenerate:
- digest page: `posts/2026-03-09.html`
- detail pages: `posts/2026-03-09/01.html` ... `20.html`

Requirements:
1. Every source link must be date-verified in the target window.
2. Every detail page should contain full translated body content, not short summary placeholders.

## Standard Steps

1. Update the source dataset in the generator script:
- title
- source
- URL
- `publishedAt`

2. Verify dates before generation:
- keep only sources with publication date in target range (example: `2026-03-08` to `2026-03-09`)
- use feed metadata (`pubDate`, `published`) when possible

3. Generate pages:
```bash
node scripts/regenerate-2026-03-09.js
```

4. Validate output quality:
```bash
# check paragraph depth
for f in posts/2026-03-09/*.html; do
  c=$(rg -o "<p>" "$f" | wc -l | tr -d ' ')
  echo "$f|$c"
done | sort
```

5. Validate links are reachable:
```bash
for f in posts/2026-03-09/*.html; do
  u=$(rg -o 'href="https?://[^"]+"' "$f" | head -n1 | sed 's/href="//;s/"//')
  code=$(curl -L -s -o /dev/null -w "%{http_code}" "$u")
  echo "$code|$f|$u"
done
```

Notes:
- Some sites return `405` to HEAD; use GET checks (`curl -L -s ...`) for reachability.
- If a source page is blocked or returns shell-only HTML, replace that source with another date-verified accessible source.

## Commit Convention

Use clear commit messages:
- `feat: generate full zh-hk translations for YYYY-MM-DD articles`
- `chore: regenerate YYYY-MM-DD news with date-verified links`

Then push to `main`.

## Agent Rules (Important)

1. Do not ship summary-only placeholders if user asked for full translation.
2. Keep source date window strict and explicit.
3. Preserve source URL + publication date in each detail page.
4. Prefer reproducible script changes over manual per-file edits.
