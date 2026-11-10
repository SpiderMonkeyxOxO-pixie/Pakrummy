# Content Quality & E-E-A-T: pakrummyofficial.com

**Audit date:** 2026-11-10. **Scope:** 64 URLs from `url-list.txt`. **Auditor:** content-quality sub-agent.

**Method**
- Built the current `main` branch (synced with origin as of 2026-11-10) into a scratch output dir. The checked-in `dist/` is stale (built Oct 8, only 4 blog posts), so it wasn't used.
- Pulled the text inside `<main>` from all 64 built pages (header, nav and footer stripped; the article `<header>` byline block is also excluded) and computed word counts, Flesch Reading Ease and Flesch-Kincaid grade, and 5-gram shingle containment between every pair of pages.
- Spot-checked against the LIVE site with `render_page.py` (/withdrawal/, /blog/why-is-my-withdrawal-pending/, /authors/). The live pages match the build.
- Ran `metadata_template.py` site-wide on all 64 title/description pairs.

---

## Scores

| Metric | Score |
|---|---|
| **Content quality (overall)** | **52 / 100** |
| E-E-A-T, weighted (internal model; Google publishes no weights) | **45 / 100** |
| Experience (20%) | 55 |
| Expertise (25%) | 40 |
| Authoritativeness (25%) | 30 |
| Trustworthiness (30%) | 55 |
| **AI citation readiness** | **68 / 100** (content side only; robots.txt AI-crawler policy is out of scope here, see geo/agentic) |
| Templated metadata risk | **low** (0 of 64 templated, `templated_ratio` 0.0, no `shared_cta_phrases`) |

Weighted E-E-A-T: 0.20×55 + 0.25×40 + 0.25×30 + 0.30×55 = 45.

**What's strong**
- The verification work is real first-hand work: a self-computed SHA-256, the manifest permissions list, the module-name analysis including the "Nudo"/"Carsh" codenames, and a dated competitor check on /card-rummy-vs-pak-rummy/.
- Every article opens with a self-contained direct answer.
- Responsible-gaming framing is consistent.
- No hype, guaranteed-earnings or fabricated-testimonial language anywhere.

**What drags the score down**
1. The site contradicts itself about who it is.
2. There is no named, credentialed person anywhere.
3. No article cites a single external source.
4. Money pages (/deposit/, /withdrawal/, /bonuses/) are thin.
5. Freshness and correction-log signals are stale or broken.

---

## Findings (ordered by severity)

### C1 [CRITICAL]: The site contradicts itself on whether it is the operator
Commit `846624a` (2026-10-04, "present site as official Pak Rummy information site") rewrote 13 files from "independent resource, not the game operator" to "official information site of the Pak Rummy team". It missed several pages, so the rendered site now says both things.

**Pages that say "official / same team":**
- Homepage hero: "This is the official information site of the Pak Rummy team".
- /about/.
- /editorial-policy/: "This website is published by the same team that runs the Pak Rummy game at pakrummy.com".

**Pages that still say "not the operator / can't confirm":**
- /customer-service/ (src/pages/customer-service/index.astro:27): "We are not the game operator and cannot access, escalate, or resolve your Pak Rummy account issues directly". It also says channels were "supplied to us directly by the site operator", which muddles "site operator" and "game operator".
- /official-domains/ (line 25): "We have not yet independently confirmed which domain(s) are authentic, operator-controlled Pak Rummy properties." If this is the operator's own official site, that sentence reads as absurd or evasive.
- /download/ (lines 105-106): "We haven't independently confirmed the operator's legal company name or which domain(s) the operator directly controls".
- /privacy-policy/ meta description: "...distinct from the Pak Rummy operator."
- `operatorLegalName` is still `unverified()` in src/config/site.ts.

**Why it matters (YMYL):** The QRG's first trust question is "who is responsible for this site?", and this site gives two incompatible answers. Worse, the site's own checklist post (/blog/is-this-online-earning-app-in-pakistan-legit/, items 2-3) and /card-rummy-vs-pak-rummy/ call "no disclosed operator identity" and "no consistent operator identity across domains" a red flag. Pak Rummy fails both tests by the site's own account. A rater who reads both pages will apply the site's checklist to the site itself.

**Fix:**
- Pick one identity and apply it everywhere.
- If the site is first-party, publish the operator's legal entity and state plainly that pakrummy.com and pakrummyofficial.com are both operator-controlled. Then rewrite /official-domains/ as "Our official domains are X and Y" and drop "independently" from first-party facts (you don't "independently verify" your own domain).
- If the legal entity truly can't be published, say so once, with a reason, on /about/. Don't let the gap surface as hedges on six pages.

### C2 [HIGH]: /withdrawal/ contradicts its own fact table (confirmed live)
- Hero text (src/pages/withdrawal/index.astro:28-29): "We have not confirmed Pak Rummy's specific limits **or processing time**".
- Fact table on the same page: "Typical processing time: 5–10 minutes **Verified**". `withdrawalProcessingTime` was marked verified on 2026-10-04 and the hero copy was never updated.
- /blog/why-is-my-withdrawal-pending/ correctly states the 5–10 minute figure and links back to the page that says it's unconfirmed.

**Fix:** Change the hero to "We've confirmed the typical processing time (5–10 minutes, per the Pak Rummy team, 2026-10-04); limits are still unconfirmed." Add a build-time check that flags prose containing "not confirmed … processing time" while the fact is verified.

### C3 [HIGH]: No named authors or credentials; byline markup is wrong
- All 20 Markdown articles use `author: "PakRummyOfficial.com Editorial Team"`.
- /authors/ has 87 words of main text and says content is "produced and verified collectively … We'll list named contributors here once the team is staffed publicly". The intent is honest, but it's a placeholder page on a YMYL site.
- Article JSON-LD emits `"author":{"@type":"Person","name":"PakRummyOfficial.com Editorial Team"}`. A team is not a `Person`; use `Organization` with `url: /authors/`.
- The visible byline in src/layouts/ArticleLayout.astro ("By {author} · Published {date}") is plain text and doesn't link to /authors/.
- Nobody is named as reviewer for payment, KYC or legal content. /legal-status/, /terms/, /privacy-policy/ and /cookie-policy/ all carry "Draft template pending review by qualified Pakistani legal counsel", unchanged since 2026-08-17 (85 days). The /terms/ and /privacy-policy/ meta descriptions even say "Draft template pending legal review", so that text can appear in search snippets.

**Fix:**
- Name at least one accountable editor (a real person, or a named role holder) with a short bio and relevant experience: payments, Android or security, card games.
- Add a "Reviewed by" line on payment and KYC posts.
- Link the byline to /authors/ and fix the schema type.
- Get the legal pages reviewed, or at minimum remove "Draft template" from the meta descriptions.

### C4 [HIGH]: No external citations anywhere
- Every one of the 20 Markdown articles has 0 outbound links (`](http` count = 0).
- Across all `.astro` pages, the only external link is `https://pakrummy.com`.
- The editorial policy says facts are confirmed "against a primary source", yet the payment posts never cite Easypaisa's or JazzCash's own fee or limit pages, the SBP, or PTA. /guides/enable-unknown-sources-android/ doesn't cite Android documentation.

**Fix:** Link the primary sources inline: Easypaisa/JazzCash official tariff and limit pages, SBP branchless-banking and KYC rules for the KYC post, and Android developer docs for the unknown-sources guide. This is the cheapest available authoritativeness gain.

### C5 [HIGH]: The payment posts don't answer their own query
- /blog/easypaisa-withdrawal-charges/ (477 words) and /blog/jazzcash-withdrawal-charges/ (423 words) contain no figures at all: no PKR amounts, percentages or tiers. Grepping for `[0-9]+%`, `PKR`, `Rs` and `,000` matched nothing in either.
- Someone searching "Easypaisa withdrawal charges" wants the published wallet tariff. "There is no single flat rate … confirm on your own screen" is true but doesn't help.
- The same applies to /blog/how-to-deposit-money-into-easypaisa/ ("Minimums, limits, and fees" section, no numbers).
- Your `Verified<T>` rule covers Pak Rummy's own facts. Easypaisa/JazzCash public tariffs are third-party published facts you can cite with a date.

**Fix:** Add a dated "Published wallet charges (as of YYYY-MM-DD, source: link)" table and keep Pak Rummy's own fees as "Not yet publicly verified".

### C6 [MEDIUM-HIGH]: Thin money and trust pages
Main-content word counts (nav, header and footer excluded):

| Page | Words | Note |
|---|---|---|
| /deposit/ | 170 | 3 of 3 facts unverified; 4 generic steps |
| /bonuses/ | 205 | No active bonus; mostly generic explanation |
| /withdrawal/ | 217 | Contradiction, see C2 |
| /account-verification/ | 223 | Generic KYC pattern |
| /about/ | 160 | No people, no entity, no history |
| /editorial-policy/ | 214 | Good principles; no named owner, no review cadence |
| /corrections-policy/ | 146 | Promises a log that doesn't exist (see C8) |
| /contact/ | 93 | |
| /authors/ | 87 | Placeholder |
| /games/ | 146 | 62% of its 5-grams also appear on the homepage |
| /guides/ | 134 | |
| /updates/ | 59 | One entry ever |

Content floors (topical coverage, not targets):
- Homepage: 580 words. Passes the 500 floor.
- All 16 blog posts are under the 1,500-word blog floor: 414 to 837 words, median about 490. Longest is /blog/13-card-rummy-rules-beginners-walkthrough/ (837); shortest is /blog/how-to-deposit-money-into-easypaisa/ (414).
- The rules posts cover their topics adequately at this length. The payment and KYC posts don't (see C5).

**Fix:** Make /deposit/ and /withdrawal/ the most complete pages on the site, not the thinnest. Add:
- a step-by-step flow with real app screenshots (the operator already supplied one screenshot);
- a "what we're doing to confirm limits" note;
- failure modes with the exact error text;
- the verified support channels inline.

### C7 [MEDIUM]: How the "Verified<T>" convention comes across
The design is right and shouldn't be removed. As rendered, it reads in two different ways.

**Where it reassures:**
- /customer-service/ "What 'verified' means here".
- /download/ and /app-version/: checksum, build and manifest facts, each with its scope stated.
- The games pages' "How we confirmed this" callouts.

These explain what was checked, how, and what wasn't. That is excellent trust writing.

**Where it reads as evasive or thin:**
- Unverified cells render as **"Not yet publicly verified Unverified"**, the same message twice (value text plus badge; src/components/FactTable.astro). To screen readers, text extractors and AI systems it's a double negative with no information.
- Verified cells show the badge but not the `verifiedOn` date or `note` stored in site.ts. "5–10 minutes Verified" doesn't say by whom or when.
- Unverified facts never say why they're pending, whether anything is being done, or what to do meanwhile.
- Hedges pile up across the site. Unverified, hedge or "not confirmed" phrasing appears on 37 of 64 pages: 3 times each on /deposit/, /withdrawal/, /easypaisa-jazzcash/, /card-rummy-vs-pak-rummy/ and /games/poker/, and 2 times on every other game page. Payment methods, min/max deposit and min/max withdrawal are all still unverified 85 days after launch.
- For an "official" site, "we haven't confirmed our own deposit limits" doesn't read as caution; it reads as either not really being official or hiding something. This ties directly to C1.
- /responsible-gaming/ tells distressed players to contact "a national mental-health helpline in Pakistan" without naming one. On the most safety-critical page, the reader is left to search alone.

**Fix:**
- Render unverified cells as one line: "Pending operator confirmation (requested YYYY-MM-DD) · Meanwhile: check the in-app deposit screen".
- Render verified cells with the date and source: "5–10 min · stated by Pak Rummy team, 2026-10-04".
- Getting the payment facts (methods, limits) confirmed is the single highest-value trust action available.
- Name a specific, editorially verified Pakistani helpline on /responsible-gaming/.

### C8 [MEDIUM]: Freshness signals are stale and the correction/update log is broken
- **Publishing stall (confirms known finding #1):**
  - 2026-08-21: 1 post.
  - 2026-10-08: 4 posts in one day.
  - 2026-10-09 to 2026-10-19: one post a day.
  - Nothing since; the last post is 2026-10-19 (22 days ago). The `scheduled-posts/` directory no longer exists.
  - The burst-then-stop pattern (16 posts with identical structure, then silence) looks like automated batch publishing rather than an editorial cadence.
- **No `updatedDate` on any of the 20 articles.** The three guides, all from 2026-08-17, have never been revisited.
- **The homepage is stale.** It says "Last reviewed 17 August 2026" (hard-coded in src/components/Hero.astro:49, 85 days old). The Status Center also shows "Last checked 2026-08-17" under the heading "Updated the moment we verify something new". Yet `withdrawalProcessingTime` was verified on 2026-10-04 and the homepage was edited the same day.
- **Wrong "Last revised" date.** /terms/ was edited on 2026-10-04 (commit 846624a) but still shows "Last revised: 17 August 2026". Its own text says that date "reflects" changes.
- **Updates log has one entry ever.** /updates/ (59 words) lists only "site launch", dated 2026-08-17. Not logged:
  - the APK verification (same day);
  - all seven game verifications;
  - support email, chat and Telegram verification;
  - the 2026-10-04 repositioning to "official";
  - the 2026-10-04 withdrawal-time verification;
  - 15 blog posts.
- **Broken promises.** /app-version/ promises "every version change we confirm gets logged on our updates page". /corrections-policy/ promises to log significant corrections there. Both are unfulfilled, which undercuts the policies themselves.
- **Outdated launch post.** /updates/site-launch/ still says "We have not yet … confirmed: an official download URL and checksum, the current app version … which games beyond Rummy are actually available". It's accurate for its date, but nothing newer supersedes it. Readers and AI systems landing on it get outdated "not verified" claims.

**Fix:**
- Backfill dated /updates/ entries for every verification event and the identity change.
- Show `updatedDate` when posts are refreshed.
- Generate the homepage "last reviewed" date from the most recent `verifiedOn` instead of hard-coding it.
- Restart a sustainable cadence (1-2 posts a week beats 12 in 12 days and then 0).

### C9 [MEDIUM]: Topical overlap and cannibalization (not near-duplicate text)
**Text duplication is low.** 5-gram containment results:

| Pair | Containment |
|---|---|
| Highest pair overall: / vs /games/ | 0.62 |
| /games/aviator/ vs /games/crash/ | 0.35 (crash page: "Crash uses the same core mechanic as Aviator") |
| /games/rummy/ vs /games/teen-patti/ | 0.28 |
| /games/poker/ vs /games/teen-patti/ | 0.28 |
| All other game pairs | 0.07-0.23 |
| /blog/easypaisa-withdrawal-charges/ vs /blog/jazzcash-withdrawal-charges/ | 0.11 |

The shared text on game pages is boilerplate: "Check our download status page before installing anything." (7 pages) and the MODULE_VERIFICATION sentence (6 pages). There's no body-copy duplication problem.

**Topic overlap is the issue.** Several clusters have 3-4 URLs answering the same question:
- **Teen Patti hand rankings (Trail → High Card) appear on 3 pages:** /games/teen-patti/, /blog/teen-patti-rules-beginners-guide/, /blog/teen-patti-sequence-explained/. /blog/teen-patti-variations/ makes four Teen Patti pages.
- **Rummy rules and scoring appear on 4 pages:** /games/rummy/, /blog/13-card-rummy-rules-beginners-walkthrough/, /guides/rummy-scoring-explained/, and /blog/rummy-strategy-fundamentals-for-beginners/. The walkthrough has its own scoring section.
- **Multiplier games appear on 4 pages:** /games/aviator/, /games/crash/, /blog/how-aviator-game-works/, /blog/how-crash-games-work/.
- **Poker hand rankings appear on 2 pages:** /games/poker/ and /blog/poker-rules-for-beginners/.
- **Ludo appears on 2 pages:** /games/ludo/ (499 words, the longest game page) and /blog/ludo-rules/ (531 words).

**Fix:**
- Give each cluster one canonical "rules" URL. Make game pages about Pak Rummy's implementation (what's confirmed, table info, screenshots) and link out to the rules post instead of restating rankings.
- Consider merging /blog/teen-patti-sequence-explained/ into /blog/teen-patti-rules-beginners-guide/.

### C10 [MEDIUM]: Repetitive article structure (QRG low-effort AI-content marker)
- 15 of 16 blog posts follow the same skeleton: `## Direct answer` → 3-5 H2s → `## FAQ` → `## What this page does not cover` → `## Related reading` → "Related pages". The 3 guides use the same opening.
- All are bylined to a nameless team, all were published in a 12-day burst, and none has an image of the actual app UI. 15 of 16 have stock-style hero images, e.g. "A spread hand of playing cards … on a dark green table".
- That matches the QRG September 2025 markers: repetitive structure across pages, no first-hand experience signals in the rules and payment posts.
- The content is accurate and non-generic in places. The checklist post's worked example and the Aviator post's PKR example are good. But the template is very visible.

**Fix:**
- Replace the literal "Direct answer" H2 with a question heading, e.g. "How much does Easypaisa charge to withdraw?". Keep the answer paragraph.
- Vary the section order by content type.
- Add first-hand elements: real app screenshots of a table, lobby or deposit screen, and "what we saw when we tested" notes. This is the cheapest Experience gain.

### C11 [MEDIUM]: Factual and consistency errors
- **/blog/13-card-rummy-rules-beginners-walkthrough/, worked example.** The "Final declared hand" is 3♠-4♠-5♠ + 7♥-8♥-9♥ + 10♣-10♦-10♠ + K♣-K♥-6♦(wild), which is **12 cards, not 13**. A 2-sequences-plus-2-sets declaration with 13 cards needs one group of 4. This is the site's flagship "complete walkthrough" post and the error invalidates its key example. Fix by making one sequence four cards long, e.g. 3♠-4♠-5♠-6♠.
- **/games/rummy/ contradicts itself and the homepage card:**
  - The hero says 13-card Rummy is "the one confirmed format available".
  - The body says "Pak Rummy tables commonly follow the three standard formats … Points … Pool … Deals".
  - The homepage and games.ts `shortDescription` say "including Points, Pool, and Deals variants" under a "Confirmed" badge.
  - Either Points/Pool/Deals are confirmed or they aren't. As written, the "Confirmed" badge covers a claim the game page says is unconfirmed.
- **Undisclosed unverified claims on game pages.** /games/rummy/ and /games/poker/ suggest "Start with a low-stake or practice table". Practice tables aren't a verified feature.
- **Inconsistent wording in the payment pair.** /blog/easypaisa-withdrawal-charges/ hand-types "Not yet publicly verified" in its FAQ (line 51); the JazzCash twin uses different phrasing. Use the shared component or config value.

### C12 [LOW-MEDIUM]: Readability
- Site-wide Flesch-Kincaid grade is about 8.5 (median), which is fine overall.
- The hardest pages are the anxious-user YMYL ones:

| Page | FK grade | Flesch Reading Ease | Avg. sentence length (words) |
|---|---|---|---|
| /blog/what-does-kyc-verification-mean/ | 12.3 | 37.7 | 17.2 |
| /blog/why-is-my-withdrawal-pending/ | 11.8 | 39.7 | 16.4 |
| /blog/jazzcash-withdrawal-charges/ | 10.9 | 41.7 | |
| /blog/easypaisa-withdrawal-charges/ | 10.8 | 46.7 | |
| /blog/real-money-earning-games-in-pakistan/ | 10.3 | | |
| /blog/is-this-online-earning-app-in-pakistan-legit/ | 10.3 | | |
| /games/ hub | 14.4 | 28.6 | 20.9 |

- The easiest pages are the rules posts: teen-patti-sequence FK 4.4, rummy-scoring 4.9, poker 6.0.
- Many readers are likely second-language English speakers, and they need the payment and KYC pages most. Aim for grade 8 or below there: shorter sentences, fewer em-dash asides, fewer stacked qualifiers.
- Opportunity (not a defect): there's no Urdu or Roman-Urdu content. If GSC shows Roman-Urdu queries ("pak rummy download karne ka tarika", "withdrawal kaise kare"), a few Urdu or Roman-Urdu explainers for download and withdrawal would serve the audience. Check with the google/GSC agent.

### C13 [LOW]: Templated metadata check passes
- `metadata_template.py --pairs-file` on 64 pairs: `site_risk: low`, `templated_ratio: 0.0`, `templated_count: 0`, `shared_cta_phrases: {}`, no `description_echoes_title`, `brand_suffix_in_description` or `description_duplicates_title` flags.
- The 2026-10-04 title/description rewrite (known finding #5) holds up across the site.
- The only metadata problem is content, not templating: "Draft template pending legal review" in the /terms/ and /privacy-policy/ descriptions (C3), and "distinct from the Pak Rummy operator" in the /privacy-policy/ description (C1).

---

## AI citation readiness (68/100), content side

**Strengths**
- Every article and guide opens with a 1-3 sentence direct answer that stands on its own. Example, /blog/teen-patti-sequence-explained/: "Teen Patti hand sequence, highest to lowest: Trail, Pure Sequence, Sequence, Color, Pair, and High Card."
- Question-style FAQ blocks.
- Scoped "What this page does not cover" sections, which help a model avoid over-attributing.
- Fact tables for app facts: version 1.1.2, build 112, 38.7 MB, SHA-256, Android 5.0+/API 21, package `com.rummy.pak.games`.
- Clear H2/H3 structure.

**Weaknesses**
- The generic "Direct answer" H2 label gives no topical anchor for passage retrieval.
- The payment posts have no numbers to quote (C5).
- "Not yet publicly verified Unverified" cells are unquotable and look broken when extracted (C7).
- No external sources, so a model can't corroborate (C4).
- Contradictory identity statements across pages (C1) make the brand-entity description ambiguous for any model summarising the site.
- Outdated "not verified at launch" claims on /updates/site-launch/ (C8).

---

## Priority actions

1. Resolve the identity contradiction (C1) across /customer-service/, /official-domains/, /download/ and the /privacy-policy/ meta, and publish the operator entity or one clear explanation.
2. Fix the /withdrawal/ hero contradiction (C2) and the 12-card worked example (C11). Both are quick and both are visible errors.
3. Name an accountable editor and reviewer, link bylines to /authors/, and change the author schema type to `Organization` (C3).
4. Get payment methods and limits confirmed by the operator; expand /deposit/ and /withdrawal/ with screenshots (C6, C7).
5. Add dated external citations and published wallet tariffs to the payment and KYC posts (C4, C5).
6. Backfill /updates/, derive "last reviewed" dates from real data, fix /terms/ "Last revised", and restart a steady 1-2 posts a week (C8).
7. Consolidate the Teen Patti, Rummy and multiplier-game clusters, and repurpose game pages toward implementation-specific facts (C9).
8. Replace "Direct answer" headings with question headings, add first-hand screenshots, and simplify the payment and KYC posts to grade 8 or below (C10, C12).

---

## Structured findings (audit-data.json, category "Content Quality")

```json
{
  "category": "Content Quality",
  "score": 52,
  "eeat": {"experience": 55, "expertise": 40, "authoritativeness": 30, "trustworthiness": 55, "weighted": 45},
  "ai_citation_readiness": 68,
  "metadata_template": {"site_risk": "low", "templated_ratio": 0.0, "templated_count": 0, "shared_cta_phrases": {}},
  "findings": [
    {"id": "C1", "severity": "critical", "title": "Site contradicts itself on operator identity (official vs 'not the game operator' / unconfirmed domains)", "urls": ["/", "/about/", "/editorial-policy/", "/customer-service/", "/official-domains/", "/download/", "/privacy-policy/"]},
    {"id": "C2", "severity": "high", "title": "/withdrawal/ hero says processing time unconfirmed; fact table shows 5–10 min Verified", "urls": ["/withdrawal/"]},
    {"id": "C3", "severity": "high", "title": "No named authors/reviewers; author schema typed Person for a team; byline unlinked; legal pages 'Draft template pending legal review' for 85 days", "urls": ["/authors/", "/terms/", "/privacy-policy/", "/cookie-policy/", "/legal-status/", "all /blog/*, /guides/*"]},
    {"id": "C4", "severity": "high", "title": "Zero external citations across all 20 articles", "urls": ["all /blog/*, /guides/*"]},
    {"id": "C5", "severity": "high", "title": "Payment 'charges' posts contain no figures; fail query intent", "urls": ["/blog/easypaisa-withdrawal-charges/", "/blog/jazzcash-withdrawal-charges/", "/blog/how-to-deposit-money-into-easypaisa/"]},
    {"id": "C6", "severity": "medium-high", "title": "Thin money/trust pages (deposit 170w, withdrawal 217w, bonuses 205w, about 160w, authors 87w); all 16 blog posts <1,500w (414–837)", "urls": ["/deposit/", "/withdrawal/", "/bonuses/", "/about/", "/authors/", "/contact/", "/updates/"]},
    {"id": "C7", "severity": "medium", "title": "Verified<T> rendering: 'Not yet publicly verified Unverified' double label, no dates/sources on verified cells, no pending reason; hedging on 37/64 pages; unnamed helpline", "urls": ["/deposit/", "/withdrawal/", "/bonuses/", "/responsible-gaming/", "/app-version/"]},
    {"id": "C8", "severity": "medium", "title": "Freshness: 22 days no posts; no updatedDate anywhere; homepage 'Last reviewed 17 Aug'; /terms/ Last revised stale; /updates/ has 1 entry; promised logs unfulfilled", "urls": ["/", "/updates/", "/updates/site-launch/", "/terms/", "/app-version/", "/corrections-policy/"]},
    {"id": "C9", "severity": "medium", "title": "Topical cannibalization clusters (Teen Patti x4, Rummy x4, Aviator/Crash x4, Poker x2, Ludo x2); low text duplication (max game-pair containment 0.35)", "urls": ["/games/*", "/blog/teen-patti-*", "/blog/how-*-work*", "/guides/rummy-scoring-explained/"]},
    {"id": "C10", "severity": "medium", "title": "Identical article skeleton on 15/16 posts + burst publishing + stock imagery = QRG repetitive-structure marker", "urls": ["all /blog/*"]},
    {"id": "C11", "severity": "medium", "title": "Factual errors: 12-card 'final declared hand' in 13-card walkthrough; /games/rummy/ 'one confirmed format' vs 'Confirmed' Points/Pool/Deals claim; unverified 'practice table' suggestion", "urls": ["/blog/13-card-rummy-rules-beginners-walkthrough/", "/games/rummy/", "/", "/games/poker/"]},
    {"id": "C12", "severity": "low-medium", "title": "Hardest readability on YMYL payment/KYC posts (FK 10.3–12.3); /games/ hub FK 14.4", "urls": ["/blog/what-does-kyc-verification-mean/", "/blog/why-is-my-withdrawal-pending/", "/games/"]},
    {"id": "C13", "severity": "low", "title": "Templated metadata check passes (0/64); only content issues in legal-page descriptions", "urls": ["/terms/", "/privacy-policy/"]}
  ]
}
```
