import { useQuery } from '@tanstack/react-query';
import { COURSE_STOPS } from '../data/places';
import { fetchBackgroundPhotos } from '../lib/backgroundPhotosApi';

export function usePlacesQuery() {
  return useQuery({
    queryKey: ['background-photos'],
    queryFn: () => fetchBackgroundPhotos(),
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
