import { SITE } from '@/config/site';
import {
  buildJsonLdGraph,
  getOrganizationSchema,
  getWebsiteSchema,
  getWebPageSchema,
  getBreadcrumbSchema,
  type BreadcrumbInput,
  type WebPageType,
} from '@/lib/schema';
import type { Crumb } from '@/components/Breadcrumbs.astro';

interface StandardPageInput {
  title: string;
  description: string;
  path: string;
  crumbs: Crumb[];
  /** Defaults to 'WebPage'. Only set a subtype when it genuinely matches the page. */
  type?: WebPageType;
  /** Only pass when the page visibly shows this date (e.g. "Last revised"). */
  datePublished?: string;
  dateModified?: string;
}

/** Standard Organization + WebSite + WebPage(+subtype) + BreadcrumbList graph for an inner page. */
export function buildStandardPageSchema({
  title,
  description,
  path,
  crumbs,
  type,
  datePublished,
  dateModified,
}: StandardPageInput) {
  const canonical = new URL(path, SITE.productionUrl).toString();
  const breadcrumbInput: BreadcrumbInput[] = crumbs.map((c) => ({
    name: c.name,
    url: new URL(c.href, SITE.productionUrl).toString(),
  }));

  return buildJsonLdGraph([
    getOrganizationSchema(),
    getWebsiteSchema(),
    getWebPageSchema({
      url: canonical,
      name: title,
      description,
      breadcrumb: breadcrumbInput,
      type,
      datePublished,
      dateModified,
    }),
    getBreadcrumbSchema(breadcrumbInput, canonical),
  ]);
}
