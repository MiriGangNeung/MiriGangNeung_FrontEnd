import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useQuery } from '@tanstack/react-query';
import { fetchCourse } from '../lib/courseApi';
import { fetchPlaces } from '../lib/placesApi';
import { useCourseStopsQuery, usePlacesQuery } from './usePlacesQuery';

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

vi.mock('../lib/placesApi', () => ({
  fetchPlaces: vi.fn(),
}));

vi.mock('../lib/courseApi', () => ({
  fetchCourse: vi.fn(),
}));

describe('usePlacesQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useQuery).mockReturnValue({} as ReturnType<typeof useQuery>);
    vi.mocked(fetchPlaces).mockResolvedValue([]);
    vi.mocked(fetchCourse).mockResolvedValue({} as never);
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

  it('loads the generated course from the persisted backend course id', async () => {
    useCourseStopsQuery([], [], 'place-1', 'course-1');

    const options = vi.mocked(useQuery).mock.calls[0]?.[0] as {
      queryKey: unknown[];
      queryFn: () => Promise<unknown>;
      enabled: boolean;
    };

    expect(options.queryKey).toEqual(['course', 'course-1']);
    expect(options.enabled).toBe(true);
    await options.queryFn();
    expect(fetchCourse).toHaveBeenCalledWith('course-1');
  });

  it('does not call the backend before a course has been created', () => {
    useCourseStopsQuery([], [], '', '');

    const options = vi.mocked(useQuery).mock.calls[0]?.[0] as { enabled: boolean };

    expect(options.enabled).toBe(false);
  });
});
