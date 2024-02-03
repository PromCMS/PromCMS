import react from '@vitejs/plugin-react';
import { execa } from 'execa';
import * as fs from 'fs-extra';
import * as path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { Plugin, PluginOption, defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import { promPlugin } from '@prom-cms/vite';

export default defineConfig(async ({ mode, command }) => {
  const currentFolder = process.cwd();
  const repoRoot = path.join(currentFolder, '..', '..');
  const projectRoot = path.join(currentFolder, 'src');
  const developmentProjectPath = path.join(
    repoRoot,
    'packages',
    'cli',
    '.dev'
  );
  let abortController: AbortController | undefined;

  const env = loadEnv(mode, repoRoot, '');
  const { PORT = 3000, ANALYZE = false } = env;
  const APP_URL_PREFIX = '/admin/';

  const plugins: PluginOption[] = [
    tsconfigPaths({ root: currentFolder }),
    react(),
  ];

  if (command === 'serve') {
    if (
      (await fs.pathExists(path.join(developmentProjectPath, 'vendor'))) ===
      false
    ) {
      console.log(
        `PromCMS testing project not present at ${developmentProjectPath}, creating it please wait...`
      );

      await execa('pnpm', ['run', 'project:create'], {
        cwd: path.join(repoRoot, 'packages', 'cli'),
      });

      console.log('Project created! Happy coding!');
    }
  }

  if (ANALYZE) {
    plugins.push(
      visualizer({
        filename: './.temp/stats.html',
        title: 'PromCMS Admin Visualizer',
        projectRoot,
      }) as unknown as Plugin
    );
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

            await execa('pnpm', ['run', 'project:update'], {
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
    })
  );

  return {
    clearScreen: false,
    plugins,
    base: APP_URL_PREFIX,
    define: {
      __APP_URL_PREFIX__: JSON.stringify(APP_URL_PREFIX),
      'process.env': {},
    },
    root: projectRoot,
    server: {
      port: Number(PORT),
    },
    build: {
      outDir: path.join(projectRoot, '..', 'dist'),
    },
  };
});
