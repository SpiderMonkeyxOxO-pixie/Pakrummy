# Technical SEO Audit — pakrummyofficial.com
Audited 2026-11-10. Live fetches via `render_page.py`/`fetch_page.py` (SSRF-safe) cross-checked against Astro source (`D:\PakrummyOfficial\src`). Scope: 64-page URL list at `D:\PakrummyOfficial\pakrummyofficial.com-audit\url-list.txt`.

**Coverage note:** This pass completed robots.txt, sitemap, canonical/trailing-slash, a sample of status codes/redirects, security headers, mobile viewport/touch-targets, HTTPS/mixed-content, static-build/hydration, llms.txt staleness, and IndexNow. It did **not** complete: a full 64-URL status-code crawl (only a handful of representative URLs were spot-checked — homepage, `/about` with/without slash, a 404 path, HTTP→HTTPS), Lighthouse/PSI lab or field CWV measurement (deferred — see Core Web Vitals section), and full structured-data validation (deferred to the `schema` sub-skill/agent, only presence/syntactic-validity spot-checked on the homepage).

## Scorecard

| Category | Status |
|---|---|
| Crawlability (robots.txt, sitemap, noindex) | PASS |
| Indexability (canonicals, duplicates) | PASS |
| Security headers | FAIL |
| HTTPS / mixed content | PASS |
| URL structure / trailing slash | PASS |
| Mobile viewport / touch targets | PASS |
| Core Web Vitals (source-level) | PASS (unverified in field/lab — see note) |
| Structured data | PASS (spot-check only, homepage) |
| JS rendering (SSR/SSG) | PASS |
| IndexNow | NOT IMPLEMENTED |

**Technical score: 84/100.** The build itself is clean (static Astro, correct canonicals, no hydration gaps, good LCP/CLS hygiene). The deductions are all hygiene/trust-signal gaps that are cheap to fix: no sitewide security headers, a stale and incomplete `llms.txt`, and no IndexNow.

---

## Critical
None found.

## High

**1. No sitewide security headers — `public/_headers` only covers 4 narrow cases.**
Full contents of `D:\PakrummyOfficial\public\_headers`:
```
/llms.txt
  Content-Type: text/plain; charset=utf-8
/robots.txt
  Content-Type: text/plain; charset=utf-8
/downloads/pakrummy.apk
  Content-Type: application/vnd.android.package-archive
  Content-Disposition: attachment; filename="pakrummy.apk"
/404
  X-Robots-Tag: noindex, follow
```
Live header dump (homepage, `https://pakrummyofficial.com/`) confirms **no** `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`/`frame-ancestors`, `Referrer-Policy`, or `Permissions-Policy` on any page. The only security header present (`strict-transport-security: max-age=31536000`) is Cloudflare's automatic HSTS, not something this repo configures, and it lacks `includeSubDomains; preload`.
- Impact: raised for a YMYL-adjacent site (real-money gaming + payment guidance, self-hosted APK download) even though there are no forms/login on this domain — clickjacking and MIME-sniffing protections are cheap, standard hardening for a trust-positioned page like `/safety/` and `/download/`.
- Fix: add a sitewide `/*` block to `public/_headers`:
  ```
  /*
    X-Content-Type-Options: nosniff
    X-Frame-Options: DENY
    Referrer-Policy: strict-origin-when-cross-origin
    Permissions-Policy: geolocation=(), camera=(), microphone=()
    Content-Security-Policy: default-src 'self'; img-src 'self' data:; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com; connect-src 'self' https://www.google-analytics.com https://analytics.google.com; style-src 'self' 'unsafe-inline'; frame-ancestors 'none'
  ```
  (CSP needs testing against the inline GA4/GTM `<script>` tags in `src/layouts/BaseLayout.astro` lines 110–128 before shipping — they're inline, so CSP will need either a nonce/hash or `'unsafe-inline'` for `script-src` unless those are moved to external files.)

## Medium

**2. `llms.txt` is hand-written and stale — misses 20 of the site's pages.**
`D:\PakrummyOfficial\src\pages\llms.txt.ts` builds the file from a fully hardcoded array of `lines.push(...)` calls (lines 31–84), not from `getCollection()` against `src/content/blog|guides|updates`, and ends with a literal string `Last updated: 2026-08-17` (line 87) that isn't computed from anything.
Confirmed by live fetch of `https://pakrummyofficial.com/llms.txt` (200, last-modified header Nov 7 2026 — build date, not content date):
- **0 of 16** blog posts are listed individually (only the `/blog/` index link is present) — e.g. `/blog/teen-patti-variations/`, `/blog/why-is-my-withdrawal-pending/`, all 14 others.
- **0 of 3** individual guide articles are listed (only `/guides/` index) — `enable-unknown-sources-android`, `mobile-wallet-deposit-delay`, `rummy-scoring-explained`.
- `/updates/site-launch/` (the one update-log entry) is not listed (only the `/updates/` index).
- `/card-rummy-vs-pak-rummy/` — a page that exists since 2026-10-08 (`git log --diff-filter=A` confirms) and is internally linked from `/official-domains/` and `/safety/` and in `src/config/nav.ts:98` — is **absent from llms.txt entirely**, not just a staleness gap.
- This predates the known blog-cadence stall: `llms.txt.ts` was last git-committed 2026-10-04, four days before the first new blog post (2026-10-08) and the card-rummy comparison page landed, so it was never current even during the active-publishing window.
- Fix: regenerate the `## Guides or Resources` / `## Optional` sections from `getCollection('blog')`, `getCollection('guides')`, `getCollection('updates')` the same way `src/pages/sitemap/index.astro` already does for guides/updates (lines 17–18, 46–58) — that file is proof the pattern already exists in the codebase, just not applied here. Compute `Last updated:` from the newest `publishDate`/file mtime instead of hardcoding.

**3. Human-readable `/sitemap/` page omits individual blog posts.**
`D:\PakrummyOfficial\src\pages\sitemap\index.astro` dynamically lists every guide (`guides.map(...)`, line 49) and every update-log entry (line 56) by iterating `getCollection()`, but blog posts are only represented via the static `FOOTER_NAV` entry for `/blog/` (`src/config/nav.ts:38`) — no per-post link. Not a crawlability risk (the XML sitemap and `/blog/` index already link every post — confirmed `src/pages/blog/index.astro` renders all posts from `getCollection('blog')` with no pagination/limit), but it's an inconsistency against the page's own stated purpose ("A full, human-readable list of every page on PakRummyOfficial.com") and worth a one-line fix: add a `posts.map(...)` block mirroring the guides/updates pattern already on that page.

**4. No IndexNow implementation.**
No reference to IndexNow/`indexnow` anywhere in `src/` or `public/` (checked `.ts`, `.astro`, `.txt`). Given Bing Webmaster Tools isn't even verified for this domain (per `SITE-CONTEXT.md`) and GSC relies on crawl scheduling, IndexNow would let the site push new/updated URLs to Bing, Yandex, and Naver immediately on publish (via `scripts/publish-next-post.sh` or a build hook) independent of BWT verification status. Low effort, no credential blocker (IndexNow uses a self-hosted key file, not an API key) — worth adding once blog publishing resumes.

## Low

**5. `/404` `X-Robots-Tag` header rule in `_headers` doesn't fire for actual 404s.**
`public/_headers` line 11–12 sets `X-Robots-Tag: noindex, follow` only for the literal path `/404`. A real 404 response for an arbitrary unmatched URL (tested: `https://pakrummyofficial.com/does-not-exist-xyz/` → HTTP 404, confirmed via live fetch) does **not** carry that header — verified against the full live header dump, which has no `x-robots-tag` key. This is low-severity only because `src/pages/404.astro` independently passes `robots="noindex, follow"` into `BaseLayout`, which does correctly emit `<meta name="robots" content="noindex, follow">` in the document `<head>` (confirmed in the fetched 404 HTML body). The header rule is dead weight, not a functional gap — either remove it or repoint hosting-level 404 handling so it actually applies.

**6. HSTS header lacks `includeSubDomains; preload`.**
Only `max-age=31536000` is sent (Cloudflare default), no subdomain/preload directives. Cosmetic hardening, not blocking anything today since there's no HTTP-served subdomain in scope, but worth adding if any subdomain is ever stood up.

## Info / Confirmed-good (verified this pass, not re-flagged as issues)

- **robots.txt**: live-merged file (Cloudflare-injected block + origin `public/robots.txt`) confirmed via `fetch_page.py`. Origin file is just `User-agent: * / Allow: /` + `Sitemap:` line; Cloudflare injects a `Content-Signal: search=yes,ai-train=no,use=reference` directive plus explicit `Disallow: /` for ~30 named AI-training crawlers (GPTBot, ClaudeBot, Google-Extended, CCBot, Bytespider, Amazonbot, etc.) ahead of the origin's open `Allow: /`. Matches `SITE-CONTEXT.md` claim #2 exactly — deliberate, not misconfigured. Two separate `User-agent: *` groups exist in the merged file (Cloudflare's signal-only block, then the origin's open block); this is non-standard but not harmful since all the restrictive entries use specific, named user-agents that take precedence over any wildcard group for an exact match.
- **Sitemap**: `sitemap_discovery.py` confirms `Sitemap:` declaration in robots.txt resolves live: `sitemap-index.xml` → 200, valid `sitemapindex`, which points to one `sitemap-0.xml` → 200, valid `urlset`, **64 `<loc>` entries**, byte-for-byte match against `url-list.txt` (diff = empty both directions) and against the union of `src/pages/**/index.astro` static routes + all entries in `src/content/{blog,guides,updates}` (16+3+1 = 20 dynamic pages, all present). **Confirmed: zero `<lastmod>` tags anywhere in the file** — every `<url>` has only `<loc>` and `<changefreq>weekly</changefreq>`. Impact: crawlers (esp. Bing/Yandex, which weight `lastmod` more heavily than Google) have no signal to prioritize re-crawling updated pages, and it undercuts the `changefreq:weekly` claim since there's no date to confirm against — pair with finding on `astro.config.mjs`: the `@astrojs/sitemap` integration is configured with only `{ changefreq: 'weekly', filter: ... }` (no `lastmod` serializer), so this is a one-line fix (pass each page's content `publishDate`/`updatedDate`/git-mtime via the integration's `serialize` option).
- **Canonical tags**: `src/layouts/BaseLayout.astro` line 40 builds `canonical` from `new URL(path, SITE.productionUrl)` for every page; every one of 45 static route files plus all 3 dynamic route templates (`blog/[slug]`, `guides/[slug]`, `updates/[slug]`) passes a `path` constant with a trailing slash matching `astro.config.mjs`'s `trailingSlash: 'always'`. No hardcoded canonical mismatches found; no duplicate `title`/`description` pairs across any static page or any content-collection entry (checked via full-repo grep, zero dupes both ways).
- **URL structure / trailing slash**: grepped all `href="/...">` internal links repo-wide — zero links without a trailing slash (excluding static assets like favicons/images/manifest, which correctly have none). Live-tested `/about` (no slash) → single-hop 301 → `/about/` → 200. Live-tested `http://` → single-hop 301 → `https://pakrummyofficial.com/` → 200. No redirect chains longer than one hop found in the URLs tested.
- **404 handling**: `https://pakrummyofficial.com/does-not-exist-xyz/` correctly returns HTTP 404 (not a soft-404 200), with a proper `<meta name="robots" content="noindex, follow">` in the rendered body (see Low finding #5 for the one gap).
- **HTTPS / mixed content**: all internal asset/script references are protocol-relative or absolute-path (no hardcoded `http://` found anywhere in `src/` except SVG `xmlns` namespace declarations, which are not fetched URLs). HTTP→HTTPS redirect confirmed live. No `<iframe>` anywhere in `src/` (grepped); no forms anywhere on the site (it's purely informational — `/contact/` uses a `mailto:` link, not a form).
- **Mobile viewport**: `<meta name="viewport" content="width=device-width, initial-scale=1" />` present once, in `BaseLayout.astro` (shared by every page), with no `maximum-scale`/`user-scalable=no` restriction (good for accessibility).
- **Touch targets**: `.btn` class (all CTA buttons sitewide) sets `min-height: 44px` (`src/styles/global.css:301`); the fixed Telegram widget button is 56×56px. Meets the 44px minimum guideline.
- **JS rendering / hydration**: `output: 'static'` in `astro.config.mjs`, zero Astro island `client:*` hydration directives anywhere in `src/` (grepped), zero `.tsx`/`.jsx` components. Only inline `<script>` tags are: a `js-ready` class toggle (progressive-enhancement guard with a 3-second `setTimeout` safety net in `Hero.astro` so content is never permanently hidden if JS fails), a native `<dialog>`-based mobile nav toggle in `Header.astro`, and GA4/GTM loader tags in `BaseLayout.astro`. This is a fully static, SSR/SSG-complete build with no hydration-gap risk and no CSR dependency for content — confirms `SITE-CONTEXT.md`'s framing.
- **Core Web Vitals (source-level only — not lab/field-measured this pass)**: hero LCP image (`Hero.astro`) uses `loading="eager"`, `fetchpriority="high"`, responsive `widths`/`sizes` via Astro's `<Image>`; `build.inlineStylesheets: 'always'` in `astro.config.mjs` avoids a render-blocking external CSS request; all `@font-face` declarations use `font-display: optional` (CLS-safe — no FOIT/FOUT swap); nav-brand icons and blog thumbnails carry explicit `width`/`height` attributes. No `PageSpeed Insights`/CrUX credential available this run (`GOOGLE_API_KEY` missing, per `SITE-CONTEXT.md`) and no Lighthouse run was performed in this pass — **actual LCP/INP/CLS numbers are unverified**; recommend the dedicated `performance` audit agent run `unlighthouse_run.py`/PSI for field+lab numbers rather than duplicating here.
- **Structured data**: spot-checked homepage only — one valid JSON-LD block, types `Organization`, `WebPage`, `WebSite` (via `structured_data` extraction in `fetch_page.py`, `valid: true`). Full-site schema validation (breadcrumb `@id` fix mentioned in `SITE-CONTEXT.md` finding #5, per-page type coverage, etc.) is deferred to the `schema` sub-skill/agent — not exhaustively checked here.
- **Sitemap/content parity**: all 64 sitemap URLs map 1:1 to either a static `src/pages/**/index.astro` route or a `src/content/{blog,guides,updates}` collection entry; nothing in `src/pages` or the content collections is missing from the sitemap, and nothing in the sitemap is orphaned from source. `/card-rummy-vs-pak-rummy/` (flagged missing from `llms.txt` above) is correctly in the sitemap and is internally linked from `/official-domains/`, `/safety/`, and primary nav (`src/config/nav.ts:98`) — not an orphan page.

## Not completed this pass (hand off / flag for follow-up)
- Full 64-URL status-code/redirect-chain crawl (only ~4 representative URLs were live-tested: homepage, `/about` without slash, a nonexistent path, plain-HTTP homepage). No reason to expect broad problems given the single `trailingSlash: 'always'` + static-route pattern confirmed in source, but it wasn't exhaustively verified live.
- Lab/field Core Web Vitals (LCP/INP/CLS actual milliseconds) — no PSI/CrUX credential, no Lighthouse run this pass. Source-level signals are good (see above) but unmeasured.
- Full structured-data/schema validation across all 64 pages — only the homepage was spot-checked. Defer to `schema` sub-skill.
- hreflang — not applicable (single `en-PK` locale, no alternate-language versions found), but not deeply verified; defer to `seo-hreflang` sub-skill if the orchestrator wants it confirmed.

## File references
- `D:\PakrummyOfficial\public\_headers`
- `D:\PakrummyOfficial\public\robots.txt`
- `D:\PakrummyOfficial\astro.config.mjs`
- `D:\PakrummyOfficial\src\layouts\BaseLayout.astro`
- `D:\PakrummyOfficial\src\pages\llms.txt.ts`
- `D:\PakrummyOfficial\src\pages\sitemap\index.astro`
- `D:\PakrummyOfficial\src\pages\blog\index.astro`
- `D:\PakrummyOfficial\src\pages\404.astro`
- `D:\PakrummyOfficial\src\components\Hero.astro`
- `D:\PakrummyOfficial\src\components\Header.astro`
- `D:\PakrummyOfficial\src\components\TelegramWidget.astro`
- `D:\PakrummyOfficial\src\styles\global.css`
- `D:\PakrummyOfficial\src\config\nav.ts`
- `D:\PakrummyOfficial\pakrummyofficial.com-audit\url-list.txt`
