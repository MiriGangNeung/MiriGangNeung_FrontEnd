import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchNearbyPlacesPage } from '../lib/courseApi';
import type { NearbyPlaceCategory, NearbyPlaceScope, NearbyPlaceSort } from '../types/domain';

export function useNearbyPlacesQuery(
  courseId: string,
  category: NearbyPlaceCategory,
  scope: NearbyPlaceScope = 'nearby',
  stopId?: string,
  enabled = true,
  sort: NearbyPlaceSort = 'recommended',
  keyword = '',
) {
  const query = useInfiniteQuery({
    queryKey: [
      'course-nearby-places',
      courseId,
      scope,
      category,
      scope === 'nearby' ? (stopId ?? 'all') : 'all',
      scope === 'nearby' ? sort : 'recommended',
      scope === 'all' ? keyword.trim() : '',
    ],
    queryFn: ({ pageParam }) =>
      fetchNearbyPlacesPage(
        courseId,
        category,
        {
          scope,
          stopId,
          sort,
          keyword,
          page: pageParam,
          size: 15,
        },
        undefined,
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.isEnd ? undefined : lastPage.page + 1),
    enabled: Boolean(courseId) && enabled && (scope === 'nearby' || Boolean(keyword.trim())),
    staleTime: 5 * 60 * 1000,
  });

  const places = query.data?.pages.flatMap((page) => page.places);
  const latestPage = query.data?.pages.at(-1);
  return {
    ...query,
    data: places,
    searchRadiusMeters: scope === 'nearby' ? (latestPage?.searchRadiusMeters ?? null) : null,
  };
}
