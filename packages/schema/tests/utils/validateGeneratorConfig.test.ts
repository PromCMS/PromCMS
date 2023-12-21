import { validateGeneratorConfig } from '@prom-cms/schema';
import { describe, expect, it } from 'vitest';
import { formatGeneratorConfig } from '../../src/utils/formatGeneratorConfig';
import { mockedGeneratorConfig } from '../../src/constants';

describe('findGeneratorConfig util', () => {
  it('should validate and return correct value', async () => {
    await expect(
      async () =>
        await validateGeneratorConfig(
          await formatGeneratorConfig(mockedGeneratorConfig)
        )
    ).to.not.throw();
  });
});
