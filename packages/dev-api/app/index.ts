import { loadRootEnv } from '@prom/shared';
import chalk from 'chalk';
import Fastify, { FastifyInstance } from 'fastify';
import routesPlugin from './routes';

loadRootEnv();
const { PORT: FRONT_PORT = 3000 } = process.env;

const SERVER_PORT = Number(FRONT_PORT) + 1;

console.log(
  chalk.green.bold('🔔 Welcome to dev-api server of prom cms generator!')
);
console.log(chalk.blue.bold('🔄 Booting up...'));

const server: FastifyInstance = Fastify({});

console.log(chalk.blue.bold('🔄 Registering up routes...'));
server.register(routesPlugin);

console.log(chalk.blue.bold('🔄 Starting up...'));
const start = async () => {
  try {
    await server.listen(SERVER_PORT);

    const address = server.server.address();
    const port = typeof address === 'string' ? address : address?.port;

    console.log(
      chalk.green.bold(
        `✅ Finished and listening to connections on: http://localhost:${port}`
      )
    );
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
