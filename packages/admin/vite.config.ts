import * as path from 'path';
import { defineConfig, loadEnv, PluginOption } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
  const currentFolder = process.cwd();
  const env = loadEnv(mode, path.join(currentFolder, '..', '..'), '');
  const { PORT = 3004, ANALYZE = false } = env;
  const isDev = mode == 'development';
  const APP_PORT = Number(PORT);
  const APP_URL_PREFIX = isDev ? undefined : '/admin/';

  return {
    plugins: [
      tsconfigPaths({root: currentFolder}),
      react(),
      ANALYZE &&
      visualizer({
        filename: './dev/stats.html',
      }) as undefined as PluginOption,
    ],
    base: APP_URL_PREFIX,
    define: {
      APP_URL_PREFIX,
    },
    root: "src",
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
