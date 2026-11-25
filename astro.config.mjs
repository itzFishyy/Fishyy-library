// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  markdown: {
    shikiConfig: {
      // The color scheme of code blocks. The site has one (dark) theme.
      theme: 'github-dark',
    },
  },
});
