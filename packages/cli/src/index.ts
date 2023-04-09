import { Program } from '@boost/cli';
import { SeedDatabaseProgram } from './commands/seed-database.js';
import { GenerateCMSProgram } from './commands/generate-cms.js';
import { GenerateDevelopProgram } from './commands/generate-develop.js';
import fs from 'fs-extra';
import path from 'path';
import { PACKAGE_ROOT } from '@constants';
import { DbToolsMigrateProgram } from './commands/db-tools/migrate.js';
import { Logger } from '@utils';
import { UsersScaffoldCommand } from './commands/users/index.js';

(async () => {
  const { version } = await fs.readJson(
    path.join(PACKAGE_ROOT, 'package.json')
  );

  const program = new Program({
    bin: 'prom-cms-cli',
    name: 'PROM CLI',
    version,
  });

  Logger.info('🙇‍♂️ Hello, PROM developer!');

  await program
    .register(new GenerateDevelopProgram())
    .register(new GenerateCMSProgram())
    .register(new SeedDatabaseProgram())
    .register(new DbToolsMigrateProgram())
    .register(new UsersScaffoldCommand())
    .runAndExit(process.argv);
})();
