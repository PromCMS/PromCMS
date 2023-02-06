import { describe, expect, it } from 'vitest';
import {
  formatGeneratorConfig,
  validateGeneratorConfig,
} from '../../../src/generator';
import { mockedGeneratorConfig } from '../../../src/internal';

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
