// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// For GitHub Pages project sites set:
//   SITE_URL=https://<user>.github.io  BASE_PATH=/<repo-name>
// Locally both default to a root deployment.
const site = process.env.SITE_URL ?? 'http://localhost:4321';
const base = process.env.BASE_PATH ?? '/';

// https://astro.build/config
export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  integrations: [mdx(), sitemap()],
  markdown: {
    syntaxHighlight: {
      type: 'shiki',
      // Leave ```mermaid blocks untouched so the client can render them as diagrams.
      excludeLangs: ['mermaid'],
    },
    shikiConfig: {
      // Dual themes: colors are emitted as CSS variables and switched in global.css.
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
      defaultColor: false,
      wrap: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
    // Mermaid is large but lazy-loaded only on pages that contain a diagram.
    build: { chunkSizeWarningLimit: 2000 },
  },
});
