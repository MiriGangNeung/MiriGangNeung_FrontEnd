import { useQuery } from '@tanstack/react-query';
import { fetchNearbyPlaces } from '../lib/courseApi';
import type { NearbyPlaceCategory } from '../types/domain';

export function useNearbyPlacesQuery(
  courseId: string,
  category: NearbyPlaceCategory,
  enabled = true,
) {
  return useQuery({
    queryKey: ['course-nearby-places', courseId, category],
    queryFn: () => fetchNearbyPlaces(courseId, category),
    enabled: Boolean(courseId) && enabled,
    staleTime: 5 * 60 * 1000,
  });
}
