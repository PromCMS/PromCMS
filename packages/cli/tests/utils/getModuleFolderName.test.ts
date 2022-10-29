import { describe, expect, it } from 'vitest';

import { getModuleFolderName } from '../../src/utils';

describe('getModuleFolderName utility function', () => {
  it('should format correctly', () => {
    const before = 'ČASlava sa dat';
    const after = 'CASlava';

    expect(getModuleFolderName(before)).toBe(after);
  });
});
