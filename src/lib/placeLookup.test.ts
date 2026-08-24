import { describe, expect, it } from 'vitest';

import { findPlaceById } from './placeLookup';
import type { Place } from '../types/domain';

const apiPlaces: Place[] = [
  {
    id: 'api-place-uuid',
    name: '경포대',
    region: '강릉시 저동',
    tags: ['자연'],
    cat: 'nature',
    lat: 37.8,
    lng: 128.9,
    thumbnailUrl: 'https://tour.example/gyeongpo.jpg',
  },
];

describe('findPlaceById', () => {
  it('resolves a selected backend place from the fetched list', () => {
    expect(findPlaceById(apiPlaces, 'api-place-uuid')).toEqual(apiPlaces[0]);
  });

  it('returns undefined instead of falling back to a mock place', () => {
    expect(findPlaceById(apiPlaces, 'mock-place-id')).toBeUndefined();
  });
});
