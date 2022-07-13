import { Program } from '@boost/cli';
import { loadRootEnv } from '@prom-cms/shared';
import { SeedDatabaseProgram } from './commands/seed-database';
import { GenerateCMSProgram } from './commands/generate-cms';
import { GenerateDevelopProgram } from './commands/generate-develop';
import fs from 'fs-extra';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
    .register(new SeedDatabaseProgram())
    .runAndExit(process.argv);
})();
