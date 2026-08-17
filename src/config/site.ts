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
  status: 'verified' | 'unverified';
  value: T | null;
  /** ISO date the fact was last confirmed. Required when status is 'verified'. */
  verifiedOn?: string;
  /** Where/how it was verified, or why it's still pending. */
  note?: string;
}

export function verified<T>(value: T, verifiedOn: string, note?: string): Verified<T> {
  return { status: 'verified', value, verifiedOn, note };
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
  tagline: "Pakistan's independent information hub for the Pak Rummy app",
  country: 'Pakistan',
  countryCode: 'PK',
  currency: 'PKR',
  currencySymbol: '₨',
  language: 'en-PK',
  htmlLang: 'en',
  locale: 'en_PK',
  minimumAge: 18,

  /**
   * PakRummyOfficial.com is an independent editorial and safety resource
   * about the Pak Rummy app. It is not the game operator, does not process
   * payments, and does not claim to be the operator's official corporate
   * site. This distinction is load-bearing for every legal and trust page.
   */
  positioning:
    'PakRummyOfficial.com is an independently run information, download-verification, and support resource for players of the Pak Rummy app in Pakistan. We are not the game operator and do not process deposits, withdrawals, or account data.',

  /** Contact channel for THIS publication (editorial, corrections, DMCA, privacy requests). */
  editorialContactEmail: 'contact@pakrummyofficial.com',

  // ---------------------------------------------------------------------
  // Operator / product facts — unverified until the operator confirms them.
  // ---------------------------------------------------------------------
  operatorLegalName: unverified<string>(
    'No verifiable corporate/legal entity name has been published by the operator.'
  ),
  operatorSupportEmail: verified<string>(
    'Support@pakrummy.com',
    '2026-08-17',
    "Supplied directly by the site operator. We haven't independently tested response time or whether a human consistently monitors it — only that this is the address the operator gave us."
  ),
  operatorSupportChatUrl: verified<string>(
    'https://chat.ssrchat.com/service/gv3a8c',
    '2026-08-17',
    "Supplied directly by the site operator. We confirmed the URL is live (a working third-party live-chat widget, not a dead or placeholder link) but haven't independently confirmed a Pak Rummy agent is on the other end of every conversation."
  ),
  operatorSocialProfiles: verified<{ platform: string; url: string }[]>(
    [{ platform: 'Telegram', url: 'https://t.me/Pakrummyagents' }],
    '2026-08-17',
    'Supplied directly by the site operator. We confirmed the link resolves to a live, public Telegram channel titled "Pakrummy agents" (not a dead or suspended link) — we have not independently confirmed the operator controls the account beyond the name match and the fact the operator gave us this exact URL.'
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
  withdrawalProcessingTime: unverified<string>(),

  responsibleGamingContact: unverified<{ label: string; value: string }>(
    'No dedicated responsible-gaming contact has been confirmed. Players under financial or emotional distress should contact a licensed counsellor or a national helpline directly.'
  ),

  /** Analytics: left undefined on purpose. Populate via environment variables, never hard-coded. */
  analytics: {
    ga4MeasurementId: import.meta.env.PUBLIC_GA4_ID as string | undefined,
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
