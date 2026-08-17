# Content inventory

## Published pages (45 indexable + 1 noindex 404 = 46 total)

### Brand and application (8)

`/`, `/download/`, `/install/`, `/app-version/`, `/updates/`, `/official-domains/`, `/safety/`, `/apk-permissions/`

### Account and payments (11)

`/register-login/`, `/account-verification/`, `/promo-code/`, `/bonuses/`, `/deposit/`, `/withdrawal/`, `/easypaisa-jazzcash/`, `/customer-service/`, `/common-errors/`, `/account-deletion/`, `/complaints/`

### Game library (7 published — resolved 2026-08-17)

`/games/`, `/games/rummy/`, `/games/teen-patti/`, `/games/poker/`, `/games/slots/`, `/games/aviator/`, `/games/crash/`

Each of the six game pages carries an on-page "How we confirmed this" callout citing the exact module name found in the app's own hot-update manifest — see `docs/required-verification.md`. `/games/ludo/` is not published; see below.

### Company and trust (8)

`/about/`, `/contact/`, `/responsible-gaming/`, `/age-restrictions/`, `/legal-status/`, `/editorial-policy/`, `/corrections-policy/`, `/authors/`

### Legal (5)

`/terms/`, `/privacy-policy/`, `/cookie-policy/`, `/disclaimer/`, `/dmca/`

### Publishing infrastructure (2 hubs + entries)

- `/guides/` hub + 3 published articles (`enable-unknown-sources-android`, `rummy-scoring-explained`, `mobile-wallet-deposit-delay`)
- `/updates/` hub + 1 published entry (`site-launch`)
- `/sitemap/` (HTML sitemap)
- `/404` (noindex)

## Deliberately not published

| Page | Why |
| --- | --- |
| `/games/ludo/` | We checked the app's own bundled module manifest specifically for Ludo and found no match, despite finding direct matches for the other five games the operator told us to expect (Rummy, Teen Patti, Poker, Slots, Aviator, Crash). The one "ludo" string we found elsewhere in the app's assets turned out to be an Esperanto localization string, not the board game. `src/config/games.ts` keeps `ludo` at `verified: false` pending a real source — see `docs/required-verification.md`. Flip `verified: true` once confirmed and a page + nav entry appears automatically (`src/config/nav.ts` derives the Games dropdown from this same list). |
| `/pakrummy2/` | No verified relationship between this string and the Pak Rummy brand was found during the audit (see `docs/pre-build-audit.md`); publishing it would have implied an affiliation we can't support. |
| Spelling-variant thin pages (e.g. separate pages for "pakrummy" vs "pak rummy") | Per the brief, these intents are consolidated on the homepage rather than split into near-duplicate pages — see `docs/seo-keyword-map.md`. |

## Content collections

Two Astro content collections back the publishing infrastructure, schema-validated in `src/content/config.ts`:

- **`guides`** — long-form, evergreen how-to/troubleshooting articles, distinct from the core product pages (e.g. `/install/`). Each entry requires `title`, `description` (≤200 chars), `publishDate`, `author`, `category`, and at least 2 `relatedLinks`.
- **`updates`** — dated changelog-style entries with a `verified: boolean` flag, rendered with a Verified/Unverified badge on `/updates/`.

Adding a new guide or update is a matter of dropping a new `.md` file into `src/content/guides/` or `src/content/updates/`; `[slug].astro` in each directory generates the route and page automatically via `getStaticPaths()`.

## Word-count sanity

No page was padded to hit a length target. Product/trust pages run roughly 350–650 words of original prose; guide articles run 500–900 words. Legal pages are longer by nature (clause-by-clause templates) but are explicitly marked draft/pending review rather than presented as finished length-optimized SEO copy.
