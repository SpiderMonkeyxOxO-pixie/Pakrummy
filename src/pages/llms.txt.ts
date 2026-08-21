import type { APIRoute } from 'astro';
import { SITE } from '@/config/site';
import { VERIFIED_GAMES } from '@/config/games';

export const prerender = true;

function abs(path: string): string {
  return new URL(path, SITE.productionUrl).toString();
}

export const GET: APIRoute = () => {
  const lines: string[] = [];

  // --- Title + summary blockquote -----------------------------------
  lines.push(`# ${SITE.siteName}`);
  lines.push('');
  lines.push(`> ${SITE.positioning}`);
  lines.push('');
  lines.push(
    `${SITE.siteName} covers the Pak Rummy Android app for players in ${SITE.country} (${SITE.language}): verified download facts, safety checks, game rules, payment guides, and support-channel status. Every fact is labelled either independently verified or "Not yet publicly verified" — nothing in between.`
  );
  lines.push('');
  lines.push(
    `This file is provided for AI agents and language models under the llms.txt community proposal. It is not used by Google Search for ranking or visibility, and it does not guarantee inclusion, citation, or ranking in any system.`
  );
  lines.push('');

  // --- Main Pages ------------------------------------------------------
  lines.push('## Main Pages');
  lines.push('');
  lines.push(`- [Home](${abs('/')}): What Pak Rummy is, current verification status at a glance, and where to find everything else.`);
  lines.push(`- [Download](${abs('/download/')}): Current verified APK — hosted directly, checksum and manifest facts published.`);
  lines.push(`- [App Version](${abs('/app-version/')}): Current confirmed version, build number, and file facts.`);
  lines.push(`- [Install](${abs('/install/')}): Step-by-step Android installation walkthrough.`);
  lines.push(`- [Safety](${abs('/safety/')}): How to verify an APK yourself, and our current verification status.`);
  lines.push(`- [Official Domains](${abs('/official-domains/')}): How we check a domain before trusting it; impersonation red flags.`);
  lines.push(`- [Games](${abs('/games/')}): Every game confirmed available on the app, checked against its own bundled module list.`);
  lines.push(`- [Bonuses](${abs('/bonuses/')}): Current promotion status and how we evaluate bonus terms.`);
  lines.push(`- [Customer Service](${abs('/customer-service/')}): Verified operator support email and live-chat channels.`);
  lines.push('');

  // --- Guides or Resources ----------------------------------------------
  lines.push('## Guides or Resources');
  lines.push('');
  lines.push(`- [All Guides](${abs('/guides/')}): Long-form how-to and troubleshooting articles.`);
  lines.push(`- [Registration and Login](${abs('/register-login/')}): General account setup and sign-in flow.`);
  lines.push(`- [Account Verification](${abs('/account-verification/')}): What identity verification (KYC) typically involves.`);
  lines.push(`- [Deposit Guide](${abs('/deposit/')}): How deposits generally work; current verified payment facts.`);
  lines.push(`- [Withdrawal Guide](${abs('/withdrawal/')}): How withdrawals generally work; current verified limits.`);
  lines.push(`- [Easypaisa and JazzCash](${abs('/easypaisa-jazzcash/')}): Mobile-wallet payment guidance for Pakistan.`);
  lines.push(`- [Common App Errors](${abs('/common-errors/')}): Fixes for the most frequent install/login errors.`);
  lines.push(`- [APK Permissions](${abs('/apk-permissions/')}): Which Android permissions are reasonable, and which are red flags.`);
  lines.push(`- [Blog](${abs('/blog/')}): Rummy strategy, Pakistan mobile gaming context, and responsible-gaming reading.`);
  for (const game of VERIFIED_GAMES) {
    lines.push(`- [${game.name}](${abs(`/games/${game.slug}/`)}): Rules and format for ${game.name} on Pak Rummy.`);
  }
  lines.push('');

  // --- Policies and Trust -------------------------------------------------
  lines.push('## Policies and Trust');
  lines.push('');
  lines.push(`- [About](${abs('/about/')})`);
  lines.push(`- [Contact](${abs('/contact/')})`);
  lines.push(`- [Editorial Policy](${abs('/editorial-policy/')})`);
  lines.push(`- [Corrections Policy](${abs('/corrections-policy/')})`);
  lines.push(`- [Disclaimer](${abs('/disclaimer/')})`);
  lines.push(`- [Privacy Policy](${abs('/privacy-policy/')})`);
  lines.push(`- [Cookie Policy](${abs('/cookie-policy/')})`);
  lines.push(`- [Terms](${abs('/terms/')})`);
  lines.push(`- [DMCA](${abs('/dmca/')})`);
  lines.push(`- [Legal Status](${abs('/legal-status/')})`);
  lines.push(`- [Responsible Gaming](${abs('/responsible-gaming/')})`);
  lines.push(`- [Age Restrictions](${abs('/age-restrictions/')})`);
  lines.push('');

  // --- Optional ------------------------------------------------------
  lines.push('## Optional');
  lines.push('');
  lines.push(`- [Updates Log](${abs('/updates/')}): Dated log of verified changes to the app and this site.`);
  lines.push(`- [Promo Code](${abs('/promo-code/')}): How to evaluate a promo code; current status.`);
  lines.push(`- [Complaints](${abs('/complaints/')}): Dispute process and how to report a suspected fake site.`);
  lines.push(`- [Account Deletion](${abs('/account-deletion/')})`);
  lines.push(`- [Authors](${abs('/authors/')})`);
  lines.push(`- [HTML Sitemap](${abs('/sitemap/')})`);
  lines.push('');

  lines.push(`Last updated: 2026-08-17`);

  return new Response(lines.join('\n') + '\n', {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
