import react from '@vitejs/plugin-react';
import { execa } from 'execa';
import * as fs from 'fs-extra';
import * as path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { PluginOption, defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import { promPlugin } from '@prom-cms/vite';

export default defineConfig(async ({ mode, command }) => {
  const currentFolder = process.cwd();
  const repoRoot = path.join(currentFolder, '..', '..');

  const env = loadEnv(mode, repoRoot, '');
  const { PORT = 3000, ANALYZE = false } = env;
  const APP_URL_PREFIX = '/admin/';

  const plugins: PluginOption[] = [
    tsconfigPaths({ root: currentFolder }),
    react(),
  ];

  if (command === 'serve') {
    let abortController: AbortController | undefined;
    const developmentProjectPath = path.join(
      repoRoot,
      'node_modules',
      '.prom-cms',
      'php-app'
    );

    if ((await fs.pathExists(developmentProjectPath)) === false) {
      console.log(
        `PromCMS testing project not present at ${developmentProjectPath}, creating it...`
      );

      await execa('npm', ['run', 'project:create'], {
        cwd: path.join(repoRoot, 'packages', 'cli'),
      });

      console.log('Project created! Happy coding!');
    }

    plugins.push(
      promPlugin({
        paths: {
          phpFiles: developmentProjectPath,
          project: currentFolder,
        },
        onExit() {
          abortController?.abort();
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
    clearScreen: false,
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
