import { Program } from '@boost/cli';
import { loadRootEnv } from '@prom-cms/shared';
import { SeedDatabaseProgram } from './commands/seed-database/index.js';
import { GenerateCMSProgram } from './commands/generate-cms/index.js';
import { GenerateDevelopProgram } from './commands/generate-develop/index.js';
import { SyncDatabaseProgram } from './commands/sync-database/index.js';
import fs from 'fs-extra';
import path from 'path';

(async () => {
  const { version } = await fs.readJson(
    path.join(__dirname, '..', 'package.json')
  );
  await loadRootEnv();

  const program = new Program({
    bin: 'prom-cms-cli',
    name: 'PROM CLI',
    version,
  });

  await program
    .register(new GenerateDevelopProgram())
    .register(new GenerateCMSProgram())
    .register(new SyncDatabaseProgram())
    .register(new SeedDatabaseProgram())
    .runAndExit(process.argv);
})();
