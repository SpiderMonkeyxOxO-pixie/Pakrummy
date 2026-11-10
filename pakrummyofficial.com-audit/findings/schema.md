# Schema.org / Structured Data Audit — pakrummyofficial.com

Scope: all 64 URLs in `D:\PakrummyOfficial\pakrummyofficial.com-audit\url-list.txt`. Method: full source review of the shared schema-generation library plus every page/layout that calls it (45 files), cross-checked against live-rendered JSON-LD pulled via `render_page.py --mode never --json-ld-output` for 6 representative URLs across every page archetype (home, a static inner page, a legal/policy page, a games hub page, a guide, a blog post, an update). Because every one of the 64 pages funnels through one of exactly two code paths — `buildStandardPageSchema()` (static pages) or `ArticleLayout.astro` (all blog/guide/update entries) — the findings below apply uniformly site-wide, not just to the sampled URLs; there is no per-page override anywhere in `src/pages`.

## 1. Schema-generation architecture (source)

- `src/lib/schema.ts` — low-level builders: `getOrganizationSchema`, `getWebsiteSchema`, `getBreadcrumbSchema`, `getWebPageSchema`, `getArticleSchema`, `getPersonSchema`, `getSoftwareApplicationSchema`, `buildJsonLdGraph`.
- `src/lib/pageSchema.ts` — `buildStandardPageSchema()`, a convenience wrapper combining Organization + WebSite + WebPage(+subtype) + BreadcrumbList. Used by **35** of the 41 static `index.astro` pages.
- `src/layouts/ArticleLayout.astro` — same four nodes plus `Article`/`BlogPosting`, used by all three content collections (`blog`, `guides`, `updates`) via their `[slug]/index.astro` dynamic routes. Every blog post, guide, and update entry is rendered through this single component — there is no way for an individual post to diverge from the shared graph shape.
- `src/pages/download/index.astro` and `src/pages/index.astro` call the low-level builders directly to add `SoftwareApplication` (download page only) and omit `BreadcrumbList` (home page only, correctly — a self-referencing breadcrumb on the homepage is not meaningful).
- Every page emits exactly **one** `<script type="application/ld+json">` containing a single `@graph` array (confirmed in `src/layouts/BaseLayout.astro:104-108` and in all 6 live-rendered samples — `block_count: 1` every time). No duplicate/competing JSON-LD blocks anywhere.

## 2. Detected schema types (site-wide)

| Type | Where | Count (of 64 URLs) |
|---|---|---|
| Organization | Every page | 64/64 |
| WebSite | Every page | 64/64 |
| WebPage (+ AboutPage/ContactPage/CollectionPage subtypes) | Every page | 64/64 |
| BreadcrumbList | Every page except home | 63/64 |
| Article | Guides (3) + Updates (1) + non-commentary blog posts | 4+ |
| BlogPosting | Blog posts (16) | 16 |
| SoftwareApplication | `/download/` only | 1/64 |
| Person (as `author`) | Every Article/BlogPosting (20 pages) | 20 |

No FAQPage, HowTo, QAPage, Review, AggregateRating, JobPosting, VideoObject, SpecialAnnouncement, or any other type was found anywhere in `src/` — confirmed via a full-repo grep. This is **correct and deliberate**, not a gap:
- No HowTo markup exists even though `/install/` (`src/pages/install/index.astro:42-50`) and `/download/` (`src/pages/download/index.astro:95-101`) both contain plain, unmarked-up numbered `<ol>` step lists that are textbook HowTo candidates pre-2023. Good — HowTo rich results were removed September 2023; not using it here is the right call and should stay that way.
- No FAQPage markup exists even though the homepage has a visible "Pakistan player FAQ" `<dl>` block (`src/pages/index.astro:150-166`, 3 Q&As). Correct per current policy: Google retired FAQ rich results for all sites (May 7 2026), so adding FAQPage here would have no SERP benefit. If the orchestrator/user wants to explore GEO/AI-citation benefit from adding it anyway, flag that the benefit is **unconfirmed** before doing so — don't add it as a default recommendation.
- No Review/AggregateRating anywhere — correct, since the site has no verified rating to report (consistent with the `Verified<T>` discipline: an invented star rating would be exactly the kind of unsupported claim that framework exists to prevent).

## 3. Validation results

### 3.1 Finding #5 (breadcrumb `@id` bug, fixed 2026-08-21) — **VERIFIED HOLDING, site-wide**
Checked both in source (`src/lib/schema.ts:46-57`, `src/lib/pageSchema.ts:53`) and live on 5 sampled inner pages (`/download/`, `/terms/`, `/games/rummy/`, `/guides/rummy-scoring-explained/`, `/blog/why-is-my-withdrawal-pending/`, `/updates/site-launch/`). In every case:
- `WebPage.breadcrumb` is a reference `{"@id": "<url>#breadcrumb"}`.
- A `BreadcrumbList` node with that exact `@id` exists elsewhere in the same `@graph`.
- No duplicate `ListItem` entries (each page's breadcrumb trail has distinct position/name/item values, 2–3 levels deep as appropriate).

Because `getBreadcrumbSchema()` and `getWebPageSchema()` are the only two functions in the codebase that ever produce a `breadcrumb`/`BreadcrumbList` pair, and every page calls both through the same two entry points (`buildStandardPageSchema` or `ArticleLayout`), this fix is structurally guaranteed to hold across all 63 non-home URLs, not just the sampled ones — there is no code path left that could regress it independently. **Pass, confidently site-wide.**

### 3.2 `@id` uniqueness / no duplicates or conflicts
- `Organization` (`#publisher`) and `WebSite` (`#website`) use the **same global `@id`** on every page — this is correct, intentional `@graph` design (the same real-world entity referenced from many pages), not a duplicate-ID bug.
- Per-page nodes (`WebPage`, `BreadcrumbList`, `Article`/`BlogPosting`) are keyed off `${canonical_url}#fragment`, which is unique by construction since every page has a distinct canonical URL. No collisions found or possible given the templating.
- `SoftwareApplication` on `/download/` uses `${SITE.productionUrl}/download/#app` — unique, fine.
- **Pass.** No duplicate or conflicting `@id` values found anywhere in the sampled graphs or in the generating code.

### 3.3 JSON-LD syntax
- `@context` is `"https://schema.org"` (https, not http) — correct everywhere (`buildJsonLdGraph`, `src/lib/schema.ts:188`).
- Output is a single `@graph` array wrapped by `JSON.stringify`, injected via Astro `set:html` — valid, parseable JSON confirmed in all 6 live pulls (`"valid": true` in every `render_page.py` block summary).
- Dates are ISO 8601 (`YYYY-MM-DD`) throughout — confirmed in `src/content/blog/*.md`, `src/content/guides/*.md`, `src/content/updates/*.md` frontmatter and in live output (`"datePublished": "2026-10-19"` etc.).
- URLs are absolute everywhere (`new URL(path, SITE.productionUrl).toString()` pattern used consistently) — no relative URLs found in any JSON-LD node.
- No placeholder text (e.g. `[Business Name]`) found in any generated schema — all values trace back to `SITE` constants or content-collection frontmatter.
- **Pass** on all 7 checklist items from the skill's validation checklist.

### 3.4 Schema vs. visible content accuracy (YMYL-relevant)
- `Organization.description` is `SITE.positioning` verbatim — matches the disclosed site identity exactly (no overclaiming about being the game operator). **Pass.**
- `SoftwareApplication` on `/download/` only renders when `officialDownloadUrl`, `appVersion`, and `appPackageName` are all `status: 'verified'` (`getSoftwareApplicationSchema()`, `src/lib/schema.ts:156-162` — returns `null` otherwise). Live-checked: it renders, and every value traces to a verified fact in `src/config/site.ts` (version `1.1.2`, package `com.rummy.pak.games`, file size `38.7MB`, `datePublished: 2026-08-17` = `appLastVerifiedDate`). This is a genuinely well-built, honest implementation of the "don't assert unverified facts" principle inside structured data, not just in visible copy. **Pass — and worth calling out as a positive pattern other category-audits (content, GEO) can point to.**
- **Issue found — author schema type mismatch (Critical for E-E-A-T accuracy, not a Google rich-result blocker):** Every single Article/BlogPosting on the site (all 16 blog posts, all 3 guides, the 1 update — 20 pages total) declares:
  ```json
  "author": { "@type": "Person", "name": "PakRummyOfficial.com Editorial Team" }
  ```
  This is generated by `getArticleSchema()` (`src/lib/schema.ts:118-121`), which hardcodes `'@type': 'Person'` regardless of the name passed in. But `/authors/` (`src/pages/authors/index.astro:24-27`) explicitly and deliberately states: *"Content on this site is currently produced and verified collectively by the PakRummyOfficial.com editorial team rather than under individual bylines. We'll list named contributors here once the team is staffed publicly — we won't invent names or bios to fill this page in the meantime."*

  Declaring a collective editorial team as `@type: Person` is a factual mismatch between the structured data and the page's own disclosed reality — exactly the kind of "unsupported claim" the site's `Verified<T>` framework exists to prevent everywhere else. It also doesn't help E-E-A-T: Google's guidance values genuine named-author attribution for YMYL content; asserting `Person` for an entity that is openly not a person doesn't manufacture that signal, it just creates an inconsistency a manual reviewer (or a future schema validator) would flag. Checked and confirmed live on every sampled article-type page (`/blog/why-is-my-withdrawal-pending/`, `/guides/rummy-scoring-explained/`, `/updates/site-launch/`) — 100% of the 20 article-type pages have this exact issue, since all three content collections hardcode the same author string (`src/content/blog/*.md:5`, `src/content/guides/*.md:5`, and `src/pages/updates/[slug]/index.astro:26`).

  **Fix recommended below in §5.1** — minimal, honest change: type it `Organization` and reuse the existing `#publisher` node instead of inventing a second entity.

## 4. Missing schema opportunities

1. **Author type fix** (see above / §5.1) — affects all 20 article-type pages.
2. **`Organization.logo`** — not currently set anywhere. Google's Organization guidance recommends `logo` for brand/knowledge-panel eligibility. The site already has a real, non-placeholder square icon in production use (`/images/pak-rummy-app-icon.png`, used as the favicon/apple-touch-icon in `BaseLayout.astro:97-98` and as the visible app icon on `/download/`). Safe to add — it's not a new fact, it's wiring an already-verified asset into the existing node.
3. **Missing `image` on 5 of 20 Article/BlogPosting pages** — the `guides` and `updates` content-collection Zod schemas (`src/content/config.ts`) don't even have an `image` field, and one blog post (`rummy-strategy-fundamentals-for-beginners.md`) omits the optional `image` frontmatter. Confirmed live on `/updates/site-launch/` — no `image` property on its `Article` node. `image` is a Google-recommended property for Article-type rich results (Top Stories/Discover eligibility); its absence doesn't break validity but these 5 pages (3 guides, 1 blog post, 1 update) can't qualify for an enhanced image-bearing Article result. Low priority — would require adding a real hero image for each, not a copy-paste schema fix.
4. **`SoftwareApplication` (`/download/`) has no `offers` or `aggregateRating`.** Google's eligibility criteria for the Software App rich result (star rating in search) require `aggregateRating`/`review` and typically `offers`. The site correctly does **not** fabricate a rating it hasn't verified — consistent with `Verified<T>` and genuinely the right call; don't add a fake rating to chase the rich result. `offers` (e.g. `price: "0"`) could arguably be added since this is a free-to-download APK, but that specific fact ("free to download") is not currently asserted anywhere in the site's visible copy or in `SITE` — per the site's own fact-verification discipline, recommend confirming with the operator/site owner before asserting it in schema, rather than assuming it.
5. **No `WebSite.potentialAction` (SearchAction)** — the site has no on-site search feature, so this is correctly absent, not a gap.
6. **FAQPage on the homepage's existing visible FAQ** — intentionally not recommending this as a default action per current policy (no Google SERP benefit; AI/GEO benefit unconfirmed). Flagging only as something to revisit jointly with the GEO/AI-search audit category if the user wants to weigh that unconfirmed upside.

## 5. Generated JSON-LD for recommended fixes

### 5.1 Fix the author type mismatch (Critical — apply first)

In `src/lib/schema.ts`, `getArticleSchema()` currently (lines 107–126) hardcodes the author as a `Person`:

```ts
author: {
  '@type': 'Person',
  name: input.authorName,
},
```

Recommended replacement — reuse the site's own `Organization` node as the author, since every current usage is in fact the editorial team, not an individual:

```ts
export function getArticleSchema(input: ArticleSchemaInput) {
  const schema: Record<string, unknown> = {
    '@type': input.type ?? 'Article',
    '@id': `${input.url}#article`,
    headline: input.headline,
    description: input.description,
    url: input.url,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    inLanguage: SITE.language,
    publisher: { '@id': ORGANIZATION_ID },
    author: { '@id': ORGANIZATION_ID },
    mainEntityOfPage: { '@id': `${input.url}#webpage` },
  };
  if (input.image) schema.image = input.image;
  return schema;
}
```

This drops the now-unused `authorName`/`author` string entirely from the article schema path (keep `getPersonSchema()` and the `authorName` prop threading intact in `ArticleLayout.astro` for the visible "By {author}" byline text — that's accurate prose, the problem was only the structured-data `@type`). Result on `/blog/why-is-my-withdrawal-pending/` becomes:

```json
{
  "@type": "BlogPosting",
  "@id": "https://pakrummyofficial.com/blog/why-is-my-withdrawal-pending/#article",
  "headline": "Why Is My Withdrawal Pending? Common Reasons Explained",
  "description": "The most common reasons a gaming app withdrawal shows as pending: verification delays, processing windows, and when to actually be concerned.",
  "url": "https://pakrummyofficial.com/blog/why-is-my-withdrawal-pending/",
  "datePublished": "2026-10-19",
  "dateModified": "2026-10-19",
  "inLanguage": "en-PK",
  "publisher": { "@id": "https://pakrummyofficial.com/#publisher" },
  "author": { "@id": "https://pakrummyofficial.com/#publisher" },
  "mainEntityOfPage": { "@id": "https://pakrummyofficial.com/blog/why-is-my-withdrawal-pending/#webpage" },
  "image": "https://pakrummyofficial.com/images/blog-why-is-my-withdrawal-pending-hero.webp"
}
```

If the site later staffs named, publicly-attributed authors (per the `/authors/` page's own stated intent — "We'll list named contributors here once the team is staffed publicly"), switch that specific post's author back to a real `Person` node (with a real name, not a placeholder) at that time — don't do it now while the team is explicitly unnamed.

### 5.2 Add `Organization.logo`

In `src/lib/schema.ts`, `getOrganizationSchema()`:

```ts
export function getOrganizationSchema() {
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: SITE.publisherName,
    url: SITE.productionUrl,
    description: SITE.positioning,
    logo: new URL('/images/pak-rummy-app-icon.png', SITE.productionUrl).toString(),
  };
}
```

### 5.3 SoftwareApplication — leave rating/offers out for now, documented reasoning

No code change recommended here; this is a "don't add" recommendation. If the site owner later confirms the APK is free to download and wants it reflected in structured data, add:

```json
"offers": {
  "@type": "Offer",
  "price": "0",
  "priceCurrency": "PKR"
}
```
to the `SoftwareApplication` node in `getSoftwareApplicationSchema()` (`src/lib/schema.ts:164-173`) — only after that fact is verified in `SITE`, following the same `Verified<T>` gate already used for the rest of that function.

## 6. Summary

| Check | Result |
|---|---|
| Breadcrumb `@id` fix (Finding #5) holds site-wide | ✅ Pass — verified in source + 6 live samples |
| Duplicate/conflicting `@id` values | ✅ None found |
| JSON-LD syntax (context, types, dates, absolute URLs, no placeholders) | ✅ Pass on all 64 pages |
| Deprecated types (HowTo, SpecialAnnouncement, etc.) | ✅ None present |
| FAQPage | ✅ Correctly absent despite visible homepage FAQ content |
| Review/AggregateRating | ✅ Correctly absent (no fabricated ratings) |
| SoftwareApplication fact accuracy | ✅ Pass — gated on verified facts only |
| Author schema type (`Person` vs reality) | ❌ Mismatch on all 20 article-type pages — fix in §5.1 |
| `Organization.logo` | ⚠️ Missing, low-effort safe addition — §5.2 |
| `image` on Article schema | ⚠️ Missing on 5/20 article-type pages (guides ×3, 1 blog post, 1 update) |

Files referenced: `D:\PakrummyOfficial\src\lib\schema.ts`, `D:\PakrummyOfficial\src\lib\pageSchema.ts`, `D:\PakrummyOfficial\src\layouts\ArticleLayout.astro`, `D:\PakrummyOfficial\src\pages\download\index.astro`, `D:\PakrummyOfficial\src\pages\index.astro`, `D:\PakrummyOfficial\src\pages\authors\index.astro`, `D:\PakrummyOfficial\src\pages\updates\[slug]\index.astro`, `D:\PakrummyOfficial\src\content\config.ts`, `D:\PakrummyOfficial\src\config\site.ts`.
