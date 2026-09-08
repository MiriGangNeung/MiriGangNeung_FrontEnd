import { describe, expect, it } from 'vitest';
import {
  getBackgroundPickerImageOrder,
  getPreferredBackgroundImageIndex,
} from './backgroundPickerImages';

describe('getPreferredBackgroundImageIndex', () => {
  it('uses the requested default photo order for curated background cards', () => {
    expect(getPreferredBackgroundImageIndex('안목해변')).toBe(4);
    expect(getPreferredBackgroundImageIndex('경포 해수욕장')).toBe(3);
    expect(getPreferredBackgroundImageIndex('주문진 등대')).toBe(2);
    expect(getPreferredBackgroundImageIndex('향호해변')).toBe(2);

    expect(getBackgroundPickerImageOrder('안목해변', 5)).toEqual([4, 0, 1, 2, 3]);
    expect(getBackgroundPickerImageOrder('경포 해수욕장', 5)).toEqual([3, 0, 1, 2, 4]);
    expect(getBackgroundPickerImageOrder('주문진 등대', 5)).toEqual([2, 0, 1, 3, 4]);
    expect(getBackgroundPickerImageOrder('향호해변', 5)).toEqual([2, 0, 1, 3, 4]);
  });

  it('returns no override for places without a curated thumbnail', () => {
    expect(getPreferredBackgroundImageIndex('경포호')).toBeUndefined();
  });
});
