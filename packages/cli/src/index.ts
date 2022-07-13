import { Program } from '@boost/cli';
import { loadRootEnv } from '@prom-cms/shared';
import { SeedDatabaseProgram } from './commands/seed-database';
import { GenerateCMSProgram } from './commands/generate-cms';
import { GenerateDevelopProgram } from './commands/generate-develop';

(async () => {
  await loadRootEnv();

  const program = new Program({
    bin: 'prom-cms-cli',
    name: 'PROM CLI',
    version: '1.0.0',
  });

  await program
    .register(new GenerateDevelopProgram())
    .register(new GenerateCMSProgram())
    .register(new SeedDatabaseProgram())
    .runAndExit(process.argv);
})();
