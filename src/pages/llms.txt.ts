import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '@/config/site';
import { VERIFIED_GAMES } from '@/config/games';

export const prerender = true;

function abs(path: string): string {
  return new URL(path, SITE.productionUrl).toString();
}

export const GET: APIRoute = async () => {
  const lines: string[] = [];

  const guides = (await getCollection('guides', ({ data }) => !data.draft)).sort(
    (a, b) => new Date(b.data.publishDate).getTime() - new Date(a.data.publishDate).getTime()
  );
  const blog = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => new Date(b.data.publishDate).getTime() - new Date(a.data.publishDate).getTime()
  );
  const updates = (await getCollection('updates')).sort(
    (a, b) => new Date(b.data.publishDate).getTime() - new Date(a.data.publishDate).getTime()
  );
  const mostRecentDate = [...guides, ...blog, ...updates]
    .map((entry) => entry.data.publishDate)
    .sort()
    .at(-1);

  // --- Title + summary blockquote -----------------------------------
  lines.push(`# ${SITE.siteName}`);
  lines.push('');
  lines.push(`> ${SITE.positioning}`);
  lines.push('');
  lines.push(
    `${SITE.siteName} is the official information website of the Pak Rummy team (the game is at pakrummy.com) and covers the Pak Rummy Android app for players in ${SITE.country} (${SITE.language}): verified download facts, safety checks, game rules, payment guides, and support-channel status. Every fact is labelled either independently verified or "Not yet publicly verified" — nothing in between.`
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
  lines.push(`- [Card Rummy vs Pak Rummy](${abs('/card-rummy-vs-pak-rummy/')}): A worked comparison used as an impersonation-detection example.`);
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
  lines.push(`- [Deposit Guide](${abs('/deposit/')}): How deposits generally work; current verification status for payment methods and limits.`);
  lines.push(`- [Withdrawal Guide](${abs('/withdrawal/')}): How withdrawals generally work; current verification status for limits and processing time.`);
  lines.push(`- [Easypaisa and JazzCash](${abs('/easypaisa-jazzcash/')}): Mobile-wallet payment guidance for Pakistan.`);
  lines.push(`- [Common App Errors](${abs('/common-errors/')}): Fixes for the most frequent install/login errors.`);
  lines.push(`- [APK Permissions](${abs('/apk-permissions/')}): Which Android permissions are reasonable, and which are red flags.`);
  for (const guide of guides) {
    lines.push(`- [${guide.data.title}](${abs(`/guides/${guide.slug}/`)}): ${guide.data.description}`);
  }
  for (const game of VERIFIED_GAMES) {
    lines.push(`- [${game.name}](${abs(`/games/${game.slug}/`)}): Rules and format for ${game.name} on Pak Rummy.`);
  }
  lines.push('');

  // --- Blog Posts --------------------------------------------------------
  lines.push('## Blog Posts');
  lines.push('');
  lines.push(`[Blog index](${abs('/blog/')}): Rummy strategy, Pakistan mobile gaming context, and responsible-gaming reading.`);
  lines.push('');
  for (const post of blog) {
    lines.push(`- [${post.data.title}](${abs(`/blog/${post.slug}/`)}): ${post.data.description}`);
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
  for (const entry of updates) {
    lines.push(`  - [${entry.data.title}](${abs(`/updates/${entry.slug}/`)})`);
  }
  lines.push(`- [Promo Code](${abs('/promo-code/')}): How to evaluate a promo code; current status.`);
  lines.push(`- [Complaints](${abs('/complaints/')}): Dispute process and how to report a suspected fake site.`);
  lines.push(`- [Account Deletion](${abs('/account-deletion/')})`);
  lines.push(`- [Authors](${abs('/authors/')})`);
  lines.push(`- [HTML Sitemap](${abs('/sitemap/')})`);
  lines.push('');

  lines.push(`Last updated: ${mostRecentDate ?? new Date().toISOString().slice(0, 10)}`);

  return new Response(lines.join('\n') + '\n', {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
