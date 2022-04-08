import { execa } from 'execa';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const syncDatabase = async () => {
  try {
    await execa('php', [path.join(__dirname, 'sync-database.php')], {
      encoding: 'utf8',
    });
  } catch (error) {
    throw `⛔️ An error happened during database syncing(from php script): \n${
      (error as Error).message
    }`;
  }
};

export default syncDatabase;
