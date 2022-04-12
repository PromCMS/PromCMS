import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import child_process from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));

const syncDatabase = async () => {
  let messages = 'none';
  try {
    await new Promise((resolve, reject) => {
      const child = child_process.exec(
        `php ${path.join(__dirname, 'sync-database.php')}`
      );

      child.stdout?.on('data', (data) => {
        messages = data;
      });

      child.on('exit', function (code) {
        if (code === 0) {
          resolve(true);
        } else {
          reject(false);
        }
      });
    });
  } catch (error) {
    throw `⛔️ An error happened during database syncing(from php script): \n${messages}`;
  }
};

export default syncDatabase;
