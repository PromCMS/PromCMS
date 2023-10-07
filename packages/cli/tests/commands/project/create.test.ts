import { execa } from 'execa';
import path from 'path';
import fs from 'fs-extra';
import { describe, beforeEach, it, afterAll, expect } from 'vitest';

import { monorepoRoot } from '@prom-cms/shared/dist/internal/constants.js';

const TEST_FOLDER_PATH = path.join(
  monorepoRoot,
  'node_modules',
  '.prom-cms',
  'test-app'
);
describe('commands', () => {
  describe(
    'project create',
    () => {
      beforeEach(async () => {
        await fs.remove(TEST_FOLDER_PATH);
        await fs.ensureDir(TEST_FOLDER_PATH);
      });

      afterAll(async () => {
        await fs.remove(TEST_FOLDER_PATH);
      });

      it('should run correctly and generate files', async () => {
        await expect(
          execa(
            'node',
            [
              path.join(monorepoRoot, 'packages/cli/bin/cli.js'),
              'project',
              'create',
              '--packageManager',
              'npm',
              '--name',
              'Test Project',
              '--no-install',
            ],
            {
              cwd: TEST_FOLDER_PATH,
            }
          )
        ).resolves.to.not.toThrow();
      });
    },
    {
      timeout: 2 * 60 * 1000, // 1 minute
    }
  );
});
