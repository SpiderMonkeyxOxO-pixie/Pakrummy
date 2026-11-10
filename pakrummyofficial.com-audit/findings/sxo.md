# SXO findings: pakrummyofficial.com

Category: Search Experience (SXO). Audit date: 2026-11-10.
**SXO Gap Score** (this is separate from the SEO Health Score): **47 / 100 site-weighted** (the per-page scores in section 5 are weighted by GSC impressions).

## Evidence base

- **Live render.** Each page was rendered with `render_page.py --mode always` (Playwright), and headings, schema and CTAs were pulled from the rendered DOM. The rendered pages: /, /download/, /deposit/, /withdrawal/, /bonuses/, /promo-code/, /easypaisa-jazzcash/, /games/rummy/, /install/, /safety/, /app-version/, /register-login/, /official-domains/, /blog/jazzcash-withdrawal-charges/, /blog/easypaisa-withdrawal-charges/ and /blog/is-this-online-earning-app-in-pakistan-legit/. No page is an SPA (`is_spa: false` on every page), so the raw and rendered DOM match.
- **Google Search Console (actual demand).** Property `https://pakrummyofficial.com/`, using the URL-prefix property. The `sc-domain:` variant returns 403 for this service account. Date range 2026-08-12 to 2026-11-07, 546 query+page rows. Totals: 1,157 clicks, 8,910 impressions, average position 10.9.
- **SERP sampling.** 13 WebSearch queries. Note that WebSearch is **not** a raw Google SERP. It returns about 15-20 organic URLs but shows no PAA, AI Overview, ads or featured-snippet data. GSC fills that gap with real query demand (see Limitations).
- **Source.** `src/config/site.ts`, `src/pages/index.astro`, `src/components/Footer.astro`, `src/content/blog/*.md` and `docs/seo-keyword-map.md`.

---

## 1. Primary finding: the demand the site actually gets is not the demand it was built for

The keyword map (`docs/seo-keyword-map.md`) gives each page a topical cluster: deposit guide, withdrawal guide, Easypaisa/JazzCash, safety and so on. GSC shows that real searches follow a very different pattern.

| Intent cluster (GSC, 90 days) | Impressions | Clicks | CTR | Where it lands | Page-type the searcher expects | Severity |
|---|---|---|---|---|---|---|
| **Navigational to the game domain.** Queries: `pakrummy.com` (1,039), `pakrummy.con` (108), `www.pakrummy.com` (65), `pakrummy.vom` (30), `pak rummy.com`, `https://pakrummy.com/`, and others | **1,532** (17% of all site impressions) | 74 | 4.8% | / (pos 10.0), plus /deposit/, /withdrawal/ and /games/rummy/ at pos 40-56 | A Landing page: a one-click route to the game site or login | **CRITICAL** |
| **Brand plus download.** Queries: `pakrummy`, `pak rummy apk`, `pak rummy game download`, etc. | about 2,000+ | about 500 | 15-26% | /, /download/ | A Product page (APK listing with version, size and button) | ALIGNED |
| **Old or specific version.** Queries: `pak rummy game old version apk` (75), `...download old version` (54), `pak rummy game download 2022` (80+), `pak rummy old game app download` (36), etc. | **210** ("old" queries only) | 50 | 24% | Split across /download/ (pos 19-24), /app-version/ (pos 21-26), / (pos 25-31) | A Product page with a version-history list (the APKMirror pattern) | **HIGH** |
| **Login / registration.** Queries: `pak rummy 2026 registration` (30, **0 clicks**), `pak rummy real game login` (11, 0 clicks), `pakrummylogin`, `pak ramin 777 login` | 65 | 3 | 4.6% | /register-login/ (pos 13), / (pos 19-29), /complaints/ (pos 6) | A Landing page with a login button | **HIGH** |
| **Promo code.** Queries: `pak rummy promo code` (37), `pakrummy promo code` | 40 | 3 | 7.5% | Cannibalized three ways: /promo-code/ pos 9.7, /bonuses/ pos 11, /deposit/ pos 8 | An offer/coupon page with a visible code | HIGH (and unfixable without a real code; see 3.5) |
| **Payments.** Queries: withdrawal, deposit, jazzcash, easypaisa, charges, fee | **2** (both generic Easypaisa fee queries, at pos 63-66) | 0 | 0% | /blog/easypaisa-withdrawal-charges/ | A fee-table reference page | **CRITICAL** (format) |
| **Trust / legitimacy.** Queries: legit, fake, real or fake, scam, safe | **0** visible queries | 0 | n/a | /safety/ gets 29 impressions, all anonymized or unrelated | A verdict page ("Real or fake? Honest review") | HIGH (no page of the right type exists) |

**What this means.** The largest addressable SXO loss is not on the payment or trust pages. It is the **1,532 navigational impressions** from people trying to reach pakrummy.com. Only 74 of them click through, and those who land find no prominent way onward. **The only `<a href="https://pakrummy.com">` on the entire site is in the footer** (`src/components/Footer.astro:60`) **and on /about/** (`src/pages/about/index.astro:38`). On the homepage the hero copy says "the game is at pakrummy.com" as **unlinked plain text** (`src/pages/index.astro:41`). These searchers bounce, and that pogo-sticking signal hurts the homepage for its own brand terms as well.

Note on anonymized demand: /withdrawal/ has 268 impressions but only 5 visible query impressions, so 98% of its queries are anonymized long-tail. Missing payment and trust queries in GSC therefore means **"below Google's privacy threshold, or not ranking"**. It does not mean "no demand".

---

## 2. Page-type mismatch analysis: high-intent pages

The taxonomy used here is `seo-sxo/references/page-type-taxonomy.md`. "SERP dominant" comes from the WebSearch top results for that query plus the ranking pattern GSC shows.

### 2.1 /download/: ALIGNED for its core intent, HIGH mismatch for the "old version" sub-intent

- **Query:** "pak rummy apk download" / "pak rummy game download"
- **SERP dominant type:** Product (APK listing), about 70%. Observed results are APKMirror per-version pages (apkmirror.com/apk/sng-games/rummy-offline/...) carrying version, file size, minimum Android and a "version history" list. The remainder are spam/mod-APK pages (bestforandroid.com, community.snap.com, sites.google.com). No result is an official Pak Rummy source, so an official, checksummed page has a real opening.
- **Target page type:** Product. It has `SoftwareApplication` schema, a primary CTA "Download Pak Rummy APK" linking to `/downloads/pakrummy.apk`, and a facts table (version 1.1.2, 38.7 MB, package `com.rummy.pak.games`, SHA-256, Android 5.0+). This is the best-aligned page on the site. 259 clicks, 15.0% CTR, average position 18.0.
- **Mismatch.** The "old version" cluster (210 impressions, 24% CTR, so searchers are eager) expects a version list. /app-version/ says verbatim: *"Version 1.1.2 (build 112) is the first build we've verified and tracked, there's no prior confirmed version to compare it against yet."* The ranking is split between /download/ (pos 19-24) and /app-version/ (pos 21-26). Neither page answers the question the searcher is really asking. These queries usually mean "the new version broke / my phone won't run it / I want the build I had." The fix is a format change, not more keywords:
  - Add a "Looking for an old version?" H2 on /download/. It should say plainly that only 1.1.2 is verified, explain why old APKs from mirrors are a checksum risk (link /safety/), and name the realistic reasons people look for one: device compatibility (Android 5.0+ minimum), update failure, and login issues (link /common-errors/).
  - Give /app-version/ the one sub-intent of version-history queries, and have /download/ own the bare "download" queries. Each should link to the other with explicit anchor text ("Pak Rummy version history", "Download the current APK").
- **Freshness in the SERP snippet.** The meta description ends "Updated 17 August 2026", and "Last scanned" shows 2026-08-17, which is 85 days ago. For people searching "pakrummy update" (18 impressions) and "latest version", a visible 3-month-old date reads as stale. Re-scan the hosted APK and update the date. If the build has not changed, say "Re-checked [date], still 1.1.2".

### 2.2 /deposit/ and /withdrawal/: MEDIUM mismatch (format right, answer missing)

- **Query:** "pak rummy withdrawal" / "pak rummy deposit"
- **SERP dominant type:** Blog/how-to guides, about 80%. Examples are generic "withdrawal guide" pages (allyonogames91-com.pages.dev/games/rummy/rummy-withdrawal-guide, a26-allrummyreviews-com.pages.dev, kobo.nacsa.gov.sl spam). No authoritative Pak Rummy result exists. The format the SERP expects is a step-by-step guide with limits, times and troubleshooting.
- **Target type:** Hybrid/how-to. It has the right shape, but:
  - /deposit/ has 182 words, and **3 of 3** fact rows read "Not yet publicly verified" (payment methods, minimum, maximum).
  - /withdrawal/ has 233 words, and 2 of 3 fact rows are unverified. The one "Verified" row ("Typical processing time: 5-10 minutes") is in fact operator-stated (`site.ts:136-139`: "Typical time stated by the Pak Rummy team").
- **The SERP-level symptom.** /withdrawal/ has **268 impressions at average position 8.9 but a CTR of only 2.99%**, the worst CTR of any page with 100+ impressions. Its snippet is title "Pak Rummy Withdrawal Guide" plus description "How withdrawals typically work on real-money Rummy apps...". The word "typically" signals a generic page to someone with a specific problem.
- **Format verdict.** Good on-page SEO cannot fix this, because the page cannot answer the question the searcher holds ("what's the minimum / how long / why is mine stuck"). The fix is to (a) get the minimum/maximum facts from the operator, who already supplied the processing time, and (b) restructure /withdrawal/ around symptoms rather than generic steps. Use H2s such as "Withdrawal pending more than 10 minutes", "Withdrawal rejected", "Amount arrived lower than expected" and "Name mismatch". Each should link to the specific deep page (/blog/why-is-my-withdrawal-pending/, the fee posts, /account-verification/, /complaints/).

### 2.3 /easypaisa-jazzcash/: HIGH mismatch, which also contradicts the homepage

- **Query:** "pak rummy jazzcash" / "pak rummy easypaisa". GSC currently shows it ranking only for bare "pak rummy" (26 impressions, pos 16.5).
- **What the searcher expects:** a yes/no answer plus the in-app steps. The page's answer is: *"We have not confirmed whether Pak Rummy supports either directly."*
- **Trust contradiction (SXO-critical for the skeptical persona):**
  - Homepage meta description (`src/pages/index.astro:20`): "...Easypaisa/JazzCash deposits, games and support in one place."
  - Homepage feature tile (`src/pages/index.astro:42`): "Built for Pakistan: PKR, Easypaisa, JazzCash, local device context."
  - /easypaisa-jazzcash/ itself: "Pak Rummy support status: not yet publicly verified."

  A first-time visitor who clicks from the homepage claim into the payment page meets a direct reversal. Together with the operator-stated "5-10 minutes Verified" withdrawal time on /withdrawal/, the site states the payout speed for payment rails it says it cannot confirm exist. A skeptical reader notices this. The `Verified<T>` convention is sound; the problem is that the homepage copy steps outside it.
- **Fix.** Either get the supported-methods fact from the operator (it is the same source as the processing time) and flip `paymentMethods` to verified, or soften homepage lines 20 and 42 to "Easypaisa/JazzCash guidance".

### 2.4 Payment-charges blog posts: CRITICAL content-format mismatch

The posts are /blog/jazzcash-withdrawal-charges/ (409 words) and /blog/easypaisa-withdrawal-charges/ (470 words).

- **Query:** "jazzcash withdrawal charges" / "easypaisa withdrawal charges", plus the "...pak rummy" variants.
- **SERP dominant type:** Data-reference posts with fee tables by amount slab, about 80%, plus official PDFs and a calculator tool. Observed results:
  - toolsfluent.com "EasyPaisa & JazzCash Charges on Rs 1,000 to Rs 50,000: Every Amount", "JazzCash Charges 2026 Pakistan: Full Fee Schedule", and "easypaisa jazzcash fee calculator" (a Tool page)
  - pakobserver.net "jazzcash vs easypaisa cash withdrawal charges in pakistan 2026 update"
  - the official schedules of charges: `mobilinkbank.com/assets/documents/SOC_Q1_2026.pdf` and `easypaisa.com.pk/.../Schedule-of-Bank-Charges-Branchless-Banking-English.pdf`

  Titles in this SERP carry the **year** and **amount figures** ("Rs 35 Flat", "Rs 10k, 25k, 50k Fees").
- **What the target delivers:** a "Direct answer" that the charge "depends on the transaction amount, destination, and the receiving app's fee policy, and are not a single fixed rate". There are **zero tables and zero rupee figures**. The pages are nominally the same type (Blog Post), but the answer format is wrong: the SERP rewards numbers, and these pages give "it depends".
- **GSC confirms it.** The Easypaisa post has 3 impressions in 90 days at pos 46-66 (for "easypaisa atm withdrawal charges" and "easypaisa cash withdrawal charges"). The JazzCash post has **zero impressions**. The "pak rummy" brand modifier has no measurable volume, so the brand angle does not rescue them.
- **This is the clearest case on the site where good on-page work still fails to rank.** Both posts have a direct-answer block, FAQ, BlogPosting schema and good internal links, and they still will not rank, because the page type and format do not match.
- **Two fixes that stay within the `Verified<T>` rules:**
  1. **Add a dated fee-slab table sourced only to the wallets' own official SOC PDFs.** These are public facts about Easypaisa/JazzCash, not unverified Pak Rummy facts, so the "we won't publish a number until verified" stance does not apply. Label it "As published in [wallet] Schedule of Charges, [quarter] 2026, checked [date]", link the PDF, and keep "Pak Rummy's own fee: not yet publicly verified" as a separate row. Put the year in the title: "JazzCash Withdrawal Charges 2026: Official Fee Slabs + What Apps Add".
  2. Alternatively, or as well, re-angle the posts to the sub-intent the site can own: "**Why did my withdrawal arrive short?** Wallet fee vs app fee". This serves the returning-player persona instead of competing with toolsfluent on the generic head term.

### 2.5 /bonuses/ and /promo-code/: HIGH mismatch, cannibalized

- **Query:** "pak rummy promo code" (37 impressions)
- **SERP dominant type:** Coupon/offer aggregators, about 75%: askmeoffers.com "...Coupons", zoutons.com "RummyCircle coupons", zigya.com "max rummy promo code". The expected format is a visible code with a valid-until date.
- **Target.** /promo-code/ (H1 "Pak Rummy Promo Code") says there is no verified code. /bonuses/ (208 words, 1 of 1 rows unverified) says there is no verified bonus. Three pages compete: /promo-code/ at pos 9.7, /bonuses/ at pos 11 and /deposit/ at pos 8. The keyword map at line 12 says /promo-code/ should own this, and GSC shows that split is not holding.
- **Verdict.** This cannot be fully aligned while no code exists, and the honest "no code" answer is correct for trust. What can be done is to win the skeptic's click by putting the answer in the snippet, and to consolidate:
  - Title: "Pak Rummy Promo Code (November 2026): No Verified Code. Avoid These Fakes". The meta description already starts "There is no verified active Pak Rummy promo code today", which is good.
  - Remove "promo code" wording from /bonuses/ and /deposit/ titles and descriptions, and link to /promo-code/ with the anchor "Pak Rummy promo code status".

### 2.6 /games/rummy/: ALIGNED for "pak rummy rules", MEDIUM for generic rules queries

- "pak rummy rules" ranks at pos 8 (2 impressions), which is fine. Generic "13 card rummy rules" SERPs are dominated by long-form rules guides with examples (pokernews.com/card-games/rummy/13-cards-rummy.htm, rummy-palace.com/how-to-play-rummy, gamerules.com). /games/rummy/ has 295 words and 4 rule bullets. The deeper /blog/13-card-rummy-rules-beginners-walkthrough/ has **zero GSC impressions**.
- Most of /games/rummy/'s 241 impressions are brand terms ("pak rummy" pos 29, "pak rummy game" pos 33), where it competes with the homepage. Low priority: the generic rules SERP is saturated with high-authority domains. Keep /games/rummy/ on the brand-plus-rules intent, add one worked example hand (pure sequence + impure sequence + set, shown as card images), and link prominently to the walkthrough post.

### 2.7 Trust / legitimacy cluster: HIGH mismatch (no page of the expected type exists)

- **Query patterns:** "is pak rummy legit", "pak rummy real or fake", "...withdrawal proof".
- **SERP dominant type:** Verdict/review pages. Observed: pakgames.uk.com/real-or-fake/ titled "Honest review", daman-official-damanwinvip.pages.dev/review/ "Honest review · 2026", and directmarketing.pk "...Reviews 2026". The expected format is a **verdict up front**, then evidence (payout behaviour, operator identity, user reports), then "how to test safely".
- **What the site offers:**
  - /safety/ ("Is Pak Rummy Safe?", 369 words) is an **APK file-safety** checklist (source, checksum, permissions). It answers "will this file harm my phone?", not "will this operator pay me?".
  - /blog/is-this-online-earning-app-in-pakistan-legit/ (709 words) is a **generic** checklist ("an online earning app") whose title does not contain "Pak Rummy". It openly says "We're not neutral about our own app". That candour is good, but it is the wrong page type for a brand "real or fake" query.
- **Fix.** The operator's own team cannot credibly publish a "review". It can publish a format that matches the SERP while staying honest: an **"Is Pak Rummy real or fake? What we can prove and what we can't"** evidence ledger, either as a new H2 block at the top of /safety/ or as its own page.
  - Verdict line first, for example: "The APK we host is real and checksummed. The operator's corporate identity is not yet publicly verified."
  - Then a two-column Proven / Not proven table drawn from existing `Verified<T>` facts: checksum, package name, support email, Telegram (supplied by the operator), legal entity (unverified).
  - Then "How to test with a small withdrawal first", and a complaint route.

### 2.8 /register-login/: HIGH mismatch (wrong primary CTA for the intent)

- Queries: "pak rummy 2026 registration" (30 impressions, **0 clicks**, pos 13), "pak rummy login" (pos 4, 2 clicks), "pak rummy real game login".
- The SERP and intent expect a login/registration entry point. The page offers "Typical registration steps" and "Typical login steps", and its only CTA is the sitewide "Download Pak Rummy". **There is no link to pakrummy.com on the page** (the footer link is the only one). Add an above-the-fold primary button "Log in or register at pakrummy.com" and keep the troubleshooting content below it. This fixes both the login cluster and part of the navigational cluster in section 1.

---

## 3. User stories by intent cluster

Each story cites the signal that produced it.

### Download / install

1. As a **new Android user in Pakistan**, I want the real Pak Rummy APK, not a mod, because the search results are full of mod-APK and copycat pages, but I'm blocked by **a trust gap about which file is genuine**.
   *Source: SERP for "pak rummy apk download" is dominated by bestforandroid.com mod-APK pages, community.snap.com and sites.google.com spam, with no official result. GSC: `pak rummy apk` gets 48 impressions on /download/.*
   *Journey stage: Decision.* /download/ serves this well (checksum and self-hosted file).
2. As a **returning player whose app broke after an update**, I want the version I used to have, because the current build won't open or log in on my phone, but I'm blocked by **an information gap**: there is no version history, and mirror APKs are unsafe.
   *Source: GSC "old version" cluster of 210 impressions at 24% CTR; "pak rummy game download 2022" (80+ impressions); "pakrummy update" (18). SERP: APKMirror's version-history page format.*
   *Journey stage: Consideration / retention.*
3. As a **searcher who typed the game's domain into Google**, I want to get to pakrummy.com, because that is where I play, but I'm blocked by **a missing route**: the info site ranks for my query and does not link onward above the fold.
   *Source: GSC navigational cluster of 1,532 impressions at 4.8% CTR, including typos (.con, .vom, .cok, .xom).*
   *Journey stage: Decision (navigational).*

### Payments

4. As a **player cashing out to JazzCash**, I want to know the exact fee for my amount before I confirm, because the money arrived short last time, but I'm blocked by **price uncertainty**: the page says "it depends" where competitors show Rs figures.
   *Source: SERP titles with amount figures ("Rs 1,000 to Rs 50,000: Every Amount", "Rs 35 Flat"), official SOC PDFs ranking, and a fee-calculator Tool result.*
   *Journey stage: Decision.*
5. As a **player whose withdrawal is stuck**, I want to know whether it is normal and what to do, because I need the money and fear a scam, but I'm blocked by **a generic, non-diagnostic guide**.
   *Source: /withdrawal/ has 268 impressions at pos 8.9 with 2.99% CTR (the snippet's "typically" wording is not selected). The SERP shows "instant withdrawal" listicles and Pakistan withdrawal guides warning about name-mismatch rejections (pakgames.uk.com).*
   *Journey stage: Retention / problem.*
6. As a **first-time depositor**, I want to know whether Pak Rummy accepts Easypaisa or JazzCash and what the minimum is, because I only use mobile wallets, but I'm blocked by **contradictory signals**: the homepage says "Easypaisa, JazzCash" and the payment page says "not verified".
   *Source: `index.astro:20,42` against the /easypaisa-jazzcash/ copy; /deposit/ shows 3 of 3 facts unverified.*
   *Journey stage: Consideration.*

### Game rules

7. As a **beginner about to play for real money**, I want to understand pure versus impure sequences with an example hand, because a wrong declaration costs points, but I'm blocked by **technical confusion**, since the rules are four bullets with no worked example.
   *Source: the "13 card rummy rules" SERP is long-form guides with examples (pokernews.com, rummy-palace.com). GSC: "what is pure sequence in teen patti" (6 impressions) and "is akq a sequence in teen patti" show example-level rule questions.*
   *Journey stage: Awareness.*
8. As a **Teen Patti player**, I want to know whether a specific hand (A-K-Q) counts as a sequence, because I'm mid-game, but I'm blocked by the fact that **the answer page ranks at pos 43-51**.
   *Source: GSC /blog/teen-patti-sequence-explained/ has 11 impressions at pos 35.7.*
   *Journey stage: Awareness.*

### Trust / legitimacy

9. As a **skeptical first-time visitor**, I want a straight verdict on whether Pak Rummy is real, because Pakistani earning apps have collapsed with user deposits (the site's own post cites ITV Pakistan), but I'm blocked by **comparison fatigue**: the only "verdict" pages are affiliate "honest reviews".
   *Source: SERP for "is pak rummy real or fake" and "pak game real or fake withdrawal proof pakistan" (pakgames.uk.com/real-or-fake/ "Honest review", daman-official...pages.dev/review/ "Honest review · 2026").*
   *Journey stage: Consideration.*
10. As a **cautious user who found a "Pak Rummy" link on Telegram or WhatsApp**, I want to check whether that site is official, because copycats exist, but I'm blocked because **/official-domains/ says the operator's domains are not yet confirmed**.
    *Source: SERP for "pak rummy" shows unrelated brand-squatting pages (shapes.inc/pakrummy, careers.stemi.education "pak rummy game promo code"). GSC: /official-domains/ gets only 6 impressions.*
    *Journey stage: Consideration.*

---

## 4. Persona scoring

Each persona is derived from GSC clusters and SERP signals. Each of Relevance, Clarity, Trust and Action is scored out of 25.

### Personas

- **P1 Skeptical First-Time Visitor.** Evaluating before installing or depositing. Emotional state: skeptical. Evidence: the "real or fake / honest review" SERPs, mod-APK spam on download SERPs, and the site's own legitimacy post.
- **P2 Returning Player With a Problem.** Stuck withdrawal, short payout, broken update or login failure. Emotional state: frustrated. Evidence: /withdrawal/ CTR 2.99%, the "old version" cluster, and the login cluster with 0 clicks.
- **P3 Navigational Game-Seeker.** Wants pakrummy.com or the login. Evidence: 1,532 navigational impressions.
- **P4 Fee Checker (quick-answer seeker).** Wants a rupee figure. Evidence: fee SERP titles with Rs amounts and the fee-calculator tool.
- **P5 Bonus Hunter.** Wants a code. Evidence: the promo-code cluster and coupon aggregators in the SERP.
- **P6 Rules Learner.** Wants a worked example. Evidence: the rules SERP pattern and the Teen Patti sequence queries.

### P1 Skeptical First-Time Visitor: page scores

| Page | Relevance | Clarity | Trust | Action | Total | Rating |
|---|---|---|---|---|---|---|
| /download/ | 22 | 20 | 18 | 22 | **82** | Excellent |
| /safety/ | 16 | 17 | 18 | 14 | **65** | Good |
| /bonuses/ | 15 | 20 | 20 | 10 | **65** | Good |
| / (homepage) | 18 | 16 | 15 | 15 | **64** | Good |
| /blog/is-this-online-earning-app-in-pakistan-legit/ | 13 | 16 | 19 | 12 | **60** | Good |
| /withdrawal/ | 14 | 15 | 12 | 11 | **52** | Needs Work |
| /easypaisa-jazzcash/ | 12 | 16 | 9 | 10 | **47** | Needs Work |

Evidence behind the scores:
- **/download/ Trust 18.** Strengths: self-hosted file, published SHA-256, recompute instructions, and an honest "we did not run it through VirusTotal". Gap: there is no third-party scan.
- **/safety/ Action 14.** The only CTA is "Download Pak Rummy", which is premature for someone still evaluating.
- **/easypaisa-jazzcash/ Trust 9.** The page contradicts homepage lines 20 and 42.
- **/withdrawal/ Trust 12.** A "Verified" badge sits on an operator-stated figure (`site.ts:136-139`), while minimum and maximum are unverified. A skeptic reads "Verified" as "independently checked".

**Weakest page for P1: /easypaisa-jazzcash/ (47).** Fix: align the homepage copy with the verified state, or verify `paymentMethods` with the operator. Add a "What 'Verified' means here" tooltip or footnote on every fact table that separates *independently checked* from *operator-stated*. One way to do this is a third label, "Operator-stated", that renders distinctly from "Verified" for facts like `withdrawalProcessingTime`, `operatorSupportEmail` and `operatorSocialProfiles`.

### P2 Returning Player With a Problem: page scores

| Page | Relevance | Clarity | Trust | Action | Total | Rating |
|---|---|---|---|---|---|---|
| /games/rummy/ (mid-game rules question) | 15 | 17 | 18 | 12 | **62** | Good |
| /download/ (update or old version) | 12 | 15 | 18 | 15 | **60** | Good |
| /withdrawal/ | 14 | 13 | 12 | 13 | **52** | Needs Work |
| /blog/jazzcash-withdrawal-charges/ | 14 | 15 | 13 | 10 | **52** | Needs Work |
| /deposit/ | 10 | 12 | 12 | 12 | **46** | Needs Work |
| /register-login/ | 11 | 12 | 12 | 5 | **40** | Needs Work |
| /easypaisa-jazzcash/ | 8 | 12 | 10 | 9 | **39** | Critical Mismatch |

Evidence behind the scores:
- **/register-login/ Action 5.** The only CTA is "Download Pak Rummy". There is no login link anywhere in the page body, and the footer link is the only route to pakrummy.com.
- **/withdrawal/ Clarity 13.** The content is organized by generic steps, not by symptom. "Pending", "rejected" and "short" are not H2s.
- **Fee post Trust 13.** It makes no sourced figures and does not link to the official SOC PDFs.
- **/download/ Relevance 12.** There is no old-version or update-failure section.

**Weakest page for P2: /easypaisa-jazzcash/ (39).** A player whose wallet payment failed lands on a page that cannot confirm the wallet is supported at all. Fix: add a "Payment failed or not reflected?" H2 near the top with three symptom links: /guides/mobile-wallet-deposit-delay/, /blog/why-is-my-withdrawal-pending/ and /complaints/. Make the primary CTA "Contact Pak Rummy support" (to /customer-service/) rather than "Download Pak Rummy".

### P3-P6: page each persona would land on

| Persona | Page | Relevance | Clarity | Trust | Action | Total | Rating |
|---|---|---|---|---|---|---|---|
| P3 Navigational Game-Seeker | / | 8 | 6 | 15 | 4 | **33** | Critical Mismatch |
| P4 Fee Checker | /blog/easypaisa-withdrawal-charges/ | 12 | 8 | 12 | 8 | **40** | Needs Work |
| P5 Bonus Hunter | /promo-code/ | 14 | 21 | 21 | 8 | **64** | Good |
| P6 Rules Learner | /games/rummy/ | 16 | 17 | 18 | 13 | **64** | Good |

- **P3 Action 4.** pakrummy.com is unlinked in the homepage body; the only link is in the footer.
- **P4 Clarity 8.** The fee checker gets no number within the first scroll, or anywhere on the page.

### Systemic issues

- **Action is the lowest dimension across all personas** (average about 11/25). Every key page uses the same sitewide header CTA, "Download Pak Rummy" linking to /download/, whatever the intent. A login seeker, a stuck-withdrawal player and a skeptic all get "Download". Intent-matched primary CTAs per page are the single highest-leverage SXO change.
- **Trust labelling.** "Verified" is used for both independently checked facts (checksum) and operator-stated facts (processing time, support email, Telegram). The source notes in `site.ts` make the distinction, but the rendered badge does not.

### Priority actions, sorted by weakest persona × volume

1. **P3 (33/100, 1,532 impressions).** Add an above-the-fold homepage button, "Go to the game: pakrummy.com" (outbound, `rel="noopener"`), next to "Download Pak Rummy". Link the existing hero text "the game is at pakrummy.com". Add the same button to /register-login/ as its primary CTA.
2. **P2 on /easypaisa-jazzcash/ (39) and /register-login/ (40).** Use intent-matched primary CTAs and symptom-first H2s.
3. **P4 (40).** Add the sourced, dated official fee-slab tables to both charges posts, and put the year in their titles.
4. **P1 on /easypaisa-jazzcash/ (47).** Resolve the homepage contradiction, and add an "Operator-stated" label distinct from "Verified".
5. **P1 trust cluster.** Add a "Real or fake? What we can prove" verdict ledger at the top of /safety/.
6. **P2 on /download/.** Add an "Old version?" section and an /app-version/ ownership split.

---

## 5. SXO Gap Score by page (7 dimensions, 100 points)

| Page | Page Type /15 | Depth /15 | UX /15 | Schema /15 | Media /15 | Authority /15 | Freshness /10 | **Total** |
|---|---|---|---|---|---|---|---|---|
| /download/ | 12 | 10 | 12 | 11 | 7 | 9 | 4 | **65** |
| /games/rummy/ | 10 | 6 | 9 | 6 | 4 | 9 | 5 | **49** |
| /blog/easypaisa-withdrawal-charges/ | 6 | 5 | 9 | 11 | 6 | 5 | 6 | **48** |
| /blog/jazzcash-withdrawal-charges/ | 6 | 4 | 9 | 11 | 6 | 5 | 6 | **47** |
| /safety/ (for the legitimacy intent) | 7 | 8 | 9 | 6 | 4 | 8 | 5 | **47** |
| /withdrawal/ | 9 | 5 | 8 | 6 | 4 | 7 | 5 | **44** |
| /deposit/ | 9 | 4 | 8 | 6 | 4 | 7 | 5 | **43** |
| /bonuses/ | 7 | 5 | 8 | 6 | 4 | 8 | 4 | **42** |
| /easypaisa-jazzcash/ | 7 | 4 | 7 | 6 | 5 | 6 | 4 | **39** |
| /register-login/ | 5 | 5 | 5 | 6 | 4 | 6 | 5 | **36** |

Evidence behind the dimensions:
- **Schema.** /download/ is the only non-blog page with an entity type beyond WebPage (`SoftwareApplication`). Payment, bonus and game pages render only WebPage, BreadcrumbList, Organization and WebSite. The blog posts carry BlogPosting. For deeper work, see `/seo schema`.
- **Media.** Pages carry 3-5 `<img>` each, mostly logo, icon and hero. None has install-flow screenshots, payment-screen screenshots or card-hand illustrations, which is the media the SERP competitors use (APKMirror screenshots, rules guides with card images).
- **Authority.** Blog posts are bylined "PakRummyOfficial.com Editorial Team" (for example `jazzcash-withdrawal-charges.md:5`), so no named person appears on YMYL payment content. The fee posts cite no primary sources. For E-E-A-T, see `/seo content`.
- **Freshness.** Core pages show "Last reviewed 17 August 2026" or "Last scanned 2026-08-17", which is 85 days old. The blog has had no new posts since 2026-10-19, which extends coordinator finding #1. htmldate extracted `publication_date: 2026-01-01` for /deposit/, /withdrawal/, /bonuses/, /easypaisa-jazzcash/, /install/, /register-login/, /promo-code/ and /official-domains/. Something on those pages emits a 2026-01-01 date, which is worth checking with the technical/schema agent, because Google may show it as the snippet date.

**Site-weighted SXO Gap Score: 47/100.** This weights the per-page scores by GSC impressions and includes the homepage's navigational failure (P3).

---

## 6. Pages where good on-page optimization will still fail to rank, because the format is wrong

| URL | On-page quality | Why it won't rank | Required format change |
|---|---|---|---|
| /blog/jazzcash-withdrawal-charges/ | Direct answer, FAQ, BlogPosting, internal links | The SERP rewards Rs fee tables, year-stamped titles and official PDFs. The page has 0 tables and 0 figures. GSC: 0 impressions in 90 days | Sourced fee-slab table plus year in the title, or re-angle to "withdrawal arrived short" |
| /blog/easypaisa-withdrawal-charges/ | Same as above | Same. GSC: 3 impressions at pos 46-66 | Same |
| /promo-code/ and /bonuses/ | An honest "no verified code" answer | The SERP is coupon aggregators showing codes, and the site is cannibalized across 3 URLs | Snippet-first "No verified code (Nov 2026)" title, and consolidation onto /promo-code/ |
| /blog/is-this-online-earning-app-in-pakistan-legit/ | 709 words, a worked example, candid disclosure | Generic topic, while the brand "real or fake" SERP is verdict-format pages. The title has no brand | A brand verdict ledger on /safety/. Keep this post as supporting content |
| /register-login/ | Clean steps and troubleshooting | Login intent wants a login button; the page offers only "Download" | Primary CTA to pakrummy.com |
| /app-version/ and /download/ for "old version" | A good facts table | Version-history intent; only one build is tracked | An "Old version?" section plus split query ownership |

---

## 7. Cross-skill referrals

- **E-E-A-T** (team byline on YMYL payment posts, no primary-source citations): `/seo content`
- **Schema** (payment, bonus and game pages carry only WebPage; the stray 2026-01-01 date signal): `/seo schema`
- **Thin content** (/deposit/ 182 words, /bonuses/ 208, /install/ 209, /app-version/ 213): `/seo page`
- **Local:** not applicable. There is no local-pack intent in any sampled SERP.

---

## 8. Limitations

- **No true Google SERP features.** WebSearch returns organic URLs only. PAA questions, AI Overview presence and citations, ads, featured-snippet format and related searches could not be observed, so user stories lean on GSC query evidence and organic result titles instead. Note too that the WebSearch index is clearly not Google's: pakrummyofficial.com did not appear in any sampled result set, even for queries where GSC shows it at pos 4-10.
- **GSC anonymization.** Long-tail queries below Google's privacy threshold are hidden. For example, /withdrawal/ shows 268 impressions but only 5 attributed to visible queries. Absence of payment or trust queries is therefore not proof of zero demand.
- **GSC property.** Only the URL-prefix property (`https://pakrummyofficial.com/`) is accessible; `sc-domain:` returned permission denied. The data covers 2026-08-12 to 2026-11-07 (about 87 days, starting near site launch).
- **Not rendered for this pass:** /blog/why-is-my-withdrawal-pending/, /guides/mobile-wallet-deposit-delay/, /customer-service/, /complaints/ and the game pages other than /games/rummy/. The P2 symptom-routing recommendations assume those pages exist as published, which the git log confirms, but their content was not scored.
- **No click or behaviour data.** Scroll depth, bounce and engagement from GA4 were not pulled for this pass. The persona clarity scores are heuristic, based on DOM order and headings.
- **No wireframes** were generated (not requested).

---

## 9. Structured findings (for audit-data.json, category "Search Experience")

```json
{
  "category": "Search Experience",
  "sxo_gap_score": 47,
  "data_sources": ["render_page.py --mode always (16 URLs)", "GSC https://pakrummyofficial.com/ 2026-08-12..2026-11-07", "WebSearch x13"],
  "findings": [
    {"id": "SXO-01", "severity": "critical", "title": "1,532 navigational impressions for pakrummy.com convert at 4.8%; no above-the-fold link to the game site", "urls": ["https://pakrummyofficial.com/"], "evidence": "GSC: pakrummy.com 1039 imp pos 10.0 + typos; only <a href=https://pakrummy.com> is in Footer.astro:60 and about/index.astro:38; index.astro:41 mentions pakrummy.com as plain text", "fix": "Add primary hero button 'Go to the game: pakrummy.com'; link the hero text"},
    {"id": "SXO-02", "severity": "critical", "title": "Withdrawal-charges posts have the wrong content format (no fee table/figures) for a SERP of Rs fee-slab tables and official SOC PDFs", "urls": ["https://pakrummyofficial.com/blog/jazzcash-withdrawal-charges/", "https://pakrummyofficial.com/blog/easypaisa-withdrawal-charges/"], "evidence": "0 tables, 0 Rs figures; GSC jazzcash post 0 imp/90d, easypaisa post 3 imp pos 46-66; SERP: toolsfluent.com fee tables, mobilinkbank.com SOC_Q1_2026.pdf, easypaisa.com.pk SOC PDF", "fix": "Add dated fee-slab table sourced to official wallet SOC PDFs; year in title; keep Pak Rummy's own fee as unverified row"},
    {"id": "SXO-03", "severity": "high", "title": "Homepage claims Easypaisa/JazzCash support that /easypaisa-jazzcash/ says is unverified", "urls": ["https://pakrummyofficial.com/", "https://pakrummyofficial.com/easypaisa-jazzcash/"], "evidence": "index.astro:20 meta 'Easypaisa/JazzCash deposits'; index.astro:42 'PKR, Easypaisa, JazzCash'; payment page 'support status: not yet publicly verified'", "fix": "Verify paymentMethods with operator or soften homepage copy"},
    {"id": "SXO-04", "severity": "high", "title": "/register-login/ serves login intent with a Download CTA and no login link", "urls": ["https://pakrummyofficial.com/register-login/"], "evidence": "GSC 'pak rummy 2026 registration' 30 imp 0 clicks pos 13; only CTA 'Download Pak Rummy'", "fix": "Primary CTA 'Log in or register at pakrummy.com'"},
    {"id": "SXO-05", "severity": "high", "title": "'Old version' APK cluster (210 imp, 24% CTR) split between /download/ and /app-version/; neither answers it", "urls": ["https://pakrummyofficial.com/download/", "https://pakrummyofficial.com/app-version/"], "evidence": "GSC pos 19-26; app-version says 1.1.2 is the first tracked build", "fix": "'Old version?' H2 on /download/ (compatibility, update-failure, mirror-APK risk); /app-version/ owns version-history intent"},
    {"id": "SXO-06", "severity": "high", "title": "No verdict-format page for brand legitimacy queries ('pak rummy real or fake')", "urls": ["https://pakrummyofficial.com/safety/", "https://pakrummyofficial.com/blog/is-this-online-earning-app-in-pakistan-legit/"], "evidence": "SERP: pakgames.uk.com/real-or-fake/ 'Honest review'; /safety/ is APK-file safety; legit post is generic, no brand in title", "fix": "'Real or fake? What we can prove' Proven/Not-proven ledger at top of /safety/"},
    {"id": "SXO-07", "severity": "high", "title": "'pak rummy promo code' cannibalized across 3 URLs against a coupon-aggregator SERP", "urls": ["https://pakrummyofficial.com/promo-code/", "https://pakrummyofficial.com/bonuses/", "https://pakrummyofficial.com/deposit/"], "evidence": "GSC pos 9.7 / 11 / 8; 37 imp 3 clicks", "fix": "Answer-first dated title on /promo-code/; de-target the other two"},
    {"id": "SXO-08", "severity": "medium", "title": "/withdrawal/ CTR 2.99% at pos 8.9 (268 imp); generic 'typically' snippet and step-based rather than symptom-based structure", "urls": ["https://pakrummyofficial.com/withdrawal/"], "evidence": "GSC page totals; 233 words; 2/3 facts unverified", "fix": "Symptom H2s (pending / rejected / arrived short / name mismatch) routing to deep pages; rewrite meta description to problem-first"},
    {"id": "SXO-09", "severity": "medium", "title": "'Verified' badge used for operator-stated facts", "urls": ["https://pakrummyofficial.com/withdrawal/", "https://pakrummyofficial.com/customer-service/"], "evidence": "site.ts:136-139 withdrawalProcessingTime 'stated by the Pak Rummy team' renders as Verified", "fix": "Add distinct 'Operator-stated' label"},
    {"id": "SXO-10", "severity": "medium", "title": "Uniform sitewide 'Download Pak Rummy' CTA regardless of page intent", "urls": ["https://pakrummyofficial.com/easypaisa-jazzcash/", "https://pakrummyofficial.com/withdrawal/", "https://pakrummyofficial.com/safety/"], "evidence": "Every rendered key page's only CTA-class link is /download/", "fix": "Per-page intent-matched primary CTA"},
    {"id": "SXO-11", "severity": "low", "title": "Visible review dates 85 days stale on download/version pages; htmldate extracts 2026-01-01 on 8 core pages", "urls": ["https://pakrummyofficial.com/download/", "https://pakrummyofficial.com/deposit/"], "evidence": "Meta description 'Updated 17 August 2026'; publication_date 2026-01-01", "fix": "Re-scan and re-date; locate the 2026-01-01 date source"}
  ]
}
```

Generate a PDF report? Use `/seo google report`.
