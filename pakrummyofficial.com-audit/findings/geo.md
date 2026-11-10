# GEO / AI Search Readiness: pakrummyofficial.com

Audited 2026-11-10 by the seo-geo agent. Method: I read the source in `D:\PakrummyOfficial\src` and checked the live site with `render_page.py --mode never`. All pages are static SSR, `is_spa: false` on every page sampled. I tested the edge with curl, once per crawler user-agent, and checked lookalike domains and Wikipedia/Reddit for brand mentions. SITE-CONTEXT facts were taken as given and not re-derived. DataForSEO MCP was not available, so there is no live ChatGPT or LLM-mention tracking data.

## GEO Readiness Score: 58 / 100

| Dimension | Weight | Score | Weighted |
|---|---|---|---|
| Citability | 25% | 68 | 17.0 |
| Structural Readability | 20% | 72 | 14.4 |
| Multi-Modal Content | 15% | 40 | 6.0 |
| Authority & Brand Signals | 20% | 35 | 7.0 |
| Technical Accessibility | 20% | 70 | 14.0 |
| **Total** | | | **58** |

### Platform-specific readiness

| Platform | Score | Governing crawler / index | Main limiter |
|---|---|---|---|
| Google AI Overviews / AI Mode | 60 | Googlebot (allowed, 200) | YMYL niche, but no named author or reviewer. The core payment pages are thin (/withdrawal/ 233 words) |
| ChatGPT Search | 52 | OAI-SearchBot + ChatGPT-User (allowed, 200). Bing index is a major upstream source | Bing Webmaster not verified for this domain (SITE-CONTEXT), no IndexNow, no `<lastmod>` |
| Perplexity | 62 | PerplexityBot + Perplexity-User (allowed, 200) | Weak off-site corroboration: no Reddit/YouTube footprint |
| Bing Copilot | 45 | Bingbot (allowed, 200) | Site not verified in BWT, no IndexNow key in `public/` |
| Claude (search) | 60 | Claude-SearchBot + Claude-User (allowed, 200) | Same corroboration gap |
| Gemini app (grounded answers) | 25 | Google-Extended (Disallow) | Blocked from Gemini-app grounding (see T1) |

---

## 1. AI crawler access: verified at the edge, not just in robots.txt

robots.txt was not re-fetched to re-confirm it. I checked the live file only for the per-bot detail, then sent each crawler UA to `https://pakrummyofficial.com/download/` and `/`:

| Crawler | Governs | robots.txt | Edge response (spoofed UA) |
|---|---|---|---|
| Googlebot | Google Search + AI Overviews/AI Mode | Allow | 200 |
| Bingbot | Bing + Copilot. Also upstream for ChatGPT Search | Allow | 200 |
| OAI-SearchBot | ChatGPT Search citations | Allow (falls to `*`) | 200 |
| ChatGPT-User | ChatGPT user-initiated fetch | Allow | 200 |
| PerplexityBot / Perplexity-User | Perplexity index / live fetch | Allow | 200 / 200 |
| Claude-SearchBot | Claude search citations | Allow | 200 |
| DuckAssistBot | DuckDuckGo AI answers | Allow | 200 |
| meta-externalfetcher | Meta AI user-initiated fetch | Allow | 200 |
| GPTBot | OpenAI **training only** (does not affect ChatGPT Search) | Disallow | **403** |
| ClaudeBot | Anthropic **training only** (does not affect Claude search) | Disallow | **403** |
| CCBot | Common Crawl (training corpora for many open models) | Disallow | **403** |
| Amazonbot | Amazon (Alexa/Rufus answers + training) | Disallow | **403** |
| Google-Extended | Gemini **training AND Gemini-app / Vertex grounding**. Not Search/AIO | Disallow | n/a (a robots token, not a separate fetcher) |
| Google-CloudVertexBot | Vertex AI Agent Builder site crawls | Disallow | n/a |
| Applebot-Extended | Apple Intelligence training only. Siri/Spotlight follow Applebot (allowed) | Disallow | n/a |
| meta-externalagent | Meta AI training/indexing | Disallow | 200 (robots-only, not WAF-enforced) |
| PetalBot | **Huawei Petal Search (a search engine, not a training bot)** | Disallow | 200 (robots-only) |
| Baiduspider | Baidu Search | Disallow | n/a |

Findings:
- **T-A. The training-bot block is enforced at the edge, not just in robots.txt.** GPTBot, ClaudeBot, CCBot and Amazonbot UAs get `403` (25-byte body). That points to Cloudflare "Block AI bots" / AI Crawl Control at the WAF. Even `https://pakrummyofficial.com/llms.txt` returns 403 to the GPTBot UA. Enforcement is also uneven: meta-externalagent and PetalBot are Disallowed in robots.txt but get 200 at the edge.
- **T-B. `ai-input` is not declared.** The live signal is `Content-Signal: search=yes,ai-train=no,use=reference`. Cloudflare's own preamble in the same robots.txt defines three things:
  - `search` as "hyperlinks and short excerpts… Search does **not** include providing AI-generated search summaries".
  - `ai-input` as "retrieval augmented generation, grounding, or other real-time taking of content for generative AI search answers".
  - An undeclared signal as "neither grants nor restricts".

  So under the site's own declared policy, the site has never granted AI-answer use, which is the exact use it wants to be cited for. `use=reference` is not part of the published Cloudflare Content Signals vocabulary (search / ai-input / ai-train), as far as I can tell. I'm not aware of any major AI vendor that acts on it. Fix: add `ai-input=yes` explicitly.
- **T-C. Duplicate `User-agent: *` groups.** One `*` group sits inside the Cloudflare-managed block (with the Content-Signal) and another sits after it, both `Allow: /`. RFC 9309 merges them, so nothing breaks. It is just noise.

### Is "block training, allow search" the right trade-off here? Probably not entirely.

For most publishers, blocking training while allowing search is a sensible default: search bots drive citations and clicks, training bots don't. **This site is not a typical publisher, though.** Its core value is anti-impersonation: "this is the real APK, here is the SHA-256, here is the package name". Evidence collected today:

- **pakrummy.pk** (title "Pak Rummy APK Download Latest 1.1.6.7(1.0.4) | PakRummy.pk", ships FAQPage schema, states "41 MB"). It publishes a version and file size that conflict with this site's verified `1.1.2` / `38.7 MB`.
- **pakrummy.com.pk** (title "PAK Rummy Game (Official Earning App) in Pakistan 2026"). It claims "Official".
- **English Wikipedia** ("Mille (card game)", Origins section) cites `<ref>{{Cite web|title=Pak Rummy|url=https://pakrummy.com.pk/|accessdate=5 June 2026}}</ref>`. Wikipedia is a heavily weighted training and grounding source, and it currently associates the name "Pak Rummy" with the .com.pk lookalike, not with pakrummy.com or this site.

None of those sites block training crawlers. When a model answers from parametric memory, it learns "Pak Rummy" from them. That includes no-browse modes, free tiers, API calls without search, and on-device models. This site's correcting facts are missing because GPTBot, ClaudeBot and CCBot get 403. The block keeps the official counter-narrative out of model memory and leaves the copycats' version in. For a site whose goal is "be the source models cite for what is official", that probably costs more reach than the operator realizes.

The **Google-Extended** block has a concrete live-retrieval cost too. It removes the site from **grounding in the Gemini app**, not just from training. This site's audience is 100% Android users in Pakistan, where Gemini is the default assistant on most handsets. AI Overviews/AI Mode are unaffected, because they follow Googlebot.

**PetalBot** is Huawei's search crawler, not a training crawler. Blocking it removes the site from Petal Search on Huawei devices for no training benefit.

Recommendation (an operator decision, since this is a deliberate policy):
1. Add `ai-input=yes` to the Content-Signal now. Zero risk, consistent with intent.
2. Unblock PetalBot (it's a search engine) and Google-Extended (Gemini-app grounding reach on Android).
3. Consider allowing GPTBot, ClaudeBot and CCBot. Low monetization risk: there's no ad/pageview model, and the site's goal is brand and download verification. The upside is getting verified facts (package `com.rummy.pak.games`, SHA-256 `db6c3d31…14ab5`, "the game is at pakrummy.com") into the next model generations, where the copycats are currently uncontested. If full training opt-in is unacceptable, at minimum make it consistent: the WAF currently blocks llms.txt for GPTBot, a file whose only purpose is to be read by LLMs.

---

## 2. llms.txt: present, stale, partly inaccurate

Live `https://pakrummyofficial.com/llms.txt` matches `src/pages/llms.txt.ts` exactly. It carries the hard-coded string `Last updated: 2026-08-17` (line 87). `/llms-full.txt` returns 404 (optional).

- **Staleness confirmed, and wider than SITE-CONTEXT stated.** The generator hard-codes 43 links and never enumerates the `blog`, `guides` or `updates` content collections (it only loops `VERIFIED_GAMES`). **21 of the 64 sitemap URLs are absent:**
  - all **16** `/blog/<slug>/` posts: the 15 published 2026-10-08 to 10-19 plus `rummy-strategy-fundamentals-for-beginners` (2026-08-21)
  - all **3** `/guides/<slug>/` articles (2026-08-17)
  - `/card-rummy-vs-pak-rummy/` (2026-10-08), arguably the single most entity-relevant page on the site
  - `/updates/site-launch/`
- **Inaccurate descriptions:**
  - Line 49: `/withdrawal/` is described as "current **verified** limits". In `src/config/site.ts`, `minWithdrawalPkr`/`maxWithdrawalPkr` are `unverified()`; only processing time is verified.
  - Line 48: `/deposit/` is described as "current **verified** payment facts", but `paymentMethods`, `minDepositPkr` and `maxDepositPkr` are all `unverified()`.

  Both contradict the site's own Verified<T> contract in exactly the file written for LLMs.
- Line 53 describes the Blog as "Rummy strategy, Pakistan mobile gaming context, and responsible-gaming reading". It now mostly covers payments (Easypaisa/JazzCash charges, pending withdrawals, KYC) and game rules.
- Fix (about 1 hour): use `getCollection('blog'|'guides'|'updates')` in the generator, emitting `- [title](url): description` from frontmatter. Derive "Last updated" from the newest `publishDate`/`updatedDate`/`verifiedOn`. Change the withdrawal/deposit descriptions so they don't call unverified figures verified.

Weight: llms.txt has low weight. Google says it doesn't use it, and the file itself says so. Fix it because it's cheap, and because a file that contradicts the site's verified-fact framing undermines the main trust asset.

---

## 3. Passage-level citability

Strengths (keep):
- **All 19 long-form articles (16 blog + 3 guides) open with a `## Direct answer` H2.** Example, /blog/why-is-my-withdrawal-pending/: "A withdrawal usually shows as pending due to identity verification still processing, normal payment-processor delays, or the app's own stated processing window simply not having elapsed yet…" That is a 50-word self-contained answer, close to ideal for AIO/Perplexity extraction.
- **Verified fact tables** (FactTable component) are among the most extractable formats there is: label/value/status rows like "SHA-256 checksum | db6c3d31… | Verified", "Typical processing time | 5–10 minutes | Verified". The verified/unverified labelling is a real citability asset. Perplexity and AIO favour sources that state the limits of their own claims, and nothing else in this niche does it. Competitors publish unhedged version numbers.
- /card-rummy-vs-pak-rummy/ (860 words) is the strongest GEO page. It carries an explicit disclosure ("We are not affiliated with Card Rummy… checked on 2026-10-08"), a per-claim source domain, and a scorecard table.

Problems:
- **P1. /withdrawal/ contradicts itself in its most-extractable sentence.** The hero summary (`src/pages/withdrawal/index.astro` lines 27-29) says: "We have not confirmed Pak Rummy's specific limits **or processing time**". Directly below it, the FactTable shows "Typical processing time | 5–10 minutes | Verified" (verified 2026-10-04 per site.ts). The /blog/why-is-my-withdrawal-pending/ post states the same 5–10 minute figure. The lede predates the 2026-10-04 verification and was never updated. The lede is exactly what an AI answer engine lifts, so a "how long does a Pak Rummy withdrawal take" query can surface "not confirmed" or "5–10 minutes" depending on which passage gets chunked. Fix: one sentence, 5 minutes.
- **P2. Core money pages are thin** (extracted text): /withdrawal/ 233 words, /legal-status/ 279, /download/ 379, /about/ 155, /official-domains/ 354. AIO and Perplexity both prefer pages that answer the full intent cluster. For example, "Pak Rummy withdrawal" should cover the time, method (Easypaisa/JazzCash), KYC dependency, what "pending" means, and when to contact support. Today that intent is split across /withdrawal/, /blog/why-is-my-withdrawal-pending/, /blog/jazzcash-withdrawal-charges/ and /blog/easypaisa-withdrawal-charges/.
- **P3. /legal-status/ has almost nothing citable.** It is honest ("pending review by qualified Pakistani legal counsel", "We do not know of… any specific government approval, license"), which is correct for YMYL. But it contains no fact an LLM can quote. "Is online rummy legal in Pakistan" is one of the highest-value AI-answer queries in this niche. Once counsel has reviewed it, add 2-3 attributed statements that name the governing statutes and link primary sources. Until then, the current non-answer is the right call. Do not add unreviewed legal claims.
- **P4. The payment-charges posts hedge without citing anything.** /blog/easypaisa-withdrawal-charges/ (560 words) and /blog/jazzcash-withdrawal-charges/ (510 words) talk about how charges "typically" work but link no primary source (Easypaisa/JazzCash published tariff pages). Queries like "JazzCash withdrawal charges" are a strong AIO opportunity, and AIO cites pages that quote figures with a source and date. Add a sourced, dated table ("per Easypaisa tariff page, checked YYYY-MM-DD"), which fits the Verified<T> pattern.
- **P5. Core pages use statement headings, not questions** ("What we can say", "Typical withdrawal steps", "How we verify a domain"). Blog posts already use FAQ sections. Rewriting the 6-8 core-page H2s as questions ("How long does a Pak Rummy withdrawal take?", "Is Pak Rummy legal in Pakistan?", "What is the official Pak Rummy APK checksum?") gives a cheap gain in query-to-passage matching.
- Dates: non-article pages carry no `datePublished`/`dateModified` in JSON-LD (verified on /, /download/, /withdrawal/, /legal-status/, /official-domains/, /about/). trafilatura fell back to `2026-01-01` for four of them. The home page shows "Last reviewed 17 August 2026" in visible text only. The SoftwareApplication node on /download/ has `datePublished: 2026-08-17` but no `dateModified`. Add the date `verifiedOn` was last changed as `dateModified` on fact pages. Freshness is a ranking input for Perplexity and AIO on "latest version" queries, where pakrummy.pk claims a newer version.

---

## 4. Brand entity clarity: the biggest GEO weakness

There are three names plus competing lookalikes, and the site contradicts itself about which is official.

| Name / domain | What it is | How the site describes it |
|---|---|---|
| "Pak Rummy" | The app/game brand (`SITE.brandName`) | Consistent |
| pakrummy.com (→ www.pakrummy.com) | Game/operator site, title "Pak Rummy \| Trusted Online Gaming site…" | "The game itself is at pakrummy.com" on every page (in the Organization description, the home page and /about/) |
| PakRummyOfficial.com / "Pak Rummy Official" | This site. Organization `name: "PakRummyOfficial.com"`, WebSite `name: "Pak Rummy Official"` | "the official information… website **of the Pak Rummy team**" |
| pakrummy.pk, pakrummy.com.pk | Unaffiliated lookalikes claiming "Official", with conflicting version/size | Not named anywhere on the site |

Problems:
- **E1. /official-domains/ contradicts the sitewide claim.** Its H1 summary (`src/pages/official-domains/index.astro` lines 25-27) says: "We have not yet independently confirmed which domain(s) are authentic, operator-controlled Pak Rummy properties." Meanwhile every page, the Organization JSON-LD and llms.txt say the site is run by the Pak Rummy team and the game is at pakrummy.com. An LLM asked "what is the official Pak Rummy website?" will most likely retrieve this exact page, by title match ("Pak Rummy Official Domains"), and its lede says the site doesn't know. The page is the biggest single entity-clarity liability on the site. Fix: state plainly that pakrummy.com is the game/operator domain and PakRummyOfficial.com is the team's information site, and add how that was verified (the operator supplied it on date X). Then name the known lookalikes (pakrummy.pk, pakrummy.com.pk) as **not** operated by the Pak Rummy team, with their conflicting facts as evidence.
- **E2. First-party vs third-party voice is ambiguous.** The site says it is "run by the Pak Rummy team" (/card-rummy-vs-pak-rummy/, home "Official — run by the Pak Rummy team"). Yet it describes operator facts in third-party language: "Supplied directly by the Pak Rummy team. We haven't independently tested…" (support email, chat, Telegram notes in site.ts), and "We have not confirmed Pak Rummy's specific limits". LLMs need one relationship to state. Either "official site of the operator" (then operator facts are first-party) or "independent verification site endorsed by the operator" (then drop "run by the Pak Rummy team"). Pick one and use the same sentence everywhere. SITE-CONTEXT calls the site "affiliate-adjacent", which suggests the second framing may be the more accurate one.
- **E3. The relationship is not reciprocal.** The live homepage of www.pakrummy.com contains **zero** references to "pakrummyofficial" (grep of 138,520 bytes). Its only social link is `https://facebook.com/Pakrummyofficiial` (note the double "i"), which this site doesn't reference. Entity resolution in AI systems depends on corroboration. A one-way "we are official" claim with no link back from the operator domain is exactly the pattern copycats use. Ask the operator for a footer link from pakrummy.com to pakrummyofficial.com. This is the single highest-value authority action.
- **E4. The Organization schema has no entity graph.** The `#publisher` Organization has only `name`, `url` and `description`. It has no `sameAs` (Telegram `https://t.me/Pakrummyagents` is verified in site.ts but not emitted), no `logo`, and no link to the game/operator. The SoftwareApplication on /download/ has no `publisher`/`author`/`offers`/`url` linking it to an operator entity. Add:
  - an Organization or Brand node for "Pak Rummy" with `url: https://pakrummy.com`
  - SoftwareApplication `publisher`/`brand` pointing to that node
  - this site's Organization with `sameAs` (only verified profiles)
  - `alternateName: ["Pak Rummy Official", "PakRummyOfficial"]`
  - possibly `parentOrganization` or `brand`, only if the relationship in E2 is settled as first-party
- **E5. Wikipedia already maps "Pak Rummy" to pakrummy.com.pk** (see section 1). The site cannot edit this for itself (COI rules), but it should know about it. It is the most likely reason an LLM would conflate the brand with the lookalike.
- **E6. Author entity.** Every article's JSON-LD has `"author":{"@type":"Person","name":"PakRummyOfficial.com Editorial Team"}` (src/lib/schema.ts lines 118-121). A team is not a Person. Use `@type: Organization` and reference `#publisher`. The /authors/ page openly says there are no named contributors ("we won't invent names or bios"), which is honest and should stay. For YMYL AIO eligibility, though, one named, real reviewer for the payment and legal pages would be a material gain.

Off-site presence:

| Signal | Status |
|---|---|
| Wikipedia | No entity for this site. "Pak Rummy" is cited only via pakrummy.com.pk on "Mille (card game)" |
| Reddit | Not measurable. reddit.com/search.json returned an HTML wall, no data. No evidence of presence |
| YouTube | None found on the site or referenced from it. This is the strongest correlated signal (~0.74) and it is entirely absent |
| LinkedIn | None |
| Telegram | `t.me/Pakrummyagents` (verified, operator-supplied) |
| Facebook | Operator links `facebook.com/Pakrummyofficiial`. Not referenced by this site |

---

## 5. Multi-modal (40/100)

There are hero images per blog post (`/images/blog-*-hero.webp`, present in the BlogPosting `image`) and an app-icon verification image (/download/, /official-domains/). Missing:
- install-step screenshots on /install/ and /guides/enable-unknown-sources-android/
- any video
- a visual "how to check the SHA-256 on Android" walkthrough

A short YouTube video (install plus checksum verification, about 2 minutes, Urdu/English) would serve both the multi-modal gap and the strongest brand-mention signal. It would also give AIO/Gemini a video result to pair with the text answer.

---

## 6. Content freshness (extends SITE-CONTEXT finding #1)

The 22-day publishing halt matters most for GEO on version and currency queries. The verified app facts are all dated 2026-08-17 (85 days old), while pakrummy.pk advertises a newer version (1.1.6.7). If 1.1.2 is still current, re-verify it and bump `verifiedOn`/`dateModified`, so "latest Pak Rummy version" answers show a recent date from the official source. If it isn't current, the site is losing the freshness contest to a lookalike.

---

## Top 5 highest-impact changes

| # | Change | Impact | Effort |
|---|---|---|---|
| 1 | **Resolve the official-domain contradiction (E1/E2).** Rewrite /official-domains/ to name pakrummy.com and PakRummyOfficial.com and how they were verified, and list the known lookalikes (pakrummy.pk, pakrummy.com.pk) with their conflicting facts. Use one consistent relationship sentence sitewide | Very high: it is the page an LLM retrieves for "official Pak Rummy site" | 1-2 h (copy) + an operator decision on framing |
| 2 | **Get a reciprocal footer link from pakrummy.com to pakrummyofficial.com (E3)**, and emit the entity graph in JSON-LD (E4: Brand/Organization for Pak Rummy, `sameAs`, SoftwareApplication `publisher`) | Very high: corroboration for entity resolution | Schema 1-2 h; link depends on the operator |
| 3 | **Revisit the AI-crawler policy (section 1).** Add `ai-input=yes`; unblock PetalBot and Google-Extended; seriously consider allowing GPTBot/ClaudeBot/CCBot, given the copycats own the training-data narrative; stop 403ing llms.txt | High: Gemini-app grounding on Android, parametric-memory presence | 15 min in Cloudflare (robots/AI Crawl Control settings) |
| 4 | **Fix factual inconsistencies in citable passages.** /withdrawal/ lede (P1); llms.txt "verified limits"/"verified payment facts" (section 2); regenerate llms.txt from collections with a derived date | High: removes contradictory answers in YMYL money queries | 1-1.5 h |
| 5 | **Verify the site in Bing Webmaster Tools and add IndexNow** (Astro integration or a post-publish ping in `scripts/publish-next-post.sh`). Add `<lastmod>` to the sitemap and `dateModified` on fact pages | High for ChatGPT Search + Copilot (Bing-fed) | 1-2 h |

Next tier: question-form H2s on core pages (P5, 1 h); sourced tariff tables in the Easypaisa/JazzCash posts (P4, 2-3 h, recurring re-checks); consolidate the withdrawal intent cluster into /withdrawal/ (P2, 2 h); author `@type` fix (E6, 10 min); a YouTube install/checksum video (section 5, 1 day); restart the publishing queue and re-verify the app version (section 6).

---

## Structured findings (for audit-data.json → "AI Search Readiness")

```json
{
  "category": "AI Search Readiness",
  "score": 58,
  "dimensions": {"citability": 68, "structural_readability": 72, "multimodal": 40, "authority_brand": 35, "technical_accessibility": 70},
  "platform_scores": {"google_aio": 60, "chatgpt_search": 52, "perplexity": 62, "bing_copilot": 45, "claude_search": 60, "gemini_app": 25},
  "findings": [
    {"id": "geo-entity-official-domains-contradiction", "severity": "high", "url": "https://pakrummyofficial.com/official-domains/", "evidence": "Lede: 'We have not yet independently confirmed which domain(s) are authentic, operator-controlled Pak Rummy properties.' vs sitewide 'run by the Pak Rummy team; the game itself is at pakrummy.com'", "fix": "State pakrummy.com + PakRummyOfficial.com relationship explicitly; name lookalikes pakrummy.pk / pakrummy.com.pk as not operated by the team"},
    {"id": "geo-entity-no-reciprocal-link", "severity": "high", "url": "https://www.pakrummy.com/", "evidence": "0 occurrences of 'pakrummyofficial' on operator homepage; operator links facebook.com/Pakrummyofficiial", "fix": "Request footer link from pakrummy.com; add sameAs/brand/publisher entity graph"},
    {"id": "geo-entity-lookalikes-conflicting-facts", "severity": "high", "url": "https://pakrummy.pk/", "evidence": "pakrummy.pk title claims 'Latest 1.1.6.7', 41 MB vs verified 1.1.2 / 38.7 MB; pakrummy.com.pk claims 'Official Earning App'; en.wikipedia 'Mille (card game)' cites pakrummy.com.pk as 'Pak Rummy'", "fix": "Name and refute on /official-domains/; re-verify current version"},
    {"id": "geo-robots-ai-input-undeclared", "severity": "medium", "url": "https://pakrummyofficial.com/robots.txt", "evidence": "Content-Signal: search=yes,ai-train=no,use=reference; ai-input absent; preamble defines search as excluding AI summaries", "fix": "Add ai-input=yes"},
    {"id": "geo-robots-training-block-tradeoff", "severity": "medium", "url": "https://pakrummyofficial.com/robots.txt", "evidence": "GPTBot/ClaudeBot/CCBot/Amazonbot -> HTTP 403 at Cloudflare edge; llms.txt also 403 to GPTBot; Google-Extended Disallow removes Gemini-app grounding; PetalBot (Huawei search) Disallowed", "fix": "Add ai-input=yes; unblock PetalBot + Google-Extended; consider allowing GPTBot/ClaudeBot/CCBot"},
    {"id": "geo-llms-txt-stale", "severity": "medium", "url": "https://pakrummyofficial.com/llms.txt", "evidence": "43 links vs 64 sitemap URLs; missing all 16 blog posts, 3 guides, /card-rummy-vs-pak-rummy/, /updates/site-launch/; hard-coded 'Last updated: 2026-08-17' (src/pages/llms.txt.ts:87)", "fix": "Generate from getCollection(); derive date"},
    {"id": "geo-llms-txt-inaccurate-verified-claims", "severity": "medium", "url": "https://pakrummyofficial.com/llms.txt", "evidence": "'/withdrawal/: current verified limits' and '/deposit/: current verified payment facts' while minWithdrawalPkr, maxWithdrawalPkr, paymentMethods are unverified() in site.ts", "fix": "Reword descriptions"},
    {"id": "geo-withdrawal-lede-contradiction", "severity": "high", "url": "https://pakrummyofficial.com/withdrawal/", "evidence": "src/pages/withdrawal/index.astro:27-29 'We have not confirmed Pak Rummy's specific limits or processing time' while FactTable shows processing time 5-10 minutes Verified (2026-10-04)", "fix": "Update lede to cite the verified 5-10 minute figure"},
    {"id": "geo-thin-core-pages", "severity": "medium", "evidence": "Extracted words: /about/ 155, /withdrawal/ 233, /legal-status/ 279, /official-domains/ 354, /download/ 379", "fix": "Consolidate intent clusters, question-form H2s"},
    {"id": "geo-no-datemodified-fact-pages", "severity": "low", "evidence": "No datePublished/dateModified JSON-LD on /, /download/, /withdrawal/, /legal-status/, /official-domains/, /about/", "fix": "Emit dateModified from verifiedOn"},
    {"id": "geo-author-type-person-for-team", "severity": "low", "url": "src/lib/schema.ts:118-121", "evidence": "author {'@type':'Person','name':'PakRummyOfficial.com Editorial Team'}", "fix": "Use Organization / reference #publisher"},
    {"id": "geo-bing-unverified", "severity": "medium", "evidence": "pakrummyofficial.com absent from BWT verified-site list; no IndexNow key file in public/", "fix": "Verify in BWT, add IndexNow ping to publish script"},
    {"id": "geo-multimodal-gap", "severity": "low", "evidence": "No video, no install screenshots; no YouTube presence", "fix": "2-min install + checksum verification video"}
  ],
  "strengths": [
    "All 19 articles open with a '## Direct answer' section",
    "Verified/Unverified FactTables with dated provenance; extractable label/value rows",
    "Static SSR, all AI search/retrieval bots (OAI-SearchBot, ChatGPT-User, PerplexityBot, Perplexity-User, Claude-SearchBot, Bingbot, Googlebot, DuckAssistBot) return 200",
    "/card-rummy-vs-pak-rummy/ has explicit disclosure and per-claim sourcing"
  ]
}
```

## Limitations
- Edge tests used spoofed UAs from a non-crawler IP. A 200 shows the UA rule passes, but Cloudflare verified-bot handling for real crawler IPs may differ. The 403s are conclusive for the UA rule.
- No DataForSEO, so there is no live ChatGPT or Perplexity citation sampling. Reddit search returned no usable data. Brand-mention coverage is therefore limited to direct checks (Wikipedia API, operator and lookalike homepages).
- Bing data is unavailable for this domain (SITE-CONTEXT).
