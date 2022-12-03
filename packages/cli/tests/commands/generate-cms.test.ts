import { afterAll, beforeEach, describe, it } from 'vitest';
import { execa, Options } from 'execa';
import path from 'path';
import fs from 'fs-extra';
import { mockedGeneratorConfig, PROJECT_ROOT } from '../../src/constants';
import { GENERATOR_FILENAME__JSON } from '@prom-cms/shared';

const runNpmCommand = (args: string[], options?: Options) =>
  execa('npm', args, options);

const TEST_FOLDER_PATH = path.join(PROJECT_ROOT, 'node_modules', '.test-data');

describe('commands', () => {
  describe('generate-cms', () => {
    beforeEach(() => {
      fs.ensureDirSync(TEST_FOLDER_PATH);
      fs.emptyDirSync(TEST_FOLDER_PATH);
    });

    afterAll(() => {
      fs.removeSync(TEST_FOLDER_PATH);
    });

    it('should run correctly and generate files', async () => {
      // create config file
      await fs.writeFile(
        path.join(TEST_FOLDER_PATH, GENERATOR_FILENAME__JSON),
        mockedGeneratorConfig
      );

      const c = runNpmCommand([`c=${TEST_FOLDER_PATH}`], {
        cwd: TEST_FOLDER_PATH,
      });

      console.log({ c });
    });
  });
});
