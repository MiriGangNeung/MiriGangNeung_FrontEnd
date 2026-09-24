import { describe, expect, it } from 'vitest';
import {
  getDefaultPlaceImageIndex,
  getBackgroundPickerImageOrder,
  getPreferredBackgroundImageIndex,
} from './backgroundPickerImages';
import type { Place } from '../types/domain';

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

  it('resolves the curated original index when no manual image selection exists', () => {
    const place: Place = {
      id: 'gyeongpo-beach',
      name: '경포해수욕장',
      region: '강릉시',
      tags: ['자연'],
      cat: 'beach',
      lat: 37.8,
      lng: 128.9,
      thumbnailUrl: 'https://tour.example/gyeongpo-1.jpg',
      imageUrls: [
        'https://tour.example/gyeongpo-1.jpg',
        'https://tour.example/gyeongpo-2.jpg',
        'https://tour.example/gyeongpo-3.jpg',
        'https://tour.example/gyeongpo-4.jpg',
      ],
    };

    expect(getDefaultPlaceImageIndex(place)).toBe(3);
  });
});
