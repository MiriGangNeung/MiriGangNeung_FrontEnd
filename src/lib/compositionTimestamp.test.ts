import { describe, expect, it } from 'vitest';
import { formatCompositionTimestamp } from './compositionTimestamp';

describe('formatCompositionTimestamp', () => {
  it('formats a completed image time in Korea time for the result screen', () => {
    expect(formatCompositionTimestamp('2026-09-08T13:19:00.000Z')).toBe('9/8 22:19');
  });
});
