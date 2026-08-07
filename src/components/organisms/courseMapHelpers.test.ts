import { describe, expect, it } from 'vitest';

import { toCourseCoordinates, toRouteStops } from './courseMapHelpers';

describe('toCourseCoordinates', () => {
  it('preserves the input stop order when extracting coordinates', () => {
    expect(
      toCourseCoordinates([
        { lat: 37.9, lng: 128.8 },
        { lat: 37.8, lng: 128.9 },
      ] as never),
    ).toEqual([
      { lat: 37.9, lng: 128.8 },
      { lat: 37.8, lng: 128.9 },
    ]);
  });
});

describe('toRouteStops', () => {
  it('keeps each stop name and coordinates in course order for the walking route request', () => {
    expect(
      toRouteStops([
        { name: 'First', lat: 37.9, lng: 128.8 },
        { name: 'Second', lat: 37.8, lng: 128.9 },
      ] as never),
    ).toEqual([
      { name: 'First', lat: 37.9, lng: 128.8 },
      { name: 'Second', lat: 37.8, lng: 128.9 },
    ]);
  });
});
