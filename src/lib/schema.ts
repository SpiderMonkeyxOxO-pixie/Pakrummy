import { SITE } from '@/config/site';

const WEBSITE_ID = `${SITE.productionUrl}/#website`;
const ORGANIZATION_ID = `${SITE.productionUrl}/#publisher`;

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

export function getBreadcrumbSchema(items: BreadcrumbInput[]) {
  return {
    '@type': 'BreadcrumbList',
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
}

export function getArticleSchema(input: ArticleSchemaInput) {
  const schema: Record<string, unknown> = {
    '@type': 'Article',
    '@id': `${input.url}#article`,
    headline: input.headline,
    description: input.description,
    url: input.url,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    inLanguage: SITE.language,
    publisher: { '@id': ORGANIZATION_ID },
    author: {
      '@type': 'Person',
      name: input.authorName,
    },
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
  const { officialDownloadUrl, appVersion, appPackageName, appFileSizeMb, appLastVerifiedDate } =
    SITE;

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

  return schema;
}

/** Wraps one or more schema nodes in a single @graph for a page. */
export function buildJsonLdGraph(nodes: Array<Record<string, unknown> | null>) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.filter((node): node is Record<string, unknown> => node !== null),
  };
}
