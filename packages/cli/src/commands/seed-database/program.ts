import { Arg, Command, Config } from '@boost/cli';
import {
  formatGeneratorConfig,
  getGeneratorConfig,
  loadRootEnv,
} from '@prom-cms/shared';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { getCarbonTime, hashPassword, specialStringFaker } from './utils';
import { faker } from '@faker-js/faker';
import { Logger } from '@utils';
import Database from 'better-sqlite3';
import {
  CORE_ROOT,
  PROJECT_ROOT,
} from '@prom-cms/shared/src/generator-constants';
import path from 'path';
import fs from 'fs-extra';

dayjs.extend(utc);
dayjs.extend(timezone);

type CustomParams = [string];

@Config('seed-database', 'Sync database with provided config', {})
export class SeedDatabaseProgram extends Command {
  /*@Arg.Params<CustomParams>({
    label: 'root',
    description: 'Root of your final project',
    required: true,
    type: 'string',

    validate(value) {
      if (
        !/^((\.)|((\.|\.\.)\/((?!\/).*(\/)?){1,})|((?!\/).*(\/)))$/g.test(value)
      ) {
        throw new Error(
          'Folder path must be valid path, eq: ".", "../somefolder", "./somefolder"'
        );
      }

      const referenceFolder = path.join(PROJECT_ROOT, value);

      if (
        fs.existsSync(referenceFolder) &&
        fs.lstatSync(referenceFolder).isFile()
      ) {
        throw new Error('Root folder cannot be file');
      }
    },
  })
  async run(root) {*/
  async run() {
    // TODO make this script php first and take advantage of eloquent
    Logger.info('🔃 Starting the database seeder...');

    // const PROVIDED_ROOT = path.join(PROJECT_ROOT, ...root.split('/'));
    // await loadRootEnv(PROVIDED_ROOT);

    const { DB_DATABASE } = process.env as { DB_DATABASE: string };
    const db = new Database(path.join(CORE_ROOT, DB_DATABASE));
    //const GENERATOR_CONFIG = await getGeneratorConfig(PROVIDED_ROOT);
    const GENERATOR_CONFIG = await getGeneratorConfig();

    if (!GENERATOR_CONFIG) {
      throw '⛔️ No generator config provided, please provide a config.';
    }

    const { database: databaseConfig } = await formatGeneratorConfig(
      GENERATOR_CONFIG
    );

    Object.keys(databaseConfig.models).forEach((modelKey) => {
      const model = databaseConfig.models[modelKey];

      if (model.ignoreSeeding) return;

      for (let i = 0; i < 5; i++) {
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
              finalValue = faker.datatype.boolean() ? 1 : 0;
              break;
            case 'string':
              finalValue = specialStringFaker(columnKey);
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
              finalValue = hashPassword('test123');
              break;
            case 'json':
              // TODO: Needs implementation
              finalValue = '';
            case 'longText':
              finalValue = faker.lorem.paragraph(3);
              break;
            default:
              console.warn(
                `Unknown value "${type}" supplied as a column type in mock generator`
              );
              break;
          }

          finalObj[columnKey] = finalValue;
        });

        const formattedColumnKeys = Object.keys({
          ...model.columns,
          ...(model.tableName?.toLowerCase() === 'users' && i === 0
            ? { email: 'test@example.com' }
            : {}),
          ...(model.timestamp ? { created_at: {}, updated_at: {} } : {}),
          ...(model.softDelete ? { deleted_at: {} } : {}),
        })
          .map((columnKey) => `:${columnKey}`)
          .join(', ');

        const stmt = db.prepare(
          `INSERT INTO ${
            model.tableName || modelKey.toLowerCase()
          } VALUES (${formattedColumnKeys})`
        );

        const timeNow = getCarbonTime();

        stmt.run({
          ...finalObj,
          // For test purposes we take care of a first entry and make it always the same
          ...(modelKey.toLowerCase() === 'users' && i === 0
            ? {
                email: 'test@example.com',
                role: 'Admin',
              }
            : {}),
          ...(model.timestamp
            ? {
                created_at: timeNow,
                updated_at: timeNow,
              }
            : {}),
          ...(model.softDelete
            ? {
                deleted_at: null,
              }
            : {}),
        });
      }
    });

    Logger.success('✅ Seeding done!');
  }
}
