import { CORE_ROOT } from '@prom/shared';
import { execa } from 'execa';
import path from 'path';

const syncDatabase = async () => {
  try {
    await execa(
      'php',
      [path.join(CORE_ROOT, 'app', 'scripts', 'sync-database.php')],
      { encoding: 'utf8' }
    );
  } catch (error) {
    throw `⛔️ An error happened during database syncing(from php script): \n${
      (error as Error).message
    }`;
  }
};

export default syncDatabase;
