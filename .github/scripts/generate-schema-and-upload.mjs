// @ts-check

/**
 * @typedef {{major: string, minor: string, patch: string}} Version
 */
import fs from 'fs-extra';
import FtpClient from 'ftp';
import path from 'path';
import { zodToJsonSchema } from 'zod-to-json-schema';

const { PROM_FTP_CONNECTION_STRING } = process.env;

if (!PROM_FTP_CONNECTION_STRING) {
  throw new Error('Missing PROM_FTP_CONNECTION_STRING');
}

const ftpConnectionURL = new URL(PROM_FTP_CONNECTION_STRING);

/**
 *
 * @param {Version} version
 * @param {string} fileContent
 * @returns
 */
const uploadFile = (version, fileContent) =>
  new Promise((resolve, reject) => {
    const client = new FtpClient();
    const tempFilepath = path.join(process.cwd(), 'scripts/.temp/schema.json');
    fs.ensureFileSync(tempFilepath);
    fs.writeFileSync(tempFilepath, fileContent);
    const file = fs.readFileSync(tempFilepath);

    const jsonPathToUpsert = `versions/${Object.values(version).join('/')}/schema.json`;
    const privateJsonPathToUpsert = `/subdoms/schema/${jsonPathToUpsert}`;

    client.on('ready', async () => {
      console.log(`- Updating ${jsonPathToUpsert}`);

      try {
        await new Promise((resolveOne, rejectOne) =>
          client.mkdir(path.dirname(privateJsonPathToUpsert), true, (err) => {
            if (err) rejectOne(err);
            resolveOne(undefined);
          })
        );
        await new Promise((resolveOne, rejectOne) => {
          client.put(file, privateJsonPathToUpsert, (err) => {
            if (err) rejectOne(err);
            resolveOne(undefined);
          });
        });
      } catch (error) {
        reject(error);
      }

      client.end();
    });

    client.on('error', (error) => {
      reject(error);
      client.end();
    });

    client.on('end', () => {
      fs.removeSync(tempFilepath);
      resolve(undefined);
    });

    client.connect({
      host: ftpConnectionURL.host,
      port: Number(ftpConnectionURL.port || 21),
      password: ftpConnectionURL.password,
      user: ftpConnectionURL.username,
    });
  });

/**
 *
 * @returns {Promise<Version>}
 */
const getVersion = async () => {
  const { version } = await fs.readJson(
    path.join(process.cwd(), 'packages/schema/package.json')
  );
  /**
   * @type {string[]}
   */
  const [major, minor, ...patch] = version
    .replace('/', '')
    .split('.')
    .map(String);

  if (!major || !minor || !patch[0]) {
    throw new Error(`Invalid version "${version}"!`);
  }

  return {
    major,
    minor,
    patch: patch.join('.'),
  };
};

console.log('-- Begin schema generate');
const { generatorConfigSchema } = await import('@prom-cms/schema');
console.log('Schema has been found!');
const jsonSchema = JSON.stringify(
  zodToJsonSchema(generatorConfigSchema, 'prom-cms-generate-schema')
);
console.log('Schema has been generated');
console.log(jsonSchema);

console.log('-- Begin schema upload');
const version = await getVersion();
console.log(`Will upload for version "${Object.values(version).join('.')}"`);

await uploadFile(version, jsonSchema);
console.log('FTP upload complete!');
