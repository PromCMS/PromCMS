import * as path from 'path';
import { defineConfig, loadEnv, PluginOption} from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
// @ts-ignore
import { PORTS } from "@prom-cms/shared/internal"
import { phpServerVitePlugin } from "./plugins";

export default defineConfig(({ mode }) => {
  const currentFolder = process.cwd();
  const env = loadEnv(mode, path.join(currentFolder, '..', '..'), '');
  const { PORT = PORTS.ADMIN, ANALYZE = false } = env;
  const APP_URL_PREFIX = '/admin/';

  return {
    plugins: [
      tsconfigPaths({ root: currentFolder }),
      react(),
      ANALYZE &&
      visualizer({
        filename: './dev/stats.html',
      }) as undefined as PluginOption,
      phpServerVitePlugin()
    ],
    base: APP_URL_PREFIX,
    define: {
      APP_URL_PREFIX,
    },
    root: "src",
    server: {
      port: Number(PORT),
    },
  };
});
