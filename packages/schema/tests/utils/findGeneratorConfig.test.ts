import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { replaceFileExtension, supportedConfigExtensions } from '../../../src';
import fs from 'fs-extra';
import path from 'path';
import {
  GENERATOR_FILENAME,
  findGeneratorConfig,
} from '../../../src/generator';

const testFolderPath = path.join(
  __dirname,
  '..',
  '..',
  'node_modules',
  '.test-data'
);

describe('findGeneratorConfig util', () => {
  beforeEach(() => {
    if (fs.existsSync(testFolderPath)) {
      fs.removeSync(testFolderPath);
    }

    fs.ensureDirSync(testFolderPath);
  });

  afterEach(() => {
    if (fs.existsSync(testFolderPath)) {
      fs.removeSync(testFolderPath);
    }
  });

  it.each(supportedConfigExtensions)(
    'should find correctly and return path of said config for extension %s',
    async (extension) => {
      // create a config file
      const filename = replaceFileExtension(GENERATOR_FILENAME, extension);
      const filePath = path.join(testFolderPath, filename);

      // Create it
      await fs.createFile(filePath);

      const result = await findGeneratorConfig(testFolderPath);

      await fs.remove(filePath);

      expect(result).toBe(filePath);
    }
  );

  it('should throw if not found', async (extension) => {
    try {
      await findGeneratorConfig(testFolderPath);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });
});
