import { useQuery } from '@tanstack/react-query';
import { fetchCourse } from '../lib/courseApi';
import { fetchPlaces } from '../lib/placesApi';

export function usePlacesQuery() {
  return useQuery({
    queryKey: ['places'],
    queryFn: () => fetchPlaces(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCourseQuery(courseId: string) {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: () => fetchCourse(courseId),
    enabled: Boolean(courseId),
    staleTime: 30 * 1000,
  });
}

/**
 * Kept as a small compatibility wrapper for callers that used the old hook.
 * Course data is now always loaded from the persisted backend course id.
 */
export function useCourseStopsQuery(
  _places: unknown[],
  _picks: string[],
  _onePickId: string,
  courseId = '',
) {
  return useCourseQuery(courseId);
}
