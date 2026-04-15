import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://rentlaelite-v2.theissakgroup.workers.dev',
  integrations: [tailwind()],
  output: 'static',
});
