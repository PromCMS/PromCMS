import { defineConfig } from 'tsup';

/**
 * @type {import("tsup").Options}
 */
export const configValue = {
  entry: ['src'],
  splitting: false,
  sourcemap: true,
  clean: false,
  outDir: 'dist',
  dts: true,
  format: 'esm',
  async onSuccess() {
    const { execa } = await import('execa');

    await execa('tsc', ['--emitDeclarationOnly'], {
      cwd: process.cwd(),
    });
  },
};

export default defineConfig(configValue);
