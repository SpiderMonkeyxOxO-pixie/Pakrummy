import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/config/site.ts';

export default defineConfig({
  site: SITE.productionUrl,
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      changefreq: 'weekly',
      filter: (page) => !page.includes('/404'),
    }),
  ],
  build: {
    format: 'directory',
  },
  server: {
    port: 4321,
  },
});
