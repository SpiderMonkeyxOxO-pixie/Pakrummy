# Visual / Mobile-Rendering Audit — pakrummyofficial.com

Audited 2026-11-10. Tooling: `capture_screenshot.py` (Playwright/Chromium, viewport-only captures, no scroll) across desktop (1920×1080), laptop (1366×768), tablet (768×1024), mobile (375×812, 2x DPR → 750×1624px PNGs); `render_page.py --a11y-tree` for DOM/accessibility cross-checks on homepage and `/games/` at mobile viewport. No JS console errors on either page checked.

Screenshots saved under `D:\PakrummyOfficial\pakrummyofficial.com-audit\screenshots\`:
- `homepage\` — https://pakrummyofficial.com/
- `games\` — /games/
- `games-rummy\` — /games/rummy/
- `download\` — /download/
- `blog-withdrawal-pending\` — /blog/why-is-my-withdrawal-pending/
- `bonuses\` — /bonuses/

Each folder contains `pakrummyofficial_com_{desktop,laptop,tablet,mobile}.png`.

## Overall verdict

The site visually reads as **more trustworthy than a typical real-money-adjacent affiliate page**: consistent dark-green/gold brand system, a persistent 18+ responsible-gaming disclaimer bar on every page, explicit "How we confirmed this" / "What we verified, and what we didn't" callout boxes, and a clean, non-cluttered layout with no ad units, no popups, no autoplay video, no stock-photo-bikini-babe imagery typical of gambling-affiliate sites. This is a genuine differentiator and should be called out as a strength, not just absence-of-problems. The specific issues below are all fixable polish items, not a fundamental trust-design problem.

## Above-the-fold analysis (mobile, 375×812, no scroll)

Captured images are exact single-viewport screenshots (750×1624px = 375×812 CSS px at 2x DPR, not full-page), so what's visible in each `mobile.png` is literally what a visitor sees before scrolling.

- **Homepage** (`homepage\pakrummyofficial_com_mobile.png`): Real value proposition clears the fold well. Order is: 18+ disclaimer bar → header → eyebrow label → H1 "Pak Rummy App Guide for Players in Pakistan" → one-paragraph description that explicitly states "it never processes deposits, withdrawals, or account data" → primary CTA "Download Pak Rummy" (solid green button) → secondary CTA "Explore Player Guides" → trust badge row (Self-hosted & checksummed / Version 1.1.2 / Android 5.0+ / 18+ only). The primary CTA is visible without scrolling and is not buried under nav clutter — this is a good result, contrary to the common failure mode of mobile heroes being all nav/logo with no value prop or CTA in the fold.
- **`/download/`**: Within the same single viewport, the "Pak Rummy Download" H1, a one-paragraph trust statement ("We host this APK directly and verified it ourselves — checksum, manifest, and permissions — on 2026-08-17. We did not run it through a third-party malware scanner..."), and the primary "Download Pak Rummy APK" CTA with the app icon reference image are all visible without scrolling. Good — the money action on the money page clears the fold.
- **`/games/`, `/games/rummy/`, `/bonuses/`, `/blog/...`**: these are informational/content pages, so (correctly) there's no download CTA competing for the fold — H1 + framing paragraph + breadcrumb are what's visible, which is appropriate for their intent. See "CTA visibility" below for the cross-page nav CTA gap this creates.

## CTA visibility and clarity

- Desktop/laptop (≥1366px) nav bar has a persistent, high-contrast solid-green "Download Pak Rummy" button on every page (confirmed on homepage, /games/, /games/rummy/, /download/, /bonuses/, /blog/... desktop and laptop captures) — strong, consistent conversion path.
- On mobile (375px) and tablet (768px), the header collapses to a hamburger ("Open menu") icon with **no visible Download CTA in the top bar** on any page except the homepage, where the CTA lives in the hero instead. Confirmed via accessibility-tree extraction of `/` and `/games/` at mobile viewport: the only header-region interactive element is the "Open menu" button; "Download" links on `/games/` only appear in the footer link list, not above the fold. This means a mobile visitor who lands directly on `/games/`, `/games/rummy/`, `/bonuses/`, or a blog post must either open the hamburger menu or scroll to the footer to find a download path — one extra tap is a standard, acceptable pattern, but worth confirming the hamburger menu itself surfaces Download prominently (not verified in this pass — screenshot tooling doesn't interact with the open-menu state; recommend a quick manual check or an agentic/interaction-capable pass).
- Minor opportunity: `/blog/why-is-my-withdrawal-pending/` is a money-adjacent topic (withdrawal friction) but has no inline or sticky CTA toward Download/official-domains guidance within the visible article viewport — only the standard global nav. Given the site's own "official information" positioning, a contextual link (e.g., to the official-domains guidance or support page) placed near the top of this specific article could reduce drop-off for a reader who's mid-withdrawal-anxiety.

## "Verified / Not yet publicly verified" rendering (Verified<T> convention)

This renders well and is one of the site's strongest trust signals visually:

- `/bonuses/` (both mobile and tablet, `bonuses\pakrummyofficial_com_mobile.png` / `_tablet.png`): a labelled "Current bonus status" panel shows "Active bonus" → "Not yet publicly verified" (plain text) → a distinct pill badge reading "Unverified" (amber/gold outline on dark background, high contrast, clearly a deliberate UI component, not a template placeholder or broken string). Immediately below it, a "Why we don't publish partial bonus terms" explainer box gives the reasoning. This is exactly the kind of explicit, well-designed unverified-claim disclosure a YMYL site should have, and it does **not** look broken, half-implemented, or like boilerplate — it reads as an intentional editorial stance.
- `/games/rummy/` (mobile and desktop): a parallel "How we confirmed this" box states the evidence source ("Confirmed directly from the app's own hot-update manifest... checked 2026-08-17") and a second box further down reads "Table-specific rules and stakes are unverified" with supporting copy — same clean visual treatment, consistent styling (rounded panel, bold sub-heading, body copy) across both verified and unverified claims.
- `/games/` list page: minor inconsistency to flag — the page intro text explicitly distinguishes six games "verified directly against the app's own bundled module list" from Ludo, which "rests on operator confirmation plus supporting (not conclusive) technical evidence." However, all seven game cards (Rummy, Teen Patti, Poker, Slots, Aviator, Crash, Ludo) render with an identical green "Confirmed" pill badge — there is no visual differentiation for Ludo's weaker evidence tier at the card level, only in the prose above. A reader scanning cards rather than the paragraph would not see the distinction the copy makes. Given the Verified<T> convention is otherwise well executed, this is a gap worth closing (e.g., a distinct badge tier or an inline footnote marker on the Ludo card) rather than a structural problem.
- No instance of an unverified/placeholder value rendering as broken markup, "undefined," "null," empty string, or raw template syntax was found on any of the six pages/four viewports captured.

## Layout issues found

1. **Floating support widget overlaps a trust badge on homepage mobile.** On `homepage\pakrummyofficial_com_mobile.png`, a fixed-position circular Telegram/chat button (bottom-right) sits directly on top of the "Version 1.1.2" trust badge pill in the hero, obscuring the final digit ("2"). Pixel crop confirms the overlap sits inside the initial, no-scroll viewport — i.e., a mobile visitor's first impression includes a version-number trust claim partially hidden behind a chat icon. This widget was not visible in the same screenshot pass on `/games/`, `/download/`, or `/bonuses/` (likely a load-timing difference, async widget script), so impact may be homepage-specific or intermittent, but it's reproducible as captured. Recommend either repositioning the widget, adding bottom padding to the badge row, or delaying/offsetting the widget on first paint.
2. **Tablet breakpoint (768px) clips a hero badge.** On `homepage\pakrummyofficial_com_tablet.png`, the floating "Teen Patti" game-name badge beside the phone mockup is cut off at the right edge of the viewport (only "Tee...i" visible), unlike at 375px (stacks fine, badge not shown in fold) or 1366px+ (fully visible, no clipping — confirmed in `pakrummyofficial_com_laptop.png`). This is a genuine 768px-specific responsive gap: the hero's absolutely-positioned floating badges don't get a layout rule for the tablet breakpoint and overflow/clip at the container edge.
3. **Mobile hamburger touch target is slightly under common minimums.** Pixel-measured in `homepage\pakrummyofficial_com_mobile.png`: the "Open menu" button's bordered hit area is ~87×87 screenshot px at 2x DPR = ~43.5×43.5 CSS px. That's just under the commonly cited 44–48px touch-target guidance (WCAG 2.5.5 AAA / Material Design). Minor, but easy to fix (pad to 44px or 48px square).
4. **Minor breadcrumb wrap on blog post mobile.** On `blog-withdrawal-pending\pakrummyofficial_com_mobile.png`, the breadcrumb trail "Home / Blog /" wraps with a dangling trailing slash before the current-page label drops to its own line. Cosmetic only, not a functional bug.
5. No overlapping body content, no cut-off/truncated headline text, and no broken image placeholders were observed on any of the 24 captured images (6 pages × 4 viewports).

## Text readability / contrast

- Headings (H1/H2) render in solid white on the dark green (#0a2e22-ish) background — strong, unambiguous contrast everywhere.
- Body/description copy uses a muted sage-green tone on the same dark green background (e.g., homepage hero paragraph, `/games/` intro, blog "Direct answer" paragraph). Visually this reads as a deliberate secondary-text style and is legible at normal viewing distance in every screenshot, but it's the one color pairing in the system with less margin than the rest (white-on-dark everywhere else, amber-on-dark for badges). Recommend an automated contrast-ratio check (axe/Lighthouse, outside this visual pass's tooling) specifically on that `--muted` text token against the dark-green background to confirm it clears WCAG AA (4.5:1) at the smaller body-text sizes used in paragraph copy.
- The persistent 18+ responsible-gaming bar (white/gold text on dark maroon) is high-contrast and consistently present at the very top of every page in every viewport captured — good, unmissable YMYL disclosure placement.
- Base font size on mobile is comfortably ≥16px equivalent for body copy in all captures (no pinch-to-zoom need observed).

## Mobile responsiveness summary

- No horizontal overflow was visible in any mobile capture (screenshots are viewport-clipped so this isn't a definitive overflow test — recommend the technical/performance pass confirm `document.documentElement.scrollWidth` parity via Lighthouse/DevTools if not already covered).
- Navigation collapses cleanly to a hamburger icon at both mobile (375px) and tablet (768px); full inline nav only appears at laptop width (1366px) and up — breakpoint confirmed by comparing `tablet.png` vs `laptop.png` across pages.
- Trust/status components (badge rows, "Current bonus status" panel, "How we confirmed this" boxes) all reflow into single-column, fully readable stacks on mobile with no clipping or overlap (apart from issue #1 above).
- Game cards on `/games/` reflow from a 3-column grid (desktop) to a 2-column grid (mobile) cleanly, with icon, name, "Confirmed" badge, and description all intact per card.

## Layout shift risk

Not independently measured in this pass (requires CLS/Lighthouse field or lab data, which is the performance agent's instrumented territory per SITE-CONTEXT.md — PageSpeed Insights API key is unavailable this run). Visually, hero images use a fixed phone-mockup frame and game-card icons appear to be fixed-dimension `<img>`s with no visible reflow artifacts in static captures, which is consistent with the git-log-noted 2026-10-04 mobile LCP/responsive-image work holding up. No visual evidence of obvious CLS-inducing patterns (no ad slots, no web-font-swap artifacts visible, no late-loading hero text) was found, but this should be confirmed with real CWV data once PageSpeed/CrUX access is available.

## Trustworthiness vs. generic-affiliate-page check

Positive signals observed directly in the renders:
- No third-party ad units, no exit-intent popups, no autoplay media, no "claim now" urgency banners — all absent across all 6 pages/4 viewports.
- Consistent "Last reviewed [date] by the PakRummyOfficial.com editorial team" byline visible on homepage desktop fold, and "By PakRummyOfficial.com Editorial Team · Published [date]" byline on the blog post (both mobile and desktop) — real author/editorial attribution, not anonymous content.
- Explicit scope disclaimer repeated in hero copy and disclaimer bar: "it never/does not process deposits, withdrawals, or account data" — appears on every page, every viewport.
- The "Pak Rummy Status Center" module on the homepage desktop fold (Current Version / Last Checked / Android Requirement / Download Availability / Official Support / Source & Checksum) is a strong, dashboard-like trust device — but note it shares the same "Last checked 2026-08-17" / "checked 2026-08-17" date visible on both the homepage status center and the `/download/` and `/games/rummy/` verification boxes. Today is 2026-11-10, so this "verified" timestamp is ~3 months stale while the module's own copy claims "Updated the moment we verify something new — never guessed." Visually the component implies live/recent verification; the static date undercuts that implication over time. This corroborates the coordinator's already-noted content-freshness/cadence stall finding — flagging here because it's a **visual** trust-design tension (a component designed to look current, displaying a date that no longer is) rather than purely a content-freshness issue.

Net assessment: the page does not look like a generic affiliate/gambling landing page — it visually commits to the "official information site, not the operator" positioning through typography, restraint (no ads/popups), explicit unverified-claim UI, and editorial bylines. The fixable items above (widget/badge overlap, tablet badge clipping, touch target, stale-looking status date, Ludo badge-tier inconsistency) are polish/consistency issues layered on top of an otherwise sound trust-oriented visual design, not evidence of a template-driven affiliate site.

## Issues list (severity-ranked)

| # | Severity | Page/viewport | Issue |
|---|----------|----------------|-------|
| 1 | Medium | Homepage, mobile | Floating chat widget overlaps/obscures "Version 1.1.2" trust badge in the no-scroll hero |
| 2 | Medium | Homepage, tablet (768px) | "Teen Patti" floating hero badge clipped at viewport edge |
| 3 | Low–Medium | Sitewide, homepage status center / `/download/` / `/games/rummy/` | "Last checked"/"checked" verification date (2026-08-17) visually implies freshness but is ~3 months stale as of 2026-11-10 |
| 4 | Low | `/games/` all viewports | All game cards show identical "Confirmed" badge despite copy distinguishing Ludo's weaker evidence tier |
| 5 | Low | Homepage, mobile | Hamburger menu touch target ~43.5×43.5 CSS px, under common 44–48px guidance |
| 6 | Low | Mobile, non-homepage pages | No Download CTA visible in header without opening hamburger menu or reaching footer |
| 7 | Cosmetic | Blog post, mobile | Breadcrumb trailing slash wraps awkwardly before current-page title |
| 8 | Info / needs follow-up | Sitewide | Body-copy "muted" text color contrast not independently verified against WCAG AA; CLS not independently measured (no PageSpeed/CrUX credentials this run) — recommend performance/technical agent confirm |
