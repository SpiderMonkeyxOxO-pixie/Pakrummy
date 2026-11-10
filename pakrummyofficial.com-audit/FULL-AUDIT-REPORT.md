# Full SEO Audit — pakrummyofficial.com

**Audit date:** 2026-11-10
**Scope:** 64 live pages (full sitemap), Astro 5 static site, source-verified against `D:\PakrummyOfficial`
**Method:** 12 specialist passes (technical, content/E-E-A-T, schema, sitemap, performance, visual, GEO, agentic, SXO, backlinks, content clusters, Google GSC/GA4), each independently reading live pages, source code, and available API data.

---

## Executive Summary

### SEO Health Score: 68 / 100

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Technical SEO | 22% | 84 | 18.5 |
| Content Quality | 23% | 52 | 12.0 |
| On-Page SEO | 20% | 58 | 11.6 |
| Schema / Structured Data | 10% | 82 | 8.2 |
| Performance (CWV) | 10% | 75 | 7.5 |
| AI Search Readiness | 10% | 60 | 6.0 |
| Images | 5% | 78 | 3.9 |
| **Total** | | | **~68** |

**Business type:** Informational / "official information" site for a real-money rummy/card-games Android app (Pak Rummy — the actual game lives at the separate domain pakrummy.com, which this site does not control). **YMYL-adjacent**: real-money gaming + payment guidance, so trust, factual accuracy, and author/E-E-A-T signals carry outsized weight.

### The one-sentence version
The site has unusually strong technical and trust-design bones (static rendering, clean schema, a genuine Verified/Unverified fact framework, no ads/popups) — but that foundation is undermined by self-contradicting trust claims, a 22-day-stalled content pipeline whose output isn't linked to anything, and a fundamental mismatch between what people are searching for and what the site gives them.

### Top 5 Critical/High issues
1. **`/withdrawal/` contradicts itself** (confirmed independently by 2 agents): intro says processing time is unconfirmed, the fact table on the same page says "5–10 minutes — Verified." An AI answer engine or a skeptical user can cite either.
2. **Operator identity is unresolved sitewide.** The Oct 4 rewrite repositioned the site as "official," but `/official-domains/`, `/customer-service/`, `/download/`, and the privacy-policy meta description still say the operator's identity/domains aren't confirmed. The site's own scam-checklist content calls this exact gap a red flag.
3. **16 blog posts are indexed but functionally invisible**: 0 clicks in 90 days, 13 of 16 posts with 0 impressions. Root cause is structural, not technical — zero hub pages (games, deposit, withdrawal, safety, account-verification) link down to any post, and the homepage blog widget shows only 1 post (`slice(0,1)`).
4. **Real search demand is being missed.** 17% of all site impressions are people trying to reach the actual game (pakrummy.com / pakrummy.con typos), converting at only 4.8% CTR because the homepage has no clear path onward. Meanwhile the two "withdrawal charges" blog posts — which should be easy wins — have 0–3 impressions because they contain no rupee figures or fee tables, which is what actually ranks for those queries.
5. **Blog publishing cron ran dry.** All 12 scheduled posts published Oct 8–19 as designed; `scheduled-posts/` has been empty since, so there's nothing left to resume automatically. 22 days of silence so far.

### Quick wins (cheap, high-value)
- Wire the sitemap's already-computed `dateModified` logic into `astro.config.mjs`'s `serialize()` — the data exists (`ArticleLayout.astro`), it's just not passed through. Fixes known finding of zero `<lastmod>` across all 64 URLs.
- Add a blog section to the human-readable `/sitemap/` page (pattern already exists for guides/updates — one copy-paste away).
- Fix `getArticleSchema()` to reference the existing Organization `@id` instead of asserting the "Editorial Team" as a schema.org `Person` (contradicts `/authors/`'s own disclosure).
- Port the `Hero.astro` `<Image>`/`fetchpriority` pattern to `ArticleLayout.astro` — blog posts measure 2.95s LCP vs. 0.95–1.6s on every other template, because the Oct 4 LCP fix never reached the article layout.
- Add one visible link from the homepage/`/register-login/` to pakrummy.com above the fold — captures the 17% of impressions currently landing with no path forward.
- Investigate why `/card-rummy-vs-pak-rummy/` is "unknown to Google" despite being in the sitemap and internally linked.

---

## Technical SEO — 84/100
*Full detail: `findings/technical.md`*

**No Critical issues.**

**High:**
- No sitewide security headers — `public/_headers` only covers 4 narrow paths (llms.txt, robots.txt, APK content-type, `/404`). No CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, or Permissions-Policy anywhere. (CSP will need to account for inline GA4/GTM scripts in `BaseLayout.astro`.)

**Medium:**
- `llms.txt` is fully hardcoded (`src/pages/llms.txt.ts`), not generated from content collections — confirmed live to list **0 of 16 blog posts, 0 of 3 guides**, and omits `/card-rummy-vs-pak-rummy/` entirely (added Oct 8, internally linked from 3 pages, but the file was last touched Oct 4). "Last updated: 2026-08-17" is a literal string, not computed.
- The human `/sitemap/` page links guides/updates individually via `getCollection()` but only links the `/blog/` index, not individual posts.
- No IndexNow implementation anywhere.

**Low:** `_headers`' `/404` X-Robots-Tag rule doesn't fire on arbitrary 404 paths (harmless — `404.astro` independently emits the correct noindex meta tag); HSTS lacks `includeSubDomains`/`preload`.

**Confirmed good:** robots.txt AI-crawler block is deliberate and correctly structured; sitemap has exact 1:1 coverage with the live site (zero missing/orphaned URLs); canonicals and trailing-slash handling are consistent across all 64 pages with zero duplicate titles/descriptions; clean single-hop redirects; real 404 handling; fully static build with zero hydration directives; CWV-friendly source signals (eager/responsive hero images, inlined critical CSS, `font-display: optional`).

**Not completed this pass** (flagged by the agent, turn-budget limited): exhaustive live status-code crawl of all 64 URLs (sampled ~4); full structured-data validation across all pages (schema sub-agent covers this instead).

---

## Content Quality & E-E-A-T — 52/100 (E-E-A-T weighted: 45/100)
*Full detail: `findings/content.md`*

Sub-scores: Experience 55, Expertise 40, Authoritativeness 30, Trustworthiness 55, AI citation readiness 68.

**Critical:**
- **The site contradicts itself about who runs it.** The Oct 4 "official site" rewrite (commit `846624a`) touched 13 files but missed others — `/customer-service/`, `/official-domains/`, `/download/`, and the `/privacy-policy/` meta description all still say the operator's identity/domains aren't confirmed. The site's own scam-checklist post treats a missing operator identity as a red flag — Pak Rummy fails its own test.

**High:**
- `/withdrawal/` self-contradiction (see Executive Summary #1).
- No named individual authors anywhere — every article is bylined "PakRummyOfficial.com Editorial Team," not linked to `/authors/` (an 87-word placeholder), while the article schema types the team as a schema.org `Person`.
- Legal pages (`/terms/`, `/privacy-policy/`, `/cookie-policy/`, `/legal-status/`) have read "Draft template pending legal review" for 85 days.
- Zero external links anywhere on the site except one to pakrummy.com — no cited sources on any of the 20 articles.
- The Easypaisa and JazzCash "withdrawal charges" posts contain **no figures at all** — they don't answer the question in their own titles.

**Thin pages:** `/deposit/` 170 words, `/withdrawal/` 217, `/bonuses/` 205, `/about/` 160, `/authors/` 87, `/updates/` 59. All 16 blog posts run 414–837 words (below a 1,500-word blog floor).

**Freshness:** confirms the 22-day stall; homepage hard-codes "Last reviewed 17 August 2026"; `/terms/` was edited Oct 4 but still displays "Last revised 17 August"; `/updates/` has only its original launch entry despite promising an ongoing log.

**Trust-framing tension:** "Not yet publicly verified" reads as reassuring on app/support facts (explains what was checked and how) but as evasive on payment facts — unverified cells show the same message twice (badge + text), verified cells don't show when/how they were verified, and payment methods/limits remain unconfirmed 85 days post-launch.

**Factual error found:** the 13-card Rummy walkthrough's "final declared hand" totals 12 cards, not 13.

**Duplicate-topic overlap (not duplicate content, but overlapping intent):** Teen Patti ×4 URLs, Rummy ×4, Aviator/Crash ×4, Poker ×2, Ludo ×2 — several pages answering the same underlying question.

**Readability:** worst exactly where anxious readers need it most — payment/KYC posts measure grade 10.3–12.3 against an ~8.5 sitewide average; `/games/` hub measures grade 14.4.

---

## On-Page SEO — 58/100 (estimated composite; no single dedicated pass — synthesized from technical, content, and cluster findings)

**Good:** titles/meta descriptions are unique across all 64 pages, non-templated, rewritten for SEO on Oct 4.

**Weak:** internal linking is the dominant problem — no hub page links down to its supporting blog content (see Content Clusters below), the homepage blog widget shows only 1 of 16 posts, and the HTML sitemap omits all blog posts. Several game pages directly compete with their own supporting blog posts for the same target keywords (see Clusters).

---

## Schema / Structured Data — 82/100
*Full detail: `findings/schema.md`*

**Confirmed holding:** the Aug 21 BreadcrumbList `@id`/duplicate-entry fix verified live and in source across all page archetypes — no duplicate or dangling `@id`s anywhere; JSON-LD syntax is valid sitewide (HTTPS context, ISO 8601 dates, absolute URLs); no fabricated/unsupported schema types (no fake Review/AggregateRating, no HowTo/FAQPage bolted onto content that doesn't warrant it — a correct restraint, not a gap).

**New Medium/High finding:** every Article/BlogPosting (20 pages) declares `"author": {"@type": "Person", "name": "...Editorial Team"}` — a factual mismatch with `/authors/`'s own statement that content has no individual bylines. Fix: reference the existing Organization `@id` instead of inventing a Person.

**New finding (via cluster agent's Rich Results spot-checks):** BreadcrumbList items show as "Unnamed item" in Google's Rich Results Test — distinct from the already-fixed `@id` bug; each `ListItem` likely needs an explicit `name` property.

**Positive pattern:** `SoftwareApplication` on `/download/` only renders once `officialDownloadUrl`/`appVersion`/`appPackageName` are all independently verified — every value traces to a confirmed fact in `site.ts`. Correctly omits `offers`/`aggregateRating` rather than fabricate them.

**Minor:** 5 of 20 article pages lack an `image` property (guides/updates content schemas don't define an image field at all).

**Cross-referenced with agentic audit:** the `SoftwareApplication` schema omits the SHA-256 checksum and permissions list that exist in the HTML fact table — an agent reading only structured data can't recover them. Add as `additionalProperty` `PropertyValue` entries, gated on verified status like the existing fields.

---

## Sitemap — validated structurally sound, one real gap
*Full detail: `findings/sitemap.md`*

- Exact 1:1 match between sitemap and live/source pages — zero missing, zero orphaned.
- **Zero `<lastmod>` entries anywhere** — root cause: `astro.config.mjs`'s sitemap integration passes only `{changefreq, filter}`, no `serialize()`. The data to fix this already exists (`dateModified` computed in `ArticleLayout.astro`); for the 43 plain `.astro` pages with no frontmatter date, the agent recommends deriving lastmod from git commit history rather than filesystem mtime (spot-checked: git history reflects real edits; build-time mtime would wrongly stamp every page with every deploy date).
- `changefreq: weekly` is hardcoded identically on all 64 URLs — Google ignores it; safe to remove, not worth more effort.
- No scaling concerns — well under sharding thresholds, growth is editorially capped by design (per the site's own content-inventory doc).

---

## Performance (Core Web Vitals) — 75/100 (lab data only — no PageSpeed/CrUX API key available)
*Full detail: `findings/performance.md`. Method: local Lighthouse 13.6.0, mobile, simulated throttling, 5 representative URLs.*

- **The Oct 4 LCP fix is real but incomplete.** Homepage hero: `fetchpriority="high"` + responsive `srcset`, LCP is actually text (1.59s), CLS 0. **But the fix never reached `ArticleLayout.astro`**, which serves all 16 blog/guide/update pages (~25% of the site) via a plain `<img>` with no `fetchpriority` or responsive sizing — shipping a full 1200×630 share-image as the mobile hero. Measured blog-post LCP: **2.95s** ("needs improvement") vs. 0.95–1.6s everywhere else. Single highest-impact performance fix available.
- Stray repo-root files (`Pak.png` 3.2MB, `pakrummy_85NU87SXTZ8.apk` 38.7MB) confirmed **not live** — gitignored, unreferenced — repo hygiene only, zero performance impact.
- The real served APK (36.9MB, `public/downloads/pakrummy.apk`) is well-handled: Cloudflare edge-cached, range-requests supported, zero CWV impact since it's a click-through download.
- Homepage TBT (451ms, "needs improvement") traced to GA4's `gtag.js` (607ms main-thread, two long tasks ~3.2–3.8s post-load) plus a Cloudflare Web Analytics beacon running alongside it — worth checking whether the two overlap/duplicate.
- WebP adoption is genuinely good (26 WebP vs. 8 justified exceptions). One dead asset: `rummy-game-art.png` unused anywhere (`/games/rummy/` has no hero image).
- Font loading and TTFB (67–77ms sitewide) are in good shape, no action needed.

---

## Visual / Mobile Rendering
*Full detail: `findings/visual.md`. 24 screenshots captured across 4 viewports × 6 pages.*

**Overall:** genuinely trust-oriented YMYL design — no ads, no popups, no autoplay, persistent 18+ disclaimer, consistent editorial bylines. Issues found are polish gaps on a sound foundation, not evidence of a templated low-trust site.

- Mobile above-the-fold is good on the pages checked (H1 + value prop + primary CTA + trust badges, no scroll needed).
- **CTA gap on mobile:** desktop nav has a persistent "Download" button; mobile/tablet only shows a hamburger, with no Download link in the mobile header region. The money-adjacent `/blog/why-is-my-withdrawal-pending/` has no contextual CTA either.
- Verified/Unverified convention renders cleanly and convincingly (confirmed on `/bonuses/`, `/games/rummy/`) — no broken/placeholder-looking rendering. One inconsistency: `/games/` flags Ludo as weaker-evidence in text, but all 7 game cards show an identical "Confirmed" badge with no visual tier distinction.
- **Layout bugs:** a floating chat/Telegram widget overlaps the "Version 1.1.2" trust badge on mobile homepage, inside the no-scroll hero viewport; a floating hero badge clips at the 768px tablet breakpoint specifically; mobile hamburger button measures ~43.5×43.5 CSS px, just under the 44–48px touch-target guideline.
- **Visual trust-design tension:** the homepage "Status Center" and verification boxes show "Last checked 2026-08-17" while claiming to update "the moment we verify something new" — visually implies live freshness but is ~3 months stale, which is the content-cadence-stall finding showing up as a UI-trust issue specifically.

---

## AI Search Readiness (GEO + Agentic) — composite ~60/100
*Full detail: `findings/geo.md` (GEO Readiness Score: 58/100) and `findings/agentic.md`*

**GEO sub-scores:** Citability 68, Structural Readability 72, Multi-Modal 40, Authority & Brand 35, Technical Accessibility 70. **Platform estimates:** Google AIO 60, Perplexity 62, Claude search 60, ChatGPT Search 52, Bing Copilot 45, Gemini app 25.

- **`llms.txt` staleness is worse than initially suspected:** the generator never reads the blog/guides/updates collections at all — missing all 16 blog posts (not 12), all 3 guides, and 2 standalone pages. It also calls `/withdrawal/` and `/deposit/` facts "verified" when `site.ts` marks the underlying values unverified — the file **contradicts the site's own verified-fact rules**.
- **The AI-training block is enforced at the Cloudflare edge, not just robots.txt** — GPTBot/ClaudeBot/CCBot/Amazonbot get real HTTP 403s, even on `/llms.txt` itself. Search and user-triggered agent bots (OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude-SearchBot, Google-Agent, etc.) correctly get 200 — **this separation is deliberate and already correctly implemented**, not a misconfiguration. One real gap: the `Content-Signal` header only lives in the wildcard robots.txt group, so the 5 explicitly-named blocked bots never see it (low impact — they're already blocked by a stronger `Disallow: /`).
- **The trade-off analysis argues against the full training block as currently scoped:** lookalike domains (pakrummy.pk advertising a different version number; pakrummy.com.pk calling itself the "Official Earning App" and cited by English Wikipedia's "Mille" article as the Pak Rummy source) are winning the brand narrative in model training data precisely because this site — the one with verified, anti-impersonation facts — has blocked itself from that training data. Also: blocking `Google-Extended` removes the site from Gemini app grounded answers specifically (not just training), relevant for an all-Android Pakistani audience; blocking `PetalBot` (Huawei's *search* crawler, not a trainer) costs Petal Search visibility for no training benefit.
- **Brand entity clarity is the biggest AI-readiness weakness:** `/official-domains/` opens by saying domains aren't confirmed, while every other page asserts the "official" framing; the Organization schema has no `sameAs`, logo, or link to the operator; pakrummy.com's own homepage never mentions pakrummyofficial.com anywhere checked.
- **Agentic audit (download-page focus):** accessibility tree is agent-ready (100/100 local heuristic — real anchors, zero div-onclick widgets); the download link, and the checksum/permissions visible in the HTML, are real server-rendered content reliably extractable by an agent **from the page** — but not from the structured data (see Schema section above). Lighthouse's own Agentic Browsing fraction (X/N) couldn't be measured this run (PSI quota/no API key).
- Absence of `ai-catalog.json`, `/.well-known` discovery files, Markdown delivery, and WebMCP tooling is correctly a non-issue for this static, form-free, API-free site.

---

## Search Experience (SXO) — Gap Score 47/100 (GSC-impression-weighted)
*Full detail: `findings/sxo.md`. Pulled live GSC data for 2026-08-12 to 2026-11-07: 1,157 clicks, 8,910 impressions.*

- **The demand the site gets doesn't match what it was built for.** 1,532 impressions (17% of site total) are people trying to reach pakrummy.com itself (plus typos: .con, .vom). They land on the homepage, which has no visible onward link, and convert at only 4.8% CTR. The only real link to pakrummy.com on the entire site is in the footer and one `/about/` sentence; the homepage hero mentions it as unlinked text.
- **Page-format mismatches found on real ranking pages:**
  - Withdrawal-charges posts (Critical): 0 impressions (JazzCash) / 3 impressions at position 46–66 (Easypaisa) in 90 days. Competing results are fee tables by amount/year and the wallets' own official fee-schedule PDFs — this site's posts have neither tables nor rupee figures.
  - `/register-login/` (High): "pak rummy 2026 registration" gets 30 impressions / 0 clicks — the only CTA is "Download," no login link exists.
  - "Old version" APK searches (High): 210 impressions at 24% CTR split across `/download/` and `/app-version/`, neither of which answers the query (`/app-version/` says 1.1.2 is the first tracked build).
  - Promo code (High): demand is split across 3 pages (`/promo-code/`, `/bonuses/`, `/deposit/`); ranking competitors show an actual code.
  - Legitimacy queries (High): competing results are "Honest review"-style verdict pages; `/safety/` only covers APK file safety, and the legitimacy blog post doesn't name Pak Rummy in its title.
  - `/withdrawal/` (Medium): worst CTR of any 100+-impression page (2.99% at position 8.9) — generic snippet, step-based layout rather than problem-based.
- **Trust mismatch:** homepage claims Easypaisa/JazzCash support in its meta description and a feature tile, while `/easypaisa-jazzcash/` itself says that support is "not yet publicly verified." The 5–10 minute withdrawal time is labeled "Verified" though it is only operator-stated.
- **Persona scoring:** someone trying to reach the actual game scores 33/100 on the homepage (the weakest persona/page combination found); a returning player with a problem scores 39–40 on `/easypaisa-jazzcash/` and `/register-login/`. Every key page offers the same "Download Pak Rummy" CTA regardless of why the visitor actually landed there.
- **For technical/schema follow-up:** 8 core pages (`/deposit/`, `/withdrawal/`, `/bonuses/`, `/easypaisa-jazzcash/`, others) show a `publication_date: 2026-01-01` in page metadata extraction — source not yet identified, worth tracking down.

---

## Content Clusters & Internal Linking
*Full detail: `findings/cluster.md`. Evidence: live `<main>`-scoped link graph across all 64 URLs, 90-day GSC data, URL Inspection on 27 URLs.*

- **The blog's near-zero traffic is structural, not an indexing problem.** All 16 posts are confirmed "Submitted and indexed" via URL Inspection — they're indexed but not ranking, and critically, **not linked to from anywhere that matters**: zero of the 7 game pages, `/deposit/`, `/withdrawal/`, `/easypaisa-jazzcash/`, `/account-verification/`, `/safety/`, `/legal-status/`, or `/sitemap/` link to a single post. 14 of 16 posts have fewer than 3 in-content inbound links; 8 are linked only from the `/blog/` index; the homepage widget shows just 1 post (`index.astro:75`, `slice(0, 1)`).
- **The 15-day content calendar is fully published** — Day 1–15 slugs are all live, `scheduled-posts/` no longer exists. There's nothing left to resume; a new calendar is needed, not just a cron restart.
- **Game pages compete with their own supporting blog posts** for identical intent — e.g., `/games/aviator/` ("How the Multiplier Game Works") vs. `/blog/how-aviator-game-works/`; GSC shows "pak aviator game" (the blog post's target keyword) going to the *game* page instead, at position 24. Same collision on Crash, Teen Patti, Poker, Ludo.
- The `/games/` hub itself is healthy — bidirectional links to/from all 7 game pages (Ludo is now also verified, making it 7 games not 6).
- Payment hub pages are thin (`/deposit/` 176 words, `/withdrawal/` 225, `/easypaisa-jazzcash/` 256) and link to none of their 5 supporting posts; recommend `/easypaisa-jazzcash/` as the designated payments hub.
- `/guides/enable-unknown-sources-android/` is an orphan relative to its own install cluster — linked only from `/guides/` and `/sitemap/`, not from `/install/` or `/download/`.
- Three topic areas have supporting search demand but no posts: Slots ("pak rummy slots" already ranks position 8.4), Responsible Gaming (the single most internally-linked page on the site, 26 inbound links, but zero supporting content), and install troubleshooting.
- ~10 missing links between topically-related posts identified (e.g., Teen Patti rules → sequence/variations posts; Easypaisa ↔ JazzCash charges posts never cross-link).
- **Recommended next 10 topics** (priority order): Aviator "predictor/signals" scams, JazzCash deposit guide (Easypaisa has one, JazzCash doesn't), how slot RTP works, fixing "App not installed," Easypaisa/JazzCash account limits, Rummy joker rules, setting a gaming budget, how to report fraud in Pakistan, Easypaisa vs. JazzCash comparison, what the Play Protect warning means.

---

## Backlinks — INSUFFICIENT DATA (confidence ceiling 0.50, Tier 0 sources only)
*Full detail: `findings/backlinks.md`*

- No usable inbound-link data could be produced: Moz isn't configured; Bing Webmaster is configured but verified for a *different* domain portfolio; Common Crawl's latest release hasn't captured this domain at all (apex or www).
- **Re-tested mid-audit with the Bing Webmaster API key provided directly:** the key itself is valid (no auth error), but returns 0 links/0 pages for pakrummyofficial.com because **the domain itself isn't added/verified as a property under this Bing Webmaster account** — the key being valid doesn't substitute for site verification. This confirms the Phase 3 action item: verify pakrummyofficial.com in Bing Webmaster Tools directly to unlock real Bing link/crawl data.
- **No link found from pakrummy.com (the actual operator) back to this site**, checked across its homepage, `/about-us/`, and `/privacy-policy/` — not exhaustive (only 3 pages checked; 5 other guessed paths 404'd). The only link between the two domains runs the other way (this site → pakrummy.com, followed, no `rel` attribute). A reciprocal link from the operator would be a genuine authority signal worth pursuing directly.
- **Actionable fix:** wire up Search Console's Links report via the already-authenticated GSC API — a real, free backlink data source that wasn't part of this agent's tooling but is immediately available given current credentials.

---

## Google Search Console / GA4 — complete (GA4 property corrected mid-audit)
*Full detail: `findings/google.md`. GA4 property 550188706 supplied by the user after the initial pass (the account default, 549628311, belongs to a different site) — confirmed correct by its landing pages matching this site's actual URLs.*

- **GA4 organic traffic, last 90 days:** 1,280 sessions / 1,132 users / 3,478 pageviews (avg. 17 sessions/day). Top organic landing pages: `/` (658), `/download` (286), `/games` (48), `/deposit` (42), `/games/crash` (40), `/games/aviator` (39), `/games/rummy` (21), `/app-version` (17), `/promo-code` (15), `/games/slots` (12).
- **Last 28 days, full landing-page breakdown (459 total organic sessions):** `/` 192, `/download` 91, `/games` 31, `/games/crash` 30 (60% bounce — worth investigating despite decent GSC CTR), `/games/aviator` 25, `/promo-code` 13, `/app-version` 11, `/customer-service` 10 (70% bounce), `/deposit` 10, `/complaints` 7, `/withdrawal` 6, `/register-login` 5, `/about` 4, `/bonuses` 4 (75% bounce), `/contact` 4, `/easypaisa-jazzcash` 3, `/games/slots` 3, `/legal-status` 3, `/games/rummy` 2.
- **Confirms the cluster-analysis finding independently via a second data source: not one of the 16 blog posts appears anywhere in the top-20 organic landing pages.** All organic traffic concentrates on the homepage, download funnel, and game pages — the blog is effectively invisible to organic traffic, not just low-ranking.
- Device/country breakdowns returned empty from this script for the given period — not investigated further (low priority relative to the landing-page finding above).
- **GSC search performance**, property `https://pakrummyofficial.com/` (note: the `sc-domain:` property variant returns permission-denied for this service account — use the URL-prefix property going forward):
  - Last 28 days: 502 clicks, 5,160 impressions, 9.73% CTR, avg. position 11.0.
  - Last 91 days: 1,157 clicks, 8,910 impressions, 12.99% CTR, avg. position 10.9.
  - Top queries (28d): "pakrummy" (117 clicks/561 impr.), "pakrummy.com" (35/971, only 3.6% CTR — the wrong-audience traffic flagged by SXO), "pak rummy" (25/153), "rummy crash" (15/44).
  - Top pages (28d): homepage 238 clicks, `/download/` 104, `/games/` 69, `/games/crash/` 26 (strong 30% CTR at position 4.3), `/games/aviator/` 23.
- **Publishing-burst correlation:** a brand-query impression spike (Sep 27–30) actually *predates* the first blog post by 11 days — not explained by publishing. Impressions did rise through the Oct 8–16 posting window (peak 462/day) while average position held steady (~9.5), then fell to 50–125/day after Oct 17 as position slid to 13–16. Of the 12 new posts, only 4 show any impressions at all (~16 total), none with clicks — directionally consistent with the cluster agent's internal-linking findings, but correlation only.
- **Indexation (URL Inspection, all 64 sitemap URLs):** 62 pass ("Submitted and indexed"), 0 fail, 2 neutral:
  - `/card-rummy-vs-pak-rummy/` — **"URL is unknown to Google"** despite being in the sitemap. High priority to investigate.
  - `/customer-service/` — "Discovered - currently not indexed." Medium priority.
- PSI/CrUX/CrUX History not run (no API key). No Indexing API writes were made (read-only by design this pass).

---

## Images — 78/100 (estimated composite; no dedicated pass run — synthesized from performance + schema findings)
- WebP adoption is strong (26 of 34 image assets), remaining exceptions are justified (favicons, OG images needing universal support, small logos).
- One unused asset (`rummy-game-art.png`) found in `public/images/` with no page reference — `/games/rummy/` has no hero image at all.
- 5 of 20 article pages lack an `image` property in their Article JSON-LD (guides/updates content schemas don't define an image field).
- Visual audit confirms images render correctly with no broken/placeholder states across all captured viewports.

---

## Artifacts
- Findings: `pakrummyofficial.com-audit/findings/{technical,content,schema,sitemap,performance,visual,geo,agentic,sxo,backlinks,cluster,google}.md`
- Screenshots: `pakrummyofficial.com-audit/screenshots/` (24 PNGs, 4 viewports × 6 pages)
- URL list: `pakrummyofficial.com-audit/url-list.txt`
- See `ACTION-PLAN.md` for the prioritized, phased fix list.
