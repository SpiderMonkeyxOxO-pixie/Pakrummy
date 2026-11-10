# Agentic-readiness audit — pakrummyofficial.com

Audited 2026-11-10. Primary test page for the accessibility-tree /
fact-extraction question: `/download/` (the APK download + verification
page). robots.txt / Content-Signal findings are site-wide (robots.txt is
fetched once from the site root regardless of which page is probed).

Tools run: `lighthouse_agentic.py` (PSI v5, `--strategy both`), `agentic_check.py`
against `https://pakrummyofficial.com/download/`, `agent_ux_check.py` against
the same URL. `--ua-matrix` was not run (no orchestrator authorization to
spoof agent user-agents against this site this run).

## 1. Summary

- **Lighthouse Agentic Browsing fraction: unavailable this run.** PSI v5
  returned `HTTP 429 — Quota exceeded for quota metric 'Queries' and limit
  'Queries per day'` for both mobile and desktop strategies (no
  `GOOGLE_API_KEY` configured, confirmed in SITE-CONTEXT.md). Not a site
  defect — a credentials/quota gap on this run. See §2 for the fallback.
- **Agent-UX heuristic (local 0-100): 100/100, status `complete`**, 0 issues,
  on `/download/`.
- **P0 count this run: 0 measured failures.** The one P0 that could not be
  tested is the Lighthouse fraction itself (quota), and the WAF/`waf-ua-matrix`
  check (not run, no authorization) — both reported as "not tested," not as
  failing, per the skill's priority rules.
- What most limits agents today is not accessibility or access policy (both
  are in good shape) — it's that the download page's **structured data
  (JSON-LD `SoftwareApplication`) omits the SHA-256 checksum and the
  permissions list**, the two facts most useful to an agent trying to verify
  the APK without parsing an HTML table. That's an opportunity, not a defect:
  the facts are present, server-rendered, and in an accessible table; they're
  just not yet in a machine-queryable schema field.

## 2. Lighthouse Agentic Browsing

Both PSI calls failed before any audit ran:

```
psi-mobile:  HTTP 429, "Quota exceeded for quota metric 'Queries' and limit
             'Queries per day' of service 'pagespeedonline.googleapis.com'"
psi-desktop: same
```

No `X/N`, no per-audit status, and no Lighthouse version/HeadlessChrome build
can be reported for this run — SITE-CONTEXT.md already flagged that
`GOOGLE_API_KEY` is missing for this project, so this was expected, not a
site problem. Per the seo-agentic skill's error-handling table, the fallback
is a local run: `npx lighthouse@latest https://pakrummyofficial.com/download/
--only-categories=agentic-browsing --output=json`, then feed the JSON to
`lighthouse_agentic.py --from-json <file>` for the fraction. That local run
was not executed this pass (Node/Lighthouse CLI availability wasn't
confirmed in this environment); recommend the coordinator run it once a
`GOOGLE_API_KEY` is configured or Node is confirmed available, so a real
`X/N` can be reported next pass.

What we can say about the likely counted audits without a live score, from
`agentic_check.py` evidence (§4) and `references/lighthouse-agentic-category.md`:
- `agent-accessibility-tree`: likely to pass — the local heuristic (§3) found
  0 unnamed interactive nodes and 0 `div`-onclick widgets on `/download/`.
- `cumulative-layout-shift`: not measured this run (lab-only, requires a real
  Lighthouse run).
- `llms-txt`: counted and likely to pass — `/llms.txt` returns 200,
  `text/plain`, 5093 bytes, and `agentic_check.py`'s own `lighthouse: "pass"`
  evidence field already confirms it meets the H1 + Markdown-link + 50-char
  rule.
- `ard-schema`: **N/A** — no `ai-catalog.json` signalled or present (§4), and
  Lighthouse marks absence N/A, not a failure.
- `webmcp-form-coverage` / `webmcp-registered-tools` / `webmcp-schema-validity`:
  **N/A** — 0 forms, 0 `registerTool(` call sites, no `navigator.modelContext`
  or `document.modelContext` on the page (§5).
- Expected maximum N on this page, per the "Maximum N" table in the
  reference: **tree + CLS + llms-txt = 3**, with WebMCP and ARD audits N/A.
  This is a plausible ceiling to confirm once a real Lighthouse run is
  available — not a reported score.

## 3. Accessibility tree for agents (`agent_ux_check.py`, `/download/`)

```
score: 100, score_status: "complete", partial: false, issues: []
html_findings: real_buttons=2, real_anchors=117, div_onclick_widgets=0,
                semantic_landmarks=9, inputs_without_aria=0, inputs_without_label=0
a11y_findings: tree_present=true, total_nodes=589, interactive_nodes=69,
                role_link=69, role_button=0, role_generic=10,
                unnamed_interactive=0
```

**Can an agent reliably locate the official download link?** Yes. The
download CTA renders as a real `<a href="/downloads/pakrummy.apk">` anchor
(`src/components/CTAButton.astro`) when `SITE.officialDownloadUrl` is
verified — not a `div onclick` widget — and the page has 0 unnamed
interactive nodes in the accessibility tree, so an agent reading
`role=link` nodes gets an accessible name on every one, including this CTA.

**Can an agent locate the SHA-256 checksum and distinguish "verified" vs
"not yet publicly verified" programmatically, or is that only visual?**
Partially machine-readable, but through text, not structured data:
- The checksum itself is in a server-rendered `<table>` row
  (`FactTable.astro`, confirmed via `src/pages/download/index.astro` rows
  array: `{ label: 'SHA-256 checksum', fact: SITE.appSha256 }`), with table
  semantics (`<th scope="row">`) — readable without JavaScript
  (`agentic_check.py` confirms `server-rendered: pass`, 713 words present
  without JS, no JS-shell marker).
- The verified/unverified distinction is **not conveyed by color or icon
  alone** — good practice. `FactTable.astro` renders the literal word
  `Verified` or `Unverified` as visible badge text
  (`{row.isVerified ? 'Verified' : 'Unverified'}`), and `verification.ts`'s
  `factText()` helper renders the literal string `"Not yet publicly
  verified"` in place of any unconfirmed value site-wide. Both are real DOM
  text nodes an agent's text-extraction or accessibility-tree read will see;
  the color-coded border, dot and icon in `StatusPanel.astro` are
  supplementary, not the only signal (icons there carry `aria-hidden="true"`
  correctly, since the adjacent text already states the value).
- **The gap:** none of this is exposed as *structured* data. The page's
  JSON-LD (`getSoftwareApplicationSchema()` in `src/lib/schema.ts`) emits
  `downloadUrl`, `softwareVersion`, `identifier`, `fileSize`, and
  `datePublished` — but **not** the SHA-256 hash, the permissions list, or a
  machine-readable verification-status field for any of them. An agent that
  only reads JSON-LD (rather than parsing the HTML table) cannot recover the
  checksum, the permissions summary, or the fact that these were
  self-verified vs. operator-supplied-only (e.g. `operatorSupportEmail` is
  marked verified in source but by a weaker form of verification — the site
  states this distinction in prose on `/download/` and `/customer-service/`,
  but not in any schema field). This is a genuine, fixable opportunity, not
  a defect in what exists today.

## 4. robots.txt, Content-Signal, and AI-agent access policy

`agentic_check.py` enumerated 33 robots.txt groups and classified 13 known
AI user-agent tokens by role. This directly answers the task's core
question — **does the site's robots.txt correctly distinguish "don't train
on us" from "don't let a user's live agent visit us"?**

**Yes, it already does**, correctly, as currently configured:

| Role | Tokens | robots.txt group | `root_allowed` |
|---|---|---|---|
| Training | GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot | named, `Disallow: /` | false |
| Search | OAI-SearchBot, Claude-SearchBot, PerplexityBot | `*` (wildcard) | true |
| User-triggered | ChatGPT-User, Claude-User, Perplexity-User, Google-Agent | `*` (wildcard) | true |

So the five training/control tokens are blocked at the root via their own
named groups; every search and user-triggered token falls through to the
wildcard group, which allows the whole site. SITE-CONTEXT's note that this
blocks "AI training crawlers... while allowing normal search" is accurate,
and it extends cleanly to user-triggered agents too — this is not a case of
an overly broad `Disallow: /` accidentally catching live-agent fetches on a
user's behalf.

**Access policy, reported per the skill's required separation (never merged):**
- **Training:** blocked. GPTBot, ClaudeBot, Google-Extended (control token,
  no separate crawler), Applebot-Extended (control token), and CCBot are all
  in named groups with `Disallow: /`, each independently honoured by vendor
  docs (`robots_behaviour: "honours"`).
- **Search:** allowed. OAI-SearchBot, Claude-SearchBot and PerplexityBot are
  not named, so they read the `*` group (`Allow: /`), and all three vendors
  document honouring robots.txt for their search crawlers.
- **User-triggered (a person's live agent visiting on their behalf):**
  allowed by this site's rules, but **vendor compliance with that signal
  varies and the site's rules don't change that**: Claude-User documents
  honouring robots.txt; Google-Agent and Perplexity-User are documented as
  "generally ignores"; ChatGPT-User is documented as "may not apply." In
  practice this means the site is already as permissive as it can be for
  user-triggered agents (P1 `robots-user-agents` check: pass, nothing
  blocked at root) — the residual risk, per the skill's standing guidance,
  is that robots.txt was never a binding control for these fetchers anyway,
  so any path that must stay private (none identified on this informational
  site) needs authentication, not a robots.txt rule.

**Content-Signal (P1, status `warn` from `agentic_check.py`):** The header
value `search=yes,ai-train=no,use=reference` is present but **only inside
the `*` group** — it is not repeated inside the five named groups (GPTBot,
ClaudeBot, Google-Extended, Applebot-Extended, CCBot). Per RFC 9309 group
selection, a crawler that matches its own named group reads only that
group's directives and does not fall back to `*` — so, strictly, those five
tokens never see this Content-Signal line at all. Practical impact here is
low: all five are already fully blocked by `Disallow: /` in their own named
group, which is a stronger and already-effective instruction; the missing
Content-Signal line inside those groups is a defense-in-depth gap (relevant
only if content reaches one of those tokens by a path other than this
site's own robots-governed crawl, e.g. re-syndication), not a live exposure.
Fix: repeat the Content-Signal line inside each of the five named groups
(`agentic_fix.py robots` can do this without touching any `Allow`/`Disallow`
line).

## 5. Markdown delivery, ai-catalog.json, `/.well-known`, WebMCP

- **Markdown delivery (P1, status `info`):** No `Accept: text/markdown`
  negotiation (still serves `text/html` on request), no
  `rel="alternate" type="text/markdown"` link, and `/download.md` returns
  404. This is an **opportunity**, not a defect — no consumer agent is
  confirmed to request Markdown (per `vendor-matrix.md`, checked
  2026-09-23: "no primary source shows any consumer agent sending `Accept:
  text/markdown`"). The page is already server-rendered, textual, and under
  llms.txt discovery, so agents that read HTML directly lose nothing today.
- **llms.txt (P1, status `pass`):** exists, 200, `text/plain`, 5093 bytes,
  passes the Lighthouse H1/Markdown-link/50-char rule. (SITE-CONTEXT already
  flagged its last-updated stamp as stale relative to new blog content —
  that's a content-freshness finding, not an agentic-access one; not
  re-litigated here.)
- **ai-catalog.json / `/.well-known` discovery (P2-P3, status `na`):**
  confirmed absent — `/.well-known/ai-catalog.json` 404, no
  `Agentmap:` line in robots.txt, no `<link rel="ai-catalog">`, no `Link:`
  header. Also absent: `/.well-known/api-catalog` (RFC 9727),
  `/.well-known/oauth-protected-resource` (RFC 9728),
  `/.well-known/oauth-authorization-server` (RFC 8414),
  `/.well-known/agent-card.json` (A2A), `/.well-known/ucp`. **All of these
  are opportunities, not defects**: this site runs no API, no A2A agent, and
  no commerce checkout flow, so none of these discovery files describe a
  real resource the site operates. Lighthouse itself treats their absence as
  N/A, not a failure.
- **WebMCP (P2-P3, status `na`/`info`):** confirmed non-issue, as expected
  for a static Astro site with no forms. `agentic_check.py` found 0
  `registerTool(` call sites, 0 forms (annotated or not) on `/download/`,
  and no `navigator.modelContext`/`document.modelContext` entry point.
  WebMCP is a W3C Community Group **draft** (checked 2026-09-23: WebKit
  opposes it on principle, Mozilla is neutral/not implementing, only ChatGPT
  desktop's built-in browser calls imperative tools by default) — not a
  foundation a static informational/support site needs. There is genuinely
  nothing to annotate here: the site has no search box, booking flow, or
  checkout for WebMCP to usefully wrap. Treat the absence as a non-issue
  given the site's static, transaction-free nature, not a gap to close.

## 6. Findings by priority

**P0 — none measured failing.** Server-rendered content passes
(`server-rendered`), robots.txt is reachable with deliberate per-agent groups
(`robots-reachable`, `robots-ai-groups`), and the local accessibility
heuristic scored 100/100 with 0 unnamed interactive nodes. The Lighthouse
`agent-accessibility-tree` and `cumulative-layout-shift` P0 audits, and the
WAF `waf-ua-matrix` P0 check, were **not tested** this run (PSI quota; no
UA-matrix authorization) — reported as not tested, not as failing.

**P1:**
- Content-Signal not repeated inside the five named/blocked AI-agent groups
  (`content-signal`, status `warn`). Fix: `agentic_fix.py robots` to add the
  line to each named group; no `Allow`/`Disallow` change needed. Low
  practical urgency since those tokens are already fully disallowed.
- Markdown delivery absent (`markdown-delivery`, status `info` — absence is
  explicitly non-defect per the skill's own priority table). Optional: a
  `.md` sibling or `Accept: text/markdown` negotiation, if the operator wants
  to get ahead of a standard that isn't confirmed in use yet.
- `robots-user-agents` passes today (nothing blocked at root) — no action
  needed, but document for future editors: don't add a blanket
  `User-agent: *` `Disallow` without re-checking which training vs.
  search/user tokens would be swept up.

**P2 (new finding from source review, not from the automated checks above):**
- The `SoftwareApplication` JSON-LD on `/download/` (`src/lib/schema.ts`,
  `getSoftwareApplicationSchema()`) omits the SHA-256 checksum and the
  permissions list that are the exact kind of structured, agent-actionable
  facts this audit was asked to check for. Fix: add them as
  `additionalProperty` `PropertyValue` entries (e.g. `name: "sha256"`,
  `value: SITE.appSha256.value`) only when the underlying fact is
  `status === 'verified'`, mirroring the existing guard that returns `null`
  rather than an incomplete schema. This lets an agent recover the checksum
  from structured data instead of parsing the HTML fact table — purely an
  extraction-reliability improvement, not a ranking or citation claim.
- No machine-readable verification-status field exists anywhere on the page
  (the "Verified"/"Not yet publicly verified" distinction lives in visible
  text only, not in `itemprop`, ARIA, or a schema property). Low urgency
  because the text itself is already accessible and unambiguous to a
  text-reading agent; worth a future `additionalProperty` like
  `{"name": "verificationStatus", "value": "self-verified-checksum"}` if the
  operator wants this guaranteed parseable without string-matching the
  English phrase.

**P3 / non-issues (confirmed absent, expected for this site):** WebMCP
tooling, `ai-catalog.json`, API Catalog, OAuth metadata, A2A agent card, UCP
profile. None of these describe a resource this static, form-free,
non-transactional site operates.

## 7. Standards status (dated per `references/vendor-matrix.md`, checked 2026-09-23)

- **WebMCP**: W3C Community Group draft. WebKit opposes it (treats agents as
  closer to assistive tech; opposes sites detecting them); Mozilla is
  neutral/not implementing; Chrome's origin trial runs M149-M156 with no ship
  milestone announced; only ChatGPT desktop's built-in browser calls
  imperative tools by default today.
- **Content-Signal**: Cloudflare CC0 Content Signals Policy (launched
  2025-09-24). The IETF individual draft (`draft-romm-aipref-contentsignals`)
  expired 2026-04-04; the IETF AIPREF working-group vocabulary hasn't reached
  consensus. No Google statement found; Google's robots.txt spec does not
  list this field. It is a stated preference with no confirmed enforcement
  effect — not presented here as affecting Google Search.
- **ai-catalog.json / Agentic Resource Discovery (ARD)**: spec 1.0, checked
  by Lighthouse 13.5's `ard-schema` audit. Absence is N/A in Lighthouse, not
  a failure.
- **Web Bot Auth**: `draft-ietf-webbotauth-httpsig-protocol-00`
  (2026-09-01). Not applicable to this site either way (it operates no agent
  and doesn't need a key directory).
- **Lighthouse**: 13.5.0 is the current npm/PSI version as of the
  2026-09-23 vendor-matrix check; this audit could not confirm the version
  actually used for this site because PSI returned a quota error before
  running.

## 8. Recommendations (each tied to evidence and a re-check)

1. Configure `GOOGLE_API_KEY` (or run the local Lighthouse CLI fallback) and
   re-run `lighthouse_agentic.py` to get a real `X/N` for this site —
   currently unreported, not zero. Re-check: `lighthouse_agentic.py
   https://pakrummyofficial.com --strategy both --json`.
2. Repeat the `Content-Signal: search=yes,ai-train=no,use=reference` line
   inside the five named/blocked groups (GPTBot, ClaudeBot, Google-Extended,
   Applebot-Extended, CCBot) for defense in depth. Re-check:
   `agentic_check.py` → `content-signal` should move from `warn` to `pass`
   (no `named_groups_without_signal` entries).
3. Add `additionalProperty` entries for the SHA-256 checksum and permissions
   summary to `getSoftwareApplicationSchema()` in `src/lib/schema.ts`, gated
   on `status === 'verified'` as the function already does for its existing
   fields. Re-check: re-fetch `/download/`'s JSON-LD and confirm the hash is
   present as a structured field, not only in the HTML table.
4. Optional, no urgency: a `.md` sibling or `Accept: text/markdown`
   negotiation for high-value pages (`/download/`, `/safety/`) if the
   operator wants to be ahead of a standard not yet confirmed in active use
   by any named consumer agent.
5. No action needed on WebMCP, ai-catalog.json, or other `/.well-known`
   discovery files — none describe a resource this site operates; revisit
   only if the site ever adds a real form, API, or agent service.
