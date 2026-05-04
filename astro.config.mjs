import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://sevennova.ai',
  integrations: [tailwind()],
  output: 'static',
});
