# Featured images to generate — pakrummyofficial.com

All existing hero images on this site are **1200×630 WebP**, dark-green-background style consistent with the brand (see any existing `public/images/blog-*-hero.webp` for reference). Save each file to `public/images/` under the **exact filename** listed — the frontmatter already references these paths, so dropping the file in is the only step needed.

## Group A — new blog drafts (in `scheduled-posts/`, not live yet)

| # | Filename | Alt text already set | Suggested visual |
|---|---|---|---|
| 1 | `blog-how-to-deposit-money-into-jazzcash-hero.webp` | A smartphone with an upward arrow and coins moving toward a wallet icon on a dark green background | Mirror the existing Easypaisa deposit post's hero, JazzCash-branded |
| 2 | `blog-rummy-joker-rules-explained-hero.webp` | A joker playing card standing out among a fanned hand of ordinary cards | A joker card visually distinct from surrounding cards |
| 3 | `blog-how-to-set-a-gaming-budget-hero.webp` | A small notebook with a budget written on it beside a smartphone and coins | Notebook/ledger + coins, calm/planning tone |
| 4 | `blog-aviator-predictor-signals-are-a-scam-hero.webp` | A smartphone showing a fake prediction chart with a red warning symbol overlaid | Warning/caution visual, not hype-styled |
| 5 | `blog-how-slot-rtp-works-hero.webp` | Three slot machine reels with fruit symbols on a dark green background | Classic slot reels |
| 6 | `blog-fixing-app-not-installed-error-hero.webp` | A smartphone showing an Android installation error dialog | Phone with a generic Android error dialog |
| 7 | `blog-easypaisa-jazzcash-account-limits-explained-hero.webp` | A smartphone wallet screen showing a balance limit gauge | Wallet UI with a limit/gauge motif |
| 8 | `blog-how-to-report-fraud-in-pakistan-hero.webp` | A shield icon beside a smartphone on a dark green background, representing fraud reporting | Shield/protection icon |
| 9 | `blog-easypaisa-vs-jazzcash-comparison-hero.webp` | The Easypaisa and JazzCash logos side by side on a dark green background | Both wallet logos, neutral side-by-side framing |
| 10 | `blog-what-does-the-play-protect-warning-mean-hero.webp` | An Android Play Protect shield icon beside a smartphone installation screen | Play Protect shield + install screen |

## Group B — existing live content currently missing an image

These pages are **already live** — I deliberately did not add `image:` frontmatter for these yet, since referencing a file that doesn't exist would show a broken image on production immediately. Once each file exists at the path below, add the matching frontmatter (I can do this in one pass once you confirm they're in place).

| # | Content piece | Filename to use | Suggested alt text |
|---|---|---|---|
| 11 | Blog: *Five Rummy Strategy Fundamentals* | `blog-rummy-strategy-fundamentals-for-beginners-hero.webp` | Playing cards fanned out in a player's hand above a rummy table |
| 12 | Guide: *Rummy Scoring Explained* | `guide-rummy-scoring-explained-hero.webp` | A scorepad and pencil beside a hand of playing cards |
| 13 | Guide: *Mobile Wallet Deposit Delay* | `guide-mobile-wallet-deposit-delay-hero.webp` | A smartphone showing a loading spinner over a mobile wallet payment screen |
| 14 | Guide: *Enable Unknown Sources on Android* | `guide-enable-unknown-sources-android-hero.webp` | An Android settings screen with a toggle switch for installing unknown apps |
| 15 | Update: *Site launch* | `update-site-launch-hero.webp` | A checklist icon beside a launch/rocket icon on a dark green background |

## Notes

- 15 images total (10 + 5).
- Dimensions: 1200×630, WebP format, to match every existing hero image on the site exactly (confirmed via `file` on several existing files).
- Style: match the existing hero images' dark-green brand background and flat-icon illustration style — avoid stock-photo realism, avoid any text baked into the image (titles are rendered as real HTML, not image text).
- Once files land in `public/images/`, guides/updates need their `image`/`imageAlt` frontmatter added (schema + templates are already wired for this — see commit `0655b21`); the 10 blog drafts already have the frontmatter in place.
