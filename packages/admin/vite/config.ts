import react from '@vitejs/plugin-react';
import { execa } from 'execa';
import * as path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { PluginOption, defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import { promPlugin } from '@prom-cms/vite';

export default defineConfig(({ mode, command }) => {
  const currentFolder = process.cwd();
  const env = loadEnv(mode, path.join(currentFolder, '..', '..'), '');
  const { PORT = 3000, ANALYZE = false } = env;
  const APP_URL_PREFIX = '/admin/';

  const plugins: PluginOption[] = [
    tsconfigPaths({ root: currentFolder }),
    react(),
  ];

  if (command === 'serve') {
    let abortController: AbortController;

    plugins.push(
      promPlugin({
        onExit() {
          abortController.abort();
        },
        watchFiles: {
          files: [],
          async onChange({ logger, fileInfo }) {
            // Abort previous
            if (abortController) {
              abortController.abort();
              logger?.warn(
                `File "${fileInfo.filePath}" has been changed - starting from the start 😪`
              );
            } else {
              logger?.info(`Rebuilding models...`);
            }

            try {
              abortController = new AbortController();

              await execa('npm', ['run', 'project:update'], {
                cwd: path.join(process.cwd(), '../../packages/cli'),
                signal: abortController.signal,
              });

              logger?.info(`Model rebuild completed!`);
            } catch (error) {
              if (error instanceof Error) {
                logger?.error(`Model rebuild failed - ${error.message}`);
              }
            }
          },
        },
      }) as unknown as PluginOption
    );
  }

  if (ANALYZE) {
    plugins.push(
      visualizer({
        filename: './dev/stats.html',
      }) as undefined as PluginOption
    );
  }

  return {
    plugins,
    base: APP_URL_PREFIX,
    define: {
      __APP_URL_PREFIX__: JSON.stringify(APP_URL_PREFIX),
      'process.env': {},
    },
    root: 'src',
    server: {
      port: Number(PORT),
    },
    build: {
      outDir: '../dist',
    },
  };
});
