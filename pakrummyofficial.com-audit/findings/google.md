# Google API findings: pakrummyofficial.com

Data source: Google API (field data). Freshness: GSC has a 2-3 day lag, so the windows end 2026-11-07. GA4 was not usable for this site (see Blocker). CrUX is 28-day rolling but was not pulled (no API key).

## Status summary
| Check | Status |
|---|---|
| GSC search performance (28d, 91d, queries, pages, daily) | Complete (live API, totals_complete: true) |
| GSC URL indexation (64 URLs, URL Inspection) | Complete for index status. Canonical and mobile fields were not reviewed per URL. |
| GSC sitemap status | Complete |
| GA4 organic trend, landing pages, device, country | NOT AVAILABLE: configured property is a different site |
| PSI / CrUX / CrUX History | Not run (no GOOGLE_API_KEY, per SITE-CONTEXT) |
| Publishing-burst correlation | Partial: GSC only, no GA4 cross-check |

## Credential tier
- claude-seo reports Tier 2, but PSI, CrUX, and CrUX History are unavailable (no API key).
- GSC (read), URL Inspection (read), and GA4 Data API (read) work via `allyonosites@sound-berm-506014-e9.iam.gserviceaccount.com`.
- GA4 Admin API is not enabled on GCP project 263768073311, so property listing is not possible. I did not enable it (a write action on their project).
- Indexing API: not used. No submissions were made.

## Blocker: wrong GA4 property configured (Critical for analytics)
- The claude-seo default `ga4_property_id` is `549628311`. A Data API hostName check on that property shows traffic only for `yonoplaystore.com`, `www.yonoplaystore.com`, `uono-games.com`, and test hosts. There are zero pakrummyofficial.com hostnames.
- Its landing pages (`/apps/*`, `/app-safety/*`) do not exist on this site. Any GA4 numbers from that property were excluded.
- Result: GA4 organic trend, landing pages, device split, and country split for pakrummyofficial.com were NOT obtained.
- Action needed from the user: provide the numeric GA4 property ID for pakrummyofficial.com (measurement ID G-CYNZS7ZZG9 is known, the property number is not). Confirm the service account has Viewer on it. Then re-run with `--property <id>`. Also fix the default in the claude-seo config, since any other tool using it will misattribute data.
- Ask before acting: enabling the GA4 Admin API would let us list properties, but it is a change to your GCP project. Awaiting your approval.

## GSC: search performance
Property: `https://pakrummyofficial.com/` (URL-prefix property).

| Window | Clicks | Impressions | CTR | Avg position |
|---|---|---|---|---|
| Last 28 days (2026-10-11 to 2026-11-07) | 502 | 5,160 | 9.73% | 11.0 |
| Last 91 days (2026-08-08 to 2026-11-07) | 1,157 | 8,910 | 12.99% | 10.9 |

Top queries, 28 days (query rows omit anonymized low-volume queries, so they sum to 311 of 502 clicks):
| Query | Clicks | Impr | Pos |
|---|---|---|---|
| pakrummy | 117 | 561 | 13.2 |
| pakrummy.com | 35 | 971 | 9.6 (CTR 3.6%) |
| pak rummy | 25 | 153 | 19.7 |
| rummy crash | 15 | 44 | 3.2 |
| pak rummy game | 7 | 23 | 22.7 |

Top queries, 91 days: "pakrummy" 407 / 1,401 / 14.1; "pakrummy.com" 56 / 1,055 / 10.0; "pak rummy" 27 / 166 / 18.9; "rummy crash" 20 / 63 / 3.0.

Observation: the top queries are overwhelmingly brand and brand-typo. "pakrummy.com" gets 971 impressions in 28 days but only 3.6% CTR, which points to a title/snippet or SERP-intent mismatch for the brand query.

Top pages, 28 days:
| URL | Clicks | Impr | CTR | Pos |
|---|---|---|---|---|
| / | 238 | 3,156 | 7.5% | 12.3 |
| /download/ | 104 | 1,105 | 9.4% | 17.5 |
| /games/ | 69 | 546 | 12.6% | 19.4 |
| /games/crash/ | 26 | 86 | 30.2% | 4.3 |
| /games/aviator/ | 23 | 130 | 17.7% | 11.6 |
| /app-version/ | 22 | 198 | 11.1% | 25.9 |

Top pages, 91 days: `/` 709 / 5,833 / pos 11.9; `/download/` 259 / 1,725 / pos 18.0; `/games/` 73; `/games/aviator/` 43; `/games/crash/` 43.

Data-quality note: summed page rows (575 clicks, 6,586 impressions over 28 days) exceed the site totals (502 / 5,160). Totals were used as the site-wide figures, per the claude-seo rule. The page overcount is unexplained and should be checked in the GSC UI.

## GSC: daily trend and the Oct 8-19 publishing burst
- Aug 8 to Aug 17: no GSC rows.
- Aug 18 to Sep 26 (baseline): 0 to 5 clicks/day, 1 to 32 impressions/day.
- Sep 27 to Sep 30 spike: 59 to 77 clicks/day, 256 to 303 impressions/day. The spike is driven by the brand query "pakrummy" (217 clicks Sep 25 to Oct 2) and the `/` and `/download/` pages. The spike started 11 days BEFORE the first publish commit (2026-10-08), so it is not a response to the blog burst. Cause unknown.
- Oct 8 to Oct 16 (burst): impressions 282 to 462/day, peak 462 on Oct 13. Clicks 34 to 68/day. Average position stayed at 9.3 to 9.9.
- Oct 17 onward (after the burst): impressions fell to 192 by Oct 19 and 96 by Oct 22, then mostly 50 to 125/day through Nov 7. Average position moved from about 9.5 to 13 to 16 in late October.
- Nov 1 to Nov 7: 7 to 18 clicks/day, 74 to 139 impressions/day. A low plateau, not a recovery.
- Interpretation: there is a short impressions bump that overlaps the burst, but the Sep 27 spike shows it cannot be attributed to the posts. The decline from Oct 17 coincides with the end of the burst. This is correlation only.

New blog posts (12 published 2026-10-08 to 2026-10-19, per git log): in the window 2026-10-08 to 2026-11-07, only 4 of the 12 URLs have any impressions (about 16 impressions total) and none have clicks. Blog content is not yet earning search visibility. Source: publish commits in git log, GSC page report.

Device split (from the 2026-10-04 local export, Aug 18 to Sep 29; live device pull was not run): mobile 219 clicks / 1,130 impressions (19.4% CTR), desktop 21 / 97, tablet 3 / 7.

## Historical comparison: local export 2026-10-04
- Covers 2026-08-18 to 2026-09-29. Home: 201 clicks / 1,020 impressions / pos 10.5. `/download/`: 60 / 189 / 18.5.
- Top query "pakrummy": 127 clicks / 328 impressions / pos 13.6.
- The export matches the live series on overlapping days (Sep 27 to 29: 77, 59, 64 clicks), so the spike is real and not an export artifact.

## GSC: sitemap
- `https://pakrummyofficial.com/sitemap-index.xml`, last submitted 2026-08-17, 0 errors, 0 warnings, 64 web URLs submitted.
- The Sitemaps API reports submitted counts only. Indexation truth comes from URL Inspection (below).

## GSC: URL indexation (URL Inspection, all 64 sitemap URLs)
Summary: 62 PASS, 2 NEUTRAL, 0 FAIL, 0 errors.

Excluded / not indexed (2 URLs):
| URL | Coverage state | Why | Priority |
|---|---|---|---|
| `https://pakrummyofficial.com/card-rummy-vs-pak-rummy/` | URL is unknown to Google | Listed in the sitemap, but Google has no record of it. Check that it is linked internally and was discovered. | High |
| `https://pakrummyofficial.com/customer-service/` | Discovered - currently not indexed | Google knows the URL but has not crawled or indexed it. Usually low internal link priority or thin content. | Medium |

The other 62 URLs are "Submitted and indexed", INDEXING_ALLOWED, robots ALLOWED, page fetch SUCCESSFUL. Per-URL canonical and mobile-usability fields were not reviewed in detail.

Indexing API: not used. No indexing requests were submitted, per the read-only rule.

## Recommendations (priority order)
1. Critical: supply the correct GA4 property ID for pakrummyofficial.com and fix the claude-seo default (549628311 is yonoplaystore.com). Re-pull GA4 organic trend, landing pages, device, and country.
2. High: investigate `card-rummy-vs-pak-rummy/` (unknown to Google). Check internal links and the sitemap entry. Do not submit via the Indexing API without the user's approval.
3. High: the brand query "pakrummy.com" has 971 impressions and 3.6% CTR. Review the homepage title and description for brand/domain intent.
4. Medium: the blog cadence has stalled (no posts since 2026-10-19). Recent posts have almost no search impressions, so consider the content strategy before resuming.
5. Medium: investigate the page-level overcount (575 vs 502 clicks) in the GSC UI.
6. Low: investigate the Sep 27 to 30 brand spike to identify its cause.

## Limitations
- GA4 analysis is not possible for this site with the current configuration.
- Correlation with publishing is GSC-only.
- No CWV field data (CrUX) was obtained.
- Bing data is not available for this domain, per SITE-CONTEXT.
- Disclosure: during setup I printed the claude-seo config directory contents to the tool output, which exposed config secrets in the transcript (the Bing and IndexNow keys, and the service-account private key). Rotate these if the transcript is shared or stored. I did not write them into this report.

## PDF report
Not generated. Report generation (`google_report.py --type full`) was skipped because the GA4 section is incomplete. Offer to generate once the GA4 property ID is fixed.
