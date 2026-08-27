import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  addExternalCourseStop,
  createCourse,
  fetchNearbyPlaces,
  fetchNearbyPlacesPage,
} from './courseApi';

describe('courseApi', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('creates a course through the backend and keeps the returned course id', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          courseId: 'course-1',
          title: '나만의 강릉 코스',
          duration: 'day',
          types: ['nature'],
          companion: 'solo',
          stops: [],
          totalDistanceMeters: 0,
          totalTravelMinutes: 0,
          routeStatus: 'READY',
          routeSegments: [],
        }),
        { status: 200 },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await createCourse(
      {
        placeIds: ['place-1'],
        onePickId: 'place-1',
        types: ['nature'],
        companion: 'solo',
        duration: 'day',
      },
      'http://localhost:8080/api/v1',
    );

    expect(result.courseId).toBe('course-1');
    expect(result.types).toEqual(['nature']);
    expect(result.companion).toBe('solo');
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8080/api/v1/courses',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('requests nearby places by category from the backend', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          category: 'cafe',
          places: [
            {
              externalPlaceId: 'kakao-1',
              name: '카페 예시',
              category: 'cafe',
              categoryName: '음식점 > 카페',
              address: '강릉시',
              roadAddress: '강릉시 창해로',
              phone: '',
              placeUrl: 'https://place.map.kakao.com/kakao-1',
              latitude: 37.77,
              longitude: 128.94,
              distanceMeters: 120,
            },
          ],
        }),
        { status: 200 },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchNearbyPlaces(
      'course-1',
      'cafe',
      'stop-1',
      'http://localhost:8080/api/v1',
    );

    expect(result[0]).toMatchObject({ externalPlaceId: 'kakao-1', category: 'cafe' });
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8080/api/v1/courses/course-1/nearby-places?scope=nearby&category=cafe&stopId=stop-1&page=0&size=15',
    );
  });

  it('requests distance sorting and maps recommendation details', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          category: 'cafe',
          places: [
            {
              externalPlaceId: 'kakao-1',
              name: '안목 바다 카페',
              category: 'cafe',
              categoryName: '음식점 > 카페',
              address: '강릉시',
              roadAddress: '강릉시 안목',
              phone: '',
              placeUrl: 'https://place.map.kakao.com/kakao-1',
              latitude: 37.77,
              longitude: 128.94,
              distanceMeters: 150,
              recommendationScore: 93,
              recommendationReasons: ['휴식 취향에 맞는 장소예요', '커플과 잘 어울리는 장소예요'],
            },
          ],
        }),
        { status: 200 },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchNearbyPlaces(
      'course-1',
      'cafe',
      undefined,
      'http://localhost:8080/api/v1',
      'distance',
    );

    expect(result[0]).toMatchObject({
      recommendationScore: 93,
      recommendationReasons: ['휴식 취향에 맞는 장소예요', '커플과 잘 어울리는 장소예요'],
    });
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8080/api/v1/courses/course-1/nearby-places?scope=nearby&category=cafe&sort=distance&page=0&size=15',
    );
  });

  it('requests a paginated Gangneung-wide category search without stop or distance sorting', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          scope: 'all',
          category: 'cafe',
          page: 1,
          size: 15,
          isEnd: false,
          places: [
            {
              externalPlaceId: 'kakao-all-1',
              name: '강릉 전체 카페',
              category: 'cafe',
              categoryName: '음식점 > 카페',
              address: '강릉시',
              roadAddress: '강릉시 안목',
              phone: '',
              placeUrl: 'https://place.map.kakao.com/kakao-all-1',
              latitude: 37.77,
              longitude: 128.94,
              distanceMeters: null,
            },
          ],
        }),
        { status: 200 },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchNearbyPlacesPage(
      'course-1',
      'cafe',
      {
        scope: 'all',
        stopId: 'ignored-stop',
        sort: 'distance',
        keyword: '  테라로사  ',
        page: 1,
        size: 15,
      },
      'http://localhost:8080/api/v1',
    );

    expect(result).toMatchObject({ scope: 'all', page: 1, isEnd: false });
    expect(result.places[0]).toMatchObject({
      externalPlaceId: 'kakao-all-1',
      distanceMeters: null,
    });
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8080/api/v1/courses/course-1/nearby-places?scope=all&category=cafe&keyword=%ED%85%8C%EB%9D%BC%EB%A1%9C%EC%82%AC&page=1&size=15',
    );
  });

  it('sends an external Kakao place snapshot when the user adds it', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          courseId: 'course-1',
          title: '코스',
          duration: 'day',
          stops: [],
          totalDistanceMeters: 123,
          totalTravelMinutes: 4,
          routeStatus: 'READY',
          routeSegments: [],
        }),
        { status: 200 },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    await addExternalCourseStop(
      'course-1',
      {
        externalPlaceId: 'kakao-1',
        name: '카페 예시',
        category: 'cafe',
        categoryName: '음식점 > 카페',
        address: '강릉시',
        roadAddress: '강릉시 창해로',
        phone: '',
        placeUrl: 'https://place.map.kakao.com/kakao-1',
        latitude: 37.77,
        longitude: 128.94,
        distanceMeters: 120,
      },
      'http://localhost:8080/api/v1',
    );

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8080/api/v1/courses/course-1/stops/external',
      expect.objectContaining({ method: 'POST' }),
    );
    const request = fetchMock.mock.calls[0]?.[1] as Parameters<typeof fetch>[1];
    expect(JSON.parse(String(request?.body))).toMatchObject({
      externalPlaceId: 'kakao-1',
      category: 'cafe',
    });
  });
});
