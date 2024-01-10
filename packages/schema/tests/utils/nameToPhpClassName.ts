import { describe, expect, it } from 'vitest';

import { nameToPhpClassName } from '../../src/utils/nameToPhpClassName';

describe('nameToPhpClassName utility function', () => {
  it('should format correctly', () => {
    const before = 'ČASlava sa dat';
    const after = 'CaslavaSaDat';

    expect(nameToPhpClassName(before)).toBe(after);
  });
});
