import { execa, ExecaChildProcess } from "execa";
import * as path from "node:path";
import fs from "fs-extra"
import {watch} from 'chokidar';
import { FSWatcher } from "node:fs";

export const buildProject = (options) =>
  execa('npm', ['run', 'generate:dev'], {
    cwd: path.join(process.cwd(), '../../packages/cli'),
    ...options,
  });


const getFileWatcher = ({ abortController }) => {
  const instance = watch('../../packages/cli/**/*', {
    persistent: true,
    cwd: process.cwd(),
  });

  instance.on('change', async (path) => {
    // Abort previous
    if (abortController) {
      abortController.abort();
      console.log(`New file changed - starting from the start 😪`);
    } else {
      console.log(`Rebuilding...`);
    }

    try {
      abortController = new AbortController();

      await buildProject({
        signal: abortController.signal,
      });

      // Work is done, no need to keep this up
      abortController = undefined;

      console.info(`Rebuild completed!`);
    } catch (error) {
      // Command was canceled by abort controller, theres not need to return error message
      // because new build will be initialized
      if (error.isCanceled) {
        return;
      }

      console.info(`Rebuild failed - ${error.message}`);
    }
  });

  return instance;
};


export const runPHPServer = async (
  port: number, {abortController}: {abortController: AbortController}
): Promise<{ serverProcess: ExecaChildProcess<string>, fileWatcher: FSWatcher }> => {
  const { execa } = await import('execa');

  const serverProcess = execa(
    'php',
    ['-S', `127.0.0.1:${port}`, '-t', './public', './public/index.php'],
    {
      cwd: path.join(process.cwd(), "..", "..", "node_modules", '.prom-cache',
        'php-app')
    }
  );

  if (!serverProcess.stderr) {
    throw Error('Stderr not found');
  }

  // Ensure encoding
  serverProcess.stderr.setEncoding('utf8');

  // Log what happens on server
  serverProcess.stderr.on('data', (data) =>
    fs.appendFileSync(path.join(process.cwd(), 'php-server-log.txt'), data)
  );

  const fileWatcher = getFileWatcher({abortController})

  return { serverProcess, fileWatcher };
};