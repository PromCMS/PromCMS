import { loadRootEnv } from '@prom/shared';
import chalk from 'chalk';
import fs from 'fs-extra';
import { execa } from 'execa';

loadRootEnv();

const { PORT: FRONT_PORT = 3000 } = process.env;
const SERVER_PORT = Number(FRONT_PORT) + 1;

console.log(
  chalk.green.bold('🔔 Welcome to dev-api server of prom cms generator!')
);

console.log(chalk.blue.bold('🔄 Booting up...'));

console.log(chalk.blue.bold('🔄 Clearing old log file...'));
fs.remove('log.txt');

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

console.log(
  chalk.green.bold(
    `✅ Finished and listening to connections on: http://localhost:${SERVER_PORT}`
  )
);
