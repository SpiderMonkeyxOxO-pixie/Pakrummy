/**
 * Single source of truth for every brand, product, and operator fact used
 * across the site. Nothing outside this file (and games.ts / nav.ts, which
 * read from it) should hard-code a brand fact, URL, or claim.
 *
 * `Verified<T>` fields must never be filled with a guess. If a fact has not
 * been supplied and confirmed by the site operator, leave it `unverified()`
 * — templates are responsible for rendering "Not yet publicly verified" and
 * disabling any CTA that depends on it. See docs/required-verification.md
 * for the live list of what's still outstanding.
 */

export interface Verified<T> {
  /**
   * 'verified': independently confirmed by us against a primary source (a
   * file we tested ourselves, a URL we checked resolves, etc).
   * 'operator-stated': we know the value because the operator told us —
   * genuinely a real fact, not a guess — but we have not independently
   * re-confirmed it ourselves. Distinct from 'verified' on purpose: don't
   * relabel an operator-stated fact as 'verified' just because we trust the
   * source, and don't relabel a 'verified' fact as 'operator-stated' just to
   * be falsely modest — pick the one that's actually true.
   * 'unverified': we don't know, or haven't confirmed, at all.
   */
  status: 'verified' | 'operator-stated' | 'unverified';
  value: T | null;
  /** ISO date the fact was last confirmed or stated. Required unless status is 'unverified'. */
  verifiedOn?: string;
  /** Where/how it was verified or stated, or why it's still pending. */
  note?: string;
}

export function verified<T>(value: T, verifiedOn: string, note?: string): Verified<T> {
  return { status: 'verified', value, verifiedOn, note };
}

/** Use when a fact comes only from the operator's own word, with no independent re-confirmation by us. */
export function operatorStated<T>(value: T, statedOn: string, note?: string): Verified<T> {
  return { status: 'operator-stated', value, verifiedOn: statedOn, note };
}

export function unverified<T>(note?: string): Verified<T> {
  return { status: 'unverified', value: null, note };
}

export const SITE = {
  productionUrl: 'https://pakrummyofficial.com',
  brandName: 'Pak Rummy',
  /** The legal/publishing name of THIS website, distinct from the game operator. */
  publisherName: 'PakRummyOfficial.com',
  siteName: 'Pak Rummy Official',
  tagline: "Official information, download and support guide for the Pak Rummy app in Pakistan",
  country: 'Pakistan',
  countryCode: 'PK',
  currency: 'PKR',
  currencySymbol: '₨',
  language: 'en-PK',
  htmlLang: 'en',
  locale: 'en_PK',
  minimumAge: 18,

  /**
   * PakRummyOfficial.com is the official information, download-verification
   * and support website of the Pak Rummy team. The game itself lives at
   * pakrummy.com. This website does not process payments or account data.
   */
  positioning:
    'PakRummyOfficial.com is the official information, download-verification, and support website of the Pak Rummy team for players in Pakistan. The game itself is at pakrummy.com. This website does not process deposits, withdrawals, or account data.',

  /** Contact channel for THIS publication (editorial, corrections, DMCA, privacy requests). */
  editorialContactEmail: 'contact@pakrummyofficial.com',

  // ---------------------------------------------------------------------
  // Operator / product facts — unverified until the operator confirms them.
  // ---------------------------------------------------------------------
  operatorLegalName: unverified<string>(
    'No verifiable corporate/legal entity name has been published by the operator.'
  ),
  operatorSupportEmail: operatorStated<string>(
    'Support@pakrummy.com',
    '2026-08-17',
    "Supplied directly by the Pak Rummy team. We haven't independently tested that this address works, that it reaches a human, or how quickly — this is the address the operator gave us, nothing more."
  ),
  operatorSupportChatUrl: verified<string>(
    'https://chat.ssrchat.com/service/gv3a8c',
    '2026-08-17',
    "Supplied directly by the Pak Rummy team. We confirmed the URL is live (a working third-party live-chat widget, not a dead or placeholder link) but haven't independently confirmed a Pak Rummy agent is on the other end of every conversation."
  ),
  operatorSocialProfiles: verified<{ platform: string; url: string }[]>(
    [{ platform: 'Telegram', url: 'https://t.me/Pakrummyagents' }],
    '2026-08-17',
    'Supplied directly by the Pak Rummy team. We confirmed the link resolves to a live, public Telegram channel titled "Pakrummy agents" (not a dead or suspended link) — we have not independently confirmed the operator controls the account beyond the name match and the fact the operator gave us this exact URL.'
  ),

  officialDownloadUrl: verified<string>(
    '/downloads/pakrummy.apk',
    '2026-08-17',
    'Hosted directly by PakRummyOfficial.com. The site operator supplied the source file; we computed the checksum and extracted the manifest facts below ourselves from that exact file.'
  ),
  appVersion: verified<string>(
    '1.1.2',
    '2026-08-17',
    'versionName read directly from AndroidManifest.xml.'
  ),
  appBuildNumber: verified<string>('112', '2026-08-17', 'versionCode read directly from AndroidManifest.xml.'),
  appFileSizeMb: verified<number>(38.7, '2026-08-17', '38,727,077 bytes, measured directly from the file.'),
  appPackageName: verified<string>('com.rummy.pak.games', '2026-08-17', 'Read directly from AndroidManifest.xml.'),
  appSha256: verified<string>(
    'db6c3d313ce5ed33b096ae01119d84e278cae7c02721c7fce474c38bdfe14ab5',
    '2026-08-17',
    'Computed by us directly from the hosted file (sha256sum). Recompute this yourself after downloading and compare — see /safety/.'
  ),
  appMinAndroidVersion: verified<string>(
    'Android 5.0 (API level 21) or higher',
    '2026-08-17',
    'usesSdk.minSdkVersion=21 read directly from AndroidManifest.xml. Target SDK is 35 (Android 15).'
  ),
  appPermissionsSummary: verified<string[]>(
    [
      'android.permission.INTERNET',
      'android.permission.ACCESS_NETWORK_STATE',
      'android.permission.VIBRATE',
      'android.permission.WAKE_LOCK',
      'android.permission.POST_NOTIFICATIONS',
      'com.google.android.providers.gsf.permission.READ_GSERVICES',
      'com.google.android.c2dm.permission.RECEIVE (push notifications)',
      'com.google.android.gms.permission.AD_ID (advertising ID)',
      'com.google.android.finsky.permission.BIND_GET_INSTALL_REFERRER_SERVICE (install-source attribution)',
    ],
    '2026-08-17',
    'Full <uses-permission> list read directly from AndroidManifest.xml. No SMS, contacts, call-log, or accessibility-service permissions are requested.'
  ),
  appLastScanDate: verified<string>(
    '2026-08-17',
    '2026-08-17',
    'Date we computed the checksum and parsed the manifest ourselves. This is file-integrity verification, not a third-party multi-engine malware scan — we do not have API access to run one from this environment, so we are not claiming the file is malware-free.'
  ),
  appLastVerifiedDate: verified<string>('2026-08-17', '2026-08-17', 'Same verification pass as appLastScanDate.'),
  appReleaseDate: unverified<string>('The manifest does not encode a release date; the operator has not separately confirmed one.'),
  appChangelogUrl: unverified<string>('No changelog has been published or confirmed yet.'),

  currentBonus: unverified<{ headline: string; terms: string }>(
    'No bonus terms have been confirmed directly from the operator.'
  ),
  paymentMethods: unverified<string[]>(
    'Supported deposit/withdrawal methods have not been confirmed by the operator.'
  ),
  minDepositPkr: unverified<number>(),
  maxDepositPkr: unverified<number>(),
  minWithdrawalPkr: unverified<number>(),
  maxWithdrawalPkr: unverified<number>(),
  withdrawalProcessingTime: operatorStated<string>(
    '5–10 minutes',
    '2026-10-04',
    "Typical time stated by the Pak Rummy team — we haven't independently timed a withdrawal ourselves. Actual time can be longer if identity verification is pending."
  ),

  responsibleGamingContact: unverified<{ label: string; value: string }>(
    'No dedicated responsible-gaming contact has been confirmed. Players under financial or emotional distress should contact a licensed counsellor or a national helpline directly.'
  ),

  /**
   * Analytics. GA4 ships with a real default (site operator-supplied,
   * confirmed 2026-08-17) so tracking works out of the box after a clone +
   * build with no server-side env var setup required. `PUBLIC_GA4_ID` can
   * still override it (e.g. for a staging property) — this is not a secret,
   * a GA4 measurement ID is visible in any page's rendered HTML by design.
   */
  analytics: {
    ga4MeasurementId: (import.meta.env.PUBLIC_GA4_ID as string | undefined) ?? 'G-CYNZS7ZZG9',
    gtmContainerId: import.meta.env.PUBLIC_GTM_ID as string | undefined,
    bingWebmasterVerification: import.meta.env.PUBLIC_BING_VERIFICATION as string | undefined,
    googleSiteVerification: import.meta.env.PUBLIC_GOOGLE_SITE_VERIFICATION as string | undefined,
  },

  social: {
    // Populate only once an official, verified profile exists.
    twitter: undefined as string | undefined,
  },
} as const;

export type SiteConfig = typeof SITE;
