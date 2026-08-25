import { useQuery } from '@tanstack/react-query';
import { buildMockCourseStops } from '../lib/courseMock';
import { fetchPlaces } from '../lib/placesApi';
import type { Place } from '../types/domain';

export function usePlacesQuery() {
  return useQuery({
    queryKey: ['places'],
    queryFn: () => fetchPlaces(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCourseStopsQuery(places: Place[], picks: string[], onePickId: string) {
  return useQuery({
    queryKey: ['course-stops', picks, onePickId, places.map((place) => place.id)],
    queryFn: () => Promise.resolve(buildMockCourseStops(places, picks, onePickId)),
    enabled: places.length > 0 && picks.length > 0,
    staleTime: Infinity,
  });
}
