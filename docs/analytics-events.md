# Analytics events

## Current state: no analytics is active

`src/config/site.ts`'s `analytics` block reads four optional environment variables and nothing else:

```ts
analytics: {
  ga4MeasurementId: import.meta.env.PUBLIC_GA4_ID,
  gtmContainerId: import.meta.env.PUBLIC_GTM_ID,
  bingWebmasterVerification: import.meta.env.PUBLIC_BING_VERIFICATION,
  googleSiteVerification: import.meta.env.PUBLIC_GOOGLE_SITE_VERIFICATION,
}
```

`BaseLayout.astro` only renders a GTM snippet, a gtag snippet, or verification `<meta>` tags when the corresponding variable is set at build time. No ID is hard-coded anywhere in the codebase — set these in your hosting provider's environment variables (or a local `.env` for testing) before a production build to activate them. If `PUBLIC_GTM_ID` is set, it takes priority and the direct gtag snippet is skipped (avoid double-tracking).

## Wiring up Search Console / GA4 / Bing

1. **Google Search Console**: verify via the `google-site-verification` meta tag (set `PUBLIC_GOOGLE_SITE_VERIFICATION` to the token GSC gives you) or via DNS — either works independently of this codebase.
2. **GA4**: create a property, get the Measurement ID (`G-XXXXXXX`), set `PUBLIC_GA4_ID`.
3. **Google Tag Manager**: if you'd rather manage tags through GTM instead of a direct gtag snippet, set `PUBLIC_GTM_ID` (container ID, `GTM-XXXXXXX`) and configure GA4 as a tag inside GTM instead.
4. **Bing Webmaster Tools**: set `PUBLIC_BING_VERIFICATION` to the verification token.

## Event plan (to implement once GA4/GTM is wired up)

None of these are implemented yet — no tracking script is loaded, so there's nothing to attach listeners to. This is the event plan for whoever wires up GA4/GTM next, matched to the CTAs and content that already exist in the codebase.

| Event name | Fires when | Where in the code | Key parameters |
| --- | --- | --- | --- |
| `download_click_primary` | The main disabled/enabled download CTA on `/download/` is activated | `CTAButton` on `src/pages/download/index.astro` | `verified_status` (`verified`/`unverified`) |
| `download_click_secondary` | Any other download CTA (hero, sticky footer, mid-page repeats) is activated | Every other `CTAButton`/`download-btn` instance | `page_location` |
| `registration_click` | A link to `/register-login/` is followed from another page | Internal `<a href="/register-login/">` links | `referrer_page` |
| `login_click` | Distinguish from registration once the app itself is reachable — not meaningful until an official app link exists | N/A yet | — |
| `promo_code_copy` | A user copies a promo code — not applicable today since `/promo-code/` has no active code to copy | `src/pages/promo-code/index.astro` | `promo_code` (once one exists) |
| `customer_service_click` | The editorial contact `mailto:` CTA on `/customer-service/` or `/contact/` is activated | `CTAButton` instances pointing at `mailto:${SITE.editorialContactEmail}` | `page_location` |
| `telegram_click` | Any official Telegram link is followed — not applicable today, no verified Telegram profile exists | N/A yet | — |
| `easypaisa_guide_view` | `/easypaisa-jazzcash/` is viewed | Page view event on that route | — |
| `jazzcash_guide_view` | Same page as above; JazzCash and Easypaisa share one guide today rather than two, since neither is verified as supported individually | Page view event on `/easypaisa-jazzcash/` | — |
| `withdrawal_guide_complete` | A user scrolls to/interacts with the final section of `/withdrawal/` | Would need a scroll-depth or intersection-observer trigger, not yet implemented | `scroll_depth` |
| `app_version_check` | `/app-version/` is viewed | Page view event on that route | — |
| `official_domain_outbound_click` | An outbound link to a confirmed official domain is followed — not applicable today, no domain is confirmed yet (`/official-domains/` explains why) | N/A yet | — |

## Consent and privacy

No analytics currently runs, so there is nothing to consent to yet. When GA4/GTM is enabled, add a consent mechanism before the tag fires for any visitor where consent is legally required, and reflect the live configuration in `/cookie-policy/` (which today explicitly states no analytics is active — update that page in the same change that flips on tracking).
