import { useQuery } from '@tanstack/react-query';
import { COURSE_STOPS } from '../data/places';
import { fetchAwardPhotos } from '../lib/awardPhotosApi';

export function usePlacesQuery() {
  return useQuery({
    queryKey: ['award-photos'],
    queryFn: () => fetchAwardPhotos(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCourseStopsQuery() {
  return useQuery({
    queryKey: ['course-stops'],
    queryFn: () => Promise.resolve(COURSE_STOPS),
    staleTime: Infinity,
  });
}
