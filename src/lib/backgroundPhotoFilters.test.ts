import { describe, expect, it } from 'vitest';

import type { Place } from '../types/domain';
import { filterBackgroundPhotos } from './backgroundPhotoFilters';

const places: Place[] = [
  {
    id: 'award-beach',
    name: '공모전 해변',
    region: '강릉시',
    tags: [],
    cat: 'beach',
    lat: 0,
    lng: 0,
    source: 'award',
  },
  {
    id: 'award-nature',
    name: '공모전 자연',
    region: '강릉시',
    tags: [],
    cat: 'nature',
    lat: 0,
    lng: 0,
    source: 'award',
  },
  {
    id: 'gallery-beach',
    name: '갤러리 해변',
    region: '강릉시',
    tags: [],
    cat: 'beach',
    lat: 0,
    lng: 0,
    source: 'gallery',
  },
];

describe('filterBackgroundPhotos', () => {
  it('filters by source before applying all, filter, or category tabs', () => {
    expect(filterBackgroundPhotos(places, 'award', 'all').map((place) => place.id)).toEqual([
      'award-beach',
      'award-nature',
    ]);
    expect(filterBackgroundPhotos(places, 'gallery', 'filter').map((place) => place.id)).toEqual([
      'gallery-beach',
    ]);
    expect(filterBackgroundPhotos(places, 'gallery', 'beach').map((place) => place.id)).toEqual([
      'gallery-beach',
    ]);
    expect(filterBackgroundPhotos(places, 'gallery', 'nature')).toEqual([]);
  });
});
