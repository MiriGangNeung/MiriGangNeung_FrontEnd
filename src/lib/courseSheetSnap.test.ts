import { describe, expect, it } from 'vitest';
import {
  clampSheetOffset,
  nearestSheetSnap,
  sheetOffsetForSnap,
  stepSheetSnap,
} from './courseSheetSnap';

const HEIGHT = 800;

describe('sheetOffsetForSnap', () => {
  it('leaves the full snap almost entirely on screen', () => {
    expect(sheetOffsetForSnap('full', HEIGHT)).toBeCloseTo(48);
  });

  it('pushes the peek snap mostly off screen', () => {
    expect(sheetOffsetForSnap('peek', HEIGHT)).toBeCloseTo(544);
  });
});

describe('clampSheetOffset', () => {
  it('stops a drag past the full position from overshooting the top', () => {
    expect(clampSheetOffset(-200, HEIGHT)).toBeCloseTo(sheetOffsetForSnap('full', HEIGHT));
  });

  it('stops a drag past the peek position from leaving the screen', () => {
    expect(clampSheetOffset(2000, HEIGHT)).toBeCloseTo(sheetOffsetForSnap('peek', HEIGHT));
  });

  it('passes an in-range offset through untouched', () => {
    expect(clampSheetOffset(300, HEIGHT)).toBe(300);
  });
});

describe('nearestSheetSnap', () => {
  it('returns the exact snap when the drag ends on one', () => {
    for (const snap of ['peek', 'half', 'full'] as const) {
      expect(nearestSheetSnap(sheetOffsetForSnap(snap, HEIGHT), HEIGHT)).toBe(snap);
    }
  });

  it('rounds a drag that ends between two snaps to the closer one', () => {
    const halfOffset = sheetOffsetForSnap('half', HEIGHT);
    const fullOffset = sheetOffsetForSnap('full', HEIGHT);
    const midpoint = (halfOffset + fullOffset) / 2;
    expect(nearestSheetSnap(midpoint - 1, HEIGHT)).toBe('full');
    expect(nearestSheetSnap(midpoint + 1, HEIGHT)).toBe('half');
  });

  it('falls back to half when the sheet has not been measured yet', () => {
    expect(nearestSheetSnap(0, 0)).toBe('half');
  });
});

describe('stepSheetSnap', () => {
  it('moves one step toward the requested direction', () => {
    expect(stepSheetSnap('peek', 1)).toBe('half');
    expect(stepSheetSnap('full', -1)).toBe('half');
  });

  it('holds at the ends instead of wrapping around', () => {
    expect(stepSheetSnap('full', 1)).toBe('full');
    expect(stepSheetSnap('peek', -1)).toBe('peek');
  });
});
