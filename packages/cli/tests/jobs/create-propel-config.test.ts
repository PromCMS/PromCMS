import path from 'path';
import fs from 'fs-extra';
import { describe, beforeEach, it, afterAll, expect } from 'vitest';
import createPropelConfig from '../../src/jobs/create-propel-config.js';

import { z } from 'zod';
import { MONOREPO_ROOT } from '@constants';
import { databaseConfigSchema } from '@prom-cms/schema';

const TEST_FOLDER_PATH = path.join(
  MONOREPO_ROOT,
  'node_modules',
  '.prom-cms',
  'test-app'
);
describe('jobs', () => {
  beforeEach(async () => {
    await fs.remove(TEST_FOLDER_PATH);
    await fs.ensureDir(TEST_FOLDER_PATH);
  });

  afterAll(async () => {
    await fs.remove(TEST_FOLDER_PATH);
  });

  describe('createPropelConfig', () => {
    it('should run correctly and generate files', async () => {
      const root = path.join(TEST_FOLDER_PATH, 'modules', 'test');
      await fs.ensureDir(root);

      await createPropelConfig({
        config: {
          project: { name: 'Testing Project', url: '' },
          database: databaseConfigSchema.parse({
            connections: [
              {
                adapter: 'sqlite',
                dsn: `sqlite:${path.join(
                  TEST_FOLDER_PATH,
                  '.database',
                  'application.sq3'
                )}`,
                name: 'default-connection',
                password: 'root',
                user: 'root',
              },
            ],
            models: [
              {
                tableName: 'first',
                admin: { hidden: true, icon: 'Article' },
                columns: [
                  { name: 'col', type: 'string', title: 'New' },
                  {
                    name: 'bola',
                    type: 'boolean',
                    localized: true,
                    title: 'Boolean Column',
                    default: false,
                  },
                ],
              },
              {
                admin: { icon: 'Article' },
                tableName: 'second_table_name',
                api: { enabled: false },
                columns: [{ name: 'col', type: 'string', title: 'Newo' }],
              },
            ],
          } satisfies z.input<typeof databaseConfigSchema>),
        },
        appRoot: TEST_FOLDER_PATH,
      });

      const expectedFiles = [
        path.join(TEST_FOLDER_PATH, '.prom-cms/propel/propel.json'),
        path.join(TEST_FOLDER_PATH, '.prom-cms/propel/schema.xml'),
      ];

      for (const filePath of expectedFiles) {
        expect(
          await fs.readFile(filePath, {
            encoding: 'utf8',
          })
        ).toMatchSnapshot();
      }
    });
  });
});
