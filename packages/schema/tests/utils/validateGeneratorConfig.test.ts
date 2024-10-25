import { describe, expect, it } from 'vitest';

import { validateGeneratorConfig } from '@prom-cms/schema';

import { mockedGeneratorConfig } from '../../src/constants';
import { formatGeneratorConfig } from '../../src/utils/formatGeneratorConfig';

describe('findGeneratorConfig util', () => {
  it('should validate and return correct value', async () => {
    await expect(
      async () =>
        await validateGeneratorConfig(
          await formatGeneratorConfig(mockedGeneratorConfig)
        )
    ).resolves.to.not.toThrow();
  });
});
