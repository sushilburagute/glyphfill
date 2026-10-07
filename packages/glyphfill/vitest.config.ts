import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [svelte()],
  // Load Svelte's browser runtime so components can mount in jsdom.
  resolve: { conditions: ['browser'] },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
