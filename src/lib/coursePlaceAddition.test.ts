import { describe, expect, it } from 'vitest';

import { createAddedStop, getMapStops, searchPlaces } from './coursePlaceAddition';
import type { CourseStop, Place } from '../types/domain';

const places = [
  {
    id: 'coffee-beach',
    name: 'Coffee Beach',
    region: 'Gangneung',
    tags: ['coffee', 'ocean'],
    cat: 'food',
    lat: 37.77,
    lng: 128.95,
  },
  {
    id: 'forest-walk',
    name: 'Forest Walk',
    region: 'Pyeongchang',
    tags: ['nature', 'trail'],
    cat: 'nature',
    lat: 37.7,
    lng: 128.8,
  },
] as Place[];

const courseStops = [
  {
    n: 1,
    id: 'market',
    name: 'Market',
    time: '12:00',
    stay: '60 min',
    crowd: 'easy',
    note: 'Lunch',
    lat: 37.8,
    lng: 128.9,
  },
  {
    n: 2,
    id: 'museum',
    name: 'Museum',
    time: '14:00',
    stay: '60 min',
    crowd: 'mid',
    note: 'Art',
    lat: 37.81,
    lng: 128.91,
  },
] as CourseStop[];

describe('searchPlaces', () => {
  it('finds places by trimmed name, region, and tag queries', () => {
    expect(searchPlaces(places, '  coffee ')).toEqual([places[0]]);
    expect(searchPlaces(places, 'PYEONGCHANG')).toEqual([places[1]]);
    expect(searchPlaces(places, 'ocean')).toEqual([places[0]]);
  });
});

describe('createAddedStop', () => {
  it('appends the selected place after the final course stop', () => {
    expect(createAddedStop(places[0], courseStops)).toMatchObject({
      n: 3,
      id: 'coffee-beach',
      name: 'Coffee Beach',
      time: '15:30',
      lat: 37.77,
      lng: 128.95,
    });
  });

  it('rejects an already included place', () => {
    expect(createAddedStop({ ...places[0], id: 'market' }, courseStops)).toBeNull();
  });
});

describe('getMapStops', () => {
  it('adds a selected place only to the map preview without changing the course', () => {
    expect(getMapStops(courseStops, places[0])).toEqual([
      ...courseStops,
      expect.objectContaining({ id: 'coffee-beach', n: 3 }),
    ]);
    expect(courseStops).toHaveLength(2);
  });
});
