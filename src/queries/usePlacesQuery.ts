import { useQuery } from '@tanstack/react-query';
import { COURSE_STOPS, PLACES } from '../data/places';

/**
 * Static data today (Promise.resolve). Swapping in a real endpoint later is a
 * one-line change to queryFn — no loading/error UI added here since there is
 * no real latency or failure mode to represent yet.
 */
export function usePlacesQuery() {
  return useQuery({
    queryKey: ['places'],
    queryFn: () => Promise.resolve(PLACES),
    staleTime: Infinity,
  });
}

export function useCourseStopsQuery() {
  return useQuery({
    queryKey: ['course-stops'],
    queryFn: () => Promise.resolve(COURSE_STOPS),
    staleTime: Infinity,
  });
}
