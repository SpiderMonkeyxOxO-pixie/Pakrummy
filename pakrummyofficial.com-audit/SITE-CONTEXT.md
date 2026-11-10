# Site context for pakrummyofficial.com audit

Read this first. It saves you re-deriving facts the coordinator already confirmed.

## Identity
- Production URL: https://pakrummyofficial.com (trailing slashes required — Astro `trailingSlash: 'always'`)
- Local repo: D:\PakrummyOfficial (Astro 5, static output, already synced to origin/main as of 2026-11-10)
- Full URL list (64 pages, confirmed live via sitemap-0.xml): D:\PakrummyOfficial\pakrummyofficial.com-audit\url-list.txt
- Source pages live in `src/pages/` (route files) and `src/content/{blog,guides,updates}/` (Markdown collections). Reading source directly is often faster/more reliable than re-fetching rendered HTML for title/meta/schema checks, but always confirm against the LIVE page for anything render- or deploy-dependent.

## Business type
Informational / "official information" affiliate-adjacent site for a real-money rummy/card-games Android app (Pak Rummy, actual game at pakrummy.com — a separate domain this site does not control). Topics: app download/verification, deposits/withdrawals via Easypaisa/JazzCash, KYC, game rules (rummy, teen patti, poker, aviator, crash, ludo, slots), responsible gaming, legal status in Pakistan. This is **YMYL-adjacent** (real-money gaming + payment guidance) — treat E-E-A-T, author attribution, factual-accuracy framing, and trust/disclaimer signals as high-stakes, not cosmetic.

Site positioning (verbatim from src/config/site.ts): "PakRummyOfficial.com is the official information, download-verification, and support website of the Pak Rummy team for players in Pakistan. The game itself is at pakrummy.com. This website does not process deposits, withdrawals, or account data."

Notable: the codebase has a `Verified<T>` fact-wrapper convention (see src/config/site.ts) — unverified operator facts render as "Not yet publicly verified" rather than being guessed. This is a deliberate trust design; don't flag unverified-fact disclosures as a content weakness, they're intentional.

## Known findings already surfaced by the coordinator (don't re-discover, just verify/extend)
1. **Blog publishing cadence has stalled.** A VPS cron (`scripts/publish-next-post.sh`) promotes one pre-written post/day from `scheduled-posts/` to `src/content/blog/`. It published 12 posts daily from 2026-10-08 to 2026-10-19, then `scheduled-posts/` emptied and nothing has published since. Today is 2026-11-10 — **22 days with no new content**, despite prior cadence. Worth flagging as a content-freshness / consistency risk.
2. **robots.txt** explicitly blocks AI training crawlers (GPTBot, ClaudeBot, Google-Extended, CCBot, Bytespider, etc. — full `Disallow: /`) via a Cloudflare `Content-Signal: search=yes,ai-train=no,use=reference` header, while allowing normal search and (per the signal) "reference" use. Standard search crawlers are fully allowed. This is a deliberate choice, not a misconfiguration — evaluate its effect on AI Search / GEO visibility (seo-geo, seo-agentic) rather than flagging it as broken.
3. **llms.txt exists** at /llms.txt (generated from `src/pages/llms.txt.ts`), last-updated stamp 2026-08-17 (stale relative to content added since — the file lists sections but may not enumerate all 12 new blog posts; verify).
4. **Sitemap has no `<lastmod>` on any URL** (only `<loc>` + `changefreq>weekly<`) — confirmed via live fetch of sitemap-0.xml. 64 URLs total, single-file (no index sharding needed yet).
5. Prior SEO work already done (see git log): titles/descriptions rewritten for SEO (2026-10-04), mobile LCP improved via inlined CSS + responsive hero images + lightweight icons (2026-10-04), sitewide breadcrumb `@id` / duplicate-entry bugs fixed (2026-08-21). Don't re-flag these as if undiscovered — check whether they actually hold up site-wide instead.
6. GA4 measurement ID is `G-CYNZS7ZZG9` (committed in source, not a secret).

## Credentials available this run (checked via claude-seo doctor)
Run scripts with: `CLAUDE_SEO_PYTHON="C:\Users\R\AppData\Local\Programs\Python\Python312\python.exe"` exported first (default `python` on PATH is 3.15, which breaks the managed runtime's deps) — or just call `"$HOME/.claude/skills/seo/scripts/claude-seo" run <script>.py ...` after exporting that var once per shell.

- **Google Search Console API**: OK (service account `allyonosites@sound-berm-506014-e9.iam.gserviceaccount.com`, confirmed by user to have Full access on the GSC property and GA4 Viewer access)
- **GA4 Data API v1beta**: OK (same service account)
- **Google Indexing API v3**: OK (same service account) — read-only use only; do not submit/request indexing without asking the user first, that's a write action against their property
- **PageSpeed Insights v5 / CrUX / CrUX History**: MISSING (no `GOOGLE_API_KEY`). Fall back to local Lighthouse (lab data) for Core Web Vitals; note in the report that field data (CrUX) was unavailable and why.
- **Matomo**: not configured (tier 0) — skip, GA4 is the analytics source of truth here.
- **Bing Webmaster Tools**: credentials configured but verified-site list returned is for a *different* portfolio of domains (allyonoarcade.com, allyonoofficial.com, etc.) — pakrummyofficial.com is NOT in that verified list. Don't assume Bing data is available for this domain.
- **Moz**: not configured. **Common Crawl web graph + verification crawler**: available (tier 0 Basic backlinks).

## Output contract
Write your findings to `D:\PakrummyOfficial\pakrummyofficial.com-audit\findings\<your-category>.md` (create the `findings/` dir if needed — it should already exist). Use the category filename the orchestrating skill expects (e.g. `technical.md`, `content.md`, `schema.md`, `performance.md`, `visual.md`, `geo.md`, `agentic.md`, `sxo.md`, `backlinks.md`, `cluster.md`, `google.md`). Be evidence-specific: cite exact URLs, exact line/tag content, exact measured numbers. Write a partial file early and overwrite with the complete version before you finish, in case you run long.
