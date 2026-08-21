# QA report

Date: 2026-08-17. All checks below were run against this build, not assumed.

## Commands executed

```
npm install
npm run build              # astro build
npx astro check            # TypeScript + Astro diagnostics
npm run preview -- --port 4322/4323   # to serve dist/ for live checks
node <ad-hoc QA crawl script>          # static analysis of dist/*.html
npx @axe-core/cli <41 URLs> --exit     # accessibility, real Chrome
npx lighthouse <URL> --form-factor=mobile   # performance/a11y/best-practices/seo
node <ad-hoc Selenium script>          # responsive overflow + mobile-menu focus trap
```

## Build results

- `npm run build` — **passes**, 41 pages built (40 HTML routes + `/llms.txt` API route), plus `sitemap-index.xml`/`sitemap-0.xml`.
- `npx astro check` — **0 errors, 0 warnings, 2 hints**. The 2 remaining hints are a cosmetic TypeScript false-positive (`'Props' is declared but never used`) on `FactTable.astro`/`TrustStrip.astro`, where `Props` is used implicitly by Astro's prop-typing convention; not a real issue, confirmed by the build succeeding and both components rendering correctly across every page that uses them.

## Page count

41 total routes: 39 indexable content pages + `/sitemap/` (also indexable, 40 total indexable) + `/404` (noindex) + `/llms.txt` (plain-text endpoint, not HTML). See `docs/content-inventory.md` for the full breakdown.

## Link-check results

Custom static crawler (`Node`, read every built `.html`, resolve every `href="/..."` against the actual set of built routes + static assets): **0 broken internal links** across all 41 pages after accounting for static assets (`/favicon.svg`, `/site.webmanifest`, hashed `/_astro/*` bundles). External links (mailto:, none to third-party HTTP domains yet, since no verified external domain exists to link to) were not separately live-checked since there are currently none to check beyond `mailto:contact@pakrummyofficial.com`.

## Canonical / metadata results

Same crawler verified for every page: exactly one `<h1>`, a self-referencing absolute canonical matching `https://pakrummyofficial.com{route}`, a `robots` meta tag present, **0 duplicate titles**, **0 duplicate meta descriptions** across all 40 indexable pages.

## Structured data / schema validation

Every JSON-LD `<script>` block on every page was extracted and run through `JSON.parse()` — **0 malformed blocks**. See `docs/schema-inventory.md` for what each page type emits and why some nodes (operator `Organization`, `SoftwareApplication`, `AggregateRating`) are deliberately absent pending verification.

## Accessibility results

`@axe-core/cli` against real headless Chrome (151, matched ChromeDriver), run against **all 41 built pages**:

- First pass found 2 issues: a `color-contrast` violation on `.btn-primary` (4.175:1, below the 4.5:1 AA threshold for normal text) and a `region` violation (the responsible-gaming notice bar wasn't contained in a landmark).
- Both fixed: `.btn-primary`'s default background darkened from `--color-emerald-strong` to `--color-emerald` (5.82:1 contrast against ivory text) with a new, still-compliant `--color-emerald-deep` hover state; the notice bar changed from a bare `<div>` to a labelled `<aside>` landmark.
- Re-run after fixes: **0 violations on all 41 pages.**

Manual/scripted checks beyond axe's automated coverage:
- Keyboard + focus-trap test (Selenium, real Chrome): mobile nav `<dialog>` opens via the header toggle, traps focus inside itself, closes on <kbd>Escape</kbd>, and returns focus to the toggle button — all confirmed programmatically, not just visually inspected.
- Desktop nav dropdowns (native `<details>/<summary>`) confirmed to open via a real click event.

Axe covers an estimated 20–50% of WCAG issues by its own documentation; full manual WCAG 2.2 AA sign-off (screen-reader walkthroughs, zoom/reflow testing, cognitive-load review) has not been performed and should happen before launch if it hasn't been done elsewhere.

## Responsive results

Headless Chrome, real `document.documentElement.scrollWidth` vs `clientWidth` comparison at every required breakpoint (320/360/375/390/412/430/768/1024/1280/1440px), across 7 representative pages chosen to cover the riskiest layouts (homepage, download with fact tables, games grid, terms with long-form + tables, common-errors with definition lists, apk-permissions with data tables, a guide article): **0 horizontal-overflow issues** (70 page×width combinations checked, 0 failures).

## Lighthouse results (mobile)

| Page | Performance | Accessibility | Best Practices | SEO | LCP | CLS |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | 97 | 100 | 100 | 100 | 1.4s | 0 |
| `/terms/` | 100 | 100 | 100 | 100 | 1.4s | 0 |

All figures meet or exceed the acceptance targets (Performance 90+, Accessibility 95+, Best Practices 95+, SEO 100, LCP ≤2.5s, CLS ≤0.1). Total Blocking Time was 0ms on the homepage run (no long tasks — the site ships almost no client JS: two small inline scripts for the mobile-menu dialog and the desktop `<details>` dropdowns, no framework runtime).

**Correction made during this pass**: the first Lighthouse run measured CLS 0.177 (over budget), traced to a font-swap layout shift (`font-display: swap` on the self-hosted Sora/Manrope variable fonts). Fixed by switching to custom `@font-face` declarations with `font-display: optional` and dropping the unused latin-extended subset — CLS became 0 on re-test and Performance improved (97 vs. the pre-fix run) from the smaller font payload.

INP could not be measured directly (Lighthouse lab runs don't produce field INP; TBT of 0ms is the closest lab proxy and is a strong signal given how little JS ships).

## Remaining assumptions

- All "verified" facts about **this website itself** (positioning statement, publisher name, editorial contact address) are treated as ground truth since they describe the site being built, not the Pak Rummy operator. Everything about the operator, the app binary, and payments is deliberately left unverified — see `docs/required-verification.md`.
- `SITE.editorialContactEmail` (`contact@pakrummyofficial.com`) is a placeholder address scaffolded for this build. It is not yet confirmed as a real, provisioned, monitored inbox — confirm before launch.
- Hosting-level `Content-Type` for `/llms.txt` was confirmed as `text/plain` via Astro's own preview server; final hosting (Vercel/Netlify/other) should be spot-checked post-deploy since static-file content-type handling varies slightly by platform.

## Post-launch-blocker update: verified download (2026-08-17, same day)

After the initial pass above, the site operator confirmed a supplied APK (`pakrummy_85NU87SXTZ8.apk`, 38,727,077 bytes) as a trustworthy build and asked for it to be used to populate verified facts. We:

1. Hosted it ourselves at `/downloads/pakrummy.apk` (`public/downloads/pakrummy.apk`), added a `_headers` rule for the correct `Content-Type`/`Content-Disposition`.
2. Computed its SHA-256 (`db6c3d31…4ab5`) and extracted version (1.1.2), build (112), package name (`com.rummy.pak.games`), min/target SDK (21/35), and its full permission list directly from `AndroidManifest.xml` using a pure-JS parser (no Android SDK / `aapt` available in this environment) — see `docs/required-verification.md` for the full table.
3. Updated `src/config/site.ts` to mark these fields `verified()`, which automatically activated the `/download/` CTA and caused `SoftwareApplication` JSON-LD to appear on that page (exactly as predicted in `docs/schema-inventory.md` before any template code changed) — confirmed present with an absolute `downloadUrl` in the rebuilt output.
4. Rewrote `/download/`, `/safety/`, `/app-version/`, `/apk-permissions/`, `/install/`, and the homepage's download section to reflect the new verified state, while explicitly stating what was **not** done: no third-party malware scan, no confirmed link to an operator-owned domain (see `docs/required-verification.md`).
5. Re-ran the full QA suite after the change: `npx astro check` (0 errors), rebuild (41 pages), the static link/metadata crawler (0 issues), `@axe-core/cli` against `/download/`, `/safety/`, `/app-version/`, `/apk-permissions/`, and `/` (0 violations), and Lighthouse mobile on `/download/` (Performance 96, Accessibility/Best Practices/SEO 100, LCP 1.4s, CLS 0 — the large linked file has no effect on page-load metrics since it's never fetched during the page load itself).
6. Verified the file is actually servable: `curl -I http://localhost:4324/downloads/pakrummy.apk` → `200`, `Content-Length: 38727077` matching the source file exactly.

This resolves launch blocker #1 below for the *file itself*. It does not resolve operator legal identity, official-domain confirmation, or a third-party malware scan — those remain open (see updated blocker list).

## Post-launch-blocker update 2: game verification and site imagery (2026-08-17, same day)

Two further changes after the sections above:

**Real imagery.** The operator pointed at `archive/legacy-static-site/images/` as usable source material. Each file was opened and individually assessed rather than bulk-copied — see the "Design/asset gaps" section of `docs/required-verification.md` for the full list of what was used and, more importantly, what was deliberately excluded (fabricated rating/testimonial imagery, an unsupported ISO badge, India-specific payment logos, and — most importantly — several files that appear to be real, identifiable people's photos used as fake "won ₨X Crore" testimonials, which were excluded outright regardless of instruction).

**Game verification.** The operator confirmed Teen Patti, Poker, Slots, Aviator, Crash, and Ludo as available in the app. Rather than take that at face value for the site's own "confirmed" claims, we cross-checked it against the app's own hot-update manifest bundled inside the APK (`assets/res/raw-assets/8f/8ffdc729....manifest`), which lists every game module by internal name (~300 entries). Five matched directly: Rummy, Teen Patti, Poker, Slots, Aviator, Crash. Ludo did not — the closest text match found elsewhere in the app's assets turned out to be an Esperanto localization string ("ludo" = "game"), not the board game. We built full pages for the five confirmed games and left Ludo unverified, flagging the discrepancy back to the operator instead of either silently overriding them or publishing an unchecked claim.

Re-ran the full QA suite after both changes:
- `npx astro check` — 0 errors, 0 warnings, 2 hints (same pre-existing cosmetic `Props` hint noted above).
- `npm run build` — 46 pages (up from 41; the 5 new game pages), sitemap regenerated.
- Static link/metadata/JSON-LD crawler — 0 issues across all 46 pages, including every new `<img>` tag (alt text + explicit width/height present).
- `@axe-core/cli` against `/games/`, `/games/rummy/`, `/games/teen-patti/`, `/games/poker/`, `/games/slots/`, `/games/aviator/`, `/games/crash/`, `/download/`, `/app-version/`, `/official-domains/`, `/easypaisa-jazzcash/` — **0 violations** on every page (one run hit an unrelated ChromeDriver `ECONNREFUSED` mid-batch and was simply re-run for the remaining URLs).

## Missing operator-provided information

Operator legal identity and support channels, payment method/limit specifics, active bonus terms, release date/changelog history, and a source for Ludo's availability. See `docs/required-verification.md` for the full current list — the app-facts table and five of six games are now resolved as described above.

## Launch blockers

1. ~~No verified download URL.~~ **Resolved 2026-08-17** — see above. Remaining related gap: no third-party malware-engine scan has been run against the file, and the operator's own domain(s) are still unconfirmed independently of this file.
2. **Legal pages are unreviewed drafts.** `/terms/`, `/privacy-policy/`, `/cookie-policy/`, `/disclaimer/`, `/dmca/`, `/legal-status/` all carry a visible "pending review by qualified Pakistani legal counsel" notice and should not be considered final. See `docs/legal-review-checklist.md`.
3. **No Open Graph share image.** Social previews will show no image until a real 1200×630 asset is designed and wired into `BaseLayout`'s `ogImage` prop.
4. **No favicon raster fallbacks beyond the app icon PNG** — a proper multi-resolution `.ico` and 512×512/maskable variants are still missing.
5. **Editorial contact inbox unconfirmed** — confirm `contact@pakrummyofficial.com` is real and monitored, or change it, before it's referenced across ~15 pages and all legal documents.
6. **No analytics/Search Console verification configured** — intentional (no invented IDs), but means there's no real-world traffic/engagement data until `docs/analytics-events.md`'s setup steps are completed post-launch.
7. **Operator legal identity still unconfirmed** — `Organization` schema still represents only the publisher (PakRummyOfficial.com), not the game operator; see `docs/required-verification.md`.
8. **No third-party malware scan on the hosted APK** — file-integrity verification (checksum + manifest) was done directly by us; a multi-engine scan (e.g. VirusTotal) was not, since this environment has no API access to one. Recommended before or shortly after launch.
9. **Ludo's availability is unresolved**, not just unverified — the operator's claim and our own manifest check disagree. Needs a real answer before `/games/ludo/` is either built or permanently dropped.
10. **Image usage rights unconfirmed** — the app icon, Rummy/Poker/Crash game art, and Easypaisa/JazzCash logos now in use were extracted from reference material, not supplied with an explicit license. Confirm rights before relying on them commercially.

## Post-launch update 3: Pakistan-themed visual redesign (2026-08-17, same day)

The operator asked for a full visual/UX redesign — new palette (Pakistan green/emerald/gold), new typography (Space Grotesk / Plus Jakarta Sans / IBM Plex Mono), a redesigned hero with a Pakistan-inspired decorative pattern, a "Pak Rummy Status Center" replacing the plain trust strip, a restructured 14-section homepage, and light/dark section rhythm — while preserving all existing URLs, schema, and content. Implementation approach: redefine the existing CSS custom-property tokens (same names, new values) so every component built earlier re-themes automatically, rather than touching all 46 pages individually; only the homepage, `Header`, `Footer`, and a few shared components needed direct edits.

**Two real bugs were found and fixed during this pass, both through direct measurement rather than eyeballing screenshots:**

1. **Reveal-animation content could go permanently invisible.** The new scroll-reveal effect (`.reveal` / `.is-visible`, driven by an `IntersectionObserver`) started elements at `opacity: 0` by default — a page with JS disabled, blocked, or erroring elsewhere would never reveal that content. Fixed with a progressive-enhancement gate (`.js-ready.reveal-armed .reveal`, only added once JS has actually confirmed it can run the reveal) plus a 3-second hard `setTimeout` safety net. While fixing this, a **second, more serious bug** was introduced and caught by a follow-up test: the gated hidden-state selector (3 class selectors, specificity 0,3,0) outranked `.reveal.is-visible` (2 class selectors, specificity 0,2,0), so content stayed invisible **even after** `is-visible` was correctly applied by the observer. Confirmed via real `window.scrollTo()` + `getComputedStyle()` in headless Chrome (not a screenshot) — first showing `opacity: 0` with `is-visible` present in the class list, then `opacity: 1` after raising `.reveal.is-visible`'s specificity to match. Screenshot-based testing during this investigation was actively misleading twice: once because `--window-size`/`driver.manage().window().setRect()` don't reliably produce an exact CSS-pixel viewport in this Chrome/ChromeDriver combination (a 390px request rendered a 500px viewport, making correctly-wrapped text look clipped), and again because `Page.captureScreenshot`'s `captureBeyondViewport` can rasterize content that `IntersectionObserver` never considered "in viewport," making working reveal logic look broken. Ground truth was established with `document.documentElement.scrollWidth`/`innerWidth` via CDP `Emulation.setDeviceMetricsOverride` for overflow, and real `scrollTo` + `getComputedStyle` for the reveal animation.
2. **Color-contrast failures on the new light homepage sections.** `.badge-verified` (`color: #7ce8bc`) and the default link color (`var(--color-gold-strong)`, `#ffd27a`) were tuned for the dark background and hard-coded/token-based in a way that didn't adapt to the new `.section-light` white bands — both fell below WCAG AA on white. Found via `@axe-core/cli` (15 `color-contrast` violations on `/`), fixed by adding a `--color-badge-verified-text` token and overriding it plus `--color-gold`/`--color-gold-strong` to darker, still on-brand values inside `.section-light`. Re-run: 0 violations.

**Re-verification after both fixes:**
- `node node_modules/astro/astro.js check` — 0 errors, 0 warnings, 1 hint (the pre-existing cosmetic `Props` hint on `FactTable.astro`; `TrustStrip.astro` no longer exists, replaced by `StatusPanel.astro`).
- `npm run build` — 46 pages, sitemap regenerated, no change in page count (visual-only pass).
- Static link/duplicate-title/duplicate-description/H1/canonical/robots/JSON-LD crawler — **0 issues** across all 46 pages.
- Horizontal-overflow check via CDP device-metrics override (not window-resize, per the false-alarm above) — `document.documentElement.scrollWidth === window.innerWidth` (0px overflow) confirmed at all 7 required breakpoints: 320, 360, 390, 430, 768, 1024, 1440px.
- `@axe-core/cli` against all 46 built pages — **0 violations** (first run found the 15 contrast issues above, confined to `/`; second run after the fix was clean).
- Real-scroll reveal-animation test (Selenium + `scrollTo` + `getComputedStyle`) — all `.reveal` elements confirmed to reach `opacity: 1; transform: none` after intersecting, not just after the class was added.

**npx note:** `npx astro check` intermittently failed in this shell with `Could not determine Node.js install directory` (unrelated to the code — looked like local `npx` cache flakiness after the earlier `@axe-core/cli` invocations). Worked around by calling `node node_modules/astro/astro.js check` directly; `npm run build`/`npm run preview` were unaffected since they don't go through `npx`.

**Not re-verified in this pass** (unaffected by a visual-only change, already covered above): Lighthouse scores, JSON-LD content correctness, link/metadata uniqueness beyond the automated crawler. Recommend a fresh Lighthouse run before launch given the added web fonts (3 families now self-hosted vs. 2 before) and the small amount of new inline JS (reveal script, `js-ready` guard).

## Post-launch update 4: operator support channels verified (2026-08-17, same day)

The operator supplied a support email (`Support@pakrummy.com`) and live-chat URL (`https://chat.ssrchat.com/service/gv3a8c`) directly. Before marking them verified we fetched the chat URL ourselves (`curl`, browser UA) — `200 OK`, real branded live-chat widget markup ("Online Consultant"), not a dead or placeholder page. Marked both `verified()` in `src/config/site.ts` with a note that we confirmed the channel *exists and was operator-supplied*, not response time or staffing — `/customer-service/` states that distinction on-page rather than implying a stronger claim than was actually checked.

Updated `/customer-service/` (now shows both channels as working CTAs — `mailto:` and an external live-chat link with `target="_blank" rel="noopener noreferrer"`), `/download/`, and `/complaints/` to drop now-inaccurate "not yet confirmed" wording. `StatusPanel`'s "Official support" tile now shows green automatically (it reads `SITE.operatorSupportEmail` directly — no template change needed, same pattern as the earlier APK-verification update).

Re-verified: `node node_modules/astro/astro.js check` (0 errors, 1 pre-existing cosmetic hint), `npm run build` (46 pages, unchanged count), static crawler (0 issues), `@axe-core/cli` on `/customer-service/`, `/download/`, `/complaints/`, `/` (0 violations).

## Post-launch update 5: Telegram channel, real hero screenshot, floating widget (2026-08-17, same day)

Three additions, each following the same "verify before trusting" pattern as earlier updates:

1. **Telegram** (`https://t.me/Pakrummyagents`) — fetched ourselves first (`200`, real public channel titled "Pakrummy agents" per Telegram's own `og:title`), then marked verified in `SITE.operatorSocialProfiles`. Added a floating widget button (`TelegramWidget.astro`, bottom-right, `position: fixed`, 56×56px, safe-area-aware) on the homepage only, per the request's explicit scope, plus a sitewide footer credit line.
2. **Real app screenshot** replacing the hand-built CSS phone mockup in the hero — a genuine device-mockup screenshot of the app's loading screen the operator supplied. Moved to `src/assets/screenshots/` (not `public/`) specifically so Astro's native image pipeline (`astro:assets`, Sharp under the hood) optimizes it automatically: the 3.16MB source PNG ships as an ~11KB WebP with explicit width/height (no CLS risk) and `fetchpriority="high"` since it's the largest above-the-fold visual.
3. Verified the floating Telegram widget doesn't obstruct the hero CTAs or overlap the mobile nav dialog at any required breakpoint.

Re-verified after all three: `node node_modules/astro/astro.js check` (0 errors), `npm run build` (46 pages; new `_astro/*.webp` optimized-image output), static crawler (0 issues), CDP-based overflow check at all 7 breakpoints (0px overflow, only the pre-existing decorative `.pk-glow` extends past bounds and is properly `overflow: hidden`-clipped by its parent), `@axe-core/cli` on `/` (0 violations, including the new `<img>`/floating-link markup).

## Post-launch update 6: hero image fixes, four new game icons, Ludo resolved (2026-08-17, same day)

**Hero image bug (real, not a rendering illusion).** The operator reported the phone screenshot showing a visible background box. Root cause: not the image's transparency (its alpha channel was already confirmed intact through the WebP conversion) — the shared `.tilt-card` class applied a `box-shadow`, which draws along an image's rectangular bounding box regardless of what's transparent inside it. Removed that class from the hero image; kept only `filter: drop-shadow()`, which follows the actual visible pixels. Also enlarged the phone per a follow-up request (220→290px mobile, 260→380px desktop) and bumped the source image's generation width (300→480px) so it stays sharp at the larger size.

**Four new game icons** (Teen Patti, Slots, Aviator, Ludo) supplied by the operator. Checked each before use: `teenpatti.png` resized 512×512→160×160 and converted PNG→WebP (74KB→9.4KB); `Slots.webp` and `aviator.jpg` used as supplied (already small); `aviator.jpg`'s non-square 474×284 source meant `GameCard`'s fixed 48×48 `<img>` needed `object-fit: cover` added (previously relied on square sources only, so this was a latent bug the new asset exposed). Wired into the games grid and each confirmed game's own page hero.

**Ludo resolved.** Previously flagged unverified because no `Ludo` module existed in the app's manifest. The operator confirmed it directly; before accepting that alone, we ran a second technical pass: compared `Nudo`'s (the closest candidate name) file footprint against the six already-confirmed games' footprints, including Rummy's. All seven — Nudo included — have the identical minimal footprint (appear in the main module catalog plus their own per-module sub-manifest, nothing more), which rules out `Nudo` being a stray or orphaned entry. It's structurally indistinguishable from a real module, just under a name that doesn't literally spell "Ludo" — consistent with the app's confirmed precedent of altered internal names (`Carsh` for Crash). We still can't independently prove `Nudo` *is* Ludo, so `verified()` for this one entry rests on the operator's direct confirmation plus supporting-not-conclusive evidence, stated as such in its `verificationNote` rather than blended into the same language used for the other six. Built `/games/ludo/` with the same structure as the other game pages; `/games/` hub and homepage copy updated from "six games" to "seven."

Re-verified: `node node_modules/astro/astro.js check` (0 errors), `npm run build` (47 pages, up from 46 — the new Ludo page), static crawler (0 issues across all 47), `@axe-core/cli` on `/games/`, `/games/ludo/`, `/games/teen-patti/`, `/games/slots/`, `/games/aviator/`, `/` (0 violations).

## Post-launch update 7: full sitewide schema, metadata, AEO, and llms.txt audit (2026-08-17, same day)

Full audit against every one of the 47 built pages (46 indexable + noindexed `/404`), not just the homepage. Custom Node audit script (`full-audit.mjs`) parsed every built `.html` for title/description/canonical/robots/OG/Twitter/H1/JSON-LD, cross-checked against `sitemap-0.xml`, and flagged duplicates, length outliers, missing fields, and unresolved `@id` references.

**Findings and fixes:**
1. **`Article.mainEntityOfPage` pointed at a `WebPage` node that didn't exist** in `ArticleLayout`'s graph (only Organization/WebSite/Article/BreadcrumbList were emitted, no WebPage). Added the missing `WebPage` node with matching dates and breadcrumb reference — `docs/schema-inventory.md` updated, this was a documentation-vs-reality gap, now closed.
2. **Every inner page used generic `WebPage`**, even where a more accurate Schema.org subtype exists. Added optional `type` support to `getWebPageSchema`/`buildStandardPageSchema` and applied it: `AboutPage` (`/about/`), `ContactPage` (`/contact/`), `CollectionPage` (`/games/`, `/guides/`, `/updates/`, `/sitemap/` — each visibly lists a collection).
3. **5 legal pages showed a visible "Effective date / Last revised" line with no matching schema date.** Added `datePublished`/`dateModified` (ISO 8601) to `/terms/`, `/privacy-policy/`, `/cookie-policy/`, `/disclaimer/`, `/dmca/`, matching the visible date exactly — not backdated or invented.
4. **`og:image`/`twitter:image` were unset everywhere** (an open item from earlier passes). Now every page emits `og:image`, `og:image:width`, `og:image:height`, `og:image:alt`, `twitter:image`, `twitter:image:alt` by default, using a real 400×400 upscale of the app icon (`public/images/og-default.png`) — clears both platforms' documented minimums. Twitter card stays `summary` (not `summary_large_image`) since the default image is square, not landscape; `summary_large_image` only activates when a page passes a real `ogImage` explicitly (none currently do).
5. **`robots` meta lacked `max-image-preview:large`** — added to the default value BaseLayout renders (`index, follow, max-image-preview:large`); the one page that overrides `robots` (`/404`) stays `noindex, follow`, correctly excluded from the sitemap.
6. **`/llms.txt` didn't match the requested v2 structure** (title/blockquote summary/`## Main Pages`/`## Guides or Resources`/`## Policies and Trust`/`## Optional`). Rewritten to match exactly, all 41 linked URLs absolute HTTPS, no tracking params, no staging links, no invented claims.
7. **Two thin titles improved**: homepage (69→58 chars, dropped a redundant trailing brand repeat) and `/about/` (26→61 chars, added real descriptive value: "Independent Pak Rummy Resource"). Other short titles (legal/trust utility pages like `/terms/`, `/disclaimer/`) were left as-is — deliberately concise and accurate rather than padded to hit a character target, per the brief's own "avoid boilerplate" instruction.
8. **`Content-Type` header gap for `/llms.txt`/`/robots.txt`** on prerendered static output — added `public/_headers` (Netlify/Cloudflare Pages convention); documented that Vercel would need an equivalent `vercel.json` config if that's the eventual host (unconfirmed).

**Confirmed already correct, no change needed:** 0 duplicate titles, 0 duplicate descriptions across all 46 indexable pages; every page self-canonicalizes with an absolute HTTPS URL matching its sitemap entry; `html lang="en"` on every page; exactly one `<h1>` per page; no `FAQPage` schema anywhere (confirmed intentional per Google's 2026 retirement); no fabricated `AggregateRating`/`Review`/`offers`/price on any page; `SoftwareApplication` on `/download/` only emits because all three required facts are genuinely `verified()` — confirmed rendering with an absolute `downloadUrl`; no `hreflang` (correct — single-language site, no regional variants exist to annotate); no obsolete `meta keywords` tag anywhere; sitemap contains exactly the 46 indexable URLs and nothing else (no noindexed or duplicate URLs).

**Validation commands run:**
```
node node_modules/astro/astro.js check   # 0 errors, 0 warnings, 1 pre-existing cosmetic hint
npm run build                             # 47 pages
node full-audit.mjs                       # custom metadata/schema/sitemap cross-check against dist/
node qa-crawl.mjs                         # links, duplicate titles/descriptions, H1, alt text, JSON-LD parse — 0 issues
npm run preview
curl -sD - http://localhost:PORT/llms.txt         # 200, verified full v2 content
curl -sD - http://localhost:PORT/robots.txt       # 200, sitemap declared
curl -s http://localhost:PORT/sitemap-index.xml   # verified single sitemap-0.xml reference
npx @axe-core/cli <all 47 URLs> --exit    # 0 violations, run twice (before/after the ArticleLayout fix)
python3 -c "..." (spot-parsed JSON-LD for /download/ and a guide article, confirmed @id resolution)
```

**Limitations honestly stated:** this was validated against the local Astro preview server, not the live production domain — the `_headers` Content-Type fix in particular must be re-tested post-deploy with `curl -sI https://pakrummyofficial.com/llms.txt` and `.../robots.txt`, since local `astro preview` does not necessarily match the final host's static-file header behavior. No live Google Rich Results Test / Schema.org validator API call was made (no network access to those specific external validators from this environment); JSON-LD was instead validated by parsing every block with `JSON.parse()` (structural validity) and manually cross-checking required/recommended properties for each type used (`SoftwareApplication`, `Article`, `BreadcrumbList`, `Organization`, `WebSite`, `WebPage` + subtypes) against current Schema.org definitions. Recommend running the live pages through Google's Rich Results Test and the Schema.org validator after deployment as a final cross-check.

## Post-launch update 8: two breadcrumb defects, one caught by the recommendation above (2026-08-21)

**Fix 1 — duplicate crumb entries on 3 pages.** `/about/`, `/customer-service/`, `/terms/` each had an extra self-referencing crumb (e.g. "Home / Company / About", where "Company" and "About" pointed at the identical URL) instead of the clean 2-level trail every other hub page uses. Found by direct inspection, not an external report. Fixed to `Home / About`, `Home / Customer Service`, `Home / Terms of Use`. Verified with a script scanning every built page's `BreadcrumbList.itemListElement` for duplicate `item` URLs — 0 across all 47 pages after the fix.

**Fix 2 — `WebPage.breadcrumb` referenced a node that never existed, sitewide.** The operator ran the live `/register-login/` page through Google's Rich Results Test — exactly what the previous entry above recommended — and it came back "Some are invalid," flagging an "Unnamed item" with "Missing field itemListElement" at `@id` `.../register-login/#breadcrumb`. Root cause: `getWebPageSchema()` in `src/lib/schema.ts` has always set `schema.breadcrumb = {'@id': `${url}#breadcrumb`}`, but `getBreadcrumbSchema()` never actually assigned that `@id` to the `BreadcrumbList` node it built — the reference pointed at nothing, on **every page site-wide**, not a one-off. This had been live and unnoticed since the original schema build. `JSON.parse()`-based validation (this project's own QA method) can't catch a dangling reference like this — it's syntactically valid JSON, just semantically incomplete — which is exactly why the doc above already recommended an external validator as a final cross-check, and exactly what caught it.

Fix: `getBreadcrumbSchema(items, pageUrl)` now takes the page's canonical URL and sets `'@id': `${pageUrl}#breadcrumb`` to match what `getWebPageSchema` already references. Updated all 3 call sites: `buildStandardPageSchema` (every standard inner page), `ArticleLayout` (guides/updates), and `/download/`'s inline graph (the one page that doesn't use `buildStandardPageSchema`).

**Validation**: wrote a script (not just `JSON.parse()`) that, for every built page, collects every `@id` actually defined in its graph and checks every `WebPage`-family node's `breadcrumb.@id` resolves to one of them — 0 broken references across all 46 pages with JSON-LD (up from an unknown-but-nonzero number before, since this check had never been run). Confirmed directly on `/register-login/` (the reported page): `WebPage.breadcrumb` now points at `.../register-login/#breadcrumb`, and a `BreadcrumbList` node with that exact `@id` and its 3-item `itemListElement` exists in the same graph. Also re-ran: `node node_modules/astro/astro.js check` (0 errors), `npm run build` (47 pages), static link/metadata crawler (0 issues), `@axe-core/cli` on 5 representative pages across every affected template — homepage, download (SoftwareApplication), a game page, a guide article, and the reported page itself (0 violations, 1 transient chromedriver hiccup on first attempt that cleared on retry with the same page — not a real finding).

**Lesson for this project specifically**: `docs/schema-inventory.md` had explicitly claimed `breadcrumb` references resolved correctly — that claim was wrong and has been corrected in place rather than quietly overwritten. External validation (Rich Results Test, Schema.org validator) catches a category of bug this project's own `JSON.parse()`-based tooling structurally cannot; treat it as a required step, not an optional nice-to-have, before trusting a "0 issues" result from local tooling alone.

## Post-launch update 9: blog infrastructure added (2026-08-21, same day)

Built in response to a request for regular blog publishing on the site. Added:

1. **New `blog` content collection** (`src/content/config.ts`) — same shape as `guides` (`title`, `description` ≤200 chars, `publishDate`, `updatedDate?`, `author`, `relatedLinks`, `draft`) but with a `category` enum scoped to blog-style topics: `strategy`, `pakistan`, `responsible-gaming`, `payments`, `industry`.
2. **`BlogPosting` schema support** — `getArticleSchema()` (`src/lib/schema.ts`) now accepts an optional `type: 'Article' | 'BlogPosting'` (defaults to `'Article'`, so `guides`/`updates` are unaffected); `ArticleLayout.astro` exposes it as a `schemaType` prop.
3. **`/blog/` hub** (mirrors `/guides/` structure) and **`/blog/[slug]/`** dynamic route (mirrors `/guides/[slug]/`, passes `schemaType="BlogPosting"`, `hubLabel="Blog"`).
4. **Nav wiring**: "Blog" added to the Guides dropdown in `PRIMARY_NAV` and the Guides column in `FOOTER_NAV` (`src/config/nav.ts`).
5. **`llms.txt`**: added a Blog entry under `## Guides or Resources`.
6. **Homepage "Latest from us"**: now pulls 2 updates + 1 guide + 1 blog post (previously 2 + 2), with a new "All blog posts" link.
7. **One seed post published**: `rummy-strategy-fundamentals-for-beginners` — general 13-card Rummy strategy knowledge (sequence priority, deadwood discipline, reading discards), explicitly scoped as evergreen and not a claim about the Pak Rummy app's specific table configuration, consistent with the site's no-fabrication rule.

**Cadence decision, stated explicitly before building further**: the request was for "daily" posting. Flagged directly that a literal daily news cadence isn't sustainable for a site with one operator and a limited pool of independently verifiable facts, without eventually forcing either thin filler or fabricated claims — both against this site's core identity. Resolution: the `blog` collection's category scope is deliberately evergreen/general-knowledge (strategy, payments-ecosystem context, responsible-gaming reading, Pakistan mobile-gaming context) rather than an operator "news" feed, so a frequent cadence is achievable without inventing operator facts — genuine strategy and context content doesn't run out the way "what's new with the operator" does. Automation/scheduling mechanics were intentionally not decided unilaterally; see the follow-up question posed to the operator in-session.

**Verification performed**: `node node_modules/astro/astro.js sync` (regenerated collection types), `node node_modules/astro/astro.js check` (0 errors, 0 warnings, 1 pre-existing cosmetic hint, unrelated), `npm run build` (49 pages, up from 47 — the new `/blog/` hub and 1 post), a custom script parsing every built page's JSON-LD and checking every `@id` reference resolves within its own graph (48 pages with JSON-LD checked — the 49th being the noindexed `/404` — 0 parse failures, 0 broken references), a full internal-link crawl of the built `dist/` output (0 broken internal links), and direct inspection of the blog post's JSON-LD confirming `BlogPosting` (not `Article`) with both `breadcrumb` and `mainEntityOfPage` references resolving correctly.
