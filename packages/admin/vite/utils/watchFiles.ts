import { watch } from 'chokidar';
import { execa } from 'execa';
import * as path from 'node:path';

export const buildProject = (options) =>
  execa('npm', ['run', 'project:update'], {
    cwd: path.join(process.cwd(), '../../packages/cli'),
    ...options,
  });

export const watchFiles = ({
  abortController: parentAbortController,
}: {
  abortController: AbortController;
}) => {
  let abortController: AbortController;

  // Catch parent aborter
  parentAbortController.signal.addEventListener('abort', () => {
    abortController?.abort();
  });

  const instance = watch(
    [
      '../../packages/cli/src/**/*',
      '../../packages/cli/scripts/**/*',
      '../../packages/cli/templates/**/*',
    ],
    {
      persistent: true,
      cwd: process.cwd(),
    }
  );

  instance.on('change', async (path) => {
    // Abort previous
    if (abortController) {
      abortController.abort();
      console.log(
        `File "${path}" has been changed - starting from the start 😪`
      );
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
