import { describe, expect, it } from 'vite-plus/test';

import { formatDate } from './format';

describe('formatDate', () => {
  it('formats an ISO date string', () => {
    expect(formatDate('2026-09-27T15:00:00Z')).toBe(
      'September 27, 2026 3:00 PM',
    );
  });

  it('formats a timestamp', () => {
    expect(formatDate(Date.parse('2026-09-27T15:00:00Z'))).toBe(
      'September 27, 2026 3:00 PM',
    );
  });
});
