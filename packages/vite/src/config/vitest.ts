import reactPlugin from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    // @ts-expect-error
    reactPlugin(),
  ],
  test: {},
});
