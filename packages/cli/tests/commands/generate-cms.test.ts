import { execa } from 'execa';
import path from 'path';
import fs from 'fs-extra';
import { describe, beforeEach, it, afterAll, expect } from 'vitest';

import { GENERATOR_FILENAME__JSON } from '@prom-cms/shared/generator';
import {
  mockedGeneratorConfig,
  monorepoRoot,
} from '@prom-cms/shared/dist/internal/constants.js';

const TEST_FOLDER_PATH = path.join(monorepoRoot, 'node_modules', '.test-data');
describe('commands', () => {
  describe(
    'generate-cms',
    () => {
      beforeEach(async () => {
        await fs.ensureDir(TEST_FOLDER_PATH);
        await fs.emptyDir(TEST_FOLDER_PATH);
      });

      afterAll(async () => {
        await fs.remove(TEST_FOLDER_PATH);
      });

      it('should run correctly and generate files', async () => {
        // create config file
        await fs.writeFile(
          path.join(TEST_FOLDER_PATH, GENERATOR_FILENAME__JSON),
          JSON.stringify(mockedGeneratorConfig)
        );

        await expect(async () =>
          execa(
            'node',
            [
              '../../packages/cli/bin/cli.cjs',
              'generate-cms',
              '--skip=dependency-install',
              '--packageManager=npm',
            ],
            {
              cwd: TEST_FOLDER_PATH,
            }
          )
        ).to.not.throw();
      });
    },
    {
      timeout: 2 * 60 * 1000, // 1 minute
    }
  );
});
