import fs from 'fs-extra';
import { execa, ExecaError } from 'execa';
import chokidar from 'chokidar';
import { loadRootEnv } from '@prom-cms/shared';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { Logger } from './utils';
import { CLI_ROOT } from '@prom-cms/shared/src/generator-constants';
import path from 'path/posix';

await loadRootEnv();

const __dirname = dirname(fileURLToPath(import.meta.url));
const { PORT: FRONT_PORT = 3000 } = process.env;
const SERVER_PORT = Number(FRONT_PORT) + 1;
let abortController: AbortController | undefined;

Logger.info('🔔 Welcome to dev-api server of prom cms generator!');
Logger.info('🔄 Booting up...');

// Clean old log file
Logger.info('🔄 Clearing old log file...');
await fs.remove('log.txt');

// Start php server
const serverProcess = execa('php', [
  '-S',
  `127.0.0.1:${SERVER_PORT}`,
  '-t',
  '../core/public',
  '../core/public/index.php',
]);
if (!serverProcess.stderr) {
  throw Error('Stderr not found');
}
serverProcess.stderr.setEncoding('utf8');
serverProcess.stderr.on('data', function (data) {
  fs.appendFileSync('log.txt', data);
});

Logger.success(
  `✅ Finished and listening to connections on: http://localhost:${SERVER_PORT}`
);

// Initialize watcher
const watcher = chokidar.watch('../../cli/**/*', {
  persistent: true,
  ignored: path.join('..', '..', 'core', 'modules'),
  cwd: __dirname,
});

// On files change run build script
watcher.on('change', async (path) => {
  // Abort previous
  if (abortController) {
    abortController.abort();
    Logger.info(`New file changed - starting from the start 😪`);
  } else {
    Logger.info(`Rebuilding...`);
  }

  try {
    abortController = new AbortController();

    await execa('npm', ['run', 'regenerate:dev'], {
      cwd: CLI_ROOT,
      signal: abortController.signal,
    });

    // Work is done, no need to keep this up
    abortController = undefined;

    Logger.info(`Rebuild completed!`);
  } catch (e) {
    // Command was canceled by abort controller, theres not need to return error message
    // because new build will be initialized
    if ((e as ExecaError).isCanceled) {
      return;
    }

    Logger.info(`Rebuild failed - ${(e as Error).message}`);
  }
});

// Handle exit - we need to kill php server with this
async function exitHandler(
  options: { type: 'cleanup' | 'exit' },
  exitCode: number
) {
  // Abort work if there is some
  abortController?.abort();
  // watcher needs to be closed too
  await watcher.close();
  // Lastly kill server
  if (serverProcess.kill()) {
    Logger.success(`✅ php server killed. Bye`);
  }
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, { type: 'cleanup' }));
process.on('SIGINT', exitHandler.bind(null, { type: 'exit' }));
process.on('SIGUSR1', exitHandler.bind(null, { type: 'exit' }));
process.on('SIGUSR2', exitHandler.bind(null, { type: 'exit' }));
process.on('uncaughtException', exitHandler.bind(null, { type: 'exit' }));
