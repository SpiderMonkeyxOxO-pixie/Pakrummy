# Required verification

Live tracker for every fact the site currently renders as "Not yet publicly verified." Source of truth for the underlying values is `src/config/site.ts` (the `Verified<T>` fields) and `src/config/games.ts` (the `verified` flag per game). When a value below is confirmed, update the corresponding field in `src/config/site.ts`/`games.ts` with a real `verified(value, 'YYYY-MM-DD', 'how it was verified')` call — do not hardcode it elsewhere.

## Operator identity & support

| Fact | Field | Needed to verify | Pages/CTAs affected |
| --- | --- | --- | --- |
| Operator legal/corporate name | `operatorLegalName` | Corporate registration document or operator statement | `/about/`, `/terms/`, `/privacy-policy/`, JSON-LD `Organization` (currently omitted for the operator entirely) |
| Official social profiles | `operatorSocialProfiles` | Profiles the operator confirms as owned | Footer, `/official-domains/`, `Organization.sameAs` (currently omitted) |
| Responsible-gaming dedicated contact | `responsibleGamingContact` | Operator-confirmed contact or program | `/responsible-gaming/` |

**Operator support email and live chat — resolved 2026-08-17.** The site operator supplied `Support@pakrummy.com` and `https://chat.ssrchat.com/service/gv3a8c` directly (a primary source per `/editorial-policy/`). Before marking these `verified()` in `src/config/site.ts`, we fetched the chat URL ourselves — it returns `200` and loads a real, branded live-chat widget page ("Online Consultant"), not a dead link or placeholder. What this does *not* confirm: response time, or that a human consistently monitors either channel. `/customer-service/` states that distinction explicitly rather than implying more than we checked.

**Operator Telegram — resolved 2026-08-17.** The operator supplied `https://t.me/Pakrummyagents`. Fetched it ourselves first: `200`, resolves to a live public Telegram channel titled "Pakrummy agents" (Telegram's own `og:title`), not a dead/suspended username. Marked `verified()` in `SITE.operatorSocialProfiles`. Surfaced in two places: a floating widget button on the homepage only (as requested) and a footer credit line sitewide ("Operator-confirmed: Telegram"). We have not independently confirmed the operator controls the account beyond the name match and the fact the operator gave us this exact URL — same caveat as the support email/chat above.

**Real app screenshot — added 2026-08-17.** The operator supplied a screenshot of the app's actual loading screen (device-mockup PNG, 1500×1920, "PAK RUMMY" branding, Urdu tagline). Moved into `src/assets/screenshots/` (not `public/`) so Astro's built-in image pipeline processes it — the build auto-generates an optimized WebP (3.16MB source → ~11KB shipped) with explicit dimensions, replacing the hand-built CSS phone mockup in the hero. This is a genuine screenshot, not a mockup we drew, and is captioned as such in its alt text.

## App / download — resolved 2026-08-17

The site operator supplied an APK file directly (`pakrummy_85NU87SXTZ8.apk`, confirmed by the operator as a trustworthy build). We hosted it ourselves at `public/downloads/pakrummy.apk` (served from `/downloads/pakrummy.apk`) and verified the following **from that specific file**, not from the operator's separate infrastructure:

| Fact | Field | Verified value | How |
| --- | --- | --- | --- |
| Official download URL | `officialDownloadUrl` | `/downloads/pakrummy.apk` (self-hosted) | We host the file directly rather than linking off-site |
| App version | `appVersion` | 1.1.2 | `versionName` from `AndroidManifest.xml` |
| Build number | `appBuildNumber` | 112 | `versionCode` from `AndroidManifest.xml` |
| File size | `appFileSizeMb` | 38.7 MB (38,727,077 bytes) | Measured directly |
| Package name | `appPackageName` | `com.rummy.pak.games` | From `AndroidManifest.xml` |
| SHA-256 checksum | `appSha256` | `db6c3d313ce5ed33b096ae01119d84e278cae7c02721c7fce474c38bdfe14ab5` | Computed directly (`sha256sum`) |
| Minimum Android version | `appMinAndroidVersion` | Android 5.0 (API 21); target SDK 35 | From `AndroidManifest.xml` |
| Permissions summary | `appPermissionsSummary` | 9 permissions, none from the "worth questioning" list on `/apk-permissions/` | Full `<uses-permission>` list from `AndroidManifest.xml` |
| Last scan / verified date | `appLastScanDate`, `appLastVerifiedDate` | 2026-08-17 | Date of this verification pass |

**What this does *not* cover** — still outstanding:

- **No third-party malware scan.** We did not run the file through VirusTotal or an equivalent multi-engine scanner (no API access from this environment). `/safety/` and `/download/` say this explicitly.
- **No confirmed link between this file and an operator-controlled domain.** We're hosting the file ourselves; we have not independently confirmed which domain(s) the real operator controls (`/official-domains/` still says so). The app's own manifest declares a deep-link intent filter for `pakrummy://pakrummy.com`, which is a supporting data point but not proof of domain ownership (any developer can declare any host in an intent filter).
- **Release date and changelog** (`appReleaseDate`, `appChangelogUrl`) remain unverified — the manifest doesn't encode a release date and no changelog has been published.
- **Operator legal identity** is still separate from "we verified this file" — see the section above. Don't conflate the two when this section gets reused elsewhere.

If this exact file is later superseded by a new version, update the fields above (and re-run the checksum/manifest extraction) rather than assuming the new file is safe by association.

*Independently re-checked 2026-08-17 against the live file in `public/downloads/pakrummy.apk` using `sha256sum` and `pyaxmlparser` before trusting the values above: checksum, file size, package name, version name/code, min/target SDK, app name, and the full permission list all matched exactly. Not taken on faith.*

## Payments

| Fact | Field | Needed to verify | Pages/CTAs affected |
| --- | --- | --- | --- |
| Supported payment methods | `paymentMethods` | Confirmed from the app's own payment screen or operator | `/deposit/`, `/easypaisa-jazzcash/` |
| Min/max deposit | `minDepositPkr` / `maxDepositPkr` | Confirmed from the app | `/deposit/` |
| Min/max withdrawal | `minWithdrawalPkr` / `maxWithdrawalPkr` | Confirmed from the app | `/withdrawal/` |
| Withdrawal processing time | `withdrawalProcessingTime` | Confirmed pattern from real transactions or operator statement | `/withdrawal/` |
| Active bonus terms | `currentBonus` | Full terms confirmed directly from the operator | `/bonuses/`, `/promo-code/`, homepage |

## Games — resolved 2026-08-17 for all seven (six by direct technical match, one — Ludo — by operator confirmation plus supporting evidence)

We pulled the app's own hot-update manifest (`assets/res/raw-assets/8f/8ffdc729-....manifest` inside `public/downloads/pakrummy.apk`) and checked it directly for each game the operator told us to expect. This lists every module bundled into the build by internal name — roughly 300 entries, mostly slot titles — so absence from it is meaningful, not just "we didn't look."

| Game | Status | Evidence |
| --- | --- | --- |
| Rummy | Verified | Module `"Rummy"` |
| Teen Patti | Verified | Module `"TeenPatti"` |
| Poker | Verified | Module `"PokerBase"` |
| Slots | Verified | Module `"SlotIcon"` plus ~250 individually named slot titles |
| Aviator | Verified | Module `"Aviator"` (also: `CrashX`, `Aviatrix`, `JetX`, `Zeppelin` — same genre, different skins) |
| Crash | Verified | Module `"Carsh"` — sic, a typo in their own code — plus `"CrashX"` |
| Ludo | Verified (2026-08-17) | See below — different evidence bar than the other six |

**Ludo — resolved 2026-08-17, on a different evidence bar than the other six.** No module literally named `Ludo` exists in the manifest — that part of the earlier finding stands. Before accepting the operator's direct confirmation at face value, we ran a second check: is `Nudo` (the closest candidate) a real module or just a stray/orphaned entry? We compared its file footprint against the six *confirmed* games' footprints (Rummy included) and found it identical — each appears in exactly two places: the main module catalog, and its own tiny per-module sub-manifest (e.g. `{"version":"0.0.1","name":"Nudo","zhName":"Nudo",...}`), nothing more, nothing less. That's consistent with `Nudo` being a real, live module under an internal codename — the app's code already has one confirmed precedent for this pattern (`Carsh` for Crash) — but we could not independently prove `Nudo` *is* Ludo specifically; its own sub-manifest's display name is "Nudo," not a translated "Ludo." We marked it `verified()` in `src/config/games.ts` based on the operator's direct confirmation, with the technical nuance stated in the `verificationNote` shown on `/games/ludo/` rather than folded silently into the same "confirmed" language used for the other six. `/games/ludo/` has been built with the same structure as the other game pages.

Each verified game's page (`/games/<slug>/`) shows this same evidence in an on-page callout, not just here.

## Design/asset gaps (not content facts, but launch blockers)

- **Open Graph / Twitter share image — partially resolved 2026-08-17.** Every page now emits `og:image`/`twitter:image` (plus `:width`, `:height`, `:alt`) by default via `public/images/og-default.png` — the real app icon upscaled 190×190→400×400, not a placeholder. It clears Twitter's and Facebook's documented minimum image dimensions, so social previews now show something real. It is **not** a proper landscape share asset: no headline text, no 1200×630 design, and the Twitter card stays `summary` (not `summary_large_image`) specifically because the image is square — `summary_large_image` is reserved for pages that pass a real landscape `ogImage` explicitly, which none currently do. A designed 1200×630 asset is still recommended before launch for the best-quality preview.
- **`/llms.txt` and `/robots.txt` `Content-Type` header — addressed via `public/_headers` (2026-08-17).** Astro's local preview server doesn't preserve the exact `Content-Type: text/plain; charset=utf-8` header set in `llms.txt.ts`'s `Response` once the route is prerendered to a static file — it falls back to the host's own MIME inference (`text/plain` without the charset parameter, confirmed via `curl -I` against the local preview). Added `public/_headers` (Netlify/Cloudflare Pages convention) declaring the correct header for `/llms.txt`, `/robots.txt`, and the APK download. **This depends on the final hosting platform supporting the `_headers` file** — Netlify and Cloudflare Pages read it natively; Vercel needs an equivalent `headers` array in `vercel.json` instead, which hasn't been added since the final host isn't confirmed. Re-verify with `curl -sI https://pakrummyofficial.com/llms.txt` after deployment.
- **Favicon — fully resolved 2026-08-17.** The real Pak Rummy app icon (`public/images/pak-rummy-app-icon.png`, 190×190) is now the sole favicon identity sitewide: a generated multi-resolution `public/favicon.ico` (16/32/48/64px) as the primary `<link rel="icon">`, the PNG as a higher-res explicit-type fallback, `apple-touch-icon`, and the sole icon in `site.webmanifest`. The original abstract SVG mark (`public/favicon.svg`) is no longer referenced anywhere — left on disk unused rather than deleted. Still missing: a 512×512/maskable variant, only needed if PWA installability becomes a goal.
- **Official brand imagery — partially resolved 2026-08-17.** The site operator identified `archive/legacy-static-site/images/` as usable source material. We copied in and wired up: the real Pak Rummy app icon (header/footer brand mark, download/app-version/official-domains pages — doubles as an anti-impersonation visual, "here's what the real icon looks like"), real Rummy game artwork (`/games/` card), and the Easypaisa/JazzCash wordmark logos (`/easypaisa-jazzcash/`, shown purely descriptively — the page still states Pak Rummy's support for either is unverified). **Deliberately not used**, and why: the `gamezy-banner-home.png` promotional banner (Gamezy-era branding baggage plus an unverified Ludo pairing); `gaming-experience-mobile2.png` (a generic slots-casino screenshot unrelated to Rummy — exactly the "generic casino template" look the brief said to avoid); icons for Teen Patti/Poker/Slots/Aviator/Crash/Ludo (would visually assert availability we haven't confirmed — see the Games section above); `iso-company.png` (unsupported "ISO Certified" badge); `five-star-rating.png`/`star-white.png`/`crore-users.png` (fabricated rating/user-count graphics); India-specific payment logos (`m-rupay.png`, `m-upi-icon.png`, `m-netbanking.png`, `m-payu.png`) per the audit's PAN/UPI/RuPay finding; and — most importantly — `kiran.png`, `kritin.png`, `raghunath.png`, `ranjit.png`, `sindhu.png`, `surbhi.png`, which appear to be real, identifiable people's photos used as fabricated "won ₨X Crore" testimonials. These were excluded outright regardless of instruction; using a real person's likeness for a fake gambling endorsement is a publicity-rights and ethics problem independent of who supplied the source file. Confirm licensing/usage rights for the app icon, game artwork, and payment logos actually used before relying on them commercially — they were extracted from reference material, not supplied with an explicit license.

**Additional game artwork — added 2026-08-17, source unverified.** The operator supplied four more icons — Teen Patti (`teenpatti.png`), Slots (`Slots.webp`), Aviator (`aviator.jpg`), Ludo (`icon_Ludo_1.webp`) — wired into the games grid and each game's own page (`/games/teen-patti/`, `/games/slots/`, `/games/aviator/`, `/games/ludo/`). Unlike the Rummy/Poker/Crash art (which came from the operator's own legacy site), these look like generic stock/template game-icon art rather than Pak Rummy–specific assets — plausible and low-risk to use as decorative, genre-representative imagery (this is what an "Aviator"/"Teen Patti"/"Slots"/"Ludo" icon commonly looks like across the category), but **not verified as Pak Rummy's own in-app art**, and none of the four is captioned as an app screenshot. Confirm usage rights before relying on these commercially, same as the other imagery above.

## Analytics

No GA4, GTM, Bing Webmaster, or Google Search Console verification IDs are configured. `src/config/site.ts`'s `analytics` block reads these from environment variables (`PUBLIC_GA4_ID`, `PUBLIC_GTM_ID`, `PUBLIC_GOOGLE_SITE_VERIFICATION`, `PUBLIC_BING_VERIFICATION`) and renders nothing until they're supplied — see `docs/analytics-events.md`.

## Legal

Every page under `/terms/`, `/privacy-policy/`, `/cookie-policy/`, `/disclaimer/`, `/dmca/`, and `/legal-status/` is a drafted template pending review by counsel licensed in Pakistan — see `docs/legal-review-checklist.md`.
