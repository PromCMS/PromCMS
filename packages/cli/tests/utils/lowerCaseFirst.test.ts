import { describe, expect, it } from 'vitest';

import { lowerCaseFirst } from '../../src/utils/lowerCaseFirst.js';

describe('lowerCaseFirst utility function', () => {
  it('should format correctly', () => {
    const before = 'ThisIsAClassName';
    const after = 'thisIsAClassName';

    expect(lowerCaseFirst(before)).toBe(after);
  });
});
