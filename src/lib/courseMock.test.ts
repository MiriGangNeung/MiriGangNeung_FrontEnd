import { describe, expect, it } from 'vitest';

import { buildMockCourseStops } from './courseMock';
import type { Place } from '../types/domain';

const places: Place[] = [
  {
    id: 'beach-b',
    name: '두 번째 장소',
    region: '강릉시 해안로',
    tags: ['해변', '산책'],
    cat: 'beach',
    lat: 37.8,
    lng: 128.9,
    thumbnailUrl: 'https://example.com/beach-b.jpg',
  },
  {
    id: 'beach-a',
    name: '원픽 장소',
    region: '강릉시 바닷가',
    tags: ['자연'],
    cat: 'nature',
    lat: 37.81,
    lng: 128.91,
    thumbnailUrl: 'https://example.com/beach-a.jpg',
  },
];

describe('buildMockCourseStops', () => {
  it('builds course stops from selected places in selection order', () => {
    const result = buildMockCourseStops(places, ['beach-b', 'beach-a'], 'beach-a');

    expect(result).toMatchObject([
      {
        n: 1,
        id: 'beach-b',
        name: '두 번째 장소',
        onePick: false,
        thumbnailUrl: 'https://example.com/beach-b.jpg',
      },
      {
        n: 2,
        id: 'beach-a',
        name: '원픽 장소',
        onePick: true,
        thumbnailUrl: 'https://example.com/beach-a.jpg',
      },
    ]);
  });

  it('skips selected ids that are not present in the loaded place list', () => {
    const result = buildMockCourseStops(places, ['missing', 'beach-a'], 'beach-a');

    expect(result.map((stop) => stop.id)).toEqual(['beach-a']);
    expect(result[0]?.n).toBe(1);
  });
});
