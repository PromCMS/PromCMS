import * as path from 'path';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, path.join(process.cwd(), '..', '..'), '');
  const { PORT = 3004 } = env;
  const isDev = mode == 'development';
  const APP_PORT = Number(PORT);
  const APP_URL_PREFIX = isDev ? undefined : '/admin/';

  return {
    plugins: [
      tsconfigPaths(),
      react(),
      visualizer({
        filename: './dev/stats.html',
      }),
    ],
    base: APP_URL_PREFIX || '/',
    define: {
      APP_URL_PREFIX,
    },
    server: {
      port: Number(APP_PORT),
      proxy: {
        '^/api/.*': {
          target: `http://localhost:${APP_PORT + 1}`,
          changeOrigin: false,
        },
      },
    },
  };
});
