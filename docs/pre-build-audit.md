# Pre-build audit

Date: 2026-08-17
Scope: (1) the pre-existing repository content at the root of this project (a near-copy of the `pakrummy.com` reference site), and (2) the publicly accessible `https://www.pakrummy.com/` reference site itself. Neither source is copied into the new build; this document exists to justify what we deliberately avoided.

## What the repository contained before this rebuild

The repository root held a static `index.html` (plus `css/`, `js/`, `images/`, `fonts/`) that was effectively a redistributed copy of the `pakrummy.com` landing page, including its tracking scripts and flawed content. It has been moved to `archive/legacy-static-site/` (not deleted, not used in the build — see the README there) so nothing is lost, but nothing in it was reused.

## Findings, with evidence

| Problem | Evidence |
| --- | --- |
| Gamezy / Yono Games branding mixed into a "Pak Rummy" product | `archive/legacy-static-site/index.html:860` "Why Choose Gamezy?"; `:1451` "Pak Rummy...introduced from the Yono Tech Co.Ltd. Inc." |
| Fantasy-cricket content unrelated to a Rummy card game | `:860–1075`, an entire "Why Choose Gamezy? / Benefits of Playing Fantasy Cricket" section describing 11-player cricket team building, present on a page nominally about Pak Rummy |
| `gamezy-latest.apk` install instructions | `:957`, `:969`, `:973`, `:1014` — install steps reference a file named `gamezy-latest.apk`, not a Pak Rummy–branded filename |
| Indian states used as legal-restriction examples on a Pakistan-facing site | `:1001–1002` "Assam, Odisha, Sikkim, Meghalaya, Nagaland & Telangana" cited as fantasy-sports-restricted states — an Indian regulatory list with no bearing on Pakistan |
| PAN / UPI / RuPay payment references | Confirmed on the live `pakrummy.com` reference site (UPI, Visa, Mastercard, RuPay, Net banking, PayU) alongside Easypaisa/JazzCash — mixing Indian payment rails into a Pakistan-market payment list |
| Conflicting company names | "Pak Rummy," "Gamezy," "Yono Games," and "Yono Tech Co.Ltd. Inc." all used for what should be one operator, both in the archived copy and on the live reference site |
| Conflicting/unsupported launch date and operating history | `:1451` "Launched in 2017, Pak Rummy is the first online gaming app..." — an unverified, undocumented claim we do not repeat |
| Unsupported certification claim | `:1417–1420` "ISO Certified Company" badge with no certificate, registrar, or scope named |
| Unsupported user/rating/winning claims | `:230` "25M+ Downloads"; `:537` "Trusted by 1 Crore players"; `:609`/`:634` "Won ₨2 Crore+" / "Won ₨1.5 Crore+" next to star ratings (4.2–4.6) with no linkable source; live reference site additionally shows "4.9 Rating," "4.6 out of 12,878," and "₨30 Lakh+" |
| Unverified tracking-based download flow | The archived `index.html` (`:25–86` in its own line numbering, see the earlier git history of this project) resolved the APK URL through a FingerprintJS visitor-ID lookup against `pakrummyagent.com` and pinged a `/download_stat` endpoint on every click — a third-party tracking dependency sitting in front of the download button itself |
| Grammatically broken / repeated content | Reference-site content includes "hole Pakistan" (missing letters) and repeated bonus text with inconsistent percentages (5%, 10%) across sections |
| `play-rummy.xyz` | Not observed in either source during this audit. Nothing to avoid was found under this specific domain; the general instruction to avoid unrelated/legacy domain references was still followed throughout. |
| Weak information architecture | Single long landing page mixing brand info, an unrelated game vertical (fantasy cricket), testimonials, and legal content with no dedicated download, safety, payments, or legal pages |
| Missing/ineffective SEO & AEO implementation | No structured data beyond a bare `gtag` snippet; no canonical strategy across a multi-topic single page; no machine-readable fact table; no editorial/author signals |

## Decisions this drove

- **No content reuse.** Every page on PakRummyOfficial.com is original prose written for this project.
- **No fabricated facts.** Where the reference research above shows the *category* of claim (user counts, ratings, winnings, certifications, launch dates), we deliberately publish none of it for Pak Rummy specifically unless independently verified — see `docs/required-verification.md`.
- **No cross-domain relationship.** No redirect, canonical, or link asserts that PakRummyOfficial.com is the same property as `pakrummy.com`, and nothing here modifies that site.
- **Games list trimmed to what's confirmed.** Only Rummy is published as a game page; Teen Patti/Poker/Slots/Aviator/Crash/Ludo are listed as unconfirmed on `/games/` rather than given full marketing pages, because the fantasy-cricket precedent above shows this product category is prone to bolting on unrelated/unverified game verticals.
- **Editorial framing, not operator framing.** Because company identity, launch date, and certifications are all unverified or actively contradictory in the source material, PakRummyOfficial.com is positioned as an independent information/verification resource rather than as the operator's own corporate site — see `SITE.positioning` in `src/config/site.ts`.
