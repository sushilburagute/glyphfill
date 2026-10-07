// Runs after tsup: tsup's d.ts step deletes stray .d.ts files, so copy afterwards.
import { copyFile, mkdir } from 'node:fs/promises';

await copyFile('src/styles.css', 'dist/styles.css');

// Svelte components ship as source; the app's Svelte compiler builds them.
await mkdir('dist/svelte', { recursive: true });
for (const file of ['GlyphFill.svelte', 'index.js', 'index.d.ts']) {
  await copyFile(`src/svelte/${file}`, `dist/svelte/${file}`);
}
