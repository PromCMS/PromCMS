import { describe, it } from 'vitest';
/*
import { execa } from 'execa';
import path from 'path';
import fs from 'fs-extra';
import { mockedGeneratorConfig, PROJECT_ROOT } from '../../src/constants';
import { GENERATOR_FILENAME__JSON } from '@prom-cms/shared';

const TEST_FOLDER_PATH = path.join(PROJECT_ROOT, 'node_modules', '.test-data');
describe('commands', () => {
  describe('generate-cms', () => {
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

      const subprocess = execa('npx', ['@prom-cms/cli', 'generate-cms'], {
        cwd: TEST_FOLDER_PATH,
      });

      await subprocess;

      console.log({ subprocess });
    });
  });
});
*/

describe('commands generate-cms', () => {
  it.todo('Add tests');
});
