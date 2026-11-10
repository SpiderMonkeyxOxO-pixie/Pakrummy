# Content Architecture / Semantic Cluster findings: pakrummyofficial.com

Audit date: 2026-11-10. Category: Content Architecture (`cluster`).

## Evidence base and method
- **Link graph:** live HTML of all 64 URLs in `url-list.txt` fetched 2026-11-10. Internal `<a href>` values pulled from `<main>` only (header, footer and nav left out), so the counts below are in-content editorial links. The "all_in" counts in the appendix include nav/footer.
- **Ground truth for intent:** `docs/15-day-blog-content-calendar.md`, `docs/seo-keyword-map.md`, `docs/content-inventory.md`, `docs/blog-content-briefs.md`, `src/config/games.ts`.
- **Search performance:** GSC Search Analytics for the URL-prefix property `https://pakrummyofficial.com/`, 2026-08-12 to 2026-11-07 (90 days), query+page, 546 rows. Note: the `sc-domain:pakrummyofficial.com` property returns "Permission denied". Only the URL-prefix property is accessible, so other agents should use that one.
- **SERP overlap:** sampled with WebSearch, which runs from **US locations, not PK**. These SERPs are full of parasite/spam pages (`*.pages.dev`, hijacked `.edu` and `?p=` pages), so the overlap scores are low-confidence. They are used only to confirm or reject merges. Intent and the site's own docs carry more weight.

---

## 1. Executive summary (ranked by impact)

| # | Finding | Severity | Evidence |
|---|---|---|---|
| 1 | **The blog is effectively invisible to search.** In 90 days, 16 posts earned **0 clicks and ~14 impressions**, against 8,910 impressions and 1,157 clicks sitewide. 13 of the 16 posts have exactly **one** in-content inbound link (the /blog/ index). | Critical | GSC page totals (section 6). Inbound table (section 3). |
| 2 | **No hub page links down to any blog spoke.** None of the 7 game pages, /deposit/, /withdrawal/, /easypaisa-jazzcash/, /account-verification/, /safety/, /legal-status/, /official-domains/ or /sitemap/ links to a single blog post. All links go one way (spoke to hub). | Critical | Outbound adjacency (section 3). |
| 3 | **The 15-day calendar is fully used up.** Every Day 1-15 slug is live (published 2026-10-08 to 2026-10-19). `scheduled-posts/` does not exist in the repo. There is **nothing left to resume**: the 22-day stall means the pipeline is empty, not that a backlog is stuck. A new calendar is needed (section 7). | High | `git log -- src/content/blog`, `ls scheduled-posts` returns "No such file". |
| 4 | **Game pages and blog spokes target the same intent (cannibalization).** The game-page titles, unchanged since the 2026-08-17 initial commit, already claim the "rules / hand rankings / how it works" intent that the October blog posts were written for. GSC shows the game page winning the blog's target query: "pak aviator game" (Day 5's 1,300/mo primary) goes to /games/aviator/ at position 24, and the blog post gets nothing. | High | Section 5. |
| 5 | **Payment hubs are thinner than their spokes.** /deposit/ has 176 words in `<main>`, /withdrawal/ 225 and /easypaisa-jazzcash/ 256. The payment blog posts run 449-510. These hubs have no spoke list, so the payments cluster has spokes but only a weak hub. | High | Word counts (appendix). |
| 6 | **The install cluster's most procedural asset is orphaned from the install page.** /guides/enable-unknown-sources-android/ (the literal step 1 of sideloading) is linked only from /guides/ and /sitemap/. /install/ and /download/ never link to it. /install/ links only to the /guides/ index. | High | Section 3. |
| 7 | **The HTML /sitemap/ leaves out all 16 blog posts.** `src/pages/sitemap/index.astro` lines 17-18 call `getCollection('guides')` and `getCollection('updates')` but never `getCollection('blog')`. | Medium | Source and live HTML. |
| 8 | **/games/ hub-and-spoke is sound.** /games/ links to all 7 game pages (including /games/ludo/, now `verified: true`), and all 7 link back to /games/. Sideways links between game pages exist only for Aviator and Crash. Note the brief said "6 game pages", but there are **7 live**. | Info (pass) | Section 3. |
| 9 | **Three content categories have no spokes:** Slots (a live game page with no rules or explainer post), responsible gaming (the blog schema enum includes `responsible-gaming`, but 0 posts use it), and install troubleshooting (0 blog posts). | Medium | `grep category src/content/blog`: rules 8, payments 5, industry 2, strategy 1. |

---

## 2. Existing cluster map (as-built)

| Cluster | Intended hub (per keyword map) | Spokes live | Hub links down to spokes? | Spokes link up to hub? |
|---|---|---|---|---|
| **Game rules** | /games/, then per-game page | 7 game pages + 8 rules posts + 1 strategy post + guide /guides/rummy-scoring-explained/ | /games/ links to 7/7 game pages. **Game pages link to 0/9 blog posts**. Only /games/rummy/ links to the scoring guide. | 9/9 blog posts link to their game page. Only /blog/ludo-rules/ fails to link to /games/ (it links to /games/ludo/ only). |
| **Payments / withdrawal** | /deposit/, /withdrawal/, /easypaisa-jazzcash/ | 5 posts (2 withdrawal-charges, 1 deposit how-to, 1 pending, 1 KYC) + /guides/mobile-wallet-deposit-delay/ + /account-verification/ | **0/5 posts linked from any payment hub.** The guide is linked from all three hubs (good). /account-verification/ does not link to the KYC post. | Withdrawal posts link to /withdrawal/. The Easypaisa deposit post links to /deposit/. **No withdrawal post links to /deposit/**, and the KYC post does not link to /easypaisa-jazzcash/. |
| **Trust / legitimacy** | /safety/ (+ /official-domains/, /legal-status/) | /blog/is-this-online-earning-app-in-pakistan-legit/, /blog/real-money-earning-games-in-pakistan/, /card-rummy-vs-pak-rummy/, /apk-permissions/ | **/safety/, /legal-status/ and /official-domains/ link to 0 blog posts.** /safety/ and /official-domains/ do link to /card-rummy-vs-pak-rummy/. | The earning-app post links to /safety/ and /official-domains/. The real-money-games post links to /legal-status/ but **not /safety/**. |
| **Install / download** | /download/ (transactional), /install/ (procedural) | /app-version/, /apk-permissions/, /common-errors/, /guides/enable-unknown-sources-android/ | /download/ links to install, app-version, permissions and safety. **/install/ and /download/ do not link to the unknown-sources guide.** /common-errors/ links to /install/ but not to the guide. | The guide links to /install/ and /safety/. It does not link to /download/. |
| **Responsible gaming** | /responsible-gaming/ | none | n/a | Most-linked page on the site (26 in-content inlinks). It is a hub with no spokes. |

---

## 3. Link-graph evidence

### Inbound in-content links to each blog post (source pages, excluding self)
| Blog post | Inbound sources | Count |
|---|---|---|
| /blog/13-card-rummy-rules-beginners-walkthrough/ | /blog/ | 1 |
| /blog/easypaisa-withdrawal-charges/ | /blog/ | 1 |
| /blog/how-to-deposit-money-into-easypaisa/ | /blog/ | 1 |
| /blog/jazzcash-withdrawal-charges/ | /blog/ | 1 |
| /blog/ludo-rules/ | /blog/ | 1 |
| /blog/poker-rules-for-beginners/ | /blog/ | 1 |
| /blog/real-money-earning-games-in-pakistan/ | /blog/ | 1 |
| /blog/teen-patti-variations/ | /blog/ | 1 |
| /blog/how-crash-games-work/ | /blog/, /blog/real-money-earning-games-in-pakistan/ | 2 |
| /blog/is-this-online-earning-app-in-pakistan-legit/ | /blog/, /blog/real-money-earning-games-in-pakistan/ | 2 |
| /blog/rummy-strategy-fundamentals-for-beginners/ | /blog/, /blog/13-card-rummy-rules-beginners-walkthrough/ | 2 |
| /blog/teen-patti-sequence-explained/ | /blog/, /blog/teen-patti-variations/ | 2 |
| /blog/what-does-kyc-verification-mean/ | /blog/, /blog/why-is-my-withdrawal-pending/ | 2 |
| /blog/why-is-my-withdrawal-pending/ | /blog/, / (the homepage "Latest from us" widget shows only the newest single post, `blogPosts.slice(0, 1)` in `src/pages/index.astro:75`) | 2 |
| /blog/how-aviator-game-works/ | /blog/, /blog/how-crash-games-work/, /blog/real-money-earning-games-in-pakistan/ | 3 |
| /blog/teen-patti-rules-beginners-guide/ | /blog/, /blog/teen-patti-sequence-explained/, /blog/teen-patti-variations/ | 3 |

**Checklist result: 14/16 posts fail the 3-incoming-links minimum.** The homepage link to /blog/why-is-my-withdrawal-pending/ will move to whichever post is published next, so that post's inbound count will drop to 1.

### Outbound in-content links from hub pages (relevant subset)
- `/games/` links to: aviator, crash, ludo, poker, rummy, slots, teen-patti, /download/, /bonuses/, /responsible-gaming/. **All 7 game pages, 0 blog posts.**
- `/games/rummy/` links to: /guides/rummy-scoring-explained/, /account-verification/, /download/, /games/, /register-login/, /responsible-gaming/. **Not linked: the 13-card walkthrough, the strategy post, /card-rummy-vs-pak-rummy/.**
- `/games/teen-patti/` links to /account-verification/, /download/, /games/, /register-login/, /responsible-gaming/. **None of its 3 blog spokes.**
- `/games/aviator/` links to /games/crash/ and generic pages. **Not /blog/how-aviator-game-works/.** `/games/crash/` links to /games/aviator/. **Not /blog/how-crash-games-work/.**
- `/games/poker/`, `/games/ludo/` and `/games/slots/` link only to generic pages (download, register, responsible gaming, /games/).
- `/deposit/` links to /account-verification/, /bonuses/, /easypaisa-jazzcash/, /guides/, /guides/mobile-wallet-deposit-delay/, /responsible-gaming/, /withdrawal/. **Not /blog/how-to-deposit-money-into-easypaisa/.**
- `/withdrawal/` links to /account-verification/, /bonuses/, /complaints/, /customer-service/, /deposit/, /guides/, /guides/mobile-wallet-deposit-delay/. **Missing: the Easypaisa charges post, the JazzCash charges post, the pending post and the KYC post.**
- `/easypaisa-jazzcash/` links to /deposit/, /guides/, /guides/mobile-wallet-deposit-delay/, /withdrawal/. **None of its 3 wallet-specific posts.**
- `/account-verification/` links to /account-deletion/, /customer-service/, /deposit/, /withdrawal/. **Not /blog/what-does-kyc-verification-mean/.**
- `/safety/` links to /apk-permissions/, /card-rummy-vs-pak-rummy/, /customer-service/, /download/, /official-domains/, /responsible-gaming/. **Not the earning-app legitimacy post.**
- `/install/` links to /apk-permissions/, /common-errors/, /download/, /guides/ (index only), /official-domains/, /register-login/, /safety/. **Not /guides/enable-unknown-sources-android/.**
- `/legal-status/` links to /about/, /age-restrictions/, /disclaimer/, /responsible-gaming/. **Not the real-money-games post** (which links to it).

### Missing sideways links inside clusters (spoke to spoke)
- /blog/teen-patti-rules-beginners-guide/ (the Teen Patti sub-pillar) **does not link down** to /blog/teen-patti-sequence-explained/ or /blog/teen-patti-variations/. Those two posts link up to it, so the link only goes one way.
- /blog/easypaisa-withdrawal-charges/ and /blog/jazzcash-withdrawal-charges/ do not link to each other. The calendar calls them companion pieces.
- Neither withdrawal-charges post links to /blog/why-is-my-withdrawal-pending/ or /blog/what-does-kyc-verification-mean/. The JazzCash post's own FAQ is about KYC delays.
- /blog/how-to-deposit-money-into-easypaisa/ does not link to /blog/easypaisa-withdrawal-charges/.
- /blog/how-aviator-game-works/ does not link to /blog/how-crash-games-work/. The calendar said it should, so this is one-way.
- /blog/is-this-online-earning-app-in-pakistan-legit/ does not link to /blog/real-money-earning-games-in-pakistan/. Also one-way.
- /blog/13-card-rummy-rules-beginners-walkthrough/ and /blog/poker-rules-for-beginners/ do not link to /download/, although the calendar's linking plan for both lists it.
- /blog/ludo-rules/ does not link to /games/. The calendar's linking plan lists it as the hub.

---

## 4. Hub-gap analysis (clusters with spokes but a weak or missing hub)

1. **Payments: weak hub.** /deposit/ (176 words), /withdrawal/ (225) and /easypaisa-jazzcash/ (256) are shorter than every payment spoke, and none of them lists its spokes. **Recommendation:** make **/easypaisa-jazzcash/ the payments pillar.** It is the only page that can own both wallet names, and in GSC it already gets "pak rummy" impressions at position 16.5. Keep /deposit/ and /withdrawal/ as sub-hubs. Add a "Related guides and explainers" block to each:
   - /withdrawal/: the Easypaisa charges, JazzCash charges, pending and KYC posts.
   - /deposit/: the Easypaisa deposit post, the deposit-delay guide, and a new JazzCash deposit post (section 7).
   - /easypaisa-jazzcash/: all of the above.

   Expand the pillar to roughly 900-1,500 words without inventing operator facts. It can summarise general wallet mechanics already covered in the spokes, keeping the `Verified<T>` pattern for anything Pak Rummy-specific.
2. **Trust: no designated hub.** Trust content is split across /safety/, /official-domains/, /legal-status/, /card-rummy-vs-pak-rummy/ and two blog posts, and nothing ties them together. **Recommendation:** make **/safety/ the trust pillar.** It owns "is pak rummy safe" in the keyword map. Add an "Evaluate any app" section that links to the earning-app post, the real-money-games post and /legal-status/. /legal-status/ should link back to the real-money-games post.
3. **Install: the hub misses its key spoke.** /install/ should link inline to /guides/enable-unknown-sources-android/ at the step where the user enables unknown sources. /download/ and /common-errors/ should link to it as well. It has had only 3 impressions in 90 days, and this is why.
4. **Responsible gaming: a hub with no spokes.** /responsible-gaming/ is the most-linked page on the site (26 inlinks) but has no supporting articles. On a YMYL site this is the cheapest E-E-A-T win available (section 7).
5. **Slots: a game page with no explainer.** /games/slots/ is the only one of the 7 game pages with no blog spoke. GSC: "pak rummy slots" gets 9 impressions at position 8.4, and "pak slot" gets 3 at position 7.

---

## 5. Cannibalization check

### A. Game page vs blog spoke (title-level intent collision)
| Game page title (since 2026-08-17) | Competing blog post (2026-10) | Risk | GSC evidence |
|---|---|---|---|
| /games/aviator/ "Aviator on Pak Rummy: **How the Multiplier Game Works**" | /blog/how-aviator-game-works/ "**How the Aviator Game Works**: Multiplier and Cash-Out Explained" | **High** | The blog's primary keyword "pak aviator game" goes to /games/aviator/ (5 impressions, position 24). "pak game aviator" also goes there (position 10.5). The blog has 0 impressions. |
| /games/crash/ "Crash on Pak Rummy: **How the Multiplier Game Works**" | /blog/how-crash-games-work/ "**How Crash Games Work**: The Multiplier Mechanic Explained" | High | /games/crash/ ranks position 3.9 for "rummy crash" (63 impressions, 20 clicks, the best non-home ratio on the site). It also has the **same subtitle as /games/aviator/**. |
| /games/teen-patti/ "Teen Patti on Pak Rummy: **Rules and Hand Rankings**" | /blog/teen-patti-rules-beginners-guide/ (rules) + /blog/teen-patti-sequence-explained/ (hand rankings) | High (covers 2 spokes) | The sequence post gets the only Teen Patti long-tail impressions ("what is pure sequence in teen patti", position 43). The game page has 2 impressions in total. |
| /games/poker/ "Poker on Pak Rummy: **Hand Rankings** and Betting Basics" | /blog/poker-rules-for-beginners/ "Poker Rules for Beginners: **Hand Rankings** Explained" | High | Neither page ranks for any poker-rules queries yet. |
| /games/ludo/ "Ludo on Pak Rummy: **Rules** and How to Win" | /blog/ludo-rules/ "**Ludo Rules**: How to Play" | High | /games/ludo/ is the 509-word game page. The blog post has 0 impressions. |
| /games/rummy/ "Rummy on Pak Rummy: **Rules**, Variants, and Formats" | /blog/13-card-rummy-rules-beginners-walkthrough/ + /guides/rummy-scoring-explained/ (Points, Pool, Deals) | Medium | /games/rummy/ gets "pak rummy rules" (position 8). The walkthrough has 0 impressions. |

**Fix (follows the existing keyword-map intent: game pages own "pak rummy + game", content owns generic rules):**
- Retitle each game page around its **app-specific** angle, for example "Teen Patti on Pak Rummy: Tables, Modes and What's Verified" or "Aviator on Pak Rummy: What's Confirmed in the App". Keep a short rules summary on the page, then add an explicit link such as "Full rules: Teen Patti Rules (Beginner's Guide)".
- Give Aviator and Crash distinct subtitles.
- Retarget /blog/how-aviator-game-works/ away from "pak aviator game". That query is brand-modified and belongs to /games/aviator/. Point the blog post at "how aviator game works" / "aviator multiplier cash out". This means updating the calendar's Day 5 keyword in `docs/seo-keyword-map.md`.

### B. Blog vs blog (SERP-overlap verified)
| Pair | Shared top-10 URLs (US proxy) | Verdict |
|---|---|---|
| teen patti rules vs teen patti sequence | 0 (one shared domain, teenpatti-helpdesk.dynamicnext.com, but different articles) | Separate posts are correct. Interlink both ways. |
| how aviator works vs how crash games work | 0 (one shared domain, iplab.dmi.unict.it, different `?p=` IDs) | Separate posts are correct. Interlink both ways. |
| 13 card rummy rules vs points/pool/deals rummy | 1 (feedback.gecpalanpur.ac.in/?p=400) | Separate. The scoring guide already owns the format comparison. |
| rummy joker rules vs 13 card rummy rules | 2 (sandiegotexas.tistory.com/25, feedback.gecpalanpur.ac.in/?p=400) | Interlink tier. A new joker post is viable as a separate spoke. |
| online earning app legit vs real money earning games | Calendar docs keep these apart (evaluating the app vs the game-category landscape). The titles are distinct. | No conflict, but the link is one-way (see section 3). |
| easypaisa withdrawal charges vs jazzcash withdrawal charges | Different brand entities, so the SERPs separate naturally | No conflict. They should cross-link. |

### C. Brand and download overlap (GSC)
- "pak rummy game old version apk": /download/ gets 43 impressions at position 22.0 and /app-version/ gets 23 at position 26.2. The query is split across both pages. The "old version" query sits in between the two: /download/ owns "download" and /app-version/ owns "version history". Give /app-version/ a clear "older versions" section and point /download/ to it with descriptive anchor text, so the two pages stop competing.
- Brand queries ("pakrummy", "pak rummy", typo variants) spread across /, /download/, /games/ and /games/rummy/. This is normal for a brand SERP and not worth acting on. The homepage owns them correctly, per the keyword map.

**Primary-keyword uniqueness check:** no two of the 16 blog posts share a primary keyword (checked against the calendar's target-keyword column). The collisions are only game page vs blog post (section 5A).

---

## 6. GSC performance by cluster (90 days, URL-prefix property)

| Cluster | Pages | Clicks | Impressions | Notes |
|---|---|---|---|---|
| Brand/home | / | 542 | 3,862 | position 13.1 |
| Install/download | /download/, /app-version/, /install/, guide | 219 | 1,372 | The guide gets 3 impressions (position 60) and /install/ 6 (position 42.5) |
| Game pages | /games/ + 7 | 93 | 565 | /games/crash/ "rummy crash" at position 3 is the standout |
| Payments | /deposit/, /withdrawal/, /easypaisa-jazzcash/ | 2 | 61 | /withdrawal/ position 50 |
| **Blog (16 posts)** | all | **0** | **~14** | teen-patti-sequence 9, rummy-strategy 3, easypaisa-charges 2. **13 posts: 0 impressions** |

Interpretation: the posts are 22-33 days old, so some delay is expected. But the posts that were never shown had clear unmet demand (for example "teen patti rules" 600/mo at KD 0 and "crash game" 600/mo at KD 0, per the calendar's Ahrefs data). The likely causes are, in order:
1. Each post has one inbound link, from a paginated-style listing.
2. No hub authority flows down to the posts, because /games/ and the game pages (which do get impressions) never link to them.
3. The game pages cannibalize the posts' intent.
4. The sitemap has no `<lastmod>` and the HTML sitemap has no blog URLs, so discovery signals are weak.



**Indexation check (GSC URL Inspection API, read-only, 27 URLs, run 2026-11-10):** all 16 blog posts, all 8 /games/ URLs and all 3 guides are **"Submitted and indexed"**. In every case the Google-selected canonical matches the declared canonical, and the last crawls fall between 2026-10-20 and 2026-11-10. **So the blog's near-zero impressions are not an indexation or discovery problem. The posts are indexed but not ranking**, which matches weak internal authority and intent cannibalization (causes 1-3 above) rather than crawl failure. Cause 4 (sitemap signals) is the least important. Side note for the schema agent: every inspected URL's Breadcrumbs rich result reports its item as "Unnamed item".

---

## 7. Gaps and new-calendar recommendations (prioritised against the 22-day stall)

The old calendar has no unpublished topics. Before any new writing, **Wave 0 (linking fixes, no new content)** should ship first. It is the highest-ROI work available: it raises the 16 existing posts from 1 inbound link to 3-6 each and costs no new copy.

**Wave 0: internal-link fixes (1-2 days of work):**
1. Each game page gets a "Learn the rules" link block to its spokes:
   - rummy: 13-card walkthrough, strategy post, /card-rummy-vs-pak-rummy/
   - teen-patti: rules, sequence and variations posts
   - poker: poker rules post
   - ludo: ludo rules post
   - aviator: aviator post and crash post
   - crash: crash post and aviator post
2. /withdrawal/, /deposit/, /easypaisa-jazzcash/ and /account-verification/ each get spoke lists (section 4.1).
3. /safety/ and /legal-status/ link to the two trust posts.
4. /install/, /download/ and /common-errors/ link to /guides/enable-unknown-sources-android/.
5. Fix the 10 missing sideways links listed in section 3.
6. Add `getCollection('blog')` to `src/pages/sitemap/index.astro`.
7. Optionally, change the homepage "Latest from us" widget from `blogPosts.slice(0, 1)` to `slice(0, 3)`. A better option is a per-cluster "Popular guides" block.
8. Retitle the 6 colliding game pages (section 5A).

**Wave 1: new spokes for hubs that have none or are thin.** These are general-knowledge topics consistent with the site's no-fabrication policy. Volumes have **not** been measured in Ahrefs this run; check them with the same Ahrefs PK workflow the original calendar used before committing.

| Priority | Proposed post | Cluster / hub it feeds | Intent | Why now |
|---|---|---|---|---|
| 1 | Aviator Predictor Apps and "Signals": Why They Can't Work | Game rules (aviator) + Trust (/safety/) | Informational | Reaches both the game cluster and the trust cluster. Real investigative coverage exists (BOOM Live tracked 75+ YouTube channels selling Aviator "hack" ads). Fits the calendar's own "non-hype is the differentiator" thesis for Aviator. |
| 2 | How to Deposit Money Into JazzCash (Step by Step) | Payments (/deposit/) | Informational/procedural | Easypaisa currently has a deposit post and a withdrawal post, while JazzCash has only a withdrawal post. This post fills that gap. Template: the existing Easypaisa deposit post. |
| 3 | How Slot Games Work: RTP, Volatility and Why Spins Are Independent | Game rules (/games/slots/) | Informational | The only game page with no spoke. GSC already shows "pak rummy slots" at position 8.4. |
| 4 | "App Not Installed" Error on Android: Causes and Fixes for APKs | Install (/install/, /common-errors/) | Informational/troubleshooting | The first blog spoke for the 1,372-impression install cluster. SERP causes: corrupted file, signature conflict, storage, Play Protect. Links to the unknown-sources guide. |
| 5 | Easypaisa and JazzCash Account Limits Explained (Daily, Monthly, by Account Level) | Payments + /account-verification/ | Informational | Ties wallet KYC levels to the gaming KYC post. SERP shows conflicting third-party figures, so an honest "check the app, here is how the levels work" post adds new information. Do not state figures without official SBP or wallet sourcing. |
| 6 | Rummy Joker Rules: Printed Joker vs Wild Joker | Game rules (/games/rummy/) | Informational | SERP overlap with "13 card rummy rules" is 2 (interlink tier), so it works as a separate spoke under the rummy sub-hub. |
| 7 | Setting a Budget Before You Play: A Practical Guide | Responsible gaming (/responsible-gaming/) | Informational | First spoke for the site's most-linked hub. Strong YMYL trust signal. Uses the blog's `responsible-gaming` category, which has no posts yet. |
| 8 | How to Report Online Fraud or a Fake App in Pakistan | Trust (/safety/, /complaints/) | Informational | Expands the earning-app post's FAQ ("who do I report a fake app to"). SERP shows no clear authority answer, and points to NCCIA/FIA. Facts need to be checked against official sources. |
| 9 | Easypaisa vs JazzCash for Gaming Apps: Key Differences | Payments pillar | Commercial-investigation | Comparison spoke that supports /easypaisa-jazzcash/. Must stay neutral and free of fee claims. |
| 10 | Play Protect Warning on an APK: What It Means | Install + Safety | Informational | Supports /apk-permissions/ and /safety/. |

Run these at one post per weekday from `scheduled-posts/` and the existing cron to restart the pipeline. Load at least 10 posts so the cron does not run dry again within two weeks. Separately, the cron should alert when `scheduled-posts/` has fewer than 3 files left, so a silent empty queue does not happen again.

---

## 8. Target architecture: cluster-plan.json

```json
{
  "site": "https://pakrummyofficial.com",
  "generated": "2026-11-10",
  "data_sources": ["live HTML link graph (64 URLs)", "GSC URL-prefix property 90d", "docs/15-day-blog-content-calendar.md", "docs/seo-keyword-map.md", "WebSearch SERP sample (US proxy, low confidence)"],
  "pillar": { "url": "/games/", "role": "primary topical pillar for game content; homepage remains brand pillar" },
  "clusters": [
    {
      "name": "Game rules",
      "hub": "/games/",
      "sub_hubs": ["/games/rummy/", "/games/teen-patti/", "/games/poker/", "/games/ludo/", "/games/aviator/", "/games/crash/", "/games/slots/"],
      "spokes_live": ["/blog/13-card-rummy-rules-beginners-walkthrough/", "/blog/rummy-strategy-fundamentals-for-beginners/", "/guides/rummy-scoring-explained/", "/blog/teen-patti-rules-beginners-guide/", "/blog/teen-patti-sequence-explained/", "/blog/teen-patti-variations/", "/blog/poker-rules-for-beginners/", "/blog/ludo-rules/", "/blog/how-aviator-game-works/", "/blog/how-crash-games-work/"],
      "spokes_planned": ["aviator-predictor-apps-scam", "how-slot-games-work-rtp", "rummy-joker-rules"],
      "status": "hub->game pages OK; game pages->spokes MISSING; title cannibalization on 6 game pages"
    },
    {
      "name": "Payments",
      "hub": "/easypaisa-jazzcash/",
      "sub_hubs": ["/deposit/", "/withdrawal/", "/account-verification/"],
      "spokes_live": ["/blog/easypaisa-withdrawal-charges/", "/blog/jazzcash-withdrawal-charges/", "/blog/how-to-deposit-money-into-easypaisa/", "/blog/why-is-my-withdrawal-pending/", "/blog/what-does-kyc-verification-mean/", "/guides/mobile-wallet-deposit-delay/"],
      "spokes_planned": ["how-to-deposit-money-into-jazzcash", "easypaisa-jazzcash-account-limits", "easypaisa-vs-jazzcash-for-gaming-apps"],
      "status": "hubs thin (176-256 words) and link to 0 blog spokes"
    },
    {
      "name": "Trust and legitimacy",
      "hub": "/safety/",
      "sub_hubs": ["/official-domains/", "/legal-status/"],
      "spokes_live": ["/blog/is-this-online-earning-app-in-pakistan-legit/", "/blog/real-money-earning-games-in-pakistan/", "/card-rummy-vs-pak-rummy/", "/apk-permissions/"],
      "spokes_planned": ["how-to-report-online-fraud-pakistan", "aviator-predictor-apps-scam (shared)"],
      "status": "no hub links to blog spokes"
    },
    {
      "name": "Install and download",
      "hub": "/download/",
      "sub_hubs": ["/install/"],
      "spokes_live": ["/app-version/", "/apk-permissions/", "/common-errors/", "/guides/enable-unknown-sources-android/"],
      "spokes_planned": ["app-not-installed-error-fix", "play-protect-warning-apk"],
      "status": "unknown-sources guide not linked from /install/ or /download/"
    },
    {
      "name": "Responsible gaming",
      "hub": "/responsible-gaming/",
      "spokes_live": [],
      "spokes_planned": ["setting-a-gaming-budget"],
      "status": "hub with zero spokes"
    }
  ],
  "serp_overlap_matrix": [
    {"a": "teen patti rules", "b": "teen patti sequence", "shared": 0, "tier": "separate+interlink (intent-linked)"},
    {"a": "how aviator game works", "b": "how crash games work", "shared": 0, "tier": "separate+interlink (intent-linked)"},
    {"a": "13 card rummy rules", "b": "points vs pool vs deals rummy", "shared": 1, "tier": "separate"},
    {"a": "rummy joker rules", "b": "13 card rummy rules", "shared": 2, "tier": "interlink"},
    {"a": "rummy joker rules", "b": "points vs pool vs deals rummy", "shared": 2, "tier": "interlink"},
    {"a": "aviator predictor scam", "b": "how aviator game works", "shared": 0, "tier": "separate"},
    {"a": "jazzcash deposit", "b": "easypaisa account limits", "shared": 0, "tier": "separate"}
  ],
  "cannibalization": [
    {"urls": ["/games/aviator/", "/blog/how-aviator-game-works/"], "query": "pak aviator game", "severity": "high", "action": "retitle game page; retarget blog to generic 'how aviator game works'"},
    {"urls": ["/games/crash/", "/blog/how-crash-games-work/"], "severity": "high", "action": "retitle game page; distinct subtitle from aviator"},
    {"urls": ["/games/teen-patti/", "/blog/teen-patti-rules-beginners-guide/", "/blog/teen-patti-sequence-explained/"], "severity": "high", "action": "retitle game page away from 'Rules and Hand Rankings'"},
    {"urls": ["/games/poker/", "/blog/poker-rules-for-beginners/"], "severity": "high", "action": "retitle game page"},
    {"urls": ["/games/ludo/", "/blog/ludo-rules/"], "severity": "high", "action": "retitle game page"},
    {"urls": ["/games/rummy/", "/blog/13-card-rummy-rules-beginners-walkthrough/"], "severity": "medium", "action": "keep 'pak rummy rules' on game page; link down to walkthrough"},
    {"urls": ["/download/", "/app-version/"], "query": "pak rummy game old version apk", "severity": "low", "action": "consolidate 'old version' intent on /app-version/"}
  ],
  "link_matrix_required": {
    "mandatory_hub_to_spoke": [
      ["/games/rummy/", "/blog/13-card-rummy-rules-beginners-walkthrough/"], ["/games/rummy/", "/blog/rummy-strategy-fundamentals-for-beginners/"],
      ["/games/teen-patti/", "/blog/teen-patti-rules-beginners-guide/"], ["/games/teen-patti/", "/blog/teen-patti-sequence-explained/"], ["/games/teen-patti/", "/blog/teen-patti-variations/"],
      ["/games/poker/", "/blog/poker-rules-for-beginners/"], ["/games/ludo/", "/blog/ludo-rules/"],
      ["/games/aviator/", "/blog/how-aviator-game-works/"], ["/games/crash/", "/blog/how-crash-games-work/"],
      ["/withdrawal/", "/blog/easypaisa-withdrawal-charges/"], ["/withdrawal/", "/blog/jazzcash-withdrawal-charges/"], ["/withdrawal/", "/blog/why-is-my-withdrawal-pending/"], ["/withdrawal/", "/blog/what-does-kyc-verification-mean/"],
      ["/deposit/", "/blog/how-to-deposit-money-into-easypaisa/"],
      ["/easypaisa-jazzcash/", "/blog/easypaisa-withdrawal-charges/"], ["/easypaisa-jazzcash/", "/blog/jazzcash-withdrawal-charges/"], ["/easypaisa-jazzcash/", "/blog/how-to-deposit-money-into-easypaisa/"],
      ["/account-verification/", "/blog/what-does-kyc-verification-mean/"],
      ["/safety/", "/blog/is-this-online-earning-app-in-pakistan-legit/"], ["/safety/", "/blog/real-money-earning-games-in-pakistan/"], ["/legal-status/", "/blog/real-money-earning-games-in-pakistan/"],
      ["/install/", "/guides/enable-unknown-sources-android/"], ["/download/", "/guides/enable-unknown-sources-android/"], ["/common-errors/", "/guides/enable-unknown-sources-android/"],
      ["/sitemap/", "ALL /blog/* (16)"]
    ],
    "recommended_spoke_to_spoke": [
      ["/blog/teen-patti-rules-beginners-guide/", "/blog/teen-patti-sequence-explained/"], ["/blog/teen-patti-rules-beginners-guide/", "/blog/teen-patti-variations/"],
      ["/blog/easypaisa-withdrawal-charges/", "/blog/jazzcash-withdrawal-charges/"], ["/blog/jazzcash-withdrawal-charges/", "/blog/easypaisa-withdrawal-charges/"],
      ["/blog/easypaisa-withdrawal-charges/", "/blog/why-is-my-withdrawal-pending/"], ["/blog/jazzcash-withdrawal-charges/", "/blog/what-does-kyc-verification-mean/"],
      ["/blog/how-to-deposit-money-into-easypaisa/", "/blog/easypaisa-withdrawal-charges/"],
      ["/blog/how-aviator-game-works/", "/blog/how-crash-games-work/"],
      ["/blog/is-this-online-earning-app-in-pakistan-legit/", "/blog/real-money-earning-games-in-pakistan/"],
      ["/blog/ludo-rules/", "/games/"], ["/blog/13-card-rummy-rules-beginners-walkthrough/", "/download/"], ["/blog/poker-rules-for-beginners/", "/download/"],
      ["/blog/real-money-earning-games-in-pakistan/", "/safety/"]
    ],
    "optional_cross_cluster": [
      ["/blog/how-aviator-game-works/", "/blog/is-this-online-earning-app-in-pakistan-legit/"],
      ["/blog/why-is-my-withdrawal-pending/", "/guides/mobile-wallet-deposit-delay/"],
      ["/games/rummy/", "/card-rummy-vs-pak-rummy/"]
    ]
  },
  "word_count_targets": {"pillar_hubs": "expand /easypaisa-jazzcash/ to ~900-1500 words (2500-4000 spec is unrealistic for a fact-limited, Verified<T> site; don't pad)", "new_spokes": "1200-1800 per spec; existing spokes are 449-874 words"}
}
```

---

## 9. Pre-delivery checklist (against the as-built site)

| Check | Result |
|---|---|
| No two posts share a primary keyword | PASS between blog posts. FAIL for game page vs blog post (6 pairs, section 5A) |
| Every spoke has at least 3 incoming in-content links | **FAIL**: 14/16 blog posts. The unknown-sources guide has 1 in-content link plus the sitemap |
| Every spoke links to its hub | PASS, apart from ludo-rules to /games/ and the withdrawal posts to /deposit/ (minor) |
| Hub links to every spoke | **FAIL**: 0 of 7 game pages link to their blog spokes. 0 payment hubs link to blog spokes. /install/ does not link to its guide |
| No orphan pages | No true orphans, since every post is on /blog/. But 8 posts depend on a single listing link |
| Word counts | Existing spokes are 449-874 words, below the 1,200-1,800 spec. Hubs /deposit/ (176) and /games/ (172) are thin. The site's docs say it deliberately does not pad. Recommend expanding only with information-gain content, not filler |
| SERP overlap supports groupings | Yes, as far as the low-confidence US-proxy sample can show. No proposed merge is supported, and existing separations are confirmed |

---

## Appendix: in-content inbound counts and `<main>` word counts (live, 2026-11-10)
Hubs: /games/ 12 in / 172 words. /deposit/ 8 / 176. /withdrawal/ 10 / 225. /easypaisa-jazzcash/ 8 / 256. /account-verification/ 13 / 228. /safety/ 11 / 373. /install/ 8 / 225. /download/ 18 / 377. /responsible-gaming/ 26 / 308. /legal-status/ 8 / 285.
Game pages: rummy 6 / 302. teen-patti 6 / 346. aviator 5 / 350. crash 5 / 305. ludo 4 / 509. poker 4 / 362. slots 3 / 368.
Guides: mobile-wallet-deposit-delay 7 / 370. rummy-scoring-explained 5 / 391. enable-unknown-sources-android 2 / 344.
