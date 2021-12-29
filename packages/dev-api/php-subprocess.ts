import childProcess from 'child_process';
import { loadRootEnv } from '@prom/shared';
import chalk from 'chalk';

loadRootEnv();

const { PORT: FRONT_PORT = 3000 } = process.env;
const SERVER_PORT = Number(FRONT_PORT) + 1;

console.log(
  chalk.green.bold('🔔 Welcome to dev-api server of prom cms generator!')
);

console.log(chalk.blue.bold('🔄 Booting up...'));
const serverProcess = childProcess.exec(
  `php -S localhost:${SERVER_PORT} -t ../core/`
);

serverProcess.stderr.setEncoding('utf8');
serverProcess.stderr.on('data', function (data) {
  console.log('stderr: ' + data);
});

console.log(
  chalk.green.bold(
    `✅ Finished and listening to connections on: http://localhost:${SERVER_PORT}`
  )
);
