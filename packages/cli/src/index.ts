import { Program } from '@boost/cli';
import { loadRootEnv } from '@prom-cms/shared';
import { SeedDatabaseProgram } from './commands/seed-database.js';
import { GenerateCMSProgram } from './commands/generate-cms.js';
import { GenerateDevelopProgram } from './commands/generate-develop.js';
import fs from 'fs-extra';
import path from 'path';
import { PACKAGE_ROOT } from '@constants';
import { DbToolsMigrateProgram } from './commands/db-tools/migrate.js';
import { UsersProgram } from './commands/users.js';

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
    .register(new SeedDatabaseProgram())
    .register(new DbToolsMigrateProgram())
    .register(new UsersProgram())
    .runAndExit(process.argv);
})();
