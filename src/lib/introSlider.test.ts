import { describe, expect, it } from 'vitest';

import { clampComparisonPercent } from './introSlider';

describe('clampComparisonPercent', () => {
  it('keeps comparison positions inside the visible image bounds', () => {
    expect(clampComparisonPercent(-20)).toBe(0);
    expect(clampComparisonPercent(42.5)).toBe(42.5);
    expect(clampComparisonPercent(120)).toBe(100);
  });
});
