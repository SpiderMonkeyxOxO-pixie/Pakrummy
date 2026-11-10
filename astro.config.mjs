import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { SITE } from './src/config/site.ts';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

/** Pulls `key: "value"` or `key: value` out of YAML frontmatter without a parser dependency. */
function frontmatterField(markdown, key) {
  const match = markdown.match(new RegExp(`^${key}:\\s*"?([^"\\n]+)"?\\s*$`, 'm'));
  return match ? match[1].trim() : undefined;
}

/** slug -> ISO date, read directly from each collection entry's own frontmatter. */
function collectionLastmodMap(collectionDir) {
  const dir = path.join(projectRoot, 'src/content', collectionDir);
  const map = new Map();
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.md')) continue;
    const markdown = readFileSync(path.join(dir, file), 'utf-8');
    const date = frontmatterField(markdown, 'updatedDate') ?? frontmatterField(markdown, 'publishDate');
    if (date) map.set(file.replace(/\.md$/, ''), date);
  }
  return map;
}

const blogLastmod = collectionLastmodMap('blog');
const guidesLastmod = collectionLastmodMap('guides');
const updatesLastmod = collectionLastmodMap('updates');

/** Last real commit date touching a given source file, used as lastmod for plain .astro pages. */
function gitLastmod(relativeFilePath) {
  try {
    const iso = execSync(`git log -1 --format=%aI -- "${relativeFilePath}"`, {
      cwd: projectRoot,
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
    return iso || undefined;
  } catch {
    return undefined;
  }
}

function lastmodForUrl(pageUrl) {
  const pathname = new URL(pageUrl).pathname;

  const collectionEntry = pathname.match(/^\/(blog|guides|updates)\/([^/]+)\/$/);
  if (collectionEntry) {
    const [, collection, slug] = collectionEntry;
    const map = collection === 'blog' ? blogLastmod : collection === 'guides' ? guidesLastmod : updatesLastmod;
    const date = map.get(slug);
    if (date) return date;
  }

  // Plain .astro route: src/pages/<trimmed-path>/index.astro (or src/pages/index.astro for "/").
  const trimmed = pathname.replace(/^\/|\/$/g, '');
  const sourceFile = trimmed ? `src/pages/${trimmed}/index.astro` : 'src/pages/index.astro';
  return gitLastmod(sourceFile);
}

export default defineConfig({
  site: SITE.productionUrl,
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
      serialize(item) {
        const lastmod = lastmodForUrl(item.url);
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],
  build: {
    format: 'directory',
    inlineStylesheets: 'always',
  },
  server: {
    port: 4321,
  },
});
