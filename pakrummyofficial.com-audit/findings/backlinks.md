# Backlink Profile Findings: pakrummyofficial.com

Audit date: 2026-11-10
Status: COMPLETE

## Summary

- **Backlink Health Score: INSUFFICIENT DATA (Not Assessed).** No numeric score is produced. 0 of 7 scoring factors have a usable data source in this run.
- **Confidence tier: 0 (Basic).** Only Common Crawl (domain-level, confidence 0.50) and the local verification crawler (confidence 0.95 for what it checks) were available.
- **Inbound link picture: unknown.** Common Crawl has no record of pakrummyofficial.com, and no inbound-link API was available. This report cannot say how many sites link to this domain, or with what anchors.
- **Operator relationship (pakrummy.com to pakrummyofficial.com): no reciprocal link found.** The operator's homepage, about-us page and privacy-policy page do not link to pakrummyofficial.com. The one link runs the other way: pakrummyofficial.com links to pakrummy.com.
- **Result: this is a thin, low-confidence backlink picture.** Treat every statement below as limited to what the three free sources could see.

## Source Coverage

| Source | Status | Used for | Confidence |
|---|---|---|---|
| Moz Link Explorer API | Not configured | DA/PA, spam score, referring domains, anchors | n/a |
| Bing Webmaster Tools | Configured, but pakrummyofficial.com is NOT in the verified site list (verified: allyonoarcade.com, allyonoofficial.com, allyonoindia.com, allyonopatti.com, allyonoreward.com, allyonoupdate.com, uonovoucher.com, yonolink.co). Per SITE-CONTEXT.md, Bing data was not used. | n/a | n/a |
| Common Crawl web graph (release cc-main-2026-jan-feb-mar) | Available. pakrummyofficial.com: not in crawl (both apex and www queries). | Domain-level presence check | 0.50 |
| Verification crawler (verify_backlinks.py) | Available | Checking candidate operator-to-official links | 0.95 (for pages it fetched) |
| Keywords Everywhere (Open PageRank 0-10) | Configured, but the API rejected the key ("Invalid Keywords Everywhere API key"). Not usable. | Domain rank fallback | n/a |
| DataForSEO | Not available in this run | Referring domains, velocity, follow ratio, geo | n/a |

Freshness: the Common Crawl web graph is quarterly. The release used is cc-main-2026-jan-feb-mar (source: https://commoncrawl.org/web-graphs). This was the release the script queried; I did not verify whether a newer quarterly release exists.

## Common Crawl Domain Metrics

| Domain | In crawl | In rankings | PageRank | PageRank rank | Harmonic centrality rank | Hosts | Source |
|---|---|---|---|---|---|---|---|
| pakrummyofficial.com | No | No | n/a | n/a | n/a | n/a | CC (0.50) |
| www.pakrummyofficial.com | No | No | n/a | n/a | n/a | n/a | CC (0.50) |
| pakrummy.com (operator, for context) | Yes | Yes | 1.52e-07 | 188,054 | 2,718,242 | 2 | CC (0.50) |

Interpretation:
- The absence of pakrummyofficial.com from Common Crawl does not mean the site has low authority. The validator flags this explicitly. It means the crawl has not captured the domain: it may be new, small, or not yet crawled.
- The operator domain pakrummy.com is in the crawl with a PageRank rank of 188,054 and 2 hosts. This is domain-level context only. It is not a score for pakrummyofficial.com.

## Operator Link Check (pakrummy.com to pakrummyofficial.com)

Method: rendered the pakrummy.com homepage with a headless browser (rendered DOM, 29 anchors) and fetched the static HTML. Searched every link and every text occurrence for "pakrummyofficial". Also ran the verification crawler on the three operator pages found.

| Operator page | Result | Source |
|---|---|---|
| https://www.pakrummy.com/ (rendered DOM) | No link. 0 occurrences of "pakrummyofficial" in HTML or extracted text. External links: bit.ly/PakrummyWhatapps, chat.ssrchat.com, facebook.com/Pakrummyofficiial, telegram.me/Pakrummy. | Parsed (0.95) |
| https://www.pakrummy.com/ (verifier) | Flagged "unverifiable_js" by the crawler's heuristic. This was resolved by the rendered-DOM check above. | Verify (0.95) |
| https://www.pakrummy.com/about-us/ | Target not present on page (HTTP 200) | Verify (0.95) |
| https://www.pakrummy.com/privacy-policy/ | Target not present on page (HTTP 200) | Verify (0.95) |
| https://www.pakrummy.com/contact-us, /download, /faq, /terms-and-conditions, /sitemap.xml | HTTP 404 at these paths. No content to check. | Parsed (0.95) |

Notes:
- The verifier labels the last two results "link_removed". That is misleading here: nothing shows that a link ever existed. The accurate reading is "target not present on the page as fetched". No evidence was found of a previous link being removed.
- These checks cover only a few operator pages. The operator site was not fully crawled. The absence of a link is confirmed on the homepage, about-us and privacy-policy pages only. Other pages on pakrummy.com may still contain a link. This is a limitation of the check, not a confirmed negative for the whole domain.
- The operator's own pages carry no link to pakrummyofficial.com. Because of this, the operator relationship cannot be used as an authority signal in either direction in the data available.

## Outbound Links from pakrummyofficial.com (context for the trust relationship)

Source: homepage https://pakrummyofficial.com/ (Parsed, 0.95). The page has 139 anchors in total.

- Link to the operator: https://pakrummy.com, anchor text "pakrummy.com", no rel attribute (a followed link).
- Other external link: https://t.me/Pakrummyagents.

This is the only link to the operator I found. It is a followed link from this site to the operator, which is the reverse of the link the operator would need to give this site.

## Backlink Health Score Factors

| Factor | Weight | Source status | Scored? |
|---|---|---|---|
| Referring domain count | 20% | No source (Moz not configured, Bing does not cover this domain, DataForSEO not available) | Skipped |
| Domain quality distribution | 20% | No source | Skipped |
| Anchor text naturalness | 15% | No source | Skipped |
| Toxic link ratio | 20% | No source (verifier checks links it is given, but no inbound link list exists) | Skipped |
| Link velocity trend | 10% | DataForSEO only | Skipped |
| Follow/nofollow ratio | 5% | No source | Skipped |
| Geographic relevance | 10% | No source | Skipped |

Result: 0 of 7 factors scored. Score: INSUFFICIENT DATA. No number is given, per the Tier 0 rule (fewer than 4 factors with data). Common Crawl rank/presence signals are not scored.

## Findings

Priority: Critical > High > Medium > Low

### High: No inbound backlink data can be produced for this domain
- **Evidence:** Common Crawl has no record of pakrummyofficial.com or www.pakrummyofficial.com (CC, 0.50). Moz is not configured. Bing does not cover this domain. DataForSEO is not available.
- **Impact:** The site's link authority is unknown. The audit cannot confirm whether any external site links to it.
- **Action:** Configure at least one inbound-link source for this domain. Moz (https://moz.com/products/api, free tier) would provide referring domains and spam scores. Alternatively, add the domain to a Bing Webmaster property the account controls, or add DataForSEO. Also consider using Google Search Console "Links" (the GSC property already has API access per SITE-CONTEXT.md) as a free inbound-link source. This was not run in this audit.

### High: Operator (pakrummy.com) does not link back to this site
- **Evidence:** No link to pakrummyofficial.com on the operator's rendered homepage (29 anchors), about-us, or privacy-policy pages (Parsed 0.95, Verify 0.95). The operator's remaining pages were not all checked.
- **Impact:** The strongest possible trust signal for this site, a link from the game operator, is not present in the pages checked. Because this site positions itself as the official information site for the operator, an operator link (on a relevant page such as an "about" or "download verification" page) would be a meaningful authority and trust signal.
- **Action:** Ask the operator to add a link to https://pakrummyofficial.com/ on pages where official information is shown. This is an outreach task for the site owner, not an audit change. Before the link is requested, confirm that the operator page is one the team controls or can change.

### Medium: No link-related data from the operator's full domain
- **Evidence:** Only three operator pages were checked. Five guessed paths returned 404 (/contact-us, /download, /faq, /terms-and-conditions, /sitemap.xml), so the operator sitemap was not found at its standard path.
- **Impact:** The operator-to-official-site check is not exhaustive. A link may exist on a page not checked.
- **Action:** Run a site-wide link check on pakrummy.com when a full operator URL list is available (for example, from its sitemap if one exists at a different path). Re-run verify_backlinks.py with that list.

### Medium: The outbound link to the operator has no rel attribute
- **Evidence:** pakrummyofficial.com links to https://pakrummy.com with anchor text "pakrummy.com" and no rel attribute (Parsed 0.95).
- **Impact:** This is a followed link from this site to the operator. It is a normal editorial reference and is fine in most cases. It is noted only because the site's trust story depends on this relationship being clearly disclosed.
- **Action:** Confirm that the surrounding copy makes the operator relationship clear (this site does not process deposits, withdrawals or account data, per src/config/site.ts). This is a content check and is out of scope for the backlink audit. Route to `/seo content` for E-E-A-T review.

### Low: Verifier status labels
- **Evidence:** The verifier labels absent targets as "link_removed" and reports "unverifiable_js" for a page that renders normally.
- **Impact:** These labels can read as "a link was lost" when none was ever found. This report reads them as "target not present" and "heuristic false positive, resolved by rendering".
- **Action:** None for the site. Note for future runs of the tool.

## Recommended Follow-up (not performed in this run)

1. Add an inbound-link data source (Moz, DataForSEO, or GSC Links) to get a scoreable backlink picture. Re-run this audit after.
2. Ask the operator for an official-site link (see High finding above).
3. Re-check Common Crawl after the next quarterly release. The domain may appear once it is crawled.
4. Fix or replace the Keywords Everywhere key. It was rejected by the API.

## Structured Findings (audit-data.json: Backlink Profile)

```json
{
  "category": "Backlink Profile",
  "target": "https://pakrummyofficial.com",
  "tier": 0,
  "confidence_ceiling": 0.50,
  "health_score": null,
  "health_score_status": "INSUFFICIENT DATA",
  "factors_scored": 0,
  "factors_total": 7,
  "sources": {
    "moz": "not_configured",
    "bing_webmaster": "configured_domain_not_verified",
    "common_crawl": {"domain_in_crawl": false, "release": "cc-main-2026-jan-feb-mar"},
    "verify_crawler": "available",
    "keywords_everywhere": "invalid_api_key",
    "dataforseo": "not_available"
  },
  "operator_relationship": {
    "operator_domain": "pakrummy.com",
    "operator_links_to_official_site": false,
    "operator_pages_checked": ["/", "/about-us/", "/privacy-policy/"],
    "operator_pages_404": ["/contact-us", "/download", "/faq", "/terms-and-conditions", "/sitemap.xml"],
    "official_site_links_to_operator": true,
    "official_site_operator_link_rel": null
  },
  "findings": [
    {"priority": "High", "title": "No inbound backlink data available for this domain", "source": "CC (0.50)"},
    {"priority": "High", "title": "Operator (pakrummy.com) does not link back to pakrummyofficial.com on checked pages", "source": "Parsed (0.95), Verify (0.95)"},
    {"priority": "Medium", "title": "Operator link check is not exhaustive (3 pages checked)", "source": "Parsed (0.95)"},
    {"priority": "Medium", "title": "Outbound link to operator is followed (no rel attribute)", "source": "Parsed (0.95)"},
    {"priority": "Low", "title": "Verifier labels absent targets as link_removed (misleading)", "source": "Verify (0.95)"}
  ],
  "validator": {"status": "PASS", "errors": 0, "warnings": 0, "infos": 1}
}
```

## Limitations

- Free sources only. The inbound link profile for this domain is essentially unknown.
- Common Crawl's domain-level graph does not list pakrummyofficial.com. It cannot be used to infer authority.
- The operator check covers three operator pages. It is not a full site crawl.
- No anchor text, referring-domain, spam, or velocity data is available for this domain.
