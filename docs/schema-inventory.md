# Structured data inventory

All JSON-LD is built by typed helpers in `src/lib/schema.ts` and assembled per page via `buildJsonLdGraph()`, which drops any `null` node — so a page only ever emits schema it can actually back with visible content. Every page emits a single `<script type="application/ld+json">` containing one `@graph`.

## Global nodes (every indexable page)

| Type | `@id` | Source | Notes |
| --- | --- | --- | --- |
| `Organization` | `{domain}/#publisher` | `getOrganizationSchema()` | Represents **PakRummyOfficial.com the publisher**, not the Pak Rummy game operator — operator legal identity is unverified (see `docs/required-verification.md`), so no operator `Organization` node is emitted anywhere, and no `sameAs` social links are included until profiles are confirmed. |
| `WebSite` | `{domain}/#website` | `getWebsiteSchema()` | No `potentialAction` (site search) — there is no site search feature to describe. |
| `WebPage` (or a subtype) | `{url}#webpage` | `getWebPageSchema()` | `datePublished`/`dateModified` are only set where the page component passes them — article pages, and (added 2026-08-17) the five legal pages that visibly show an "Effective date / Last revised" line (`/terms/`, `/privacy-policy/`, `/cookie-policy/`, `/disclaimer/`, `/dmca/`). Everywhere else, omitted rather than guessed. **Subtype (added 2026-08-17)**: `getWebPageSchema`/`buildStandardPageSchema` accept an optional `type` — used for `AboutPage` (`/about/`), `ContactPage` (`/contact/`), and `CollectionPage` (`/games/`, `/guides/`, `/updates/`, `/sitemap/`, since each visibly lists a collection of items). Every other inner page stays plain `WebPage` rather than forcing a subtype that doesn't clearly apply. |
| `BreadcrumbList` | `{url}#breadcrumb` | `getBreadcrumbSchema()` | Built from the same `crumbs` array that renders the visible `<Breadcrumbs>` component — schema and visible breadcrumbs can't drift apart because they share one source array per page. |

Built via the shared `buildStandardPageSchema()` helper (`src/lib/pageSchema.ts`) on every inner page except where noted below.

## Homepage (`/`)

Organization + WebSite + WebPage only (no breadcrumb — it's the root).

## `/download/`

Organization + WebSite + WebPage + BreadcrumbList, **plus** `SoftwareApplication` — emitted only when `getSoftwareApplicationSchema()` finds `officialDownloadUrl`, `appVersion`, and `appPackageName` all marked `verified` in `src/config/site.ts`; otherwise it returns `null` and `buildJsonLdGraph()` silently omits the node, so an unverified download never gets a `SoftwareApplication` claim it can't back.

**Update, 2026-08-17**: all three fields were verified this same day (see `docs/required-verification.md`) after the site operator supplied and confirmed an APK, and the node now appears automatically — no template change was needed, exactly as designed. `downloadUrl` is resolved to an absolute URL (`https://pakrummyofficial.com/downloads/pakrummy.apk`) via `new URL(..., SITE.productionUrl)` rather than left relative, since JSON-LD URL properties should be absolute.

## Guide articles (`/guides/[slug]/`) and update entries (`/updates/[slug]/`)

Organization + WebSite + `WebPage` + `Article` + BreadcrumbList, via `ArticleLayout.astro` → `getArticleSchema()`. `author` is always a real `Person` sub-node built from the frontmatter `author` field (currently "PakRummyOfficial.com Editorial Team" for all entries, since no named individual bylines exist yet — see `/authors/` and `docs/required-verification.md`). No `Person` is fabricated with a fake name or headshot.

**Fixed 2026-08-17**: `ArticleLayout` previously omitted the `WebPage` node entirely, even though `Article.mainEntityOfPage` referenced `{url}#webpage` — a dangling `@id` that pointed at nothing defined in the graph. Not invalid JSON-LD, but inconsistent with every other template and with the claim below that all internal references resolve. Added the `WebPage` node (carrying the same breadcrumb reference and dates as the `Article`) so `mainEntityOfPage` now resolves to a real node, matching the pattern `buildStandardPageSchema()` already used everywhere else.

## Not implemented, and why

- **`AggregateRating` / `Review`**: no genuine, traceable rating data exists for Pak Rummy on this site, so this schema type is never emitted anywhere, including the games and download pages that a template like this often carries it on other sites.
- **`FAQPage`**: the homepage and `/common-errors/` show visible Q&A content for readers, but per the brief we do not wrap it in `FAQPage` schema — Google retired the FAQ rich-result feature in 2026, so there's no rich-result upside, and marking it up would be maintenance overhead with no benefit.
- **`VideoObject`**: no page embeds real video.
- **Operator `Organization`**: see the Global nodes note above — would require a verified legal entity name.

## Validation performed

Every build's JSON-LD blocks were parsed with `JSON.parse()` across all 46 indexable pages (47 built pages minus the noindexed `/404`) as part of the QA crawl (`docs/qa-report.md`) — 0 parse failures, one graph per page, every graph resolves its internal `@id` references (`isPartOf`, `publisher`, `breadcrumb`, `mainEntityOfPage`) to a node that exists somewhere in the same graph or a global node defined above (see the `mainEntityOfPage` fix above — this is now actually true, not just intended).

Full sitewide schema/metadata/`llms.txt` re-audit: 2026-08-17, see `docs/qa-report.md`'s dated entry for commands and results.
