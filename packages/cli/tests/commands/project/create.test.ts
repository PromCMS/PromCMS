import { MONOREPO_ROOT } from '@constants';
import { execa } from 'execa';
import fs from 'fs-extra';
import { glob } from 'glob';
import path from 'path';
import { beforeEach, describe, expect, it } from 'vitest';

const TEST_FOLDER_PATH = path.join(
  MONOREPO_ROOT,
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

      // afterAll(async () => {
      //   await fs.remove(TEST_FOLDER_PATH);
      // });

      it('should run correctly and generate files', async () => {
        await expect(
          execa(
            'node',
            [
              path.join(MONOREPO_ROOT, 'packages/cli/bin/cli.js'),
              'project',
              'create',
              '--packageManager',
              'pnpm',
              '--name',
              'Test Project',
              '--clean',
            ],
            {
              cwd: TEST_FOLDER_PATH,
            }
          )
        ).resolves.to.not.toThrow();

        const createdFiles = await glob(`**/*.*`, {
          dot: true,
          cwd: TEST_FOLDER_PATH,
          ignore: ['node_modules/**', 'vendor/**', 'public/admin/assets/**'],
        });

        expect(createdFiles).to.include('pnpm-lock.yaml');
        expect(createdFiles).to.include('composer.lock');

        for (const filePath of createdFiles
          .map((filePath) => path.join(TEST_FOLDER_PATH, filePath))
          .filter((filePath) => !fs.lstatSync(filePath).isDirectory())) {
          if (
            filePath.includes('composer.lock') ||
            filePath.includes('pnpm-lock.yaml')
          ) {
            continue;
          }

          expect(
            await fs.readFile(filePath, {
              encoding: 'utf8',
            })
          ).toMatchSnapshot(filePath.replace(TEST_FOLDER_PATH, ''));
        }
      });
    },
    {
      timeout: 2 * 60 * 1000,
    }
  );
});
