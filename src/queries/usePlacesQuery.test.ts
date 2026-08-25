import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useQuery } from '@tanstack/react-query';
import { buildMockCourseStops } from '../lib/courseMock';
import { fetchPlaces } from '../lib/placesApi';
import { useCourseStopsQuery, usePlacesQuery } from './usePlacesQuery';
import type { Place } from '../types/domain';

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

vi.mock('../lib/placesApi', () => ({
  fetchPlaces: vi.fn(),
}));

vi.mock('../lib/courseMock', () => ({
  buildMockCourseStops: vi.fn(),
}));

describe('usePlacesQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useQuery).mockReturnValue({} as ReturnType<typeof useQuery>);
    vi.mocked(fetchPlaces).mockResolvedValue([]);
    vi.mocked(buildMockCourseStops).mockReturnValue([]);
  });

  it('uses the KorService2 place list', async () => {
    usePlacesQuery();

    const options = vi.mocked(useQuery).mock.calls[0]?.[0] as {
      queryKey: string[];
      queryFn: () => Promise<unknown>;
    };

    expect(options.queryKey).toEqual(['places']);
    await options.queryFn();

    expect(fetchPlaces).toHaveBeenCalledOnce();
  });

  it('builds the mock course from selected place ids instead of static stops', async () => {
    const places = [
      {
        id: 'place-b',
        name: '장소 B',
        region: '강릉시',
        tags: ['자연'],
        cat: 'nature',
        lat: 37.8,
        lng: 128.9,
      },
    ] as Place[];
    const picks = ['place-b'];

    useCourseStopsQuery(places, picks, 'place-b');

    const options = vi.mocked(useQuery).mock.calls[0]?.[0] as {
      queryKey: unknown[];
      queryFn: () => Promise<unknown>;
      enabled: boolean;
    };

    expect(options.queryKey).toEqual(['course-stops', picks, 'place-b', ['place-b']]);
    expect(options.enabled).toBe(true);
    await options.queryFn();
    expect(buildMockCourseStops).toHaveBeenCalledWith(places, picks, 'place-b');
  });
});
