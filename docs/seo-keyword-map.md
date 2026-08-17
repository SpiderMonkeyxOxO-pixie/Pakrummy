# SEO keyword map

Initial keyword-to-page mapping for PakRummyOfficial.com. This is a starting map based on the brief's keyword clusters, not a rank-tracking export — refine it once real Search Console/Ahrefs data exists for this domain.

| Target keyword cluster | Search intent | Assigned URL | Page type | Primary CTA | Supporting internal links | Cannibalization notes |
| --- | --- | --- | --- | --- | --- | --- |
| pakrummy, pak rummy, pak rummy game, pak rummy official, pak rummy Pakistan | Broad navigational/informational — "what is this app" | `/` | Hub/home | Check download status | Download, Games, Safety, Support, Payments | Deliberately not split into spelling-variant thin pages; homepage owns the whole cluster |
| pak rummy game download, pak rummy app download, pak rummy APK | Transactional — get the file | `/download/` | Product/verification | Download Pak Rummy APK (disabled until verified) | Install, App Version, Safety | Distinct from `/install/` (post-download) and `/official-domains/` (source trust) — no overlap in target query |
| latest Pak Rummy version, update, file size, Android requirements | Informational — "am I current" | `/app-version/` | Fact page | View updates | Download, Updates, Safety | Distinct from `/updates/` (editorial log vs. structured fact table) |
| how to install Pak Rummy APK | Informational — procedural | `/install/` | How-to guide | Check download status | Download, Safety, Common Errors | — |
| Pak Rummy games | Informational/navigational | `/games/` | Hub | Play Rummy | Rummy, Download, Bonuses | — |
| Pak Rummy promo code and bonus terms | Transactional/informational | `/promo-code/` | Offer page | View bonuses | Bonuses, Deposit, Complaints | Overlaps with `/bonuses/`; `/promo-code/` owns code-specific queries, `/bonuses/` owns the broader offer-terms explainer — cross-linked both ways to avoid duplicate targeting |
| Pak Rummy registration and login | Informational/transactional | `/register-login/` | How-to guide | Get support | Account Verification, Common Errors, Customer Service | — |
| Pak Rummy deposit guide | Informational | `/deposit/` | How-to guide | Check payment status | Easypaisa/JazzCash, Withdrawal, Bonuses | — |
| Pak Rummy withdrawal guide | Informational | `/withdrawal/` | How-to guide | File a complaint (if delayed) | Deposit, Account Verification, Complaints | — |
| Pak Rummy Easypaisa and JazzCash | Informational | `/easypaisa-jazzcash/` | Payment guide | View deposit guide | Deposit, Withdrawal | — |
| Pak Rummy customer service | Navigational | `/customer-service/` | Support page | Email PakRummyOfficial.com | Complaints, Common Errors, Official Domains | — |
| is Pak Rummy safe, official APK verification | Informational — trust | `/safety/` | Trust/verification | Check download status | Official Domains, APK Permissions, Download | — |
| Pak Rummy official website and impersonation protection | Informational — trust | `/official-domains/` | Trust/verification | Check download status | Safety, Complaints | — |
| pak rummy teen patti | Informational — game-specific | `/games/teen-patti/` | Game page | Check download status | Games hub, Download, Responsible Gaming | — |
| pak rummy poker | Informational — game-specific | `/games/poker/` | Game page | Check download status | Games hub, Download, Responsible Gaming | — |
| pak rummy slots | Informational — game-specific | `/games/slots/` | Game page | Check download status | Games hub, Download, Responsible Gaming | — |
| pak rummy aviator | Informational — game-specific | `/games/aviator/` | Game page | Check download status | Games hub, Crash, Responsible Gaming | Distinct from `/games/crash/` — same genre, different query intent (searchers name the specific title) |
| pak rummy crash game | Informational — game-specific | `/games/crash/` | Game page | Check download status | Games hub, Aviator, Responsible Gaming | Distinct from `/games/aviator/`, cross-linked both ways |

## Additional pages not in the original brief table (mapped for completeness)

| Page | Target intent | Notes |
| --- | --- | --- |
| `/apk-permissions/` | "pak rummy permissions", "is pak rummy app permissions safe" | Supports `/safety/` and `/download/`; not a competing target for "is Pak Rummy safe" (that stays on `/safety/`) |
| `/account-verification/` | "pak rummy kyc", "pak rummy account verification" | Feeds withdrawal/deposit intent without competing with them |
| `/bonuses/` | "pak rummy bonus" | Owns offer-terms explainer; `/promo-code/` owns code-redemption queries |
| `/account-deletion/` | "delete pak rummy account" | Standalone long-tail, no overlap |
| `/complaints/` | "pak rummy complaint", "report fake pak rummy site" | Standalone, links back to Customer Service and Official Domains |
| `/games/rummy/` | "pak rummy rules", "how to play rummy pak rummy" | Scoring math lives in the linked guide article instead of duplicating it here |
| `/guides/rummy-scoring-explained/` | "rummy scoring", "rummy points explained" | Long-tail evergreen article, cross-linked from `/games/rummy/` rather than merged into it, to keep the product page focused on the app and the guide focused on rules |
| `/legal-status/`, `/responsible-gaming/`, `/age-restrictions/` | "is pak rummy legal in pakistan", "pak rummy 18+" | Trust/compliance cluster, intentionally non-committal on legality per `docs/legal-review-checklist.md` |

## Explicitly excluded

Per the brief, we did not target unrelated Ahrefs-style entries such as `paki.com`, `rummy.com`, `rummy park`, `rummy pa`, or other brands with unrelated intent — none of these appear anywhere in metadata, headings, or copy. `/pakrummy2/` was not created: no verified relationship between that string and Pak Rummy was found during the audit, so publishing it would have implied an affiliation we can't support.
