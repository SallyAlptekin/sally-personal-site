// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Canonical production URL for Sally's site.
export default defineConfig({
  site: 'https://sallyalptekin.com',
  integrations: [sitemap()],
});
