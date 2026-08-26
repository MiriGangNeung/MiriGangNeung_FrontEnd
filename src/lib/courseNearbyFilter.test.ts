import { describe, expect, it } from 'vitest';
import type { CourseStop } from '../types/domain';
import { ALL_NEARBY_STOP_ID, getNearbyStopOptions } from './courseNearbyFilter';

describe('course nearby stop filter', () => {
  it('offers all and only tourism stops as nearby search criteria', () => {
    const stops = [
      courseStop('tourism-1', '경포가시연습지', false),
      courseStop('external-1', '카페 예시', true),
      courseStop('tourism-2', '순긋해변', false),
    ];

    expect(getNearbyStopOptions(stops)).toEqual([
      { id: ALL_NEARBY_STOP_ID, name: '전체' },
      { id: 'tourism-1', name: '경포가시연습지' },
      { id: 'tourism-2', name: '순긋해변' },
    ]);
  });
});

function courseStop(id: string, name: string, external: boolean): CourseStop {
  return {
    id,
    n: 1,
    name,
    time: '09:00',
    stay: '60분',
    crowd: 'easy',
    note: '',
    lat: 37.7,
    lng: 128.9,
    external,
  };
}
