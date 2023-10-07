import path from 'path';
import fs from 'fs-extra';
import { describe, beforeEach, it, afterAll, expect } from 'vitest';
import generateModels from '../../src/jobs/generate-models.js';

import { monorepoRoot } from '@prom-cms/shared/dist/internal/constants.js';
import { generatorConfigSchema } from '@prom-cms/schema/dist/generatorConfigSchema.js';
import {
  DatabaseConfig,
  databaseConfigSchema,
} from '@prom-cms/schema/dist/databaseConfigSchema.js';
import { z } from 'zod';
import { MODELS_FOLDER_NAME } from '@constants';

const TEST_FOLDER_PATH = path.join(
  monorepoRoot,
  'node_modules',
  '.prom-cms',
  'test-app'
);
describe('jobs', () => {
  describe('generateModels', () => {
    beforeEach(async () => {
      await fs.remove(TEST_FOLDER_PATH);
      await fs.ensureDir(TEST_FOLDER_PATH);
    });

    afterAll(async () => {
      await fs.remove(TEST_FOLDER_PATH);
    });

    it('should run correctly and generate files', async () => {
      const root = path.join(TEST_FOLDER_PATH, 'modules', 'test');

      await fs.ensureDir(root);

      await generateModels({
        config: {
          project: { name: '', url: '' },
          database: databaseConfigSchema.parse({
            models: {
              first: {
                icon: 'Article',
                admin: { hidden: true },
                columns: { col: { type: 'string', title: 'New' } },
              },
              second: {
                icon: 'Article',
                tableName: 'second_table_name',
                enabled: false,
                columns: { col: { type: 'string', title: 'Newo' } },
              },
            },
          } satisfies z.input<typeof databaseConfigSchema>),
        },
        moduleRoot: root,
      });

      expect(
        await fs.readFile(
          path.join(root, MODELS_FOLDER_NAME, 'First.model.php'),
          { encoding: 'utf8' }
        )
      ).toMatchSnapshot();

      expect(
        await fs.readFile(
          path.join(root, MODELS_FOLDER_NAME, 'Second.model.php'),
          { encoding: 'utf8' }
        )
      ).toMatchSnapshot();
    });
  });
});
