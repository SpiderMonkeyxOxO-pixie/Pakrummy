# Blog content briefs — quick-win keyword clusters (2026-10-08)

Source: Ahrefs `keywords-explorer-matching-terms` (country=PK, checked 2026-10-08) cross-referenced against `docs/seo-keyword-map.md` and `docs/content-inventory.md`. Covers 3 of the 4 clusters prioritized by the site owner: **game rules**, **Aviator/Crash explainers**, **earning-app evaluation**. The payments cluster (JazzCash/Easypaisa specifics) was deprioritized and isn't briefed here.

House style note: this site's existing guides run 500–900 words and are explicitly not padded to hit a length target (`docs/content-inventory.md`). Target word counts below follow that house style rather than a generic "match competitor average" rule — competitors in this niche are frequently padded, spun, or outright spam, and matching their length would work against the site's own no-padding convention.

All seven posts go in `src/content/blog/` per the existing collection schema (`title`, `description` ≤200 chars, `publishDate`, `author`, `category`, ≥2 `relatedLinks` — see `src/content/config.ts`).

---

## 1. Teen Patti rules

### Search Intent
Informational, beginner-level. Searcher wants hand rankings and basic play order before joining a table, not strategy depth yet. SERP currently rewards long-form rules pages with a hand-ranking list as the core asset.

### Competitor Analysis
| # | URL | Key H2 Sections | Est. Words | Score | Main Gap |
|---|-----|-----------------|------------|-------|----------|
| 1 | bhoos.com/blog/how-to-play-teen-patti-rules-strategies-and-tips | Setup, blind/seen, hand rankings, betting, strategy tips | ~1,400 | 29/40 | India-framed (INR), no Pakistan/PKR context, bhoos is itself a rival card-game company |
| 2 | officialgamerules.org/game-rules/teen-patti-rules/ | Objective, deal, hand rankings, betting actions | ~900 | 24/40 | Generic rules-aggregator, no real-money/app framing, ad-heavy |
| 3 | gamerules.com/rules/teen-patti-card-game/ | Overview, setup, rankings | ~800 | 23/40 | Same limitation as above, thinner |

### Content Gaps and Opportunities
- **Topic gap:** none of the top results mention PKR stakes, boot-amount conventions, or how a mobile app's Teen Patti table UI maps onto the physical rules (chaal/pack buttons, auto-blind toggles).
- **Depth gap:** none clearly separate "Teen Patti" as a game concept from app-specific variants a Pakistani player will actually see in a table list (e.g. the module is simply named "TeenPatti" in Pak Rummy's own manifest — see `/games/teen-patti/`).
- **Quality gap:** bhoos.com is a direct competitor's blog, not a neutral source; the rules-aggregator sites carry no local E-E-A-T.

### Winning Outline

**H1:** Teen Patti Rules: How to Play (Beginner's Guide)
**URL Slug:** /blog/teen-patti-rules/
**Target Word Count:** ~750–850 words

1. **Direct answer** (50 words, FS target) — Teen Patti in one paragraph: 3 cards, highest hand wins the pot, blind vs. seen play. Primary keyword in first sentence.
2. **How a hand is dealt** (100 words) — boot amount, 3 face-down cards, turn order.
3. **Blind vs. seen play** (120 words) — the core betting mechanic beginners misunderstand; secondary keyword "teen patti blind seen" if natural.
4. **Hand rankings, highest to lowest** (200 words, table format) — Trail, Pure Sequence, Sequence, Color, Pair, High Card. This is the Featured Snippet target.
5. **Betting actions: call, raise, fold, show** (100 words).
6. **Where to practice the rules** (80 words) — contextual link to `/games/teen-patti/`, no hard sell.
7. **FAQ** (3 questions, 40–60 words each) — "Is Teen Patti the same as Flush?", "How many players can play?", "What happens on a tie?"

**Schema:** Article. No FAQPage markup (no confirmed ranking/AI benefit — see `seo-schema` guidance).

### Recommended Meta Tags
**Title:** Teen Patti Rules: How to Play (Beginner's Guide) | Pak Rummy
**Meta Description:** Learn Teen Patti rules step by step: dealing, blind vs. seen play, hand rankings from Trail to High Card, and betting actions, explained for first-time players.

### Unique Angle and Information Gain
The hand-ranking table cross-referenced directly against what a Pakistani player sees inside a real app table (chaal/pack terminology, PKR boot amounts) — something no generic rules-aggregator site does, and something bhoos.com won't do since they're promoting a different app.

### E-E-A-T Requirements
- Byline: PakRummyOfficial.com editorial team (matches site convention — no invented individual author, see `/authors/`).
- "Last updated" date visible.
- Explicit note that table-specific stakes and variants are app-configured, not universal — same honesty pattern as `/games/rummy/`'s existing disclaimer.
- Link to `/responsible-gaming/` since this is real-money context.

### Internal Linking Opportunities
- "Teen Patti" → `/games/teen-patti/` (module-verified game page)
- "set your budget before you sit at a table" → `/responsible-gaming/`
- "once you're ready to play" → `/download/`
- Cross-link from `/games/teen-patti/` back to this post once published (update that page's "next steps").

---

## 2. Ludo rules

### Search Intent
Informational, beginner-level, but mixed: most top-ranking pages describe the **physical board game**, while a Pakistani searcher typing this after seeing "Ludo" in a real-money app list wants the **digital/app version**, which often differs (forced capture rules, bonus squares, auto-play timers).

### Competitor Analysis
| # | URL | Key H2 Sections | Est. Words | Score | Main Gap |
|---|-----|-----------------|------------|-------|----------|
| 1 | mastersofgames.com (Rules of Ludo) | Board setup, movement, capturing, winning | ~700 | 21/40 | Physical board game only, no app/digital variant coverage, UK retailer framing |
| 2 | classicludo.lovable.app/how-to-play-ludo | Setup, movement, strategy | ~600 | 21/40 | Thin authority, generic, no real-money context |
| 3 | ymimports.com/pages/how-to-play-ludo | Basic rules | ~400 | 16/40 | Product-page afterthought, minimal depth |

### Content Gaps and Opportunities
- **Topic gap:** zero competitors address how digital Ludo apps commonly differ from the board game (forced moves, auto-roll, bonus multiplier squares) — this is exactly what a player opening a real-money app for the first time needs.
- **Quality gap:** none are Pakistan-specific or real-money-context aware.
- Note for the writer: Pak Rummy's own confirmed-games evidence for Ludo is unusually indirect (see the `verificationNote` on `src/config/games.ts`'s `ludo` entry — matched via a module named "Nudo," not a literal "Ludo" string). This post should describe Ludo rules generically and link to `/games/ludo/` for app-specific status, rather than asserting Pak Rummy's own Ludo implementation details it hasn't independently verified.

### Winning Outline

**H1:** Ludo Rules: How to Play (Classic Rules Explained)
**URL Slug:** /blog/ludo-rules/
**Target Word Count:** ~650–750 words

1. **Direct answer** (50 words, FS target) — object of the game, number of players, how you win.
2. **Board and setup** (100 words) — four home bases, 52-square track, home triangle.
3. **Rolling and moving** (150 words) — needing a 6 to leave base, one token per roll, extra roll on a 6.
4. **Capturing opponents' tokens** (100 words).
5. **Winning the game** (80 words) — exact-roll-to-finish rule.
6. **How digital Ludo often differs from the board game** (120 words) — auto-roll, forced-move settings, bonus squares; frame as "common app variations to expect," not a Pak Rummy feature claim.
7. **FAQ** (3 questions) — "Do you need an exact roll to win?", "What happens if you roll three 6s?", "Can two tokens of the same color share a square?"

### Recommended Meta Tags
**Title:** Ludo Rules: How to Play (Classic Board Game Guide) | Pak Rummy
**Meta Description:** Ludo rules explained simply: board setup, rolling and moving tokens, capturing, winning, and how digital Ludo apps often differ from the classic board game.

### Unique Angle and Information Gain
The only piece in this SERP that explicitly bridges "board game rules you already half-remember" to "what's different when you open an app," without overstating what any specific app does.

### E-E-A-T Requirements
- Byline + last-updated date, matching site convention.
- Explicit "this describes classic Ludo rules; specific apps may vary table settings" disclaimer — keeps it honest given the Ludo verification is the site's weakest-evidenced game.

### Internal Linking Opportunities
- "Ludo" → `/games/ludo/`
- "before you play with real money" → `/responsible-gaming/`
- "see all seven games" → `/games/`

---

## 3. Rummy rules (13-card)

### Search Intent
Informational, beginner-to-intermediate. Searcher wants the full rule set, not just scoring (that's already split off to `/guides/rummy-scoring-explained/` on this site). SERP rewards comprehensive long-form guides with worked examples.

### Competitor Analysis
| # | URL | Key H2 Sections | Est. Words | Score | Main Gap |
|---|-----|-----------------|------------|-------|----------|
| 1 | pokernews.com/card-games/rummy/13-cards-rummy.htm | Setup, objective, valid combinations, variations | ~1,600 | 31/40 | Global/India-neutral, no worked hand example, no Pakistan framing, dense without a quick-reference table |
| 2 | gamerules.com/rules/rummy-card-games/ | Overview, setup | ~700 | 23/40 | Generic, thin, covers multiple rummy variants shallowly |

### Content Gaps and Opportunities
- **Topic gap:** no competitor walks through one complete worked hand from deal to declare with actual example cards — pure explanation, no demonstration.
- **Depth gap:** this site already splits rules (`/games/rummy/`) from scoring math (`/guides/rummy-scoring-explained/`); neither is a single beginner-complete walkthrough. The blog post's job is to be that single synthesis, not to re-explain either page — it should summarize and link out, not duplicate.
- **Information gain requirement:** this only clears the bar if it includes an actual worked example (13 dealt cards → discards → declared hand), which no current top-10 result does.

### Winning Outline

**H1:** 13-Card Rummy Rules: A Complete Beginner's Walkthrough
**URL Slug:** /blog/13-card-rummy-rules-beginners-walkthrough/
**Target Word Count:** ~900–1,100 words

1. **Direct answer** (50 words, FS target) — objective in one paragraph: arrange 13 cards into valid sequences/sets, declare first.
2. **Deal and turn structure** (100 words).
3. **What counts as a valid declaration** (150 words, FS target) — 2 sequences minimum, one pure, the full combination rule. Link to `/games/rummy/` for the canonical version.
4. **Worked example: one full hand from deal to declare** (250 words) — this is the unique-value section; show 13 example cards, which are discarded, the final valid hand.
5. **How scoring works once someone declares** (100 words) — summary only, link out to `/guides/rummy-scoring-explained/` for the full math rather than duplicating it.
6. **Common beginner mistakes** (120 words) — discarding needed cards, forgetting the pure-sequence requirement, misreading jokers.
7. **FAQ** (3 questions) — "What's the difference between a sequence and a set?", "Can I declare without a pure sequence?", "How many decks are used?"

### Recommended Meta Tags
**Title:** 13-Card Rummy Rules: A Complete Beginner's Walkthrough
**Meta Description:** 13-card Rummy rules explained with a full worked example hand — dealing, valid declarations, sequences vs. sets, and the beginner mistakes that cost games.

### Unique Angle and Information Gain
A complete worked hand (dealt → discarded → declared) is the specific thing missing from every top-10 result, including the strongest one (PokerNews). This is the single highest-authority competitor in the whole briefing batch (31/40) — this post needs the worked example to have a real shot, not just better formatting.

### E-E-A-T Requirements
- Byline + last-updated date.
- Cross-link to the site's existing `/guides/rummy-scoring-explained/` and the existing blog post `rummy-strategy-fundamentals-for-beginners` to show this is one piece of a coherent, maintained content set, not a one-off.

### Internal Linking Opportunities
- "full game page" → `/games/rummy/`
- "how points are actually scored" → `/guides/rummy-scoring-explained/`
- "once you know the rules, strategy basics" → `/blog/rummy-strategy-fundamentals-for-beginners/`
- "ready to play" → `/download/`

---

## 4. Poker rules

### Search Intent
Informational, beginner-level. High-authority SERP (PokerListings, PokerNews) — both real poker-media businesses, hard to out-rank on raw authority, so differentiation has to come from local relevance, not depth.

### Competitor Analysis
| # | URL | Key H2 Sections | Est. Words | Score | Main Gap |
|---|-----|-----------------|------------|-------|----------|
| 1 | pokerlistings.com/how-to-play-poker | Hand rankings, betting rounds, blinds, actions | ~1,800 | 31/40 | Texas Hold'em-specific, global framing, no PKR/app context |
| 2 | pokernews.com/poker-faq/poker-basics.htm | Basics, hand rankings, actions | ~1,200 | 29/40 | Same limitation, FAQ-structured |

### Content Gaps and Opportunities
- **Topic gap:** neither addresses a simplified, single-table mobile-app poker experience — both assume live/Hold'em context with blinds, antes, multiple betting rounds in full.
- **Realistic scope note:** Pak Rummy's own poker module is confirmed to exist (`"PokerBase"` in the manifest, see `/games/poker/`) but the site has not independently catalogued its exact variant or stakes structure. This post should explain general poker hand rankings and mechanics — safe, verifiable, universal — without asserting specifics about the in-app variant the site hasn't confirmed.

### Winning Outline

**H1:** Poker Rules for Beginners: Hand Rankings and How Betting Works
**URL Slug:** /blog/poker-rules-for-beginners/
**Target Word Count:** ~800–900 words

1. **Direct answer** (50 words, FS target) — goal of poker in one paragraph.
2. **Hand rankings, highest to lowest** (200 words, table format, FS target) — Royal Flush down to High Card.
3. **Basic betting actions** (120 words) — check, bet, call, raise, fold.
4. **A simple round, step by step** (150 words) — deal, betting, showdown, in plain terms without assuming a specific variant.
5. **Common beginner mistakes** (100 words) — playing too many hands, ignoring position, chasing losses.
6. **FAQ** (3 questions) — "What beats what in poker?", "What's a showdown?", "Do I need to know every variant to start?"

### Recommended Meta Tags
**Title:** Poker Rules for Beginners: Hand Rankings Explained
**Meta Description:** Poker rules for complete beginners: hand rankings from Royal Flush to High Card, basic betting actions, and a simple round explained step by step.

### Unique Angle and Information Gain
Not an attempt to out-authority PokerListings on Hold'em depth — the differentiator is brevity and a direct link from hand-ranking knowledge straight to a real table, without the live-poker jargon (antes, position names, tournament structure) a first-time mobile player doesn't need yet.

### E-E-A-T Requirements
- Byline + last-updated date.
- Explicitly scope the post to "general poker hand rankings" rather than claiming to describe Pak Rummy's specific in-app variant, since that hasn't been independently catalogued (same honesty pattern as `/games/rummy/`'s "table-specific rules are unverified" callout).

### Internal Linking Opportunities
- "Poker on Pak Rummy" → `/games/poker/`
- "set a budget before you play" → `/responsible-gaming/`
- "ready to play" → `/download/`

---

## 5. Pak Aviator game — how it works

### Search Intent
Informational, but the live SERP is dominated by thin/parasite content, not real competitors.

### Competitor Analysis
**Note on competitive landscape:** after filtering, the "pak aviator game" SERP has no qualifying real-business competitors to score. Every result outside two generic explainer pages is either a hacked/parasite post on an unrelated domain (university subdomains, a radio station's content syndication page, a phone-news blog) or explicit hype copy ("unlock the fastest withdrawals... your guide to easy winnings") — the exact scam-adjacent pattern this site's own editorial policy exists to counter. This is a genuinely thin, spam-saturated competitive landscape, which cuts both ways: easy to out-rank on legitimacy, but Google may be cautious ranking a new entrant into a spam-heavy niche without strong trust signals — so E-E-A-T matters more here than usual, not less.

| # | URL | Key Sections | Est. Words | Score | Main Gap |
|---|-----|--------------|------------|-------|----------|
| 1 | surveyking.com (how Aviator game works) | Mechanics, multiplier, cash-out | ~500 | 14/40 | Generic explainer tool page, no Pakistan context, thin |

### Content Gaps and Opportunities
- **Topic gap:** no legitimate, non-hype explainer of the mechanic exists for a Pakistani audience. Everything ranking either overpromises ("easy winnings," "fastest withdrawals") or is off-topic parasite content.
- **Quality gap:** this is the single clearest opportunity in the whole batch for a page that just tells the truth about how the mechanic works, with explicit risk framing, standing out by not being hype.

### Winning Outline

**H1:** How the Aviator Game Works (Multiplier and Cash-Out Explained)
**URL Slug:** /blog/how-aviator-game-works/
**Target Word Count:** ~700–800 words

1. **Direct answer** (50 words, FS target) — one paragraph: a plane takes off, a multiplier rises, you cash out before it crashes or lose the stake.
2. **How a round works, step by step** (150 words) — bet placed, multiplier climbs in real time, round ends unpredictably.
3. **A worked example** (100 words) — stake 100 PKR, cash out at 2.0x, result 200 PKR; stake lost if you wait too long. Numbers framed as illustration, not an earnings promise.
4. **Why the crash point can't be predicted** (150 words) — provably-fair/algorithmic framing in plain terms; directly rebuts the "pattern/signal" hype content dominating the current SERP.
5. **Risk framing** (100 words) — this is not a strategy guide; explicit contextual link to `/responsible-gaming/`. No "tips to win" section — would conflict with editorial policy on guaranteed-outcome claims.
6. **FAQ** (3 questions) — "Can you predict when it will crash?", "What happens if I don't cash out in time?", "Is Aviator the same as other crash games?"

### Recommended Meta Tags
**Title:** How the Aviator Game Works: Multiplier and Cash-Out Explained
**Meta Description:** A plain, non-hype explanation of how the Aviator crash game works: how the multiplier rises, when to cash out, and why the crash point can't be predicted.

### Unique Angle and Information Gain
The only entrant in this SERP that explains the mechanic honestly instead of promising outcomes — explicitly contrasts with the "guaranteed/easy winnings" framing of the current top results, which doubles as a legitimate differentiation angle and keeps the post inside editorial policy.

### E-E-A-T Requirements
- Byline + last-updated date — more important here than any other brief in this batch, given the spam-saturated SERP.
- No unverifiable "provably fair" certification claim for Pak Rummy specifically unless that's independently confirmed — describe the general crash-game mechanism, not assert it about this app's implementation.
- Mandatory link to `/responsible-gaming/` and `/legal-status/`.

### Internal Linking Opportunities
- "Aviator on Pak Rummy" → `/games/aviator/`
- "the same mechanic, different theme" → `/blog/how-crash-games-work/` (brief #6 below) once published
- "play within a budget" → `/responsible-gaming/`

---

## 6. Crash game — how it works

### Search Intent
Same pattern as Aviator: informational intent, spam-saturated SERP.

### Competitor Analysis
**Note on competitive landscape:** no qualifying competitors survive filtering. Every result is either a compromised academic/collaborative-notes domain (hedgedoc, markdown-sharing tools on university infrastructure) or a music-magazine/professional-association domain clearly running a hacked or paid-spam post. This is thinner than the Aviator SERP — essentially zero real competition.

### Content Gaps and Opportunities
- Wide open topic: genuinely no honest, well-formatted explainer of the generic crash-game mechanic exists in the visible SERP.
- Opportunity to be the generic/umbrella explainer that `/blog/how-aviator-game-works/` (brief #5) and `/games/crash/` both link to, since Aviator is one specific branded implementation of the same crash mechanic.

### Winning Outline

**H1:** How Crash Games Work: The Multiplier Mechanic Explained
**URL Slug:** /blog/how-crash-games-work/
**Target Word Count:** ~650–750 words

1. **Direct answer** (50 words, FS target) — crash games in one paragraph: rising multiplier, cash out before it stops, lose the stake if you don't.
2. **How the multiplier rises** (120 words).
3. **What "crash point" means and why every round is independent** (150 words) — directly addresses the "due for a big one" gambler's-fallacy misconception.
4. **Crash games vs. Aviator specifically** (100 words) — Aviator is one branded crash-game title among several; cross-link to brief #5.
5. **Risk framing** (100 words) — same mandatory responsible-gaming link as brief #5, no "strategy to win" section.
6. **FAQ** (3 questions) — "Is a crash game the same as Aviator?", "Can the house control when it crashes?", "What's a safe way to set a cash-out target?" (answered as "decide your target before you play, not during," not as strategy advice).

### Recommended Meta Tags
**Title:** How Crash Games Work: The Multiplier Mechanic Explained
**Meta Description:** How crash games actually work: the rising multiplier, what "crash point" means, why each round is independent, and how Aviator fits into the genre.

### Unique Angle and Information Gain
The umbrella/parent-topic explainer that ties the genre together and directly names the gambler's-fallacy misconception the current spam SERP exploits ("a big multiplier is due") — a trust-building angle none of the thin/hacked competitors attempt.

### E-E-A-T Requirements
- Byline + last-updated date.
- Same no-guaranteed-outcome discipline as brief #5.
- Mandatory `/responsible-gaming/` link.

### Internal Linking Opportunities
- "Crash on Pak Rummy" → `/games/crash/`
- "Aviator is one example" → `/blog/how-aviator-game-works/`
- "play within a budget" → `/responsible-gaming/`

---

## 7. "Is this online earning app in Pakistan legit?" (evaluation angle, not a ranked listicle)

### Search Intent
Mixed informational/commercial — searcher is pre-download, trying to assess risk before trusting an app with money. **Do not build this as a "best apps" listicle** — see the note below.

### Competitor Analysis
**Note on competitive landscape:** after filtering (excludes grandavehousing.calpoly.edu as a `.edu` domain, excludes profit.pakistantoday.com.pk as a news outlet, excludes directmarketing.pk and rankvista.it.com and postecards.poste.it as spam/PBN-pattern pages), only one real business survives: honeygain.com, a global passive-income app with its own blog.

| # | URL | Key Sections | Est. Words | Score | Main Gap |
|---|-----|--------------|------------|-------|----------|
| 1 | honeygain.com/blog (earn-money-online category) | Passive income methods, app reviews | varies | 22/40 | Global, not Pakistan-specific; not a real-money card-game context; promotes its own product, not neutral |

The real finding here isn't a competitor to out-rank — it's that **profit.pakistantoday.com.pk published a real report** on fake online-earning sites defrauding Pakistani users (ITV Pakistan shutting down and taking deposits). That's excluded from the competitor table as a news domain, but it's a legitimate, citable primary source for this post's E-E-A-T section.

### Content Gaps and Opportunities
- **Topic gap:** nothing in the live SERP gives a Pakistani reader a concrete, actionable checklist for evaluating one of these apps themselves — most content either sells a specific app or is generic global advice.
- **Critical constraint:** per `src/pages/editorial-policy/index.astro`, this site will not publish "guaranteed earnings" claims, will not claim an app is risk-free, and will not rank apps it hasn't verified. **This brief is explicitly for an evaluation/checklist post, not a "best online earning apps in Pakistan" ranking.** Reuse the verification-checklist pattern already established on `/safety/`, `/official-domains/`, and `/card-rummy-vs-pak-rummy/` — apply it generically to the category, not just to Pak Rummy.
- Pak Rummy can appear as **one example of how to apply the checklist**, not as "the best" or "the winner."

### Winning Outline

**H1:** How to Tell If an Online Earning App in Pakistan Is Legit
**URL Slug:** /blog/is-this-online-earning-app-in-pakistan-legit/
**Target Word Count:** ~900–1,000 words

1. **Direct answer** (50 words, FS target) — there's no single "is it legit" switch; it's a checklist of checkable facts, not a vibe.
2. **Why this category attracts scams** (120 words) — cite the real pattern: apps that use familiar branding, promise quick earnings, then restrict withdrawals. Reference the documented ITV Pakistan case as a real precedent (cited, not sensationalized).
3. **The checklist** (350 words, the core asset — formatted as a numbered list, FS target):
   - Does it publish a checksum or verifiable file source, not just a download button?
   - Is it on multiple competing domains with no consistent operator identity? (red flag)
   - Does it disclose a real operator, support contact, or company name?
   - Does it make guaranteed-earnings claims? (red flag if yes)
   - Does it pressure you with countdown timers or "limited slots"?
4. **Worked example: applying the checklist** (200 words) — walk through how `/card-rummy-vs-pak-rummy/`'s own worked comparison applied exactly this method, as a concrete demonstration rather than abstract advice.
5. **What "legit" doesn't mean** (100 words) — a verified APK is not the same as a guarantee you'll earn money; real-money apps always carry financial risk regardless of technical trustworthiness.
6. **FAQ** (3 questions) — "Can an app be safe to install but still risky to deposit into?", "What if an app has no reviews?", "Who do I report a suspected fake app to?"

**Schema:** Article. No FAQPage markup.

### Recommended Meta Tags
**Title:** How to Tell If an Online Earning App in Pakistan Is Legit
**Meta Description:** A practical checklist for evaluating any online earning app in Pakistan before you deposit: operator transparency, domain patterns, and real red flags to check.

### Unique Angle and Information Gain
A reusable, checkable evaluation method (not a ranked list) applied to a real worked example (`/card-rummy-vs-pak-rummy/`) — something no competitor in this SERP offers, since they either sell a product or give generic non-actionable advice. This is also the only brief in the batch that can cite a real, dated local news report as a trust signal.

### E-E-A-T Requirements
- Byline + last-updated date.
- Cite the real Pakistan Today report on fake earning-app shutdowns (dated, named source) — do not name specific other apps as scams without that kind of documented backing.
- Explicit disclosure line: this site is run by the Pak Rummy team, same pattern as the disclosure callout on `/card-rummy-vs-pak-rummy/`.
- No guaranteed-safety or guaranteed-earnings language anywhere in the piece — this is the single most important constraint for this specific brief.

### Internal Linking Opportunities
- "the same method applied to a real example" → `/card-rummy-vs-pak-rummy/`
- "our own verification checklist" → `/safety/`
- "how we verify a domain" → `/official-domains/`
- "set a budget regardless of an app's trust signals" → `/responsible-gaming/`

---

## Suggested publishing order

1. **Teen Patti rules** and **Ludo rules** — zero editorial-policy risk, confirmed KD 0, fastest to approve and ship.
2. **13-card Rummy walkthrough** — slightly more writing effort (needs a real worked hand example) but reinforces the site's strongest existing content cluster.
3. **How Aviator works** → **How crash games work** — publish Aviator first (higher volume: 1,300 vs. 600), then Crash as the cross-linked companion piece.
4. **Poker rules** — lowest relative priority in this batch; highest-authority competitors, smallest realistic upside.
5. **Online earning app evaluation post** — biggest volume opportunity (3,500/mo) but needs the most editorial care; schedule after the team has reviewed the checklist framing, not as a quick first ship.

Once URLs are finalized, add each to `docs/seo-keyword-map.md`'s mapping table to keep that document current.
