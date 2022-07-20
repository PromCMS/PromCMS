import { Program } from '@boost/cli';
import { loadRootEnv } from '@prom-cms/shared';
import { SeedDatabaseProgram } from './commands/seed-database';
import { GenerateCMSProgram } from './commands/generate-cms';
import { GenerateDevelopProgram } from './commands/generate-develop';
import { SyncDatabaseProgram } from './commands/sync-database';
import fs from 'fs-extra';
import path from 'path';
import { PACKAGE_ROOT } from './constants';

(async () => {
  const { version } = await fs.readJson(
    path.join(PACKAGE_ROOT, 'package.json')
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
