import { SITE } from '@/config/site';

const WEBSITE_ID = `${SITE.productionUrl}/#website`;
const ORGANIZATION_ID = `${SITE.productionUrl}/#publisher`;

/**
 * Every article on this site is bylined collectively (see /authors/) — there
 * are no individual contributor profiles. Asserting that byline as a
 * schema.org Person would be a factual claim this site can't back up.
 */
const EDITORIAL_TEAM_BYLINE = 'PakRummyOfficial.com Editorial Team';

/**
 * The only Organization we can honestly assert is the publisher of this
 * website — not the game operator, whose legal identity is unverified.
 * See SITE.positioning and docs/required-verification.md.
 */
export function getOrganizationSchema() {
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: SITE.publisherName,
    url: SITE.productionUrl,
    description: SITE.positioning,
    // The publication's own icon, already used site-wide (header, favicon,
    // default OG image) — not a claim about owning the Pak Rummy app itself.
    logo: {
      '@type': 'ImageObject',
      url: new URL('/images/og-default.png', SITE.productionUrl).toString(),
      width: 400,
      height: 400,
    },
  };
}

export function getWebsiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE.productionUrl,
    name: SITE.siteName,
    description: SITE.tagline,
    inLanguage: SITE.language,
    publisher: { '@id': ORGANIZATION_ID },
  };
}

export interface BreadcrumbInput {
  name: string;
  url: string;
}

/**
 * `pageUrl` must match the `{url}#breadcrumb` id that `getWebPageSchema`
 * references via its `breadcrumb` property — otherwise that reference
 * points at a node this function never actually creates. (It didn't, for
 * a while — every page's BreadcrumbList was floating in the graph with no
 * `@id` at all, so Google's Rich Results Test correctly flagged the
 * referenced-but-undefined node as invalid. Fixed 2026-08-21.)
 */
export function getBreadcrumbSchema(items: BreadcrumbInput[], pageUrl: string) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Subtypes we actually use, each chosen only where it accurately describes
 * the page per Schema.org's definitions — not applied speculatively.
 */
export type WebPageType = 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage';

export interface WebPageSchemaInput {
  url: string;
  name: string;
  description: string;
  breadcrumb?: BreadcrumbInput[];
  datePublished?: string;
  dateModified?: string;
  type?: WebPageType;
}

export function getWebPageSchema(input: WebPageSchemaInput) {
  const schema: Record<string, unknown> = {
    '@type': input.type ?? 'WebPage',
    '@id': `${input.url}#webpage`,
    url: input.url,
    name: input.name,
    description: input.description,
    inLanguage: SITE.language,
    isPartOf: { '@id': WEBSITE_ID },
  };

  if (input.breadcrumb?.length) {
    schema.breadcrumb = { '@id': `${input.url}#breadcrumb` };
  }
  if (input.datePublished) schema.datePublished = input.datePublished;
  if (input.dateModified) schema.dateModified = input.dateModified;

  return schema;
}

export interface ArticleSchemaInput {
  url: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
  image?: string;
  /** Defaults to 'Article'. Use 'BlogPosting' for genuinely blog-style entries (commentary, strategy, opinion) — see the /blog/ collection. */
  type?: 'Article' | 'BlogPosting';
}

export function getArticleSchema(input: ArticleSchemaInput) {
  const schema: Record<string, unknown> = {
    '@type': input.type ?? 'Article',
    '@id': `${input.url}#article`,
    headline: input.headline,
    description: input.description,
    url: input.url,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    inLanguage: SITE.language,
    publisher: { '@id': ORGANIZATION_ID },
    author:
      input.authorName === EDITORIAL_TEAM_BYLINE
        ? { '@id': ORGANIZATION_ID }
        : { '@type': 'Person', name: input.authorName },
    mainEntityOfPage: { '@id': `${input.url}#webpage` },
  };
  if (input.image) schema.image = input.image;
  return schema;
}

export interface PersonSchemaInput {
  url: string;
  name: string;
  jobTitle?: string;
  description?: string;
}

export function getPersonSchema(input: PersonSchemaInput) {
  const schema: Record<string, unknown> = {
    '@type': 'Person',
    '@id': `${input.url}#person`,
    name: input.name,
    url: input.url,
  };
  if (input.jobTitle) schema.jobTitle = input.jobTitle;
  if (input.description) schema.description = input.description;
  return schema;
}

/**
 * Only call this once SITE.officialDownloadUrl, appVersion, and
 * appPackageName are all verified. Returns null otherwise — an incomplete
 * SoftwareApplication graph is worse than none, per docs/schema-inventory.md.
 */
export function getSoftwareApplicationSchema() {
  const {
    officialDownloadUrl,
    appVersion,
    appPackageName,
    appFileSizeMb,
    appLastVerifiedDate,
    appSha256,
    appPermissionsSummary,
  } = SITE;

  if (
    officialDownloadUrl.status !== 'verified' ||
    appVersion.status !== 'verified' ||
    appPackageName.status !== 'verified'
  ) {
    return null;
  }

  const schema: Record<string, unknown> = {
    '@type': 'SoftwareApplication',
    '@id': `${SITE.productionUrl}/download/#app`,
    name: SITE.brandName,
    applicationCategory: 'GameApplication',
    operatingSystem: 'Android',
    downloadUrl: new URL(officialDownloadUrl.value as string, SITE.productionUrl).toString(),
    softwareVersion: appVersion.value,
    identifier: appPackageName.value,
  };

  if (appFileSizeMb.status === 'verified') {
    schema.fileSize = `${appFileSizeMb.value}MB`;
  }
  if (appLastVerifiedDate.status === 'verified') {
    schema.datePublished = appLastVerifiedDate.value;
  }

  // Machine-queryable mirror of the facts shown in the page's HTML fact
  // table — without this, an agent reading only structured data can't
  // recover the checksum or permissions list to verify the file itself.
  const additionalProperty: Array<Record<string, unknown>> = [];
  if (appSha256.status === 'verified') {
    additionalProperty.push({
      '@type': 'PropertyValue',
      name: 'sha256',
      value: appSha256.value,
    });
  }
  if (appPermissionsSummary.status === 'verified') {
    additionalProperty.push({
      '@type': 'PropertyValue',
      name: 'androidPermissions',
      value: (appPermissionsSummary.value as string[]).join(', '),
    });
  }
  if (additionalProperty.length) {
    schema.additionalProperty = additionalProperty;
  }

  return schema;
}

/** Wraps one or more schema nodes in a single @graph for a page. */
export function buildJsonLdGraph(nodes: Array<Record<string, unknown> | null>) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.filter((node): node is Record<string, unknown> => node !== null),
  };
}
