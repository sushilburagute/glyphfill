import { copyFile } from 'node:fs/promises';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    react: 'src/react/index.ts',
  },
  format: ['esm', 'cjs'],
  // tsup's d.ts build sets baseUrl, which TypeScript 6 flags as deprecated.
  dts: { compilerOptions: { ignoreDeprecations: '6.0' } },
  clean: true,
  sourcemap: true,
  target: 'es2022',
  external: ['react', 'react/jsx-runtime'],
  onSuccess: async () => {
    await copyFile('src/styles.css', 'dist/styles.css');
  },
});
