# Performance / Core Web Vitals Audit — pakrummyofficial.com

**Date:** 2026-11-10
**Method:** Lighthouse 13.6.0 CLI (local), mobile emulation, default simulated throttling (Moto G Power-class device, slow 4G simulation), Node 22.23.2. **No CrUX/PSI field data available this run** (no `GOOGLE_API_KEY` configured — confirmed via SITE-CONTEXT.md credential table). All numbers below are **lab data**, not real-user p75 field data. TBT (Total Blocking Time) is used as the lab proxy for INP per the audit brief, since neither Lighthouse nor local tooling measures INP directly without a live user interaction trace.

Pages tested: homepage (`/`), `/games/` hub, `/games/rummy/` (representative game page), `/download/`, and `/blog/why-is-my-withdrawal-pending/` (representative blog post). Raw Lighthouse JSON retained at `C:\Users\R\AppData\Local\Temp\claude\78c710bd16e8d678\22388951-7cca-4e89-94e5-f7133ecfa65e\scratchpad\lh\*.json` for this session.

## Summary scorecard (Lighthouse Performance, mobile, lab)

| Page | Perf score | LCP | CLS | TBT (INP proxy) | FCP |
|---|---|---|---|---|---|
| `/` (homepage) | 88 | **1.59s** (good) | **0** (good) | **451ms** (needs improvement) | 1.59s |
| `/games/` | 100 | 0.95s (good) | 0 (good) | 48ms (good) | 0.95s |
| `/games/rummy/` | 99 | 0.92s (good) | 0 (good) | 127ms (good) | 0.92s |
| `/download/` | 100 | 0.95s (good) | 0 (good) | 63ms (good) | 0.95s |
| `/blog/why-is-my-withdrawal-pending/` | 95 | **2.95s** (needs improvement, borderline good) | 0 (good) | 48ms (good) | 0.91s |

**Core Web Vitals pass/fail (lab-based estimate, real p75 field data unavailable):**
- LCP: 4/5 pages comfortably "good" (≤2.5s); the blog-post template is borderline "needs improvement" at 2.95s.
- CLS: **0 on every page tested** — genuinely excellent, confirms the font-display:optional + explicit width/height strategy is working sitewide.
- INP/TBT: good on 4/5 pages; homepage TBT (451ms) sits in "needs improvement" territory (200–600ms), driven almost entirely by third-party script execution, not first-party code.

## Finding 1 — Known fix #5 (mobile LCP, 2026-10-04) holds on the homepage, but does NOT extend to article pages

Verified directly against live HTML (`curl https://pakrummyofficial.com/`): the hero image renders as
```html
<img src="/_astro/pak-rummy-loading-screen.BKD4a4nd_Z2eMJ3h.webp"
     srcset="...290w, ...380w, ...580w, ...760w"
     sizes="(min-width: 900px) 380px, 290px"
     loading="eager" fetchpriority="high" decoding="async" width="480" height="614" ...>
```
This is a genuinely responsive, priority-hinted image (via Astro's `<Image>` component in `src/components/Hero.astro`). Lighthouse's `lcp-discovery-insight` audit reports `notApplicable` for the homepage, confirming the LCP element is text (the `<h1>`), not the image — it paints at the same instant as FCP (1.59s) because the critical CSS is inlined (`inlineStylesheets: 'always'` in `astro.config.mjs`) and fonts use `font-display: optional` so text never waits on a web-font swap. **This part of the prior fix is real and working, not a stale claim.**

However, the fix was scoped to the homepage hero only. **All 16 article-collection pages** (`src/pages/blog/[slug]/`, `src/pages/guides/[slug]/`, `src/pages/updates/[slug]/` — all three routed through the shared `src/layouts/ArticleLayout.astro`) use a plain, non-responsive `<img>` for the hero/share image:
```html
<!-- src/layouts/ArticleLayout.astro lines 92-99 -->
<img class="article__hero" src={image} alt={imageAlt ?? title} width="1200" height="630" loading="eager" />
```
No `fetchpriority="high"`, no `srcset`/responsive widths (the full 1200×630 OG-card asset — ~36KB webp — is shipped to every viewport including mobile), and it is not processed through `astro:assets`. Measured on `/blog/why-is-my-withdrawal-pending/`: FCP is 0.91s but LCP is **2.95s** — a 2.0s gap. Lighthouse's `lcp-discovery-insight` audit scores this **0/fail**, flagging specifically: `fetchpriority=high should be applied: false` (the other two checks — discoverable in initial HTML, not lazy-loaded — pass). The LCP breakdown audit attributes the delay to `resourceLoadDuration` (327ms) and `elementRenderDelay` (102ms) in the observed trace, which the simulated-throttling model then scales up heavily because the image isn't hinted as high priority.

**Impact:** every blog post, guide, and update page (16 of 64 URLs, ~25% of the site, and the pages Google is most likely to source for informational queries) renders its LCP element ~1.4–2s slower than the homepage pattern already proves is achievable on this same codebase.

**Fix (low effort, same pattern already proven on the homepage):** in `src/layouts/ArticleLayout.astro`, either (a) add `fetchpriority="high"` to the `<img class="article__hero">` tag — a one-line change — or (b) better, migrate it to Astro's `<Image>` component with `widths`/`sizes` like `Hero.astro` already does, so mobile doesn't download the full 1200×630 share-card asset as its in-page hero. Expected impact: LCP on article pages should drop from ~2.9s to roughly 1.5–1.8s range, matching the homepage's demonstrated pattern.

## Finding 2 — Homepage TBT (451ms) is "needs improvement," driven by third-party scripts, not first-party code

Homepage `mainthread-work-breakdown`: scriptEvaluation 923ms, styleLayout 604ms, other 928ms, paintCompositeRender 407ms (simulated-throttling totals). `bootup-time` attribution:

| Script | Total main-thread time |
|---|---|
| `gtag/js?id=G-CYNZS7ZZG9` (GA4, Google Tag Manager entity) | 607ms |
| `pakrummyofficial.com/` (first-party, incl. inline scripts + style/layout) | 1709ms* |
| Unattributable | 480ms |
| `static.cloudflareinsights.com/beacon.min.js` (Cloudflare Web Analytics) | 169ms |

*\*`bootup-time`'s "total" bucket for the document includes style/layout work, not pure scripting (scripting sub-value is only 131ms) — most of the 1709ms is rendering cost from simulated CPU throttling on the richest page template (hero + game grid + status panel + FAQ), not a JS bug.*

Two long tasks attributed directly to `gtag/js` (321ms + 267ms = 588ms combined) fire at ~3.2–3.8s, i.e. **after** LCP (1.59s) but squarely in the window where a real user is likely to start tapping nav links or the download CTA — this is exactly the kind of main-thread contention that inflates real-world INP even though it doesn't touch LCP. GA4 is loaded via `gtag.js` (async, not GTM container — confirmed in `src/layouts/BaseLayout.astro` lines 118-128), which is the lighter of the two options already, but `gtag.js` itself is a 540KB (181KB transferred) third-party script and Lighthouse's `unused-javascript` audit estimates ~74KB of it goes unused on this page.

By contrast, `/games/`, `/games/rummy/`, `/download/`, and the blog post all show low TBT (48–127ms) despite loading the **same** GA4 tag — because they're lighter page templates with less style/layout work for the simulated CPU throttle to inflate. This confirms the GA4 tag itself is not inherently catastrophic; it's the homepage's larger DOM/CSS surface combined with the tag's execution timing that pushes TBT into "needs improvement."

**Fix:** no first-party main-thread code is the culprit, so there isn't a quick "break up a long task" fix available here. Options, roughly in order of effort:
1. Nothing structural is broken; if INP ever shows up as a problem in real CrUX data (unavailable this run — recommend re-checking once a `GOOGLE_API_KEY` is configured), the first lever is deferring/delaying GA4 initialization slightly (e.g. firing it on first user interaction or after `window.load` + a short idle delay) rather than immediately on parse — a common pattern for sites carrying real-money/YMYL compliance tracking requirements where GA4 can't simply be removed.
2. Consider whether the Cloudflare Web Analytics beacon (`static.cloudflareinsights.com/beacon.min.js`, 169ms) is intentional — it appears to be a Cloudflare-injected script (via the Cloudflare dashboard "Web Analytics" toggle) rather than something in the Astro source; if it's duplicating what GA4 already reports, disabling it in the Cloudflare dashboard removes ~170ms of main-thread work sitewide for no loss of first-party insight.

## Finding 3 — Stray large files in the repo root are confirmed NOT served on any live page (false alarm, but worth cleaning up)

- `Pak.png` (3,235,889 bytes / 3.2MB) and `pakrummy_85NU87SXTZ8.apk` (38,727,077 bytes / 36.9MB) sit in the repo root but are **both gitignored** (`.gitignore` lines 28 and 36) and **not referenced anywhere in `src/`** (checked via full-repo grep for `Pak.png` and `.apk`/the random-suffix filename). Live-fetched the homepage and `/download/` HTML and grepped for both filenames — zero matches. These are confirmed stray local artifacts (not deployed, not linked, not a CWV risk) — no action needed for performance, but flag to the technical/content agent as repo hygiene (delete or leave gitignored, your call).
- The **actual** served APK — `public/downloads/pakrummy.apk`, linked from `/download/` via `SITE.officialDownloadUrl` in `src/config/site.ts` line 80 — is real, live, and large: **38,727,077 bytes (36.9MB)**, confirmed via `curl -I https://pakrummyofficial.com/downloads/pakrummy.apk`. This is **not a page-weight/CWV problem** — it's a user-initiated download link, not a page-render resource, so it has zero effect on LCP/CLS/INP for `/download/` itself (that page's own Lighthouse run shows LCP 0.95s, perf score 100). It is, however, well-configured for a large download: `Accept-Ranges: bytes` is honored (tested with a `Range` request → got `206 Partial Content`, so resumable downloads work on flaky mobile connections), `Cache-Control: max-age=14400` + `cf-cache-status: HIT` confirm it's served from Cloudflare's edge cache rather than origin on every request. No fix needed here.

## Finding 4 — WebP adoption is real and consistent, with a few legitimate non-WebP exceptions

Confirmed by inspecting `public/images/` directly (26 `.webp` files vs. 8 non-webp): every page-content image I could trace to an actual `<img>`/`<Image>` usage in `src/pages` and `src/components` is `.webp` **except**:
- `aviator-game-art.jpg` (474×284, 9.6KB) — used on `/games/aviator/` only.
- `crash-game-art.png`, `poker-game-art.png`, `rummy-game-art.png` (all 256×256, 27–31KB each, 8-bit palette PNGs) — used on `/games/crash/` and `/games/poker/` respectively. Note: despite the filename, `rummy-game-art.png` is **not actually used** on `/games/rummy/` — that page has no hero/art image at all (verified: no `<img>`/`<Image>` tag in `src/pages/games/rummy/index.astro`), so it's dead weight sitting in `public/images/` rather than a live-page performance issue.
- `easypaisa-logo.png`, `jazzcash-logo.png` (592×154, ~5-6KB) on `/easypaisa-jazzcash/` — small payment-brand logos, fine as PNG at this size.
- `pak-rummy-app-icon.png` (190×190, 12KB) — used for favicon/apple-touch-icon/OG fallback, where PNG is the correct/required format (favicons and some OG consumers don't reliably support WebP), not a mistake.
- `og-default.png` (400×400, 151KB) — same rationale (OG image, needs broad crawler/platform compatibility); 151KB is on the large side for a 400×400 PNG but this is a social-share asset fetched by crawlers/link-unfurlers, not by browsers rendering the page, so it doesn't affect CWV.

**Net assessment:** the "webp usage already looks good" note in SITE-CONTEXT.md holds up — the handful of non-webp files are either genuinely tiny (<31KB) or deliberately kept in a universally-compatible format for favicon/OG use, not an oversight. Only the unused `rummy-game-art.png` is worth a cheap cleanup (delete or wire it into `/games/rummy/` if a hero image is actually wanted there).

## Finding 5 — Font loading strategy: self-hosted, subsetted, `font-display: optional`, no explicit preload needed

`src/styles/global.css` (imported once in `BaseLayout.astro`, and inlined into every page via `inlineStylesheets: 'always'`) defines 4 `@font-face` rules for `@fontsource-variable/space-grotesk`, `@fontsource-variable/plus-jakarta-sans`, and two weights of `@fontsource/ibm-plex-mono` — all self-hosted (no Google Fonts CDN round-trip), all Latin-subsetted via explicit `unicode-range`, and all set to `font-display: optional` (a deliberate choice documented in a code comment: trades an occasional fallback-font first paint for **zero font-swap layout shift**). This is corroborated by the measured CLS of 0 on every page tested.

Because the `@font-face` rules live in the inlined `<style>` block in `<head>` (not a separate stylesheet), Chrome discovers and fetches the fonts the moment it parses `<head>` — confirmed in the homepage's `network-requests` trace, where both variable-font files get `priority: VeryHigh` and finish downloading by ~546ms, with **no explicit `<link rel="preload" as="font">` tag present or needed**. This is a sound, low-maintenance strategy; no action recommended.

## Finding 6 — Third-party script impact (GA4)

- GA4 (`G-CYNZS7ZZG9`) is loaded via the lightweight `gtag.js` pattern (`async` script tag + inline config), **not** a full GTM container — confirmed in `BaseLayout.astro`: the GTM branch (`gtmContainerId`) is dead code here since only `ga4MeasurementId` is configured. This is the better of the two common options for this use case.
- Transfer cost: 181KB (gtag.js) + a ~561-byte GA4 collect beacon per pageview. This is the single largest script on every page tested and the dominant contributor to homepage TBT (see Finding 2), but it loads `async` and does not block LCP or FCP on any page tested (its long tasks fire at 3.2s+, well after first paint everywhere).
- A separate Cloudflare Web Analytics beacon (`static.cloudflareinsights.com/beacon.min.js`) also runs on every page (169ms main-thread time on homepage) — this is injected by Cloudflare (dashboard-level "Web Analytics" toggle), not something in the Astro source tree. Worth a business decision on whether it's redundant with GA4.

## Finding 7 — Server response time and TTFB are excellent on every page tested

Lighthouse's `server-response-time` audit (root-document TTFB) measured 67–77ms on all five pages tested — comfortably under the 800ms "good" threshold, and well under it. This is a Cloudflare-fronted static Astro build, so this result is expected and not a concern; no CrUX TTFB field data was available to cross-check against real-world network conditions, but lab TTFB this low leaves very little room for it to be the bottleneck in the field either.

## Resource/byte-weight summary (mobile, lab)

| Page | Total transfer weight |
|---|---|
| `/` | 384 KiB |
| `/games/` | 327 KiB |
| `/games/rummy/` | 284 KiB |
| `/download/` | 300 KiB |
| `/blog/why-is-my-withdrawal-pending/` | 320 KiB |

All five pages are well under the ~1-2MB mobile-page-weight budgets commonly used as a rule of thumb; no page tested is anywhere close to being weight-constrained. The 3.2MB `Pak.png` and 38.7MB stray `.apk` in the repo root (Finding 3) are **not** counted here because they are not served.

## Prioritized recommendations

1. **(High impact, low effort)** Add `fetchpriority="high"` to the hero `<img>` in `src/layouts/ArticleLayout.astro` (or migrate it to Astro's `<Image>` component with responsive `widths`, matching `Hero.astro`'s already-proven pattern). This affects all 16 blog/guide/update pages and should cut LCP on those templates from ~2.9s to an estimated ~1.5-1.8s, moving the blog-post template solidly into "good" territory instead of borderline.
2. **(Medium impact, verification-dependent)** Once a `GOOGLE_API_KEY` is available, re-run this audit against CrUX field data specifically for INP — lab TBT suggests the homepage is the one page at risk of "needs improvement," but only real p75 field data (not available this run) can confirm whether GA4's post-LCP long tasks actually degrade real-user INP, since lab TBT is only a proxy.
3. **(Low impact, business decision)** Evaluate whether the Cloudflare Web Analytics beacon running alongside GA4 is intentional/needed; if not, disabling it in the Cloudflare dashboard removes ~169ms of main-thread work sitewide at zero code-change cost.
4. **(Cosmetic/cleanup, no CWV impact)** Delete or gitignore-confirm the stray `Pak.png` and `pakrummy_85NU87SXTZ8.apk` in the repo root (already gitignored and unreferenced — not a live-site issue, just repo hygiene); also consider deleting the unused `public/images/rummy-game-art.png` or actually using it on `/games/rummy/`.
5. **(No action needed — explicitly verified healthy)** CLS (0 sitewide), font loading strategy, homepage LCP, WebP adoption, TTFB, and the `/download/` APK's CDN caching/range-request support are all in good shape and don't need further work this cycle.
