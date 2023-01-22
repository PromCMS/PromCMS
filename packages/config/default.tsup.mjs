import { defineConfig } from 'tsup';

export const configValue = {
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  dts: true,
  format: ['cjs', 'esm'],
};

export default defineConfig(configValue);
