// FILE: src/shared/utils/date.test.ts
// PURPOSE: Validate safe date formatting helper covers valid and invalid inputs.
// NOTES: Stubs toLocaleDateString to avoid locale-dependent output in CI.

import { afterEach, describe, expect, it, vi } from 'vitest';
import { formatIsoDate } from './date';

describe('formatIsoDate', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('formats a valid ISO string using toLocaleDateString', () => {
    const stub = vi.spyOn(Date.prototype, 'toLocaleDateString').mockReturnValue('01/02/2024');
    const result = formatIsoDate('2024-01-02T00:00:00Z');
    expect(result).toBe('01/02/2024');
    expect(stub).toHaveBeenCalledOnce();
  });

  it('returns em dash for empty or invalid values', () => {
    expect(formatIsoDate()).toBe('—');
    expect(formatIsoDate(null)).toBe('—');
    expect(formatIsoDate('not-a-date')).toBe('—');
  });
});
