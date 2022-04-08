import { Program } from '@boost/cli';
import { loadRootEnv } from '@prom-cms/shared';
import { SeedDatabaseProgram } from './commands/seed-database';
import { GenerateCMSProgram } from './commands/generate-cms';
import { GenerateDevelopProgram } from './commands/generate-develop';
import { Logger } from '@utils';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

Logger.success('Booting...');
await loadRootEnv();

const programIsAsModule = __dirname.includes('/node_modules/');

const program = new Program({
  bin: 'prom-cms-cli',
  name: 'PROM CLI',
  version: '1.0.0',
});

Logger.success(
  '🙇‍♂️ Hello, PROM developer! Sit back a few seconds while we prepare everything for you...'
);

program.register(new GenerateDevelopProgram());

if (!programIsAsModule) {
  program.register(new GenerateCMSProgram());
}

program.register(new SeedDatabaseProgram()).runAndExit(process.argv);
