/**
 * Game catalogue. Only games with `verified: true` get a published page,
 * a nav entry, and a sitemap entry — see docs/pre-build-audit.md and
 * docs/required-verification.md for why the rest are held back.
 */

export interface GameEntry {
  slug: string;
  name: string;
  verified: boolean;
  /** One-line honest note shown when a game is not yet confirmed. */
  statusNote?: string;
  shortDescription?: string;
  /** Path under /public — only set for verified games with real, rights-cleared artwork. */
  icon?: string;
  /** How we confirmed this game is actually in the app, shown on its page. */
  verificationNote?: string;
}

const MODULE_VERIFICATION =
  "Confirmed directly from the app's own hot-update manifest (the bundled module list inside the APK we host), checked 2026-08-17 — not just marketing copy.";

export const GAMES: GameEntry[] = [
  {
    slug: 'rummy',
    name: 'Rummy',
    verified: true,
    shortDescription:
      'Classic 13-card Indian Rummy, the game the Pak Rummy app is named for, including Points, Pool, and Deals variants.',
    icon: '/images/rummy-icon.webp',
    verificationNote: `${MODULE_VERIFICATION} Module name: "Rummy".`,
  },
  {
    slug: 'teen-patti',
    name: 'Teen Patti',
    verified: true,
    shortDescription: 'A 3-card betting game built around blind and seen play, popular across South Asia.',
    icon: '/images/teen-patti-icon.webp',
    verificationNote: `${MODULE_VERIFICATION} Module name: "TeenPatti".`,
  },
  {
    slug: 'poker',
    name: 'Poker',
    verified: true,
    shortDescription: 'Community-card poker play built on the app\'s core poker module.',
    icon: '/images/poker-icon.webp',
    verificationNote: `${MODULE_VERIFICATION} Module name: "PokerBase".`,
  },
  {
    slug: 'slots',
    name: 'Slots',
    verified: true,
    shortDescription: 'A large library of reel-spinning slot titles bundled with the app.',
    icon: '/images/slots-icon.webp',
    verificationNote: `${MODULE_VERIFICATION} Module name: "SlotIcon", plus roughly 250 individually named slot titles bundled alongside it.`,
  },
  {
    slug: 'aviator',
    name: 'Aviator',
    verified: true,
    shortDescription: 'A rising-multiplier flight game — cash out before it flies away.',
    icon: '/images/aviator-icon.webp',
    verificationNote: `${MODULE_VERIFICATION} Module name: "Aviator" (the manifest also lists several same-genre variants: CrashX, Aviatrix, JetX, Zeppelin).`,
  },
  {
    slug: 'crash',
    name: 'Crash',
    verified: true,
    shortDescription: 'A rising-multiplier game — cash out before the round crashes.',
    icon: '/images/crash-icon.webp',
    verificationNote: `${MODULE_VERIFICATION} Module name: "Carsh" (sic — a typo in the app's own code, not ours) plus "CrashX".`,
  },
  {
    slug: 'ludo',
    name: 'Ludo',
    verified: true,
    shortDescription: 'The classic 4-player race-to-home board game, played with dice and tokens.',
    icon: '/images/ludo-icon.webp',
    verificationNote:
      "Confirmed by the site operator directly (2026-08-17), plus a second technical pass on our own: there's no module literally named \"Ludo\" in the app's manifest, but there is one named \"Nudo\", and we checked whether that's just a sparse/orphaned entry versus a real module. It isn't — \"Nudo\" has the identical file footprint (appears in the main module catalog, plus its own per-module sub-manifest, nothing more or less) as every one of the other confirmed games, including Rummy itself. That's consistent with an internal codename rather than a placeholder — the app's own code already has one confirmed case of this pattern (\"Carsh\" for Crash). We still can't independently prove \"Nudo\" is Ludo specifically (its own sub-manifest's display name is also \"Nudo\", not a translated \"Ludo\"), so this rests on the operator's direct confirmation plus supporting-not-conclusive technical evidence — a different evidence bar than the other six, and we're saying so rather than blending it in.",
  },
];

export const VERIFIED_GAMES = GAMES.filter((g) => g.verified);
export const UNVERIFIED_GAMES = GAMES.filter((g) => !g.verified);
