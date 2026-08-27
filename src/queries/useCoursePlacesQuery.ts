import { useQuery } from '@tanstack/react-query';
import { fetchNearbyPlaces } from '../lib/courseApi';
import type { NearbyPlaceCategory, NearbyPlaceSort } from '../types/domain';

export function useNearbyPlacesQuery(
  courseId: string,
  category: NearbyPlaceCategory,
  stopId?: string,
  enabled = true,
  sort: NearbyPlaceSort = 'recommended',
) {
  return useQuery({
    queryKey: ['course-nearby-places', courseId, category, stopId ?? 'all', sort],
    queryFn: () => fetchNearbyPlaces(courseId, category, stopId, undefined, sort),
    enabled: Boolean(courseId) && enabled,
    staleTime: 5 * 60 * 1000,
  });
}
