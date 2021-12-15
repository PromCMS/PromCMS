import path from 'path';
import fs from 'fs-extra';
import { PROJECT_ROOT } from '@shared';

const databaseConfig = await fs.readJson(
  path.join(PROJECT_ROOT, 'database.generate-config.json')
);

console.log(databaseConfig);
