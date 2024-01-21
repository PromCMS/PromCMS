import { MONOREPO_ROOT } from '@constants';
import fs from 'fs-extra';
import path from 'path';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { z } from 'zod';

import { databaseConfigSchema } from '@prom-cms/schema';

import { compilePromConfig } from '../../src/jobs/compile-prom-config.js';

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

  describe('compilePromConfig', () => {
    it('should run correctly and generate files', async () => {
      const root = path.join(TEST_FOLDER_PATH, 'modules', 'test');
      await fs.ensureDir(root);

      await compilePromConfig({
        config: {
          project: { name: 'Testing Project', url: '', languages: ['en'] },
          database: databaseConfigSchema.parse({
            connections: [
              {
                name: 'default-connection',
                uri: `pdo-sqlite:///${path.join(
                  '.database',
                  'application.sqlite'
                )}`,
              },
            ],
            models: [
              {
                tableName: 'first',
                title: 'First',
                admin: { isHidden: true, icon: 'Article' },
                columns: [
                  { name: 'col', type: 'string', title: 'New' },
                  {
                    name: 'bola',
                    type: 'boolean',
                    localized: true,
                    title: 'Boolean Column',
                    defaultValue: false,
                  },
                ],
              },
              {
                title: 'Second',
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
        path.join(TEST_FOLDER_PATH, '.prom-cms/parsed/config.php'),
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
