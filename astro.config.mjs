// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  markdown: {
    shikiConfig: {
      // Code blocks get a light and a dark color scheme; global.css picks one.
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
});
