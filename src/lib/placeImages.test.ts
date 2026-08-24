import { describe, expect, it } from 'vitest';

import * as placeImageUtils from './placeImages';
import { getNextPlaceImageIndex, normalizePlaceImages } from './placeImages';
import type { Place } from '../types/domain';

describe('placeImages', () => {
  it('keeps the thumbnail first, removes duplicates, and caps the list at five', () => {
    expect(
      normalizePlaceImages(' https://tour.example/one.jpg ', [
        'https://tour.example/one.jpg',
        'https://tour.example/two.jpg',
        'https://tour.example/three.jpg',
        'https://tour.example/four.jpg',
        'https://tour.example/five.jpg',
        'https://tour.example/six.jpg',
      ]),
    ).toEqual([
      'https://tour.example/one.jpg',
      'https://tour.example/two.jpg',
      'https://tour.example/three.jpg',
      'https://tour.example/four.jpg',
      'https://tour.example/five.jpg',
    ]);
  });

  it('wraps carousel navigation in both directions', () => {
    expect(getNextPlaceImageIndex(4, 1, 5)).toBe(0);
    expect(getNextPlaceImageIndex(0, -1, 5)).toBe(4);
    expect(getNextPlaceImageIndex(0, 1, 0)).toBe(0);
  });

  it('resolves the selected image and its original position for later screens', () => {
    const place: Place = {
      id: 'gyeongpo',
      name: '경포대',
      region: '강릉시',
      tags: ['자연'],
      cat: 'nature',
      lat: 37.8,
      lng: 128.9,
      thumbnailUrl: 'https://tour.example/one.jpg',
      imageUrls: [
        'https://tour.example/one.jpg',
        'https://tour.example/two.jpg',
        'https://tour.example/three.jpg',
      ],
    };
    type SelectionResolver = {
      getPlaceImageSelection?: (
        place: Place,
        imageIndex: number,
      ) => { imageUrl?: string; imageIndex: number; totalImages: number };
    };
    const resolver = placeImageUtils as SelectionResolver;

    expect(resolver.getPlaceImageSelection?.(place, 2)).toEqual({
      imageUrl: 'https://tour.example/three.jpg',
      imageIndex: 2,
      totalImages: 3,
    });
  });
});
