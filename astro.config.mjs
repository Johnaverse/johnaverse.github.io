import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.johnaverse.cc',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: page => !page.endsWith('/404/') && !page.endsWith('/404.html') })],
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});
