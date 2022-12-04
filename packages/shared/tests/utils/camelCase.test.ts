import { describe, expect, it } from 'vitest';
import { camelCase } from '../../src';

describe('camelCase util', () => {
  it('should work correctly', () => {
    const input = 'SomeString_capitalized';
    const output = 'someString_capitalized';

    expect(camelCase(input)).toBe(output);
  });
});
