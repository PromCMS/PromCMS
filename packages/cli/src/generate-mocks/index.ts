import { dirname, join } from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { Low, JSONFile } from 'lowdb';
import faker from 'faker';
import { getDatabaseConfig } from '../get-database-config';
import chalk from 'chalk';

const databaseConfig = await getDatabaseConfig();

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_PATH = join(__dirname, '..', '..', '..', '..');
const DEV_PATH = join(ROOT_PATH, 'dev');
const dbFilePath = join(DEV_PATH, 'db.json');

await fs.ensureDir(DEV_PATH);

export type MockDatabaseFormat = Record<
  keyof typeof databaseConfig['models'] | string,
  Record<string, any>
>;

const adapter = new JSONFile<MockDatabaseFormat>(dbFilePath);
const db = new Low<MockDatabaseFormat>(adapter);

(async () => {
  await db.read();
  console.log(
    chalk.blue.bold('🙇‍♂️ Welcome! Starting creating the mock file...')
  );

  console.log(chalk.blue.bold('🔃 Preparing database by model...'));

  db.data = Object.keys(databaseConfig.models).reduce(
    (finalValue, currentKey) => {
      finalValue[currentKey] = [];
      return finalValue;
    },
    {}
  );

  console.log(
    chalk.blue.bold(
      '🔃 Creating random dataset by the specified database config...'
    )
  );
  Object.keys(databaseConfig.models).forEach((modelKey) => {
    const model = databaseConfig.models[modelKey];

    for (let i = 0; i < 3; i++) {
      const finalObj = {};
      Object.keys(model.columns).forEach((columnKey) => {
        const { required = true, type, hide } = model.columns[columnKey];
        let finalValue;

        // Is random boolean used for when its not required, then the rng decides whenever it should generate or not
        const shouldInput = !!Math.floor(Math.random() * 2);

        // If its not required and random input decision decides that it wont be filled then we continue
        if (!required && !shouldInput) return;

        switch (type) {
          case 'boolean':
            finalValue = faker.datatype.boolean();
            break;
          case 'string':
            finalValue = columnKey.includes('name')
              ? faker.company.companyName()
              : columnKey.includes('title')
              ? faker.name.jobTitle()
              : faker.lorem.word();
            break;
          case 'enum':
            finalValue = [];
            break;
          case 'number':
            finalValue = faker.datatype.number();
            break;
          case 'date':
            finalValue = faker.datatype.datetime();
            break;
          default:
            console.warn(
              `Unknown value ${type} supplied as a column type in mock generator`
            );
            break;
        }

        finalObj[columnKey] = finalValue;
      });

      (db.data as MockDatabaseFormat)[modelKey].push(finalObj);
    }
  });

  console.log(chalk.blue.bold('✅ Finished and writing...'));

  await db.write();
  console.log(chalk.blue.bold('👋 Done! Bye!'));
})();
