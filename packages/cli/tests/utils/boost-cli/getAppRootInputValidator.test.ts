import { describe, expect, it, vitest } from 'vitest';
import fs from 'fs-extra';

import { getAppRootInputValidator } from '../../../src/utils';
import path from 'path';

describe('utils', () => {
  describe('boost-cli', () => {
    describe('getAppRootInputValidator', () => {
      it('should throw if nothing is provided and is required', async () => {
        expect(() => getAppRootInputValidator(true)('')).to.throw(Error);
      });

      it('should throw when folder already exists', async () => {
        const pathExistsSyncSpy = vitest.spyOn(fs, 'pathExistsSync');
        pathExistsSyncSpy.mockReturnValue(true);

        const inputFolder = '../test';
        const folderPathToBeSearch = path.join(process.cwd(), inputFolder);
        try {
          getAppRootInputValidator(false)(inputFolder);
        } catch (e) {
          expect(pathExistsSyncSpy).toBeCalledWith(folderPathToBeSearch);
          expect(e).toBeInstanceOf(Error);
        }
      });

      it('should not throw when everything goes well', () => {
        const pathExistsSyncSpy = vitest.spyOn(fs, 'pathExistsSync');
        pathExistsSyncSpy.mockReturnValue(false);

        const inputFolder = '../test';
        getAppRootInputValidator(false)(inputFolder);
      });
    });
  });
});
