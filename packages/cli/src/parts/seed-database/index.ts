import { ExportConfig } from '@prom/shared';
import { Database } from 'better-sqlite3';
import child_process from 'child_process';
import faker from 'faker';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const __dirname = dirname(fileURLToPath(import.meta.url));

const seedDatabase = async (
  db: Database,
  databaseConfig: ExportConfig['database']
) => {
  Object.keys(databaseConfig.models).forEach((modelKey) => {
    const model = databaseConfig.models[modelKey];

    for (let i = 0; i < 20; i++) {
      const finalObj = {};
      Object.keys(model.columns).forEach((columnKey) => {
        const column = model.columns[columnKey];
        const { required = true, type, hide } = column;
        let finalValue;

        // Is random boolean used for when its not required, then the rng decides whenever it should generate or not
        const shouldInput = !!Math.floor(Math.random() * 2);

        // If its not required and random input decision decides that it wont be filled then we continue
        if (!required && !shouldInput) {
          finalObj[columnKey] = null;
          return;
        }

        switch (type) {
          case 'boolean':
            finalValue = faker.datatype.boolean();
            break;
          case 'string':
            finalValue = columnKey.includes('name')
              ? faker.company.companyName()
              : columnKey.includes('title')
              ? faker.name.jobTitle()
              : columnKey.includes('avatar')
              ? faker.internet.avatar()
              : columnKey.includes('email')
              ? faker.internet.email().toLowerCase()
              : faker.lorem.word();
            break;
          case 'enum':
            finalValue =
              column.enum[faker.datatype.number(column.enum.length - 1)];
            break;
          case 'number':
            finalValue = faker.datatype.number();
            break;
          case 'date':
            finalValue = faker.datatype.datetime();
            break;
          case 'password':
            const result = child_process.spawnSync(
              'php',
              [path.join(__dirname, 'generate-password.php'), 'test123'],
              { encoding: 'utf8' }
            );
            finalValue = result.stdout;
            break;
          default:
            console.warn(
              `Unknown value ${type} supplied as a column type in mock generator`
            );
            break;
        }

        finalObj[columnKey] = finalValue;
      });

      const formattedColumnKeys = Object.keys({
        ...model.columns,
        ...(model.timestamp ? { created_at: {}, updated_at: {} } : {}),
      })
        .map((columnKey) => `:${columnKey}`)
        .join(', ');

      const stmt = db.prepare(
        `INSERT INTO ${
          model.tableName || modelKey.toLowerCase()
        } VALUES (${formattedColumnKeys})`
      );

      const timeNow = dayjs().format('DD/MM/YYYY HH:mm:ss Z');

      stmt.run({
        ...finalObj,
        ...(model.timestamp
          ? {
              created_at: timeNow,
              updated_at: timeNow,
            }
          : {}),
      });
    }
  });
};

export default seedDatabase;
